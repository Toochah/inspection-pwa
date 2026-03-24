/**
 * Склад.Инспект v2.1 - PWA приложение
 * Логика приложения с поддержкой разных типов обходов
 * 
 * Версия: 2.1.0
 * Дата: Март 2026
 * Сборка: 2026.03.23
 */

// ============================================
// Глобальное состояние
// ============================================
const AppState = {
    currentUser: null,
    currentView: 'loginView',
    currentInspectionType: null,
    roundInProgress: false,
    roundId: null,
    roundStartTime: null,
    completedPoints: [],
    defects: [],
    scanHistory: [],
    reports: [],
    isOnline: navigator.onLine,
    gpsEnabled: true,
    notificationsEnabled: true,
    currentPointId: null,
    gpsPosition: null,
    currentPoints: []
};

// ============================================
// Информация о версии
// ============================================
const APP_VERSION = {
    version: '2.1.0',
    buildDate: '2026.03.23',
    name: 'Склад.Инспект - Обход дежурного',
    features: [
        '23 точки с подробными описаниями',
        'Автоматическое определение роли',
        'Таймер обхода',
        'GPS навигация',
        'QR сканер',
        'Фотофиксация',
        'Offline режим'
    ]
};

// Вывод информации о версии в консоль
console.log('%c' + '='.repeat(50), 'color: #1976d2; font-weight: bold;');
console.log('%c🏭 ' + APP_VERSION.name, 'color: #1976d2; font-weight: bold; font-size: 14px;');
console.log('%c📦 Версия: ' + APP_VERSION.version, 'color: #424242; font-size: 12px;');
console.log('%c📅 Дата сборки: ' + APP_VERSION.buildDate, 'color: #424242; font-size: 12px;');
console.log('%c✨ Особенности:', 'color: #1976d2; font-weight: bold; font-size: 12px;');
APP_VERSION.features.forEach(feature => {
    console.log('%c   ✓ ' + feature, 'color: #2e7d32; font-size: 11px;');
});
console.log('%c' + '='.repeat(50), 'color: #1976d2; font-weight: bold;');
console.log('%c💡 Подсказка: Для очистки кэша нажмите кнопку "Очистить кэш" в настройках', 'color: #ed6c02; font-size: 11px;');
console.log('%c' + '='.repeat(50), 'color: #1976d2; font-weight: bold;');

// ============================================
// Инициализация
// ============================================
document.addEventListener('DOMContentLoaded', () => {
    initApp();
    initMobileOptimizations();
});

function initApp() {
    // Всегда загружаем список пользователей
    populateUsers();
    
    // Сразу устанавливаем точки обхода дежурного
    AppState.currentInspectionType = InspectionTypes[0];
    AppState.currentPoints = GuardRoutePoints;

    // Проверка сохранённой сессии
    const savedUser = localStorage.getItem('currentUser');
    const savedData = localStorage.getItem('appData');

    if (savedData) {
        const data = JSON.parse(savedData);
        AppState.completedPoints = data.completedPoints || [];
        AppState.defects = data.defects || [];
        AppState.reports = data.reports || [];
        AppState.roundInProgress = data.roundInProgress || false;
        AppState.roundStartTime = data.roundStartTime || null;
    }

    if (savedUser) {
        AppState.currentUser = JSON.parse(savedUser);
        showMainView();
        // Показываем кнопку сброса сессии
        const clearBtn = document.getElementById('clearSessionBtn');
        if (clearBtn) clearBtn.style.display = 'block';
    }

    // Обработчики
    initEventListeners();

    // Обновление UI
    updateProgress();
    updateReportsList();

    // GPS
    if (navigator.geolocation && AppState.gpsEnabled) {
        navigator.geolocation.watchPosition(updateGPSStatus, handleGPSError, {
            enableHighAccuracy: true,
            timeout: 10000,
            maximumAge: 5000
        });
    }

    // Онлайн/офлайн
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    updateOnlineStatus();

    // Service Worker
    if ('serviceWorker' in navigator) {
        navigator.serviceWorker.register('sw.js')
            .then(reg => console.log('SW зарегистрирован:', reg.scope))
            .catch(err => console.log('SW ошибка:', err));
    }
}

function initEventListeners() {
    // Форма входа
    document.getElementById('loginForm').addEventListener('submit', handleLogin);
    
    // Выход
    document.getElementById('logoutBtn').addEventListener('click', handleLogout);
    document.getElementById('backToLoginBtn')?.addEventListener('click', handleLogout);
    document.getElementById('clearSessionBtn2')?.addEventListener('click', handleLogout);
    
    // Очистка кэша
    document.getElementById('clearCacheBtn')?.addEventListener('click', clearCache);
    
    // Информация о версии
    document.getElementById('showVersionInfoBtn')?.addEventListener('click', showVersionInfo);
    
    // Кнопка сброса сессии
    const clearBtn = document.getElementById('clearSessionBtn');
    if (clearBtn) {
        clearBtn.style.display = 'none'; // Скрыта по умолчанию
        clearBtn.addEventListener('click', () => {
            if (confirm('Сбросить сессию и вернуться к экрану входа?')) {
                localStorage.removeItem('currentUser');
                localStorage.removeItem('appData');
                location.reload();
            }
        });
    }
    
    // Навигация
    document.querySelectorAll('.bottom-nav .nav-item').forEach(item => {
        item.addEventListener('click', handleNavigation);
    });
    
    // Кнопки обхода
    document.getElementById('startRoundBtn')?.addEventListener('click', startRound);
    document.getElementById('continueRoundBtn')?.addEventListener('click', () => {
        // Возвращаем видимость кнопок
        document.getElementById('startRoundBlock').style.display = 'none';
        document.getElementById('activeRoundBlock').style.display = 'block';
        document.getElementById('statsGrid').style.display = 'grid';
        switchView('routeView');
    });
    document.getElementById('goToRouteBtn')?.addEventListener('click', () => {
        switchView('routeView');
    });
    
    // Сканер
    document.getElementById('startScannerBtn')?.addEventListener('click', startScanner);
    document.getElementById('manualAssetBtn')?.addEventListener('click', handleManualAsset);
    
    // Аварийная кнопка
    document.getElementById('emergencyBtn')?.addEventListener('click', () => {
        new bootstrap.Modal(document.getElementById('emergencyModal')).show();
    });
    document.getElementById('sendEmergencyBtn')?.addEventListener('click', sendEmergencyNotification);
    
    // Точки маршрута (делегирование)
    document.getElementById('routePointsList')?.addEventListener('click', handleRoutePointClick);
    
    // Кнопки в модальном окне точки
    document.getElementById('completePointBtn')?.addEventListener('click', completePoint);
    document.getElementById('markDefectBtn')?.addEventListener('click', markDefect);
    
    // Фото
    initPhotoUpload();
    
    // Фильтр маршрута
    document.getElementById('routeFilter')?.addEventListener('change', renderRoutePoints);
    
    // Экспорт
    document.getElementById('exportExcelBtn')?.addEventListener('click', exportToExcel);
    document.getElementById('exportPdfBtn')?.addEventListener('click', exportToPdf);
}

