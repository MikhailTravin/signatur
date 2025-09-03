const modules_flsModules = {};

let bodyLockStatus = true;
let bodyUnlock = (delay = 500) => {
  if (bodyLockStatus) {
    const lockPaddingElements = document.querySelectorAll("[data-lp]");
    setTimeout((() => {
      lockPaddingElements.forEach((lockPaddingElement => {
        lockPaddingElement.style.paddingRight = "";
      }));
      document.body.style.paddingRight = "";
      document.documentElement.classList.remove("lock");
    }), delay);
    bodyLockStatus = false;
    setTimeout((function () {
      bodyLockStatus = true;
    }), delay);
  }
};
let bodyLock = (delay = 500) => {
  if (bodyLockStatus) {
    const lockPaddingElements = document.querySelectorAll("[data-lp]");
    const lockPaddingValue = window.innerWidth - document.body.offsetWidth + "px";
    lockPaddingElements.forEach((lockPaddingElement => {
      lockPaddingElement.style.paddingRight = lockPaddingValue;
    }));
    document.body.style.paddingRight = lockPaddingValue;
    document.documentElement.classList.add("lock");
    bodyLockStatus = false;
    setTimeout((function () {
      bodyLockStatus = true;
    }), delay);
  }
};
function functions_FLS(message) {
  setTimeout((() => {
    if (window.FLS) console.log(message);
  }), 0);
}

let _slideUp = (target, duration = 500, showmore = 0) => {
  if (!target.classList.contains("_slide")) {
    target.classList.add("_slide");
    target.style.transitionProperty = "height, margin, padding";
    target.style.transitionDuration = duration + "ms";
    target.style.height = `${target.offsetHeight}px`;
    target.offsetHeight;
    target.style.overflow = "hidden";
    target.style.height = showmore ? `${showmore}px` : `0px`;
    target.style.paddingTop = 0;
    target.style.paddingBottom = 0;
    target.style.marginTop = 0;
    target.style.marginBottom = 0;
    window.setTimeout((() => {
      target.hidden = !showmore ? true : false;
      !showmore ? target.style.removeProperty("height") : null;
      target.style.removeProperty("padding-top");
      target.style.removeProperty("padding-bottom");
      target.style.removeProperty("margin-top");
      target.style.removeProperty("margin-bottom");
      !showmore ? target.style.removeProperty("overflow") : null;
      target.style.removeProperty("transition-duration");
      target.style.removeProperty("transition-property");
      target.classList.remove("_slide");
      document.dispatchEvent(new CustomEvent("slideUpDone", {
        detail: {
          target
        }
      }));
    }), duration);
  }
};
let _slideDown = (target, duration = 500, showmore = 0) => {
  if (!target.classList.contains("_slide")) {
    target.classList.add("_slide");
    target.hidden = target.hidden ? false : null;
    showmore ? target.style.removeProperty("height") : null;
    let height = target.offsetHeight;
    target.style.overflow = "hidden";
    target.style.height = showmore ? `${showmore}px` : `0px`;
    target.style.paddingTop = 0;
    target.style.paddingBottom = 0;
    target.style.marginTop = 0;
    target.style.marginBottom = 0;
    target.offsetHeight;
    target.style.transitionProperty = "height, margin, padding";
    target.style.transitionDuration = duration + "ms";
    target.style.height = height + "px";
    target.style.removeProperty("padding-top");
    target.style.removeProperty("padding-bottom");
    target.style.removeProperty("margin-top");
    target.style.removeProperty("margin-bottom");
    window.setTimeout((() => {
      target.style.removeProperty("height");
      target.style.removeProperty("overflow");
      target.style.removeProperty("transition-duration");
      target.style.removeProperty("transition-property");
      target.classList.remove("_slide");
      document.dispatchEvent(new CustomEvent("slideDownDone", {
        detail: {
          target
        }
      }));
    }), duration);
  }
};
let _slideToggle = (target, duration = 500) => {
  if (target.hidden) return _slideDown(target, duration); else return _slideUp(target, duration);
};

