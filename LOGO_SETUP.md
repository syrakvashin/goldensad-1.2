# Логотип приложения

Текущие иконки приложения лежат в папке `icons/`:
- `icons/icon-192.svg`
- `icons/icon-512.svg`

Они используются:
- в `manifest.webmanifest` (PWA/Android install)
- в `index.html` как favicon
- в `sw.js` для офлайн-кэша

Если вы хотите использовать ваш логотип, замените содержимое этих файлов или сгенерируйте PNG/SVG с теми же именами и обновите ссылки в `manifest.webmanifest`, `index.html`, `sw.js`.