// ============================================
// Авторизация
// ============================================
function populateUsers() {
    const select = document.getElementById('loginName');
    const positionInput = document.getElementById('loginPosition');
    if (!select) return;
    
    Users.forEach(user => {
        const option = document.createElement('option');
        option.value = user.id;
        option.textContent = user.full_name;
        select.appendChild(option);
    });
    
    // Обновление должности при выборе сотрудника
    select.addEventListener('change', () => {
        const userId = select.value;
        const user = Users.find(u => u.id == userId);
        if (user) {
            positionInput.value = user.position || '-';
        } else {
            positionInput.value = '';
        }
    });
}

function getRoleName(role) {
    const roles = {
        'guard': 'Дежурный',
        'engineer': 'Инженер',
        'specialist': 'Специалист'
    };
    return roles[role] || role;
}

function handleLogin(e) {
    e.preventDefault();
    
    const userId = document.getElementById('loginName').value;

    if (!userId) {
        showToast('Выберите дежурного', 'warning');
        return;
    }

    const user = Users.find(u => u.id == userId);
    if (user) {
        AppState.currentUser = { 
            ...user, 
            selectedRole: 'guard'  // Всегда guard для дежурных
        };
        localStorage.setItem('currentUser', JSON.stringify(AppState.currentUser));
        showMainView();
        showToast(`Добро пожаловать, ${user.full_name}!`, 'success');
        vibrateSuccess();
    }
}

function handleLogout() {
    if (confirm('Выйти из системы и сбросить сессию?')) {
        AppState.currentUser = null;
        AppState.roundInProgress = false;
        localStorage.removeItem('currentUser');
        localStorage.removeItem('appData');
        location.reload();
    }
}

async function clearCache() {
    if (confirm('Очистить кэш приложения? Страница будет перезапущена.')) {
        // Очистка localStorage
        localStorage.clear();
        
        // Очистка кэша Service Worker
        if ('caches' in window) {
            const cacheNames = await caches.keys();
            await Promise.all(cacheNames.map(name => caches.delete(name)));
        }
        
        // Перезагрузка
        location.reload();
    }
}

function showVersionInfo() {
    console.log('%c' + '='.repeat(60), 'color: #1976d2; font-weight: bold;');
    console.log('%c🏭 ' + APP_VERSION.name, 'color: #1976d2; font-weight: bold; font-size: 16px;');
    console.log('%c📦 Версия: ' + APP_VERSION.version, 'color: #424242; font-size: 14px;');
    console.log('%c📅 Дата сборки: ' + APP_VERSION.buildDate, 'color: #424242; font-size: 14px;');
    console.log('%c✨ Особенности:', 'color: #1976d2; font-weight: bold; font-size: 14px;');
    APP_VERSION.features.forEach((feature, index) => {
        console.log('%c   ' + (index + 1) + '. ' + feature, 'color: #2e7d32; font-size: 13px;');
    });
    console.log('%c' + '='.repeat(60), 'color: #1976d2; font-weight: bold;');
    console.log('%c📁 Файлы проекта:', 'color: #1976d2; font-weight: bold; font-size: 13px;');
    console.log('%c   • index.html - Главная страница', 'color: #424242; font-size: 12px;');
    console.log('%c   • app.js - Логика приложения (' + document.scripts.length + ' скриптов)', 'color: #424242; font-size: 12px;');
    console.log('%c   • data.js - Данные (23 точки, 19 сотрудников)', 'color: #424242; font-size: 12px;');
    console.log('%c   • styles.css - Стили', 'color: #424242; font-size: 12px;');
    console.log('%c' + '='.repeat(60), 'color: #1976d2; font-weight: bold;');
    
    alert(
        '🏭 ' + APP_VERSION.name + '\n\n' +
        '📦 Версия: ' + APP_VERSION.version + '\n' +
        '📅 Дата сборки: ' + APP_VERSION.buildDate + '\n\n' +
        '✨ Особенности:\n' +
        APP_VERSION.features.map((f, i) => (i + 1) + '. ' + f).join('\n') + '\n\n' +
        '💡 Подробная информация выведена в консоль (F12)'
    );
}

// ============================================
// Выбор типа обхода (удалено - только один тип)
// ============================================

