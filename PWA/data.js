/**
 * Склад.Инспект - Данные для разных типов обходов
 * Объединённые данные из всех проектов
 */

// ============================================
// Пользователи (из spisok.csv)
// ============================================
const Users = [
    { id: 1, full_name: "Сальников Михаил Владимирович", position: "Главный инженер", default_role: "engineer" },
    { id: 2, full_name: "Баранов Евгений Михайлович", position: "Инженер по эксплуатации", default_role: "engineer" },
    { id: 3, full_name: "Акузин Данис Геннадьевич", position: "Техник по обслуживанию электрооборудования", default_role: "specialist" },
    { id: 4, full_name: "Хакимзянов Илшат Шарифзянович", position: "Техник по обслуживанию электрооборудования", default_role: "specialist" },
    { id: 5, full_name: "Зотов Александр Владимирович", position: "Техник по обслуживанию электрооборудования", default_role: "specialist" },
    { id: 6, full_name: "Сергеев Олег Павлович", position: "Техник по обслуживанию электрооборудования", default_role: "specialist" },
    { id: 7, full_name: "Гритчин Андрей Владимирович", position: "Техник по обслуживанию электрооборудования", default_role: "specialist" },
    { id: 8, full_name: "Трегубов Алексей Алексеевич", position: "Техник КиПа", default_role: "specialist" },
    { id: 9, full_name: "Асеев Олег Николаевич", position: "Дворник", default_role: "guard" },
    { id: 10, full_name: "Алексеев Владимир Мингаевич", position: "Слесарь сантехник", default_role: "specialist" },
    { id: 11, full_name: "Хафизов Галим Акрамович", position: "Слесарь сантехник", default_role: "specialist" },
    { id: 12, full_name: "Барыкин Александр Геннадьевич", position: "Слесарь ремонтник", default_role: "specialist" },
    { id: 13, full_name: "Косогоров Сергей Леонидович", position: "Слесарь ремонтник", default_role: "specialist" },
    { id: 14, full_name: "Миронов Юрий Сергеевич", position: "Инженер энергетик", default_role: "engineer" },
    { id: 15, full_name: "Осокин Николай Геннадьевич", position: "Механизатор", default_role: "specialist" },
    { id: 16, full_name: "Шатунов Николай Викторович", position: "Механизатор", default_role: "specialist" },
    { id: 17, full_name: "Биктуганова Кристина Андреевна", position: "Уборщица", default_role: "guard" },
    { id: 18, full_name: "Дильмухаметов Фидан Рафикович", position: "Электромеханик по ВиК", default_role: "specialist" },
    { id: 19, full_name: "Кузнецов Олег Александрович", position: "Дворник", default_role: "guard" }
];

// ============================================
// Типы обходов
// ============================================
const InspectionTypes = [
    {
        id: "guard",
        name: "Обход дежурного",
        description: "Ежедневный обход по 23 точкам с QR-кодами",
        icon: "security",
        color: "#1976d2",
        points_count: 23,
        has_qr: true
    }
];

