# Что именно сломано в conflict-resolve

Ошибка в том, что при ручном merge в `script.js` перемешались 2 блока:
- новые функции (`initCalcInputs`, `saveCalcSettings`, `resetCalcSettings`, `normalizeHerbicideNozzles`)
- базовые константы (`defaultMeasurements`, `defaultHerbicideSettings`, `defaultBlocks`, `appState`)

В GitHub Resolve Editor нужно оставить **один цельный верхний блок** в таком порядке:

1. `const ...` URL/LS-константы
2. `defaultMeasurements`, `defaultHerbicideSettings`, `defaultHerbicideNozzles`, `defaultCalcSettings`, `defaultBlocks`
3. `appState`, `els`, `DOMContentLoaded`
4. `bindElements`, `bindEvents`
5. `initCalcInputs`, `saveCalcSettings`, `resetCalcSettings`, `normalizeHerbicideNozzles`

Если хотите быстро: замените верх файла `script.js` (до `function renderTabs`) на текущий вариант из вашей ветки (`HEAD`) без конфликт-маркеров.

Проверка перед commit merge:
```bash
node --check script.js
```
Если команда без ошибок — конфликт собран корректно.