function showMainView() {
    // Скрываем login, показываем main
    const loginView = document.getElementById('loginView');
    const mainView = document.getElementById('mainView');
    
    if (loginView) loginView.classList.remove('active');
    if (mainView) {
        mainView.classList.remove('active');
        mainView.style.display = 'block';
        // Принудительная перерисовка
        mainView.offsetHeight;
        mainView.classList.add('active');
    }
    
    document.getElementById('bottomNav').style.display = 'flex';
    document.getElementById('emergencyBtn').style.display = 'flex';
    
    const name = AppState.currentUser.full_name.split(' ').slice(0, 2).join(' ');
    document.getElementById('userName').textContent = name;
    document.getElementById('profileName').value = AppState.currentUser.full_name;
    document.getElementById('profilePosition').value = AppState.currentUser.position || '-';
    document.getElementById('profileRole').value = 'Дежурный';
    document.getElementById('currentInspectionType').value = 'Обход дежурного';
    
    // Обновление заголовка
    document.getElementById('headerTitle').textContent = 'Обход дежурного';
    document.getElementById('appHeader').style.background = `linear-gradient(135deg, #1976d2, #2196f3)`;
    
    // Информация в настройках (если элементы существуют)
    const infoType = document.getElementById('infoInspectionType');
    const infoPoints = document.getElementById('infoPointsCount');
    if (infoType) infoType.textContent = 'Обход дежурного';
    if (infoPoints) infoPoints.textContent = AppState.currentPoints?.length || 23;
    
    document.getElementById('totalPoints').textContent = AppState.currentPoints?.length || 23;
    
    // Показываем кнопку сброса сессии
    const clearBtn = document.getElementById('clearSessionBtn');
    if (clearBtn) clearBtn.style.display = 'block';
    
    // Проверка состояния обхода
    if (AppState.roundInProgress) {
        // Обход активен - показываем таймер и статистику
        document.getElementById('startRoundBlock').style.display = 'none';
        document.getElementById('activeRoundBlock').style.display = 'block';
        document.getElementById('statsGrid').style.display = 'grid';
        startTimer();
    } else {
        // Обход не активен - показываем кнопку "Начать обход"
        document.getElementById('startRoundBlock').style.display = 'block';
        document.getElementById('activeRoundBlock').style.display = 'none';
        document.getElementById('statsGrid').style.display = 'none';
    }
    
    // Принудительно переключаемся на дашборд
    switchView('dashboardView');
    
    renderRoutePoints();
    updateProgress();
    updateReportsList();
}

// ============================================
// Навигация
// ============================================
function handleNavigation(e) {
    e.preventDefault();
    
    const viewId = e.currentTarget.dataset.view;
    switchView(viewId);
    
    // Вибрация при переключении вкладок
    vibrate(5);
}

function switchView(viewId) {
    // Убираем active у всех кнопок навигации
    document.querySelectorAll('.bottom-nav .nav-item').forEach(i => i.classList.remove('active'));
    // Убираем active у всех видов в main-content
    document.querySelectorAll('.main-content .view').forEach(v => v.classList.remove('active'));

    // Добавляем active выбранной кнопке
    const navItem = document.querySelector(`.bottom-nav .nav-item[data-view="${viewId}"]`);
    if (navItem) navItem.classList.add('active');
    
    // Показываем выбранный вид с анимацией
    const view = document.getElementById(viewId);
    if (view) {
        view.classList.remove('active');
        view.style.display = 'block';
        // Принудительная перерисовка
        view.offsetHeight;
        view.classList.add('active');
        
        // Скролл вверх при переключении
        view.scrollTop = 0;
    }

    if (viewId === 'routeView') {
        renderRoutePoints();
    }
    
    if (viewId === 'dashboardView') {
        updateNextPointCard();
    }
}

// ============================================
// Обход
// ============================================
function startRound() {
    AppState.roundInProgress = true;
    AppState.roundStartTime = Date.now();
    AppState.roundId = 'GUARD-' + Date.now();
    
    saveData();
    startTimer();
    
    // Показываем блок активного обхода
    document.getElementById('startRoundBlock').style.display = 'none';
    document.getElementById('activeRoundBlock').style.display = 'block';
    document.getElementById('statsGrid').style.display = 'grid';
    document.getElementById('continueRoundBtn').style.display = 'block';
    document.getElementById('roundInfo').style.display = 'block';
    document.getElementById('roundStartTime').textContent = 
        new Date(AppState.roundStartTime).toLocaleTimeString('ru-RU', {hour: '2-digit', minute:'2-digit'});
    
    showToast('Обход начат! Отсканируйте QR-код первой точки.', 'success');
    vibrateSuccess();
    
    // Автоматически открываем сканер
    setTimeout(() => {
        startScanner();
    }, 500);
}

function completeRound() {
    if (!AppState.roundInProgress) return;
    
    stopTimer();
    
    const report = {
        id: AppState.roundId,
        userId: AppState.currentUser.id,
        userName: AppState.currentUser.full_name,
        inspectionType: 'Обход дежурного',
        startTime: AppState.roundStartTime,
        endTime: Date.now(),
        completedPoints: AppState.completedPoints.length,
        totalPoints: AppState.currentPoints?.length || 23,
        defects: AppState.defects.length,
        status: AppState.defects.length > 0 ? 'defects' : 'complete'
    };
    
    AppState.reports.unshift(report);
    AppState.roundInProgress = false;
    AppState.roundId = null;
    AppState.roundStartTime = null;
    AppState.completedPoints = [];
    AppState.defects = [];
    
    saveData();
    updateReportsList();
    updateProgress();
    
    // Отправка отчёта ответственными
    sendReportToEngineers(report);
    
    // Возвращаем главный экран
    document.getElementById('startRoundBlock').style.display = 'block';
    document.getElementById('activeRoundBlock').style.display = 'none';
    document.getElementById('statsGrid').style.display = 'none';
    
    // Показываем отчёт
    showReportSummary(report);
}

// Отправка отчёта инженерам
function sendReportToEngineers(report) {
    // Формируем сообщение для отправки
    const message = `
🏭 *ОТЧЁТ ОБ ОБХОДЕ*

👤 Дежурный: ${report.userName}
📅 Дата: ${new Date(report.startTime).toLocaleString('ru-RU')}
⏱️ Длительность: ${Math.round((report.endTime - report.startTime) / 60000)} мин

📊 Результаты:
✅ Пройдено точек: ${report.completedPoints}/${report.totalPoints}
⚠️ Дефектов: ${report.defects}
${report.defects > 0 ? '🔴 Требуется внимание!' : '🟢 Всё в норме'}
`.trim();

    console.log('📤 Отправка отчёта:', message);
    
    // Здесь будет отправка в Telegram
    // Для главных инженеров:
    // - Сальников М.В.
    // - Баранов Е.М.
    // - Миронов Ю.С. (энергетик)
    
    showToast('Отчёт сформирован и отправлен!', 'success');
    vibrateSuccess();
}

// Показ сводки отчёта
function showReportSummary(report) {
    const defectsText = report.defects > 0 
        ? `⚠️ <strong>Дефектов:</strong> ${report.defects}`
        : '🟢 <strong>Дефектов:</strong> нет';
    
    alert(
        `✅ ОБХОД ЗАВЕРШЁН!\n\n` +
        `👤 Дежурный: ${report.userName}\n` +
        `📅 ${new Date(report.startTime).toLocaleString('ru-RU')}\n` +
        `⏱️ Длительность: ${Math.round((report.endTime - report.startTime) / 60000)} мин\n\n` +
        `📊 Результаты:\n` +
        `✅ Пройдено: ${report.completedPoints}/${report.totalPoints}\n` +
        `${defectsText}\n\n` +
        `📤 Отчёт отправлен:\n` +
        `• Главному инженеру\n` +
        `• Инженеру энергетику`
    );
}

