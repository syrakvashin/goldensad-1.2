# Vercel 403 Forbidden — пошаговое исправление

Если статус Deployment = **Ready**, но при `Visit` открывается `403 Forbidden`, это почти всегда настройки доступа в Vercel, а не баг в коде.

## 1) Отключить Deployment Protection
1. Vercel → Project → **Settings** → **Deployment Protection**.
2. Выключить:
   - Vercel Authentication
   - Password Protection
   - Trusted IPs (если включено)

## 2) Проверить Firewall
1. Vercel → Project → **Firewall**.
2. Временно отключите блокирующие правила.
3. Проверьте, нет ли country/IP deny и bot-challenge правил.

## 3) Проверить домен
1. Откройте deployment URL вида `*-projects.vercel.app`.
2. Если там работает, а custom домен нет — проблема в домене/доступе, не в коде.

## 4) Проверить Logs
- Vercel → **Logs** (runtime/edge).
- Ищите записи вида `forbidden`, `access denied`, `firewall`, `protection`.

## 5) Перезапустить деплой
После изменения protection/firewall нажмите **Redeploy**.

---

## Быстрая диагностика
- `Ready + 403` => почти всегда Access/Firewall policy.
- `Build failed` => проблема в коде/сборке.
