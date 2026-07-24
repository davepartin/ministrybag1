#!/usr/bin/env python3
"""Refresh SendKC indexes from the shared SendNetwork vault."""

import os
import re
import sys
from collections import defaultdict


VAULT_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
PEOPLE_DIR = os.path.join(VAULT_DIR, "wiki", "people")
CHURCHES_DIR = os.path.join(VAULT_DIR, "wiki", "churches")
EVENTS_DIR = os.path.join(VAULT_DIR, "wiki", "events")
ORGANIZATION_DIR = os.path.join(VAULT_DIR, "wiki", "organization")
INDEXES_DIR = os.path.join(VAULT_DIR, "wiki", "indexes")

PEOPLE_INDEX_PATH = os.path.join(INDEXES_DIR, "Send Network People Index.md")
PIPELINE_INDEX_PATH = os.path.join(INDEXES_DIR, "Send Network Pipeline Index.md")
GROUPS_INDEX_PATH = os.path.join(INDEXES_DIR, "Send Network Groups Index.md")
EVENTS_INDEX_PATH = os.path.join(INDEXES_DIR, "Send Network Events Index.md")
CHURCHES_INDEX_PATH = os.path.join(INDEXES_DIR, "Send Network Churches Index.md")
PASTORS_INDEX_PATH = os.path.join(INDEXES_DIR, "Send Network Pastors Index.md")
PLANTER_DASHBOARD_PATH = os.path.join(ORGANIZATION_DIR, "SendKC Church Planting.md")

PATHWAY_MEMBERS_START = "<!-- START_SYNCED_PATHWAY_MEMBERS -->"
PATHWAY_MEMBERS_END = "<!-- END_SYNCED_PATHWAY_MEMBERS -->"
PLANTER_LUNCH_ROSTER_START = "<!-- START_PLANTER_LUNCH_ROSTER -->"
PLANTER_LUNCH_ROSTER_END = "<!-- END_PLANTER_LUNCH_ROSTER -->"
PLANTER_LUNCH_EVENT = "Planter Lunch"
PLANTER_LUNCH_PLAYBOOK = os.path.join(EVENTS_DIR, "Planter Lunch.md")

PATHWAY_ORDER = ["potential", "candidate", "funded", "aged-out"]
PATHWAY_LABELS = {
    "potential": "Potential",
    "candidate": "Candidate",
    "funded": "Funded",
    "aged-out": "Aged-Out",
}
PATHWAY_GROUP_FILES = {
    "potential": ["Potential Planters.md"],
    "candidate": ["Candidate Planters.md"],
    "funded": ["Funded Church Planters.md", "Church Planters.md"],
    "aged-out": ["Aged-Out Planters.md"],
}
MOBILIZATION_ORDER = ["5 - Movement", "4 - Multiplying", "3 - Sending", "2 - Supporting", "1 - Cooperating", ""]
INVOLVEMENT_ORDER = ["high", "medium", "low", "none", ""]


def iter_markdown_files(folder):
    if not os.path.exists(folder):
        return
    for filename in os.listdir(folder):
        if filename.endswith(".md"):
            yield os.path.join(folder, filename), filename


def clean_scalar(value):
    value = str(value or "").strip().strip('"').strip("'")
    if value.startswith("[[") and value.endswith("]]"):
        value = value[2:-2]
    if "|" in value:
        value = value.split("|", 1)[0].strip()
    return value


def as_list(value):
    if value is None or value == "":
        return []
    if isinstance(value, list):
        return [str(v).strip() for v in value if str(v).strip()]
    return [str(value).strip()]