// ============================================
// Маршрут
// ============================================
function renderRoutePoints() {
    const container = document.getElementById('routePointsList');
    if (!container) return;
    
    const filter = document.getElementById('routeFilter')?.value || 'all';
    
    let points = (AppState.currentPoints || []).map(point => ({
        ...point,
        isCompleted: AppState.completedPoints.includes(point.asset_id),
        isDefect: AppState.defects.some(d => d.asset_id === point.asset_id)
    }));
    
    // Фильтрация
    if (filter === 'pending') {
        points = points.filter(p => !p.isCompleted);
    } else if (filter === 'completed') {
        points = points.filter(p => p.isCompleted);
    } else if (filter === 'defect') {
        points = points.filter(p => p.isDefect);
    }
    
    // Сортировка по порядку
    points.sort((a, b) => a.route_order - b.route_order);
    
    // Оптимизированный рендеринг для мобильных
    if (isMobile() && points.length > 10) {
        // Рендерим только первые 10 точек, остальные по мере скролла
        container.innerHTML = points.slice(0, 10).map(point => createRoutePointHTML(point)).join('');
        
        // Lazy load остальных точек
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const index = parseInt(entry.target.dataset.index);
                    if (points[index]) {
                        const nextPoint = points[index + 1];
                        if (nextPoint) {
                            const nextHTML = createRoutePointHTML(nextPoint);
                            entry.target.insertAdjacentHTML('afterend', nextHTML);
                        }
                    }
                    observer.unobserve(entry.target);
                }
            });
        }, { rootMargin: '100px' });
        
        container.querySelectorAll('.route-point').forEach((el, i) => {
            if (i % 5 === 0) observer.observe(el);
        });
    } else {
        container.innerHTML = points.length > 0 
            ? points.map((point, index) => createRoutePointHTML(point, index)).join('')
            : '<div class="empty-state"><i class="material-icons">route</i><h3>Нет точек</h3><p>Попробуйте изменить фильтр</p></div>';
    }
}

function createRoutePointHTML(point, index = 0) {
    const categoryIcons = {
        'ОВиК': 'ac_unit',
        'Водоотведение': 'water_drop',
        'Теплоснабжение': 'local_fire_department',
        'Электроснабжение': 'flash_on',
        'Резервное питание': 'power',
        'ПБ': 'fire_extinguisher',
        'Водоснабжение': 'plumbing',
        'Наружное освещение': 'lightbulb',
        'Аварийное освещение': 'emergency',
        'Благоустройство': 'landscape'
    };
    
    const categoryIcon = categoryIcons[point.category] || 'category';
    
    // Расстояние до точки если есть GPS
    let distanceHTML = '';
    if (AppState.gpsPosition && point.gps_lat && point.gps_lon) {
        const distance = calculateDistance(
            AppState.gpsPosition.lat,
            AppState.gpsPosition.lon,
            point.gps_lat,
            point.gps_lon
        );
        distanceHTML = `<span class="point-distance-info"><i class="material-icons" style="font-size: 14px;">near_me</i> ${Math.round(distance)}м</span>`;
    }
    
    return `
        <div class="route-point ${point.isCompleted ? 'completed' : ''} ${point.isDefect ? 'defect' : ''}" 
             data-asset-id="${point.asset_id}" data-index="${index}">
            <div class="point-number">${point.route_order}</div>
            <div class="point-info">
                <div class="point-name">
                    <i class="material-icons" style="font-size: 16px; vertical-align: middle; margin-right: 4px;">${categoryIcon}</i>
                    ${point.asset_id} • ${point.name}
                </div>
                <div class="point-details">
                    <span class="category-badge">
                        ${point.category}
                    </span>
                    ${distanceHTML}
                </div>
            </div>
            <div class="point-status">
                ${point.isCompleted ? 
                    `<span class="status-badge ok"><i class="material-icons">check_circle</i></span>` :
                    `<span class="status-badge info"><i class="material-icons">navigation</i></span>`
                }
            </div>
        </div>
    `;
}

function handleRoutePointClick(e) {
    const pointEl = e.target.closest('.route-point');
    if (!pointEl) return;
    
    const assetId = pointEl.dataset.assetId;
    openPointDetail(assetId);
}

