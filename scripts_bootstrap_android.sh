#!/usr/bin/env bash
set -euo pipefail

echo "[1/4] Installing npm dependencies"
npm install

echo "[2/4] Adding Android platform (if missing)"
if [ ! -d android ]; then
  npx cap add android
else
  echo "android/ already exists, skipping cap add"
fi

echo "[3/4] Syncing web assets to Android project"
npx cap sync android

echo "[4/4] Done. Open Android Studio with: npm run cap:open"
