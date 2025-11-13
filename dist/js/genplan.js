// 1. Структура данных и API функции
const GENPLAN_API = {
    regions: 'https://signatur-bitrix.db33.ru/ajax/genplan.php?action=get_regions',
    house: (houseId) => `https://signatur-bitrix.db33.ru/ajax/genplan.php?action=get_house&house_id=${houseId}`
};

// Функция для загрузки данных
async function fetchGenplanData(url) {
    try {
        const response = await fetch(url);
        const data = await response.json();

        if (data.error) {
            throw new Error(data.result);
        }

        return data.result;
    } catch (error) {
        console.error('Ошибка загрузки данных:', error);
        return null;
    }
}

// Глобальные переменные для хранения данных
let regionsData = [];
let currentHouseData = null;

// 2. Загрузка и отображение регионов

// Загрузка регионов
async function loadRegions() {
    regionsData = await fetchGenplanData(GENPLAN_API.regions);

    if (!regionsData || regionsData.length === 0) {
        console.warn('Нет данных о регионах');
        return;
    }

    updateRegionsUI(regionsData);
}

// Обновление UI регионов
function updateRegionsUI(regions) {
    const step1Container = document.querySelector('.block-genplan__content-container.step1');
    if (!step1Container) return;

    regions.forEach(region => {
        // Обновляем изображение
        const regionImage = step1Container.querySelector('.block-genplan__image img');
        if (regionImage && region.GENPLAN_IMAGE) {
            regionImage.src = region.GENPLAN_IMAGE;
            regionImage.alt = region.NAME;
        }

        // Обновляем попап региона
        updateRegionPopup(region);

        // Обновляем дома в регионе
        updateHousesInRegion(region);
    });
}

// Обновление попапа региона
function updateRegionPopup(region) {
    const popup = document.querySelector(`.block-genplan-popup[data-id-popup="r1"]`);
    if (!popup) return;

    // Заполняем данные
    popup.querySelector('.block-genplan-popup__title').textContent = region.NAME;

    const topInfo = popup.querySelector('.block-genplan-popup__top ul');
    if (topInfo) {
        topInfo.innerHTML = `
      <li>
        <div class="block-genplan-popup__name">Домов построено</div>
        <div class="block-genplan-popup__value">${region.HOUSES_COUNT || '0'}</div>
      </li>
      <li>
        <div class="block-genplan-popup__name">Срок сдачи:</div>
        <div class="block-genplan-popup__value">${region.DEADLINE || 'Не указан'}</div>
      </li>
    `;
    }

    const imageSection = popup.querySelector('.block-genplan-popup__image');
    if (imageSection) {
        const img = imageSection.querySelector('img');
        if (img && region.IMAGE) {
            img.src = region.IMAGE;
            img.alt = region.NAME;
        }

        const description = imageSection.querySelector('p');
        if (description && region.PREVIEW_TEXT) {
            description.textContent = region.PREVIEW_TEXT;
        }
    }

    // Обновляем информацию о комнатах
    updateRoomsInfo(popup, region.ROOMS_INFO);
}

// Обновление информации о комнатах
function updateRoomsInfo(container, roomsInfo) {
    const roomsList = container.querySelector('.block-genplan-popup__rooms ul');
    if (!roomsList || !roomsInfo) return;

    roomsList.innerHTML = roomsInfo.map(room => `
    <li>
      <div class="block-genplan-popup__room">${room.NAME}</div>
      ${room.PRICE ?
            `<div class="block-genplan-popup__price">от ${formatPrice(room.PRICE)} руб.</div>` :
            ''
        }
    </li>
  `).join('');
}

// Форматирование цены
function formatPrice(price) {
    return new Intl.NumberFormat('ru-RU').format(price);
}

// 3. Загрузка и отображение домов

// Загрузка данных дома
async function loadHouseData(houseId) {
    currentHouseData = await fetchGenplanData(GENPLAN_API.house(houseId));

    if (!currentHouseData) {
        console.warn('Нет данных о доме', houseId);
        return;
    }

    updateHouseUI(currentHouseData);
    return currentHouseData;
}

// Обновление UI дома
function updateHouseUI(houseData) {
    // Обновляем попап дома
    updateHousePopup(houseData);

    // Обновляем этажи и квартиры
    updateFloorsAndApartments(houseData);
}

// Обновление попапа дома
function updateHousePopup(houseData) {
    const popup = document.querySelector(`.block-genplan-popup[data-id-popup="h${houseData.ID}"]`);
    if (!popup) return;

    popup.querySelector('.block-genplan-popup__title').textContent = houseData.NAME;

    const topInfo = popup.querySelector('.block-genplan-popup__top ul');
    if (topInfo) {
        topInfo.innerHTML = `
      <li>
        <div class="block-genplan-popup__name">Срок сдачи:</div>
        <div class="block-genplan-popup__value">${houseData.DEADLINE || 'Не указан'}</div>
      </li>
    `;
    }

    updateRoomsInfo(popup, houseData.ROOMS_INFO);
}

// Обновление домов в регионе
function updateHousesInRegion(region) {
    if (!region.HOUSES || region.HOUSES.length === 0) return;

    region.HOUSES.forEach(house => {
        updateHouseButton(house);
        createOrUpdateHousePopup(house);
    });
}

// Обновление кнопки дома
function updateHouseButton(house) {
    const button = document.querySelector(`.block-genplan__tippy[data-id="h${house.ID}"]`);
    if (button) {
        button.querySelector('span').textContent = house.NAME;

        // Обновляем позиционирование если нужно
        if (house.POS_TOP && house.POS_RIGHT) {
            button.style.top = `${house.POS_TOP}%`;
            button.style.right = `${house.POS_RIGHT}%`;
        }
    }
}

// Создание или обновление попапа дома
function createOrUpdateHousePopup(house) {
    let popup = document.querySelector(`.block-genplan-popup[data-id-popup="h${house.ID}"]`);

    if (!popup) {
        // Создаем новый попап если его нет
        popup = createHousePopup(house);
    }

    updateHousePopup(house);
}

// Создание попапа дома (если нужно динамическое создание)
function createHousePopup(house) {
    // Здесь можно добавить логику создания попапа, если его нет в HTML
    console.log('Создание попапа для дома:', house.ID);
    return null;
}

// 4. Работа с этажами и квартирами

