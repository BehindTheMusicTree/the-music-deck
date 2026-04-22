#!/bin/bash
# Push all pending changes to remote, one file per commit.
set -e

BRANCH=$(git rev-parse --abbrev-ref HEAD)
REMOTE=${1:-origin}

echo "Branch: $BRANCH -> remote: $REMOTE"
echo ""

while IFS= read -r LINE <&3; do
  FILE="${LINE:3}"  # strip the 3-char status prefix (e.g. "?? " or " D ")

  if [ -f "$FILE" ] || [ -d "$FILE" ]; then
    git add -- "$FILE"
    MSG="add $FILE"
  else
    git rm --cached -- "$FILE" 2>/dev/null || git rm -- "$FILE" 2>/dev/null || true
    MSG="remove $FILE"
  fi

  if ! git diff --cached --quiet; then
    git commit -m "$MSG"
    git push "$REMOTE" "$BRANCH"
    echo "pushed: $FILE"
  else
    echo "skipped (nothing staged): $FILE"
  fi
done 3< <(git status --porcelain)

echo ""
echo "Done."
