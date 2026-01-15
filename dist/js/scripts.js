//Ползунок
rangeInit();
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

  // Слайдер 1: Стоимость недвижимости
  const ratingCalc2 = document.querySelector('.filter-apartments__range1');
  if (ratingCalc2) {
    const priceInput = document.querySelector('#property-price-input');

    noUiSlider.create(ratingCalc2, {
      start: 3665000,
      connect: 'lower',
      range: {
        'min': 1000000,
        'max': 10000000
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

    ratingCalc2.noUiSlider.on('update', function (values, handle) {
      const value = Math.round(values[handle]);
      priceInput.value = value.toLocaleString('ru-RU');
      updateCalc();
    });

    priceInput.addEventListener('input', function () {
      let value = parseInt(this.value.replace(/\s+/g, '')) || 1000000;

      if (value < 1000000) value = 1000000;
      if (value > 10000000) value = 10000000;

      ratingCalc2.noUiSlider.set(value);
      this.value = value.toLocaleString('ru-RU');
      updateCalc();
    });
  }

  // Слайдер 2: Первоначальный взнос
  const ratingCalc3 = document.querySelector('.filter-apartments__range2');
  const priceInput2 = document.querySelector('#down-payment-input');
  const buttons2 = document.querySelectorAll('.range2 .filter-apartments__button');

  if (ratingCalc3 && priceInput2) {
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
      updateCalc();

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
      updateCalc();
    });

    buttons2.forEach(button => {
      button.addEventListener('click', function () {
        const percentage = parseInt(this.getAttribute('data-number'));
        ratingCalc3.noUiSlider.set(percentage);
        priceInput2.value = percentage;

        buttons2.forEach(btn => btn.classList.remove('active'));
        this.classList.add('active');

        updateCalc();
      });
    });
  }

  // Слайдер 3: Срок кредита
  const ratingCalc4 = document.querySelector('.filter-apartments__range3');
  const priceInput3 = document.querySelector('#loan-term-input');
  const buttons3 = document.querySelectorAll('.range3 .filter-apartments__button');

  if (ratingCalc4 && priceInput3) {
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
      updateCalc();

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
      updateCalc();
    });

    buttons3.forEach(button => {
      button.addEventListener('click', function () {
        const years = parseInt(this.getAttribute('data-number'));
        ratingCalc4.noUiSlider.set(years);
        priceInput3.value = years;

        buttons3.forEach(btn => btn.classList.remove('active'));
        this.classList.add('active');

        updateCalc();
      });
    });
  }

  // Слайдер 4: Процентная ставка
  const ratingCalc5 = document.querySelector('.filter-apartments__range4');
  const priceInput4 = document.querySelector('#interest-rate-input');
  const buttons4 = document.querySelectorAll('.range4 .filter-apartments__button');

  if (ratingCalc5 && priceInput4) {
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
      priceInput4.value = value.replace('.', ',');
      updateCalc();

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
      this.value = value.toFixed(1).replace('.', ',');
      updateCalc();
    });

    buttons4.forEach(button => {
      button.addEventListener('click', function () {
        const rate = parseFloat(this.getAttribute('data-number'));
        ratingCalc5.noUiSlider.set(rate);
        priceInput4.value = rate.toFixed(1).replace('.', ',');

        buttons4.forEach(btn => btn.classList.remove('active'));
        this.classList.add('active');

        updateCalc();
      });
    });
  }

  updateCalc();
}

// Калькулятор
function updateCalc() {
  const propertyCostInput = document.querySelector('#property-price-input');
  const loanTermInput = document.querySelector('#loan-term-input');
  const interestRateInput = document.querySelector('#interest-rate-input');
  const downPaymentInput = document.querySelector('#down-payment-input');

  if (propertyCostInput && loanTermInput && interestRateInput && downPaymentInput) {
    let propertyCostStr = propertyCostInput.value;
    let loanTermYears = parseFloat(loanTermInput.value);
    let interestRate = parseFloat(interestRateInput.value.replace(',', '.'));
    let initialPaymentPercent = parseFloat(downPaymentInput.value);

    let monthlyPayment = document.querySelector('#monthly-payment');
    let loanAmount = document.querySelector('#loan-amount');
    let requiredIncome = document.querySelector('#required-income');

    try {
      let val = calculateMortgagePayment(
        propertyCostStr,
        loanTermYears,
        interestRate,
        initialPaymentPercent
      );

      monthlyPayment.innerHTML = val.monthlyPayment + ' ₽';
      loanAmount.innerHTML = val.loanAmount + ' ₽';
      requiredIncome.innerHTML = val.requiredIncome + ' ₽';
    } catch (error) {
      console.error('Ошибка расчета:', error);
    }
  }
}

function calculateMortgagePayment(
  propertyCostStr,      // строка вида "3 665 000"
  loanTermYears,        // срок кредита в годах
  interestRate,         // годовая процентная ставка (%)
  initialPaymentPercent // первоначальный взнос в процентах
) {
  // Преобразуем стоимость недвижимости в число
  const propertyCost = parseFloat(propertyCostStr.replace(/\s+/g, ''));

  // Проверки
  if (isNaN(propertyCost) || propertyCost <= 0) {
    throw new Error("Некорректно указана стоимость недвижимости.");
  }

  if (initialPaymentPercent <= 0 || initialPaymentPercent >= 100) {
    throw new Error("Первоначальный взнос должен быть больше 0% и меньше 100%");
  }

  if (isNaN(loanTermYears) || loanTermYears <= 0) {
    throw new Error("Некорректный срок кредита");
  }

  if (isNaN(interestRate) || interestRate <= 0) {
    throw new Error("Некорректная процентная ставка");
  }

  // Рассчитываем сумму первоначального взноса
  const initialPaymentAmount = propertyCost * (initialPaymentPercent / 100);

  // Сумма кредита
  const loanAmount = propertyCost - initialPaymentAmount;

  if (loanAmount <= 0) {
    throw new Error("Первоначальный взнос не может быть больше стоимости недвижимости");
  }

  // Месячная процентная ставка
  const monthlyRate = interestRate / 100 / 12;

  // Количество месяцев
  const numberOfPayments = loanTermYears * 12;

  // Расчёт аннуитетного платежа
  const payment =
    loanAmount *
    (monthlyRate * Math.pow(1 + monthlyRate, numberOfPayments)) /
    (Math.pow(1 + monthlyRate, numberOfPayments) - 1);

  // Необходимый доход (предположим, что платёж составляет 40% от дохода)
  const requiredIncome = payment / 0.4;

  return {
    loanAmount: new Intl.NumberFormat("ru-RU").format(Math.round(loanAmount)),
    monthlyPayment: new Intl.NumberFormat("ru-RU").format(Math.round(payment)),
    requiredIncome: new Intl.NumberFormat("ru-RU").format(Math.round(requiredIncome)),
    initialPayment: new Intl.NumberFormat("ru-RU").format(Math.round(initialPaymentAmount))
  };
}

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