// Обновление этажей и квартир
function updateFloorsAndApartments(houseData) {
    if (!houseData.FLOORS || houseData.FLOORS.length === 0) return;

    // Находим контейнер для дома
    const houseContainer = document.querySelector(`.block-genplan__content-container.step3[data-id="h${houseData.ID}"]`);
    if (!houseContainer) return;

    houseData.FLOORS.forEach(floor => {
        updateFloorUI(houseContainer, floor);
    });
}

// Обновление UI этажа
function updateFloorUI(houseContainer, floor) {
    const floorContainer = houseContainer.querySelector(`.block-genplan__images[data-floor="${floor.FLOOR}"]`);
    if (!floorContainer) return;

    // Обновляем план этажа
    const floorImage = floorContainer.querySelector('.block-genplan__image img');
    if (floorImage && floor.FLOOR_PLAN) {
        floorImage.src = floor.FLOOR_PLAN;
        floorImage.alt = `План ${floor.NAME}`;
    }

    // Обновляем квартиры
    updateApartmentsUI(floorContainer, floor.APARTMENTS);
}

// Обновление UI квартир
function updateApartmentsUI(floorContainer, apartments) {
    if (!apartments || apartments.length === 0) return;

    const tipsContainer = floorContainer.querySelector('.block-genplan__tips');
    const popupsContainer = floorContainer.querySelector('.block-genplan__popups');

    apartments.forEach(apartment => {
        // Обновляем или создаем кнопку квартиры
        updateApartmentButton(tipsContainer, apartment);

        // Обновляем или создаем попап квартиры
        updateApartmentPopup(popupsContainer, apartment);
    });
}

// Обновление кнопки квартиры
function updateApartmentButton(container, apartment) {
    const button = container.querySelector(`.block-genplan__tippy[data-id="kv${apartment.ID}"]`);

    if (button) {
        button.querySelector('span').textContent = `№${apartment.NUMBER_APARTMENT}`;

        // Обновляем позиционирование
        if (apartment.POS_TOP && apartment.POS_RIGHT) {
            button.style.top = `${apartment.POS_TOP}%`;
            button.style.right = `${apartment.POS_RIGHT}%`;
        }
    } else {
        // Создаем новую кнопку если её нет
        createApartmentButton(container, apartment);
    }
}

// Создание кнопки квартиры
function createApartmentButton(container, apartment) {
    const button = document.createElement('button');
    button.className = 'block-genplan__tippy tippy-floor';
    button.setAttribute('data-id', `kv${apartment.ID}`);
    button.setAttribute('type', 'button');

    if (apartment.POS_TOP && apartment.POS_RIGHT) {
        button.style.top = `${apartment.POS_TOP}%`;
        button.style.right = `${apartment.POS_RIGHT}%`;
    }

    button.innerHTML = `<span>№${apartment.NUMBER_APARTMENT}</span>`;
    container.appendChild(button);
}

// Обновление попапа квартиры
function updateApartmentPopup(container, apartment) {
    let popup = container.querySelector(`.block-genplan-popup[data-id-popup="kv${apartment.ID}"]`);

    if (!popup) {
        popup = createApartmentPopup(apartment);
        container.appendChild(popup);
    }

    // Заполняем данные
    const card = popup.querySelector('.card-apartments');
    if (card) {
        card.querySelector('.card-apartments__title').textContent =
            `${apartment.ROOMS}-комнатная, ${apartment.AREA} м²`;
        card.querySelector('.card-apartments__price').textContent =
            `${formatPrice(apartment.PRICE)} ₽`;

        const image = card.querySelector('.card-apartments__image img');
        if (image && apartment.IMAGE) {
            image.src = apartment.IMAGE;
            image.alt = apartment.NAME;
        }

        const detailsList = card.querySelector('.card-apartments__bottom ul');
        if (detailsList && apartment.PROPERTIES_DISPLAY_VALUES) {
            detailsList.innerHTML = apartment.PROPERTIES_DISPLAY_VALUES
                .map(item => `<li>${item}</li>`)
                .join('');
        }

        const link = card.querySelector('.card-apartments__bottom a');
        if (link && apartment.DETAIL_PAGE_URL) {
            link.href = apartment.DETAIL_PAGE_URL;
        }
    }
}

// Создание попапа квартиры
function createApartmentPopup(apartment) {
    const popup = document.createElement('div');
    popup.className = 'block-genplan-popup';
    popup.setAttribute('data-id-popup', `kv${apartment.ID}`);

    // Позиционирование
    if (apartment.POS_TOP && apartment.POS_RIGHT) {
        popup.style.top = `${apartment.POS_TOP}%`;
        popup.style.left = `${apartment.POS_RIGHT}%`;
    }

    popup.innerHTML = `
        <div class="card-apartments">
            <div class="card-apartments__top">
                <div class="card-apartments__titles">
                    <div class="card-apartments__title">${apartment.ROOMS}-комнатная, ${apartment.AREA} м²</div>
                    <div class="card-apartments__price">${formatPrice(apartment.PRICE)} ₽</div>
                </div>
                <div class="card-apartments__tag">
                    Комфорт
                </div>
            </div>
            <div class="card-apartments__image">
                <img loading="lazy" src="${apartment.IMAGE || ''}" alt="${apartment.NAME}">
            </div>
            <div class="card-apartments__bottom">
                <ul>
                    ${apartment.PROPERTIES_DISPLAY_VALUES ? apartment.PROPERTIES_DISPLAY_VALUES.map(item => `<li>${item}</li>`).join('') : ''}
                </ul>
                <a href="${apartment.DETAIL_PAGE_URL || '#'}" class="btn btn-bg">
                    <span>Связаться</span>
                    <svg aria-hidden="true" width="12" height="8">
                        <use xlink:href="img/sprite.svg#arrow1"></use>
                    </svg>
                </a>
            </div>
        </div>
    `;

    return popup;
}

// 5. Инициализация и обработчики событий

