[README.md](https://github.com/user-attachments/files/25823146/README.md)
# 💜 Soulmate AI

> **AI-компаньон для общения** — выбери подружку или создай свою, общайся в чате, сохраняй историю переписки.

![React](https://img.shields.io/badge/React-18-61DAFB?style=flat-square&logo=react)
![Supabase](https://img.shields.io/badge/Supabase-PostgreSQL-3ECF8E?style=flat-square&logo=supabase)
![Stripe](https://img.shields.io/badge/Stripe-Payments-635BFF?style=flat-square&logo=stripe)
![License](https://img.shields.io/badge/license-MIT-purple?style=flat-square)

---

## ✨ Возможности

- 🎲 **Случайная подружка** — три уникальных персонажа с биографией, MBTI и интересами
- 💫 **Создать свою** — имя, возраст, знак зодиака, внешность, тон общения
- 💬 **Чат** — ответы AI, индикатор печатания, история сохраняется в Supabase
- 💳 **Подписки** — 3 дня бесплатно, затем $10/мес или $100/год через Stripe
- 🛡 **Админ панель** — пользователи, доходы, статистика чатов
- 🗄 **DB Viewer** — просмотр своих сообщений из Supabase в реальном времени

---

## 🛠 Стек

| Слой | Технология |
|------|-----------|
| Frontend | React (JSX), CSS-in-JS |
| База данных | Supabase (PostgreSQL REST API) |
| Аутентификация | Supabase Auth (Google OAuth) |
| Платежи | Stripe Payment Links / Checkout |
| Шрифты | Playfair Display + Jost (Google Fonts) |
| Деплой | Vercel / Netlify |

---

## 🚀 Быстрый старт

### 1. Клонируй репозиторий

```bash
git clone https://github.com/YOUR_USERNAME/soulmate-ai.git
cd soulmate-ai
```

### 2. Установи зависимости

```bash
npm install
```

### 3. Настрой переменные окружения

Создай файл `.env.local`:

```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
VITE_STRIPE_LINK_MONTHLY=https://buy.stripe.com/your-monthly-link
VITE_STRIPE_LINK_ANNUAL=https://buy.stripe.com/your-annual-link
```

### 4. Создай таблицу в Supabase

Зайди в **Supabase Dashboard → SQL Editor** и выполни:

```sql
CREATE TABLE messages (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  session_id text NOT NULL,
  user_id text NOT NULL DEFAULT 'guest',
  role text NOT NULL,
  text text NOT NULL,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE messages ENABLE ROW LEVEL SECURITY;

CREATE POLICY "allow all" ON messages
  FOR ALL USING (true) WITH CHECK (true);
```

### 5. Запусти

```bash
npm run dev
```

Открой [http://localhost:5173](http://localhost:5173)

---

## 🔐 Google OAuth (опционально)

1. Зайди на [console.cloud.google.com](https://console.cloud.google.com) → **Credentials → OAuth Client ID**
2. Тип: **Web application**
3. В **Authorized redirect URIs** вставь callback URL из Supabase
4. Скопируй **Client ID** и **Client Secret** → вставь в **Supabase → Authentication → Providers → Google**

---

## 💳 Stripe (подключение платежей)

1. Зайди на [dashboard.stripe.com/test/payment-links](https://dashboard.stripe.com/test/payment-links)
2. Создай две ссылки:
   - **Monthly** — $10/месяц с 3-дневным триалом
   - **Annual** — $100/год с 3-дневным триалом
3. Вставь ссылки в `.env.local` (см. выше)

> ⚠️ **Никогда не публикуй Stripe Secret Key в коде!** Используй только publishable key на фронтенде.

---

## 📁 Структура проекта

```
soulmate-ai/
├── src/
│   └── App.jsx          # Основное приложение (все экраны)
├── public/
├── .env.local           # Переменные окружения (не коммитить!)
├── .gitignore
├── package.json
└── README.md
```

---

## 🖥 Экраны приложения

| Экран | Описание |
|-------|---------|
| Age Gate | Подтверждение 18+ |
| Login | Вход через Google, X, Meta |
| Pick | Выбор режима |
| Random GF | Карточка случайной подружки |
| Create | Конструктор персонажа |
| Chat | Чат с AI и сохранением в БД |
| Payment | Выбор тарифа и оплата |
| DB Viewer | Просмотр истории из Supabase |
| Admin | Панель администратора |

---

## 🌐 Деплой на Vercel

```bash
npm install -g vercel
vercel
```

Добавь переменные окружения в **Vercel Dashboard → Settings → Environment Variables**.

---

## 📋 Дорожная карта

- [ ] Реальные AI-ответы через OpenAI API
- [ ] Реальная Google / Meta OAuth аутентификация
- [ ] Голосовые сообщения
- [ ] Кастомные аватары (генерация через DALL·E)
- [ ] Push-уведомления
- [ ] Мобильное приложение (React Native)

---

## ⚠️ Важно

Это MVP для демонстрационных целей. Перед продакшн-запуском:
- Замени политику Supabase RLS на реальную (не `FOR ALL USING (true)`)
- Подключи реальную аутентификацию
- Переведи Stripe из тестового режима в боевой

---

## 📄 Лицензия

MIT © 2025 Soulmate AI
