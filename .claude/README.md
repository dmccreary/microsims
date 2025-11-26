# Claude Code Skill Tracking System

This directory contains hooks and scripts to automatically track skill usage in Claude Code.

## What Gets Tracked

The tracking system logs:
- **User prompts** that trigger skills
- **Skill names** being invoked
- **Start and end times** for each skill
- **Duration** of skill execution
- **Session IDs** to correlate prompts with skills

## Files

```
.claude/
├── settings.json                 # Hook configuration
├── hooks/
│   ├── track-prompts.sh         # Logs user prompts
│   ├── track-skill-start.sh     # Logs skill start time
│   └── track-skill-end.sh       # Logs skill completion and duration
├── scripts/
│   └── analyze-skills.py        # Analyzes logs and generates reports
└── activity-logs/               # Created automatically
    ├── prompts.jsonl            # User prompt log (JSONL)
    ├── skill-usage.jsonl        # Skill timing log (JSONL)
    └── skill-start-*.tmp        # Temporary files for duration tracking
```

## How It Works

1. **When you submit a prompt** → `track-prompts.sh` logs it with session ID
2. **When a skill starts** → `track-skill-start.sh` logs start time
3. **When a skill completes** → `track-skill-end.sh` logs end time and calculates duration
4. **All data is correlated** by session ID to match prompts with skills

## Usage

### Normal Usage (Automatic)

The hooks run automatically whenever you use skills in Claude Code. Just work normally and data will accumulate in `.claude/activity-logs/`.

### Analyzing Your Data

Run the analysis script to see insights:

```bash
.claude/scripts/analyze-skills.py
```

This generates a report showing:
- Most frequently used skills
- Average and total duration for each skill
- Common prompts that trigger skills
- Recent skill usage history
- Efficiency insights and suggestions

### Example Output

```
# Skill Usage Analysis Report

**Total skill invocations:** 15

## Most Used Skills

- **learning-graph-generator**: 5x
- **glossary-generator**: 3x
- **microsim-p5**: 7x

## Skill Performance (Average Duration)

- **learning-graph-generator**
  - Average: 2m 34s
  - Total time: 12m 50s
  - Invocations: 5x

## Insights & Suggestions

### Frequently Used Skills
- **microsim-p5** (7x): Could benefit from optimization or templates

### Total Time Automated
Skills have automated **45m 23s** of work
```

## Log Format

### prompts.jsonl
```json
{"timestamp": "2025-11-22 14:23:45", "epoch": "1732299825", "session": "abc123", "prompt": "create a learning graph"}
```

### skill-usage.jsonl
```json
{"timestamp": "2025-11-22 14:23:46", "epoch": "1732299826", "session": "abc123", "skill": "learning-graph-generator", "event": "start"}
{"timestamp": "2025-11-22 14:26:20", "epoch": "1732299980", "session": "abc123", "skill": "learning-graph-generator", "event": "end", "duration_seconds": "154"}
```

## Customization

### Change Log Location

Edit the `LOG_DIR` variable in hook scripts to change where logs are saved:

```bash
LOG_DIR="/path/to/custom/logs"
```

### Add Additional Tracking

You can extend the hooks to track:
- Tool usage (not just skills)
- Error rates
- Custom metadata
- Project-specific information

Just modify the hook scripts to capture additional fields from the JSON input.

### Global vs Project Tracking

**Current setup:** Project-specific (logs in `.claude/activity-logs/`)

**For global tracking across all projects:**
1. Move `settings.json` to `~/.claude/settings.json`
2. Update hook scripts to use `~/.claude/activity-logs` for `LOG_DIR`
3. Analysis script will combine data from all projects

## Privacy & Data

All logs are stored **locally** in `.claude/activity-logs/`. No data is sent externally.

To delete logs:
```bash
rm -rf .claude/activity-logs
```

To exclude logs from git:
```bash
echo ".claude/activity-logs/" >> .gitignore
```

## Troubleshooting

### Hooks not running?

Check hook configuration:
```bash
cat .claude/settings.json
```

Verify scripts are executable:
```bash
ls -l .claude/hooks/*.sh
```

### No log files created?

Run a skill and check for errors:
```bash
ls -la .claude/activity-logs/
```

Check if directory was created:
```bash
mkdir -p .claude/activity-logs
```

### Analysis script shows no data?

Ensure you've run at least one skill since installing the hooks. The logs are only created when skills are actually used.

## Next Steps

1. **Use skills normally** - The tracking happens automatically
2. **Review weekly** - Run `analyze-skills.py` to see patterns
3. **Identify opportunities** - Find repetitive tasks that could become new skills
4. **Optimize workflows** - Use insights to improve your skill usage

For more information about hooks, see the [Claude Code hooks documentation](https://github.com/anthropics/claude-code/tree/main/examples/hooks).
