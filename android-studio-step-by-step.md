# Полная инструкция: от этого репозитория до APK/AAB в Android Studio

## 0) Что уже подготовлено в проекте
- PWA-часть (manifest, service worker, install flow).
- Capacitor конфиг (`capacitor.config.ts`).
- npm-скрипты для sync/open/build.

## 1) Установите инструменты
1. **Node.js 20 LTS**
2. **Android Studio (последняя стабильная)**
3. В Android Studio установите:
   - Android SDK Platform (рекомендуемая последняя)
   - Android SDK Build-Tools
   - Android SDK Command-line Tools
   - Android Emulator (опционально)

## 2) Подготовьте проект
```bash
npm install
npx cap add android
npm run cap:sync
```

## 3) Откройте проект в Android Studio
```bash
npm run cap:open
```
Или вручную: **File → Open** и выберите папку `android/`.

## 4) Сборка debug APK
В Android Studio:
- **Build → Build Bundle(s) / APK(s) → Build APK(s)**

CLI-альтернатива:
```bash
npm run android:build
```

Результат:
- `android/app/build/outputs/apk/debug/app-debug.apk`

## 5) Создание keystore для релиза
```bash
keytool -genkeypair -v -keystore goldensad-release.jks -keyalg RSA -keysize 2048 -validity 10000 -alias goldensad
```
Сохраните keystore в безопасном месте (не коммитьте).

## 6) Сборка релизного AAB (для Google Play)
В Android Studio:
- **Build → Generate Signed Bundle / APK**
- Выберите **Android App Bundle**
- Укажите keystore/alias/password
- Build type: `release`

Результат:
- `android/app/build/outputs/bundle/release/app-release.aab`

## 7) Сборка релизного APK (если нужен)
- В том же мастере выберите **APK** вместо AAB.

## 8) Перед обновлениями web-кода
После изменений в `index.html/style.css/script.js` выполняйте:
```bash
npm run cap:sync
```
И затем пересобирайте Android в Studio.

## 9) Типовые проблемы
- Gradle sync errors: проверьте SDK/Build Tools в SDK Manager.
- `npx cap add android` уже выполняли: удалите старую папку `android/` только если хотите чистую переинициализацию.
- Проблемы с npm registry/прокси: настройте доступ к `registry.npmjs.org`.
