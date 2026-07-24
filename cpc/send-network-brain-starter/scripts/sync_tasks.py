#!/usr/bin/env python3
"""Synchronize SendKC tasks inside the shared SendNetwork vault."""

import datetime
import json
import os
import random
import re


VAULT_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
WIKI_DIR = os.path.join(VAULT_DIR, "wiki")
PEOPLE_DIR = os.path.join(WIKI_DIR, "people")
TASK_INDEX_PATH = os.path.join(WIKI_DIR, "indexes", "Task Index.md")
TASKS_DIR = os.path.join(WIKI_DIR, "tasks")
CACHE_PATH = os.path.join(VAULT_DIR, "scripts", "sync_state.json")

SKIP_DIRS = {"indexes", "templates", "tasks"}
SKIP_ROOTS = {"skills", "raw", "context", "files"}

CHECKBOX_RE = re.compile(
    r"^(\s*-\s*\[([ xX])\]\s*)(?:([1-3])(?:\s+|\.\s+|\)\s+))?"
    r"(.*?)(?:\s+\^t-([a-zA-Z0-9_-]+))?\s*$"
)
OWNED_TASK_RE = re.compile(
    r"^(\s*-\s*\[([ xX])\]\s*)(?:([1-3])\s+)?"
    r"\[\[([^\]]+?)\]\]\s+about\s+\[\[([^\]]+?)\]\]\s*::\s*"
    r"(.*?)(?:\s+\^t-([a-zA-Z0-9_-]+))?\s*$"
)
DUE_DATE_RE = re.compile(r"\U0001F4C5\s*(\d{4}-\d{2}-\d{2})")
TEMPLATE_PLACEHOLDER_RE = re.compile(r"^\s*\[[^\]]*\]\s*(\^\S+\s*)*$")


def load_people_names():
    if not os.path.exists(PEOPLE_DIR):
        return set()
    return {name[:-3] for name in os.listdir(PEOPLE_DIR) if name.endswith(".md")}


def iter_source_files():
    for base in ["wiki"]:
        root_dir = os.path.join(VAULT_DIR, base)
        if not os.path.exists(root_dir):
            continue
        for root, dirs, files in os.walk(root_dir):
            dirs[:] = [d for d in dirs if d not in SKIP_DIRS]
            for filename in files:
                if filename.endswith(".md"):
                    yield os.path.join(root, filename), filename[:-3]
    for filename in os.listdir(VAULT_DIR):
        if filename.endswith(".md"):
            yield os.path.join(VAULT_DIR, filename), filename[:-3]


def strip_auto_generated_blocks(lines):
    cleaned = []
    in_block = False
    for line in lines:
        stripped = line.strip()
        if stripped.startswith("<!-- START"):
            in_block = True
            cleaned.append(line)
            continue
        if stripped.startswith("<!-- END"):
            in_block = False
            cleaned.append(line)
            continue
        cleaned.append("\n" if in_block else line)
    return cleaned


def generate_random_id(existing):
    task_id = f"{random.randint(0, 0xffff):04x}"
    while task_id in existing:
        task_id = f"{random.randint(0, 0xffff):04x}"
    return task_id


def parse_task_line(line):
    checkbox = CHECKBOX_RE.match(line)
    if not checkbox:
        return None
    owned = OWNED_TASK_RE.match(line)
    if not owned:
        _prefix, _status, _priority, text, _task_id = checkbox.groups()
        if TEMPLATE_PLACEHOLDER_RE.match(text.strip()):
            return None
        return {"malformed": True, "line": line.strip()}

    prefix, status, priority, owner, subject, description, task_id = owned.groups()
    owner = owner.split("|")[0].strip()
    subject = subject.split("|")[0].strip()
    description = description.strip()
    if TEMPLATE_PLACEHOLDER_RE.match(description):
        return None
    due = DUE_DATE_RE.search(description)
    return {
        "prefix": prefix,
        "status": status,
        "is_completed": status.lower() == "x",
        "priority": int(priority) if priority else None,
        "owner": owner,
        "subject": subject,
        "description": description,
        "task_id": task_id,
        "due": due.group(1) if due else "",
    }


