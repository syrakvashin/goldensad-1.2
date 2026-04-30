# Почему у вас «что-то не так» в PR

На скриншоте видно не ошибку приложения, а **конфликт слияния**:
- GitHub пишет: `This branch has conflicts that must be resolved`
- Конфликтный файл: `script.js`

Это значит, что в `main` уже изменили те же строки, что и в вашей ветке.

## Как исправить (рекомендуется через git в терминале)

```bash
git fetch origin
git checkout <ваша-ветка>
git merge origin/main
```

Дальше откройте `script.js`, найдите блоки:
- `<<<<<<<`
- `=======`
- `>>>>>>>`

Оставьте нужный итоговый вариант кода, удалите маркеры конфликта, затем:

```bash
git add script.js
git commit -m "Resolve merge conflict with main in script.js"
git push
```

После push GitHub автоматически уберёт предупреждение о конфликте.

## Если хотите без терминала
1. В PR нажмите **Resolve conflicts**.
2. Исправьте `script.js` прямо в веб-редакторе.
3. Нажмите **Mark as resolved** и **Commit merge**.

## Почему это случилось
`script.js` активно менялся и в вашей ветке, и в `main`, поэтому Git не смог автоматически объединить изменения.
