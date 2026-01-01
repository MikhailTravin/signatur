async function fetchRegions() {
    const res = await fetch('/ajax/genplan.php?action=get_regions');
    const data = await res.json();
    if (data.error) throw new Error(data.result);
    return data.result;
}

async function fetchHouse(houseId) {
    const res = await fetch(`/ajax/genplan.php?action=get_house&house_id=${houseId}`);
    const data = await res.json();
    if (data.error) throw new Error(data.result);
    return data.result;
}

let regionsData = null;
let loadedHouses = new Map();
const houseIdMapping = new Map();
let currentContainer = null;
let scale = 1;
let translateX = 0;
let translateY = 0;

const minScale = 1;
const maxScale = 4;
const zoomStep = 0.3;
let isDragging = false;
let startX, startY;

let touchStartDistance = 0;
let lastScale = 1;
let touchMode = null;
let centerX = 0;
let centerY = 0;

let isMobileDragging = false;
let startScrollLeft = 0;
let startScrollTop = 0;
let startMobileX = 0;
let startMobileY = 0;

const SVG_WIDTH = 1200;
const SVG_HEIGHT = 631;

function isMobileDevice() {
    return window.innerWidth < 1200;
}

function resetTransformations() {
    if (currentContainer.classList.contains('step3')) {
        scale = 1;
        translateX = 0;
        translateY = 0;
    } else {
        scale = minScale;
        translateX = 0;
        translateY = 0;
    }
    updateTransform();
}

function getCurrentContainerSize() {
    if (!currentContainer) return { width: 0, height: 0 };

    if (document.fullscreenElement) {
        const fullscreenContainer = document.querySelector('[data-fullscreen-container]');
        if (fullscreenContainer) {
            const rect = fullscreenContainer.getBoundingClientRect();
            return {
                width: rect.width,
                height: rect.height
            };
        }
    }

    const container = document.querySelector('.block-genplan__body');
    if (container) {
        return {
            width: container.offsetWidth,
            height: container.offsetHeight
        };
    }

    return { width: 0, height: 0 };
}

function clampTranslation() {
    if (!currentContainer || isMobileDevice()) return;
    if (currentContainer.classList.contains('step3')) return;

    const size = getCurrentContainerSize();

    if (document.fullscreenElement) {
        const containerWidth = size.width;
        const containerHeight = size.height;

        const scaledWidth = containerWidth * scale;
        const scaledHeight = containerHeight * scale;

        if (scaledWidth <= containerWidth && scaledHeight <= containerHeight) {
            translateX = 0;
            translateY = 0;
            return;
        }

        const maxX = Math.max(0, (scaledWidth - containerWidth) / 2);
        const maxY = Math.max(0, (scaledHeight - containerHeight) / 2);

        translateX = Math.max(-maxX, Math.min(maxX, translateX));
        translateY = Math.max(-maxY, Math.min(maxY, translateY));
    } else {
        const maxX = (scale - 1) * size.width / 2;
        const maxY = (scale - 1) * size.height / 2;

        translateX = Math.max(-maxX, Math.min(maxX, translateX));
        translateY = Math.max(-maxY, Math.min(maxY, translateY));
    }
}

function zoomToPoint(scaleFactor, clientX, clientY) {
    if (isMobileDevice()) return;
    if (currentContainer.classList.contains('step3')) return;

    const newScale = Math.min(Math.max(scale * scaleFactor, minScale), maxScale);
    const zoomRatio = newScale / scale;

    let relativeX, relativeY;

    if (document.fullscreenElement) {
        const rect = currentContainer.getBoundingClientRect();
        relativeX = clientX - rect.left;
        relativeY = clientY - rect.top;
    } else {
        const rect = currentContainer.getBoundingClientRect();
        relativeX = clientX - rect.left;
        relativeY = clientY - rect.top;
    }

    translateX = relativeX - zoomRatio * (relativeX - translateX);
    translateY = relativeY - zoomRatio * (relativeY - translateY);

    scale = newScale;
    clampTranslation();
    updateTransform();
}

const houseSizeConfig = {
    '6': {
        svgWidth: 531,
        svgHeight: 550,
        imgWidth: 531,
        imgHeight: 550
    },
    '8': {
        svgWidth: 531,
        svgHeight: 550,
        imgWidth: 531,
        imgHeight: 550
    },
    '9': {
        svgWidth: 531,
        svgHeight: 550,
        imgWidth: 531,
        imgHeight: 550
    },
    '10': {
        svgWidth: 531,
        svgHeight: 550,
        imgWidth: 531,
        imgHeight: 550
    },
    '11': {
        svgWidth: 531,
        svgHeight: 550,
        imgWidth: 531,
        imgHeight: 550
    },
    '12': {
        svgWidth: 531,
        svgHeight: 550,
        imgWidth: 531,
        imgHeight: 550
    },
    '13': {
        svgWidth: 531,
        svgHeight: 550,
        imgWidth: 531,
        imgHeight: 550
    },
    '14': {
        svgWidth: 531,
        svgHeight: 550,
        imgWidth: 531,
        imgHeight: 550
    },
    '15': {
        svgWidth: 263,
        svgHeight: 504,
        imgWidth: 263,
        imgHeight: 504
    },
    '16': {
        svgWidth: 263,
        svgHeight: 504,
        imgWidth: 263,
        imgHeight: 504
    },
    '17': {
        svgWidth: 263,
        svgHeight: 504,
        imgWidth: 263,
        imgHeight: 504
    },
    '18': {
        svgWidth: 263,
        svgHeight: 504,
        imgWidth: 263,
        imgHeight: 504
    },
    'default': {
        svgWidth: 531,
        svgHeight: 550,
        imgWidth: 531,
        imgHeight: 550
    }
};

const popupPositionConfig = {
    'r1': {
        top: '50%',
        left: '50%',
        transform: 'translate(-50%,-50%)'
    },
    'h9': {
        top: '5%',
        left: '38%'
    },
    'h10': {
        top: '10%',
        left: '23%'
    },
    'h11': {
        top: '20%',
        left: '11%'
    },
    'h12': {
        top: '32%',
        left: '20%'
    },
    'h8': {
        top: '23%',
        right: '19%'
    },
    'h6': {
        bottom: '10%',
        right: '28%'
    },
    'h13': {
        bottom: '10%',
        right: '48%'
    },
    'h14': {
        bottom: '10%',
        left: '42%'
    },
    'h15': {
        top: '10%',
        right: '29%'
    },
    'h16': {
        top: '14%',
        right: '24%'
    },
    'h17': {
        top: '20%',
        right: '23%'
    },
    'h18': {
        top: '30%',
        right: '10%'
    }
};

function updateTransform() {
    if (currentContainer && !isMobileDevice()) {
        let currentScale = scale;

        if (currentContainer.classList.contains('step3')) {
            currentScale = 1;
            translateX = 0;
            translateY = 0;
            currentContainer.style.transform = 'none';
            return;
        }

        currentContainer.style.transform = `translate(${translateX}px, ${translateY}px) scale(${currentScale})`;
    }
}

document.addEventListener('DOMContentLoaded', async () => {
    const blockGenplan = document.querySelector('.block-genplan');
    if (!blockGenplan) return;

    try {
        regionsData = await fetchRegions();
        renderStep1AndStep2();
        renderPopups();

        if (regionsData && regionsData.length && regionsData[0].HOUSES) {
            regionsData[0].HOUSES.forEach(house => {
                setTimeout(() => {
                    if (!loadedHouses.has(house.ID.toString())) {
                        fetchHouse(house.ID).then(data => {
                            loadedHouses.set(house.ID.toString(), data);
                        }).catch(err => {
                            console.warn('Не удалось предзагрузить дом', house.ID, err);
                        });
                    }
                }, 100);
            });
        }

        initEntranceToggleSwitchHandler();
        initObjectsToggleSwitch();
        initPopupHandlers();
        initMobileFloorHandlers();
        initExistingHandlers();
    } catch (err) {
        console.error('Ошибка загрузки генплана:', err);
    }
});

document.addEventListener('visibilitychange', function () {
    if (!document.hidden) {
        refreshEntrancesState;
    }
});

window.addEventListener('resize', function () {
    refreshEntrancesState;
});