def parse_frontmatter(file_path):
    data = {}
    try:
        with open(file_path, "r", encoding="utf-8") as f:
            content = f.read()
    except Exception as e:
        print(f"Error reading {file_path}: {e}")
        return data

    if not content.startswith("---"):
        return data
    end_fm = content.find("---", 3)
    if end_fm == -1:
        return data

    current_key = None
    for raw_line in content[3:end_fm].splitlines():
        stripped = raw_line.strip()
        if not stripped or stripped.startswith("#"):
            continue
        if stripped.startswith("- ") and current_key:
            val = clean_scalar(stripped[2:])
            existing = data.get(current_key)
            if existing is None or existing == "":
                data[current_key] = [val]
            elif isinstance(existing, list):
                existing.append(val)
            else:
                data[current_key] = [existing, val]
            continue
        if ":" in raw_line:
            key, val = raw_line.split(":", 1)
            current_key = key.strip()
            val = val.strip()
            if not val:
                data[current_key] = []
            elif val.startswith("[") and val.endswith("]"):
                data[current_key] = [clean_scalar(item) for item in val[1:-1].split(",") if item.strip()]
            else:
                data[current_key] = clean_scalar(val)
    return data


def esc(value):
    return str(value if value not in (None, "") else "-").replace("|", "\\|")


def link_for(filename_no_ext, display_name=None):
    display_name = display_name or filename_no_ext
    if display_name != filename_no_ext:
        return f"[[{filename_no_ext}|{display_name}]]"
    return f"[[{display_name}]]"


def display_name(value):
    value = clean_scalar(value)
    if value == "Lead Planter Catalyst":
        return "Lead Planter Catalyst"
    return value


def wiki_link(value):
    value = clean_scalar(value)
    if value == "Lead Planter Catalyst":
        return "[[Lead Planter Catalyst]]"
    return f"[[{value}]]" if value else "-"


def normalize_pathway(value):
    value = str(value or "").strip().lower().replace("_", "-").replace(" ", "-")
    aliases = {
        "planter": "funded",
        "church-planter": "funded",
        "funded-church-planter": "funded",
        "funded-planter": "funded",
        "planter-candidate": "candidate",
        "in-process": "candidate",
        "assessing": "candidate",
        "assessed": "candidate",
        "assessment": "candidate",
        "further-development": "candidate",
        "pending-endorsement": "candidate",
        "agedout": "aged-out",
    }
    return aliases.get(value, value if value in PATHWAY_ORDER else "")


def infer_pathway(fm, person_type="", fm_type=""):
    explicit = normalize_pathway(fm.get("planter_pathway", ""))
    if explicit:
        return explicit, "canonical"
    legacy = normalize_pathway(fm.get("legacy_planter_pathway", "") or fm.get("pipeline_stage", ""))
    if legacy:
        return legacy, "legacy"
    raw_roles = as_list(fm.get("roles"))
    roles = [normalize_pathway(r) for r in raw_roles]
    if "candidate" in roles:
        return "candidate", "inferred"
    if "funded" in roles:
        return "funded", "inferred"
    planter_record = person_type == "planter" or fm_type in {"planter", "external-planter"} or any(clean_scalar(role).lower() == "planter" for role in raw_roles)
    if planter_record and str(fm.get("church", "")).strip():
        return "funded", "inferred"
    return "", ""


def format_roles(fm):
    roles = as_list(fm.get("roles"))
    staff_role = str(fm.get("staff_role") or "").strip()
    role = str(fm.get("role") or "").strip()
    if staff_role:
        roles.insert(0, staff_role)
    if role:
        roles.insert(0, role)
    if not roles:
        return "-"
    return " / ".join(str(r).replace("_", " ").replace("-", " ").title() for r in roles)


def format_groups(fm):
    groups = as_list(fm.get("groups"))
    if not groups:
        return "-"
    links = []
    for group in groups:
        group = clean_scalar(group)
        links.append(f"[[{group}]]")
    return ", ".join(links)


def format_events(fm):
    events = as_list(fm.get("events"))
    if not events:
        return "-"
    links = []
    for event in events:
        event = clean_scalar(event)
        links.append(f"[[{event}]]")
    return ", ".join(links)


