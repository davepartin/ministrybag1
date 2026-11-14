#!/usr/bin/env python3
"""Execute the workflow's actual Python with a synthetic CLI and credentials."""
import ast
import contextlib
import io
import json
import os
from pathlib import Path
import stat
import subprocess
import tempfile
import textwrap
from types import SimpleNamespace
import unittest
from unittest.mock import patch

WORKFLOW = Path(__file__).resolve().parents[2] / '.github/workflows/firebase-hosting-pr-cleanup.yml'
SOURCE = WORKFLOW.read_text()
PYTHON = textwrap.dedent(SOURCE.split("python3 - <<'EOF'\n", 1)[1].rsplit('\n          EOF', 1)[0])
CODE = compile(ast.parse(PYTHON), str(WORKFLOW), 'exec')
SITE = 'growing-together-discipleship'


def payload(*ids):
    return {'status': 'success', 'result': {'channels': [
        {'name': f'sites/{SITE}/channels/{cid}'} for cid in ids
    ]}}


class CleanupTests(unittest.TestCase):
    def run_workflow(self, response=None, list_code=0, delete_code=0, invalid_pr=None,
                     secret='{"synthetic":true}', timeout_at=None):
        commands, deleted = [], []
        with tempfile.TemporaryDirectory() as directory:
            env = dict(PR_NUMBER=invalid_pr if invalid_pr is not None else '224',
                       FIREBASE_SA=secret, PROJECT_ID=SITE, SITE_ID=SITE, RUNNER_TEMP=directory)

            def fake_cli(command, **kwargs):
                commands.append(command)
                self.assertEqual(command[:3], ['npx', '--yes', 'firebase-tools@15.36.0'])
                self.assertEqual(command[command.index('--site') + 1], SITE)
                self.assertEqual(command[command.index('--project') + 1], SITE)
                child_env = kwargs['env']
                self.assertNotIn('FIREBASE_SA', child_env)
                credential = Path(child_env['GOOGLE_APPLICATION_CREDENTIALS'])
                self.assertEqual(credential.parent, Path(directory))
                self.assertEqual(stat.S_IMODE(credential.stat().st_mode), 0o600)
                self.assertEqual(json.loads(credential.read_text()), {'synthetic': True})
                listing = 'hosting:channel:list' in command
                self.assertEqual(kwargs['timeout'], 180 if listing else 90)
                if timeout_at == ('list' if listing else 'delete'):
                    raise subprocess.TimeoutExpired(command, kwargs['timeout'])
                if listing:
                    return SimpleNamespace(returncode=list_code,
                                           stdout=json.dumps(response), stderr='synthetic failure' if list_code else '')
                self.assertIn('--force', command)
                deleted.append(command[command.index('hosting:channel:delete') + 1])
                return SimpleNamespace(returncode=delete_code)

            result = 0
            with patch.dict(os.environ, env, clear=True), patch('subprocess.run', fake_cli), \
                    contextlib.redirect_stdout(io.StringIO()), contextlib.redirect_stderr(io.StringIO()):
                try:
                    exec(CODE, {})
                except SystemExit as error:
                    result = error.code
                except (ValueError, subprocess.TimeoutExpired):
                    result = 'expected failure'
            self.assertEqual(list(Path(directory).iterdir()), [], 'Temporary credential must be removed')
        return result, deleted, commands

    def test_exact_pr_only_never_live_or_other_pr(self):
        code, ids, commands = self.run_workflow(payload('live', 'pr224-a', 'pr224-z', 'pr2240-other', 'pr223-other'))
        self.assertEqual((code, ids), (0, ['pr224-a', 'pr224-z']))
        self.assertEqual(len(commands), 3)

    def test_empty_list_is_success(self):
        code, ids, commands = self.run_workflow(payload())
        self.assertEqual((code, ids, len(commands)), (0, [], 1))

    def test_no_matching_channels_is_success(self):
        code, ids, _ = self.run_workflow(payload('live', 'pr223-other', 'pr2240-other'))
        self.assertEqual((code, ids), (0, []))

    def test_duplicate_names_deleted_once(self):
        code, ids, _ = self.run_workflow(payload('pr224-a', 'pr224-a'))
        self.assertEqual((code, ids), (0, ['pr224-a']))

    def test_missing_channels_fails_closed(self):
        code, ids, _ = self.run_workflow({'status': 'success', 'result': {}})
        self.assertNotEqual(code, 0)
        self.assertEqual(ids, [])

    def test_invalid_channel_list_type_fails(self):
        code, ids, _ = self.run_workflow({'status': 'success', 'result': {'channels': {}}})
        self.assertNotEqual(code, 0)
        self.assertEqual(ids, [])

    def test_error_payload_fails(self):
        code, ids, _ = self.run_workflow({'status': 'error', 'result': {'channels': []}})
        self.assertNotEqual(code, 0)
        self.assertEqual(ids, [])

    def test_all_names_validated_before_any_delete(self):
        data = payload('pr224-a')
        data['result']['channels'].append({'name': 'sites/another-site/channels/pr224-other'})
        code, ids, _ = self.run_workflow(data)
        self.assertNotEqual(code, 0)
        self.assertEqual(ids, [])

    def test_malformed_record_fails(self):
        data = payload()
        data['result']['channels'] = [None]
        code, ids, _ = self.run_workflow(data)
        self.assertNotEqual(code, 0)
        self.assertEqual(ids, [])

    def test_empty_channel_id_fails(self):
        code, ids, _ = self.run_workflow(payload(''))
        self.assertNotEqual(code, 0)
        self.assertEqual(ids, [])

    def test_invalid_pr_never_starts_cli(self):
        code, ids, commands = self.run_workflow(payload(), invalid_pr='224; false')
        self.assertNotEqual(code, 0)
        self.assertEqual((ids, commands), ([], []))

    def test_missing_credential_never_starts_cli(self):
        code, ids, commands = self.run_workflow(payload(), secret='')
        self.assertNotEqual(code, 0)
        self.assertEqual((ids, commands), ([], []))

    def test_list_failure_removes_credential(self):
        code, ids, _ = self.run_workflow(payload('pr224-a'), list_code=7)
        self.assertEqual((code, ids), (7, []))

    def test_delete_failure_removes_credential(self):
        code, ids, _ = self.run_workflow(payload('pr224-a'), delete_code=9)
        self.assertEqual((code, ids), (9, ['pr224-a']))

    def test_list_timeout_removes_credential(self):
        code, ids, _ = self.run_workflow(payload('pr224-a'), timeout_at='list')
        self.assertNotEqual(code, 0)
        self.assertEqual(ids, [])

    def test_delete_timeout_removes_credential(self):
        code, _, _ = self.run_workflow(payload('pr224-a'), timeout_at='delete')
        self.assertNotEqual(code, 0)

    def test_workflow_guards(self):
        self.assertIn('types: [closed]', SOURCE)
        self.assertIn('github.event.pull_request.head.repo.full_name == github.repository', SOURCE)
        self.assertIn('contents: read', SOURCE)
        self.assertIn('timeout-minutes: 10', SOURCE)
        self.assertIn('cancel-in-progress: false', SOURCE)
        self.assertNotIn('firebase-tools@latest', SOURCE)
        self.assertNotIn('pull_request_target', SOURCE)


if __name__ == '__main__':
    unittest.main(verbosity=2)
