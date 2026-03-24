# 🚀 Инструкция по деплою на GitHub Pages

## Шаг 1: Создайте репозиторий на GitHub

1. Зайдите на https://github.com
2. Войдите в свой аккаунт
3. Нажмите **"New"** (создать репозиторий)
4. Введите имя: `inspection-pwa`
5. Выберите **Public** или **Private**
6. **НЕ** нажимайте "Initialize this repository with a README"
7. Нажмите **"Create repository"**

---

## Шаг 2: Запушите код на GitHub

Откройте PowerShell или Command Prompt от имени администратора:

```bash
# Перейдите в папку проекта
cd c:\proj\Inspection

# Добавьте remote (замените YOUR_USERNAME на ваш username GitHub)
git remote add origin https://github.com/YOUR_USERNAME/inspection-pwa.git

# Проверьте что remote добавлен
git remote -v

# Запушите код
git push -u origin master
```

**Если используете main вместо master:**
```bash
# Переименуйте ветку
git branch -M main

# Запушите
git push -u origin main
```

---

## Шаг 3: Включите GitHub Pages

1. Откройте ваш репозиторий на GitHub
2. Перейдите в **Settings** (Настройки)
3. В левом меню выберите **Pages**
4. В разделе **"Source"** выберите:
   - Branch: **main** (или master)
   - Folder: **/ (root)**
5. Нажмите **Save**

---

## Шаг 4: Подождите деплой

GitHub Pages деплоится 1-3 минуты.

Проверить статус можно здесь:
```
https://github.com/YOUR_USERNAME/inspection-pwa/actions
```

Когда появится зелёная галочка ✅ — сайт готов!

---

## Шаг 5: Откройте на мобильном

Ваш сайт доступен по адресу:

```
https://YOUR_USERNAME.github.io/inspection-pwa/
```

**Откройте эту ссылку на мобильном устройстве!**

---

## 🔧 Если не работает

### Ошибка: "remote origin already exists"

```bash
# Удалите старый remote
git remote remove origin

# Добавьте новый
git remote add origin https://github.com/YOUR_USERNAME/inspection-pwa.git
```

### Ошибка: "permission denied"

Убедитесь что используете правильный username:
```bash
# Проверьте текущий remote
git remote -v

# Если неверный - удалите и добавьте заново
git remote remove origin
git remote add origin https://github.com/ПРАВИЛЬНЫЙ_USERNAME/inspection-pwa.git
git push -u origin main
```

### Страница не загружается

1. Подождите 2-3 минуты после деплоя
2. Проверьте Actions: https://github.com/USERNAME/inspection-pwa/actions
3. Убедитесь что в настройках Pages выбрано **main** branch
4. Попробуйте очистить кэш браузера

### 404 ошибка

Проверьте что файл `index.html` находится в корне папки `PWA/`:
```
inspection-pwa/
├── PWA/
│   ├── index.html  ← Должен быть здесь
│   ├── app.js
│   └── ...
```

---

## 📱 Как установить на телефон

### Android (Chrome)

1. Откройте https://YOUR_USERNAME.github.io/inspection-pwa/
2. Нажмите меню (⋮)
3. Выберите **"Установить приложение"** или **"Добавить на главный экран"**
4. Иконка появится на рабочем столе

### iOS (Safari)

1. Откройте https://YOUR_USERNAME.github.io/inspection-pwa/
2. Нажмите кнопку **"Поделиться"** (квадрат со стрелкой)
3. Выберите **"На экран «Домой»"**
4. Нажмите **"Добавить"**
5. Иконка появится на рабочем столе

---

## 🔄 Обновление после изменений

После каждого изменения в коде:

```bash
# Перейдите в папку проекта
cd c:\proj\Inspection

# Добавьте изменения
git add .

# Сделайте коммит
git commit -m "Описание изменений"

# Запушите на GitHub
git push origin main
```

GitHub Pages автоматически обновится через 1-2 минуты!

---

## 🌐 Альтернативные способы деплоя

### Vercel (ещё быстрее)

```bash
# Установите Vercel CLI
npm i -g vercel

# Перейдите в папку PWA
cd c:\proj\Inspection\PWA

# Задеплойте
vercel --prod
```

Получите ссылку вида: `https://inspection-pwa.vercel.app`

### Netlify Drop (просто перетащите папку)

1. Зайдите на https://app.netlify.com/drop
2. Перетащите папку `PWA` в окно браузера
3. Получите ссылку на сайт

---

## 📊 Мониторинг

### GitHub Actions
https://github.com/YOUR_USERNAME/inspection-pwa/actions

### GitHub Pages
https://github.com/YOUR_USERNAME/inspection-pwa/settings/pages

---

## ✅ Чек-лист

- [ ] Создан репозиторий на GitHub
- [ ] Код запушен (`git push`)
- [ ] Включены GitHub Pages в Settings
- [ ] Сайт открывается по ссылке
- [ ] Ссылка работает на мобильном
- [ ] Приложение устанавливается на телефон

---

**Готово! 🎉**

Ваше приложение доступно всем пользователям!