#!/usr/bin/env bash
set -euo pipefail

files=(index.html script.js style.css sw.js manifest.webmanifest)
failed=0
for f in "${files[@]}"; do
  if [[ -f "$f" ]]; then
    if rg -n "^(<<<<<<<|=======|>>>>>>>)" "$f" >/dev/null; then
      echo "Conflict markers found in $f"
      rg -n "^(<<<<<<<|=======|>>>>>>>)" "$f"
      failed=1
    fi
  fi
done

if [[ $failed -ne 0 ]]; then
  echo "❌ Resolve merge markers before commit/deploy."
  exit 1
fi

echo "✅ No merge conflict markers found in key files."