function renderStep1AndStep2() {
    if (!regionsData || !regionsData.length) return;
    const region = regionsData[0];
    const svg1 = document.querySelector('.step1 .block-genplan__svg');
    const tips1 = document.querySelector('.step1 .block-genplan__tips');
    const svg2 = document.querySelector('.step2 .block-genplan__svg');
    const tips2 = document.querySelector('.step2 .block-genplan__tips');
    const step2Image = document.querySelector('.step2 .block-genplan__image img');
    const step2ImageContainer = document.querySelector('.step2 .block-genplan__image');

    if (step2Image && region.GENPLAN_IMAGE) {
        step2Image.src = region.GENPLAN_IMAGE;
        if (!step2Image.dataset.originalWidth) {
            step2Image.dataset.originalWidth = step2Image.width || '1200';
            step2Image.dataset.originalHeight = step2Image.height || '631';
        }
    }

    svg1.innerHTML = '';
    tips1.innerHTML = '';
    svg2.innerHTML = '';
    tips2.innerHTML = '';

    if (!svg1.dataset.originalViewBox) {
        svg1.dataset.originalViewBox = '0 0 1200 631';
        svg1.dataset.originalWidth = '1200';
        svg1.dataset.originalHeight = '631';
    }
    if (!svg2.dataset.originalViewBox) {
        svg2.dataset.originalViewBox = '0 0 1200 631';
        svg2.dataset.originalWidth = '1200';
        svg2.dataset.originalHeight = '631';
    }

    const regionPaths = [
        {
            d: 'M774.317 232.765L666.515 297.554H663.972L658.379 303.725L830.761 407.08L987.379 297.554L840.931 226.08L806.862 250.248L774.317 232.765Z',
            class: 'path1',
            id: 'r1'
        }
    ];

    regionPaths.forEach((pathData) => {
        const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
        path.setAttribute('data-id', pathData.id);
        path.setAttribute('class', `block-genplan__path ${pathData.class}`);
        path.setAttribute('d', pathData.d);
        svg1.appendChild(path);
    });

    const tippy1 = document.createElement('button');
    tippy1.className = 'block-genplan__tippy';
    tippy1.dataset.id = 'r1';
    tippy1.style.top = `${region.POS_TOP}%`;
    tippy1.style.right = `${region.POS_RIGHT}%`;
    tippy1.innerHTML = `<span>${region.NAME}</span>`;
    tips1.appendChild(tippy1);

    region.HOUSES.forEach(house => {
        const houseId = `h${house.ID}`;
        houseIdMapping.set(houseId, house.ID);
        if (house.SVG_PATH) {
            const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
            path.setAttribute('data-id', houseId);
            path.setAttribute('class', 'block-genplan__path path-blue');
            path.setAttribute('d', house.SVG_PATH);
            svg2.appendChild(path);
        }

        const tippy = document.createElement('button');
        tippy.className = 'block-genplan__tippy';
        tippy.dataset.id = houseId;
        if (house.POS_TOP !== undefined) tippy.style.top = `${house.POS_TOP}%`;
        if (house.POS_RIGHT !== undefined) tippy.style.right = `${house.POS_RIGHT}%`;
        else if (house.POS_LEFT !== undefined) tippy.style.left = `${house.POS_LEFT}%`;
        tippy.innerHTML = `<span>${house.NAME}</span>`;
        tips2.appendChild(tippy);
    });

    saveOriginalImageSizes();

    const step1 = document.querySelector('.block-genplan__content-container.step1');
    if (step1 && !step1.classList.contains('_active')) {
        step1.classList.add('_active');
    }
    updateCurrentContainer();
}

function renderPopups() {
    const popupsContainer = document.querySelector('.block-genplan__popups');
    if (!popupsContainer || !regionsData?.length) return;

    popupsContainer.innerHTML = '';
    const region = regionsData[0];

    const regionPopup = document.createElement('div');
    regionPopup.className = 'block-genplan-popup';
    regionPopup.dataset.idPopup = 'r1';

    applyIndividualPopupPosition(regionPopup, 'r1');

    regionPopup.innerHTML = `
        <button type="button" class="block-genplan-popup__close">
            <svg aria-hidden="true" width="13" height="13"><use xlink:href="/img/sprite.svg#close"></use></svg>
        </button>
        <div class="block-genplan-popup__content">
            <div class="block-genplan-popup__body">
                <div class="block-genplan-popup__title">${region.NAME}</div>
                <div class="block-genplan-popup__top">
                    <ul>
                        <li><div class="block-genplan-popup__name">Домов построено</div><div class="block-genplan-popup__value">${region.HOUSES_COUNT}</div></li>
                        <li><div class="block-genplan-popup__name">Срок сдачи:</div><div class="block-genplan-popup__value">${region.DEADLINE}</div></li>
                    </ul>
                </div>
                <div class="block-genplan-popup__image">
                    <img loading="lazy" src="${region.IMAGE}" alt="">
                    <p>${region.PREVIEW_TEXT}</p>
                </div>
                <div class="block-genplan-popup__rooms">
                    <ul>
                        ${region.ROOMS_INFO.map(r => `
                            <li>
                                <div class="block-genplan-popup__room">${r.NAME}</div>
                                ${r.PRICE ? `<div class="block-genplan-popup__price">от ${r.PRICE.toLocaleString('ru-RU')} руб.</div>` : ''}
                            </li>
                        `).join('')}
                    </ul>
                </div>
                <div class="block-genplan-popup__buttons">
                    <a href="#" class="block-genplan-popup__button btn btn-genplan">
                        <span>Выбрать дом</span>
                        <svg aria-hidden="true" width="12" height="9"><use xlink:href="/img/sprite.svg#arrow1"></use></svg>
                    </a>
                </div>
            </div>
        </div>
    `;
    popupsContainer.appendChild(regionPopup);

    region.HOUSES.forEach(house => {
        const houseId = `h${house.ID}`;
        const originalHouseId = house.ID;

        const chooseApartmentText = house.COMING_SOON === 1 ? 'Скоро в продаже' : 'Выбрать квартиру';
        const isComingSoon = house.COMING_SOON === 1;

        const housePopup = document.createElement('div');
        housePopup.className = 'block-genplan-popup';
        housePopup.dataset.idPopup = houseId;
        housePopup.dataset.originalId = originalHouseId;

        applyIndividualPopupPosition(housePopup, houseId);

        housePopup.innerHTML = `
            <button type="button" class="block-genplan-popup__close">
                <svg aria-hidden="true" width="13" height="13"><use xlink:href="/img/sprite.svg#close"></use></svg>
            </button>
            <div class="block-genplan-popup__content">
                <div class="block-genplan-popup__body">
                    <div class="block-genplan-popup__title">${house.NAME}</div>
                    <div class="block-genplan-popup__top">
                        <ul>
                            <li><div class="block-genplan-popup__name">Срок сдачи:</div><div class="block-genplan-popup__value">${house.DEADLINE}</div></li>
                            ${isComingSoon ? '<li><div class="block-genplan-popup__name">Статус:</div><div class="block-genplan-popup__value coming-soon-status">Скоро в продаже</div></li>' : ''}
                        </ul>
                    </div>
                    <div class="block-genplan-popup__rooms">
                        <ul>
                            ${house.ROOMS_INFO.map(r => `
                                <li>
                                    <div class="block-genplan-popup__room">${r.NAME}</div>
                                    ${r.PRICE ? `<div class="block-genplan-popup__price">от ${r.PRICE.toLocaleString('ru-RU')} руб.</div>` : ''}
                                </li>
                            `).join('')}
                        </ul>
                    </div>
                    <div class="block-genplan-popup__buttons">
                        ${!isComingSoon ? `
                            <a href="#" data-house-id="${originalHouseId}" class="block-genplan-popup__button choose-apartment btn">
                                <span>Выбрать квартиру</span>
                                <svg aria-hidden="true" width="12" height="9"><use xlink:href="/img/sprite.svg#arrow1"></use></svg>
                            </a>
                            <a href="#" data-house-id="${originalHouseId}" class="block-genplan-popup__button choose-floor btn">
                                <span>Выбрать этаж</span>
                                <svg aria-hidden="true" width="12" height="9"><use xlink:href="/img/sprite.svg#arrow1"></use></svg>
                            </a>
                            <a href="#" class="block-genplan-popup__button btn"><span>Показать кладовые</span></a>
                        ` : `
                            <a href="#" class="block-genplan-popup__button btn coming-soon-single">
                                <span>Скоро в продаже</span>
                            </a>
                        `}
                    </div>
                </div>
            </div>
        `;
        popupsContainer.appendChild(housePopup);
    });
}

function applyIndividualPopupPosition(popupElement, popupId) {
    const positionConfig = popupPositionConfig[popupId];

    if (positionConfig) {
        popupElement.style.cssText = '';

        Object.keys(positionConfig).forEach(property => {
            popupElement.style[property] = positionConfig[property];
        });
    } else {
        if (popupId.startsWith('h')) {
            const houseId = popupId.replace('h', '');
            const region = regionsData[0];
            const house = region.HOUSES.find(h => h.ID == houseId);

            if (house) {
                if (house.POS_TOP !== undefined) popupElement.style.top = `${house.POS_TOP}%`;
                if (house.POS_RIGHT !== undefined) popupElement.style.right = `${house.POS_RIGHT}%`;
                else if (house.POS_LEFT !== undefined) popupElement.style.left = `${house.POS_LEFT}%`;
            }
        }
    }
}