def format_simple_list(values):
    items = as_list(values)
    if not items:
        return "-"
    return ", ".join(str(item).replace("_", " ").replace("-", " ").title() for item in items)


def person_has_event(fm, event_name):
    for event in as_list(fm.get("events")):
        if clean_scalar(event) == event_name:
            return True
    return False


def load_people():
    people = []
    for file_path, filename in iter_markdown_files(PEOPLE_DIR):
        fm = parse_frontmatter(file_path)
        person_types = [str(t).lower().replace(" ", "_").replace("-", "_") for t in as_list(fm.get("person_types"))]
        person_type = str(fm.get("person_type") or "").lower()
        if not person_type and person_types:
            person_type = person_types[0]
        fm_type = str(fm.get("type") or "").lower()
        if (
            person_type not in {"planter", "pastor", "staff", "association_leader", "partner"}
            and not set(person_types).intersection({"planter", "pastor", "staff", "association_leader", "partner"})
            and fm_type not in {"person", "planter", "external-planter", "pastor"}
        ):
            continue
        filename_no_ext = filename[:-3]
        name = clean_scalar(fm.get("name") or fm.get("planter") or filename_no_ext)
        pathway, pathway_source = infer_pathway(fm, person_type, fm_type)
        is_planter = person_type == "planter" or "planter" in person_types or fm_type in {"planter", "external-planter"} or bool(pathway)
        people.append({
            "name": name,
            "filename": filename_no_ext,
            "link": link_for(filename_no_ext, name),
            "person_type": person_type or fm_type,
            "person_types": person_types,
            "person_types_label": format_simple_list(person_types),
            "affiliations": format_simple_list(fm.get("affiliations")),
            "pathway": pathway,
            "pathway_label": PATHWAY_LABELS.get(pathway, "-"),
            "pathway_source": pathway_source,
            "is_planter": is_planter,
            "roles": format_roles(fm),
            "groups": format_groups(fm),
            "events": format_events(fm),
            "church": fm.get("church") or fm.get("plant") or "-",
            "sending_church": clean_scalar(fm.get("sending_church") or ""),
            "field_staff": clean_scalar(fm.get("field_staff") or fm.get("cpc") or "-"),
            "health_status": fm.get("health_status") or "-",
            "care_end": fm.get("care_end") or fm.get("funding_end") or "-",
            "staff_role": fm.get("staff_role") or "-",
            "job_title": fm.get("job_title") or "-",
            "pastor_church": clean_scalar(fm.get("church") or ""),
            "involvement_level": str(fm.get("involvement_level") or "").strip().lower(),
            "phone": fm.get("phone") or "-",
            "email": fm.get("email") or "-",
            "association": fm.get("association") or "-",
        })
    people.sort(key=lambda p: p["name"].lower())
    return people


def load_groups():
    groups = []
    for file_path, filename in iter_markdown_files(ORGANIZATION_DIR):
        fm = parse_frontmatter(file_path)
        if str(fm.get("type", "")).lower() != "group":
            continue
        name = filename[:-3]
        groups.append({
            "name": name,
            "leader": clean_scalar(fm.get("leader") or "-"),
            "status": fm.get("status") or "active",
            "member_count": fm.get("member_count") or "-",
            "rhythm": fm.get("rhythm") or "-",
            "planter_pathway": normalize_pathway(fm.get("planter_pathway", "")) or "-",
        })
    groups.sort(key=lambda g: g["name"].lower())
    return groups


def load_events():
    events = []
    for file_path, filename in iter_markdown_files(EVENTS_DIR):
        fm = parse_frontmatter(file_path)
        if str(fm.get("type", "")).lower() != "playbook":
            continue
        if str(fm.get("status", "active")).lower() != "active":
            continue
        name = filename[:-3]
        owners = as_list(fm.get("owned_by_groups")) or ["Uncategorized"]
        for owner in owners:
            events.append({
                "name": name,
                "owner": clean_scalar(owner) or "Uncategorized",
                "rhythm": fm.get("rhythm") or "-",
                "cadence": fm.get("cadence") or "-",
                "purpose": fm.get("purpose") or "-",
                "current_instance": clean_scalar(fm.get("current_instance") or "-"),
            })
    events.sort(key=lambda e: (e["owner"].lower(), e["name"].lower()))
    return events