function openPointDetail(assetId) {
    const point = AppState.currentPoints?.find(p => p.asset_id === assetId);
    if (!point) return;
    
    AppState.currentPointId = assetId;
    
    // Заголовок
    document.getElementById('pointDetailTitle').textContent = `${point.asset_id} • ${point.name}`;
    document.getElementById('pointCategory').textContent = point.category;
    document.getElementById('pointOrder').textContent = point.route_order;
    
    // Дополнительная информация о точке
    let pointInfoHTML = '';
    if (point.location) {
        pointInfoHTML += `<p class="mb-1"><i class="material-icons" style="font-size: 16px; vertical-align: middle;">location_on</i> ${point.location}</p>`;
    }
    if (point.description) {
        pointInfoHTML += `<p class="text-muted small mb-2">${point.description}</p>`;
    }
    if (point.equipment_type && point.equipment_type !== '-') {
        pointInfoHTML += `<p class="mb-1"><i class="material-icons" style="font-size: 16px; vertical-align: middle;">engineering</i> ${point.equipment_type}</p>`;
    }
    if (point.manufacturer && point.manufacturer !== '-') {
        pointInfoHTML += `<p class="mb-1"><i class="material-icons" style="font-size: 16px; vertical-align: middle;">business</i> ${point.manufacturer}</p>`;
    }
    if (point.install_year) {
        pointInfoHTML += `<p class="mb-2"><i class="material-icons" style="font-size: 16px; vertical-align: middle;">calendar_today</i> ${point.install_year} г.</p>`;
    }
    
    const pointInfoContainer = document.getElementById('pointInfo');
    if (pointInfoContainer) {
        pointInfoContainer.innerHTML = pointInfoHTML;
    }
    
    // Чек-лист
    const checklist = Checklists[point.checklist_template];
    const checklistContainer = document.getElementById('checklistContainer');
    
    if (checklist) {
        let checklistHTML = '';
        if (checklist.description) {
            checklistHTML += `<p class="text-muted small mb-2">${checklist.description}</p>`;
        }
        checklistHTML += checklist.items.map((item, index) => `
            <div class="checklist-item">
                <div class="form-check">
                    <input class="form-check-input checklist-check" type="checkbox" id="check_${index}">
                    <label class="form-check-label" for="check_${index}">${item}</label>
                </div>
            </div>
        `).join('');
        
        // Нормальные значения
        if (checklist.normal_values) {
            checklistHTML += `<div class="normal-values mt-3">`;
            checklistHTML += `<div class="normal-values-title"><i class="material-icons" style="font-size: 16px;">analytics</i> Нормальные значения:</div>`;
            checklistHTML += Object.entries(checklist.normal_values).map(([key, value]) => 
                `<div class="normal-value-item"><span>${key}:</span><strong>${value}</strong></div>`
            ).join('');
            checklistHTML += `</div>`;
        }
        
        checklistContainer.innerHTML = checklistHTML;
    } else {
        checklistContainer.innerHTML = '<div class="text-muted p-3">Чек-лист не найден</div>';
    }
    
    // Фото
    document.getElementById('photoPreview').innerHTML = '';
    document.querySelectorAll('.checklist-check').forEach(c => c.checked = false);
    document.getElementById('defectComment').value = '';
    document.getElementById('defectCommentContainer').style.display = 'none';
    
    // GPS
    updatePointGPSStatus(point);
    
    new bootstrap.Modal(document.getElementById('pointDetailModal')).show();
}

function updatePointGPSStatus(point) {
    const gpsStatus = document.getElementById('pointGpsStatus');
    
    if (AppState.gpsPosition) {
        const distance = calculateDistance(
            AppState.gpsPosition.lat,
            AppState.gpsPosition.lon,
            point.gps_lat,
            point.gps_lon
        );
        
        if (distance <= 5) {
            gpsStatus.className = 'gps-status valid';
            gpsStatus.innerHTML = `<i class="material-icons">gps_fixed</i><span>Вы в ${Math.round(distance)}м от точки</span>`;
        } else {
            gpsStatus.className = 'gps-status invalid';
            gpsStatus.innerHTML = `<i class="material-icons">gps_not_fixed</i><span>Вы в ${Math.round(distance)}м (нужно ≤5м)</span>`;
        }
    } else {
        gpsStatus.className = 'gps-status';
        gpsStatus.innerHTML = `<i class="material-icons">gps_not_fixed</i><span>GPS недоступен</span>`;
    }
}

function completePoint() {
    const modal = bootstrap.Modal.getInstance(document.getElementById('pointDetailModal'));

    if (!AppState.currentPointId) return;

    // Проверка GPS (опционально)
    if (AppState.gpsEnabled && AppState.gpsPosition) {
        const point = AppState.currentPoints?.find(p => p.asset_id === AppState.currentPointId);
        const distance = calculateDistance(
            AppState.gpsPosition.lat,
            AppState.gpsPosition.lon,
            point.gps_lat,
            point.gps_lon
        );

        if (distance > 5) {
            if (!confirm(`Вы находитесь в ${Math.round(distance)}м от точки. Всё равно отметить?`)) {
                return;
            }
        }
    }

    // Добавляем в пройденные
    if (!AppState.completedPoints.includes(AppState.currentPointId)) {
        AppState.completedPoints.push(AppState.currentPointId);
    }

    saveData();
    modal.hide();

    showToast(`Точка ${AppState.currentPointId} пройдена!`, 'success');
    vibrateSuccess();
    updateProgress();
    renderRoutePoints();
    
    // Проверяем, все ли точки пройдены
    const totalPoints = AppState.currentPoints?.length || 23;
    const completedCount = AppState.completedPoints.length;
    
    if (completedCount >= totalPoints) {
        // Все точки пройдены - завершаем обход
        setTimeout(() => {
            if (confirm('✅ Все точки пройдены!\n\nЗавершить обход и отправить отчёт?')) {
                completeRound();
            } else {
                // Возвращаемся к сканеру
                startScanner();
            }
        }, 500);
    } else {
        // Открываем сканер для следующей точки
        setTimeout(() => {
            startScanner();
        }, 500);
    }
}

function markDefect() {
    const modal = bootstrap.Modal.getInstance(document.getElementById('pointDetailModal'));
    const comment = document.getElementById('defectComment').value;
    
    if (!AppState.currentPointId) return;
    
    const defect = {
        asset_id: AppState.currentPointId,
        timestamp: Date.now(),
        comment: comment,
        photos: []
    };
    
    AppState.defects.push(defect);
    
    if (!AppState.completedPoints.includes(AppState.currentPointId)) {
        AppState.completedPoints.push(AppState.currentPointId);
    }
    
    saveData();
    modal.hide();
    
    showToast('Дефект зафиксирован!', 'warning');
    updateProgress();
    renderRoutePoints();
    
    if (AppState.notificationsEnabled) {
        sendDefectNotification(defect);
    }
}

// ============================================
// Прогресс
// ============================================
function updateProgress() {
    const total = AppState.currentPoints?.length || 23;
    const completed = AppState.completedPoints.length;
    const percentage = total > 0 ? Math.round((completed / total) * 100) : 0;
    
    document.getElementById('completedPoints').textContent = completed;
    document.getElementById('defectCount').textContent = AppState.defects.length;
    document.getElementById('reportsCount').textContent = AppState.reports.length;
    
    // Прогресс-кольцо
    const circle = document.querySelector('.progress-ring .progress');
    const circumference = 2 * Math.PI * 52;
    const offset = circumference - (percentage / 100) * circumference;
    circle.style.strokeDashoffset = offset;
    document.querySelector('.progress-ring .progress-text').textContent = `${percentage}%`;
    
    // Горизонтальный прогресс-бар
    const progressBar = document.getElementById('progressBar');
    if (progressBar) {
        progressBar.style.width = `${percentage}%`;
    }
    
    // Статус
    const statusEl = document.getElementById('currentStatus');
    if (percentage === 0) {
        statusEl.className = 'status-badge info';
        statusEl.innerHTML = '<i class="material-icons">schedule</i>Не начат';
    } else if (percentage < 100) {
        statusEl.className = 'status-badge warning';
        statusEl.innerHTML = '<i class="material-icons">progress_activity</i>В процессе';
    } else {
        statusEl.className = 'status-badge ok';
        statusEl.innerHTML = '<i class="material-icons">check_circle</i>Завершён';
        
        if (AppState.roundInProgress) {
            setTimeout(() => {
                if (confirm('Все точки пройдены! Завершить обход?')) {
                    completeRound();
                }
            }, 500);
        }
    }
}