function initPopupHandlers() {
    document.addEventListener('click', (e) => {
        const tippy = e.target.closest('.block-genplan__tippy');
        if (tippy) {
            const id = tippy.dataset.id;
            if (id) {
                e.preventDefault();
                e.stopPropagation();
                togglePopup(id);
                return;
            }
        }

        if (e.target.classList.contains('.block-genplan__path')) {
            const id = e.target.getAttribute('data-id');
            if (id) {
                e.preventDefault();
                e.stopPropagation();
                togglePopup(id);
                return;
            }
        }

        const chooseFloorBtn = e.target.closest('.choose-floor');
        if (chooseFloorBtn) {
            e.preventDefault();
            e.stopPropagation();

            const houseId = chooseFloorBtn.dataset.houseId;
            if (houseId) {
                const visualHouseId = `h${houseId}`;

                if (window.innerWidth <= 768) {
                    const activePopup = document.querySelector('.block-genplan-popup._active');
                    if (activePopup) {
                        activePopup.classList.remove('_active');
                        document.documentElement.classList.remove('popup-open');
                    }

                    createMobileFloorsPopup(houseId, visualHouseId);
                } else {
                    const popup = chooseFloorBtn.closest('.block-genplan-popup');
                    loadAndRenderStep3(houseId).then(() => {
                        const visualHouseId = `h${houseId}`;
                        toggleSteps(false, true, visualHouseId);
                        popup?.classList.remove('_active');
                        document.documentElement.classList.remove('popup-open');
                    });
                }
            }
            return;
        }

        const chooseApartmentBtn = e.target.closest('.choose-apartment');
        if (chooseApartmentBtn) {
            e.preventDefault();
            e.stopPropagation();

            if (chooseApartmentBtn.classList.contains('coming-soon')) {
                return;
            }

            const houseId = chooseApartmentBtn.dataset.houseId;
            if (houseId) {
                const popup = chooseApartmentBtn.closest('.block-genplan-popup');

                if (window.innerWidth <= 768) {
                    const visualHouseId = `h${houseId}`;
                    if (!loadedHouses.has(houseId)) {
                        fetchHouse(houseId).then(houseData => {
                            loadedHouses.set(houseId, houseData);
                            createMobileFloorsPopup(houseId, visualHouseId);
                        }).catch(err => {
                            console.error('Ошибка загрузки дома:', err);
                        });
                    } else {
                        createMobileFloorsPopup(houseId, visualHouseId);
                    }
                } else {
                    loadAndRenderStep3(houseId).then(() => {
                        const visualHouseId = `h${houseId}`;
                        toggleSteps(false, true, visualHouseId);
                        popup?.classList.remove('_active');
                        document.documentElement.classList.remove('popup-open');
                    });
                }
            }
            return;
        }

        if (e.target.closest('.btn-genplan')) {
            e.preventDefault();
            e.stopPropagation();
            toggleSteps(true, false);
            const activePopup = document.querySelector('.block-genplan-popup._active');
            if (activePopup) {
                activePopup.classList.remove('_active');
                document.documentElement.classList.remove('popup-open');
            }
            return;
        }

        const closeBtn = e.target.closest('.block-genplan-popup__close');
        if (closeBtn) {
            e.preventDefault();
            e.stopPropagation();
            const popup = closeBtn.closest('.block-genplan-popup, .floors-block-genplan.mob');
            if (popup) {
                const id = popup.getAttribute('data-id-popup') || popup.getAttribute('data-id');
                popup.classList.remove('_active');
                document.documentElement.classList.remove('popup-open');
                if (id) {
                    document.querySelectorAll(`[data-id="${id}"]._active`).forEach(el => {
                        el.classList.remove('_active');
                    });
                }
            }
            return;
        }
    });

    document.addEventListener('click', (e) => {
        const activePopup = document.querySelector('.block-genplan-popup._active');
        if (!activePopup) return;

        const isInside = activePopup.contains(e.target);
        const isOnTippy = e.target.closest('.block-genplan__tippy');
        const isOnPath = e.target.classList.contains('.block-genplan__path');

        if (!isInside && !isOnTippy && !isOnPath) {
            const id = activePopup.getAttribute('data-id-popup');
            activePopup.classList.remove('_active');
            document.documentElement.classList.remove('popup-open');
            document.querySelectorAll(`[data-id="${id}"]._active`).forEach(el => {
                el.classList.remove('_active');
            });
        }
    });

    document.addEventListener('click', (e) => {
        const activeFloorsPopup = document.querySelector('.floors-block-genplan.mob._active');
        if (activeFloorsPopup && !activeFloorsPopup.contains(e.target) && !e.target.closest('.choose-floor')) {
            activeFloorsPopup.classList.remove('_active');
            document.documentElement.classList.remove('popup-open');
        }
    });
}

function createMobileFloorsPopup(houseId, visualHouseId) {
    const houseData = regionsData[0].HOUSES.find(h => h.ID == houseId);
    const isComingSoon = houseData && houseData.COMING_SOON === 1;

    if (isComingSoon) {
        const popupsContainer = document.querySelector('.block-genplan__popups');
        const existingMessage = document.querySelector('.coming-soon-message');
        if (existingMessage) {
            existingMessage.remove();
        }

        const messagePopup = document.createElement('div');
        messagePopup.className = 'block-genplan-popup coming-soon-message _active';
        messagePopup.innerHTML = `
            <button type="button" class="block-genplan-popup__close">
                <svg aria-hidden="true" width="13" height="13">
                    <use xlink:href="/img/sprite.svg#close"></use>
                </svg>
            </button>
            <div class="block-genplan-popup__content">
                <div class="block-genplan-popup__body">
                    <div class="block-genplan-popup__title">${houseData.NAME}</div>
                    <div class="block-genplan-popup__top">
                        <ul>
                            <li><div class="block-genplan-popup__name">Статус:</div><div class="block-genplan-popup__value">Скоро в продаже</div></li>
                        </ul>
                    </div>
                    <div class="block-genplan-popup__text">
                        <p>Квартиры в этом доме появятся в продаже в ближайшее время. Следите за обновлениями!</p>
                    </div>
                </div>
            </div>
        `;

        if (popupsContainer) {
            popupsContainer.appendChild(messagePopup);
            document.documentElement.classList.add('popup-open');
        }
        return;
    }

    const existingFloorsPopup = document.querySelector('.floors-block-genplan.mob._active');
    if (existingFloorsPopup) {
        existingFloorsPopup.remove();
    }

    const mobFloors = document.createElement('div');
    mobFloors.className = 'floors-block-genplan mob _active';
    mobFloors.dataset.id = visualHouseId;
    mobFloors.dataset.originalId = houseId;

    mobFloors.innerHTML = `
        <button type="button" class="block-genplan-popup__close">
            <svg aria-hidden="true" width="13" height="13">
                <use xlink:href="/img/sprite.svg#close"></use>
            </svg>
        </button>
        <button data-floor="4" class="floors-block-genplan__button">
            <span>4 этаж</span>
        </button>
        <button data-floor="3" class="floors-block-genplan__button">
            <span>3 этаж</span>
        </button>
        <button data-floor="2" class="floors-block-genplan__button">
            <span>2 этаж</span>
        </button>
        <button data-floor="1" class="floors-block-genplan__button">
            <span>1 этаж</span>
        </button>
    `;

    const popupsContainer = document.querySelector('.block-genplan__popups');
    if (popupsContainer) {
        popupsContainer.appendChild(mobFloors);
    }

    document.documentElement.classList.add('popup-open');

    if (!loadedHouses.has(houseId.toString())) {
        fetchHouse(houseId).then(houseData => {
            loadedHouses.set(houseId.toString(), houseData);
        }).catch(err => {
            console.error('Ошибка загрузки дома:', err);
        });
    }
}