// ============================================
// 23 точки маршрута дежурного (из assets.json)
// С подробными описаниями
// ============================================
const GuardRoutePoints = [
    { 
        asset_id: "VENT-01", 
        name: "Вентустановка 1", 
        category: "ОВиК", 
        specialist: "hvac_tech", 
        route_order: 1, 
        checklist_template: "visual_hvac_v1", 
        gps_lat: 55.751744, 
        gps_lon: 37.618423,
        description: "Приточная вентустановка в коридоре А. Обслуживает офисные помещения 1 этажа.",
        location: "Коридор А, 1 этаж",
        equipment_type: "Приточная установка",
        manufacturer: "Systemair",
        install_year: 2019
    },
    { 
        asset_id: "KNS-01", 
        name: "КНС 1", 
        category: "Водоотведение", 
        specialist: "plumber", 
        route_order: 2, 
        checklist_template: "visual_kns_v1", 
        gps_lat: 55.752244, 
        gps_lon: 37.618423,
        description: "Канализационная насосная станция №1. Перекачивает сточные воды в центральный коллектор.",
        location: "Подвал, помещение 1",
        equipment_type: "КНС",
        manufacturer: "Grundfos",
        install_year: 2018
    },
    { 
        asset_id: "ITP-01", 
        name: "ИТП 1", 
        category: "Теплоснабжение", 
        specialist: "heat_tech", 
        route_order: 3, 
        checklist_template: "visual_thermal_v1", 
        gps_lat: 55.752744, 
        gps_lon: 37.618423,
        description: "Индивидуальный тепловой пункт №1. Регулирует температуру теплоносителя для системы отопления.",
        location: "Техэтаж, секция 1",
        equipment_type: "ИТП",
        manufacturer: "Danfoss",
        install_year: 2019
    },
    { 
        asset_id: "BOILER-01", 
        name: "Котельная", 
        category: "Теплоснабжение", 
        specialist: "heat_tech", 
        route_order: 4, 
        checklist_template: "visual_thermal_v1", 
        gps_lat: 55.753244, 
        gps_lon: 37.618423,
        description: "Газовая котельная. Резервный источник тепла для здания.",
        location: "Отдельное строение",
        equipment_type: "Газовый котёл",
        manufacturer: "Viessmann",
        install_year: 2017
    },
    { 
        asset_id: "EXIT-01", 
        name: "Эваквыходы 1", 
        category: "ПБ", 
        specialist: "groundskeeper", 
        route_order: 5, 
        checklist_template: "visual_fire_exit_v1", 
        gps_lat: 55.751244, 
        gps_lon: 37.618923,
        description: "Эвакуационный выход №1. Основной выход из северной части здания.",
        location: "Северный фасад, выход 1",
        equipment_type: "Дверь эвакуационная",
        manufacturer: "-",
        install_year: 2018
    },
    { 
        asset_id: "GRSH-01", 
        name: "ГРЩ 1", 
        category: "Электроснабжение", 
        specialist: "electrician", 
        route_order: 6, 
        checklist_template: "visual_electrical_v1", 
        gps_lat: 55.751744, 
        gps_lon: 37.618923,
        description: "Главный распределительный щит №1. Питание основного оборудования здания.",
        location: "Электрощитовая №1",
        equipment_type: "ГРЩ",
        manufacturer: "Schneider Electric",
        install_year: 2018
    },
    { 
        asset_id: "DGU-01", 
        name: "ДГУ 1", 
        category: "Резервное питание", 
        specialist: "electrician", 
        route_order: 7, 
        checklist_template: "visual_dgu_v1", 
        gps_lat: 55.752244, 
        gps_lon: 37.618923,
        description: "Дизель-генераторная установка №1. Резервное питание при отключении основной сети.",
        location: "Дизельная, отсек 1",
        equipment_type: "ДГУ",
        manufacturer: "Cummins",
        install_year: 2019,
        power_kw: 500
    },
    { 
        asset_id: "EXIT-02", 
        name: "Эваквыходы 2", 
        category: "ПБ", 
        specialist: "groundskeeper", 
        route_order: 8, 
        checklist_template: "visual_fire_exit_v1", 
        gps_lat: 55.752744, 
        gps_lon: 37.618923,
        description: "Эвакуационный выход №2. Запасной выход из центральной части здания.",
        location: "Центральный фасад, выход 2",
        equipment_type: "Дверь эвакуационная",
        manufacturer: "-",
        install_year: 2018
    },
    { 
        asset_id: "GRSH-02", 
        name: "ГРЩ 2", 
        category: "Электроснабжение", 
        specialist: "electrician", 
        route_order: 9, 
        checklist_template: "visual_electrical_v1", 
        gps_lat: 55.753244, 
        gps_lon: 37.618923,
        description: "Главный распределительный щит №2. Питание систем вентиляции и кондиционирования.",
        location: "Электрощитовая №2",
        equipment_type: "ГРЩ",
        manufacturer: "Schneider Electric",
        install_year: 2018
    },
    { 
        asset_id: "DGU-02", 
        name: "ДГУ 2", 
        category: "Резервное питание", 
        specialist: "electrician", 
        route_order: 10, 
        checklist_template: "visual_dgu_v1", 
        gps_lat: 55.751244, 
        gps_lon: 37.619423,
        description: "Дизель-генераторная установка №2. Резервное питание для систем безопасности.",
        location: "Дизельная, отсек 2",
        equipment_type: "ДГУ",
        manufacturer: "Cummins",
        install_year: 2019,
        power_kw: 300
    },
    { 
        asset_id: "VENT-02", 
        name: "Вентустановка 2", 
        category: "ОВиК", 
        specialist: "hvac_tech", 
        route_order: 11, 
        checklist_template: "visual_hvac_v1", 
        gps_lat: 55.751744, 
        gps_lon: 37.619423,
        description: "Приточно-вытяжная вентустановка в коридоре B. Обслуживает складские помещения.",
        location: "Коридор B, 2 этаж",
        equipment_type: "Приточно-вытяжная установка",
        manufacturer: "Systemair",
        install_year: 2019
    },
    { 
        asset_id: "ITP-02", 
        name: "ИТП 2", 
        category: "Теплоснабжение", 
        specialist: "heat_tech", 
        route_order: 12, 
        checklist_template: "visual_thermal_v1", 
        gps_lat: 55.752244, 
        gps_lon: 37.619423,
        description: "Индивидуальный тепловой пункт №2. Регулирует температуру для системы ГВС.",
        location: "Техэтаж, секция 2",
        equipment_type: "ИТП",
        manufacturer: "Danfoss",
        install_year: 2019
    },
    { 
        asset_id: "PUMP-01", 
        name: "Насосная", 
        category: "Водоснабжение", 
        specialist: "plumber", 
        route_order: 13, 
        checklist_template: "visual_water_v1", 
        gps_lat: 55.752744, 
        gps_lon: 37.619423,
        description: "Насосная станция водоснабжения. Подаёт воду в систему ХВС и ГВС здания.",
        location: "Подвал, помещение 2",
        equipment_type: "Насосная станция",
        manufacturer: "Wilo",
        install_year: 2018
    },
    { 
        asset_id: "GRSH-03", 
        name: "ГРЩ 3", 
        category: "Электроснабжение", 
        specialist: "electrician", 
        route_order: 14, 
        checklist_template: "visual_electrical_v1", 
        gps_lat: 55.753244, 
        gps_lon: 37.619423,
        description: "Главный распределительный щит №3. Питание систем освещения и розеточной сети.",
        location: "Электрощитовая №3",
        equipment_type: "ГРЩ",
        manufacturer: "Schneider Electric",
        install_year: 2018
    },
    { 
        asset_id: "DGU-03", 
        name: "ДГУ 3", 
        category: "Резервное питание", 
        specialist: "electrician", 
        route_order: 15, 
        checklist_template: "visual_dgu_v1", 
        gps_lat: 55.751244, 
        gps_lon: 37.619923,
        description: "Дизель-генераторная установка №3. Резервное питание для ИТ-оборудования.",
        location: "Дизельная, отсек 3",
        equipment_type: "ДГУ",
        manufacturer: "Cummins",
        install_year: 2020,
        power_kw: 200
    },
    { 
        asset_id: "ITP-03", 
        name: "ИТП 3", 
        category: "Теплоснабжение", 
        specialist: "heat_tech", 
        route_order: 16, 
        checklist_template: "visual_thermal_v1", 
        gps_lat: 55.751744, 
        gps_lon: 37.619923,
        description: "Индивидуальный тепловой пункт №3. Регулирует температуру для системы вентиляции.",
        location: "Техэтаж, секция 3",
        equipment_type: "ИТП",
        manufacturer: "Danfoss",
        install_year: 2019
    },
    { 
        asset_id: "KNS-02", 
        name: "КНС 2", 
        category: "Водоотведение", 
        specialist: "plumber", 
        route_order: 17, 
        checklist_template: "visual_kns_v1", 
        gps_lat: 55.752244, 
        gps_lon: 37.619923,
        description: "Канализационная насосная станция №2. Перекачивает сточные воды из подвальных помещений.",
        location: "Подвал, помещение 3",
        equipment_type: "КНС",
        manufacturer: "Grundfos",
        install_year: 2018
    },
    { 
        asset_id: "EXIT-03", 
        name: "Эваквыходы 3", 
        category: "ПБ", 
        specialist: "groundskeeper", 
        route_order: 18, 
        checklist_template: "visual_fire_exit_v1", 
        gps_lat: 55.752744, 
        gps_lon: 37.619923,
        description: "Эвакуационный выход №3. Запасной выход из южной части здания.",
        location: "Южный фасад, выход 3",
        equipment_type: "Дверь эвакуационная",
        manufacturer: "-",
        install_year: 2018
    },
    { 
        asset_id: "KNS-03", 
        name: "КНС 3", 
        category: "Водоотведение", 
        specialist: "plumber", 
        route_order: 19, 
        checklist_template: "visual_kns_v1", 
        gps_lat: 55.753244, 
        gps_lon: 37.619923,
        description: "Канализационная насосная станция №3. Перекачивает сточные воды с парковки.",
        location: "Парковка, уровень -1",
        equipment_type: "КНС",
        manufacturer: "Grundfos",
        install_year: 2018
    },
    { 
        asset_id: "EXIT-04", 
        name: "Эваквыходы 4", 
        category: "ПБ", 
        specialist: "groundskeeper", 
        route_order: 20, 
        checklist_template: "visual_fire_exit_v1", 
        gps_lat: 55.751244, 
        gps_lon: 37.620423,
        description: "Эвакуационный выход №4. Основной выход с парковки.",
        location: "Парковка, уровень -1, выход 4",
        equipment_type: "Дверь эвакуационная",
        manufacturer: "-",
        install_year: 2018
    },
    { 
        asset_id: "LIGHT-OUT", 
        name: "Наружное освещение", 
        category: "Наружное освещение", 
        specialist: "electrician", 
        route_order: 21, 
        checklist_template: "visual_electrical_v1", 
        gps_lat: 55.751744, 
        gps_lon: 37.620423,
        description: "Щит управления наружным освещением территории.",
        location: "Электрощитовая №1",
        equipment_type: "Щит освещения",
        manufacturer: "IEK",
        install_year: 2018
    },
    { 
        asset_id: "LIGHT-EMG", 
        name: "Аварийное освещение", 
        category: "Аварийное освещение", 
        specialist: "electrician", 
        route_order: 22, 
        checklist_template: "visual_light_emg_v1", 
        gps_lat: 55.752244, 
        gps_lon: 37.620423,
        description: "Щит аварийного освещения. Обеспечивает питание эвакуационных светильников.",
        location: "Электрощитовая №2",
        equipment_type: "Щит аварийного освещения",
        manufacturer: "IEK",
        install_year: 2018
    },
    { 
        asset_id: "TERR-WINTER", 
        name: "Территория (зима)", 
        category: "Благоустройство", 
        specialist: "groundskeeper", 
        route_order: 23, 
        checklist_template: "visual_terra_v1", 
        gps_lat: 55.752744, 
        gps_lon: 37.620423,
        description: "Обход территории в зимний период. Проверка уборки снега и наледи.",
        location: "Территория вокруг здания",
        equipment_type: "-",
        manufacturer: "-",
        install_year: null
    }
];

