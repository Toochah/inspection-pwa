# 🏭 Склад.Инспект PWA

**Мобильное PWA приложение для проведения осмотров складского комплекса**

[![Version](https://img.shields.io/badge/version-2.1.0-blue.svg)](https://github.com/yourusername/inspection-pwa)
[![PWA](https://img.shields.io/badge/PWA-enabled-green.svg)](https://web.dev/progressive-web-apps/)
[![License](https://img.shields.io/badge/license-internal-red.svg)](LICENSE)

📱 **Демо:** [https://yourusername.github.io/inspection-pwa](https://yourusername.github.io/inspection-pwa)

---

## 🚀 Быстрый старт

### 1. Открыть в браузере

```bash
# На компьютере
http://localhost:8080

# На мобильном (после деплоя)
https://yourusername.github.io/inspection-pwa
```

### 2. Установить как приложение

**Android (Chrome):**
1. Откройте сайт в Chrome
2. Нажмите меню (⋮) → "Установить приложение"
3. Приложение появится на рабочем столе

**iOS (Safari):**
1. Откройте сайт в Safari
2. Нажмите "Поделиться" → "На экран «Домой»"
3. Иконка появится на рабочем столе

---

## 📋 Возможности

### ✅ Обход дежурного (23 точки)
- QR-сканер для каждой точки
- GPS валидация (5м)
- Фотофиксация дефектов
- Таймер обхода
- Offline режим

### 📊 Дашборд
- Прогресс в реальном времени
- Статистика (пройдено/дефекты)
- Следующая точка с расстоянием
- Последние отчёты

### 👥 19 сотрудников
- Автоматическое определение роли
- Дежурный персонал (3)
- Инженеры (3)
- Специалисты (13)

---

## 🛠️ Установка и запуск

### Локальная разработка

```bash
# Клонировать репозиторий
git clone https://github.com/yourusername/inspection-pwa.git
cd inspection-pwa/PWA

# Запустить сервер
python -m http.server 8080

# Или через Node.js
npx http-server -p 8080

# Открыть в браузере
http://localhost:8080
```

### Деплой на GitHub Pages

```bash
# В папке проекта
cd PWA

# Инициализировать git (если ещё не инициализирован)
git init
git add .
git commit -m "Initial commit"

# Добавить remote (замените yourusername на ваш username)
git remote add origin https://github.com/yourusername/inspection-pwa.git

# Запушить
git push -u origin main

# Включить GitHub Pages в настройках репозитория:
# Settings → Pages → Source → main branch → Save
```

---

## 📁 Структура проекта

```
inspection-pwa/
├── PWA/                      # Основное приложение
│   ├── index.html           # Главная страница
│   ├── styles.css           # Стили (мобильная оптимизация)
│   ├── app.js               # Логика приложения
│   ├── data.js              # Данные (23 точки, 19 сотрудников)
│   ├── manifest.json        # PWA манифест
│   ├── sw.js                # Service Worker
│   ├── offline.html         # Offline страница
│   ├── icons/               # Иконки (SVG)
│   └── README.md            # Документация
├── bypass-app/              # Исходный React Native проект
├── QR_Obhod_Android/        # Исходный Android проект
└── warehouse-dashboard/     # Исходный веб-дашборд
```

---

## 📱 Мобильная оптимизация

### Особенности

- ✅ Адаптивный дизайн (mobile-first)
- ✅ Сенсорное управление (крупные кнопки 48px+)
- ✅ Haptic feedback (вибрация)
- ✅ Swipe жесты (свайп вправо - назад)
- ✅ Сжатие фото (80% JPEG)
- ✅ Lazy load списков
- ✅ Offline режим

### Поддерживаемые устройства

| Платформа | Версия | Статус |
|-----------|--------|--------|
| Android | 8.0+ | ✅ Полная поддержка |
| iOS | 12.0+ | ✅ Ограниченная вибрация |
| Chrome Mobile | 80+ | ✅ |
| Safari Mobile | 13+ | ✅ |

---

## 🔧 Настройки

### Telegram уведомления

Откройте `PWA/data.js` и обновите:

```javascript
const TelegramConfig = {
    bot_token: "YOUR_BOT_TOKEN",
    chief_engineer_id: "CHAT_ID",
    energy_engineer_id: "CHAT_ID"
};
```

### GPS валидация

```javascript
const AppConfig = {
    gps_radius_meters: 5,  // Радиус валидации
    offline_mode: true
};
```

---

## 📊 Данные

### 23 точки обхода

| Категория | Точек |
|-----------|-------|
| Вентиляция (VENT) | 2 |
| КНС (KNS) | 3 |
| ИТП (ITP) | 3 |
| ГРЩ (GRSH) | 3 |
| ДГУ (DGU) | 3 |
| Котельная (BOILER) | 1 |
| Насосная (PUMP) | 1 |
| Эваквыходы (EXIT) | 4 |
| Освещение (LIGHT) | 2 |
| Территория (TERR) | 1 |

### 10 типов чек-листов

- Электроснабжение (5 пунктов)
- Резервное питание (2 пункта)
- Вентиляция (4 пункта)
- КНС (2 пункта)
- Водоснабжение (4 пункта)
- Теплоснабжение (5 пунктов)
- Эваквыходы (1 пункт)
- Наружное освещение (3 пункта)
- Аварийное освещение (2 пункта)
- Территория (3 пункта)

---

## 🚀 Деплой

### GitHub Pages (бесплатно)

1. Запушите код в GitHub
2. Settings → Pages
3. Source: `main` branch
4. Сохраните
5. Через 1-2 минуты сайт будет доступен

### Vercel (бесплатно)

```bash
npm i -g vercel
vercel --prod
```

### Netlify (бесплатно)

```bash
npm i -g netlify-cli
netlify deploy --prod
```

---

## 📖 Документация

- **[README.md](PWA/README.md)** - Главная документация
- **[MOBILE_OPTIMIZATION.md](PWA/MOBILE_OPTIMIZATION.md)** - Мобильная оптимизация
- **[GUARD_ROUTE.md](PWA/GUARD_ROUTE.md)** - Обход дежурного (23 точки)
- **[INSTRUCTIONS.md](PWA/INSTRUCTIONS.md)** - Инструкции для ролей
- **[CHANGELOG.md](PWA/CHANGELOG.md)** - История изменений

---

## 🐛 Проблемы и решения

### Не открывается на мобильном

**Проблема:** localhost не доступен с мобильного

**Решение:**
1. Задеплойте на GitHub Pages (см. выше)
2. Или используйте IP компьютера:
   ```bash
   # Узнайте IP
   ipconfig  # Windows
   ifconfig  # macOS/Linux
   
   # Откройте на мобильном
   http://192.168.1.100:8080
   ```

### Не работает камера

**Решение:**
1. Проверьте разрешения в браузере
2. Требуется HTTPS (кроме localhost)
3. Перезагрузите страницу

### Не работает GPS

**Решение:**
1. Включите геолокацию в настройках
2. Разрешите доступ к геопозиции
3. Проверьте точность (должно быть ≤5м)

---

## 📈 Планы развития

### Версия 2.2
- [ ] QR сканер с jsQR
- [ ] Offline карта точек
- [ ] Голосовое управление
- [ ] Тёмная тема

### Версия 2.3
- [ ] AR навигация к точкам
- [ ] Синхронизация в реальном времени
- [ ] Push-уведомления для iOS

---

## 📄 Лицензия

Внутренний проект компании. Все права защищены.

---

## 👥 Авторы

- Разработчик: warehouse-dashboard team
- Дата: Март 2026
- Версия: 2.1.0

---

## 📞 Контакты

**Вопросы и предложения:** [your-email@company.com](mailto:your-email@company.com)

---

*Приложение оптимизировано для мобильных устройств. Рекомендуется использовать на экранах 320px - 768px.*