function renderMobileFloorsBlock(houseId, selectedFloor = '4') {
    const existingBlock = document.querySelector('.block-genplan__choose-floors-mob');
    if (existingBlock) {
        existingBlock.remove();
    }

    const houseData = loadedHouses.get(houseId.toString());
    if (!houseData) return;

    const floorsBlock = document.createElement('div');
    floorsBlock.className = 'block-genplan__choose-floors-mob _active';
    floorsBlock.dataset.id = `h${houseId}`;

    let availableFloors = [4, 3, 2, 1];
    if (houseData.FLOORS) {
        availableFloors = houseData.FLOORS.map(f => parseInt(f.FLOOR))
            .filter(f => !isNaN(f))
            .sort((a, b) => b - a);
    }

    const floorsContent = availableFloors.map(floor => {
        const floorData = houseData.FLOORS.find(f => parseInt(f.FLOOR) === floor);
        const isActive = floor == selectedFloor;

        if (!floorData || !floorData.APARTMENTS || floorData.APARTMENTS.length === 0) {
            return `
                <div data-floor="${floor}" class="choose-floor-mob ${isActive ? '_active' : ''}">
                    <div class="choose-floor-mob__top">
                        <button type="button" class="block-genplan__title title-choose-floor">
                            <div class="block-genplan__icon">
                                <svg aria-hidden="true" width="12" height="8">
                                    <use xlink:href="/img/sprite.svg#arrow1"></use>
                                </svg>
                            </div>
                            <span>Выбор этажа</span>
                        </button>
                        <button type="button" class="block-genplan-popup__close title-choose-close">
                            <svg aria-hidden="true" width="13" height="13">
                                <use xlink:href="/img/sprite.svg#close"></use>
                            </svg>
                        </button>
                    </div>
                    <div class="choose-floor-mob__content">
                        <div class="choose-floor-mob__no-apartments">
                            На этом этаже нет доступных квартир
                        </div>
                    </div>
                </div>
            `;
        }

        const apartmentsByEntrance = {};

        floorData.APARTMENTS.forEach(apartment => {
            let entranceNumber = '1';

            if (apartment.ENTRANCE !== undefined && apartment.ENTRANCE !== null) {
                if (typeof apartment.ENTRANCE === 'string') {
                    entranceNumber = apartment.ENTRANCE.trim();
                } else if (typeof apartment.ENTRANCE === 'number') {
                    entranceNumber = apartment.ENTRANCE.toString();
                }
            }

            if (!entranceNumber || entranceNumber === '') {
                entranceNumber = '1';
            }

            if (!apartmentsByEntrance[entranceNumber]) {
                apartmentsByEntrance[entranceNumber] = [];
            }

            apartmentsByEntrance[entranceNumber].push(apartment);
        });

        const entranceNumbers = Object.keys(apartmentsByEntrance);
        entranceNumbers.sort((a, b) => {
            const numA = parseInt(a) || 0;
            const numB = parseInt(b) || 0;
            return numA - numB;
        });

        const entranceSections = entranceNumbers.map(entranceNumber => {
            const entranceApartments = apartmentsByEntrance[entranceNumber] || [];

            if (entranceApartments.length === 0) {
                return '';
            }

            const sortedApartments = entranceApartments.sort((a, b) => {
                const numA = parseInt(a.NUMBER_APARTMENT) || 0;
                const numB = parseInt(b.NUMBER_APARTMENT) || 0;
                return numA - numB;
            });

            const apartmentsHtml = sortedApartments.map(ap => `
                <a href="${ap.DETAIL_PAGE_URL}" class="card-apartments">
                    <div class="card-apartments__image">
                        <img loading="lazy" src="${ap.IMAGE}" alt="${ap.NAME}">
                    </div>
                    <div class="card-apartments__right">
                        <div class="card-apartments__top">
                            <div class="card-apartments__titles">
                                <div class="card-apartments__title">${ap.NAME}, ${ap.AREA} м²</div>
                                <div class="card-apartments__price">${parseInt(ap.PRICE).toLocaleString('ru-RU')} ₽</div>
                            </div>
                        </div>
                        <div class="card-apartments__bottom">
                            <ul>
                                ${ap.PROPERTIES_DISPLAY_VALUES.map(p => `<li>${p}</li>`).join('')}
                            </ul>
                        </div>
                    </div>
                </a>
            `).join('');

            return `
                <div class="choose-floor-mob__body">
                    <div class="choose-floor-mob__entrance">
                        <svg aria-hidden="true" width="18" height="18">
                            <use xlink:href="/img/sprite.svg#entrances"></use>
                        </svg>
                        <span>Подъезд №${entranceNumber}</span>
                    </div>
                    <div class="choose-floor-mob__columns">
                        ${apartmentsHtml}
                    </div>
                </div>
            `;
        }).join('');

        return `
            <div data-floor="${floor}" class="choose-floor-mob ${isActive ? '_active' : ''}">
                <div class="choose-floor-mob__top">
                    <button type="button" class="block-genplan__title title-choose-floor">
                        <div class="block-genplan__icon">
                            <svg aria-hidden="true" width="12" height="8">
                                <use xlink:href="/img/sprite.svg#arrow1"></use>
                            </svg>
                        </div>
                        <span>Выбор этажа</span>
                    </button>
                    <button type="button" class="block-genplan-popup__close title-choose-close">
                        <svg aria-hidden="true" width="13" height="13">
                            <use xlink:href="/img/sprite.svg#close"></use>
                        </svg>
                    </button>
                </div>
                <div class="choose-floor-mob__content">
                    ${entranceSections}
                </div>
            </div>
        `;
    }).join('');

    floorsBlock.innerHTML = floorsContent;

    const chooseFloorsContainer = document.querySelector('.block-genplan__choose-floors');
    if (chooseFloorsContainer) {
        chooseFloorsContainer.appendChild(floorsBlock);
    } else {
        const newContainer = document.createElement('div');
        newContainer.className = 'block-genplan__choose-floors';
        newContainer.appendChild(floorsBlock);
        document.querySelector('.block-genplan__content').appendChild(newContainer);
    }

    document.documentElement.classList.add('popup-open');

    initMobileFloorSwitching();
}

function initMobileFloorSwitching() {
    const floorBlocks = document.querySelectorAll('.choose-floor-mob');

    floorBlocks.forEach(block => {
        const topButton = block.querySelector('.title-choose-floor');
        if (topButton) {
            topButton.addEventListener('click', () => {
                const isActive = block.classList.contains('_active');

                floorBlocks.forEach(b => {
                    b.classList.remove('_active');
                });

                if (!isActive) {
                    block.classList.add('_active');
                }
            });
        }
    });
}

function initMobileFloorHandlers() {
    document.addEventListener('click', (e) => {
        if (window.innerWidth > 768) return;

        const floorBtn = e.target.closest('.floors-block-genplan.mob .floors-block-genplan__button');
        if (floorBtn) {
            e.preventDefault();
            e.stopPropagation();
            const floor = floorBtn.dataset.floor;
            const floorsPopup = floorBtn.closest('.floors-block-genplan.mob');
            const visualHouseId = floorsPopup.dataset.id;
            const originalHouseId = floorsPopup.dataset.originalId || visualHouseId.replace('h', '');

            floorsPopup.classList.remove('_active');
            document.documentElement.classList.remove('popup-open');

            if (loadedHouses.has(originalHouseId)) {
                renderMobileFloorsBlock(originalHouseId, floor);
            } else {
                const loadingBlock = document.createElement('div');
                loadingBlock.className = 'block-genplan__choose-floors-mob _active loading';
                loadingBlock.innerHTML = `
            <div class="choose-floor-mob _active">
                <div class="choose-floor-mob__top">
                    <button type="button" class="block-genplan__title title-choose-floor">
                        <div class="block-genplan__icon">
                            <svg aria-hidden="true" width="12" height="8">
                                <use xlink:href="/img/sprite.svg#arrow1"></use>
                            </svg>
                        </div>
                        <span>Загрузка...</span>
                    </button>
                </div>
                <div class="choose-floor-mob__content">
                    <div class="loading-message">Загружаем данные...</div>
                </div>
            </div>
        `;

                const chooseFloorsContainer = document.querySelector('.block-genplan__choose-floors');
                if (chooseFloorsContainer) {
                    chooseFloorsContainer.appendChild(loadingBlock);
                }

                fetchHouse(originalHouseId).then(houseData => {
                    loadedHouses.set(originalHouseId.toString(), houseData);
                    loadingBlock.remove();
                    renderMobileFloorsBlock(originalHouseId, floor);
                }).catch(err => {
                    console.error('Ошибка загрузки дома:', err);
                    loadingBlock.innerHTML = `
                <div class="choose-floor-mob _active">
                    <div class="choose-floor-mob__top">
                        <button type="button" class="block-genplan__title title-choose-floor">
                            <div class="block-genplan__icon">
                                <svg aria-hidden="true" width="12" height="8">
                                    <use xlink:href="/img/sprite.svg#arrow1"></use>
                                </svg>
                            </div>
                            <span>Ошибка</span>
                        </button>
                    </div>
                    <div class="choose-floor-mob__content">
                        <div class="error-message">Не удалось загрузить данные</div>
                        <button class="retry-btn btn">Повторить</button>
                    </div>
                </div>
            `;

                    loadingBlock.querySelector('.retry-btn')?.addEventListener('click', () => {
                        fetchHouse(originalHouseId).then(houseData => {
                            loadedHouses.set(originalHouseId.toString(), houseData);
                            loadingBlock.remove();
                            renderMobileFloorsBlock(originalHouseId, floor);
                        });
                    });
                });
            }
            return;
        }

        const titleChooseFloor = e.target.closest('.title-choose-floor');
        if (titleChooseFloor) {
            e.preventDefault();
            e.stopPropagation();
            const floorBlock = titleChooseFloor.closest('.choose-floor-mob');
            const floorsBlock = floorBlock.closest('.block-genplan__choose-floors-mob');
            const visualHouseId = floorsBlock.dataset.id;
            const originalHouseId = visualHouseId.replace('h', '');

            floorsBlock.remove();
            createMobileFloorsPopup(originalHouseId, visualHouseId);
            return;
        }

        const titleChooseClose = e.target.closest('.title-choose-close');
        if (titleChooseClose) {
            e.preventDefault();
            e.stopPropagation();
            const floorsBlock = titleChooseClose.closest('.block-genplan__choose-floors-mob');
            if (floorsBlock) {
                floorsBlock.remove();
                document.documentElement.classList.remove('popup-open');
            }
            return;
        }

        const closeBtn = e.target.closest('.floors-block-genplan.mob .block-genplan-popup__close');
        if (closeBtn) {
            e.preventDefault();
            e.stopPropagation();
            const floorsPopup = closeBtn.closest('.floors-block-genplan.mob');
            if (floorsPopup) {
                floorsPopup.classList.remove('_active');
                document.documentElement.classList.remove('popup-open');
            }
            return;
        }
    });

    document.addEventListener('click', (e) => {
        if (window.innerWidth > 768) return;

        const activeFloorsPopup = document.querySelector('.floors-block-genplan.mob._active');
        if (activeFloorsPopup && !activeFloorsPopup.contains(e.target) && !e.target.closest('.choose-floor')) {
            activeFloorsPopup.classList.remove('_active');
            document.documentElement.classList.remove('popup-open');
        }

        const activeMobileFloorsBlock = document.querySelector('.block-genplan__choose-floors-mob._active');
        if (activeMobileFloorsBlock && !activeMobileFloorsBlock.contains(e.target) && !e.target.closest('.floors-block-genplan.mob .floors-block-genplan__button')) {
            activeMobileFloorsBlock.remove();
            document.documentElement.classList.remove('popup-open');
        }
    });
}

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

