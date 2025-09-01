document.addEventListener('DOMContentLoaded', () => {
  // Основные элементы
  const container = document.querySelector('.block-genplan__body');
  const contentContainerStep1 = document.querySelector('.block-genplan__content-container.step1');
  const contentContainerStep2 = document.querySelector('.block-genplan__content-container.step2');
  const titleGenplan = document.querySelector('.title-genplan');
  const titleHouse = document.querySelector('.title-house');
  const chooseHouseBtn = document.querySelector('.btn-genplan'); // Кнопка "Выбрать дом" в попапе

  // Проверяем наличие основных элементов
  if (!container || !contentContainerStep1 || !contentContainerStep2 || !titleGenplan || !titleHouse) {
    console.warn('Не найдены необходимые элементы генплана');
    return;
  }

  // Текущий активный контейнер
  let currentContainer = contentContainerStep1;

  // Функция переключения между шагами
  function toggleSteps(showStep2 = false) {
    // Сначала скрываем все элементы
    contentContainerStep1.classList.remove('_active');
    contentContainerStep2.classList.remove('_active');
    titleGenplan.classList.remove('_active');
    titleHouse.classList.remove('_active');

    // Управляем классом hidden для title-genplan
    if (showStep2) {
      titleGenplan.classList.add('hidden');
    } else {
      titleGenplan.classList.remove('hidden');
    }

    // Устанавливаем небольшую задержку для плавности анимации
    setTimeout(() => {
      if (showStep2) {
        // Показываем step2
        contentContainerStep2.classList.add('_active');
        titleHouse.classList.add('_active');

        document.documentElement.classList.add('choice-home');
        currentContainer = contentContainerStep2;
      } else {
        // Показываем step1
        contentContainerStep1.classList.add('_active');
        titleGenplan.classList.add('_active');

        document.documentElement.classList.remove('choice-home');
        currentContainer = contentContainerStep1;
      }

      // Сбрасываем трансформации при переключении
      resetTransformations();
    }, 50);
  }

  // Сброс трансформаций
  function resetTransformations() {
    scale = 1;
    translateX = 0;
    translateY = 0;
    updateTransform();
  }

  // Обработчик клика на кнопку "Выбрать дом" в попапе
  if (chooseHouseBtn) {
    chooseHouseBtn.addEventListener('click', (e) => {
      e.preventDefault();
      toggleSteps(true);

      // Закрываем попап если он открыт
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

  // Параметры масштабирования и перемещения
  let scale = 1;
  const minScale = 1;
  const maxScale = 4;
  const zoomStep = 0.3;

  let isDragging = false;
  let startX, startY;
  let translateX = 0;
  let translateY = 0;

  // Touch variables
  let touchStartDistance = 0;
  let lastScale = 1;
  let touchMode = null;
  let centerX = 0;
  let centerY = 0;

  // Функция обновления трансформации
  function updateTransform() {
    currentContainer.style.transform = `translate(${translateX}px, ${translateY}px) scale(${scale})`;
  }

  // Ограничение перемещения
  function clampTranslation() {
    const maxX = (scale - 1) * container.offsetWidth / 2;
    const maxY = (scale - 1) * container.offsetHeight / 2;

    translateX = Math.max(-maxX, Math.min(maxX, translateX));
    translateY = Math.max(-maxY, Math.min(maxY, translateY));
  }

  // Масштабирование с центрированием
  function zoomToPoint(scaleFactor, clientX, clientY) {
    const newScale = Math.min(Math.max(scale * scaleFactor, minScale), maxScale);
    const zoomRatio = newScale / scale;

    // Вычисляем новые координаты с учетом точки масштабирования
    translateX = clientX - zoomRatio * (clientX - translateX);
    translateY = clientY - zoomRatio * (clientY - translateY);

    scale = newScale;
    clampTranslation();
    updateTransform();
  }

  // =============== ОБРАБОТЧИКИ МЫШИ ===============
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

  // Колесо мыши для масштабирования
  container.addEventListener('wheel', (e) => {
    e.preventDefault();
    const delta = e.deltaY > 0 ? -zoomStep : zoomStep;
    zoomToPoint(1 + delta, e.clientX, e.clientY);
  }, { passive: false });

  // =============== ОБРАБОТЧИКИ КНОПОК ЗУмА ===============
  const zoomInBtn = document.querySelector('.zoom-genplan__up');
  const zoomOutBtn = document.querySelector('.zoom-genplan__down');

  if (zoomInBtn) {
    zoomInBtn.addEventListener('click', () => {
      zoomToPoint(1 + zoomStep, container.offsetWidth / 2, container.offsetHeight / 2);
    });
  }

  if (zoomOutBtn) {
    zoomOutBtn.addEventListener('click', () => {
      zoomToPoint(1 - zoomStep, container.offsetWidth / 2, container.offsetHeight / 2);
    });
  }

  // =============== ОБРАБОТЧИКИ TOUCH ===============
  container.addEventListener('touchstart', (e) => {
    if (e.touches.length === 2) {
      // Pinch zoom
      touchMode = 'pinch';
      const dx = e.touches[0].clientX - e.touches[1].clientX;
      const dy = e.touches[0].clientY - e.touches[1].clientY;
      touchStartDistance = Math.sqrt(dx * dx + dy * dy);
      lastScale = scale;

      centerX = (e.touches[0].clientX + e.touches[1].clientX) / 2;
      centerY = (e.touches[0].clientY + e.touches[1].clientY) / 2;
    } else if (e.touches.length === 1 && scale > minScale) {
      // Pan
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

        // Обновляем центр для следующего движения
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

  // =============== ПОЛНОЭКРАННЫЙ РЕЖИМ ===============
  const fullscreenBtn = document.querySelector('.fullsreen-genplan__button');
  const fullscreenHint = document.querySelector('.fullsreen-genplan-hint');
  const fullscreenContainer = document.querySelector('[data-fullscreen-container]');

  if (fullscreenBtn && fullscreenHint && fullscreenContainer) {
    let hintTimeout = null;

    // Функция для скрытия подсказки
    function hideHint() {
      fullscreenHint.classList.remove('fullscreen-hint_active');
      if (hintTimeout) {
        clearTimeout(hintTimeout);
        hintTimeout = null;
      }
    }

    // Обработчик клика на саму подсказку - скрываем сразу
    fullscreenHint.addEventListener('click', (e) => {
      e.stopPropagation();
      hideHint();
    });

    fullscreenBtn.addEventListener('click', async () => {
      if (!document.fullscreenElement) {
        try {
          await fullscreenContainer.requestFullscreen();

          fullscreenHint.classList.add('fullscreen-hint_active');

          if (hintTimeout) clearTimeout(hintTimeout);
          hintTimeout = setTimeout(() => {
            hideHint();
          }, 3000); // 3 секунды
        } catch (err) {
          console.warn('Ошибка полноэкранного режима:', err);
        }
      } else {
        try {
          await document.exitFullscreen();
        } catch (err) {
          console.warn('Ошибка выхода из полноэкранного режима:', err);
        }
      }
    });

    // Скрываем подсказку при выходе из полноэкранного режима
    document.addEventListener('fullscreenchange', () => {
      if (!document.fullscreenElement && fullscreenHint) {
        hideHint();
      }
    });

    // Также скрываем подсказку при клике в любом другом месте
    document.addEventListener('click', (e) => {
      if (fullscreenHint.classList.contains('fullscreen-hint_active') &&
        !e.target.closest('.fullsreen-genplan-hint') &&
        !e.target.closest('.fullsreen-genplan__button')) {
        hideHint();
      }
    });
  }

  // =============== УПРАВЛЕНИЕ ПОПАПАМИ ===============
  function togglePopup(id) {
    const targetPopup = document.querySelector(`.block-genplan-popup[data-id-popup="${id}"]`);
    if (!targetPopup) return;

    const activePopup = document.querySelector('.block-genplan-popup._active');
    const wasActive = targetPopup === activePopup;
    const isMobile = window.innerWidth <= 768;

    // Закрываем все попапы
    document.querySelectorAll('.block-genplan-popup._active').forEach(popup => {
      popup.classList.remove('_active');
    });

    // Убираем активные классы с элементов
    document.querySelectorAll('.block-genplan__path._active, .block-genplan__tippy._active').forEach(el => {
      el.classList.remove('_active');
    });

    // Если кликнули на уже активный попап - просто закрываем
    if (wasActive) {
      document.documentElement.classList.remove('popup-open');
      return;
    }

    // Открываем целевой попап
    targetPopup.classList.add('_active');

    // Активируем соответствующие элементы
    const path = document.querySelector(`.block-genplan__path[data-id="${id}"]`);
    const tippy = document.querySelector(`.block-genplan__tippy[data-id="${id}"]`);

    if (path) path.classList.add('_active');
    if (tippy) tippy.classList.add('_active');

    document.documentElement.classList.add('popup-open');
  }

  // Обработчики кликов на элементы генплана
  container.addEventListener('click', (e) => {
    let id = null;

    // Клик на path
    if (e.target.classList.contains('block-genplan__path')) {
      id = e.target.getAttribute('data-id');
    }
    // Клик на tippy button
    else if (e.target.closest('.block-genplan__tippy')) {
      const button = e.target.closest('.block-genplan__tippy');
      id = button.getAttribute('data-id');
    }

    if (id) {
      e.preventDefault();
      e.stopPropagation();
      togglePopup(id);
    }
  });

  // Закрытие попапов
  document.querySelectorAll('.block-genplan-popup__close').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const popup = btn.closest('.block-genplan-popup');
      if (popup) {
        const id = popup.getAttribute('data-id-popup');

        popup.classList.remove('_active');
        document.documentElement.classList.remove('popup-open');

        // Убираем активные классы
        document.querySelectorAll(`[data-id="${id}"]._active`).forEach(el => {
          el.classList.remove('_active');
        });
      }
    });
  });

  // Закрытие по клику вне попапа
  document.addEventListener('click', (e) => {
    const activePopup = document.querySelector('.block-genplan-popup._active');
    if (!activePopup) return;

    const isClickInsidePopup = activePopup.contains(e.target);
    const isClickOnTippy = e.target.closest('.block-genplan__tippy');
    const isClickOnPath = e.target.classList.contains('block-genplan__path');

    if (!isClickInsidePopup && !isClickOnTippy && !isClickOnPath) {
      const id = activePopup.getAttribute('data-id-popup');

      activePopup.classList.remove('_active');
      document.documentElement.classList.remove('popup-open');

      document.querySelectorAll(`[data-id="${id}"]._active`).forEach(el => {
        el.classList.remove('_active');
      });
    }
  });

  // Инициализация
  updateTransform();

  // Адаптация к изменению размера окна
  window.addEventListener('resize', () => {
    clampTranslation();
    updateTransform();
  });
});