def normalize_mobilization(value):
    value = str(value or "").strip()
    if not value:
        return ""
    digit = re.match(r"^([1-5])", value)
    if digit:
        for level in MOBILIZATION_ORDER:
            if level.startswith(digit.group(1)):
                return level
    lowered = value.lower()
    for level in MOBILIZATION_ORDER:
        if level and lowered in level.lower():
            return level
    return value


def load_churches():
    churches = []
    for file_path, filename in iter_markdown_files(CHURCHES_DIR):
        fm = parse_frontmatter(file_path)
        if str(fm.get("type", "")).lower() != "church":
            continue
        pastors = [clean_scalar(v) for v in as_list(fm.get("pastors"))]
        if not pastors:
            pastors = [clean_scalar(v) for v in as_list(fm.get("pastor"))]
        pastors = [p for p in pastors if p]
        churches.append({
            "name": filename[:-3],
            "pastor": pastors[0] if pastors else "",
            "pastors": pastors,
            "address": fm.get("address") or "-",
            "phone": fm.get("phone") or "-",
            "sbc_id": fm.get("sbc_id") or "-",
            "association": fm.get("association") or "-",
            "mobilization_level": normalize_mobilization(fm.get("mobilization_level")),
            "church_type": str(fm.get("church_type") or "-").replace("_", " "),
            "planters_sent": [clean_scalar(v) for v in as_list(fm.get("planters_sent"))],
            "status": fm.get("status") or "active",
        })
    churches.sort(key=lambda c: c["name"].lower())
    return churches


def write_file(path, lines):
    os.makedirs(os.path.dirname(path), exist_ok=True)
    with open(path, "w", encoding="utf-8") as f:
        f.write("\n".join(lines).rstrip() + "\n")


def update_frontmatter_scalar(content, key, value):
    if not content.startswith("---\n"):
        return content
    end_fm = content.find("\n---", 4)
    if end_fm == -1:
        return content
    frontmatter = content[4:end_fm]
    rendered = f"{key}: {value}"
    if re.search(rf"(?m)^{re.escape(key)}:.*$", frontmatter):
        frontmatter = re.sub(rf"(?m)^{re.escape(key)}:.*$", rendered, frontmatter)
    else:
        frontmatter = frontmatter.rstrip() + "\n" + rendered
    return f"---\n{frontmatter}\n---{content[end_fm + 4:]}"


def update_pathway_group_members(planters):
    by_pathway = defaultdict(list)
    for person in planters:
        by_pathway[person["pathway"]].append(person)

    for pathway, filenames in PATHWAY_GROUP_FILES.items():
        rows = sorted(by_pathway[pathway], key=lambda p: p["name"].lower())
        table = [
            "| Planter | Church / Plant | Field Staff |",
            "| :--- | :--- | :--- |",
        ]
        if rows:
            for person in rows:
                table.append(f"| {person['link']} | {esc(person['church'])} | {esc(display_name(person['field_staff']))} |")
        else:
            table.append("| - | - | - |")
        replacement = PATHWAY_MEMBERS_START + "\n" + "\n".join(table) + "\n" + PATHWAY_MEMBERS_END

        for filename in filenames:
            path = os.path.join(ORGANIZATION_DIR, filename)
            if not os.path.exists(path):
                continue
            with open(path, "r", encoding="utf-8") as f:
                content = f.read()
            pattern = re.escape(PATHWAY_MEMBERS_START) + r".*?" + re.escape(PATHWAY_MEMBERS_END)
            if not re.search(pattern, content, flags=re.DOTALL):
                print(f"Warning: missing pathway member markers in {path}")
                continue
            content = re.sub(pattern, replacement, content, flags=re.DOTALL)
            content = update_frontmatter_scalar(content, "member_count", len(rows))
            with open(path, "w", encoding="utf-8") as f:
                f.write(content)