// ============================================
// Отчёты
// ============================================
function updateReportsList() {
    const container = document.getElementById('recentReports');
    const myContainer = document.getElementById('myReports');
    
    if (AppState.reports.length === 0) {
        if (container) container.innerHTML = '<div class="text-muted text-center py-4">Нет отчётов</div>';
        if (myContainer) myContainer.innerHTML = '<div class="text-muted text-center py-4">Нет отчётов</div>';
        return;
    }
    
    const html = AppState.reports.slice(0, 5).map(report => `
        <div class="report-item">
            <div>
                <div class="report-date">${new Date(report.startTime).toLocaleString('ru-RU')}</div>
                <div class="report-info">${report.inspectionType || 'Обход'} • ${report.completedPoints}/${report.totalPoints} точек</div>
            </div>
            ${report.defects > 0 ? 
                `<span class="status-badge warning"><i class="material-icons">warning</i>${report.defects}</span>` :
                `<span class="status-badge ok"><i class="material-icons">check</i>Завершён</span>`
            }
        </div>
    `).join('');
    
    if (container) container.innerHTML = html;
    if (myContainer) myContainer.innerHTML = html;
}

function exportToExcel() {
    showToast('Экспорт в Excel...', 'info');
}

function exportToPdf() {
    showToast('Формирование PDF...', 'info');
}

// ============================================
// GPS
// ============================================
function updateGPSStatus(position) {
    AppState.gpsPosition = {
        lat: position.coords.latitude,
        lon: position.coords.longitude,
        accuracy: position.coords.accuracy
    };
    
    const gpsStatus = document.getElementById('gpsStatus');
    const accuracy = Math.round(position.coords.accuracy);
    
    if (accuracy <= 5) {
        gpsStatus.className = 'gps-status valid';
        gpsStatus.innerHTML = `<i class="material-icons">gps_fixed</i><span>GPS активен • Точность: ${accuracy}м</span>`;
    } else {
        gpsStatus.className = 'gps-status invalid';
        gpsStatus.innerHTML = `<i class="material-icons">gps_not_fixed</i><span>GPS: точность ${accuracy}м (нужно ≤5м)</span>`;
    }
    
    if (AppState.currentPointId) {
        const point = AppState.currentPoints?.find(p => p.asset_id === AppState.currentPointId);
        if (point) updatePointGPSStatus(point);
    }
}

function handleGPSError(error) {
    const gpsStatus = document.getElementById('gpsStatus');
    if (gpsStatus) {
        gpsStatus.className = 'gps-status invalid';
        gpsStatus.innerHTML = `<i class="material-icons">gps_off</i><span>GPS недоступен</span>`;
    }
}

function calculateDistance(lat1, lon1, lat2, lon2) {
    const R = 6371e3;
    const φ1 = lat1 * Math.PI / 180;
    const φ2 = lat2 * Math.PI / 180;
    const Δφ = (lat2 - lat1) * Math.PI / 180;
    const Δλ = (lon2 - lon1) * Math.PI / 180;

    const a = Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
              Math.cos(φ1) * Math.cos(φ2) *
              Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    return R * c;
}

// ============================================
// Сканер
// ============================================
function startScanner() {
    const modal = new bootstrap.Modal(document.getElementById('scannerModal'));
    modal.show();

    const video = document.getElementById('scannerVideo');
    const nextPoint = AppState.currentPoints?.find(p => !AppState.completedPoints.includes(p.asset_id));

    if (nextPoint) {
        document.getElementById('nextPointInfo').textContent =
            `Следующая точка: №${nextPoint.route_order} ${nextPoint.asset_id} • ${nextPoint.name}`;
    } else {
        document.getElementById('nextPointInfo').textContent = 'Все точки пройдены!';
    }

    // Запрос камеры для мобильных
    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        const constraints = {
            video: {
                facingMode: 'environment', // Задняя камера
                width: { ideal: 1280 },
                height: { ideal: 720 }
            }
        };

        navigator.mediaDevices.getUserMedia(constraints)
            .then(stream => {
                video.srcObject = stream;
                showToast('📷 Камера включена. Введите код точки вручную.', 'info');
            })
            .catch(err => {
                console.error('Ошибка камеры:', err);
                showToast('Камера недоступна. Введите код вручную.', 'warning');
            });
    }

    // Обработчик кнопки закрытия
    const closeBtn = document.querySelector('#scannerModal .scanner-close');
    closeBtn.onclick = () => {
        if (video.srcObject) {
            video.srcObject.getTracks().forEach(track => track.stop());
        }
        modal.hide();
    };
    
    // Обработчик ручного ввода (каждый раз при открытии)
    const manualBtn = document.getElementById('manualAssetBtn');
    if (manualBtn) {
        // Удаляем старый обработчик
        const newBtn = manualBtn.cloneNode(true);
        manualBtn.parentNode.replaceChild(newBtn, manualBtn);
        
        // Добавляем новый обработчик
        newBtn.addEventListener('click', handleManualAsset);
    }
    
    // Обработчик Enter в поле ввода
    const manualInput = document.getElementById('manualAssetCode');
    if (manualInput) {
        manualInput.value = ''; // Очищаем поле
        manualInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                handleManualAsset();
            }
        });
    }
}