async function loadAndRenderStep3(houseId, selectedFloor = null) {
    let houseData = loadedHouses.get(houseId);
    if (!houseData) {
        try {
            houseData = await fetchHouse(houseId);
            loadedHouses.set(houseId, houseData);
        } catch (err) {
            console.error('Ошибка загрузки дома:', err);
            return;
        }
    }

    document.querySelectorAll('.block-genplan__content-container.step3').forEach(el => el.remove());

    const step3 = document.createElement('div');
    step3.className = 'block-genplan__content-container step3';
    step3.dataset.id = `h${houseId}`;

    const sortedFloors = [...houseData.FLOORS].sort((a, b) => parseInt(b.FLOOR) - parseInt(a.FLOOR));

    const sizeConfig = houseSizeConfig[houseId] || houseSizeConfig.default;
    const { svgWidth, svgHeight, imgWidth, imgHeight } = sizeConfig;

    let defaultFloor = '4';
    if (selectedFloor) {
        defaultFloor = selectedFloor;
    } else if (sortedFloors.length > 0) {
        const floorsWithApartments = sortedFloors.filter(floor =>
            floor.APARTMENTS && floor.APARTMENTS.length > 0
        );
        if (floorsWithApartments.length > 0) {
            defaultFloor = Math.max(...floorsWithApartments.map(f => parseInt(f.FLOOR))).toString();
        } else {
            defaultFloor = sortedFloors[0].FLOOR;
        }
    }

    sortedFloors.forEach(floor => {
        const isActive = floor.FLOOR === defaultFloor;
        const floorDiv = document.createElement('div');
        floorDiv.className = `block-genplan__images${isActive ? ' _active' : ''}`;
        floorDiv.dataset.floor = floor.FLOOR;

        floorDiv.style.width = `${imgWidth}px`;
        floorDiv.style.height = `${imgHeight}px`;

        if (floor.FLOOR_PLAN) {
            const img = document.createElement('img');
            img.loading = 'lazy';
            img.src = floor.FLOOR_PLAN;
            img.style.width = `${imgWidth}px`;
            img.style.height = `${imgHeight}px`;
            const imgWrap = document.createElement('div');
            imgWrap.className = 'block-genplan__image';
            imgWrap.appendChild(img);
            floorDiv.appendChild(imgWrap);
        }

        const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
        svg.setAttribute('width', svgWidth.toString());
        svg.setAttribute('height', svgHeight.toString());
        svg.setAttribute('viewBox', `0 0 ${svgWidth} ${svgHeight}`);
        svg.setAttribute('class', 'block-genplan__svg');
        svg.setAttribute('fill', 'none');
        svg.setAttribute('xmlns', 'http://www.w3.org/2000/svg');

        if (houseData.ENTRANCES && houseData.ENTRANCES.length) {
            houseData.ENTRANCES.forEach(entrance => {
                const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
                path.setAttribute('data-id', `p${entrance.NUMBER}`);
                path.setAttribute('data-type', 'entrance');
                path.setAttribute('class', 'block-genplan__path p');
                if (entrance.SVG_PATH) {
                    path.setAttribute('d', entrance.SVG_PATH);
                }
                svg.appendChild(path);
            });
        }

        if (floor.APARTMENTS && floor.APARTMENTS.length) {
            floor.APARTMENTS.forEach(ap => {
                const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
                path.setAttribute('data-id', `kv${ap.NUMBER_APARTMENT}`);
                path.setAttribute('class', 'block-genplan__path kv');
                if (ap.SVG_PATH) {
                    path.setAttribute('d', ap.SVG_PATH);
                }
                svg.appendChild(path);
            });
        }

        floorDiv.appendChild(svg);

        if ((houseData.ENTRANCES && houseData.ENTRANCES.length) ||
            (floor.APARTMENTS && floor.APARTMENTS.length)) {

            const tips = document.createElement('div');
            tips.className = 'block-genplan__tips';

            const popups = document.createElement('div');
            popups.className = 'block-genplan__popups';

            if (houseData.ENTRANCES && houseData.ENTRANCES.length) {
                houseData.ENTRANCES.forEach(entrance => {
                    const tippy = document.createElement('div');
                    tippy.className = 'block-genplan__path entrances-path p';

                    if (entrance.ADDITIONAL_CLASSES) {
                        entrance.ADDITIONAL_CLASSES.split(' ').forEach(className => {
                            if (className) tippy.classList.add(className);
                        });
                    }

                    tippy.dataset.id = `p${entrance.NUMBER}`;

                    if (entrance.POS_TOP !== undefined) tippy.style.top = `${entrance.POS_TOP}%`;
                    if (entrance.POS_BOTTOM !== undefined) tippy.style.bottom = `${entrance.POS_BOTTOM}%`;
                    if (entrance.POS_LEFT !== undefined) tippy.style.left = `${entrance.POS_LEFT}%`;
                    if (entrance.POS_RIGHT !== undefined) tippy.style.right = `${entrance.POS_RIGHT}%`;

                    tippy.innerHTML = `
                        <span>
                            ${entrance.NUMBER}
                            <svg aria-hidden="true" width="18" height="18">
                                <use xlink:href="/img/sprite.svg#entrances"></use>
                            </svg>
                        </span>
                    `;
                    tips.appendChild(tippy);
                });
            }

            if (floor.APARTMENTS && floor.APARTMENTS.length) {
                floor.APARTMENTS.forEach(ap => {
                    const tippy = document.createElement('button');
                    tippy.className = 'block-genplan__tippy tippy-floor';
                    tippy.dataset.id = `kv${ap.NUMBER_APARTMENT}`;
                    tippy.style.top = `${ap.POS_TOP}%`;
                    tippy.style.left = `${ap.POS_RIGHT}%`;
                    tippy.innerHTML = `<span>№${ap.NUMBER_APARTMENT}</span>`;
                    tips.appendChild(tippy);

                    const popup = document.createElement('div');
                    popup.className = 'block-genplan-popup';
                    popup.dataset.idPopup = `kv${ap.NUMBER_APARTMENT}`;

                    let popupTop, popupLeft;
                    if (ap.POPUP_POSITION) {
                        popupTop = ap.POPUP_POSITION.TOP;
                        popupLeft = ap.POPUP_POSITION.LEFT;
                    } else {
                        const tippyTop = parseFloat(ap.POS_TOP);
                        const tippyLeft = parseFloat(ap.POS_RIGHT);
                        popupTop = tippyTop + 6;
                        popupLeft = tippyLeft - 18;
                    }

                    popup.style.top = `${popupTop}%`;
                    popup.style.left = `${popupLeft}%`;

                    popup.innerHTML = `
                        <div class="card-apartments">
                            <div class="card-apartments__top">
                                <div class="card-apartments__titles">
                                    <div class="card-apartments__title">${ap.NAME}, ${ap.AREA} м²</div>
                                    <div class="card-apartments__price">${parseInt(ap.PRICE).toLocaleString('ru-RU')} ₽</div>
                                </div>
                            </div>
                            <div class="card-apartments__image">
                                <img loading="lazy" src="${ap.IMAGE}" alt="${ap.NAME}">
                            </div>
                            <div class="card-apartments__bottom">
                                <ul>
                                    ${ap.PROPERTIES_DISPLAY_VALUES.map(p => `<li>${p}</li>`).join('')}
                                </ul>
                                <a href="${ap.DETAIL_PAGE_URL}" class="btn btn-bg">
                                    <span>Подробнее</span>
                                    <svg aria-hidden="true" width="12" height="8"><use xlink:href="/img/sprite.svg#arrow1"></use></svg>
                                </a>
                            </div>
                        </div>
                    `;
                    popups.appendChild(popup);
                });
            }

            floorDiv.appendChild(tips);
            floorDiv.appendChild(popups);
        }

        step3.appendChild(floorDiv);
    });

    const floorsBlock = document.createElement('div');
    floorsBlock.className = 'floors-block-genplan';
    floorsBlock.innerHTML = `
        <button type="button" class="block-genplan-popup__close">
            <svg aria-hidden="true" width="13" height="13"><use xlink:href="/img/sprite.svg#close"></use></svg>
        </button>
        ${sortedFloors.map(f => `
            <button data-floor="${f.FLOOR}" class="floors-block-genplan__button${f.FLOOR === defaultFloor ? ' _active' : ''}">
                <span>${f.FLOOR} этаж</span>
            </button>
        `).join('')}
    `;
    step3.appendChild(floorsBlock);

    const infoPopup = document.createElement('div');
    infoPopup.className = 'block-genplan-popup popup-floor';
    infoPopup.innerHTML = `
        <button type="button" class="block-genplan-popup__close">
            <svg aria-hidden="true" width="13" height="13"><use xlink:href="/img/sprite.svg#close"></use></svg>
        </button>
        <div class="block-genplan-popup__content">
            <div class="block-genplan-popup__body">
                <div class="block-genplan-popup__top">
                    <ul>
                        <li><div class="block-genplan-popup__name">Срок сдачи:</div><div class="block-genplan-popup__value">${houseData.DEADLINE}</div></li>
                    </ul>
                </div>
                <div class="block-genplan-popup__rooms">
                    <ul>
                        ${houseData.ROOMS_INFO.map(r => `
                            <li>
                                <div class="block-genplan-popup__room">${r.NAME}</div>
                                ${r.PRICE ? `<div class="block-genplan-popup__price">от ${r.PRICE.toLocaleString('ru-RU')} руб.</div>` : ''}
                            </li>
                        `).join('')}
                    </ul>
                </div>
                <div class="block-genplan-popup__buttons">
                    <a href="#" class="block-genplan-popup__button btn"><span>Показать кладовые</span></a>
                </div>
            </div>
        </div>
    `;
    step3.appendChild(infoPopup);

    document.querySelector('.block-genplan__body').appendChild(step3);

    const titleRooms = document.querySelector('.title-romms span');
    if (titleRooms) {
        let houseDisplayName = `Дом №${houseId}`;
        if (regionsData && regionsData[0] && regionsData[0].HOUSES) {
            const house = regionsData[0].HOUSES.find(h => h.ID == houseId);
            if (house && house.NAME) {
                houseDisplayName = house.NAME;
            }
        }
        titleRooms.textContent = houseDisplayName;
    }

    initFloorSwitching();

    const switchToggle = document.querySelector('.switch-genplan.entrance-switch input[type="checkbox"]');
    if (switchToggle) {
        switchToggle.removeEventListener('change', updateEntrancesState);
        switchToggle.addEventListener('change', updateEntrancesState);
        updateEntrancesState();
    }

    const visualHouseId = `h${houseId}`;
    toggleSteps(false, true, visualHouseId);

    forceInitEntrancesToggle();
    reinitToggleForNewHouse();
}

