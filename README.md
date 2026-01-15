# BTX Admin Panel

Админ-панель для тестового задания с полным стеком технологий.

## Стек технологий

- **Next.js 16** (App Router)
- **TypeScript**
- **HeroUI** - UI компоненты
- **Tailwind CSS** - стилизация
- **SCSS** - глобальные стили и модули
- **Zustand** - управление состоянием
- **TanStack Query** - работа с API
- **Socket.IO** - real-time коммуникация
- **JWT** - аутентификация (токен в cookies)

## Структура проекта

```
src/
 ├─ app/                    # Next.js App Router страницы
 │   ├─ login/             # Страница логина
 │   ├─ dashboard/         # Защищённые страницы
 │   │   ├─ users/         # Управление пользователями
 │   │   ├─ admins/        # Управление администраторами
 │   │   └─ posts/         # Управление постами
 │   └─ layout.tsx         # Корневой layout
 │
 ├─ shared/                 # Общий код
 │   ├─ api/               # API сервисы
 │   ├─ hooks/             # Кастомные хуки
 │   ├─ store/             # Zustand stores
 │   ├─ ui/                # Переиспользуемые компоненты
 │   └─ styles/            # SCSS стили
 │
 ├─ providers/             # React провайдеры
 │   ├─ query-provider.tsx # TanStack Query
 │   └─ hero-provider.tsx  # HeroUI
```

## Установка и запуск

### 1. Установка зависимостей

```bash
npm install
```

### 2. Запуск Next.js приложения

```bash
npm run dev
```

Приложение будет доступно по адресу: http://localhost:3000

### 3. Запуск Socket.IO сервера (в отдельном терминале)

```bash
npm run socket
```

Socket сервер будет доступен по адресу: http://localhost:3001

## Использование

### Аутентификация

1. Перейдите на `/login`
2. Введите любые email и пароль (заглушка)
3. После успешного входа вы будете перенаправлены на `/dashboard`

### Защищённые маршруты

Все маршруты `/dashboard/*` защищены middleware, который проверяет наличие JWT токена в cookies.

### TanStack Query

Все запросы к API должны идти через TanStack Query. Пример использования:

```typescript
import { useUsers } from '@/shared/hooks/useUsers';

function UsersPage() {
  const { data, isLoading, error } = useUsers();
  // ...
}
```

### Socket.IO

Socket.IO подключение происходит автоматически в `dashboard/layout.tsx`. Для использования в компонентах:

```typescript
import { useSocket } from '@/shared/hooks/useSocket';

function MyComponent() {
  const socket = useSocket();
  // ...
}
```

## Архитектурные решения

1. **Разделение на слои**: код разделён на `app`, `shared`, `providers`
2. **API через TanStack Query**: все запросы к API идут через TanStack Query
3. **Zustand для состояния**: глобальное состояние через Zustand stores
4. **JWT в cookies**: токен аутентификации хранится в cookies
5. **Middleware защита**: защита маршрутов через Next.js middleware
6. **SCSS модули**: стилизация компонентов через SCSS модули

## TODO

- [ ] Подключить реальное API
- [ ] Реализовать полноценный CRUD
- [ ] Добавить валидацию форм
- [ ] Настроить обработку ошибок
- [ ] Добавить тесты

## Лицензия

MIT