// Инициализация генплана
async function initGenplan() {
    await loadRegions();

    // Добавляем обработчики для домов
    document.querySelectorAll('.block-genplan__tippy[data-id^="h"]').forEach(button => {
        button.addEventListener('click', async (e) => {
            e.preventDefault();
            const houseId = button.getAttribute('data-id').replace('h', '');

            // Загружаем данные дома
            const houseData = await loadHouseData(houseId);

            if (houseData) {
                // Переключаемся на вид дома
                toggleSteps(false, true, `h${houseId}`);
            }
        });
    });

    // Обработчик для кнопки "Выбрать квартиру" в попапе дома
    document.addEventListener('click', async (e) => {
        if (e.target.closest('.choose-apartment')) {
            const button = e.target.closest('.choose-apartment');
            const popup = button.closest('.block-genplan-popup');

            if (popup) {
                const houseId = popup.getAttribute('data-id-popup').replace('h', '');
                await loadHouseData(houseId);

                if (isMobileDevice()) {
                    toggleSteps(true, false);
                } else {
                    toggleSteps(false, true, `h${houseId}`);
                }
            }
        }
    });
}

// Функция для проверки мобильного устройства
function isMobileDevice() {
    return window.innerWidth < 1200;
}

// Функция переключения шагов (нужно добавить в существующий код)
function toggleSteps(showStep2 = false, showStep3 = false, targetHouseId = null) {
    const contentContainerStep1 = document.querySelector('.block-genplan__content-container.step1');
    const contentContainerStep2 = document.querySelector('.block-genplan__content-container.step2');
    const titleGenplan = document.querySelector('.title-genplan');
    const titleHouse = document.querySelector('.title-house');
    const titleRooms = document.querySelector('.title-romms');

    if (!contentContainerStep1 || !contentContainerStep2) return;

    contentContainerStep1.classList.remove('_active');
    contentContainerStep2.classList.remove('_active');

    document.querySelectorAll('.block-genplan__content-container.step3').forEach(step3 => {
        step3.classList.remove('_active');
    });

    titleGenplan.classList.remove('_active');
    titleHouse.classList.remove('_active');
    if (titleRooms) titleRooms.classList.remove('_active');

    if (showStep2 || showStep3) {
        titleGenplan.classList.add('hidden');
    } else {
        titleGenplan.classList.remove('hidden');
    }

    if (showStep3 && targetHouseId) {
        const targetStep3 = document.querySelector(`.block-genplan__content-container.step3[data-id="${targetHouseId}"]`);
        if (targetStep3) {
            targetStep3.classList.add('_active');
            if (titleRooms) {
                titleRooms.classList.add('_active');
            }
        }
    } else if (showStep2) {
        contentContainerStep2.classList.add('_active');
        titleHouse.classList.add('_active');
    } else {
        contentContainerStep1.classList.add('_active');
        titleGenplan.classList.add('_active');
    }
}

// Инициализация при загрузке DOM
document.addEventListener('DOMContentLoaded', () => {
    initGenplan().catch(console.error);
});

//========================================================================================================================================================

// Функция для сохранения оригинальных размеров изображений
function saveOriginalImageSizes() {
    const images = document.querySelectorAll('.block-genplan__image img');
    images.forEach(img => {
        if (!img.dataset.originalWidth) {
            const rect = img.getBoundingClientRect();
            img.dataset.originalWidth = rect.width.toString();
            img.dataset.originalHeight = rect.height.toString();
        }
    });
}

