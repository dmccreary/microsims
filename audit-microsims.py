#!/usr/bin/env python3
"""
Audit all MicroSims and check their quality scores and completeness.
"""

import os
import json
import re
from pathlib import Path

def extract_quality_score(index_md_path):
    """Extract quality_score from YAML frontmatter in index.md"""
    if not os.path.exists(index_md_path):
        return None

    with open(index_md_path, 'r', encoding='utf-8') as f:
        content = f.read()

    # Check for YAML frontmatter
    if not content.startswith('---'):
        return None

    # Extract frontmatter
    parts = content.split('---', 2)
    if len(parts) < 3:
        return None

    frontmatter = parts[1]

    # Look for quality_score
    match = re.search(r'quality_score:\s*(\d+)', frontmatter)
    if match:
        return int(match.group(1))

    return None

def check_microsim_files(sim_dir):
    """Check for required files in MicroSim directory"""
    issues = []

    index_md = os.path.join(sim_dir, 'index.md')
    main_html = os.path.join(sim_dir, 'main.html')
    metadata_json = os.path.join(sim_dir, 'metadata.json')

    if not os.path.exists(index_md):
        issues.append('Missing index.md')

    if not os.path.exists(main_html):
        issues.append('Missing main.html')

    if not os.path.exists(metadata_json):
        issues.append('Missing metadata.json')

    return issues

def audit_all_microsims(sims_dir):
    """Audit all MicroSims in the directory"""
    results = []

    # Get all subdirectories
    for sim_name in sorted(os.listdir(sims_dir)):
        sim_path = os.path.join(sims_dir, sim_name)

        # Skip if not a directory or is thumbnails
        if not os.path.isdir(sim_path) or sim_name == 'thumbnails':
            continue

        index_md_path = os.path.join(sim_path, 'index.md')
        quality_score = extract_quality_score(index_md_path)
        issues = check_microsim_files(sim_path)

        results.append({
            'name': sim_name,
            'quality_score': quality_score,
            'issues': issues,
            'needs_work': quality_score is None or quality_score < 85 or len(issues) > 0
        })

    return results

def generate_report(results):
    """Generate a summary report"""
    total = len(results)
    needs_work = sum(1 for r in results if r['needs_work'])
    has_score = sum(1 for r in results if r['quality_score'] is not None)
    high_quality = sum(1 for r in results if r['quality_score'] and r['quality_score'] >= 85)

    print(f"\n{'='*80}")
    print(f"MicroSim Standardization Audit Report")
    print(f"{'='*80}\n")
    print(f"Total MicroSims: {total}")
    print(f"Have quality_score: {has_score}")
    print(f"Quality score >= 85: {high_quality}")
    print(f"Need work: {needs_work}")
    print(f"\n{'='*80}")
    print(f"MicroSims Needing Work (quality_score < 85 or missing files):")
    print(f"{'='*80}\n")

    for result in results:
        if result['needs_work']:
            score_str = f"{result['quality_score']}" if result['quality_score'] is not None else "NO SCORE"
            issues_str = ", ".join(result['issues']) if result['issues'] else "No missing files"
            print(f"{result['name']:30} | Score: {score_str:8} | {issues_str}")

    print(f"\n{'='*80}")
    print(f"High Quality MicroSims (score >= 85):")
    print(f"{'='*80}\n")

    for result in results:
        if not result['needs_work'] and result['quality_score'] and result['quality_score'] >= 85:
            print(f"{result['name']:30} | Score: {result['quality_score']}")

    return results

if __name__ == '__main__':
    sims_dir = 'docs/sims'
    results = audit_all_microsims(sims_dir)
    generate_report(results)