// ============================================
// DoorHan точки (шаблон для заполнения)
// ============================================
const DoorHanPoints = [
    // Шлагбаумы
    { asset_id: "SB-01", name: "Шлагбаум въезд №1", category: "DoorHan", route_order: 1, checklist_template: "doorhan_barrier", gps_lat: 55.751500, gps_lon: 37.618200 },
    { asset_id: "SB-02", name: "Шлагбаум въезд №2", category: "DoorHan", route_order: 2, checklist_template: "doorhan_barrier", gps_lat: 55.751600, gps_lon: 37.618300 },
    { asset_id: "SB-03", name: "Шлагбаум выезд", category: "DoorHan", route_order: 3, checklist_template: "doorhan_barrier", gps_lat: 55.751700, gps_lon: 37.618400 },
    // Ворота
    { asset_id: "GATE-01", name: "Ворота секционные №1", category: "DoorHan", route_order: 4, checklist_template: "doorhan_gate", gps_lat: 55.751800, gps_lon: 37.618500 },
    { asset_id: "GATE-02", name: "Ворота секционные №2", category: "DoorHan", route_order: 5, checklist_template: "doorhan_gate", gps_lat: 55.751900, gps_lon: 37.618600 },
    { asset_id: "GATE-03", name: "Ворота распашные", category: "DoorHan", route_order: 6, checklist_template: "doorhan_swing", gps_lat: 55.752000, gps_lon: 37.618700 }
];