document.addEventListener('DOMContentLoaded', () => {
    let blockGenplan = document.querySelector('.block-genplan');
    if (blockGenplan) {
        // === ОСНОВНЫЕ ЭЛЕМЕНТЫ ===
        const container = document.querySelector('.block-genplan__body');
        const contentContainerStep1 = document.querySelector('.block-genplan__content-container.step1');
        const contentContainerStep2 = document.querySelector('.block-genplan__content-container.step2');
        const titleGenplan = document.querySelector('.title-genplan');
        const titleHouse = document.querySelector('.title-house');
        const titleRooms = document.querySelector('.title-romms');
        const chooseHouseBtn = document.querySelector('.btn-genplan');
        const switchGenplan = document.querySelector('.switch-genplan');
        const switchToggle = document.querySelector('.toggle-switch input[type="checkbox"]');
        const fullscreenBtn = document.querySelector('.fullsreen-genplan__button');
        const fullscreenContainer = document.querySelector('[data-fullscreen-container]');
        const content = document.querySelector('.block-genplan__content');
        const svgs = document.querySelectorAll('.block-genplan__svg');

        saveOriginalImageSizes();

        // Проверка
        if (!container || !contentContainerStep1 || !contentContainerStep2 || !titleGenplan || !titleHouse || !svgs.length) {
            console.warn('Не найдены необходимые элементы генплана');
            return;
        }

        // === КОНСТАНТЫ SVG ===
        const SVG_WIDTH = 1200;
        const SVG_HEIGHT = 631;

        // === ТЕКУЩИЙ КОНТЕЙНЕР ===
        let currentContainer = contentContainerStep1;

        // === МАСШТАБИРОВАНИЕ И ПЕРЕМЕЩЕНИЕ ===
        let scale = 1;
        const minScale = 1;
        const maxScale = 4;
        const zoomStep = 0.3;
        let isDragging = false;
        let startX, startY;
        let translateX = 0;
        let translateY = 0;

        // Touch
        let touchStartDistance = 0;
        let lastScale = 1;
        let touchMode = null;
        let centerX = 0;
        let centerY = 0;

        // Для мобильной прокрутки
        let isMobileDragging = false;
        let startScrollLeft = 0;
        let startScrollTop = 0;
        let startMobileX = 0;
        let startMobileY = 0;

        // Храним оригинальные позиции попапов и тултипов
        const popups = document.querySelectorAll('.block-genplan-popup');
        const tippies = document.querySelectorAll('.block-genplan__tippy');

        // Проверяем мобильное устройство
        function isMobileDevice() {
            return window.innerWidth < 1200;
        }

        // Сохраняем оригинальные позиции
        function saveOriginalPositions() {
            popups.forEach(popup => {
                if (!popup.dataset.originalLeft) {
                    popup.dataset.originalLeft = popup.style.left || '';
                    popup.dataset.originalTop = popup.style.top || '';
                    popup.dataset.originalRight = popup.style.right || '';
                    popup.dataset.originalBottom = popup.style.bottom || '';
                }
            });
            tippies.forEach(tippy => {
                if (!tippy.dataset.originalLeft) {
                    tippy.dataset.originalLeft = tippy.style.left || '';
                    tippy.dataset.originalTop = tippy.style.top || '';
                    tippy.dataset.originalRight = tippy.style.right || '';
                    tippy.dataset.originalBottom = tippy.style.bottom || '';
                }
            });
        }
        saveOriginalPositions();
        window.addEventListener('resize', saveOriginalPositions);

        // === ФУНКЦИИ ===
        function getContainerRect() {
            return content.getBoundingClientRect();
        }

        // Функция обновления размеров SVG
        function updateSvgsSize() {
            if (isMobileDevice()) return;

            if (!document.fullscreenElement) {
                return;
            }

            const containerRect = fullscreenContainer.getBoundingClientRect();

            if (currentContainer.classList.contains('step3')) {
                return;
            }

            svgs.forEach(svg => {
                if (currentContainer.contains(svg) || svg.closest('.block-genplan__content-container') === currentContainer) {
                    svg.setAttribute('width', Math.round(containerRect.width));
                    svg.setAttribute('height', Math.round(containerRect.height));
                }
            });

            const images = currentContainer.querySelectorAll('.block-genplan__image img');
            images.forEach(img => {
                img.style.width = `${Math.round(containerRect.width)}px`;
                img.style.height = `${Math.round(containerRect.height)}px`;
            });
        }

        // Функция сброса стилей
        function resetFullscreenStyles() {
            if (fullscreenContainer) {
                fullscreenContainer.classList.remove('fullscreen-active');
            }

            const step1Svgs = document.querySelectorAll('.step1 .block-genplan__svg');
            const step2Svgs = document.querySelectorAll('.step2 .block-genplan__svg');

            step1Svgs.forEach(svg => {
                svg.removeAttribute('width');
                svg.removeAttribute('height');
            });

            step2Svgs.forEach(svg => {
                svg.removeAttribute('width');
                svg.removeAttribute('height');
            });

            const step1Images = document.querySelectorAll('.step1 .block-genplan__image img');
            const step2Images = document.querySelectorAll('.step2 .block-genplan__image img');

            step1Images.forEach(img => {
                img.style.width = '';
                img.style.height = '';
                img.style.objectFit = '';
            });

            step2Images.forEach(img => {
                img.style.width = '';
                img.style.height = '';
                img.style.objectFit = '';
            });
        }

        // Обновить трансформацию
        function updateTransform() {
            if (currentContainer && !isMobileDevice()) {
                let currentScale = scale;

                if (currentContainer.classList.contains('step3') && document.fullscreenElement) {
                    currentScale = 1;
                }

                currentContainer.style.transform = `translate(${translateX}px, ${translateY}px) scale(${currentScale})`;
            }
        }

        // Ограничить перемещение
        function clampTranslation() {
            if (!container || isMobileDevice()) return;
            const maxX = (scale - 1) * container.offsetWidth / 2;
            const maxY = (scale - 1) * container.offsetHeight / 2;
            translateX = Math.max(-maxX, Math.min(maxX, translateX));
            translateY = Math.max(-maxY, Math.min(maxY, translateY));
        }

        // Масштабирование от точки
        function zoomToPoint(scaleFactor, clientX, clientY) {
            if (isMobileDevice()) return;

            if (currentContainer.classList.contains('step3') && document.fullscreenElement) {
                return;
            }

            const newScale = Math.min(Math.max(scale * scaleFactor, minScale), maxScale);
            const zoomRatio = newScale / scale;
            translateX = clientX - zoomRatio * (clientX - translateX);
            translateY = clientY - zoomRatio * (clientY - translateY);
            scale = newScale;
            clampTranslation();
            updateTransform();
        }

        // Функция для обновления состояния подъездов
        function updateEntrancesState() {
            if (!switchToggle) return;

            const allPPaths = document.querySelectorAll('.block-genplan__path.p');
            const isChecked = switchToggle.checked;

            if (isChecked) {
                allPPaths.forEach(path => path.classList.add('_active'));
            } else {
                allPPaths.forEach(path => path.classList.remove('_active'));
            }
        }

        function resetTransformations() {
            if (currentContainer.classList.contains('step3') && document.fullscreenElement) {
                scale = 1;
            } else {
                scale = 1;
            }
            translateX = 0;
            translateY = 0;
            updateTransform();
        }

        // Обработчик кнопки "Выбрать дом"
        if (chooseHouseBtn) {
            chooseHouseBtn.addEventListener('click', (e) => {
                e.preventDefault();
                toggleSteps(true, false);
                const activePopup = document.querySelector('.block-genplan-popup._active');
                if (activePopup) {
                    activePopup.classList.remove('_active');
                    document.documentElement.classList.remove('popup-open');
                }
            });
        }

        // Обработчик клика на заголовок "Выбор дома"
        titleHouse.addEventListener('click', () => {
            toggleSteps(false, false);
        });

        // Обработчик клика на заголовок "Дом №6" - переключается между step2 и step3
        if (titleRooms) {
            titleRooms.addEventListener('click', () => {
                const activeStep3 = document.querySelector('.block-genplan__content-container.step3._active');
                if (activeStep3) {
                    toggleSteps(true, false);
                }
            });
        }

        // Обработчик кнопок "Выбрать квартиру" и "Выбрать этаж" в попапе
        document.querySelectorAll('.block-genplan-popup__buttons .btn').forEach(btn => {
            if (btn.classList.contains('choose-apartment') || btn.classList.contains('choose-floor')) {
                btn.addEventListener('click', (e) => {
                    e.stopPropagation();
                    e.preventDefault();

                    const popup = btn.closest('.block-genplan-popup');
                    if (popup) {
                        const houseId = popup.getAttribute('data-id-popup');

                        if (isMobileDevice()) {
                            toggleSteps(true, false);
                        } else {
                            if (btn.classList.contains('choose-floor')) {
                                toggleSteps(false, true, houseId);
                            } else if (btn.classList.contains('choose-apartment')) {
                                toggleSteps(false, true, houseId);
                            }
                        }

                        popup.classList.remove('_active');
                        document.documentElement.classList.remove('popup-open');
                    }
                });
            }
        });

        // === ОБРАБОТЧИКИ ДЛЯ МОБИЛЬНЫХ УСТРОЙСТВ ===
        function initMobileDrag() {
            if (!isMobileDevice()) return;

            container.addEventListener('mousedown', handleMobileDragStart);
            container.addEventListener('touchstart', handleMobileDragStart, { passive: false });

            document.addEventListener('mousemove', handleMobileDrag);
            document.addEventListener('touchmove', handleMobileDrag, { passive: false });

            document.addEventListener('mouseup', handleMobileDragEnd);
            document.addEventListener('touchend', handleMobileDragEnd);
            document.addEventListener('touchcancel', handleMobileDragEnd);
        }

        function handleMobileDragStart(e) {
            if (e.target.closest('.block-genplan-popup') || e.target.closest('.block-genplan__tippy')) return;

            isMobileDragging = true;

            if (e.type === 'touchstart') {
                startMobileX = e.touches[0].clientX;
                startMobileY = e.touches[0].clientY;
            } else {
                startMobileX = e.clientX;
                startMobileY = e.clientY;
            }

            startScrollLeft = container.scrollLeft;
            startScrollTop = container.scrollTop;
            container.classList.add('dragging');

            if (e.type === 'touchstart') {
                e.preventDefault();
            }
        }

        function handleMobileDrag(e) {
            if (!isMobileDragging) return;

            let currentX, currentY;

            if (e.type === 'touchmove') {
                currentX = e.touches[0].clientX;
                currentY = e.touches[0].clientY;
            } else {
                currentX = e.clientX;
                currentY = e.clientY;
            }

            const walkX = (currentX - startMobileX) * 2;
            const walkY = (currentY - startMobileY) * 2;

            container.scrollLeft = startScrollLeft - walkX;
            container.scrollTop = startScrollTop - walkY;

            if (e.type === 'touchmove') {
                e.preventDefault();
            }
        }

        function handleMobileDragEnd() {
            isMobileDragging = false;
            container.classList.remove('dragging');
        }

        // === ОБРАБОТЧИКИ ДЛЯ ДЕСКТОПОВ ===
        function initDesktopInteractions() {
            if (isMobileDevice()) return;

            container.addEventListener('mousedown', (e) => {
                if (scale <= minScale && window.innerWidth >= 1200) return;
                if (e.target.closest('.block-genplan-popup') || e.target.closest('.block-genplan__tippy')) return;
                isDragging = true;
                startX = e.clientX - translateX;
                startY = e.clientY - translateY;
                container.classList.add('dragging');
                e.preventDefault();
            });

            document.addEventListener('mousemove', (e) => {
                if (!isDragging) return;
                translateX = e.clientX - startX;
                translateY = e.clientY - startY;
                clampTranslation();
                updateTransform();
            });

            document.addEventListener('mouseup', () => {
                isDragging = false;
                container.classList.remove('dragging');
            });

            container.addEventListener('touchstart', (e) => {
                if (e.target.closest('.block-genplan-popup') || e.target.closest('.block-genplan__tippy')) return;
                if (e.touches.length === 2) {
                    touchMode = 'pinch';
                    const dx = e.touches[0].clientX - e.touches[1].clientX;
                    const dy = e.touches[0].clientY - e.touches[1].clientY;
                    touchStartDistance = Math.sqrt(dx * dx + dy * dy);
                    lastScale = scale;
                    centerX = (e.touches[0].clientX + e.touches[1].clientX) / 2;
                    centerY = (e.touches[0].clientY + e.touches[1].clientY) / 2;
                } else if (e.touches.length === 1 && (scale > minScale || window.innerWidth < 1200)) {
                    touchMode = 'pan';
                    isDragging = true;
                    const touch = e.touches[0];
                    startX = touch.clientX - translateX;
                    startY = touch.clientY - translateY;
                }
            }, { passive: false });

            container.addEventListener('touchmove', (e) => {
                if (e.touches.length === 2 && touchMode === 'pinch') {
                    const dx = e.touches[0].clientX - e.touches[1].clientX;
                    const dy = e.touches[0].clientY - e.touches[1].clientY;
                    const distance = Math.sqrt(dx * dx + dy * dy);
                    if (touchStartDistance > 0) {
                        const pinchScale = distance / touchStartDistance;
                        zoomToPoint(pinchScale, centerX, centerY);
                        centerX = (e.touches[0].clientX + e.touches[1].clientX) / 2;
                        centerY = (e.touches[0].clientY + e.touches[1].clientY) / 2;
                    }
                } else if (e.touches.length === 1 && touchMode === 'pan') {
                    const touch = e.touches[0];
                    translateX = touch.clientX - startX;
                    translateY = touch.clientY - startY;
                    clampTranslation();
                    updateTransform();
                }
            }, { passive: false });

            container.addEventListener('touchend', () => {
                isDragging = false;
                touchMode = null;
                touchStartDistance = 0;
            });
        }

        // === КНОПКИ ЗУМА ===
        const zoomInBtn = document.querySelector('.zoom-genplan__up');
        const zoomOutBtn = document.querySelector('.zoom-genplan__down');

        if (zoomInBtn) {
            zoomInBtn.addEventListener('click', () => {
                if (isMobileDevice()) return;
                if (currentContainer.classList.contains('step3') && document.fullscreenElement) {
                    return;
                }
                const rect = container.getBoundingClientRect();
                zoomToPoint(1 + zoomStep, rect.left + rect.width / 2, rect.top + rect.height / 2);
            });
        }

        if (zoomOutBtn) {
            zoomOutBtn.addEventListener('click', () => {
                if (isMobileDevice()) return;
                if (currentContainer.classList.contains('step3') && document.fullscreenElement) {
                    return;
                }
                const rect = container.getBoundingClientRect();
                zoomToPoint(1 - zoomStep, rect.left + rect.width / 2, rect.top + rect.height / 2);
            });
        }

        // === ПОЛНОЭКРАННЫЙ РЕЖИМ ===
        if (fullscreenBtn && fullscreenContainer) {
            let scrollPosition = 0;

            fullscreenBtn.addEventListener('click', async () => {
                if (!document.fullscreenElement) {
                    scrollPosition = window.scrollY;
                    try {
                        await fullscreenContainer.requestFullscreen();
                        fullscreenContainer.classList.add('fullscreen-active');
                        updateSvgsSize();
                        updateTransform();
                        clampTranslation();
                    } catch (err) {
                        console.warn('Ошибка:', err);
                    }
                } else {
                    try {
                        await document.exitFullscreen();
                    } catch (err) {
                        console.warn('Ошибка:', err);
                    }
                    resetFullscreenStyles();
                    setTimeout(() => {
                        window.scrollTo(0, scrollPosition);
                    }, 100);

                    setTimeout(() => {
                        resetTransformations();
                    }, 100);
                }
            });

            document.addEventListener('fullscreenchange', () => {
                if (!document.fullscreenElement) {
                    fullscreenContainer.classList.remove('fullscreen-active');
                    resetFullscreenStyles();
                    setTimeout(() => {
                        window.scrollTo(0, scrollPosition);
                    }, 100);

                    setTimeout(() => {
                        updateEntrancesState();
                        resetTransformations();
                    }, 100);
                } else {
                    fullscreenContainer.classList.add('fullscreen-active');
                    updateSvgsSize();
                    setTimeout(() => {
                        resetTransformations();
                    }, 100);
                }
            });
        }

        // Переключение шагов
        function toggleSteps(showStep2 = false, showStep3 = false, targetHouseId = null) {
            contentContainerStep1.classList.remove('_active');
            contentContainerStep2.classList.remove('_active');

            document.querySelectorAll('.block-genplan__content-container.step3').forEach(step3 => {
                step3.classList.remove('_active');
            });

            titleGenplan.classList.remove('_active');
            titleHouse.classList.remove('_active');
            if (titleRooms) titleRooms.classList.remove('_active');

            if (showStep2 || showStep3) {
                titleGenplan.classList.add('hidden');
            } else {
                titleGenplan.classList.remove('hidden');
            }

            if (showStep3) {
                if (isMobileDevice()) {
                    contentContainerStep2.classList.add('_active');
                    titleHouse.classList.add('_active');
                    document.documentElement.classList.add('choice-home');
                    currentContainer = contentContainerStep2;

                    if (switchGenplan) {
                        switchGenplan.classList.remove('_active');
                    }

                    const zoomGenplan = document.querySelector('.zoom-genplan');
                    if (zoomGenplan) {
                        zoomGenplan.classList.remove('hidden');
                    }

                    if (fullscreenBtn) {
                        fullscreenBtn.classList.remove('step3_genplan-button');
                    }

                    return;
                }

                let targetStep3;
                if (targetHouseId) {
                    targetStep3 = document.querySelector(`.block-genplan__content-container.step3[data-id="${targetHouseId}"]`);
                } else {
                    targetStep3 = document.querySelector('.block-genplan__content-container.step3');
                }

                if (targetStep3) {
                    targetStep3.classList.add('_active');
                    if (titleRooms) {
                        titleRooms.addEventListener('click', () => {
                            if (isMobileDevice()) {
                                toggleSteps(true, false);
                                return;
                            }
                            const activeStep3 = document.querySelector('.block-genplan__content-container.step3._active');
                            if (activeStep3) {
                                toggleSteps(true, false);
                            }
                        });
                    }
                    document.documentElement.classList.remove('choice-home');
                    currentContainer = targetStep3;
                    if (titleRooms) {
                        titleRooms.classList.add('_active');
                    }
                    if (switchGenplan) {
                        switchGenplan.classList.add('_active');
                    }
                    const zoomGenplan = document.querySelector('.zoom-genplan');
                    if (zoomGenplan) {
                        zoomGenplan.classList.add('hidden');
                    }

                    if (fullscreenBtn) {
                        fullscreenBtn.classList.add('step3_genplan-button');
                    }
                }
            } else if (showStep2) {
                contentContainerStep2.classList.add('_active');
                titleHouse.classList.add('_active');
                document.documentElement.classList.add('choice-home');
                currentContainer = contentContainerStep2;

                if (switchGenplan) {
                    switchGenplan.classList.remove('_active');
                }

                const zoomGenplan = document.querySelector('.zoom-genplan');
                if (zoomGenplan) {
                    zoomGenplan.classList.remove('hidden');
                }

                if (fullscreenBtn) {
                    fullscreenBtn.classList.remove('step3_genplan-button');
                }
            } else {
                contentContainerStep1.classList.add('_active');
                titleGenplan.classList.add('_active');
                document.documentElement.classList.remove('choice-home');
                currentContainer = contentContainerStep1;

                if (switchGenplan) {
                    switchGenplan.classList.remove('_active');
                }

                const zoomGenplan = document.querySelector('.zoom-genplan');
                if (zoomGenplan) {
                    zoomGenplan.classList.remove('hidden');
                }

                if (fullscreenBtn) {
                    fullscreenBtn.classList.remove('step3_genplan-button');
                }

                setTimeout(() => {
                    initTippyFloorHandlers();
                    initFloorSelectionHandlers();
                }, 100);
            }

            updateEntrancesState();
            resetTransformations();

            if (document.fullscreenElement) {
                updateSvgsSize();
            }
        }

        // === ПОПАПЫ ===
        function togglePopup(id) {
            const targetPopup = document.querySelector(`.block-genplan-popup[data-id-popup="${id}"]`);
            if (!targetPopup) return;
            const activePopup = document.querySelector('.block-genplan-popup._active');
            const wasActive = targetPopup === activePopup;
            document.querySelectorAll('.block-genplan-popup._active').forEach(popup => {
                popup.classList.remove('_active');
            });
            document.querySelectorAll('.block-genplan__path._active, .block-genplan__tippy._active').forEach(el => {
                el.classList.remove('_active');
            });
            if (wasActive) {
                document.documentElement.classList.remove('popup-open');
                return;
            }
            targetPopup.classList.add('_active');
            const path = document.querySelector(`.block-genplan__path[data-id="${id}"]`);
            const tippy = document.querySelector(`.block-genplan__tippy[data-id="${id}"]`);
            if (path) path.classList.add('_active');
            if (tippy) tippy.classList.add('_active');
            document.documentElement.classList.add('popup-open');
        }

        // Клик по path или tippy
        container.addEventListener('click', (e) => {
            let id = null;
            if (e.target.classList.contains('block-genplan__path')) {
                id = e.target.getAttribute('data-id');
            } else if (e.target.closest('.block-genplan__tippy')) {
                const button = e.target.closest('.block-genplan__tippy');
                id = button.getAttribute('data-id');
            }
            if (id) {
                e.preventDefault();
                e.stopPropagation();
                togglePopup(id);
            }
        });

        // Закрытие попапа по крестику
        document.querySelectorAll('.block-genplan-popup__close').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                const popup = btn.closest('.block-genplan-popup');
                if (popup) {
                    const id = popup.getAttribute('data-id-popup');
                    popup.classList.remove('_active');
                    document.documentElement.classList.remove('popup-open');
                    document.querySelectorAll(`[data-id="${id}"]._active`).forEach(el => {
                        el.classList.remove('_active');
                    });
                }
            });
        });

        // Закрытие по клику вне
        document.addEventListener('click', (e) => {
            const activePopup = document.querySelector('.block-genplan-popup._active');
            if (!activePopup) return;
            const isInside = activePopup.contains(e.target);
            const isOnTippy = e.target.closest('.block-genplan__tippy');
            const isOnPath = e.target.classList.contains('block-genplan__path');
            if (!isInside && !isOnTippy && !isOnPath) {
                const id = activePopup.getAttribute('data-id-popup');
                activePopup.classList.remove('_active');
                document.documentElement.classList.remove('popup-open');
                document.querySelectorAll(`[data-id="${id}"]._active`).forEach(el => {
                    el.classList.remove('_active');
                });
            }
        });

        // === ОБРАБОТЧИК ПЕРЕКЛЮЧАТЕЛЯ ===
        if (switchToggle) {
            switchToggle.addEventListener('change', updateEntrancesState);
        }

        // Обработчик клика на tippy-floor
        function initTippyFloorHandlers() {
            document.querySelectorAll('.tippy-floor').forEach(tippy => {
                tippy.addEventListener('click', (e) => {
                    e.stopPropagation();

                    const tippyId = tippy.getAttribute('data-id');
                    if (!tippyId) return;

                    const activeStep3 = document.querySelector('.block-genplan__content-container.step3._active');
                    if (!activeStep3) return;

                    const correspondingPath = activeStep3.querySelector(`.block-genplan__path.kv[data-id="${tippyId}"]`);
                    if (!correspondingPath) return;

                    const correspondingPopup = activeStep3.querySelector(`.block-genplan-popup[data-id-popup="${tippyId}"]`);

                    activeStep3.querySelectorAll('.tippy-floor._active, .block-genplan__path.kv._active, .block-genplan-popup._active').forEach(el => {
                        el.classList.remove('_active');
                    });

                    document.documentElement.classList.remove('popup-open');

                    tippy.classList.add('_active');
                    correspondingPath.classList.add('_active');

                    if (correspondingPopup) {
                        correspondingPopup.classList.add('_active');
                        document.documentElement.classList.add('popup-open');
                    }
                });
            });

            document.addEventListener('click', (e) => {
                const isTippy = e.target.closest('.tippy-floor');
                const isPath = e.target.classList.contains('block-genplan__path');
                const isPopup = e.target.closest('.block-genplan-popup');

                if (!isTippy && !isPath && !isPopup) {
                    const activeStep3 = document.querySelector('.block-genplan__content-container.step3._active');
                    if (activeStep3) {
                        activeStep3.querySelectorAll('.tippy-floor._active, .block-genplan__path.kv._active, .block-genplan-popup._active').forEach(el => {
                            el.classList.remove('_active');
                        });
                        document.documentElement.classList.remove('popup-open');
                    }
                }
            });

            document.querySelectorAll('.block-genplan-popup__close').forEach(btn => {
                btn.addEventListener('click', (e) => {
                    e.stopPropagation();
                    const popup = btn.closest('.block-genplan-popup');
                    if (popup) {
                        const id = popup.getAttribute('data-id-popup');
                        popup.classList.remove('_active');
                        document.documentElement.classList.remove('popup-open');

                        const activeStep3 = document.querySelector('.block-genplan__content-container.step3._active');
                        if (activeStep3 && id) {
                            activeStep3.querySelectorAll(`[data-id="${id}"]._active`).forEach(el => {
                                el.classList.remove('_active');
                            });
                        }
                    }
                });
            });
        }

        // === ОБРАБОТЧИК ВЫБОРА ЭТАЖЕЙ НА МОБИЛЬНЫХ ===
        function initFloorSelectionHandlers() {
            // Обработчик для кнопок "Выбрать этаж" на мобильных
            document.querySelectorAll('.choose-floor').forEach(btn => {
                btn.addEventListener('click', (e) => {
                    e.stopPropagation();
                    e.preventDefault();

                    if (isMobileDevice()) {
                        const popup = btn.closest('.block-genplan-popup');
                        if (popup) {
                            const houseId = popup.getAttribute('data-id-popup');
                            const targetFloors = document.querySelector(`.floors-block-genplan.mob[data-id="${houseId}"]`);

                            if (targetFloors) {
                                targetFloors.classList.add('_active');
                                document.documentElement.classList.add('popup-floor-open');

                                popup.classList.remove('_active');
                                document.documentElement.classList.remove('popup-open');
                            }
                        }
                    } else {
                        const popup = btn.closest('.block-genplan-popup');
                        if (popup) {
                            const houseId = popup.getAttribute('data-id-popup');
                            toggleSteps(false, true, houseId);
                            popup.classList.remove('_active');
                            document.documentElement.classList.remove('popup-open');
                        }
                    }
                });
            });

            // Закрытие мобильного выбора этажей по крестику
            document.querySelectorAll('.floors-block-genplan.mob .block-genplan-popup__close').forEach(closeBtn => {
                closeBtn.addEventListener('click', (e) => {
                    e.stopPropagation();
                    const floorsContainer = closeBtn.closest('.floors-block-genplan.mob');
                    if (floorsContainer) {
                        floorsContainer.classList.remove('_active');
                        document.documentElement.classList.remove('popup-floor-open');
                    }
                });
            });

            // Закрытие по клику вне мобильного выбора этажей
            document.addEventListener('click', (e) => {
                if (isMobileDevice() &&
                    document.documentElement.classList.contains('popup-floor-open') &&
                    !e.target.closest('.floors-block-genplan.mob') &&
                    !e.target.closest('.choose-floor')) {

                    document.querySelectorAll('.floors-block-genplan.mob._active').forEach(container => {
                        container.classList.remove('_active');
                    });
                    document.documentElement.classList.remove('popup-floor-open');
                }
            });

            // Обработчик выбора конкретного этажа в мобильной версии
            document.querySelectorAll('.floors-block-genplan.mob .floors-block-genplan__button').forEach(button => {
                button.addEventListener('click', (e) => {
                    e.stopPropagation();
                    const floor = button.getAttribute('data-floor');
                    const floorsContainer = button.closest('.floors-block-genplan.mob');
                    const houseId = floorsContainer.getAttribute('data-id');
                    const chooseFloorsContainer = document.querySelector(`.block-genplan__choose-floors-mob[data-id="${houseId}"]`);
                    if (chooseFloorsContainer) {
                        chooseFloorsContainer.querySelectorAll('.choose-floor-mob').forEach(floorBlock => {
                            floorBlock.classList.remove('_active');
                        });
                        const targetFloorBlock = chooseFloorsContainer.querySelector(`.choose-floor-mob[data-floor="${floor}"]`);
                        if (targetFloorBlock) {
                            targetFloorBlock.classList.add('_active');
                            chooseFloorsContainer.classList.add('_active');
                            initMobileFloorSelectionHandlers();
                        }
                    }
                });
            });

            document.addEventListener('click', (e) => {
                if (e.target.closest('.block-genplan__choose-floors-mob .block-genplan-popup__close')) {
                    const floorsContainer = e.target.closest('.block-genplan__choose-floors-mob');
                    if (floorsContainer) {
                        floorsContainer.classList.remove('_active');
                    }
                    return;
                }

                if (!e.target.closest('.block-genplan__choose-floors-mob') &&
                    !e.target.closest('.floors-block-genplan.mob') &&
                    document.querySelector('.block-genplan__choose-floors-mob._active')) {
                    document.querySelector('.block-genplan__choose-floors-mob._active').classList.remove('_active');
                }
            });

            // Обработчик выбора этажа в десктопной версии (step3)
            document.querySelectorAll('.block-genplan__content-container.step3 .floors-block-genplan__button').forEach(button => {
                button.addEventListener('click', (e) => {
                    e.stopPropagation();

                    if (isMobileDevice()) return;

                    const floor = button.getAttribute('data-floor');
                    const step3Container = button.closest('.block-genplan__content-container.step3');

                    step3Container.querySelectorAll('.floors-block-genplan__button._active, .block-genplan__images._active').forEach(el => {
                        el.classList.remove('_active');
                    });

                    button.classList.add('_active');

                    const targetImage = step3Container.querySelector(`.block-genplan__images[data-floor="${floor}"]`);
                    if (targetImage) {
                        targetImage.classList.add('_active');
                    }
                });
            });

            document.querySelectorAll('.block-genplan__choose-floors-mob .block-genplan-popup__close').forEach(closeBtn => {
                closeBtn.addEventListener('click', (e) => {
                    e.stopPropagation();
                    const floorsContainer = closeBtn.closest('.block-genplan__choose-floors-mob');
                    if (floorsContainer) {
                        floorsContainer.classList.remove('_active');
                    }
                });
            });
        }

        // Обработчики для кнопок выбора этажа и закрытия на мобильных устройствах
        function initMobileFloorSelectionHandlers() {
            document.querySelectorAll('.title-choose-floor').forEach(button => {
                button.addEventListener('click', (e) => {
                    e.stopPropagation();
                    const activeFloorsContainer = document.querySelector('.block-genplan__choose-floors-mob._active');
                    if (activeFloorsContainer) {
                        activeFloorsContainer.querySelectorAll('.choose-floor-mob._active').forEach(floorBlock => {
                            floorBlock.classList.remove('_active');
                        });
                        activeFloorsContainer.classList.remove('_active');
                        document.documentElement.classList.remove('popup-floor-open');
                    }
                });
            });

            document.querySelectorAll('.title-choose-close').forEach(closeButton => {
                closeButton.addEventListener('click', (e) => {
                    e.stopPropagation();
                    const floorBlock = closeButton.closest('.choose-floor-mob');
                    if (floorBlock) {
                        floorBlock.classList.remove('_active');
                    }
                    const floorsContainer = closeButton.closest('.block-genplan__choose-floors-mob');
                    if (floorsContainer) {
                        floorsContainer.classList.remove('_active');
                        const houseId = floorsContainer.getAttribute('data-id');
                        if (houseId) {
                            const mobileFloorsPopup = document.querySelector(`.floors-block-genplan.mob[data-id="${houseId}"]`);
                            if (mobileFloorsPopup) {
                                mobileFloorsPopup.classList.remove('_active');
                            }
                        }
                    }
                    document.querySelectorAll('.block-genplan__path.path-blue._active, .block-genplan__tippy._active').forEach(el => {
                        el.classList.remove('_active');
                    });
                    document.documentElement.classList.remove('popup-floor-open');
                });
            });

            document.addEventListener('click', (e) => {
                if (!e.target.closest('.block-genplan__choose-floors-mob') &&
                    !e.target.closest('.floors-block-genplan.mob') &&
                    !e.target.closest('.choose-floor')) {

                    document.querySelectorAll('.block-genplan__choose-floors-mob._active, .choose-floor-mob._active').forEach(el => {
                        el.classList.remove('_active');
                    });

                    document.querySelectorAll('.block-genplan__path.path-blue._active, .block-genplan__tippy._active').forEach(el => {
                        el.classList.remove('_active');
                    });

                    document.documentElement.classList.remove('popup-floor-open');
                }
            });
        }

        // === ИНИЦИАЛИЗАЦИЯ ===
        function init() {
            if (isMobileDevice()) {
                initMobileDrag();
            } else {
                initDesktopInteractions();
            }
            updateTransform();

            initMobileFloorSelectionHandlers();
            updateEntrancesState();
            initTippyFloorHandlers();
            initFloorSelectionHandlers();
        }

        init();

        window.addEventListener('resize', () => {
            init();

            if (document.fullscreenElement) {
                updateSvgsSize();
            }
            clampTranslation();
            updateTransform();
        });
    }

    // Инициализация данных генплана
    initGenplan().catch(console.error);
});

// Функция для переключения этажей
function initFloorSwitching() {
    const floorContainers = document.querySelectorAll('.floors-block-genplan');

    if (floorContainers) {
        floorContainers.forEach(container => {
            const buttons = container.querySelectorAll('.floors-block-genplan__button');
            const parentBlock = container.closest('.block-genplan__content-container.step3');

            if (!parentBlock) return;

            buttons.forEach(button => {
                button.addEventListener('click', () => {
                    const floor = button.getAttribute('data-floor');

                    buttons.forEach(btn => btn.classList.remove('_active'));
                    button.classList.add('_active');

                    const floorImages = parentBlock.querySelectorAll('.block-genplan__images');

                    floorImages.forEach(img => img.classList.remove('_active'));

                    const targetFloor = parentBlock.querySelector(`.block-genplan__images[data-floor="${floor}"]`);
                    if (targetFloor) {
                        targetFloor.classList.add('_active');
                    }
                });
            });
        });
    }
}

document.addEventListener('DOMContentLoaded', () => {
    initFloorSwitching();
});