#!/bin/bash
# Track skill invocation start time

HOOK_INPUT=$(cat)
TOOL_NAME=$(echo "$HOOK_INPUT" | jq -r '.tool_name')
SKILL_NAME=$(echo "$HOOK_INPUT" | jq -r '.tool_input.skill')
SESSION_ID=$(echo "$HOOK_INPUT" | jq -r '.session_id')
TIMESTAMP=$(date '+%Y-%m-%d %H:%M:%S')
EPOCH=$(date '+%s')

# Create log directory if it doesn't exist
LOG_DIR="${CLAUDE_PROJECT_DIR:-.}/.claude/activity-logs"
mkdir -p "$LOG_DIR"

# Log skill start with timestamp
LOG_FILE="$LOG_DIR/skill-usage.jsonl"
jq -nc \
  --arg ts "$TIMESTAMP" \
  --arg epoch "$EPOCH" \
  --arg sid "$SESSION_ID" \
  --arg skill "$SKILL_NAME" \
  --arg event "start" \
  '{timestamp: $ts, epoch: $epoch, session: $sid, skill: $skill, event: $event}' >> "$LOG_FILE"

# Create a temporary file to track start time for duration calculation
TEMP_FILE="$LOG_DIR/skill-start-${SESSION_ID}-${SKILL_NAME}.tmp"
echo "$EPOCH" > "$TEMP_FILE"

# Allow the skill to execute (exit 0 = success)
exit 0
