# Готовое решение конфликтов для PR #6

## 1) `index.html`
В конфликтном месте оставьте **один** блок `Настройки вылива форсунок` (без дубля).

Удалите маркеры:
- `<<<<<<<`
- `=======`
- `>>>>>>>`

И оставьте такой фрагмент:

```html
<div class="formula-box">
  <strong>Настройки вылива форсунок</strong>
  <div class="form-grid herbicide-form-grid">
    <div class="field"><label for="herbicideNozzleName">Название</label><input id="herbicideNozzleName" type="text" placeholder="например, IDK 120-03" /></div>
    <div class="field"><label for="herbicideNozzleFlow">Вылив, л/мин</label><input id="herbicideNozzleFlow" type="number" step="0.001" /></div>
    <div class="field actions"><button id="saveHerbicideNozzleBtn" class="primary-btn">Сохранить шаблон</button></div>
  </div>
  <table class="table">
    <thead><tr><th>Название</th><th>Вылив, л/мин</th><th></th></tr></thead>
    <tbody id="herbicideNozzlesBody"></tbody>
  </table>
</div>
```

## 2) `script.js`
Принцип такой же: удалить конфликт-маркеры и оставить версию, где есть:
- `LS_HERBICIDE_NOZZLES`
- `LS_CALC_SETTINGS`
- `saveHerbicideNozzle`, `removeHerbicideNozzle`, `applyHerbicideNozzlePreset`
- `initCalcInputs`, `saveCalcSettings`, `resetCalcSettings`
- `resetHerbicideSettings`

## 3) Проверка перед commit
После resolve:

```bash
node --check script.js
```

Если без ошибок, можно завершать merge:

```bash
git add index.html script.js
git commit -m "Resolve conflicts in index.html and script.js"
git push
```