function toggleSteps(showStep2 = false, showStep3 = false, targetHouseId = null) {
    const contentContainerStep1 = document.querySelector('.block-genplan__content-container.step1');
    const contentContainerStep2 = document.querySelector('.block-genplan__content-container.step2');
    const titleGenplan = document.querySelector('.title-genplan');
    const titleHouse = document.querySelector('.title-house');
    const titleRooms = document.querySelector('.title-romms');
    const switchGenplan = document.querySelector('.switch-genplan');
    const zoomGenplan = document.querySelector('.zoom-genplan');
    const fullscreenBtn = document.querySelector('.fullsreen-genplan__button');

    contentContainerStep1?.classList.remove('_active');
    contentContainerStep2?.classList.remove('_active');
    document.querySelectorAll('.block-genplan__content-container.step3').forEach(el => el.classList.remove('_active'));

    titleGenplan?.classList.remove('_active');
    titleHouse?.classList.remove('_active');
    titleRooms?.classList.remove('_active');

    if (showStep3) {
        document.documentElement.classList.add('choice-floor');
    } else {
        document.documentElement.classList.remove('choice-floor');
    }

    if (switchGenplan) {
        if (showStep3) {
            switchGenplan.classList.add('_active');
        } else {
            switchGenplan.classList.remove('_active');
        }
    }

    if (showStep2 || showStep3) {
        titleGenplan?.classList.add('hidden');
    } else {
        titleGenplan?.classList.remove('hidden');
    }

    if (zoomGenplan) {
        if (showStep3) {
            zoomGenplan.classList.add('hidden');
        } else {
            zoomGenplan.classList.remove('hidden');
        }
    }

    if (fullscreenBtn) {
        if (showStep3) {
            fullscreenBtn.classList.add('step3_genplan-button');
        } else {
            fullscreenBtn.classList.remove('step3_genplan-button');
        }
    }

    if (showStep3) {
        const isMobile = window.innerWidth < 1200;
        if (isMobile) {
            contentContainerStep2?.classList.add('_active');
            titleHouse?.classList.add('_active');
            document.documentElement.classList.add('choice-home');
            if (titleRooms) titleRooms.classList.remove('_active');
        } else {
            let step3ToActivate = null;

            if (targetHouseId && targetHouseId.startsWith('h')) {
                step3ToActivate = document.querySelector(`.block-genplan__content-container.step3[data-id="${targetHouseId}"]`);
            } else if (targetHouseId) {
                const allStep3 = document.querySelectorAll('.block-genplan__content-container.step3');
                for (let step3 of allStep3) {
                    const step3HouseId = step3.dataset.id.replace('h', '');
                    if (step3HouseId == targetHouseId) {
                        step3ToActivate = step3;
                        break;
                    }
                }
            }

            if (step3ToActivate) {
                step3ToActivate.classList.add('_active');
                titleRooms?.classList.add('_active');
                document.documentElement.classList.remove('choice-home');
            }
        }
        titleHouse?.classList.add('hidden');

    } else if (showStep2) {
        contentContainerStep2?.classList.add('_active');
        titleHouse?.classList.add('_active');
        document.documentElement.classList.add('choice-home');
        titleHouse?.classList.remove('hidden');
        titleRooms?.classList.remove('hidden');

    } else {
        contentContainerStep1?.classList.add('_active');
        titleGenplan?.classList.add('_active');
        document.documentElement.classList.remove('choice-home');
        titleGenplan?.classList.remove('hidden');
        titleHouse?.classList.remove('hidden');
        titleRooms?.classList.remove('hidden');
    }

    updateCurrentContainer();
    updateTransform();
    if (window.resetTransformations) resetTransformations();
    if (window.updateEntrancesState) updateEntrancesState();
    updateEntrancesStateForAllHouses();

    if (document.fullscreenElement) {
        updateSvgsSize();
    }

    initEntranceToggleSwitchHandler();
}

function initExistingHandlers() {
    const titleHouse = document.querySelector('.title-house');
    const titleRooms = document.querySelector('.title-romms');

    titleHouse?.addEventListener('click', () => {
        toggleSteps(false, false);
        const titleGenplan = document.querySelector('.title-genplan');
        if (titleGenplan) {
            titleGenplan.classList.remove('hidden');
        }
        updateEntrancesStateForAllHouses;
    });

    titleRooms?.addEventListener('click', () => {
        const activeStep3 = document.querySelector('.block-genplan__content-container.step3._active');
        if (activeStep3) {
            toggleSteps(true, false);
        }
        updateEntrancesStateForAllHouses;
    });

    document.addEventListener('click', (e) => {
        if (e.target.closest('.btn-genplan')) {
            e.preventDefault();
            e.stopPropagation();
            toggleSteps(true, false);

            const titleGenplan = document.querySelector('.title-genplan');
            if (titleGenplan) {
                titleGenplan.classList.add('hidden');
            }

            const activePopup = document.querySelector('.block-genplan-popup._active');
            if (activePopup) {
                activePopup.classList.remove('_active');
                document.documentElement.classList.remove('popup-open');
            }
            return;
        }
    });

    initEntranceToggleSwitchHandler();

    initMainGenplanLogic();
}

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

