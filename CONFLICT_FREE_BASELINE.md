# Conflict-free baseline (вставить в Resolve editor)

## package.json (секция `scripts` должна быть такой)
```json
"scripts": {
  "cap:sync": "npx cap sync android",
  "cap:open": "npx cap open android",
  "android:build": "cd android && ./gradlew assembleDebug",
  "android:bootstrap": "./scripts_bootstrap_android.sh",
  "check:conflicts": "./scripts/check_conflict_markers.sh"
}
```

## script.js (в конфликте вверху файла)
Оставьте **CURRENT change** для блока с:
- `const LS_CALC_SETTINGS='sprayer_calc_settings_v1';`
- `const defaultCalcSettings=...`
- `function initCalcInputs()`
- `function saveCalcSettings()`
- `function resetCalcSettings()`
- `function normalizeHerbicideNozzles(rows)`

И удалите все маркеры `<<<<<<<`, `=======`, `>>>>>>>`.

## Локальная проверка перед push
```bash
npm run check:conflicts
node --check script.js
```

## Если обе команды успешны
```bash
git add package.json script.js
git commit -m "Resolve conflicts in package.json and script.js"
git push
```
