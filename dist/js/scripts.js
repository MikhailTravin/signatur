document.addEventListener('DOMContentLoaded', () => {
  const genplanBlocks = document.querySelectorAll('.block-genplan');

  genplanBlocks.forEach(block => {
    // Настройки
    const MIN_SCALE = 0.5;
    const MAX_SCALE = 5;
    const ZOOM_STEP = 0.5;        // Шаг изменения масштаба
    const HINT_DURATION = 3;      // Время показа подсказки в секундах

    // Элементы
    const container = block.querySelector('.block-genplan__body');
    const fullscreenContainer = block.querySelector('.block-genplan__content');
    const image = container.querySelector('img');
    const zoomInBtn = block.querySelector('.zoom-genplan__up');
    const zoomOutBtn = block.querySelector('.zoom-genplan__down');
    const fullscreenBtn = block.querySelector('.fullsreen-genplan__button');

    // Проверка на наличие элементов
    if (!container || !image || !fullscreenContainer) return;

    // Переменные состояния
    let scale = 1;
    let offsetX = 0;
    let offsetY = 0;
    let isDragging = false;
    let startX = 0;
    let startY = 0;

    // === Обновление позиции и масштаба изображения ===
    function updateImage() {
      const containerRect = container.getBoundingClientRect();
      const containerWidth = containerRect.width;
      const containerHeight = containerRect.height;

      const imageWidth = image.naturalWidth * scale;
      const imageHeight = image.naturalHeight * scale;

      let targetOffsetX = offsetX;
      let targetOffsetY = offsetY;

      // Горизонтальное: центрировать или ограничить
      if (imageWidth <= containerWidth) {
        targetOffsetX = (containerWidth - imageWidth) / 2;
      } else {
        const minX = containerWidth - imageWidth;
        const maxX = 0;
        targetOffsetX = Math.max(minX, Math.min(offsetX, maxX));
      }

      // Вертикальное: центрировать или ограничить
      if (imageHeight <= containerHeight) {
        targetOffsetY = (containerHeight - imageHeight) / 2;
      } else {
        const minY = containerHeight - imageHeight;
        const maxY = 0;
        targetOffsetY = Math.max(minY, Math.min(offsetY, maxY));
      }

      offsetX = targetOffsetX;
      offsetY = targetOffsetY;

      // Применяем трансформацию
      image.style.transform = `translate(${offsetX}px, ${offsetY}px) scale(${scale})`;
    }

    // === Зум с фокусом в точке (аддитивный) ===
    function zoomAtPoint(delta, clientX, clientY) {
      const rect = container.getBoundingClientRect();
      const containerX = clientX - rect.left;
      const containerY = clientY - rect.top;

      const newScale = scale + delta;

      if (newScale < MIN_SCALE || newScale > MAX_SCALE) return;

      const prevScale = scale;
      scale = newScale;

      // Коррекция смещения: зум "в точку"
      offsetX -= (containerX - offsetX) * (scale / prevScale - 1);
      offsetY -= (containerY - offsetY) * (scale / prevScale - 1);

      updateImage();
    }

    // === Обработчики событий ===

    // Колесо мыши
    container.addEventListener('wheel', e => {
      e.preventDefault();
      const delta = e.deltaY < 0 ? ZOOM_STEP : -ZOOM_STEP;
      zoomAtPoint(delta, e.clientX, e.clientY);
    }, { passive: false });

    // Кнопка увеличения
    zoomInBtn?.addEventListener('click', () => {
      const rect = container.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;
      zoomAtPoint(ZOOM_STEP, centerX, centerY);
    });

    // Кнопка уменьшения
    zoomOutBtn?.addEventListener('click', () => {
      const rect = container.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;
      zoomAtPoint(-ZOOM_STEP, centerX, centerY);
    });

    // Начало перетаскивания
    container.addEventListener('mousedown', e => {
      isDragging = true;
      startX = e.clientX - offsetX;
      startY = e.clientY - offsetY;
      container.classList.add('dragging');
      e.preventDefault();
    });

    // Движение мыши
    document.addEventListener('mousemove', e => {
      if (!isDragging) return;
      offsetX = e.clientX - startX;
      offsetY = e.clientY - startY;
      updateImage();
    });

    // Отпускание кнопки
    document.addEventListener('mouseup', () => {
      if (isDragging) {
        isDragging = false;
        container.classList.remove('dragging');
      }
    });

    // Выход мыши за пределы
    document.addEventListener('mouseleave', () => {
      if (isDragging) {
        isDragging = false;
        container.classList.remove('dragging');
      }
    });
    let hint = document.querySelector('.fullsreen-genplan-hint');
    // === Полноэкранный режим ===
    fullscreenBtn?.addEventListener('click', () => {
      if (!document.fullscreenElement) {
        fullscreenContainer.requestFullscreen?.().catch(err => {
          console.error('Ошибка входа в полноэкранный режим:', err);
        });

        // Показываем подсказку
        setTimeout(() => {
          hint.classList.add('fullscreen-hint_active');

          // Автоматическое скрытие
          setTimeout(() => {
            hint.classList.remove('fullscreen-hint_active');
          }, HINT_DURATION * 1000);
        }, 100);
      } else {
        document.exitFullscreen?.();
        hint.classList.remove('fullscreen-hint_active');
      }
    });

    // Скрытие подсказки при клике или касании
    container.addEventListener('click', () => {
      if (hint.classList.contains('fullscreen-hint_active')) {
        hint.classList.remove('fullscreen-hint_active');
      }
    });

    container.addEventListener('touchstart', e => {
      if (hint.classList.contains('fullscreen-hint_active')) {
        hint.classList.remove('fullscreen-hint_active');
      }
      e.preventDefault(); // предотвращаем прокрутку
    });

    // Обновление при изменении полноэкранного режима
    document.addEventListener('fullscreenchange', () => {
      setTimeout(updateImage, 100);
    });

    // Инициализация при загрузке изображения
    if (image.complete && image.naturalWidth > 0) {
      updateImage();
    } else {
      image.onload = () => {
        updateImage();
      };
    }

    // Финальная инициализация
    updateImage();
  });
});