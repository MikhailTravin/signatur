//Ползунок
function rangeInit() {
  const ratingCalc = document.querySelector('.filter-apartments__range');

  if (ratingCalc) {

    const rangeStart = Number(ratingCalc.dataset.start);
    const rangeMin = Number(ratingCalc.dataset.min);
    const rangeMax = Number(ratingCalc.dataset.max);

    noUiSlider.create(ratingCalc, {
      start: rangeStart || 23.0, // начальное значение
      connect: 'lower',
      range: {
        'min': rangeMin || 6.7,
        'max': rangeMax || 22.0
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
    speed: 600,
    loop: true,
    navigation: {
      prevEl: '.block-intro__arrow-prev',
      nextEl: '.block-intro__arrow-next',
    },
    autoplay: {
      delay: 3000,
      disableOnInteraction: false,
    },
    on: {
      init: function () {
        const totalCycleTime = this.params.autoplay.delay + this.params.speed;
        updateArrowAnimationDuration(totalCycleTime);
      },
      autoplayStart: function () {
        startArrowAnimation();
      },
      autoplayStop: function () {
        stopArrowAnimation();
      }
    },
  });

  function updateArrowAnimationDuration(totalCycleTime) {
    const arrowNext = document.querySelector('.arrow-next');
    if (arrowNext) {
      arrowNext.style.setProperty('--animation-duration', `${totalCycleTime}ms`);

      const style = document.createElement('style');
      style.textContent = `
        .arrow-next::before {
          animation-duration: var(--animation-duration, 3600ms) !important;
          animation-timing-function: linear !important;
        }
        
        /* Делаем анимацию с паузой */
        @keyframes loadingSpinnerWithPause {
          0% {
            transform: rotate(0deg);
            border-top-color: #fff;
            border-right-color: transparent;
            border-bottom-color: transparent;
            border-left-color: transparent;
          }
          /* Анимация перехода (600ms) - 16.67% от 3600ms */
          16.67% {
            transform: rotate(90deg);
            border-top-color: #fff;
            border-right-color: #fff;
            border-bottom-color: transparent;
            border-left-color: transparent;
          }
          33.33% {
            transform: rotate(180deg);
            border-top-color: #fff;
            border-right-color: #fff;
            border-bottom-color: #fff;
            border-left-color: transparent;
          }
          50% {
            transform: rotate(270deg);
            border-top-color: #fff;
            border-right-color: #fff;
            border-bottom-color: #fff;
            border-left-color: #fff;
          }
          66.67% {
            transform: rotate(360deg);
            border-top-color: #fff;
            border-right-color: #fff;
            border-bottom-color: #fff;
            border-left-color: #fff;
          }
          /* Пауза (3000ms) - 83.33% от 3600ms */
          100% {
            transform: rotate(360deg);
            border-top-color: #fff;
            border-right-color: #fff;
            border-bottom-color: #fff;
            border-left-color: #fff;
          }
        }
        
        /* Альтернативный вариант: плавная анимация без паузы */
        @keyframes loadingSpinnerContinuous {
          0% {
            transform: rotate(0deg);
          }
          100% {
            transform: rotate(360deg);
          }
        }
      `;
      document.head.appendChild(style);
    }
  }

  function startArrowAnimation() {
    const arrowNext = document.querySelector('.arrow-next');
    if (arrowNext) {
      arrowNext.classList.add('loading');
    }
  }

  function stopArrowAnimation() {
    const arrowNext = document.querySelector('.arrow-next');
    if (arrowNext) {
      arrowNext.classList.remove('loading');
    }
  }
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
positionArrows();
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
const videoContainers = document.querySelectorAll('.video');
const buttons = document.querySelectorAll('.sound');

if (videoContainers.length) {
  const allVideoElements = document.querySelectorAll('.video-pc, .video-mob');

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      const videos = entry.target.querySelectorAll('video');

      if (entry.isIntersecting) {
        videos.forEach(video => {
          video.play().catch(e => console.warn("Автовоспроизведение заблокировано:", e));
        });
      } else {
        videos.forEach(video => {
          video.pause();
        });
      }
    });
  }, {
    threshold: 0.5
  });

  videoContainers.forEach(container => {
    observer.observe(container);
  });

  buttons.forEach((button, index) => {
    button.addEventListener('click', function () {
      const videoContainer = videoContainers[index];

      if (videoContainer) {
        const videos = videoContainer.querySelectorAll('video');

        if (videos.length) {
          const isCurrentlyMuted = videos[0].muted;

          videos.forEach(video => {
            video.muted = !isCurrentlyMuted;
          });

          if (isCurrentlyMuted) {
            button.classList.add("_active");
          } else {
            button.classList.remove("_active");
          }
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

    if (!sunIcon) return;

    const style = sunIcon.getAttribute('style');
    if (!style) return;

    const rotationMatch = style.match(/rotate\((\d+)deg\)/);
    if (!rotationMatch) return;

    const initialRotation = parseInt(rotationMatch[1]);

    azimuthInputs.forEach(input => {
      input.addEventListener('change', function () {
        if (this.checked) {
          const nextElement = this.nextElementSibling;
          const labelText = nextElement ? nextElement.textContent.trim() : '';
          let rotationAngle;

          if (labelText === 'Утро') {
            rotationAngle = initialRotation - 90;
          } else if (labelText === 'Вечер') {
            rotationAngle = initialRotation + 90;
          } else {
            rotationAngle = initialRotation;
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
      if (!parent) return;

      const optionsCard = parent.querySelector('.options-product-card');
      const sunLine = parent.querySelector('.left-product-card__sun-line');

      this.classList.toggle('_active');
      if (optionsCard) optionsCard.classList.toggle('_active');
      if (sunLine) sunLine.classList.toggle('_active');
    });
  });
}

let optionsClose = document.querySelectorAll('.options-close');
if (optionsClose) {
  optionsClose.forEach(closeButton => {
    closeButton.addEventListener('click', function () {
      const parent = this.closest('.left-product-card');
      if (!parent) return;

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
  const VISIBLE_THRESHOLD = 0.5;

  function digitsCountersInit(digitsCountersItems) {
    let digitsCounters = digitsCountersItems ? digitsCountersItems : document.querySelectorAll("[data-digits-counter]");
    if (digitsCounters.length) {
      digitsCounters.forEach(digitsCounter => {
        if (digitsCounter.hasAttribute('data-go')) return;

        const element = digitsCounter.closest('[data-watch]') || digitsCounter;
        if (!isElementVisible(element, VISIBLE_THRESHOLD)) {
          return;
        }

        startCounterAnimation(digitsCounter);
      });
    }
  }

  function isElementVisible(element, threshold = 0.5) {
    const rect = element.getBoundingClientRect();
    const windowHeight = window.innerHeight || document.documentElement.clientHeight;

    const visibleHeight = Math.min(rect.bottom, windowHeight) - Math.max(rect.top, 0);
    const elementHeight = rect.height;

    if (elementHeight === 0) return false;

    const visibleRatio = visibleHeight / elementHeight;

    return visibleRatio >= threshold && rect.top < windowHeight && rect.bottom > 0;
  }

  function startCounterAnimation(digitsCounter) {
    digitsCounter.setAttribute('data-go', '');
    digitsCounter.dataset.originalValue = digitsCounter.innerHTML;
    digitsCounter.innerHTML = `0`;
    digitsCountersAnimate(digitsCounter);
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
        digitsCounter.innerHTML = originalValue;
        digitsCounter.removeAttribute('data-go');
      }
    };
    window.requestAnimationFrame(step);
  }

  function formatNumber(value, decimalPlaces) {
    if (decimalPlaces > 0) {
      return value.toFixed(decimalPlaces).replace('.', ',');
    } else {
      return Math.floor(value).toString();
    }
  }

  function digitsCounterAction(e) {
    const entry = e.detail.entry;
    const targetElement = entry.target;

    if (entry.isIntersecting && entry.intersectionRatio >= VISIBLE_THRESHOLD) {
      if (targetElement.querySelectorAll("[data-digits-counter]").length) {
        digitsCountersInit(targetElement.querySelectorAll("[data-digits-counter]"));
      }
    }
  }

  function initIntersectionObserver() {
    const counters = document.querySelectorAll("[data-digits-counter]");

    if ('IntersectionObserver' in window) {
      const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting && entry.intersectionRatio >= VISIBLE_THRESHOLD) {
            const counter = entry.target;
            if (!counter.hasAttribute('data-go')) {
              startCounterAnimation(counter);
            }
          }
        });
      }, {
        threshold: VISIBLE_THRESHOLD
      });

      counters.forEach(counter => {
        observer.observe(counter);
      });
    } else {
      digitsCountersInit();
    }
  }

  document.addEventListener("watcherCallback", digitsCounterAction);

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initIntersectionObserver);
  } else {
    initIntersectionObserver();
  }

  setTimeout(() => {
    digitsCountersInit();
  }, 100);
}

digitsCounter();

//========================================================================================================================================================

const headerIcon = document.querySelector('.header__icon');

if (headerIcon) {
  headerIcon?.addEventListener('click', function () {
    document.documentElement.classList.toggle('menu-open');
  });

  document.addEventListener('click', function (e) {
    if (!e.target.closest('.header__item') && !e.target.closest('.header__icon')) {
      document.documentElement.classList.remove('menu-open');
    }
  });
}

//========================================================================================================================================================

let widgetClose = document.querySelector('.widget__close');
if (widgetClose) {
  widgetClose.addEventListener('click', function (event) {
    event.stopPropagation();
    this.closest('.widget').classList.add('hidden');
  });
}