def consistency_warnings(churches, people, pastors, planter_sending):
    warnings = []
    people_by_name = {}
    for person in people:
        people_by_name[person["name"]] = person
        people_by_name[person["filename"]] = person
    pastors_by_name = {}
    for pastor in pastors:
        pastors_by_name[pastor["name"]] = pastor
        pastors_by_name[pastor["filename"]] = pastor
    churches_by_name = {c["name"]: c for c in churches}
    for church in churches:
        for pastor_name in church["pastors"]:
            person = people_by_name.get(pastor_name)
            if person is None:
                warnings.append(f"[[{church['name']}]] lists pastor [[{pastor_name}]], but no person note with that title exists.")
                continue
            pastor = pastors_by_name.get(pastor_name)
            if pastor and pastor["pastor_church"] and pastor["pastor_church"] != church["name"]:
                warnings.append(f"[[{church['name']}]] lists pastor [[{pastor_name}]], but [[{pastor_name}]].church points to [[{pastor['pastor_church']}]].")
        for planter in church["planters_sent"]:
            sending = planter_sending.get(planter)
            if sending is None:
                warnings.append(f"[[{church['name']}]] lists planter [[{planter}]] in planters_sent, but no planter note with that title exists.")
            elif sending and sending != church["name"]:
                warnings.append(f"[[{church['name']}]] claims [[{planter}]], but that planter's sending_church is '{sending}'.")
    for pastor in pastors:
        if pastor["pastor_church"] and pastor["pastor_church"] not in churches_by_name:
            warnings.append(f"[[{pastor['name']}]].church points to [[{pastor['pastor_church']}]], but no church note with that title exists.")
    for planter, sending in planter_sending.items():
        if sending and sending in churches_by_name:
            church = churches_by_name[sending]
            if planter not in church["planters_sent"]:
                warnings.append(f"[[{planter}]]'s sending_church is [[{sending}]], but that church's planters_sent does not list them.")
    return warnings


def write_people_index(people):
    lines = [
        "---",
        "context: send_network",
        "type: send_network_people_index",
        "status: auto_generated",
        f"total_count: {len(people)}",
        "---",
        "",
        "# Send Network People Index",
        "",
        "> Auto-generated by `scripts/sync_send_network.py` from `wiki/people/`.",
        "",
        "| Name | Primary Type | Person Types | Affiliations | Planter Pathway | Role | Job Title | Event(s) | Group(s) | Church / Plant |",
        "| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |",
    ]
    for person in people:
        lines.append(f"| {person['link']} | {esc(person['person_type'])} | {esc(person['person_types_label'])} | {esc(person['affiliations'])} | {esc(person['pathway_label'])} | {esc(person['roles'])} | {esc(person['job_title'])} | {esc(person['events'])} | {esc(person['groups'])} | {esc(person['church'])} |")
    write_file(PEOPLE_INDEX_PATH, lines)