// ============================================
// Вентиляция и кондиционирование (шаблон)
// ============================================
const VentilationPoints = [
    { asset_id: "VENT-01", name: "Вентустановка 1", category: "Вентиляция", route_order: 1, checklist_template: "vent_full", gps_lat: 55.751744, gps_lon: 37.618423 },
    { asset_id: "VENT-02", name: "Вентустановка 2", category: "Вентиляция", route_order: 2, checklist_template: "vent_full", gps_lat: 55.751744, gps_lon: 37.619423 },
    { asset_id: "AC-01", name: "Кондиционер сплит 1", category: "Кондиционирование", route_order: 3, checklist_template: "ac_split", gps_lat: 55.752000, gps_lon: 37.619000 },
    { asset_id: "AC-02", name: "Кондиционер сплит 2", category: "Кондиционирование", route_order: 4, checklist_template: "ac_split", gps_lat: 55.752100, gps_lon: 37.619100 },
    { asset_id: "CHILLER-01", name: "Чиллер", category: "Кондиционирование", route_order: 5, checklist_template: "chiller", gps_lat: 55.752200, gps_lon: 37.619200 }
];

// ============================================
// КИПиА точки (шаблон)
// ============================================
const KipPoints = [
    { asset_id: "KIP-01", name: "Щит КИП №1", category: "КИПиА", route_order: 1, checklist_template: "kip_cabinet", gps_lat: 55.751600, gps_lon: 37.618300 },
    { asset_id: "KIP-02", name: "Щит КИП №2", category: "КИПиА", route_order: 2, checklist_template: "kip_cabinet", gps_lat: 55.751700, gps_lon: 37.618400 },
    { asset_id: "SENSOR-01", name: "Датчик температуры 1", category: "КИПиА", route_order: 3, checklist_template: "kip_sensor", gps_lat: 55.751800, gps_lon: 37.618500 },
    { asset_id: "SENSOR-02", name: "Датчик давления 1", category: "КИПиА", route_order: 4, checklist_template: "kip_sensor", gps_lat: 55.751900, gps_lon: 37.618600 },
    { asset_id: "PLC-01", name: "Контроллер ПЛК", category: "КИПиА", route_order: 5, checklist_template: "kip_plc", gps_lat: 55.752000, gps_lon: 37.618700 }
];