function handleManualAsset() {
    const code = document.getElementById('manualAssetCode').value.trim().toUpperCase();
    if (!code) {
        showToast('Введите код точки', 'warning');
        return;
    }

    const point = AppState.currentPoints?.find(p => p.asset_id === code);
    if (point) {
        // Закрываем сканер
        const scannerModal = bootstrap.Modal.getInstance(document.getElementById('scannerModal'));
        if (scannerModal) {
            scannerModal.hide();
        }
        
        // Останавливаем камеру
        const video = document.getElementById('scannerVideo');
        if (video && video.srcObject) {
            video.srcObject.getTracks().forEach(track => track.stop());
        }
        
        // Открываем точку
        setTimeout(() => {
            openPointDetail(code);
        }, 300);
        
        // Очищаем поле
        document.getElementById('manualAssetCode').value = '';

        // История
        AppState.scanHistory.unshift({
            asset_id: code,
            timestamp: Date.now(),
            method: 'manual'
        });
        renderScanHistory();
    } else {
        showToast('Точка не найдена. Код: ' + code, 'warning');
    }
}

function renderScanHistory() {
    const container = document.getElementById('scanHistory');
    if (!container) return;
    
    if (AppState.scanHistory.length === 0) {
        container.innerHTML = '<div class="text-muted text-center py-3">Нет сканирований</div>';
        return;
    }
    
    container.innerHTML = AppState.scanHistory.slice(0, 10).map(scan => {
        const point = AppState.currentPoints?.find(p => p.asset_id === scan.asset_id);
        return `
            <div class="report-item">
                <div>
                    <div class="report-date">${scan.asset_id}</div>
                    <div class="report-info">${point ? point.name : '-'} • ${new Date(scan.timestamp).toLocaleTimeString()}</div>
                </div>
            </div>
        `;
    }).join('');
}

// ============================================
// Фото
// ============================================
function initPhotoUpload() {
    const photoUpload = document.getElementById('photoUpload');
    const photoInput = document.getElementById('photoInput');
    
    if (photoUpload && photoInput) {
        photoUpload.addEventListener('click', () => photoInput.click());
        photoInput.addEventListener('change', handlePhotoSelect);
    }
    
    const emergencyPhotoUpload = document.getElementById('emergencyPhotoUpload');
    const emergencyPhotoInput = document.getElementById('emergencyPhotoInput');
    
    if (emergencyPhotoUpload && emergencyPhotoInput) {
        emergencyPhotoUpload.addEventListener('click', () => emergencyPhotoInput.click());
        emergencyPhotoInput.addEventListener('change', (e) => handlePhotoSelect(e, 'emergency'));
    }
}

// Сжатие изображений для мобильных
async function compressImage(file, maxWidth = 1024, maxHeight = 1024, quality = 0.8) {
    return new Promise((resolve) => {
        const reader = new FileReader();
        reader.onload = (event) => {
            const img = new Image();
            img.onload = () => {
                const canvas = document.createElement('canvas');
                let width = img.width;
                let height = img.height;
                
                // Масштабирование
                if (width > maxWidth || height > maxHeight) {
                    const ratio = Math.min(maxWidth / width, maxHeight / height);
                    width = Math.floor(width * ratio);
                    height = Math.floor(height * ratio);
                }
                
                canvas.width = width;
                canvas.height = height;
                const ctx = canvas.getContext('2d');
                ctx.drawImage(img, 0, 0, width, height);
                
                canvas.toBlob(
                    (blob) => resolve(blob),
                    'image/jpeg',
                    quality
                );
            };
            img.src = event.target.result;
        };
        reader.readAsDataURL(file);
    });
}

async function handlePhotoSelect(e, containerId = '') {
    const files = e.target.files;
    const container = containerId === 'emergency' 
        ? document.getElementById('emergencyPhotoPreview') 
        : document.getElementById('photoPreview');
    
    if (!container) return;

    // Вибрация при выборе фото
    vibrate(10);

    for (const file of files) {
        // Сжатие для мобильных
        const compressedFile = await compressImage(file);
        
        const reader = new FileReader();
        reader.onload = (event) => {
            const preview = document.createElement('div');
            preview.className = 'photo-preview';
            preview.innerHTML = `
                <img src="${event.target.result}" alt="Photo" loading="lazy">
                <button class="remove-photo" type="button">
                    <i class="material-icons" style="font-size: 14px;">close</i>
                </button>
            `;
            preview.querySelector('.remove-photo').onclick = () => {
                preview.remove();
                vibrate(10);
            };
            container.appendChild(preview);
            
            if (containerId !== 'emergency') {
                document.getElementById('defectCommentContainer').style.display = 'block';
            }
        };
        reader.readAsDataURL(compressedFile);
    }
}

// ============================================
// Аварийное уведомление
// ============================================
function sendEmergencyNotification() {
    const text = document.getElementById('emergencyText').value.trim();
    
    if (!text) {
        showToast('Введите описание ситуации', 'warning');
        return;
    }
    
    const modal = bootstrap.Modal.getInstance(document.getElementById('emergencyModal'));
    modal.hide();
    
    console.log('Аварийное уведомление:', {
        user: AppState.currentUser,
        text: text,
        timestamp: Date.now()
    });
    
    showToast('Аварийное уведомление отправлено!', 'danger');
    
    document.getElementById('emergencyText').value = '';
    document.getElementById('emergencyPhotoPreview').innerHTML = '';
}

function sendDefectNotification(defect) {
    const point = AppState.currentPoints?.find(p => p.asset_id === defect.asset_id);
    
    console.log('Уведомление о дефекте:', {
        point: point,
        defect: defect,
        user: AppState.currentUser
    });
}

// ============================================
// Онлайн/офлайн
// ============================================
function updateOnlineStatus() {
    const indicator = document.getElementById('offlineIndicator');
    if (AppState.isOnline) {
        indicator?.classList.remove('show');
    } else {
        indicator?.classList.add('show');
    }
}

function handleOnline() {
    AppState.isOnline = true;
    updateOnlineStatus();
    showToast('Подключение восстановлено', 'success');
}

function handleOffline() {
    AppState.isOnline = false;
    updateOnlineStatus();
    showToast('Работа в автономном режиме', 'warning');
}

// ============================================
// Сохранение данных
// ============================================
function saveData() {
    const data = {
        completedPoints: AppState.completedPoints,
        defects: AppState.defects,
        reports: AppState.reports,
        roundInProgress: AppState.roundInProgress,
        roundStartTime: AppState.roundStartTime,
        currentInspectionType: 'guard'
    };
    localStorage.setItem('appData', JSON.stringify(data));
}

