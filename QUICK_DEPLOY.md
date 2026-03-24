# ⚡ Быстрый старт - Деплой на GitHub

## 1. Создайте репозиторий

Перейдите и создайте: **https://github.com/new**

Имя: `inspection-pwa`  
Public или Private  
❌ Не инициализировать с README

---

## 2. Запушите код

Откройте PowerShell:

```powershell
cd c:\proj\Inspection

# Замените YOUR_USERNAME на ваш username GitHub
git remote add origin https://github.com/YOUR_USERNAME/inspection-pwa.git

git push -u origin master
```

---

## 3. Включите GitHub Pages

1. Откройте https://github.com/YOUR_USERNAME/inspection-pwa
2. **Settings** → **Pages** (в левом меню)
3. **Source:** Branch → **main** → **Save**

---

## 4. Откройте на мобильном

Через 1-2 минуты сайт будет доступен:

```
https://YOUR_USERNAME.github.io/inspection-pwa/
```

**Откройте эту ссылку на телефоне!**

---

## 📱 Установка на телефон

### Android
1. Откройте ссылку в Chrome
2. Меню (⋮) → **"Установить приложение"**

### iOS
1. Откройте ссылку в Safari
2. **"Поделиться"** → **"На экран «Домой»"**

---

## 🔄 Обновление

После изменений:

```powershell
cd c:\proj\Inspection
git add .
git commit -m "Описание изменений"
git push origin master
```

Обновление через 1-2 минуты автоматически!

---

## ❓ Проблемы

| Проблема | Решение |
|----------|---------|
| Permission denied | Проверьте username в URL |
| 404 ошибка | Подождите 2-3 минуты |
| Не работает на мобильном | Откройте ссылку из GitHub Pages |

---

**Полная инструкция:** [DEPLOY.md](DEPLOY.md)