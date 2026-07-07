(() => {
  'use strict';

  const WHATSAPP_NUMBER = '5521983006641';
  const PAGE_TYPE = 'landing';

  const CONTEXTS = {
    visto: {
      headline: 'Visto americano, passaporte e orientação documental privada.',
      subheadline: 'Atendimento direto com André Fernandes para reduzir erros, trazer clareza ao processo e ajudar você a avançar com mais segurança.',
      chip: 'Assessoria documental privada',
      secondaryCta: 'Ver serviços de Visto',
      icon: '#icon-plane',
      whatsappMessage: 'Olá, André. Vim pelo site e preciso de orientação sobre visto ou passaporte.',
      quiz: {
        question1: 'O que você precisa?',
        options1: [
          { value: 'visto_americano', label: 'Visto americano' },
          { value: 'passaporte', label: 'Passaporte' },
          { value: 'outro', label: 'Outro' }
        ],
        question2: 'Qual é o objetivo?',
        options2: [
          { value: 'turismo', label: 'Turismo' },
          { value: 'estudo', label: 'Estudo' },
          { value: 'trabalho', label: 'Trabalho' },
          { value: 'outro', label: 'Outro' }
        ],
        buildMessage: (answer1, answer2) => `Olá, André. Vim pelo site e preciso de orientação sobre ${answer1}. Meu objetivo é ${answer2}.`
      }
    },
    veicular: {
      headline: 'Documentação veicular, transferência e regularização sem complicação.',
      subheadline: 'Atendimento direto para quem precisa comprar, vender, transferir ou regularizar documentos do veículo com mais segurança.',
      chip: 'Suporte documental veicular',
      secondaryCta: 'Ver serviços veiculares',
      icon: '#icon-car',
      whatsappMessage: 'Olá, André. Vim pelo site e preciso de ajuda com documentação veicular.',
      quiz: {
        question1: 'O que você precisa resolver?',
        options1: [
          { value: 'transferencia', label: 'Transferência' },
          { value: 'regularizacao', label: 'Regularização' },
          { value: 'compra_e_venda', label: 'Compra e venda' },
          { value: 'outro', label: 'Outro' }
        ],
        question2: 'Qual é a situação?',
        options2: [
          { value: 'ja_iniciei', label: 'Já iniciei' },
          { value: 'ainda_nao_iniciei', label: 'Ainda não iniciei' },
          { value: 'tenho_duvidas', label: 'Tenho dúvidas' }
        ],
        buildMessage: (answer1, answer2) => `Olá, André. Vim pelo site e preciso de ajuda com ${answer1}. Situação: ${answer2}.`
      }
    }
  };

  const SERVICE_LABELS = {
    visto_americano: 'visto americano',
    passaporte: 'passaporte',
    orientacao_documental: 'orientação documental',
    transferencia_de_veiculo: 'transferência de veículo',
    regularizacao: 'regularização',
    compra_e_venda: 'compra e venda'
  };

  window.dataLayer = window.dataLayer || [];

  function trackEvent(eventName, eventParams = {}) {
    const cleanParams = Object.fromEntries(
      Object.entries(eventParams).filter(([, value]) => value !== undefined && value !== null && value !== '')
    );

    window.dataLayer.push({
      event: eventName,
      page_type: PAGE_TYPE,
      ...cleanParams
    });
  }

  function buildWhatsAppUrl(message) {
    return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
  }

  window.trackEvent = trackEvent;
  window.buildWhatsAppUrl = buildWhatsAppUrl;

  const state = {
    context: 'visto',
    quizAnswers: {},
    quizStarted: false
  };
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  let contextTransitionTimer;
  const carouselControllers = [];

  const elements = {
    tabs: [...document.querySelectorAll('[role="tab"][data-context]')],
    heroPanel: document.querySelector('#hero-panel'),
    headline: document.querySelector('[data-dynamic="headline"]'),
    subheadline: document.querySelector('[data-dynamic="subheadline"]'),
    chip: document.querySelector('[data-dynamic="chip"]'),
    secondaryCta: document.querySelector('[data-dynamic="secondary-cta"]'),
    dynamicIcon: document.querySelector('.dynamic-icon use'),
    serviceGroups: [...document.querySelectorAll('[data-service-group]')],
    servicesPanel: document.querySelector('#services-panel'),
    otherContextLink: document.querySelector('[data-other-context]'),
    quizForm: document.querySelector('#quiz-form'),
    quizSubmit: document.querySelector('#quiz-submit'),
    contextDecorations: [...document.querySelectorAll('[data-context-decoration]')],
    floatingActions: document.querySelector('.floating-actions'),
    siteHeader: document.querySelector('.site-header')
  };

  function getInitialContext() {
    const urlContext = new URLSearchParams(window.location.search).get('servico');
    if (urlContext && CONTEXTS[urlContext]) return urlContext;

    try {
      const storedContext = window.sessionStorage.getItem('service_context');
      if (storedContext && CONTEXTS[storedContext]) return storedContext;
    } catch (error) {
      // Storage pode estar bloqueado; a experiência segue normalmente.
    }

    return 'visto';
  }

  function updateStandardWhatsAppLinks() {
    const url = buildWhatsAppUrl(CONTEXTS[state.context].whatsappMessage);
    document.querySelectorAll('.js-whatsapp').forEach((link) => {
      link.href = url;
      link.dataset.serviceType = state.context;
    });
  }

  function updateServicePriority() {
    elements.serviceGroups.forEach((group) => {
      const isPrimary = group.dataset.serviceGroup === state.context;
      group.classList.toggle('is-primary', isPrimary);
      group.classList.toggle('is-secondary', !isPrimary);
      group.hidden = !isPrimary;
      group.setAttribute('aria-hidden', String(!isPrimary));
      const label = group.querySelector('.group-title span');
      if (label) label.textContent = 'Em destaque';
    });

    const otherContext = state.context === 'visto' ? 'veicular' : 'visto';
    const otherLabel = otherContext === 'veicular'
      ? 'Também atendemos documentação veicular'
      : 'Também atendemos visto e passaporte';
    const otherIcon = otherContext === 'veicular' ? '#icon-car' : '#icon-plane';

    elements.otherContextLink.dataset.otherContext = otherContext;
    elements.otherContextLink.querySelector('span').textContent = otherLabel;
    elements.otherContextLink.querySelector('use').setAttribute('href', otherIcon);
  }

  function renderQuiz() {
    const quiz = CONTEXTS[state.context].quiz;
    state.quizAnswers = {};
    state.quizStarted = false;

    const question1 = elements.quizForm.querySelector('[data-quiz="question-1"]');
    const question2 = elements.quizForm.querySelector('[data-quiz="question-2"]');
    const options1 = elements.quizForm.querySelector('[data-quiz="options-1"]');
    const options2 = elements.quizForm.querySelector('[data-quiz="options-2"]');

    question1.textContent = quiz.question1;
    question2.textContent = quiz.question2;
    options1.replaceChildren(...createQuizOptions(quiz.options1, 1));
    options2.replaceChildren(...createQuizOptions(quiz.options2, 2));

    const status = elements.quizForm.querySelector('[data-quiz="status"]');
    status.textContent = 'Selecione uma opção em cada etapa.';
    elements.quizSubmit.classList.add('is-disabled');
    elements.quizSubmit.setAttribute('aria-disabled', 'true');
    elements.quizSubmit.href = buildWhatsAppUrl(CONTEXTS[state.context].whatsappMessage);
  }

  function createQuizOptions(options, step) {
    return options.map((option) => {
      const button = document.createElement('button');
      button.type = 'button';
      button.className = 'quiz-option';
      button.dataset.step = String(step);
      button.dataset.value = option.value;
      button.dataset.label = option.label;
      button.setAttribute('aria-pressed', 'false');
      button.textContent = option.label;
      return button;
    });
  }

  function applyContext(context, { track = true, updateUrl = true } = {}) {
    if (!CONTEXTS[context]) return;
    state.context = context;
    const config = CONTEXTS[context];

    document.body.dataset.theme = context;
    elements.headline.textContent = config.headline;
    elements.subheadline.textContent = config.subheadline;
    elements.chip.textContent = config.chip;
    elements.secondaryCta.textContent = config.secondaryCta;
    elements.dynamicIcon.setAttribute('href', config.icon);
    elements.contextDecorations.forEach((icon) => icon.setAttribute('href', config.icon));

    elements.tabs.forEach((tab) => {
      const isActive = tab.dataset.context === context;
      tab.classList.toggle('is-active', isActive);
      tab.setAttribute('aria-selected', String(isActive));
      tab.tabIndex = isActive ? 0 : -1;
    });
    elements.heroPanel.setAttribute('aria-labelledby', `tab-${context}`);
    elements.servicesPanel.setAttribute('aria-labelledby', `services-tab-${context}`);
    elements.quizForm.setAttribute('aria-labelledby', `quiz-tab-${context}`);

    updateServicePriority();
    updateStandardWhatsAppLinks();
    renderQuiz();
    window.requestAnimationFrame(refreshCarousels);

    try {
      window.sessionStorage.setItem('service_context', context);
    } catch (error) {
      // Falha de storage não bloqueia o switch.
    }

    if (updateUrl) {
      const url = new URL(window.location.href);
      url.searchParams.set('servico', context);
      window.history.replaceState({}, '', url);
    }

    if (track) {
      trackEvent(`switch_${context}`, { service_type: context });
    }
  }

  function setContext(context, options = {}) {
    if (!CONTEXTS[context]) return;
    const isInitialSetup = options.track === false;
    if (!isInitialSetup && context === state.context) return;

    const contentBlocks = document.querySelectorAll('.context-content');
    if (isInitialSetup || reduceMotion) {
      applyContext(context, options);
      return;
    }

    window.clearTimeout(contextTransitionTimer);
    contentBlocks.forEach((block) => block.classList.add('is-switching'));
    contextTransitionTimer = window.setTimeout(() => {
      applyContext(context, options);
      window.requestAnimationFrame(() => {
        contentBlocks.forEach((block) => block.classList.remove('is-switching'));
      });
    }, 140);
  }

  elements.tabs.forEach((tab) => {
    tab.addEventListener('click', () => setContext(tab.dataset.context));
    tab.addEventListener('keydown', (event) => {
      const keys = ['ArrowLeft', 'ArrowRight', 'Home', 'End'];
      if (!keys.includes(event.key)) return;
      event.preventDefault();

      const localTabs = [...tab.closest('[role="tablist"]').querySelectorAll('[role="tab"][data-context]')];
      const index = localTabs.indexOf(tab);

      let targetIndex = index;
      if (event.key === 'ArrowRight') targetIndex = (index + 1) % localTabs.length;
      if (event.key === 'ArrowLeft') targetIndex = (index - 1 + localTabs.length) % localTabs.length;
      if (event.key === 'Home') targetIndex = 0;
      if (event.key === 'End') targetIndex = localTabs.length - 1;

      localTabs[targetIndex].focus();
      setContext(localTabs[targetIndex].dataset.context);
    });
  });

  elements.otherContextLink.addEventListener('click', () => {
    setContext(elements.otherContextLink.dataset.otherContext);
  });

  document.querySelectorAll('.js-whatsapp').forEach((link) => {
    link.addEventListener('click', () => {
      trackEvent('click_whatsapp', {
        service_type: state.context,
        service_name: link.dataset.serviceName || 'atendimento_geral',
        cta_location: link.dataset.ctaLocation || 'unknown',
        link_url: `https://wa.me/${WHATSAPP_NUMBER}`
      });
    });
  });

  document.querySelectorAll('.js-instagram').forEach((link) => {
    link.addEventListener('click', () => {
      trackEvent('click_instagram', {
        service_type: state.context,
        service_name: 'instagram',
        cta_location: link.dataset.ctaLocation || 'unknown',
        link_url: 'https://www.instagram.com/andre.despachante1/'
      });
    });
  });

  document.querySelectorAll('.js-service').forEach((link) => {
    const serviceName = link.dataset.serviceName;
    const serviceType = link.dataset.serviceType;
    const serviceLabel = SERVICE_LABELS[serviceName] || 'serviço documental';
    link.href = buildWhatsAppUrl(`Olá, André. Vim pelo site e preciso de atendimento sobre ${serviceLabel}.`);

    link.addEventListener('click', () => {
      const params = {
        service_type: serviceType,
        service_name: serviceName,
        cta_location: link.dataset.ctaLocation,
        link_url: `https://wa.me/${WHATSAPP_NUMBER}`
      };
      trackEvent('service_click', params);
      trackEvent('click_whatsapp', params);
    });
  });

  elements.quizForm.addEventListener('click', (event) => {
    const option = event.target.closest('.quiz-option');
    if (!option) return;

    const step = option.dataset.step;
    const value = option.dataset.value;
    const label = option.dataset.label;

    if (!state.quizStarted) {
      state.quizStarted = true;
      trackEvent('quiz_start', { service_type: state.context });
    }

    elements.quizForm.querySelectorAll(`.quiz-option[data-step="${step}"]`).forEach((button) => {
      button.setAttribute('aria-pressed', String(button === option));
    });

    state.quizAnswers[step] = { value, label };
    trackEvent('quiz_answer', {
      service_type: state.context,
      quiz_step: Number(step),
      quiz_question: `question_${step}`,
      quiz_answer: value
    });

    updateQuizSubmit();
  });

  function updateQuizSubmit() {
    const answer1 = state.quizAnswers['1'];
    const answer2 = state.quizAnswers['2'];
    const status = elements.quizForm.querySelector('[data-quiz="status"]');

    if (!answer1 || !answer2) {
      status.textContent = answer1 ? 'Agora selecione uma opção na segunda etapa.' : 'Selecione uma opção em cada etapa.';
      return;
    }

    const message = CONTEXTS[state.context].quiz.buildMessage(answer1.label.toLowerCase(), answer2.label.toLowerCase());
    elements.quizSubmit.href = buildWhatsAppUrl(message);
    elements.quizSubmit.classList.remove('is-disabled');
    elements.quizSubmit.setAttribute('aria-disabled', 'false');
    status.textContent = 'Pronto. Continue o atendimento no WhatsApp.';
  }

  elements.quizSubmit.addEventListener('click', (event) => {
    if (elements.quizSubmit.getAttribute('aria-disabled') === 'true') {
      event.preventDefault();
      return;
    }

    const answer1 = state.quizAnswers['1'];
    const answer2 = state.quizAnswers['2'];
    trackEvent('quiz_submit', {
      service_type: state.context,
      service_name: answer1.value,
      cta_location: 'quiz',
      quiz_answer: answer2.value,
      link_url: `https://wa.me/${WHATSAPP_NUMBER}`
    });
    trackEvent('click_whatsapp', {
      service_type: state.context,
      service_name: answer1.value,
      cta_location: 'quiz',
      link_url: `https://wa.me/${WHATSAPP_NUMBER}`
    });
  });

  document.querySelectorAll('.faq-item').forEach((item, index) => {
    item.addEventListener('toggle', () => {
      if (!item.open) return;
      trackEvent('faq_open', {
        service_type: state.context,
        service_name: `faq_${index + 1}`
      });
    });
  });

  document.querySelector('.js-routes')?.addEventListener('click', (event) => {
    trackEvent('click_routes', {
      service_type: state.context,
      cta_location: 'location',
      link_url: event.currentTarget.href
    });
  });

  document.querySelector('.js-review')?.addEventListener('click', (event) => {
    trackEvent('review_click', {
      service_type: state.context,
      cta_location: 'reviews',
      link_url: event.currentTarget.href
    });
  });

  document.querySelector('.js-call')?.addEventListener('click', () => {
    trackEvent('click_call', {
      service_type: state.context,
      cta_location: 'footer',
      link_url: 'tel:+5521983006641'
    });
  });

  document.querySelectorAll('.footer a[href="#"]').forEach((link) => {
    link.addEventListener('click', (event) => event.preventDefault());
  });

  function initializeCarousels() {
    document.querySelectorAll('[data-carousel]').forEach((shell) => {
      const track = shell.querySelector('.carousel-track');
      const items = [...track.children];
      const previousButton = shell.querySelector('[data-carousel-prev]');
      const nextButton = shell.querySelector('[data-carousel-next]');
      const dotsContainer = shell.querySelector('.carousel-dots');
      let activeIndex = 0;
      let scrollFrame;

      const dots = items.map((item, index) => {
        const dot = document.createElement('button');
        dot.type = 'button';
        dot.setAttribute('aria-label', `Ir para o item ${index + 1}`);
        dot.addEventListener('click', () => scrollToItem(index));
        dotsContainer.append(dot);
        return dot;
      });

      function scrollToItem(index) {
        const item = items[index];
        if (!item || track.clientWidth === 0) return;
        const trackRect = track.getBoundingClientRect();
        const itemRect = item.getBoundingClientRect();
        const left = track.scrollLeft + itemRect.left - trackRect.left - (track.clientWidth - itemRect.width) / 2;
        track.scrollTo({ left, behavior: reduceMotion ? 'auto' : 'smooth' });
      }

      function update() {
        if (track.clientWidth === 0) return;
        const hasOverflow = track.scrollWidth > track.clientWidth + 4;
        shell.classList.toggle('is-static', !hasOverflow);
        if (!hasOverflow) {
          activeIndex = 0;
          dots.forEach((dot, index) => dot.classList.toggle('is-active', index === 0));
          previousButton.disabled = true;
          nextButton.disabled = true;
          return;
        }
        const trackRect = track.getBoundingClientRect();
        const center = trackRect.left + trackRect.width / 2;
        let closestDistance = Infinity;

        items.forEach((item, index) => {
          const rect = item.getBoundingClientRect();
          const distance = Math.abs(rect.left + rect.width / 2 - center);
          if (distance < closestDistance) {
            closestDistance = distance;
            activeIndex = index;
          }
        });

        dots.forEach((dot, index) => dot.classList.toggle('is-active', index === activeIndex));
        previousButton.disabled = activeIndex === 0;
        nextButton.disabled = activeIndex === items.length - 1;
      }

      track.addEventListener('scroll', () => {
        window.cancelAnimationFrame(scrollFrame);
        scrollFrame = window.requestAnimationFrame(update);
      }, { passive: true });
      previousButton.addEventListener('click', () => scrollToItem(Math.max(0, activeIndex - 1)));
      nextButton.addEventListener('click', () => scrollToItem(Math.min(items.length - 1, activeIndex + 1)));

      const controller = {
        refresh() {
          if (track.closest('[hidden]')) return;
          track.scrollLeft = 0;
          window.requestAnimationFrame(update);
        }
      };
      carouselControllers.push(controller);
      update();
    });
  }

  function refreshCarousels() {
    carouselControllers.forEach((controller) => controller.refresh());
  }

  function initializeCounters() {
    const group = document.querySelector('[data-counter-group]');
    if (!group) return;
    const counters = [...group.querySelectorAll('[data-counter]')];

    const formatValue = (value, decimals) => value.toFixed(decimals).replace('.', ',');
    const showFinalValues = () => counters.forEach((counter) => {
      counter.textContent = formatValue(Number(counter.dataset.value), Number(counter.dataset.decimals || 0));
    });

    if (reduceMotion || !('IntersectionObserver' in window)) {
      showFinalValues();
      return;
    }

    counters.forEach((counter) => { counter.textContent = formatValue(0, Number(counter.dataset.decimals || 0)); });
    const observer = new IntersectionObserver((entries) => {
      if (!entries.some((entry) => entry.isIntersecting)) return;
      observer.disconnect();
      const start = performance.now();
      const duration = 900;

      const animate = (now) => {
        const progress = Math.min(1, (now - start) / duration);
        const eased = 1 - Math.pow(1 - progress, 3);
        counters.forEach((counter) => {
          const target = Number(counter.dataset.value);
          const decimals = Number(counter.dataset.decimals || 0);
          counter.textContent = formatValue(target * eased, decimals);
        });
        if (progress < 1) window.requestAnimationFrame(animate);
        else showFinalValues();
      };
      window.requestAnimationFrame(animate);
    }, { threshold: 0.35 });

    observer.observe(group);
  }

  function initializeReveals() {
    const revealElements = document.querySelectorAll('.reveal');
    if (!('IntersectionObserver' in window)) {
      revealElements.forEach((element) => element.classList.add('is-visible'));
      return;
    }

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      });
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.08 });

    revealElements.forEach((element) => observer.observe(element));
  }

  function initializePreloader() {
    const preloader = document.querySelector('.preloader');
    const delay = reduceMotion ? 0 : 1050;

    window.setTimeout(() => {
      preloader.classList.add('is-hidden');
      document.documentElement.classList.add('is-ready');
      window.setTimeout(() => preloader.remove(), reduceMotion ? 0 : 450);
    }, delay);
  }

  function updateFloatingButton() {
    if (!elements.floatingActions) return;

    const blockingSections = document.querySelectorAll('#servicos, #especialista, #avaliacoes, #pre-atendimento, #localizacao, #faq, .final-cta, .footer');
    const hasBlockingSectionInView = [...blockingSections].some((section) => {
      const rect = section.getBoundingClientRect();
      return rect.top < window.innerHeight && rect.bottom > window.innerHeight * 0.45;
    });

    elements.floatingActions.classList.toggle('is-visible', window.scrollY > 500 && !hasBlockingSectionInView);
  }

  function updateStickyHeader() {
    elements.siteHeader.classList.toggle('is-scrolled', window.scrollY > 24);
  }

  window.addEventListener('scroll', () => {
    updateStickyHeader();
    updateFloatingButton();
  }, { passive: true });
  window.addEventListener('resize', () => {
    refreshCarousels();
    updateFloatingButton();
  });
  window.addEventListener('load', refreshCarousels, { once: true });

  initializeCarousels();
  setContext(getInitialContext(), { track: false, updateUrl: false });
  initializePreloader();
  initializeReveals();
  initializeCounters();
  updateStickyHeader();
  updateFloatingButton();
  document.querySelector('#current-year').textContent = String(new Date().getFullYear());
})();