// ============================================
// Чек-листы по шаблонам (из CHECKLISTS.md)
// Расширенные версии для обхода дежурного
// ============================================
const Checklists = {
    // Обход дежурного - 10 типов чек-листов
    visual_electrical_v1: {
        name: "Электроснабжение (ГРЩ)",
        description: "Проверка главного распределительного щита",
        items: [
            "Работа вводов №1 и 2 (сигнализация на панели)",
            "Состояние стабилизаторов, ИБП (режим работы)",
            "Работа водосточных воронок (зима - отсутствие наледи)",
            "Обогрев/охлаждение внутри щита (температура в норме)",
            "Доступ свободен, нет посторонних предметов"
        ],
        normal_values: {
            temperature: "15-25°C",
            humidity: "30-70%",
            voltage: "380-400V"
        }
    },
    visual_dgu_v1: {
        name: "Резервное питание (ДГУ)",
        description: "Проверка дизель-генераторной установки",
        items: [
            "Целостность трубопроводов (течь дизтоплива, антифриза отсутствует)",
            "Режим работы (норма - Авто)"
        ],
        normal_values: {
            fuel_level: ">75%",
            oil_pressure: "в норме",
            battery_voltage: "24-28V"
        }
    },
    visual_hvac_v1: {
        name: "Вентиляция",
        description: "Проверка вентустановки",
        items: [
            "Работа установки (включена/выключена по графику)",
            "Отсутствие постороннего шума/вибрации",
            "Целостность воздуховодов и креплений",
            "Конденсат на трубах (отсутствует)"
        ],
        normal_values: {
            temperature: "18-22°C",
            noise: "<60dB",
            vibration: "отсутствует"
        }
    },
    visual_kns_v1: {
        name: "КНС",
        description: "Проверка канализационной насосной станции",
        items: [
            "Работоспособность насосов (все работают)",
            "Шкаф управления (режим, аварии отсутствуют)"
        ],
        normal_values: {
            level: "рабочий уровень",
            pumps: "автоматический режим"
        }
    },
    visual_water_v1: {
        name: "Водоснабжение",
        description: "Проверка насосной станции водоснабжения",
        items: [
            "Работа насосов (штатный режим, без вибрации)",
            "Отсутствие протечек труб/соединений",
            "Показания приборов (давление/расход в норме)",
            "Состояние задвижек и кранов (доступны, работают)"
        ],
        normal_values: {
            pressure_hvs: "3-4 атм",
            pressure_gvs: "4-6 атм",
            flow: "по норме"
        }
    },
    visual_thermal_v1: {
        name: "Теплоснабжение",
        description: "Проверка теплового пункта/котельной",
        items: [
            "Работа теплового оборудования (штатный режим)",
            "Отсутствие протечек теплоносителя",
            "Показания температуры (подача/обратка в норме)",
            "Давление в системе (в норме)",
            "Работа автоматики и контроллеров (без ошибок)"
        ],
        normal_values: {
            temperature_supply: "70-95°C",
            temperature_return: "40-50°C",
            pressure: "1.5-2.5 атм"
        }
    },
    visual_fire_exit_v1: {
        name: "Эваквыходы",
        description: "Проверка эвакуационного выхода",
        items: [
            "Визуальный контроль доступа (свободен, не загромождён)"
        ],
        normal_values: {
            door: "открывается свободно",
            sign: "знак на месте"
        }
    },
    visual_light_v1: {
        name: "Наружное освещение",
        description: "Проверка щита наружного освещения",
        items: [
            "Целостность опор и светильников (без повреждений)",
            "Работоспособность (все горят по графику)",
            "Автоматика включения (фотореле/таймер работают)"
        ],
        normal_values: {
            lamps_on: "100%",
            timer: "по графику"
        }
    },
    visual_light_emg_v1: {
        name: "Аварийное освещение",
        description: "Проверка щита аварийного освещения",
        items: [
            "Светят / Не светят (проверка всех линий)",
            "Сколько не светят (шт.) - записать количество"
        ],
        normal_values: {
            lamps_on: "100%",
            battery: "заряжена"
        }
    },
    visual_terra_v1: {
        name: "Территория",
        description: "Проверка территории (зима)",
        items: [
            "Дорога подъездная (состояние, уборка снега)",
            "Въездная группа (шлагбаумы работают)",
            "Парковка к доковым воротам (свободна, убрана)"
        ],
        normal_values: {
            snow: "убран",
            ice: "обработано",
            barriers: "работают"
        }
    },
    
    // DoorHan чек-листы
    doorhan_barrier: {
        name: "Шлагбаум DoorHan",
        description: "Проверка шлагбаума",
        items: [
            "Внешний вид (без повреждений)",
            "Работа привода (открытие/закрытие)",
            "Работа пульта ДУ",
            "Концевики срабатывают",
            "Фотоэлементы работают"
        ]
    },
    doorhan_gate: {
        name: "Ворота секционные DoorHan",
        description: "Проверка секционных ворот",
        items: [
            "Внешний вид полотен (без повреждений)",
            "Работа привода (подъем/опускание)",
            "Работа пульта ДУ",
            "Балансировка ворот",
            "Концевики срабатывают"
        ]
    },
    doorhan_swing: {
        name: "Ворота распашные DoorHan",
        description: "Проверка распашных ворот",
        items: [
            "Внешний вид (без повреждений)",
            "Работа приводов створок",
            "Работа пульта ДУ",
            "Замки работают",
            "Фотоэлементы работают"
        ]
    },
    
    // Вентиляция чек-листы
    vent_full: {
        name: "Вентустановка полная проверка",
        description: "Расширенная проверка вентустановки",
        items: [
            "Работа установки (включена/выключена)",
            "Отсутствие постороннего шума/вибрации",
            "Целостность воздуховодов и креплений",
            "Конденсат на трубах (отсутствует)",
            "Фильтры чистые",
            "Рекуператор работает",
            "Автоматика исправна"
        ]
    },
    ac_split: {
        name: "Кондиционер сплит-система",
        description: "Проверка сплит-системы",
        items: [
            "Работа в режиме охлаждения",
            "Работа в режиме обогрева",
            "Отсутствие посторонних шумов",
            "Дренаж работает",
            "Фильтры чистые",
            "Пульт ДУ работает"
        ]
    },
    chiller: {
        name: "Чиллер",
        description: "Проверка чиллера",
        items: [
            "Работа компрессора",
            "Давление в системе",
            "Температура на выходе",
            "Уровень хладагента",
            "Насос циркуляции работает"
        ]
    },
    
    // КИПиА чек-листы
    kip_cabinet: {
        name: "Щит КИП",
        description: "Проверка щита КИП",
        items: [
            "Внешний вид (без повреждений)",
            "Индикация питания",
            "Отсутствие запаха гари",
            "Клеммы затянуты",
            "Заземление исправно"
        ]
    },
    kip_sensor: {
        name: "Датчик КИП",
        description: "Проверка датчика",
        items: [
            "Внешний вид (без повреждений)",
            "Показания корректны",
            "Крепление надёжно",
            "Кабель без повреждений"
        ]
    },
    kip_plc: {
        name: "Контроллер ПЛК",
        description: "Проверка контроллера",
        items: [
            "Индикация работы",
            "Отсутствие ошибок",
            "Связь с периферией",
            "Программа работает"
        ]
    }
};