def task_link(name):
    if name == "Lead Planter Catalyst":
        return "[[Lead Planter Catalyst]]"
    return f"[[{name}]]"


def render_task_line(task):
    status = "x" if task["is_completed"] else " "
    priority = f" {task['priority']}" if task.get("priority") else ""
    return f"- [{status}]{priority} {task_link(task['owner'])} about {task_link(task['subject'])} :: {task['description']} ^t-{task['id']}\n"


def reconstruct_task_line(task, status=None):
    status_char = status if status is not None else task["status"]
    prefix = re.sub(r"\[[ xX]\]", f"[{status_char}]", task["prefix"])
    priority = f" {task['priority']}" if task.get("priority") else ""
    return f"{prefix.rstrip()}{priority} {task_link(task['owner'])} about {task_link(task['subject'])} :: {task['description']} ^t-{task['id']}\n"


def scan_tasks(people_names):
    tasks = {}
    unmatched = []
    malformed = []
    duplicates = []
    for file_path, note_name in iter_source_files():
        parts = set(os.path.relpath(file_path, VAULT_DIR).split(os.sep))
        if parts & SKIP_ROOTS:
            continue
        with open(file_path, "r", encoding="utf-8") as f:
            lines = f.readlines()
        cleaned = strip_auto_generated_blocks(lines)
        new_lines = []
        modified = False
        for original, cleaned_line in zip(lines, cleaned):
            if cleaned_line == "\n" and original.strip():
                new_lines.append(original)
                continue
            parsed = parse_task_line(original)
            if parsed and parsed.get("malformed"):
                malformed.append((note_name, parsed["line"]))
                new_lines.append(original)
                continue
            if parsed:
                task_id = parsed["task_id"]
                if not task_id or task_id.lower() in {"xxxx", "slugnum", "slug"} or task_id.startswith("["):
                    task_id = generate_random_id(tasks)
                    parsed["task_id"] = task_id
                    parsed["id"] = task_id
                    original = reconstruct_task_line(parsed)
                    modified = True
                    print(f"Generated task ID {task_id} for '{parsed['description']}' in {note_name}.md")
                if parsed["owner"] not in people_names:
                    unmatched.append((note_name, parsed["description"], parsed["owner"]))
                if task_id in tasks:
                    duplicates.append((task_id, tasks[task_id]["note_name"], note_name))
                    new_lines.append(original)
                    continue
                parsed["id"] = task_id
                parsed["file_path"] = file_path
                parsed["note_name"] = note_name
                tasks[task_id] = parsed
            new_lines.append(original)
        if modified:
            with open(file_path, "w", encoding="utf-8") as f:
                f.writelines(new_lines)
    return tasks, unmatched, malformed, duplicates


def parse_generated_states(path):
    if not os.path.exists(path):
        return {}
    with open(path, "r", encoding="utf-8") as f:
        lines = f.readlines()
    states = {}
    in_block = False
    for line in lines:
        stripped = line.strip()
        if stripped.startswith("<!-- START"):
            in_block = True
            continue
        if stripped.startswith("<!-- END"):
            in_block = False
            continue
        if in_block:
            match = CHECKBOX_RE.match(line)
            if match:
                _prefix, status, _priority, _text, task_id = match.groups()
                if task_id:
                    states[task_id] = status.lower() == "x"
    return states


def collect_rollup_states(people_names):
    states = {}
    for owner in people_names:
        path = os.path.join(PEOPLE_DIR, f"{owner}.md")
        states.update(parse_generated_states(path))
    return states


def load_cache():
    if not os.path.exists(CACHE_PATH):
        return {}
    try:
        with open(CACHE_PATH, "r", encoding="utf-8") as f:
            return json.load(f)
    except Exception:
        return {}


