"""Validate the two delivered ZIPs, then extract without replacing any file.

Offline, Python standard library only. Re-runs verify existing extractions.
Original source bytes are never formatted or rewritten.
"""

import hashlib
import json
from pathlib import Path, PurePosixPath
import re
import shutil
import stat
import sys
import zipfile

ROOT = Path(__file__).resolve().parents[1]
ARCHIVES = (
    "reference/webflow-handoff/2026-09-07/dentvitalis-webflow-handoff.zip",
    "source-assets/webflow-export/2026-09-07/dentvitalis33.webflow.zip",
)


def digest_file(path):
    with path.open("rb") as source:
        return hashlib.file_digest(source, "sha256").hexdigest()


def validated_entries(archive):
    entries = archive.infolist()
    names = set()
    files = set()
    portable_names = set()
    total = sum(entry.file_size for entry in entries)
    if total > 2 * 1024**3 or len(entries) > 20000:
        raise ValueError("Archive exceeds intake size/entry limits")
    for entry in entries:
        name = entry.filename
        parts = PurePosixPath(name).parts
        mode = entry.external_attr >> 16
        if (
            not name
            or "\\" in name
            or "\x00" in name
            or name.startswith("/")
            or re.match(r"^[A-Za-z]:", name)
            or any(part in (".", "..", "") for part in name.rstrip("/").split("/"))
            or any(":" in part for part in parts)
            or stat.S_ISLNK(mode)
            or stat.S_IFMT(mode) not in (0, stat.S_IFREG, stat.S_IFDIR)
            or entry.flag_bits & 1
        ):
            raise ValueError(f"Unsafe or encrypted archive member: {name!r}")
        normalized = name.rstrip("/")
        if normalized in names or normalized.casefold() in portable_names:
            raise ValueError(f"Duplicate/case-colliding member: {name}")
        names.add(normalized)
        portable_names.add(normalized.casefold())
        if not entry.is_dir():
            files.add(normalized)
    for name in names:
        if any(str(parent) in files for parent in PurePosixPath(name).parents):
            raise ValueError(f"File/directory conflict: {name}")
    bad = archive.testzip()
    if bad:
        raise ValueError(f"ZIP CRC failure: {bad}")
    return entries


def validate_manifest(archive, hashes):
    manifest = json.loads(archive.read("manifest.json"))
    rows = manifest["files"]
    indexed = {row["path"]: row for row in rows}
    if len(indexed) != len(rows):
        raise ValueError("Duplicate manifest paths")
    if set(indexed) != set(hashes):
        raise ValueError("Manifest and ZIP file sets differ")
    checked = 0
    for name, row in indexed.items():
        if name == "manifest.json":
            continue  # Explicit self-hash exclusion in fileHashPolicy.
        actual = hashes[name]
        if row["sha256"] != actual["sha256"] or row["bytes"] != actual["bytes"]:
            raise ValueError(f"Manifest size/hash mismatch: {name}")
        checked += 1
    return {
        "snapshotId": manifest["snapshotId"],
        "matchedSizeAndSha256": checked,
        "selfEntry": indexed.get("manifest.json"),
        "fileHashPolicy": manifest["fileHashPolicy"],
    }


def accept():
    reports = []
    for relative in ARCHIVES:
        archive_path = ROOT / relative
        destination = archive_path.parent / "extracted"
        if destination.is_symlink():
            raise ValueError(f"Symlink destination: {destination}")
        with zipfile.ZipFile(archive_path) as archive:
            entries = validated_entries(archive)
            hashes = {}
            for entry in entries:
                if not entry.is_dir():
                    hashes[entry.filename] = {
                        "bytes": entry.file_size,
                        "sha256": hashlib.sha256(archive.read(entry)).hexdigest(),
                    }
            manifest_result = (
                validate_manifest(archive, hashes)
                if "manifest.json" in hashes else None
            )
            already_extracted = destination.exists()
            if already_extracted:
                found = set()
                for file in destination.rglob("*"):
                    if file.is_symlink():
                        raise ValueError(f"Symlink in existing extraction: {file}")
                    if file.is_file():
                        name = file.relative_to(destination).as_posix()
                        found.add(name)
                        if name not in hashes or digest_file(file) != hashes[name]["sha256"]:
                            raise ValueError(f"Existing file differs; preserved: {file}")
                if found != set(hashes):
                    raise ValueError("Existing extraction incomplete; preserved without writes")
            else:
                # Atomic directory creation fails if another process created it.
                destination.mkdir(exist_ok=False)
                for entry in entries:
                    target = destination / entry.filename
                    if entry.is_dir():
                        target.mkdir(parents=True, exist_ok=True)
                    else:
                        target.parent.mkdir(parents=True, exist_ok=True)
                        with archive.open(entry) as source, target.open("xb") as output:
                            shutil.copyfileobj(source, output)
                for name, expected in hashes.items():
                    if digest_file(destination / name) != expected["sha256"]:
                        raise ValueError(f"Post-extraction checksum mismatch: {name}")
            reports.append({
                "archive": relative,
                "archiveBytes": archive_path.stat().st_size,
                "archiveSha256": digest_file(archive_path),
                "entries": len(entries),
                "files": len(hashes),
                "uncompressedBytes": sum(row["bytes"] for row in hashes.values()),
                "crc": "passed-all-members",
                "pathSafety": "passed",
                "destination": str(destination.relative_to(ROOT)),
                "extraction": "verified-existing" if already_extracted else "created-exclusive",
                "postExtractionHashes": "all-matched",
                "manifest": manifest_result,
            })
    return reports


def verify_extracted_only():
    """Verify a restored checkout without requiring the ignored original ZIPs."""
    receipt = ROOT / "reference/webflow-handoff/2026-09-07/source-comparison.json"
    records = json.loads(receipt.read_text(encoding="utf-8"))["files"]
    results = []
    for label, relative in zip(("handoff", "export"), ARCHIVES):
        directory = (ROOT / relative).parent / "extracted"
        expected = {row["path"]: row for row in records if row["package"] == label}
        if directory.is_symlink() or not directory.is_dir():
            raise ValueError(f"Missing or symlink extraction: {directory}")
        actual = set()
        for file in directory.rglob("*"):
            if file.is_symlink():
                raise ValueError(f"Symlink in restored extraction: {file}")
            if not file.is_file():
                continue
            name = file.relative_to(directory).as_posix()
            actual.add(name)
            if (
                name not in expected
                or file.stat().st_size != expected[name]["bytes"]
                or digest_file(file) != expected[name]["sha256"]
            ):
                raise ValueError(f"Restored source differs from verified receipt: {file}")
        if actual != set(expected):
            raise ValueError(f"Missing files in restored {label} extraction")
        results.append({"package": label, "filesVerified": len(actual), "sha256": "all-matched"})
    return results


if __name__ == "__main__":
    if sys.argv[1:] == ["--extracted-only"]:
        print(json.dumps({"extractions": verify_extracted_only()}, indent=2))
    elif not sys.argv[1:]:
        print(json.dumps({"archives": accept()}, ensure_ascii=False, indent=2))
    else:
        raise SystemExit("Usage: accept-webflow-sources.py [--extracted-only]")