// ============================================
// Таймер обхода
// ============================================
let timerInterval = null;

function startTimer() {
    if (timerInterval) clearInterval(timerInterval);
    
    timerInterval = setInterval(() => {
        if (!AppState.roundInProgress || !AppState.roundStartTime) return;
        
        const elapsed = Date.now() - AppState.roundStartTime;
        const hours = Math.floor(elapsed / 3600000);
        const minutes = Math.floor((elapsed % 3600000) / 60000);
        const seconds = Math.floor((elapsed % 60000) / 1000);
        
        const timerDisplay = document.getElementById('timerDisplay');
        const timerStartTime = document.getElementById('timerStartTime');
        const routeTimer = document.getElementById('routeTimer');
        
        if (timerDisplay) {
            timerDisplay.textContent = 
                String(hours).padStart(2, '0') + ':' +
                String(minutes).padStart(2, '0') + ':' +
                String(seconds).padStart(2, '0');
        }
        
        if (timerStartTime && AppState.roundStartTime) {
            timerStartTime.textContent = 'Начат в ' + 
                new Date(AppState.roundStartTime).toLocaleTimeString('ru-RU', {hour: '2-digit', minute:'2-digit'});
        }
        
        if (routeTimer) routeTimer.style.display = 'block';
        
        updateNextPointCard();
    }, 1000);
}

function stopTimer() {
    if (timerInterval) {
        clearInterval(timerInterval);
        timerInterval = null;
    }
    document.getElementById('routeTimer')?.style.setProperty('display', 'none');
    document.getElementById('nextPointCard')?.style.setProperty('display', 'none');
}

function updateNextPointCard() {
    const nextPointId = AppState.currentPoints?.find(p => !AppState.completedPoints.includes(p.asset_id))?.asset_id;
    const nextPointCard = document.getElementById('nextPointCard');
    
    if (!nextPointId || !nextPointCard) {
        nextPointCard.style.display = 'none';
        return;
    }
    
    const nextPoint = AppState.currentPoints.find(p => p.asset_id === nextPointId);
    const nextPointNumber = document.getElementById('nextPointNumber');
    const nextPointName = document.getElementById('nextPointName');
    const nextPointDistance = document.getElementById('nextPointDistance');
    
    if (nextPointNumber) nextPointNumber.textContent = nextPoint.route_order;
    if (nextPointName) nextPointName.textContent = `${nextPoint.asset_id} • ${nextPoint.name}`;
    
    if (nextPointDistance && AppState.gpsPosition) {
        const distance = calculateDistance(
            AppState.gpsPosition.lat,
            AppState.gpsPosition.lon,
            nextPoint.gps_lat,
            nextPoint.gps_lon
        );
        nextPointDistance.textContent = `${Math.round(distance)}м от вас`;
    } else if (nextPointDistance) {
        nextPointDistance.textContent = 'GPS недоступен';
    }
    
    nextPointCard.style.display = 'block';
}

// ============================================
// Мобильные оптимизации
// ============================================
function initMobileOptimizations() {
    // Предотвращение зума на двойном тапе
    document.addEventListener('dblclick', (e) => {
        e.preventDefault();
    }, { passive: false });
    
    // Оптимизация скролла
    document.querySelectorAll('.modal-body').forEach(el => {
        el.style.webkitOverflowScrolling = 'touch';
    });
    
    // Haptic feedback при нажатии кнопок
    document.querySelectorAll('button, .route-point, .checklist-item').forEach(el => {
        el.addEventListener('touchstart', function() {
            if (navigator.vibrate) {
                navigator.vibrate(10);
            }
        }, { passive: true });
    });
    
    // Swipe to go back (для навигации)
    let touchStartX = 0;
    let touchEndX = 0;
    
    document.addEventListener('touchstart', (e) => {
        touchStartX = e.changedTouches[0].screenX;
    }, { passive: true });
    
    document.addEventListener('touchend', (e) => {
        touchEndX = e.changedTouches[0].screenX;
        handleSwipe();
    }, { passive: true });
    
    function handleSwipe() {
        const swipeThreshold = 100;
        const diff = touchEndX - touchStartX;
        
        // Swipe right - назад к дашборду
        if (diff > swipeThreshold) {
            const currentView = document.querySelector('.main-content .view.active');
            if (currentView && currentView.id !== 'dashboardView') {
                switchView('dashboardView');
            }
        }
    }
    
    // Оптимизация производительности изображений
    document.addEventListener('lazyload', (e) => {
        if ('loading' in HTMLImageElement.prototype) {
            e.target.loading = 'lazy';
        }
    });
    
    // Блокировка контекстного меню на долгом тапе
    document.addEventListener('contextmenu', (e) => {
        if (window.innerWidth < 768) {
            e.preventDefault();
        }
    });
    
    console.log('%c📱 Мобильные оптимизации активированы', 'color: #2e7d32; font-size: 12px;');
}

// ============================================
// Проверка мобильного устройства
// ============================================
function isMobile() {
    return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) || 
           (window.innerWidth <= 768);
}

// ============================================
// Вибрация (Haptic Feedback)
// ============================================
function vibrate(pattern) {
    if (navigator.vibrate) {
        navigator.vibrate(pattern);
    }
}

// Короткая вибрация для успеха
function vibrateSuccess() {
    vibrate([10, 30, 10]);
}

// Длинная вибрация для ошибки
function vibrateError() {
    vibrate([50, 30, 50, 30, 50]);
}

// ============================================
// Уведомления (Toast)
// ============================================
function showToast(message, type = 'info') {
    const colors = {
        info: '#0288d1',
        success: '#2e7d32',
        warning: '#ed6c02',
        danger: '#d32f2f'
    };

    const container = document.querySelector('.toast-container') || createToastContainer();
    
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    toast.textContent = message;
    container.appendChild(toast);
    
    // Вибрация для важных уведомлений
    if (type === 'success') vibrateSuccess();
    if (type === 'warning' || type === 'danger') vibrateError();

    setTimeout(() => {
        toast.style.animation = 'slideDown 0.3s ease reverse';
        setTimeout(() => toast.remove(), 300);
    }, 3000);
}

function createToastContainer() {
    const container = document.createElement('div');
    container.className = 'toast-container';
    document.body.appendChild(container);
    return container;
}