def write_pipeline_index(planters, legacy_planters):
    by_pathway = defaultdict(list)
    for person in planters:
        by_pathway[person["pathway"]].append(person)
    lines = [
        "---",
        "context: send_network",
        "type: send_network_planter_pathway_index",
        "status: auto_generated",
        f"total_count: {len(planters)}",
        "---",
        "",
        "# Send Network Pipeline Index",
        "",
        "> Auto-generated by `scripts/sync_send_network.py`. The canonical four-value property is `planter_pathway:`.",
        "",
    ]
    for pathway in PATHWAY_ORDER:
        rows = sorted(by_pathway[pathway], key=lambda p: p["name"].lower())
        lines.extend([f"## {PATHWAY_LABELS[pathway]}", ""])
        if not rows:
            lines.extend(["- None currently tracked.", ""])
            continue
        lines.extend(["| Person | Church / Plant | Field Staff | Event(s) |", "| :--- | :--- | :--- | :--- |"])
        for person in rows:
            lines.append(f"| {person['link']} | {esc(person['church'])} | {esc(display_name(person['field_staff']))} | {esc(person['events'])} |")
        lines.append("")
    if legacy_planters:
        lines.extend(["## Needs Source Reconciliation", ""])
        for person in sorted(legacy_planters, key=lambda p: p["name"].lower()):
            lines.append(f"- {person['link']} - legacy/inferred stage `{person['pathway'] or 'unknown'}`")
    write_file(PIPELINE_INDEX_PATH, lines)


def write_groups_index(groups):
    lines = [
        "---",
        "context: send_network",
        "type: send_network_groups_index",
        "status: auto_generated",
        f"total_count: {len(groups)}",
        "---",
        "",
        "# Send Network Groups Index",
        "",
        "> Auto-generated by `scripts/sync_send_network.py` from group notes in `wiki/organization/`.",
        "",
        "| Group | Leader | Status | Members | Rhythm | Planter Pathway |",
        "| :--- | :--- | :--- | :--- | :--- | :--- |",
    ]
    for group in groups:
        stage = PATHWAY_LABELS.get(group["planter_pathway"], group["planter_pathway"])
        leader = group["leader"]
        if leader not in ("", "-") and not str(leader).startswith("[["):
            leader = wiki_link(leader)
        lines.append(f"| [[{esc(group['name'])}]] | {esc(leader)} | {esc(group['status'])} | {esc(group['member_count'])} | {esc(group['rhythm'])} | {esc(stage)} |")
    write_file(GROUPS_INDEX_PATH, lines)


def write_events_index(events):
    lines = [
        "---",
        "context: send_network",
        "type: send_network_events_index",
        "status: auto_generated",
        f"total_event_owner_rows: {len(events)}",
        "---",
        "",
        "# Send Network Events Index",
        "",
        "> Auto-generated by `scripts/sync_send_network.py` from `wiki/events/`.",
        "",
    ]
    by_owner = defaultdict(list)
    for event in events:
        by_owner[event["owner"]].append(event)
    if not by_owner:
        lines.append("- No Send Network event playbooks yet.")
    for owner in sorted(by_owner.keys(), key=str.lower):
        lines.extend([f"## [[{owner}]]", "", "| Event Playbook | Rhythm | Cadence | Purpose | Current / Next Instance |", "| :--- | :--- | :--- | :--- | :--- |"])
        for event in sorted(by_owner[owner], key=lambda e: e["name"].lower()):
            lines.append(f"| **[[{esc(event['name'])}]]** | {esc(event['rhythm'])} | {esc(event['cadence'])} | {esc(event['purpose'])} | {esc(event['current_instance'])} |")
        lines.append("")
    write_file(EVENTS_INDEX_PATH, lines)


def write_churches_index(churches, warnings):
    lines = [
        "---",
        "context: send_network",
        "type: send_network_churches_index",
        "status: auto_generated",
        f"total_count: {len(churches)}",
        "---",
        "",
        "# Send Network Churches Index",
        "",
        "> Auto-generated by `scripts/sync_send_network.py` from `wiki/churches/`.",
        "",
    ]
    by_level = defaultdict(list)
    for church in churches:
        by_level[church["mobilization_level"]].append(church)
    ordered_levels = [level for level in MOBILIZATION_ORDER if by_level.get(level)]
    extra_levels = [level for level in by_level if level not in MOBILIZATION_ORDER]
    for level in ordered_levels + sorted(extra_levels):
        label = level if level else "Unassessed"
        lines.extend([f"## {label}", "", "| Church | Pastor | Church Type | Association | Planters Sent |", "| :--- | :--- | :--- | :--- | :--- |"])
        for church in sorted(by_level[level], key=lambda c: c["name"].lower()):
            pastor = ", ".join(wiki_link(p) for p in church["pastors"]) if church["pastors"] else "-"
            planters = ", ".join(f"[[{p}]]" for p in church["planters_sent"]) or "-"
            lines.append(f"| [[{esc(church['name'])}]] | {pastor} | {esc(church['church_type'])} | {esc(church['association'])} | {planters} |")
        lines.append("")
    lines.extend(["## Consistency Warnings", ""])
    if warnings:
        for warning in warnings:
            lines.append(f"- WARNING: {warning}")
    else:
        lines.append("- None. Cross-links are consistent.")
    write_file(CHURCHES_INDEX_PATH, lines)


