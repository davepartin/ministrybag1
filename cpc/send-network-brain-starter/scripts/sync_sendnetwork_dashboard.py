#!/usr/bin/env python3
"""Refresh shared SendNetwork dashboard data and generated indexes."""

import os
import subprocess
import sys


SCRIPTS_DIR = os.path.dirname(os.path.abspath(__file__))
VAULT_DIR = os.path.dirname(SCRIPTS_DIR)

SYNC_SCRIPTS = [
    "sync_tasks.py",
    "sync_send_network.py",
]


def run_script(script_name):
    script_path = os.path.join(SCRIPTS_DIR, script_name)
    if not os.path.exists(script_path):
        print(f"Skipped missing script: {script_name}")
        return
    print(f"Running {script_name}...")
    subprocess.run([sys.executable, script_path], cwd=VAULT_DIR, check=True)


def main():
    for script_name in SYNC_SCRIPTS:
        run_script(script_name)
    print("SendNetwork dashboard refresh complete.")


if __name__ == "__main__":
    main()