def save_cache(cache):
    with open(CACHE_PATH, "w", encoding="utf-8") as f:
        json.dump(cache, f, indent=2, sort_keys=True)


def reconcile_statuses(tasks, index_states, cache, rollup_states):
    updates = {}
    new_cache = {}
    for task_id, task in tasks.items():
        source_val = task["is_completed"]
        index_val = index_states.get(task_id)
        cached_val = cache.get(task_id)
        rollup_val = rollup_states.get(task_id)
        if index_val is None:
            final_val = source_val
        elif cached_val is None:
            final_val = source_val or index_val or (rollup_val if rollup_val is not None else False)
        else:
            source_changed = source_val != cached_val
            index_changed = index_val != cached_val
            rollup_changed = rollup_val != cached_val if rollup_val is not None else False
            if index_changed and not source_changed and not rollup_changed:
                final_val = index_val
            elif source_changed and not index_changed and not rollup_changed:
                final_val = source_val
            elif rollup_changed and not index_changed and not source_changed:
                final_val = rollup_val
            elif index_changed or source_changed or rollup_changed:
                vals = [v for v in [index_val, source_val, rollup_val] if v is not None]
                final_val = True if True in vals else index_val
            else:
                final_val = index_val
        task["is_completed"] = final_val
        new_cache[task_id] = final_val
        if final_val != source_val:
            updates[task_id] = final_val
    return updates, new_cache


def sync_statuses_to_sources(tasks, updates):
    updates_by_file = {}
    for task_id, final_state in updates.items():
        task = tasks.get(task_id)
        if task:
            updates_by_file.setdefault(task["file_path"], []).append((task_id, final_state, task))
    for file_path, file_updates in updates_by_file.items():
        with open(file_path, "r", encoding="utf-8") as f:
            lines = f.readlines()
        new_lines = []
        modified = False
        for line in lines:
            match = CHECKBOX_RE.match(line)
            if match:
                _prefix, _status, _priority, _text, line_task_id = match.groups()
                for task_id, final_state, task in file_updates:
                    if line_task_id == task_id:
                        line = reconstruct_task_line(task, "x" if final_state else " ")
                        modified = True
                        state = "Completed" if final_state else "Reopened"
                        print(f"Synced status: {state} '{task['description']}' in {task['note_name']}.md")
                        break
            new_lines.append(line)
        if modified:
            with open(file_path, "w", encoding="utf-8") as f:
                f.writelines(new_lines)


def task_sort_key(task):
    return (
        task.get("due") or "9999-12-31",
        task["priority"] if task.get("priority") is not None else 4,
        task.get("subject", "").lower(),
        task.get("description", "").lower(),
    )


def insert_tasks_section(content, task_lines):
    start_marker = "<!-- START TASKS -->"
    end_marker = "<!-- END TASKS -->"
    start_idx = content.find(start_marker)
    end_idx = content.find(end_marker)
    tasks_content = "\n" + "".join(task_lines)
    if start_idx != -1 and end_idx != -1 and start_idx < end_idx:
        return content[: start_idx + len(start_marker)] + tasks_content + content[end_idx:]
    section = f"## Tasks\n{start_marker}{tasks_content}{end_marker}\n"
    h1 = re.search(r"^# .+$", content, flags=re.M)
    if h1:
        return content[: h1.end()] + "\n\n" + section + content[h1.end():]
    return content + "\n\n" + section


def update_owner_rollups(tasks, people_names):
    by_owner = {}
    for task in tasks.values():
        if task["is_completed"]:
            continue
        by_owner.setdefault(task["owner"], []).append(task)
    updated = []
    for owner in sorted(people_names):
        path = os.path.join(PEOPLE_DIR, f"{owner}.md")
        if not os.path.exists(path):
            continue
        lines = [render_task_line(t) for t in sorted(by_owner.get(owner, []), key=task_sort_key)]
        with open(path, "r", encoding="utf-8") as f:
            content = f.read()
        new_content = insert_tasks_section(content, lines)
        if new_content != content:
            with open(path, "w", encoding="utf-8") as f:
                f.write(new_content)
            updated.append(owner)
    return updated