def write_pastors_index(pastors):
    lines = [
        "---",
        "context: send_network",
        "type: send_network_pastors_index",
        "status: auto_generated",
        f"total_count: {len(pastors)}",
        "---",
        "",
        "# Send Network Pastors Index",
        "",
        "> Auto-generated by `scripts/sync_send_network.py` from pastor/staff notes in `wiki/people/`.",
        "",
    ]
    by_level = defaultdict(list)
    for pastor in pastors:
        by_level[pastor["involvement_level"]].append(pastor)
    for level in INVOLVEMENT_ORDER:
        rows = by_level.get(level)
        if not rows:
            continue
        label = level.title() if level else "Unassessed"
        lines.extend([f"## {label}", "", "| Pastor | Church | Role | Phone | Email |", "| :--- | :--- | :--- | :--- | :--- |"])
        for pastor in sorted(rows, key=lambda p: p["name"].lower()):
            church = wiki_link(pastor["pastor_church"]) if pastor["pastor_church"] else "-"
            lines.append(f"| {pastor['link']} | {church} | {esc(pastor['roles'])} | {esc(pastor['phone'])} | {esc(pastor['email'])} |")
        lines.append("")
    if not pastors:
        lines.append("- No pastor notes yet.")
    write_file(PASTORS_INDEX_PATH, lines)


def write_planter_dashboard(planters, legacy_planters):
    by_pathway = defaultdict(list)
    for person in planters:
        by_pathway[person["pathway"]].append(person)
    lines = [
        "---",
        "context: send_network",
        "type: sendkc_church_planting_index",
        "status: auto_generated",
        f"total_planters: {len(planters)}",
        "---",
        "",
        "# SendKC Church Planting",
        "",
        "> Working dashboard for SendKC planter care. Each planter has one canonical note under `wiki/people/`, and each tracked planter note carries exactly one `planter_pathway:` value.",
        "",
        "## Pathway Summary",
        "",
        "| Pathway | Count |",
        "| :--- | ---: |",
    ]
    for pathway in PATHWAY_ORDER:
        lines.append(f"| {PATHWAY_LABELS[pathway]} | {len(by_pathway[pathway])} |")
    lines.extend(["", "## Planters by Pathway", ""])
    for pathway in PATHWAY_ORDER:
        rows = sorted(by_pathway[pathway], key=lambda p: p["name"].lower())
        lines.extend([f"### {PATHWAY_LABELS[pathway]}", ""])
        if not rows:
            lines.extend(["- None currently tracked.", ""])
            continue
        lines.extend(["| Planter | Church / Plant | Field Staff | Care End | Health |", "| :--- | :--- | :--- | :--- | :--- |"])
        for person in rows:
            lines.append(f"| {person['link']} | {esc(person['church'])} | {esc(display_name(person['field_staff']))} | {esc(person['care_end'])} | {esc(person['health_status'])} |")
        lines.append("")
    lines.extend(["## Needs Source Reconciliation", ""])
    if legacy_planters:
        for person in sorted(legacy_planters, key=lambda p: p["name"].lower()):
            lines.append(f"- {person['link']} - legacy/inferred stage `{person['pathway'] or 'unknown'}`")
    else:
        lines.append("- None.")
    lines.extend(["", "## Related", "", "- [[Send Network Pipeline Index]]", "- [[Send Network People Index]]", "- [[Send Network Churches Index]]", "- [[Send Network Pastors Index]]"])
    write_file(PLANTER_DASHBOARD_PATH, lines)


