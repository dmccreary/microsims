#!/usr/bin/env python3
"""Validate MicroSim metadata.json files against microsim-schema.json.

Usage:
    python validate.py path/to/metadata.json [more.json ...]
    python validate.py --schema other-schema.json metadata.json

Requires:
    pip install jsonschema rfc3339-validator

rfc3339-validator is needed for jsonschema to check the "date-time" format;
without it, date-time strings are silently accepted.

Exit status: 0 if every file is valid, 1 if any file is invalid,
2 if a file or the schema could not be loaded.
"""

import argparse
import json
import sys
from pathlib import Path

from jsonschema import Draft7Validator, FormatChecker

DEFAULT_SCHEMA = Path(__file__).resolve().parent / "microsim-schema.json"


def load_json(path):
    with open(path, encoding="utf-8") as f:
        return json.load(f)


def print_error(error, indent="  "):
    print(f"{indent}{error.json_path}: {error.message}")
    # For anyOf/oneOf failures, show why each branch was rejected
    for sub in sorted(error.context or [], key=lambda e: list(e.relative_schema_path)):
        branch = sub.relative_schema_path[0] if sub.relative_schema_path else "?"
        print(f"{indent}    branch {branch}: {sub.json_path}: {sub.message}")


def main():
    parser = argparse.ArgumentParser(description=__doc__.splitlines()[0])
    parser.add_argument("files", nargs="+", help="metadata.json file(s) to validate")
    parser.add_argument("--schema", default=DEFAULT_SCHEMA,
                        help=f"schema file (default: {DEFAULT_SCHEMA.name})")
    args = parser.parse_args()

    try:
        schema = load_json(args.schema)
        Draft7Validator.check_schema(schema)
    except Exception as e:
        print(f"Cannot load schema {args.schema}: {e}", file=sys.stderr)
        return 2

    format_checker = FormatChecker()
    if "date-time" not in format_checker.checkers:
        print("Warning: rfc3339-validator is not installed, so 'date-time' "
              "formats are not checked (pip install rfc3339-validator)",
              file=sys.stderr)
    validator = Draft7Validator(schema, format_checker=format_checker)

    status = 0
    for path in args.files:
        try:
            data = load_json(path)
        except Exception as e:
            print(f"ERROR  {path}: cannot load JSON: {e}")
            status = max(status, 2)
            continue

        errors = sorted(validator.iter_errors(data), key=lambda e: list(e.absolute_path))
        if errors:
            print(f"FAIL   {path} ({len(errors)} error{'s' if len(errors) != 1 else ''})")
            for error in errors:
                print_error(error)
            status = max(status, 1)
        else:
            print(f"OK     {path}")
    return status


if __name__ == "__main__":
    sys.exit(main())