def ensure_task_index():
    if os.path.exists(TASK_INDEX_PATH):
        return
    os.makedirs(os.path.dirname(TASK_INDEX_PATH), exist_ok=True)
    content = """---
context: send_network
type: task_index
status: active
---

# Task Index

> [!NOTE] About this Index
> This index is automatically compiled from tasks defined across the SendNetwork vault.
>
> **How to sync:** Run `python3 scripts/sync_tasks.py` from the SendNetwork vault.

---

<!-- START_SYNCED_TASKS -->
<!-- END_SYNCED_TASKS -->
"""
    with open(TASK_INDEX_PATH, "w", encoding="utf-8") as f:
        f.write(content)


def update_task_index(tasks):
    ensure_task_index()
    with open(TASK_INDEX_PATH, "r", encoding="utf-8") as f:
        content = f.read()
    start_marker = "<!-- START_SYNCED_TASKS -->"
    end_marker = "<!-- END_SYNCED_TASKS -->"
    start_idx = content.find(start_marker)
    end_idx = content.find(end_marker)
    if start_idx == -1 or end_idx == -1 or start_idx >= end_idx:
        raise RuntimeError("Task Index markers missing or invalid.")
    by_owner = {}
    for task in tasks.values():
        if not task["is_completed"]:
            by_owner.setdefault(task["owner"], []).append(task)
    section = ["\n"]
    for owner in sorted(by_owner, key=lambda value: value.lower()):
        section.append(f"### {task_link(owner)}\n\n")
        for task in sorted(by_owner[owner], key=task_sort_key):
            section.append(render_task_line(task))
        section.append("\n")
    updated = content[: start_idx + len(start_marker)] + "".join(section) + content[end_idx:]
    with open(TASK_INDEX_PATH, "w", encoding="utf-8") as f:
        f.write(updated)


def main():
    print("Starting SendNetwork task synchronization...")
    people_names = load_people_names()
    tasks, unmatched, malformed, duplicates = scan_tasks(people_names)
    index_states = parse_generated_states(TASK_INDEX_PATH)
    cache = load_cache()
    rollup_states = collect_rollup_states(people_names)
    updates, new_cache = reconcile_statuses(tasks, index_states, cache, rollup_states)
    if updates:
        sync_statuses_to_sources(tasks, updates)
    owner_rollups = update_owner_rollups(tasks, people_names)
    update_task_index(tasks)
    save_cache(new_cache)

    flagged = []
    for note_name, description, owner in unmatched:
        flagged.append(f"Unmatched owner: {owner} in {note_name} ({description})")
    for note_name, line in malformed:
        flagged.append(f"Malformed checkbox in {note_name}: {line}")
    for task_id, first_note, duplicate_note in duplicates:
        flagged.append(f"Duplicate task ID ^t-{task_id} in {first_note} and {duplicate_note}")
    active_count = sum(1 for task in tasks.values() if not task["is_completed"])

    print()
    print("=" * 40)
    print(f"**SendNetwork Task Sync Complete: {datetime.date.today().isoformat()}**\n")
    print(f"- **Tasks scanned:** {len(tasks)} canonical SendNetwork tasks.")
    print(f"- **Owners resolved:** {len(tasks) - len(unmatched)} matched to SendNetwork person notes.")
    print("- **Unassigned / unmatched / malformed (flagged):**")
    if flagged:
        for item in flagged:
            print(f"  - {item}")
    else:
        print("  - none")
    print(f"- **Owner roll-ups updated:** {', '.join(owner_rollups) if owner_rollups else 'none'}")
    print(f"- **Task Index:** {active_count} active tasks written to [[Task Index]].")
    print("=" * 40)
    print("\nSendNetwork task sync complete.")


if __name__ == "__main__":
    main()
