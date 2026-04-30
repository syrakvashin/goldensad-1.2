# Сборка APK для Android (Capacitor)

## 1) Установите зависимости
```bash
npm install
```

## 2) Создайте Android-проект
```bash
npx cap add android
```

## 3) Синхронизируйте web-часть
```bash
npm run cap:sync
```

## 4) Соберите APK
```bash
npm run android:build
```

Готовый debug APK обычно находится в:
`android/app/build/outputs/apk/debug/app-debug.apk`

## 5) Для релиза (Play Store)
- Откройте Android Studio: `npm run cap:open`
- Соберите Signed Bundle/APK через меню Build.

## Автосборка APK через GitHub Actions
1. Запушьте изменения в ветку `work`.
2. Откройте вкладку **Actions** → **Build Android APK**.
3. Запустите workflow вручную (`Run workflow`) или дождитесь автозапуска по push.
4. Скачайте артефакт `app-debug-apk`.


## Быстрый старт одной командой
```bash
./scripts_bootstrap_android.sh
```
