#!/usr/bin/env python3
"""Analyze skill usage logs to identify patterns and performance metrics."""

import json
from collections import Counter, defaultdict
from datetime import datetime
from pathlib import Path
import sys

def load_jsonl(filepath):
    """Load JSONL file into list of dicts."""
    if not filepath.exists():
        return []
    with open(filepath) as f:
        return [json.loads(line) for line in f if line.strip()]

def format_duration(seconds):
    """Format duration in human-readable format."""
    if seconds == "unknown":
        return "unknown"
    seconds = int(seconds)
    if seconds < 60:
        return f"{seconds}s"
    elif seconds < 3600:
        minutes = seconds // 60
        secs = seconds % 60
        return f"{minutes}m {secs}s"
    else:
        hours = seconds // 3600
        minutes = (seconds % 3600) // 60
        return f"{hours}h {minutes}m"

def correlate_prompts_with_skills(prompts, skill_events):
    """Match user prompts with skill invocations by session ID."""
    # Group skill events by session
    skills_by_session = defaultdict(list)
    for event in skill_events:
        if event['event'] == 'end':
            skills_by_session[event['session']].append(event)

    # Create prompt lookup by session
    prompts_by_session = {}
    for prompt in prompts:
        # Keep the most recent prompt for each session
        prompts_by_session[prompt['session']] = prompt['prompt']

    # Correlate
    correlated = []
    for session, skill_list in skills_by_session.items():
        prompt = prompts_by_session.get(session, "Unknown prompt")
        for skill_event in skill_list:
            correlated.append({
                'skill': skill_event['skill'],
                'prompt': prompt,
                'duration': skill_event.get('duration_seconds', 'unknown'),
                'timestamp': skill_event['timestamp'],
                'session': session
            })

    return correlated

def analyze_skill_usage(log_dir):
    """Analyze skill usage patterns and generate report."""
    log_dir = Path(log_dir)

    # Load logs
    prompts = load_jsonl(log_dir / "prompts.jsonl")
    skill_events = load_jsonl(log_dir / "skill-usage.jsonl")

    if not skill_events:
        print("No skill usage data found yet.")
        print(f"Logs will be created in: {log_dir}")
        print("\nUse skills in Claude Code and they'll be tracked automatically.")
        return

    # Correlate prompts with skills
    correlated = correlate_prompts_with_skills(prompts, skill_events)

    print("# Skill Usage Analysis Report\n")
    print(f"**Log directory:** `{log_dir}`")
    print(f"**Total skill invocations:** {len(correlated)}")
    print(f"**Analysis date:** {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}\n")

    # Skill frequency analysis
    skill_counts = Counter(entry['skill'] for entry in correlated)
    print("## Most Used Skills\n")
    for skill, count in skill_counts.most_common():
        print(f"- **{skill}**: {count}x")

    # Duration analysis
    print("\n## Skill Performance (Average Duration)\n")
    skill_durations = defaultdict(list)
    for entry in correlated:
        if entry['duration'] != 'unknown':
            skill_durations[entry['skill']].append(int(entry['duration']))

    skill_avg_durations = []
    for skill, durations in skill_durations.items():
        avg = sum(durations) / len(durations)
        total = sum(durations)
        skill_avg_durations.append((skill, avg, total, len(durations)))

    # Sort by total time spent
    skill_avg_durations.sort(key=lambda x: x[2], reverse=True)

    for skill, avg, total, count in skill_avg_durations:
        print(f"- **{skill}**")
        print(f"  - Average: {format_duration(avg)}")
        print(f"  - Total time: {format_duration(total)}")
        print(f"  - Invocations: {count}x")

    # Common prompts that trigger skills
    print("\n## Common Prompts Leading to Skill Usage\n")
    prompt_counts = Counter(entry['prompt'][:100] for entry in correlated)  # Truncate long prompts
    for prompt, count in prompt_counts.most_common(10):
        if count > 1:
            print(f"{count}x: \"{prompt}...\"")

    # Detailed log
    print("\n## Recent Skill Usage (Last 20)\n")
    print("| Timestamp | Skill | Duration | Prompt (truncated) |")
    print("|-----------|-------|----------|---------------------|")
    for entry in sorted(correlated, key=lambda x: x['timestamp'], reverse=True)[:20]:
        duration = format_duration(entry['duration'])
        prompt_short = entry['prompt'][:50].replace('|', '\\|')
        print(f"| {entry['timestamp']} | {entry['skill']} | {duration} | {prompt_short}... |")

    # Efficiency suggestions
    print("\n## Insights & Suggestions\n")

    # Find frequently used skills
    frequent_skills = [s for s, c in skill_counts.items() if c >= 3]
    if frequent_skills:
        print("### Frequently Used Skills")
        print("These skills are used often - consider:")
        for skill in frequent_skills[:5]:
            count = skill_counts[skill]
            print(f"- **{skill}** ({count}x): Could benefit from optimization or templates")

    # Find slow skills
    if skill_avg_durations:
        print("\n### Slowest Skills")
        print("These skills take the most total time:")
        for skill, avg, total, count in skill_avg_durations[:3]:
            print(f"- **{skill}**: {format_duration(total)} total ({format_duration(avg)} avg)")

    # Time savings potential
    if skill_avg_durations:
        total_time_saved = sum(total for _, _, total, _ in skill_avg_durations)
        print(f"\n### Total Time Automated")
        print(f"Skills have automated **{format_duration(total_time_saved)}** of work")
        print("(Time spent running skills vs. doing tasks manually)")

def main():
    """Main entry point."""
    # Default log directory
    log_dir = Path(__file__).parent.parent / "activity-logs"

    # Allow override from command line
    if len(sys.argv) > 1:
        log_dir = Path(sys.argv[1])

    if not log_dir.exists():
        print(f"Log directory not found: {log_dir}")
        print("\nHooks will create this directory on first skill usage.")
        return

    analyze_skill_usage(log_dir)

if __name__ == "__main__":
    main()