function updateEntrancesState() {
    const switchToggle = document.querySelector('.switch-genplan.entrance-switch input[type="checkbox"]');
    if (!switchToggle) return;

    const isChecked = switchToggle.checked;

    const toggleSwitch = document.querySelector('.switch-genplan.entrance-switch .toggle-switch');
    const background = document.querySelector('.switch-genplan.entrance-switch .toggle-switch-background');
    const handle = document.querySelector('.switch-genplan.entrance-switch .toggle-switch-handle');

    if (toggleSwitch) toggleSwitch.classList.toggle('_active', isChecked);
    if (background) background.classList.toggle('_active', isChecked);
    if (handle) handle.classList.toggle('_active', isChecked);

    const allEntrancePaths = document.querySelectorAll('.block-genplan__path[data-type="entrance"]');
    const allEntranceTips = document.querySelectorAll('.entrances-path');

    allEntrancePaths.forEach(path => {
        path.classList.toggle('_active', isChecked);
    });

    allEntranceTips.forEach(tip => {
        tip.classList.toggle('_active', isChecked);
    });
}

function updateEntrancesStateForAllHouses() {
    const switchToggle = document.querySelector('.switch-genplan.entrance-switch input[type="checkbox"]');
    if (!switchToggle) return;

    const isChecked = switchToggle.checked;

    const allStep3Containers = document.querySelectorAll('.block-genplan__content-container.step3');

    allStep3Containers.forEach(container => {
        const entrancePaths = container.querySelectorAll('.block-genplan__path[data-type="entrance"]');
        const entranceTips = container.querySelectorAll('.entrances-path');

        entrancePaths.forEach(path => {
            path.classList.toggle('_active', isChecked);
        });

        entranceTips.forEach(tip => {
            tip.classList.toggle('_active', isChecked);
        });
    });

    updateEntrancesState();
}

function handleEntranceToggleSwitchClick(e) {
    const toggleSwitch = e.target.closest('.entrance-switch .toggle-switch');
    const switchGenplan = e.target.closest('.switch-genplan.entrance-switch');
    const toggleSwitchBackground = e.target.closest('.entrance-switch .toggle-switch-background');
    const toggleSwitchHandle = e.target.closest('.entrance-switch .toggle-switch-handle');

    if (toggleSwitch || switchGenplan || toggleSwitchBackground || toggleSwitchHandle) {
        e.preventDefault();
        e.stopPropagation();

        const checkbox = document.querySelector('.switch-genplan.entrance-switch input[type="checkbox"]');
        if (checkbox) {
            checkbox.checked = !checkbox.checked;

            const isChecked = checkbox.checked;

            if (toggleSwitch) {
                toggleSwitch.classList.toggle('_active', isChecked);
            }

            const background = document.querySelector('.switch-genplan.entrance-switch .toggle-switch-background');
            const handle = document.querySelector('.switch-genplan.entrance-switch .toggle-switch-handle');

            if (background) background.classList.toggle('_active', isChecked);
            if (handle) handle.classList.toggle('_active', isChecked);

            updateEntrancesStateForAllHouses();
        }
    }
}

function initEntranceToggleSwitchHandler() {
    document.removeEventListener('click', handleEntranceToggleSwitchClick);
    document.addEventListener('click', handleEntranceToggleSwitchClick);
    updateEntrancesStateForAllHouses;
}

function initObjectsToggleSwitch() {
    const toggleSwitchObjects = document.querySelector('.genplan-button-objects input[type="checkbox"]');
    const blockGenplanObjects = document.querySelector('.block-genplan-objects');
    const toggleSwitchElement = document.querySelector('.genplan-button-objects .toggle-switch');

    if (!toggleSwitchObjects || !blockGenplanObjects) return;

    const isChecked = toggleSwitchObjects.checked;
    blockGenplanObjects.classList.toggle('active', isChecked);
    if (toggleSwitchElement) {
        toggleSwitchElement.classList.toggle('_active', isChecked);
    }

    toggleSwitchObjects.addEventListener('change', function (e) {
        const isChecked = e.target.checked;
        blockGenplanObjects.classList.toggle('active', isChecked);
        if (toggleSwitchElement) {
            toggleSwitchElement.classList.toggle('_active', isChecked);
        }
    });

    const switchContainer = document.querySelector('.genplan-button-objects .switch-genplan');
    if (switchContainer) {
        switchContainer.addEventListener('click', function (e) {
            if (!e.target.matches('input[type="checkbox"]')) {
                e.preventDefault();
                toggleSwitchObjects.checked = !toggleSwitchObjects.checked;

                const isChecked = toggleSwitchObjects.checked;
                blockGenplanObjects.classList.toggle('active', isChecked);
                if (toggleSwitchElement) {
                    toggleSwitchElement.classList.toggle('_active', isChecked);
                }

                toggleSwitchObjects.dispatchEvent(new Event('change'));
            }
        });
    }
}

function forceInitEntrancesToggle() {
    initEntranceToggleSwitchHandler();
    updateEntrancesStateForAllHouses();
}

function reinitToggleForNewHouse() {
    forceInitEntrancesToggle();
    updateEntrancesStateForAllHouses();
}

function refreshEntrancesState() {
    updateEntrancesStateForAllHouses();
}

function initEntranceDelegation() {
    document.addEventListener('change', function (e) {
        if (e.target.matches('.switch-genplan.entrance-switch input[type="checkbox"]')) {
            updateEntrancesStateForAllHouses();
        }
    });

    document.addEventListener('click', function (e) {
        const switchGenplan = e.target.closest('.switch-genplan.entrance-switch');
        if (switchGenplan) {
            updateEntrancesStateForAllHouses();
        }
    });
}

function updateCurrentContainer() {
    const activeContainer = document.querySelector('.block-genplan__content-container._active');
    if (activeContainer && activeContainer !== currentContainer) {
        currentContainer = activeContainer;
        resetTransformations();
    }
}

function updateSvgsSize() {
    if (!document.fullscreenElement) return;

    const fullscreenContainer = document.querySelector('[data-fullscreen-container]');
    if (!fullscreenContainer) return;

    const containerRect = fullscreenContainer.getBoundingClientRect();
    const screenWidth = Math.round(containerRect.width);
    const screenHeight = Math.round(containerRect.height);

    let activeContainer = document.querySelector('.block-genplan__content-container._active');
    if (!activeContainer) {
        activeContainer = document.querySelector('.block-genplan__content-container.step1');
    }
    if (!activeContainer) return;

    if (activeContainer.classList.contains('step1') || activeContainer.classList.contains('step2')) {
        const activeSvgs = activeContainer.querySelectorAll('.block-genplan__svg');
        activeSvgs.forEach(svg => {
            if (!svg.dataset.originalViewBox) {
                svg.dataset.originalViewBox = svg.getAttribute('viewBox') || '0 0 1200 631';
                svg.dataset.originalWidth = svg.getAttribute('width') || '1200';
                svg.dataset.originalHeight = svg.getAttribute('height') || '631';
            }

            svg.setAttribute('width', screenWidth);
            svg.setAttribute('height', screenHeight);
            svg.setAttribute('viewBox', svg.dataset.originalViewBox);
            svg.setAttribute('preserveAspectRatio', 'none');
        });

        const activeImages = activeContainer.querySelectorAll('.block-genplan__image img');
        activeImages.forEach(img => {
            img.style.width = `${screenWidth}px`;
            img.style.height = `${screenHeight}px`;
            img.style.maxWidth = 'none';
            img.style.maxHeight = 'none';
            img.style.objectFit = 'fill';
        });

        const activeImageContainers = activeContainer.querySelectorAll('.block-genplan__image');
        activeImageContainers.forEach(container => {
            container.style.width = `${screenWidth}px`;
            container.style.height = `${screenHeight}px`;
            container.style.position = 'relative';
            container.style.overflow = 'hidden';
        });

        activeContainer.style.width = `${screenWidth}px`;
        activeContainer.style.height = `${screenHeight}px`;

        const svgContainer = activeContainer.querySelector('.block-genplan__svg-container');
        if (svgContainer) {
            svgContainer.style.width = `${screenWidth}px`;
            svgContainer.style.height = `${screenHeight}px`;
        }

        resetTransformations();
    }
}

function resetFullscreenStyles() {
    const fullscreenContainer = document.querySelector('[data-fullscreen-container]');
    if (fullscreenContainer) {
        fullscreenContainer.classList.remove('fullscreen-active');
    }

    const step1Step2Containers = document.querySelectorAll('.block-genplan__content-container.step1, .block-genplan__content-container.step2');
    const step3Containers = document.querySelectorAll('.block-genplan__content-container.step3');

    step1Step2Containers.forEach(container => {
        container.style.width = '';
        container.style.height = '';

        const svgs = container.querySelectorAll('.block-genplan__svg');
        svgs.forEach(svg => {
            if (svg.dataset.originalWidth) {
                svg.setAttribute('width', svg.dataset.originalWidth);
            }
            if (svg.dataset.originalHeight) {
                svg.setAttribute('height', svg.dataset.originalHeight);
            }
            if (svg.dataset.originalViewBox) {
                svg.setAttribute('viewBox', svg.dataset.originalViewBox);
            }
            svg.removeAttribute('preserveAspectRatio');
        });

        const images = container.querySelectorAll('.block-genplan__image img');
        images.forEach(img => {
            img.style.cssText = '';
            const originalWidth = img.dataset.originalWidth || '1200';
            const originalHeight = img.dataset.originalHeight || '631';
            img.style.width = `${originalWidth}px`;
            img.style.height = `${originalHeight}px`;
        });

        const imageContainers = container.querySelectorAll('.block-genplan__image');
        imageContainers.forEach(container => {
            container.style.cssText = '';
        });

        const svgContainer = container.querySelector('.block-genplan__svg-container');
        if (svgContainer) {
            svgContainer.style.cssText = '';
        }
    });

    step3Containers.forEach(container => {
    });
}