function getHash() {
  if (location.hash) { return location.hash.replace('#', ''); }
}

function dataMediaQueries(array, dataSetValue) {
  const media = Array.from(array).filter(function (item) {
    return item.dataset[dataSetValue];
  });

  if (media.length) {
    const breakpointsArray = media.map(item => {
      const params = item.dataset[dataSetValue];
      const paramsArray = params.split(",");
      return {
        value: paramsArray[0],
        type: paramsArray[1] ? paramsArray[1].trim() : "max",
        item: item
      };
    });

    const mdQueries = uniqArray(
      breakpointsArray.map(item => `(${item.type}-width: ${item.value}px),${item.value},${item.type}`)
    );

    const mdQueriesArray = mdQueries.map(breakpoint => {
      const [query, value, type] = breakpoint.split(",");
      const matchMedia = window.matchMedia(query);
      const itemsArray = breakpointsArray.filter(item => item.value === value && item.type === type);
      return { itemsArray, matchMedia };
    });

    return mdQueriesArray;
  }
}

function uniqArray(array) {
  return array.filter(function (item, index, self) {
    return self.indexOf(item) === index;
  });
}

//========================================================================================================================================================

document.addEventListener('DOMContentLoaded', () => {
  let blockGenplan = document.querySelector('.block-genplan');

  if (blockGenplan) {
    // === ОСНОВНЫЕ ЭЛЕМЕНТЫ ===
    const container = document.querySelector('.block-genplan__body');
    const contentContainerStep1 = document.querySelector('.block-genplan__content-container.step1');
    const contentContainerStep2 = document.querySelector('.block-genplan__content-container.step2');
    const titleGenplan = document.querySelector('.title-genplan');
    const titleHouse = document.querySelector('.title-house');
    const chooseHouseBtn = document.querySelector('.btn-genplan');

    const fullscreenBtn = document.querySelector('.fullsreen-genplan__button');
    const fullscreenHint = document.querySelector('.fullsreen-genplan-hint');
    const fullscreenContainer = document.querySelector('[data-fullscreen-container]');

    const content = document.querySelector('.block-genplan__content');
    const svgs = document.querySelectorAll('.block-genplan__svg'); // Получаем все SVG

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

    // Храним оригинальные позиции попапов и тултипов
    const popups = document.querySelectorAll('.block-genplan-popup');
    const tippies = document.querySelectorAll('.block-genplan__tippy');

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

    // Обновить размеры всех SVG
    function updateSvgsSize() {
      const rect = getContainerRect();
      svgs.forEach(svg => {
        svg.setAttribute('width', Math.round(rect.width));
        svg.setAttribute('height', Math.round(rect.height));
      });
    }

    // Обновить трансформацию
    function updateTransform() {
      if (currentContainer) {
        currentContainer.style.transform = `translate(${translateX}px, ${translateY}px) scale(${scale})`;
      }
    }

    // Ограничить перемещение
    function clampTranslation() {
      if (!container) return;
      const maxX = (scale - 1) * container.offsetWidth / 2;
      const maxY = (scale - 1) * container.offsetHeight / 2;

      translateX = Math.max(-maxX, Math.min(maxX, translateX));
      translateY = Math.max(-maxY, Math.min(maxY, translateY));
    }

    // Масштабирование от точки
    function zoomToPoint(scaleFactor, clientX, clientY) {
      const newScale = Math.min(Math.max(scale * scaleFactor, minScale), maxScale);
      const zoomRatio = newScale / scale;

      translateX = clientX - zoomRatio * (clientX - translateX);
      translateY = clientY - zoomRatio * (clientY - translateY);

      scale = newScale;
      clampTranslation();
      updateTransform();
    }

    // Переключение шагов
    function toggleSteps(showStep2 = false) {
      contentContainerStep1.classList.remove('_active');
      contentContainerStep2.classList.remove('_active');
      titleGenplan.classList.remove('_active');
      titleHouse.classList.remove('_active');

      if (showStep2) {
        titleGenplan.classList.add('hidden');
      } else {
        titleGenplan.classList.remove('hidden');
      }

      setTimeout(() => {
        if (showStep2) {
          contentContainerStep2.classList.add('_active');
          titleHouse.classList.add('_active');
          document.documentElement.classList.add('choice-home');
          currentContainer = contentContainerStep2;
        } else {
          contentContainerStep1.classList.add('_active');
          titleGenplan.classList.add('_active');
          document.documentElement.classList.remove('choice-home');
          currentContainer = contentContainerStep1;
        }
        resetTransformations();
      }, 50);
    }

    function resetTransformations() {
      scale = 1;
      translateX = 0;
      translateY = 0;
      updateTransform();
    }

    // Обработчик кнопки "Выбрать дом"
    if (chooseHouseBtn) {
      chooseHouseBtn.addEventListener('click', (e) => {
        e.preventDefault();
        toggleSteps(true);
        const activePopup = document.querySelector('.block-genplan-popup._active');
        if (activePopup) {
          activePopup.classList.remove('_active');
          document.documentElement.classList.remove('popup-open');
        }
      });
    }

    // Обработчик клика на заголовок "Выбор дома"
    titleHouse.addEventListener('click', () => {
      toggleSteps(false);
    });

    // === МЫШЬ ===
    container.addEventListener('mousedown', (e) => {
      if (scale <= minScale) return;

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

    container.addEventListener('wheel', (e) => {
      e.preventDefault();
      const delta = e.deltaY > 0 ? -zoomStep : zoomStep;
      zoomToPoint(1 + delta, e.clientX, e.clientY);
    }, { passive: false });

    // === КНОПКИ ЗУМА ===
    const zoomInBtn = document.querySelector('.zoom-genplan__up');
    const zoomOutBtn = document.querySelector('.zoom-genplan__down');

    if (zoomInBtn) {
      zoomInBtn.addEventListener('click', () => {
        const rect = container.getBoundingClientRect();
        zoomToPoint(1 + zoomStep, rect.left + rect.width / 2, rect.top + rect.height / 2);
      });
    }

    if (zoomOutBtn) {
      zoomOutBtn.addEventListener('click', () => {
        const rect = container.getBoundingClientRect();
        zoomToPoint(1 - zoomStep, rect.left + rect.width / 2, rect.top + rect.height / 2);
      });
    }

    // === TOUCH ===
    container.addEventListener('touchstart', (e) => {
      if (e.touches.length === 2) {
        touchMode = 'pinch';
        const dx = e.touches[0].clientX - e.touches[1].clientX;
        const dy = e.touches[0].clientY - e.touches[1].clientY;
        touchStartDistance = Math.sqrt(dx * dx + dy * dy);
        lastScale = scale;

        centerX = (e.touches[0].clientX + e.touches[1].clientX) / 2;
        centerY = (e.touches[0].clientY + e.touches[1].clientY) / 2;
      } else if (e.touches.length === 1 && scale > minScale) {
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

    // === ПОЛНОЭКРАННЫЙ РЕЖИМ ===
    if (fullscreenBtn && fullscreenHint && fullscreenContainer) {
      let hintTimeout = null;
      let scrollPosition = 0; // Для сохранения прокрутки

      function hideHint() {
        fullscreenHint.classList.remove('fullscreen-hint_active');
        if (hintTimeout) clearTimeout(hintTimeout);
      }

      fullscreenHint.addEventListener('click', (e) => {
        e.stopPropagation();
        hideHint();
      });

      // Функция сброса стилей
      function resetFullscreenStyles() {
        if (fullscreenContainer) {
          fullscreenContainer.style.width = '';
          fullscreenContainer.style.height = '';
        }
        if (content) {
          content.style.width = '';
          content.style.height = '';
        }
        if (currentContainer) {
          currentContainer.style.width = '';
          currentContainer.style.height = '';
        }

        // Убираем width и height у всех SVG
        svgs.forEach(svg => {
          svg.removeAttribute('width');
          svg.removeAttribute('height');
        });

        // Восстанавливаем оригинальные позиции
        popups.forEach(popup => {
          popup.style.left = popup.dataset.originalLeft;
          popup.style.top = popup.dataset.originalTop;
          popup.style.right = popup.dataset.originalRight;
          popup.style.bottom = popup.dataset.originalBottom;
        });

        tippies.forEach(tippy => {
          tippy.style.left = tippy.dataset.originalLeft;
          tippy.style.top = tippy.dataset.originalTop;
          tippy.style.right = tippy.dataset.originalRight;
          tippy.style.bottom = tippy.dataset.originalBottom;
        });
      }

      fullscreenBtn.addEventListener('click', async () => {
        if (!document.fullscreenElement) {
          // Сохраняем позицию прокрутки
          scrollPosition = window.scrollY;

          try {
            await fullscreenContainer.requestFullscreen();

            // Фиксируем размеры
            const rect = getContainerRect();
            fullscreenContainer.style.width = `${rect.width}px`;
            fullscreenContainer.style.height = `${rect.height}px`;
            content.style.width = `${rect.width}px`;
            content.style.height = `${rect.height}px`;
            currentContainer.style.width = `${rect.width}px`;
            currentContainer.style.height = `${rect.height}px`;

            updateSvgsSize(); // Обновляем все SVG
            updateTransform();
            clampTranslation();

            fullscreenHint.classList.add('fullscreen-hint_active');
            hintTimeout = setTimeout(hideHint, 3000);
          } catch (err) {
            console.warn('Ошибка:', err);
          }
        } else {
          try {
            await document.exitFullscreen();
          } catch (err) {
            console.warn('Ошибка:', err);
          }

          // Сбрасываем всё
          resetFullscreenStyles();
          hideHint();

          // Восстанавливаем позицию прокрутки
          setTimeout(() => {
            window.scrollTo(0, scrollPosition);
          }, 100);
        }
      });

      // Обработка выхода через Esc
      document.addEventListener('fullscreenchange', () => {
        if (!document.fullscreenElement) {
          resetFullscreenStyles();
          hideHint();
          setTimeout(() => {
            window.scrollTo(0, scrollPosition);
          }, 100);
        }
      });

      // Скрытие подсказки при клике мимо
      document.addEventListener('click', (e) => {
        if (fullscreenHint.classList.contains('fullscreen-hint_active') &&
          !e.target.closest('.fullsreen-genplan-hint') &&
          !e.target.closest('.fullsreen-genplan__button')) {
          hideHint();
        }
      });
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

    // === ИНИЦИАЛИЗАЦИЯ ===
    updateSvgsSize(); // Обновляем все SVG
    updateTransform();

    window.addEventListener('resize', () => {
      updateSvgsSize(); // Обновляем все SVG
      clampTranslation();
      updateTransform();
    });
  };
});

//========================================================================================================================================================

//Ползунок
function rangeInit() {
  const ratingCalc = document.querySelector('.filter-apartments__range');
  if (!ratingCalc) return;

  noUiSlider.create(ratingCalc, {
    start: 23.0, // начальное значение
    connect: 'lower',
    range: {
      'min': 6.7,
      'max': 22.0
    },
    format: wNumb({
      decimals: 1, // один знак после запятой
      thousand: ' ', // пробел как разделитель тысяч
    })
  });

  const priceInput = document.querySelector('.filter-apartments__price input');

  ratingCalc.noUiSlider.on('update', function (values, handle) {
    const value = parseFloat(values[handle]);
    const amount = Math.round(value * 1000000);
    priceInput.value = amount.toLocaleString('ru-RU');
  });

  const initialValue = 23.0;
  const initialAmount = Math.round(initialValue * 1000000);
  priceInput.value = initialAmount.toLocaleString('ru-RU');
}
rangeInit()

//========================================================================================================================================================

if (document.querySelector('.block-intro__slider')) {
  const swiperIntro = new Swiper('.block-intro__slider', {
    observer: true,
    observeParents: true,
    slidesPerView: 1,
    spaceBetween: 0,
    speed: 800,
    effect: 'fade',
    loop: true,
    navigation: {
      prevEl: '.block-intro__arrow-prev',
      nextEl: '.block-intro__arrow-next',
    },
    autoplay: {
      delay: 3000,
      disableOnInteraction: false,
    },
    fadeEffect: {
      crossFade: true,
    },
  });
}
function positionArrows() {
  const item = document.querySelector('.block-intro__item');
  const arrows = document.querySelector('.block-intro__arrows');

  if (!item || !arrows) return;

  const itemRect = item.getBoundingClientRect();
  const containerRect = document.querySelector('.block-intro__content').getBoundingClientRect();

  const top = itemRect.top - containerRect.top;
  const right = containerRect.width - (itemRect.left - containerRect.left + itemRect.width);

  arrows.style.top = `${top}px`;
  arrows.style.right = `${right}px`;
  arrows.style.left = 'auto';
}
window.addEventListener('load', positionArrows);
window.addEventListener('resize', positionArrows);


if (document.querySelector('.block-progress-construction__slider')) {
  const swiperProgressConstruction = new Swiper('.block-progress-construction__slider', {
    observer: true,
    observeParents: true,
    slidesPerView: 1,
    spaceBetween: 0,
    speed: 400,
    navigation: {
      prevEl: '.block-progress-construction__arrow-prev',
      nextEl: '.block-progress-construction__arrow-next',
    },
    pagination: {
      el: '.block-progress-construction__pagination',
      clickable: true,
    },
  });
}

if (document.querySelector('.block-sale__slider')) {
  const swiperSale = new Swiper('.block-sale__slider', {
    observer: true,
    observeParents: true,
    slidesPerView: 2,
    spaceBetween: 10,
    speed: 400,
    navigation: {
      prevEl: '.block-sale__arrow-prev',
      nextEl: '.block-sale__arrow-next',
    },
    breakpoints: {
      0: {
        slidesPerView: 1.1,
        spaceBetween: 20,
      },
      600: {
        slidesPerView: 2,
        spaceBetween: 20,
      },
      767: {
        slidesPerView: 2,
        spaceBetween: 25,
      },
      992: {
        slidesPerView: 2,
        spaceBetween: 10,
      },
    },
  });
}

if (document.querySelectorAll('.tabs__slider').length) {
  document.querySelectorAll('.tabs__slider').forEach(slider => {
    const tabsContainer = slider.closest('.tabs');
    const prevEl = tabsContainer?.querySelector('.tabs__arrow-prev');
    const nextEl = tabsContainer?.querySelector('.tabs__arrow-next');

    new Swiper(slider, {
      observer: true,
      observeParents: true,
      slidesPerView: 'auto',
      spaceBetween: 20,
      speed: 400,

      watchSlidesProgress: true,
      resizeObserver: true,

      navigation: {
        prevEl: prevEl,
        nextEl: nextEl,
      },

      breakpoints: {
        0: {
          slidesPerView: 'auto',
          spaceBetween: 15,
        },
        600: {
          slidesPerView: 'auto',
          spaceBetween: 20,
        },
        767: {
          slidesPerView: 'auto',
          spaceBetween: 25,
        },
        992: {
          slidesPerView: 'auto',
          spaceBetween: 20,
        },
      },

      on: {
        init: function () {
          this.update();
        }
      }
    });
  });
}

//========================================================================================================================================================

Fancybox.bind("[data-fancybox]", {
  // опции
});

document.querySelectorAll('.js-open-gallery').forEach($link => {
  $link.addEventListener('click', function (e) {
    e.preventDefault();

    // Собираем все изображения из галереи gallery1
    const galleryItems = [];
    document.querySelectorAll('a[data-fancybox="gallery1"]')
      .forEach($item => {
        galleryItems.push({
          src: $item.getAttribute('href'),
          type: 'image'
        });
      });

    // Открываем Fancybox с этими изображениями
    Fancybox.show(galleryItems, {
      // твои опции
    });
  });
});

//========================================================================================================================================================

//Видео
const videos = document.querySelectorAll('.video');
const buttons = document.querySelectorAll('.sound');

if (videos) {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      const video = entry.target;

      if (entry.isIntersecting) {
        video.play().catch(e => console.warn("Автовоспроизведение заблокировано:", e));
      } else {
        video.pause();
      }
    });
  }, {
    threshold: 0.5
  });

  videos.forEach(video => {
    observer.observe(video);
  });

  buttons.forEach((button, index) => {
    button.addEventListener('click', function () {
      const video = videos[index];

      if (video) {
        if (video.muted) {
          video.muted = false;
          button.classList.add("_active");
        } else {
          video.muted = true;
          button.classList.remove("_active");
        }
      }
    });
  });
}

//========================================================================================================================================================

//Маска телефон
const telephone = document.querySelectorAll(".tel");
if (telephone) Inputmask({
  mask: "+7 (999) - 999 - 99 - 99"
}).mask(telephone);

//========================================================================================================================================================

//Табы
function tabs() {
  const tabs = document.querySelectorAll('[data-tabs]');
  let tabsActiveHash = [];

  if (tabs.length > 0) {
    const hash = getHash();
    if (hash && hash.startsWith('tab-')) {
      tabsActiveHash = hash.replace('tab-', '').split('-');
    }
    tabs.forEach((tabsBlock, index) => {
      tabsBlock.classList.add('_tab-init');
      tabsBlock.setAttribute('data-tabs-index', index);
      tabsBlock.addEventListener("click", setTabsAction);
      initTabs(tabsBlock);
    });

    let mdQueriesArray = dataMediaQueries(tabs, "tabs");
    if (mdQueriesArray && mdQueriesArray.length) {
      mdQueriesArray.forEach(mdQueriesItem => {
        mdQueriesItem.matchMedia.addEventListener("change", function () {
          setTitlePosition(mdQueriesItem.itemsArray, mdQueriesItem.matchMedia);
        });
        setTitlePosition(mdQueriesItem.itemsArray, mdQueriesItem.matchMedia);
      });
    }
  }

  function setTitlePosition(tabsMediaArray, matchMedia) {
    tabsMediaArray.forEach(tabsMediaItem => {
      tabsMediaItem = tabsMediaItem.item;
      let tabsTitles = tabsMediaItem.querySelector('[data-tabs-titles]');
      let tabsTitleItems = tabsMediaItem.querySelectorAll('[data-tabs-title]');
      let tabsContent = tabsMediaItem.querySelector('[data-tabs-body]');
      let tabsContentItems = tabsMediaItem.querySelectorAll('[data-tabs-item]');
      tabsTitleItems = Array.from(tabsTitleItems).filter(item => item.closest('[data-tabs]') === tabsMediaItem);
      tabsContentItems = Array.from(tabsContentItems).filter(item => item.closest('[data-tabs]') === tabsMediaItem);
      tabsContentItems.forEach((tabsContentItem, index) => {
        if (matchMedia.matches) {
          tabsContent.append(tabsTitleItems[index]);
          tabsContent.append(tabsContentItem);
          tabsMediaItem.classList.add('_tab-spoller');
        } else {
          tabsTitles.append(tabsTitleItems[index]);
          tabsMediaItem.classList.remove('_tab-spoller');
        }
      });
    });
  }

  function initTabs(tabsBlock) {
    let tabsTitles = tabsBlock.querySelectorAll('[data-tabs-titles]>*');
    let tabsContent = tabsBlock.querySelectorAll('[data-tabs-body]>*');
    const tabsBlockIndex = tabsBlock.dataset.tabsIndex;
    const tabsActiveHashBlock = tabsActiveHash[0] == tabsBlockIndex;

    if (tabsActiveHashBlock) {
      const tabsActiveTitle = tabsBlock.querySelector('[data-tabs-titles]>._tab-active');
      tabsActiveTitle ? tabsActiveTitle.classList.remove('_tab-active') : null;
    }
    if (tabsContent.length) {
      tabsContent.forEach((tabsContentItem, index) => {
        tabsTitles[index].setAttribute('data-tabs-title', '');
        tabsContentItem.setAttribute('data-tabs-item', '');

        if (tabsActiveHashBlock && index == tabsActiveHash[1]) {
          tabsTitles[index].classList.add('_tab-active');
        }
        tabsContentItem.hidden = !tabsTitles[index].classList.contains('_tab-active');
      });
    }
    setTabsStatus(tabsBlock);
  }

  function setTabsStatus(tabsBlock) {
    let tabsTitles = tabsBlock.querySelectorAll('[data-tabs-title]');
    let tabsContent = tabsBlock.querySelectorAll('[data-tabs-item]');
    const tabsBlockIndex = tabsBlock.dataset.tabsIndex;

    function isTabsAnimate(tabsBlock) {
      if (tabsBlock.hasAttribute('data-tabs-animate')) {
        return tabsBlock.dataset.tabsAnimate > 0 ? Number(tabsBlock.dataset.tabsAnimate) : 500;
      }
      return false;
    }
    const tabsBlockAnimate = isTabsAnimate(tabsBlock);

    if (tabsContent.length > 0) {
      const isHash = tabsBlock.hasAttribute('data-tabs-hash');
      tabsContent = Array.from(tabsContent).filter(item => item.closest('[data-tabs]') === tabsBlock);
      tabsTitles = Array.from(tabsTitles).filter(item => item.closest('[data-tabs]') === tabsBlock);
      tabsContent.forEach((tabsContentItem, index) => {
        if (tabsTitles[index].classList.contains('_tab-active')) {
          if (tabsBlockAnimate) {
            _slideDown(tabsContentItem, tabsBlockAnimate);
          } else {
            tabsContentItem.hidden = false;
          }
          if (isHash && !tabsContentItem.closest('.popup')) {
            setHash(`tab-${tabsBlockIndex}-${index}`);
          }
        } else {
          if (tabsBlockAnimate) {
            _slideUp(tabsContentItem, tabsBlockAnimate);
          } else {
            tabsContentItem.hidden = true;
          }
        }
      });
    }
  }

  function setTabsAction(e) {
    const el = e.target;
    if (el.closest('[data-tabs-title]')) {
      const tabTitle = el.closest('[data-tabs-title]');
      const tabsBlock = tabTitle.closest('[data-tabs]');
      if (!tabTitle.classList.contains('_tab-active') && !tabsBlock.querySelector('._slide')) {
        let tabActiveTitle = tabsBlock.querySelectorAll('[data-tabs-title]._tab-active');
        tabActiveTitle = Array.from(tabActiveTitle).filter(item => item.closest('[data-tabs]') === tabsBlock);
        if (tabActiveTitle.length) tabActiveTitle[0].classList.remove('_tab-active');
        tabTitle.classList.add('_tab-active');
        setTabsStatus(tabsBlock);
      }
      e.preventDefault();
    }
  }
}
tabs();

//========================================================================================================================================================

//Фиксированная кнопка
const backToTopBtn = document.querySelector('.back-to-top');

if (backToTopBtn) {
  window.addEventListener('scroll', () => {
    if (window.scrollY > 300) {
      backToTopBtn.classList.add('_active');
    } else {
      backToTopBtn.classList.remove('_active');
    }
  });

  backToTopBtn.addEventListener('click', (e) => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  });
}