// ============================================
// Специалисты (роли)
// ============================================
const SpecialistRoles = {
    electrician: { name: "Электромонтёр", color: "#ffc107" },
    hvac_tech: { name: "Техник по вентиляции", color: "#4caf50" },
    plumber: { name: "Слесарь-сантехник", color: "#2196f3" },
    heat_tech: { name: "Теплотехник", color: "#f44336" },
    groundskeeper: { name: "Дворник", color: "#9c27b0" },
    instrument_tech: { name: "Техник КиПа", color: "#00bcd4" },
    repairman: { name: "Слесарь ремонтник", color: "#ff9800" },
    energy: { name: "Инженер энергетик", color: "#e91e63" },
    mechanizer: { name: "Механизатор", color: "#795548" },
    cleaner: { name: "Уборщица", color: "#e040fb" }
};

// ============================================
// Telegram конфигурация
// ============================================
const TelegramConfig = {
    bot_token: "7440993208:AAH5yphzl17W_WByLwcV3RmTT6ARxW_FTlI",
    chief_engineer_id: "1309549506",
    energy_engineer_id: "1309549506"
};

// ============================================
// Настройки приложения
// ============================================
const AppConfig = {
    total_points: 23,
    gps_radius_meters: 5,
    offline_mode: true,
    app_version: "2.0.0"
};

// ============================================
// Экспорт данных
// ============================================
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { 
        Users, 
        InspectionTypes,
        GuardRoutePoints, 
        DoorHanPoints, 
        VentilationPoints, 
        KipPoints,
        Checklists, 
        SpecialistRoles, 
        TelegramConfig, 
        AppConfig 
    };
}