function adjustTipsPositions() {
    if (!document.fullscreenElement) return;

    const activeContainer = document.querySelector('.block-genplan__content-container._active');
    if (!activeContainer) return;

    const tips = activeContainer.querySelectorAll('.block-genplan__tippy');
    tips.forEach(tip => {
        const originalTop = tip.style.top;
        const originalRight = tip.style.right;
        const originalLeft = tip.style.left;
    });
}

function initMainGenplanLogic() {
    const blockGenplan = document.querySelector('.block-genplan');
    if (!blockGenplan) return;

    const container = document.querySelector('.block-genplan__body');
    const contentContainerStep1 = document.querySelector('.block-genplan__content-container.step1');
    const contentContainerStep2 = document.querySelector('.block-genplan__content-container.step2');
    const switchToggle = document.querySelector('.toggle-switch input[type="checkbox"]');
    const fullscreenBtn = document.querySelector('.fullsreen-genplan__button');
    const fullscreenContainer = document.querySelector('[data-fullscreen-container]');
    const content = document.querySelector('.block-genplan__content');
    const svgs = document.querySelectorAll('.block-genplan__svg');

    saveOriginalImageSizes();

    if (!container || !contentContainerStep1 || !contentContainerStep2 || !svgs.length) {
        return;
    }

    currentContainer = document.querySelector('.block-genplan__content-container._active');
    if (!currentContainer) {
        currentContainer = contentContainerStep1;
        if (currentContainer && !currentContainer.classList.contains('_active')) {
            currentContainer.classList.add('_active');
        }
    }

    const zoomInBtn = document.querySelector('.zoom-genplan__up');
    const zoomOutBtn = document.querySelector('.zoom-genplan__down');

    if (zoomInBtn) {
        zoomInBtn.addEventListener('click', () => {
            if (isMobileDevice()) return;
            updateCurrentContainer();
            if (currentContainer.classList.contains('step3')) return;

            const rect = currentContainer.getBoundingClientRect();
            const centerX = rect.left + rect.width / 2;
            const centerY = rect.top + rect.height / 2;

            zoomToPoint(1 + zoomStep, centerX, centerY);
        });
    }

    if (zoomOutBtn) {
        zoomOutBtn.addEventListener('click', () => {
            if (isMobileDevice()) return;
            updateCurrentContainer();
            if (currentContainer.classList.contains('step3')) return;

            const rect = currentContainer.getBoundingClientRect();
            const centerX = rect.left + rect.width / 2;
            const centerY = rect.top + rect.height / 2;

            zoomToPoint(1 - zoomStep, centerX, centerY);
        });
    }

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
            }
        });

        document.addEventListener('fullscreenchange', () => {
            if (!document.fullscreenElement) {
                fullscreenContainer.classList.remove('fullscreen-active');
                resetFullscreenStyles();
                resetTransformations();
                updateEntrancesStateForAllHouses();
            } else {
                fullscreenContainer.classList.add('fullscreen-active');
                updateSvgsSize();
                adjustTipsPositions();
                resetTransformations();
            }
        });
    }

    function init() {
        if (isMobileDevice()) {
            container.addEventListener('touchstart', handleMobileDragStart, { passive: false });
            document.addEventListener('touchmove', handleMobileDrag, { passive: false });
            document.addEventListener('touchend', handleMobileDragEnd);
        } else {
            container.addEventListener('mousedown', (e) => {
                updateCurrentContainer();
                if (currentContainer.classList.contains('step3')) return;
                if (e.target.closest('.block-genplan-popup') || e.target.closest('.block-genplan__tippy')) return;

                if (scale > minScale || document.fullscreenElement) {
                    isDragging = true;
                    startX = e.clientX - translateX;
                    startY = e.clientY - translateY;
                    container.classList.add('dragging');
                    e.preventDefault();
                }
            });

            document.addEventListener('mousemove', (e) => {
                if (!isDragging) return;
                if (currentContainer.classList.contains('step3')) return;

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
                updateCurrentContainer();
                if (currentContainer.classList.contains('step3')) return;
                if (e.target.closest('.block-genplan-popup') || e.target.closest('.block-genplan__tippy')) return;

                if (e.touches.length === 2) {
                    touchMode = 'pinch';
                    const dx = e.touches[0].clientX - e.touches[1].clientX;
                    const dy = e.touches[0].clientY - e.touches[1].clientY;
                    touchStartDistance = Math.sqrt(dx * dx + dy * dy);
                    lastScale = scale;
                    e.preventDefault();
                } else if (e.touches.length === 1 && (scale > minScale || document.fullscreenElement)) {
                    touchMode = 'pan';
                    isDragging = true;
                    const touch = e.touches[0];
                    startX = touch.clientX - translateX;
                    startY = touch.clientY - translateY;
                    e.preventDefault();
                }
            }, { passive: false });

            container.addEventListener('touchmove', (e) => {
                if (e.touches.length === 2 && touchMode === 'pinch') {
                    if (currentContainer.classList.contains('step3')) return;

                    const dx = e.touches[0].clientX - e.touches[1].clientX;
                    const dy = e.touches[0].clientY - e.touches[1].clientY;
                    const distance = Math.sqrt(dx * dx + dy * dy);

                    if (touchStartDistance > 0) {
                        const pinchScale = distance / touchStartDistance;
                        const centerX = (e.touches[0].clientX + e.touches[1].clientX) / 2;
                        const centerY = (e.touches[0].clientY + e.touches[1].clientY) / 2;

                        zoomToPoint(pinchScale, centerX, centerY);
                        touchStartDistance = distance;
                    }
                    e.preventDefault();
                } else if (e.touches.length === 1 && touchMode === 'pan') {
                    if (currentContainer.classList.contains('step3')) return;

                    const touch = e.touches[0];
                    translateX = touch.clientX - startX;
                    translateY = touch.clientY - startY;
                    clampTranslation();
                    updateTransform();
                    e.preventDefault();
                }
            }, { passive: false });

            container.addEventListener('touchend', () => {
                isDragging = false;
                touchMode = null;
                touchStartDistance = 0;
            });
        }

        updateCurrentContainer();
        updateTransform();
        updateEntrancesStateForAllHouses();
    }

    function handleMobileDragStart(e) {
        const activeContainer = document.querySelector('.block-genplan__content-container._active');
        if (activeContainer && activeContainer.classList.contains('step3')) return;
        if (e.target.closest('.block-genplan-popup') || e.target.closest('.block-genplan__tippy')) return;

        isMobileDragging = true;
        const clientX = e.touches[0].clientX;
        const clientY = e.touches[0].clientY;

        startMobileX = clientX;
        startMobileY = clientY;
        startScrollLeft = container.scrollLeft;
        startScrollTop = container.scrollTop;

        container.classList.add('dragging');
        e.preventDefault();
    }

    function handleMobileDrag(e) {
        if (!isMobileDragging) return;
        const clientX = e.touches[0].clientX;
        const clientY = e.touches[0].clientY;

        const deltaX = startMobileX - clientX;
        const deltaY = startMobileY - clientY;

        container.scrollLeft = startScrollLeft + deltaX;
        container.scrollTop = startScrollTop + deltaY;
        e.preventDefault();
    }

    function handleMobileDragEnd() {
        isMobileDragging = false;
        container.classList.remove('dragging');
    }

    init();

    window.addEventListener('resize', () => {
        init();
        if (document.fullscreenElement) {
            updateSvgsSize;
        }
        clampTranslation();
        updateTransform();
    });

    window.resetTransformations = resetTransformations;
    window.updateEntrancesState = updateEntrancesState;
    window.toggleSteps = toggleSteps;
    window.updateSvgsSize = updateSvgsSize;
}

const objectsColumns = document.querySelectorAll('.block-genplan-objects-column');
if (objectsColumns) {
    objectsColumns.forEach(column => {
        column.addEventListener('click', function (e) {
            if (e.target.closest('.block-genplan__tippy')) {
                return;
            }

            const isActive = this.classList.contains('active');

            objectsColumns.forEach(col => {
                col.classList.remove('active');
            });

            if (!isActive) {
                this.classList.add('active');
            }
        });
    });

    document.addEventListener('click', function (e) {
        if (!e.target.closest('.block-genplan-objects-column')) {
            objectsColumns.forEach(col => {
                col.classList.remove('active');
            });
        }
    });
}