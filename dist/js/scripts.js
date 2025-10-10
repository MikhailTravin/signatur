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

//========================================================================================================================================================

//Ползунок
function rangeInit() {
  const ratingCalc = document.querySelector('.filter-apartments__range');
  if (ratingCalc) {

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

  const ratingCalc2 = document.querySelector('.filter-apartments__range1');
  if (ratingCalc2) {
    noUiSlider.create(ratingCalc2, {
      start: 3665000, // начальное значение
      connect: 'lower',
      range: {
        'min': 1000000, // минимальная стоимость 
        'max': 10000000 // максимальная стоимость
      },
      format: {
        to: function (value) {
          return Math.round(value);
        },
        from: function (value) {
          return parseFloat(value);
        }
      }
    });

    const priceInput = document.querySelector('.filter-apartments__price.price1 input');

    ratingCalc2.noUiSlider.on('update', function (values, handle) {
      const value = Math.round(values[handle]);
      priceInput.value = value.toLocaleString('ru-RU');
    });
  }

  const ratingCalc3 = document.querySelector('.filter-apartments__range2');
  const priceInput2 = document.querySelector('.filter-apartments__price.price2 input');
  const buttons2 = document.querySelectorAll('.range2 .filter-apartments__button');

  if (ratingCalc3) {
    noUiSlider.create(ratingCalc3, {
      start: 5,
      connect: 'lower',
      step: 1,
      range: {
        'min': 1,
        'max': 30
      },
      format: {
        to: function (value) {
          return Math.round(value);
        },
        from: function (value) {
          return parseFloat(value);
        }
      }
    });

    ratingCalc3.noUiSlider.on('update', function (values, handle) {
      const value = Math.round(values[handle]);
      priceInput2.value = value;

      buttons2.forEach(btn => {
        btn.classList.remove('active');
        if (parseInt(btn.getAttribute('data-number')) === value) {
          btn.classList.add('active');
        }
      });
    });

    priceInput2.addEventListener('change', function () {
      let value = parseInt(this.value) || 5;

      if (value < 1) value = 1;
      if (value > 30) value = 30;

      ratingCalc3.noUiSlider.set(value);
      this.value = value;
    });

    buttons2.forEach(button => {
      button.addEventListener('click', function () {
        const percentage = parseInt(this.getAttribute('data-number'));
        ratingCalc3.noUiSlider.set(percentage);
        priceInput2.value = percentage;
      });
    });
  }

  const ratingCalc4 = document.querySelector('.filter-apartments__range3');
  const priceInput3 = document.querySelector('.filter-apartments__price.price3 input');
  const buttons3 = document.querySelectorAll('.range3 .filter-apartments__button');

  if (ratingCalc4) {
    noUiSlider.create(ratingCalc4, {
      start: 5,
      connect: 'lower',
      step: 1,
      range: {
        'min': 1,
        'max': 30
      },
      format: {
        to: function (value) {
          return Math.round(value);
        },
        from: function (value) {
          return parseFloat(value);
        }
      }
    });

    ratingCalc4.noUiSlider.on('update', function (values, handle) {
      const value = Math.round(values[handle]);
      priceInput3.value = value;

      buttons3.forEach(btn => {
        btn.classList.remove('active');
        if (parseInt(btn.getAttribute('data-number')) === value) {
          btn.classList.add('active');
        }
      });
    });

    priceInput3.addEventListener('change', function () {
      let value = parseInt(this.value) || 5;

      if (value < 1) value = 1;
      if (value > 30) value = 30;

      ratingCalc4.noUiSlider.set(value);
      this.value = value;
    });

    buttons3.forEach(button => {
      button.addEventListener('click', function () {
        const percentage = parseInt(this.getAttribute('data-number'));
        ratingCalc4.noUiSlider.set(percentage);
        priceInput3.value = percentage;
      });
    });
  }

  const ratingCalc5 = document.querySelector('.filter-apartments__range4');
  const priceInput4 = document.querySelector('.range4 .filter-apartments__price input');
  const buttons4 = document.querySelectorAll('.range4 .filter-apartments__button');

  if (ratingCalc5) {
    noUiSlider.create(ratingCalc5, {
      start: 7.3,
      connect: 'lower',
      step: 0.1,
      range: {
        'min': 1,
        'max': 16
      },
      format: {
        to: function (value) {
          return value.toFixed(1);
        },
        from: function (value) {
          return parseFloat(value);
        }
      }
    });

    ratingCalc5.noUiSlider.on('update', function (values, handle) {
      const value = parseFloat(values[handle]).toFixed(1);
      priceInput4.value = value;

      buttons4.forEach(btn => {
        btn.classList.remove('active');
        const btnValue = parseFloat(btn.getAttribute('data-number'));
        if (Math.abs(btnValue - parseFloat(value)) < 0.1) {
          btn.classList.add('active');
        }
      });
    });

    priceInput4.addEventListener('change', function () {
      let value = parseFloat(this.value.replace(',', '.')) || 7.3;

      if (value < 1) value = 1;
      if (value > 16) value = 16;

      ratingCalc5.noUiSlider.set(value);
      this.value = value.toFixed(1);
    });

    buttons4.forEach(button => {
      button.addEventListener('click', function () {
        const percentage = parseFloat(this.getAttribute('data-number'));
        ratingCalc5.noUiSlider.set(percentage);
        priceInput4.value = percentage.toFixed(1);
      });
    });
  }

}
rangeInit()

//========================================================================================================================================================

if (document.querySelector('.block-intro__slider')) {
  const swiperIntro = new Swiper('.block-intro__slider', {
    observer: true,
    observeParents: true,
    slidesPerView: 1,
    spaceBetween: 0,
    speed: 400,
    loop: true,
    navigation: {
      prevEl: '.block-intro__arrow-prev',
      nextEl: '.block-intro__arrow-next',
    },
    autoplay: {
      delay: 3000,
      disableOnInteraction: false,
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
        slidesPerView: 'auto',
        spaceBetween: 15,
      },
      768: {
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

//========================================================================================================================================================

//Селект
class SelectConstructor {
  constructor(props, data = null) {
    let defaultConfig = {
      init: true,
      logging: true,
      speed: 150
    }
    this.config = Object.assign(defaultConfig, props);
    this.selectClasses = {
      classSelect: "select",
      classSelectBody: "select__body",
      classSelectTitle: "select__title",
      classSelectValue: "select__value",
      classSelectLabel: "select__label",
      classSelectInput: "select__input",
      classSelectText: "select__text",
      classSelectLink: "select__link",
      classSelectOptions: "select__options",
      classSelectOptionsScroll: "select__scroll",
      classSelectOption: "select__option",
      classSelectContent: "select__content",
      classSelectRow: "select__row",
      classSelectData: "select__asset",
      classSelectDisabled: "_select-disabled",
      classSelectTag: "_select-tag",
      classSelectOpen: "_select-open",
      classSelectActive: "_select-active",
      classSelectFocus: "_select-focus",
      classSelectMultiple: "_select-multiple",
      classSelectCheckBox: "_select-checkbox",
      classSelectOptionSelected: "_select-selected",
      classSelectPseudoLabel: "_select-pseudo-label",
    }
    this._this = this;
    if (this.config.init) {
      const selectItems = data ? document.querySelectorAll(data) : document.querySelectorAll('select');
      if (selectItems.length) {
        this.selectsInit(selectItems);
      }
    }
  }
  getSelectClass(className) {
    return `.${className}`;
  }
  getSelectElement(selectItem, className) {
    return {
      originalSelect: selectItem.querySelector('select'),
      selectElement: selectItem.querySelector(this.getSelectClass(className)),
    }
  }
  selectsInit(selectItems) {
    selectItems.forEach((originalSelect, index) => {
      this.selectInit(originalSelect, index + 1);
    });
    document.addEventListener('click', function (e) {
      this.selectsActions(e);
    }.bind(this));
    document.addEventListener('keydown', function (e) {
      this.selectsActions(e);
    }.bind(this));
    document.addEventListener('focusin', function (e) {
      this.selectsActions(e);
    }.bind(this));
    document.addEventListener('focusout', function (e) {
      this.selectsActions(e);
    }.bind(this));
  }
  selectInit(originalSelect, index) {
    const _this = this;
    let selectItem = document.createElement("div");
    selectItem.classList.add(this.selectClasses.classSelect);
    originalSelect.parentNode.insertBefore(selectItem, originalSelect);
    selectItem.appendChild(originalSelect);
    originalSelect.hidden = true;
    index ? originalSelect.dataset.id = index : null;

    if (this.getSelectPlaceholder(originalSelect)) {
      originalSelect.dataset.placeholder = this.getSelectPlaceholder(originalSelect).value;
      if (this.getSelectPlaceholder(originalSelect).label.show) {
        const selectItemTitle = this.getSelectElement(selectItem, this.selectClasses.classSelectTitle).selectElement;
        selectItemTitle.insertAdjacentHTML('afterbegin', `<span class="${this.selectClasses.classSelectLabel}">${this.getSelectPlaceholder(originalSelect).label.text ? this.getSelectPlaceholder(originalSelect).label.text : this.getSelectPlaceholder(originalSelect).value}</span>`);
      }
    }
    selectItem.insertAdjacentHTML('beforeend', `<div class="${this.selectClasses.classSelectBody}"><div hidden class="${this.selectClasses.classSelectOptions}"></div></div>`);

    this.selectBuild(originalSelect);

    originalSelect.dataset.speed = originalSelect.dataset.speed ? originalSelect.dataset.speed : this.config.speed;
    this.config.speed = +originalSelect.dataset.speed;

    originalSelect.addEventListener('change', function (e) {
      _this.selectChange(e);
    });
  }
  selectBuild(originalSelect) {
    const selectItem = originalSelect.parentElement;
    selectItem.dataset.id = originalSelect.dataset.id;
    originalSelect.dataset.classModif ? selectItem.classList.add(`select_${originalSelect.dataset.classModif}`) : null;

    originalSelect.multiple ? selectItem.classList.add(this.selectClasses.classSelectMultiple) : selectItem.classList.remove(this.selectClasses.classSelectMultiple);

    originalSelect.hasAttribute('data-checkbox') && originalSelect.multiple ? selectItem.classList.add(this.selectClasses.classSelectCheckBox) : selectItem.classList.remove(this.selectClasses.classSelectCheckBox);

    this.setSelectTitleValue(selectItem, originalSelect);
    this.setOptions(selectItem, originalSelect);
    originalSelect.hasAttribute('data-search') ? this.searchActions(selectItem) : null;
    originalSelect.hasAttribute('data-open') ? this.selectAction(selectItem) : null;
    this.selectDisabled(selectItem, originalSelect);
  }
  selectsActions(e) {
    const targetElement = e.target;
    const targetType = e.type;
    if (targetElement.closest(this.getSelectClass(this.selectClasses.classSelect)) || targetElement.closest(this.getSelectClass(this.selectClasses.classSelectTag))) {
      const selectItem = targetElement.closest('.select') ? targetElement.closest('.select') : document.querySelector(`.${this.selectClasses.classSelect}[data-id="${targetElement.closest(this.getSelectClass(this.selectClasses.classSelectTag)).dataset.selectId}"]`);
      const originalSelect = this.getSelectElement(selectItem).originalSelect;
      if (targetType === 'click') {
        if (!originalSelect.disabled) {
          if (targetElement.closest(this.getSelectClass(this.selectClasses.classSelectTag))) {
            const targetTag = targetElement.closest(this.getSelectClass(this.selectClasses.classSelectTag));
            const optionItem = document.querySelector(`.${this.selectClasses.classSelect}[data-id="${targetTag.dataset.selectId}"] .select__option[data-value="${targetTag.dataset.value}"]`);
            this.optionAction(selectItem, originalSelect, optionItem);
          } else if (targetElement.closest(this.getSelectClass(this.selectClasses.classSelectTitle))) {

            this.selectAction(selectItem);
          } else if (targetElement.closest(this.getSelectClass(this.selectClasses.classSelectOption))) {

            const optionItem = targetElement.closest(this.getSelectClass(this.selectClasses.classSelectOption));
            this.optionAction(selectItem, originalSelect, optionItem);
          }
        }
      } else if (targetType === 'focusin' || targetType === 'focusout') {
        if (targetElement.closest(this.getSelectClass(this.selectClasses.classSelect))) {
          targetType === 'focusin' ? selectItem.classList.add(this.selectClasses.classSelectFocus) : selectItem.classList.remove(this.selectClasses.classSelectFocus);
        }
      } else if (targetType === 'keydown' && e.code === 'Escape') {
        this.selectsСlose();
      }
    } else {
      this.selectsСlose();
    }
  }
  selectsСlose(selectOneGroup) {
    const selectsGroup = selectOneGroup ? selectOneGroup : document;
    const selectActiveItems = selectsGroup.querySelectorAll(`${this.getSelectClass(this.selectClasses.classSelect)}${this.getSelectClass(this.selectClasses.classSelectOpen)}`);
    if (selectActiveItems.length) {
      selectActiveItems.forEach(selectActiveItem => {
        this.selectСlose(selectActiveItem);
      });
    }
  }
  selectСlose(selectItem) {
    const originalSelect = this.getSelectElement(selectItem).originalSelect;
    const selectOptions = this.getSelectElement(selectItem, this.selectClasses.classSelectOptions).selectElement;
    if (!selectOptions.classList.contains('_slide')) {
      selectItem.classList.remove(this.selectClasses.classSelectOpen);
      _slideUp(selectOptions, originalSelect.dataset.speed);
      setTimeout(() => {
        selectItem.style.zIndex = '';
      }, originalSelect.dataset.speed);
    }
  }
  selectAction(selectItem) {
    const originalSelect = this.getSelectElement(selectItem).originalSelect;
    const selectOptions = this.getSelectElement(selectItem, this.selectClasses.classSelectOptions).selectElement;
    const selectOpenzIndex = originalSelect.dataset.zIndex ? originalSelect.dataset.zIndex : 3;

    this.setOptionsPosition(selectItem);

    this.selectsСlose();

    setTimeout(() => {
      if (!selectOptions.classList.contains('_slide')) {
        selectItem.classList.toggle(this.selectClasses.classSelectOpen);
        _slideToggle(selectOptions, originalSelect.dataset.speed);

        if (selectItem.classList.contains(this.selectClasses.classSelectOpen)) {
          selectItem.style.zIndex = selectOpenzIndex;
        } else {
          setTimeout(() => {
            selectItem.style.zIndex = '';
          }, originalSelect.dataset.speed);
        }
      }
    }, 0);
  }
  setSelectTitleValue(selectItem, originalSelect) {
    const selectItemBody = this.getSelectElement(selectItem, this.selectClasses.classSelectBody).selectElement;
    const selectItemTitle = this.getSelectElement(selectItem, this.selectClasses.classSelectTitle).selectElement;
    if (selectItemTitle) selectItemTitle.remove();
    selectItemBody.insertAdjacentHTML("afterbegin", this.getSelectTitleValue(selectItem, originalSelect));
    originalSelect.hasAttribute('data-search') ? this.searchActions(selectItem) : null;
  }
  getSelectTitleValue(selectItem, originalSelect) {
    let selectTitleValue = this.getSelectedOptionsData(originalSelect, 2).html;
    if (originalSelect.multiple && originalSelect.hasAttribute('data-tags')) {
      selectTitleValue = this.getSelectedOptionsData(originalSelect).elements.map(option => `<span role="button" data-select-id="${selectItem.dataset.id}" data-value="${option.value}" class="_select-tag">${this.getSelectElementContent(option)}</span>`).join('');

      if (originalSelect.dataset.tags && document.querySelector(originalSelect.dataset.tags)) {
        document.querySelector(originalSelect.dataset.tags).innerHTML = selectTitleValue;
        if (originalSelect.hasAttribute('data-search')) selectTitleValue = false;
      }
    }

    selectTitleValue = selectTitleValue.length ? selectTitleValue : (originalSelect.dataset.placeholder ? originalSelect.dataset.placeholder : '');

    let pseudoAttribute = '';
    let pseudoAttributeClass = '';
    if (originalSelect.hasAttribute('data-pseudo-label')) {
      pseudoAttribute = originalSelect.dataset.pseudoLabel ? ` data-pseudo-label="${originalSelect.dataset.pseudoLabel}"` : ` data-pseudo-label="Заповніть атрибут"`;
      pseudoAttributeClass = ` ${this.selectClasses.classSelectPseudoLabel}`;
    }
    this.getSelectedOptionsData(originalSelect).values.length ? selectItem.classList.add(this.selectClasses.classSelectActive) : selectItem.classList.remove(this.selectClasses.classSelectActive);

    if (originalSelect.hasAttribute('data-search')) {

      return `<div class="${this.selectClasses.classSelectTitle}"><span${pseudoAttribute} class="${this.selectClasses.classSelectValue}"><input autocomplete="off" type="text" placeholder="${selectTitleValue}" data-placeholder="${selectTitleValue}" class="${this.selectClasses.classSelectInput}"></span></div>`;
    } else {

      const customClass = this.getSelectedOptionsData(originalSelect).elements.length && this.getSelectedOptionsData(originalSelect).elements[0].dataset.class ? ` ${this.getSelectedOptionsData(originalSelect).elements[0].dataset.class}` : '';

      return `<button type="button" class="${this.selectClasses.classSelectTitle}"><span${pseudoAttribute} class="${this.selectClasses.classSelectValue}${pseudoAttributeClass}"><span class="${this.selectClasses.classSelectContent}${customClass}">${selectTitleValue}</span></span></button>`;
    }
  }
  getSelectElementContent(selectOption) {
    const selectOptionData = selectOption.dataset.asset ? `${selectOption.dataset.asset}` : '';
    const selectOptionDataHTML = selectOptionData.indexOf('img') >= 0 ? `<img src="${selectOptionData}" alt="">` : selectOptionData;
    let selectOptionContentHTML = ``;
    selectOptionContentHTML += selectOptionData ? `<span class="${this.selectClasses.classSelectRow}">` : '';
    selectOptionContentHTML += selectOptionData ? `<span class="${this.selectClasses.classSelectData}">` : '';
    selectOptionContentHTML += selectOptionData ? selectOptionDataHTML : '';
    selectOptionContentHTML += selectOptionData ? `</span>` : '';
    selectOptionContentHTML += selectOptionData ? `<span class="${this.selectClasses.classSelectText}">` : '';
    selectOptionContentHTML += selectOption.textContent;
    selectOptionContentHTML += selectOptionData ? `</span>` : '';
    selectOptionContentHTML += selectOptionData ? `</span>` : '';
    return selectOptionContentHTML;
  }
  getSelectPlaceholder(originalSelect) {
    const selectPlaceholder = Array.from(originalSelect.options).find(option => !option.value);
    if (selectPlaceholder) {
      return {
        value: selectPlaceholder.textContent,
        show: selectPlaceholder.hasAttribute("data-show"),
        label: {
          show: selectPlaceholder.hasAttribute("data-label"),
          text: selectPlaceholder.dataset.label
        }
      }
    }
  }
  getSelectedOptionsData(originalSelect, type) {
    let selectedOptions = [];
    if (originalSelect.multiple) {
      selectedOptions = Array.from(originalSelect.options).filter(option => option.value).filter(option => option.selected);
    } else {
      selectedOptions.push(originalSelect.options[originalSelect.selectedIndex]);
    }
    return {
      elements: selectedOptions.map(option => option),
      values: selectedOptions.filter(option => option.value).map(option => option.value),
      html: selectedOptions.map(option => this.getSelectElementContent(option))
    }
  }
  getOptions(originalSelect) {
    const selectOptionsScroll = originalSelect.hasAttribute('data-scroll') ? `data-simplebar` : '';
    const customMaxHeightValue = +originalSelect.dataset.scroll ? +originalSelect.dataset.scroll : null;

    let selectOptions = Array.from(originalSelect.options);
    if (selectOptions.length > 0) {
      let selectOptionsHTML = ``;

      if ((this.getSelectPlaceholder(originalSelect) && !this.getSelectPlaceholder(originalSelect).show) || originalSelect.multiple) {
        selectOptions = selectOptions.filter(option => option.value);
      }
      selectOptionsHTML += `<div ${selectOptionsScroll} ${selectOptionsScroll ? `style="max-height: ${customMaxHeightValue}px"` : ''} class="${this.selectClasses.classSelectOptionsScroll}">`;
      selectOptions.forEach(selectOption => {
        selectOptionsHTML += this.getOption(selectOption, originalSelect);
      });
      selectOptionsHTML += `</div>`;
      return selectOptionsHTML;
    }
  }
  getOption(selectOption, originalSelect) {
    const selectOptionSelected = selectOption.selected && originalSelect.multiple ? ` ${this.selectClasses.classSelectOptionSelected}` : '';

    const selectOptionHide = selectOption.selected && !originalSelect.hasAttribute('data-show-selected') && !originalSelect.multiple ? `hidden` : ``;

    const selectOptionClass = selectOption.dataset.class ? ` ${selectOption.dataset.class}` : '';

    const selectOptionLink = selectOption.dataset.href ? selectOption.dataset.href : false;
    const selectOptionLinkTarget = selectOption.hasAttribute('data-href-blank') ? `target="_blank"` : '';

    let selectOptionHTML = ``;
    selectOptionHTML += selectOptionLink ? `<a ${selectOptionLinkTarget} ${selectOptionHide} href="${selectOptionLink}" data-value="${selectOption.value}" class="${this.selectClasses.classSelectOption}${selectOptionClass}${selectOptionSelected}">` : `<button ${selectOptionHide} class="${this.selectClasses.classSelectOption}${selectOptionClass}${selectOptionSelected}" data-value="${selectOption.value}" type="button">`;
    selectOptionHTML += this.getSelectElementContent(selectOption);
    selectOptionHTML += selectOptionLink ? `</a>` : `</button>`;
    return selectOptionHTML;
  }
  setOptions(selectItem, originalSelect) {
    const selectItemOptions = this.getSelectElement(selectItem, this.selectClasses.classSelectOptions).selectElement;

    selectItemOptions.innerHTML = this.getOptions(originalSelect);
  }
  setOptionsPosition(selectItem) {
    const originalSelect = this.getSelectElement(selectItem).originalSelect;
    const selectOptions = this.getSelectElement(selectItem, this.selectClasses.classSelectOptions).selectElement;
    const selectItemScroll = this.getSelectElement(selectItem, this.selectClasses.classSelectOptionsScroll).selectElement;
    const customMaxHeightValue = +originalSelect.dataset.scroll ? `${+originalSelect.dataset.scroll}px` : ``;
    const selectOptionsPosMargin = +originalSelect.dataset.optionsMargin ? +originalSelect.dataset.optionsMargin : 10;

    if (!selectItem.classList.contains(this.selectClasses.classSelectOpen)) {
      selectOptions.hidden = false;
      const selectItemScrollHeight = selectItemScroll.offsetHeight ? selectItemScroll.offsetHeight : parseInt(window.getComputedStyle(selectItemScroll).getPropertyValue('max-height'));
      const selectOptionsHeight = selectOptions.offsetHeight > selectItemScrollHeight ? selectOptions.offsetHeight : selectItemScrollHeight + selectOptions.offsetHeight;
      const selectOptionsScrollHeight = selectOptionsHeight - selectItemScrollHeight;
      selectOptions.hidden = true;

      const selectItemHeight = selectItem.offsetHeight;
      const selectItemPos = selectItem.getBoundingClientRect().top;
      const selectItemTotal = selectItemPos + selectOptionsHeight + selectItemHeight + selectOptionsScrollHeight;
      const selectItemResult = window.innerHeight - (selectItemTotal + selectOptionsPosMargin);

      if (selectItemResult < 0) {
        const newMaxHeightValue = selectOptionsHeight + selectItemResult;
        if (newMaxHeightValue < 100) {
          selectItem.classList.add('select--show-top');
          selectItemScroll.style.maxHeight = selectItemPos < selectOptionsHeight ? `${selectItemPos - (selectOptionsHeight - selectItemPos)}px` : customMaxHeightValue;
        } else {
          selectItem.classList.remove('select--show-top');
          selectItemScroll.style.maxHeight = `${newMaxHeightValue}px`;
        }
      }
    } else {
      setTimeout(() => {
        selectItem.classList.remove('select--show-top');
        selectItemScroll.style.maxHeight = customMaxHeightValue;
      }, +originalSelect.dataset.speed);
    }
  }
  optionAction(selectItem, originalSelect, optionItem) {
    const selectOptions = selectItem.querySelector(`${this.getSelectClass(this.selectClasses.classSelectOptions)}`);
    if (!selectOptions.classList.contains('_slide')) {
      if (originalSelect.multiple) {
        optionItem.classList.toggle(this.selectClasses.classSelectOptionSelected);

        const originalSelectSelectedItems = this.getSelectedOptionsData(originalSelect).elements;
        originalSelectSelectedItems.forEach(originalSelectSelectedItem => {
          originalSelectSelectedItem.removeAttribute('selected');
        });
        const selectSelectedItems = selectItem.querySelectorAll(this.getSelectClass(this.selectClasses.classSelectOptionSelected));
        selectSelectedItems.forEach(selectSelectedItems => {
          originalSelect.querySelector(`option[value = "${selectSelectedItems.dataset.value}"]`).setAttribute('selected', 'selected');
        });
      } else {
        if (!originalSelect.hasAttribute('data-show-selected')) {
          setTimeout(() => {
            if (selectItem.querySelector(`${this.getSelectClass(this.selectClasses.classSelectOption)}[hidden]`)) {
              selectItem.querySelector(`${this.getSelectClass(this.selectClasses.classSelectOption)}[hidden]`).hidden = false;
            }
            optionItem.hidden = true;
          }, this.config.speed);
        }
        originalSelect.value = optionItem.hasAttribute('data-value') ? optionItem.dataset.value : optionItem.textContent;
        this.selectAction(selectItem);
      }
      this.setSelectTitleValue(selectItem, originalSelect);
      this.setSelectChange(originalSelect);
    }
  }
  selectChange(e) {
    const originalSelect = e.target;
    this.selectBuild(originalSelect);
    this.setSelectChange(originalSelect);
  }
  setSelectChange(originalSelect) {
    if (originalSelect.hasAttribute('data-validate')) {
      formValidate.validateInput(originalSelect);
    }
    if (originalSelect.hasAttribute('data-submit') && originalSelect.value) {
      let tempButton = document.createElement("button");
      tempButton.type = "submit";
      originalSelect.closest('form').append(tempButton);
      tempButton.click();
      tempButton.remove();
    }
    const selectItem = originalSelect.parentElement;
    this.selectCallback(selectItem, originalSelect);
  }
  selectDisabled(selectItem, originalSelect) {
    if (originalSelect.disabled) {
      selectItem.classList.add(this.selectClasses.classSelectDisabled);
      this.getSelectElement(selectItem, this.selectClasses.classSelectTitle).selectElement.disabled = true;
    } else {
      selectItem.classList.remove(this.selectClasses.classSelectDisabled);
      this.getSelectElement(selectItem, this.selectClasses.classSelectTitle).selectElement.disabled = false;
    }
  }
  searchActions(selectItem) {
    const originalSelect = this.getSelectElement(selectItem).originalSelect;
    const selectInput = this.getSelectElement(selectItem, this.selectClasses.classSelectInput).selectElement;
    const selectOptions = this.getSelectElement(selectItem, this.selectClasses.classSelectOptions).selectElement;
    const selectOptionsItems = selectOptions.querySelectorAll(`.${this.selectClasses.classSelectOption} `);
    const _this = this;
    selectInput.addEventListener("input", function () {
      selectOptionsItems.forEach(selectOptionsItem => {
        if (selectOptionsItem.textContent.toUpperCase().includes(selectInput.value.toUpperCase())) {
          selectOptionsItem.hidden = false;
        } else {
          selectOptionsItem.hidden = true;
        }
      });
      selectOptions.hidden === true ? _this.selectAction(selectItem) : null;
    });
  }
  selectCallback(selectItem, originalSelect) {
    document.dispatchEvent(new CustomEvent("selectCallback", {
      detail: {
        select: originalSelect
      }
    }));
  }
}
modules_flsModules.select = new SelectConstructor({});

//========================================================================================================================================================

//Солнце
const productCards = document.querySelectorAll('.left-product-card__images');
if (productCards) {
  productCards.forEach((card, index) => {
    const azimuthInputs = card.querySelectorAll(`.options-product-card .options__input[name="azimuth_${index + 1}"]`);
    const sunIcon = card.querySelector('.sun-line');

    // 1. Получаем начальный угол из атрибута style элемента
    const style = sunIcon.getAttribute('style');
    const initialRotation = parseInt(style.match(/rotate\((\d+)deg\)/)[1]);

    // 3. Рассчитываем позиции (движение по часовой стрелке)
    // Для каждого варианта (Утро/День/Вечер) используем относительное смещение
    azimuthInputs.forEach(input => {
      input.addEventListener('change', function () {
        if (this.checked) {
          const azimuth = parseInt(this.value);
          let rotationAngle;

          // Определяем, какое это время суток по значению
          if (this.nextElementSibling.textContent.trim() === 'Утро') {
            rotationAngle = initialRotation - 90; // смещаем на -90° от начального
          } else if (this.nextElementSibling.textContent.trim() === 'Вечер') {
            rotationAngle = initialRotation + 90; // смещаем на +90° от начального
          } else {
            rotationAngle = initialRotation; // оставляем как есть для Дня
          }

          sunIcon.style.transform = `rotate(${rotationAngle}deg)`;
        }
      });
    });

    const defaultInput = card.querySelector('.options-product-card .options__input[checked]');
    if (defaultInput) {
      defaultInput.dispatchEvent(new Event('change'));
    }
  });
}

let sunPosition = document.querySelectorAll('.sun-position');
if (sunPosition) {
  sunPosition.forEach(button => {
    button.addEventListener('click', function () {
      const parent = this.closest('.left-product-card');
      const optionsCard = parent.querySelector('.options-product-card');
      const sunLine = parent.querySelector('.left-product-card__sun-line');

      this.classList.toggle('_active');
      optionsCard.classList.toggle('_active');
      sunLine.classList.toggle('_active');
    });
  });
}

let optionsClose = document.querySelectorAll('.options-close');
if (optionsClose) {
  optionsClose.forEach(closeButton => {
    closeButton.addEventListener('click', function () {
      const parent = this.closest('.left-product-card');
      const optionsCard = parent.querySelector('.options-product-card');
      const sunLine = parent.querySelector('.left-product-card__sun-line');
      const sunPositionBtn = parent.querySelector('.sun-position');

      if (sunPositionBtn) sunPositionBtn.classList.remove('_active');
      if (optionsCard) optionsCard.classList.remove('_active');
      if (sunLine) sunLine.classList.remove('_active');
    });
  });
}

//========================================================================================================================================================

// Функция для анимации счетчика
function digitsCounter() {
  function digitsCountersInit(digitsCountersItems) {
    let digitsCounters = digitsCountersItems ? digitsCountersItems : document.querySelectorAll("[data-digits-counter]");
    if (digitsCounters.length) {
      digitsCounters.forEach(digitsCounter => {
        if (digitsCounter.hasAttribute('data-go')) return;
        digitsCounter.setAttribute('data-go', '');
        digitsCounter.dataset.originalValue = digitsCounter.innerHTML;
        digitsCounter.innerHTML = `0`;
        digitsCountersAnimate(digitsCounter);
      });
    }
  }

  function digitsCountersAnimate(digitsCounter) {
    let startTimestamp = null;
    const duration = parseFloat(digitsCounter.dataset.digitsCounterSpeed) ? parseFloat(digitsCounter.dataset.digitsCounterSpeed) : 1000;

    const originalValue = digitsCounter.dataset.originalValue;
    const hasDecimal = originalValue.includes(',') || originalValue.includes('.');

    const numericValue = parseFloat(originalValue.replace(',', '.'));

    const decimalPlaces = hasDecimal ?
      (originalValue.split(/[,.]/)[1] || '').length : 0;

    const startPosition = 0;

    const step = (timestamp) => {
      if (!startTimestamp) startTimestamp = timestamp;
      const progress = Math.min((timestamp - startTimestamp) / duration, 1);

      let currentValue = progress * (startPosition + numericValue);

      if (decimalPlaces > 0) {
        currentValue = parseFloat(currentValue.toFixed(decimalPlaces));
      } else {
        currentValue = Math.floor(currentValue);
      }

      digitsCounter.innerHTML = formatNumber(currentValue, decimalPlaces);

      if (progress < 1) {
        window.requestAnimationFrame(step);
      } else {
        // В конце анимации устанавливаем точное исходное значение
        digitsCounter.innerHTML = originalValue;
        digitsCounter.removeAttribute('data-go');
      }
    };
    window.requestAnimationFrame(step);
  }

  function formatNumber(value, decimalPlaces) {
    if (decimalPlaces > 0) {
      return value.toString().replace('.', ',');
    } else {
      return value.toString();
    }
  }

  function digitsCounterAction(e) {
    const entry = e.detail.entry;
    const targetElement = entry.target;
    if (targetElement.querySelectorAll("[data-digits-counter]").length) {
      digitsCountersInit(targetElement.querySelectorAll("[data-digits-counter]"));
    }
  }

  document.addEventListener("watcherCallback", digitsCounterAction);

  digitsCountersInit();
}
digitsCounter();