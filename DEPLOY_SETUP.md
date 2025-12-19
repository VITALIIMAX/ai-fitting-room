# GitHub Actions Deploy Setup

## Автоматический деплой на Beget/VPS

Этот репозиторий настроен на автоматический деплой при каждом пуше в ветку `main`.

### Что это делает

**GitHub Actions workflow** (`.github/workflows/deploy-server.yml`):
- Триггерится на каждый `git push` в `main`
- Копирует все файлы на сервер через SSH+rsync
- Удаляет на сервере файлы, которых нет в новой версии (`--delete`)

### Как настроить

#### 1. Генерируем SSH-ключ (если его ещё нет)

```bash
ssh-keygen -t ed25519 -f github_deploy -N ""
```

- Сохранится два файла:
  - `github_deploy` (приватный ключ)
  - `github_deploy.pub` (публичный ключ)

#### 2. На сервере (Beget/VPS)

Добавляем публичный ключ в `~/.ssh/authorized_keys`:

```bash
# На вашем сервере
cat >> ~/.ssh/authorized_keys << EOF
$(cat github_deploy.pub)
EOF

chmod 600 ~/.ssh/authorized_keys
```

#### 3. В GitHub репозитории

Перейди в **Settings → Secrets and variables → Actions** и создай три secret:

1. **SSH_PRIVATE_KEY**
   - Содержимое файла `github_deploy` (приватный ключ)
   - Выглядит так: `-----BEGIN OPENSSH PRIVATE KEY-----...`

2. **SSH_HOST**
   - Для Beget: `login.beget.tech` или адрес сервера
   - Для VPS: IP или домен сервера
   - Пример: `your-server.com`

3. **SSH_USER**
   - Логин на сервере
   - Для Beget: обычно логин от аккаунта
   - Для VPS: `root`, `ubuntu`, или другой пользователь

4. **SSH_TARGET**
   - Полный путь к папке сайта на сервере
   - Для Beget: `/home/username/domain.ru/public_html`
   - Для VPS: `/var/www/ai-fitting-room` или аналогично
   - **Важно:** должна существовать! Создай её если нужно

### Проверка

1. Сделай коммит и пуш в `main`
2. Перейди в **Actions** и смотри лог выполнения
3. Если success ✅ → файлы загружены на сервер
4. Если ошибка → проверь SSH-ключ и пути

### Что если не работает?

**Ошибка: `Permission denied (publickey)`**
- Проверь, добавлен ли публичный ключ в `~/.ssh/authorized_keys` на сервере
- Проверь права: `chmod 600 ~/.ssh/authorized_keys` и `chmod 700 ~/.ssh`

**Ошибка: `rsync: [receiver] mkdir failed on ...`**
- Целевая папка не существует. Создай её на сервере:
  ```bash
  mkdir -p /path/to/target
  ```

**Ошибка: `Host key verification failed`**
- Сервер в первый раз. Workflow автоматически добавляет его в `known_hosts`
- Если всё равно ошибка — проверь `SSH_HOST`

### Deployment по расписанию (опционально)

Если хочешь деплоить без пуша, добавь в workflow:

```yaml
schedule:
  - cron: '0 2 * * *'  # каждый день в 2:00 UTC
```

---

**Документация:** https://docs.github.com/en/actions