def update_planter_lunch_roster(people):
    if not os.path.exists(PLANTER_LUNCH_PLAYBOOK):
        return
    rows = []
    for person in people:
        file_path = os.path.join(PEOPLE_DIR, f"{person['filename']}.md")
        fm = parse_frontmatter(file_path)
        if not person_has_event(fm, PLANTER_LUNCH_EVENT):
            continue
        rows.append(person)
    rows.sort(key=lambda p: p["name"].lower())

    table = [
        f"**{len(rows)} people** tagged with `events: [[{PLANTER_LUNCH_EVENT}]]` as of sync.",
        "",
        "| Name | Church / Plant | Role | Email | Phone |",
        "| :--- | :--- | :--- | :--- | :--- |",
    ]
    if rows:
        for person in rows:
            email = "" if person["email"] == "-" else esc(person["email"])
            phone = "" if person["phone"] == "-" else esc(person["phone"])
            link = person["link"]
            if "|" in link:
                link = link.split("|", 1)[0] + "]]"
            table.append(
                f"| {link} | {esc(person['church'])} | {esc(person['roles'])} | {email} | {phone} |"
            )
    else:
        table.append("| - | - | - | - | - |")

    replacement = PLANTER_LUNCH_ROSTER_START + "\n" + "\n".join(table) + "\n" + PLANTER_LUNCH_ROSTER_END
    with open(PLANTER_LUNCH_PLAYBOOK, "r", encoding="utf-8") as f:
        content = f.read()
    pattern = re.escape(PLANTER_LUNCH_ROSTER_START) + r".*?" + re.escape(PLANTER_LUNCH_ROSTER_END)
    if not re.search(pattern, content, flags=re.DOTALL):
        print(f"Warning: missing planter lunch roster markers in {PLANTER_LUNCH_PLAYBOOK}")
        return
    content = re.sub(pattern, replacement, content, flags=re.DOTALL)
    with open(PLANTER_LUNCH_PLAYBOOK, "w", encoding="utf-8") as f:
        f.write(content)


def main():
    people = load_people()
    planters = [p for p in people if p["is_planter"] and p["pathway_source"] == "canonical"]
    legacy_planters = [p for p in people if p["is_planter"] and p["pathway_source"] != "canonical"]
    pastors = [p for p in people if p["person_type"] == "pastor" or "pastor" in p.get("person_types", []) or "Pastor" in p["roles"]]
    groups = load_groups()
    events = load_events()
    churches = load_churches()
    planter_sending = {p["name"]: p["sending_church"] for p in people if p["is_planter"]}
    warnings = consistency_warnings(churches, people, pastors, planter_sending)

    update_pathway_group_members(planters)
    update_planter_lunch_roster(people)
    write_people_index(people)
    write_pipeline_index(planters, legacy_planters)
    write_groups_index(groups)
    write_events_index(events)
    write_churches_index(churches, warnings)
    write_pastors_index(pastors)
    write_planter_dashboard(planters, legacy_planters)

    for warning in warnings:
        print(f"WARNING: {warning}")
    print(f"Synced Send Network indexes: {len(people)} people, {len(planters)} canonical planters, {len(groups)} groups, {len(events)} event-owner rows, {len(churches)} churches, {len(pastors)} pastors ({len(warnings)} consistency warnings).")


if __name__ == "__main__":
    if not os.path.exists(VAULT_DIR):
        sys.exit(f"SendNetwork vault not found: {VAULT_DIR}")
    main()
