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

function isMobileDevice() {
    return window.innerWidth < 1200;
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
        right: '28%'
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

        if (currentContainer.classList.contains('step3') && document.fullscreenElement) {
            currentScale = 1;
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

        initToggleSwitchHandler();
        initToggleSwitchAlternative();
        initPopupHandlers();
        initMobileFloorHandlers();
        initExistingHandlers();
    } catch (err) {
        console.error('Ошибка загрузки генплана:', err);
    }
});

document.addEventListener('visibilitychange', function () {
    if (!document.hidden) {
        setTimeout(refreshEntrancesState, 100);
    }
});

window.addEventListener('resize', function () {
    setTimeout(refreshEntrancesState, 100);
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

    const regionPaths = [
        {
            d: 'M779.317 207.765L671.515 272.554H668.972L663.379 278.725L835.761 382.08L992.379 272.554L845.931 201.08L811.862 225.248L779.317 207.765Z',
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
            <svg aria-hidden="true" width="13" height="13"><use xlink:href="img/sprite.svg#close"></use></svg>
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
                        <svg aria-hidden="true" width="12" height="9"><use xlink:href="img/sprite.svg#arrow1"></use></svg>
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
                <svg aria-hidden="true" width="13" height="13"><use xlink:href="img/sprite.svg#close"></use></svg>
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
                                <svg aria-hidden="true" width="12" height="9"><use xlink:href="img/sprite.svg#arrow1"></use></svg>
                            </a>
                            <a href="#" data-house-id="${originalHouseId}" class="block-genplan-popup__button choose-floor btn">
                                <span>Выбрать этаж</span>
                                <svg aria-hidden="true" width="12" height="9"><use xlink:href="img/sprite.svg#arrow1"></use></svg>
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
                    <use xlink:href="img/sprite.svg#close"></use>
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

    const houseDetailedData = loadedHouses.get(houseId.toString());
    let availableFloors = [4, 3, 2, 1];

    if (houseDetailedData && houseDetailedData.FLOORS) {
        availableFloors = houseDetailedData.FLOORS.map(f => parseInt(f.FLOOR))
            .filter(f => !isNaN(f))
            .sort((a, b) => b - a);
    }

    const mobFloors = document.createElement('div');
    mobFloors.className = 'floors-block-genplan mob _active';
    mobFloors.dataset.id = visualHouseId;

    mobFloors.innerHTML = `
        <button type="button" class="block-genplan-popup__close">
            <svg aria-hidden="true" width="13" height="13">
                <use xlink:href="img/sprite.svg#close"></use>
            </svg>
        </button>
        ${availableFloors.map(floor => `
            <button data-floor="${floor}" class="floors-block-genplan__button">
                <span>${floor} этаж</span>
            </button>
        `).join('')}
    `;

    const popupsContainer = document.querySelector('.block-genplan__popups');
    if (popupsContainer) {
        popupsContainer.appendChild(mobFloors);
    }

    document.documentElement.classList.add('popup-open');
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
                                    <use xlink:href="img/sprite.svg#arrow1"></use>
                                </svg>
                            </div>
                            <span>Выбор этажа</span>
                        </button>
                        <button type="button" class="block-genplan-popup__close title-choose-close">
                            <svg aria-hidden="true" width="13" height="13">
                                <use xlink:href="img/sprite.svg#close"></use>
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

        houseData.ENTRANCES.forEach(entrance => {
            apartmentsByEntrance[entrance.NUMBER] = [];
        });

        floorData.APARTMENTS.forEach(apartment => {
            const entranceNumber = apartment.ENTRANCE || '1';
            if (apartmentsByEntrance[entranceNumber]) {
                apartmentsByEntrance[entranceNumber].push(apartment);
            } else {
                apartmentsByEntrance['1'].push(apartment);
            }
        });

        const entranceSections = houseData.ENTRANCES.map(entrance => {
            const entranceApartments = apartmentsByEntrance[entrance.NUMBER] || [];

            if (entranceApartments.length === 0) {
                return '';
            }

            const apartmentsHtml = entranceApartments.map(ap => `
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
                            <use xlink:href="img/sprite.svg#entrances"></use>
                        </svg>
                        <span>Подъезд №${entrance.NUMBER}</span>
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
                                <use xlink:href="img/sprite.svg#arrow1"></use>
                            </svg>
                        </div>
                        <span>Выбор этажа</span>
                    </button>
                    <button type="button" class="block-genplan-popup__close title-choose-close">
                        <svg aria-hidden="true" width="13" height="13">
                            <use xlink:href="img/sprite.svg#close"></use>
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
            const originalHouseId = visualHouseId.replace('h', '');

            floorsPopup.classList.remove('_active');
            document.documentElement.classList.remove('popup-open');

            renderMobileFloorsBlock(originalHouseId, floor);
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
                                <use xlink:href="img/sprite.svg#entrances"></use>
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
                                    <svg aria-hidden="true" width="12" height="8"><use xlink:href="img/sprite.svg#arrow1"></use></svg>
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
            <svg aria-hidden="true" width="13" height="13"><use xlink:href="img/sprite.svg#close"></use></svg>
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
            <svg aria-hidden="true" width="13" height="13"><use xlink:href="img/sprite.svg#close"></use></svg>
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

    const switchToggle = document.querySelector('.toggle-switch input[type="checkbox"]');
    if (switchToggle) {
        switchToggle.removeEventListener('change', updateEntrancesState);
        switchToggle.addEventListener('change', updateEntrancesState);
        updateEntrancesState();
    }

    const visualHouseId = `h${houseId}`;
    toggleSteps(false, true, visualHouseId);

    setTimeout(() => {
        forceInitEntrancesToggle();
        reinitToggleForNewHouse();
    }, 200);
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

    setTimeout(() => {
        updateCurrentContainer();
        updateTransform();
        if (window.resetTransformations) resetTransformations();
        if (window.updateEntrancesState) updateEntrancesState();
        updateEntrancesStateForAllHouses();
    }, 100);

    if (document.fullscreenElement) {
        updateSvgsSize();
    }

    setTimeout(() => {
        initToggleSwitchHandler();
    }, 200);
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
        setTimeout(updateEntrancesStateForAllHouses, 100);
    });

    titleRooms?.addEventListener('click', () => {
        const activeStep3 = document.querySelector('.block-genplan__content-container.step3._active');
        if (activeStep3) {
            toggleSteps(true, false);
        }
        setTimeout(updateEntrancesStateForAllHouses, 100);
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

    setTimeout(() => {
        initToggleSwitchHandler();
    }, 500);

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
    const switchToggle = document.querySelector('.toggle-switch input[type="checkbox"]');
    if (!switchToggle) return;

    const isChecked = switchToggle.checked;

    // Добавляем/убираем класс _active для визуального отображения
    const toggleSwitch = document.querySelector('.toggle-switch');
    const background = document.querySelector('.toggle-switch-background');
    const handle = document.querySelector('.toggle-switch-handle');

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
    const switchToggle = document.querySelector('.toggle-switch input[type="checkbox"]');
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

function handleToggleSwitchClick(e) {
    const toggleSwitch = e.target.closest('.toggle-switch');
    const switchGenplan = e.target.closest('.switch-genplan');
    const toggleSwitchBackground = e.target.closest('.toggle-switch-background');
    const toggleSwitchHandle = e.target.closest('.toggle-switch-handle');

    if (toggleSwitch || switchGenplan || toggleSwitchBackground || toggleSwitchHandle) {
        e.preventDefault();
        e.stopPropagation();

        const checkbox = document.querySelector('.toggle-switch input[type="checkbox"]');
        if (checkbox) {
            // Переключаем состояние
            checkbox.checked = !checkbox.checked;

            // Добавляем визуальные классы на правильные элементы
            const isChecked = checkbox.checked;

            // Добавляем класс _active к переключателю и фону
            if (toggleSwitch) {
                toggleSwitch.classList.toggle('_active', isChecked);
            }

            const background = document.querySelector('.toggle-switch-background');
            const handle = document.querySelector('.toggle-switch-handle');

            if (background) background.classList.toggle('_active', isChecked);
            if (handle) handle.classList.toggle('_active', isChecked);

            // Обновляем состояние подъездов
            updateEntrancesStateForAllHouses();
        }
    }
}

function initToggleSwitchHandler() {
    // Удаляем старые обработчики
    document.removeEventListener('click', handleToggleSwitchClick);

    // Добавляем новый обработчик
    document.addEventListener('click', handleToggleSwitchClick);

    // Инициализируем начальное состояние
    setTimeout(updateEntrancesStateForAllHouses, 100);
}

function initToggleSwitchAlternative() {
}

function forceInitEntrancesToggle() {
    // Просто обновляем состояние, не клонируем элементы
    initToggleSwitchHandler();
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
        if (e.target.matches('.toggle-switch input[type="checkbox"]')) {
            setTimeout(() => {
                updateEntrancesStateForAllHouses();
            }, 50);
        }
    });

    document.addEventListener('click', function (e) {
        const switchGenplan = e.target.closest('.switch-genplan');
        if (switchGenplan) {
            setTimeout(() => {
                updateEntrancesStateForAllHouses();
            }, 50);
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

    const SVG_WIDTH = 1200;
    const SVG_HEIGHT = 631;

    currentContainer = document.querySelector('.block-genplan__content-container._active') || contentContainerStep1;

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

    function updateSvgsSize() {
        if (!document.fullscreenElement) return;

        const containerRect = fullscreenContainer.getBoundingClientRect();
        const screenWidth = Math.round(containerRect.width);
        const screenHeight = Math.round(containerRect.height);

        const activeContainer = document.querySelector('.block-genplan__content-container._active');
        if (!activeContainer) return;

        // Только для step1 и step2 меняем размеры
        if (activeContainer.classList.contains('step1') || activeContainer.classList.contains('step2')) {
            // Обновляем размеры SVG
            const activeSvgs = activeContainer.querySelectorAll('.block-genplan__svg');
            activeSvgs.forEach(svg => {
                svg.setAttribute('width', screenWidth);
                svg.setAttribute('height', screenHeight);

                // Сохраняем оригинальные пропорции viewBox
                const originalViewBox = svg.getAttribute('viewBox') || '0 0 1200 631';
                svg.setAttribute('viewBox', originalViewBox);

                // Меняем на slice чтобы заполнить весь контейнер
                svg.setAttribute('preserveAspectRatio', 'xMidYMid slice');
            });

            // Обновляем размеры изображений - растягиваем на весь экран
            const activeImages = activeContainer.querySelectorAll('.block-genplan__image img');
            activeImages.forEach(img => {
                img.style.width = `${screenWidth}px`;
                img.style.height = `${screenHeight}px`;
                img.style.objectFit = 'cover'; // cover чтобы заполнить весь контейнер
                img.style.maxWidth = 'none';
                img.style.maxHeight = 'none';

                // Убираем центрирование, растягиваем на весь экран
                img.style.position = 'static';
                img.style.left = 'auto';
                img.style.top = 'auto';
                img.style.transform = 'none';
            });

            // Обновляем контейнеры изображений
            const activeImageContainers = activeContainer.querySelectorAll('.block-genplan__image');
            activeImageContainers.forEach(container => {
                container.style.width = `${screenWidth}px`;
                container.style.height = `${screenHeight}px`;
                container.style.position = 'relative';
                container.style.overflow = 'hidden';
            });

            // Обновляем transform контейнера
            activeContainer.style.width = `${screenWidth}px`;
            activeContainer.style.height = `${screenHeight}px`;
        }
        // Для step3 - НИЧЕГО не делаем, оставляем как есть
        else if (activeContainer.classList.contains('step3')) {
            // Никаких изменений - все остается как на десктопе
            return;
        }
    }

    function resetFullscreenStyles() {
        if (fullscreenContainer) {
            fullscreenContainer.classList.remove('fullscreen-active');
        }

        const step1Step2Containers = document.querySelectorAll('.block-genplan__content-container.step1, .block-genplan__content-container.step2');
        const step3Containers = document.querySelectorAll('.block-genplan__content-container.step3');

        // Сбрасываем стили только для step1 и step2
        step1Step2Containers.forEach(container => {
            // Сбрасываем размеры контейнера
            container.style.width = '';
            container.style.height = '';

            const svgs = container.querySelectorAll('.block-genplan__svg');
            svgs.forEach(svg => {
                svg.removeAttribute('width');
                svg.removeAttribute('height');
                svg.removeAttribute('preserveAspectRatio');
            });

            const images = container.querySelectorAll('.block-genplan__image img');
            images.forEach(img => {
                img.style.cssText = ''; // полный сброс стилей
                // Восстанавливаем оригинальные размеры
                const originalWidth = img.dataset.originalWidth || '1200';
                const originalHeight = img.dataset.originalHeight || '631';
                img.style.width = `${originalWidth}px`;
                img.style.height = `${originalHeight}px`;
            });

            const imageContainers = container.querySelectorAll('.block-genplan__image');
            imageContainers.forEach(container => {
                container.style.cssText = '';
            });
        });

        // Для step3 ничего не сбрасываем - все остается как есть
        step3Containers.forEach(container => {
            // Никаких изменений
        });
    }

    // Также добавьте эту функцию для корректировки позиций подсказок
    function adjustTipsPositions() {
        if (!document.fullscreenElement) return;

        const activeContainer = document.querySelector('.block-genplan__content-container._active');
        if (!activeContainer) return;

        const tips = activeContainer.querySelectorAll('.block-genplan__tippy');
        tips.forEach(tip => {
            // Получаем оригинальные позиции
            const originalTop = tip.style.top;
            const originalRight = tip.style.right;
            const originalLeft = tip.style.left;

            // Здесь можно добавить логику для корректировки позиций
            // если нужно адаптировать под новый размер
        });
    }

    function clampTranslation() {
        if (!container || isMobileDevice()) return;

        if (currentContainer.classList.contains('step1') || currentContainer.classList.contains('step2')) {
            const maxX = (scale - 1) * container.offsetWidth / 2;
            const maxY = (scale - 1) * container.offsetHeight / 2;
            translateX = Math.max(-maxX, Math.min(maxX, translateX));
            translateY = Math.max(-maxY, Math.min(maxY, translateY));
        }
    }

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

    // Также обновим функцию resetTransformations для step3
    function resetTransformations() {
        if (currentContainer.classList.contains('step3') && document.fullscreenElement) {
            // Для step3 в полноэкранном режиме - сбрасываем трансформации но сохраняем оригинальные размеры
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

    const zoomInBtn = document.querySelector('.zoom-genplan__up');
    const zoomOutBtn = document.querySelector('.zoom-genplan__down');

    if (zoomInBtn) {
        zoomInBtn.addEventListener('click', () => {
            if (isMobileDevice()) return;

            updateCurrentContainer();

            if (currentContainer.classList.contains('step3') && document.fullscreenElement) return;
            const rect = container.getBoundingClientRect();
            zoomToPoint(1 + zoomStep, rect.left + rect.width / 2, rect.top + rect.height / 2);
        });
    }

    if (zoomOutBtn) {
        zoomOutBtn.addEventListener('click', () => {
            if (isMobileDevice()) return;

            updateCurrentContainer();

            if (currentContainer.classList.contains('step3') && document.fullscreenElement) return;
            const rect = container.getBoundingClientRect();
            zoomToPoint(1 - zoomStep, rect.left + rect.width / 2, rect.top + rect.height / 2);
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

                    setTimeout(() => {
                        updateSvgsSize();
                        updateTransform();
                        clampTranslation();
                    }, 100);

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

        // Обновляем вызов в fullscreenchange
        document.addEventListener('fullscreenchange', () => {
            if (!document.fullscreenElement) {
                fullscreenContainer.classList.remove('fullscreen-active');
                resetFullscreenStyles();
                setTimeout(() => {
                    resetTransformations();
                    updateEntrancesStateForAllHouses();
                }, 100);
            } else {
                fullscreenContainer.classList.add('fullscreen-active');
                setTimeout(() => {
                    updateSvgsSize();
                    adjustTipsPositions(); // добавляем корректировку позиций
                    resetTransformations();
                }, 100);
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

                if (scale <= minScale && window.innerWidth >= 1200 && currentContainer.classList.contains('step1')) return;

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
                updateCurrentContainer();

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

        updateCurrentContainer();
        updateTransform();
        updateEntrancesStateForAllHouses();
    }

    function handleMobileDragStart(e) {
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
            setTimeout(updateSvgsSize, 50);
        }
        clampTranslation();
        updateTransform();
    });

    window.resetTransformations = resetTransformations;
    window.updateEntrancesState = updateEntrancesState;
    window.toggleSteps = toggleSteps;
    window.updateSvgsSize = updateSvgsSize;
}