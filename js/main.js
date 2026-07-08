(() => {
  'use strict';

  const WHATSAPP_NUMBER = '5521965960143';
  const PAGE_TYPE = 'landing';
  const WHATSAPP_BASE_URL = `https://wa.me/${WHATSAPP_NUMBER}`;
  const DEFAULT_WHATSAPP_MESSAGE = 'Olá, vim pelo site da Amaro e preciso de informações sobre exame toxicológico.';
  const CHATBOT_WHATSAPP_MESSAGE = 'Olá, vim pelo site da Amaro, usei o mini assistente e gostaria de continuar o atendimento pelo WhatsApp.';
  const INSTAGRAM_URL = 'https://www.instagram.com/amaro_exames_toxicologico/';
  const GOOGLE_URL = 'https://www.google.com/search?q=Amaro+Exame+Toxicol%C3%B3gico+DETRAN';
  const ROUTES_URL = 'https://www.google.com/maps/search/?api=1&query=Estr.%20Rio%20S%C3%A3o%20Paulo%2C%203783%20-%20Loja%20A%20-%20Campo%20Grande%2C%20Rio%20de%20Janeiro%20-%20RJ%2C%2023075-247';

  const CHATBOT_RESPONSES = {
    prazo_laudo: {
      answer: 'O prazo informado é de 3 a 5 dias úteis, conforme o atendimento.'
    },
    atende_detran: {
      answer: 'Sim. A Amaro atende demandas de exame toxicológico relacionadas ao DETRAN e documentação.'
    },
    funciona_24h: {
      answer: 'O perfil da empresa informa atendimento aberto 24 horas. Chame no WhatsApp para confirmar o melhor horário.'
    },
    onde_fica: {
      answer: 'A unidade fica na Estr. Rio São Paulo, 3783 - Loja A - Campo Grande, Rio de Janeiro.'
    },
    como_comeco: {
      answer: 'Você pode chamar no WhatsApp e informar qual exame ou atendimento precisa.'
    }
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
    return `${WHATSAPP_BASE_URL}?text=${encodeURIComponent(message)}`;
  }

  window.trackEvent = trackEvent;
  window.buildWhatsAppUrl = buildWhatsAppUrl;

  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const carouselControllers = [];

  const state = {
    quizAnswers: {},
    quizStarted: false,
    chatbotOpen: false,
    activeChatbotQuestion: ''
  };

  const elements = {
    preloader: document.querySelector('.preloader'),
    siteHeader: document.querySelector('.site-header'),
    floatingActions: document.querySelector('.floating-actions'),
    quizForm: document.querySelector('#quiz-form'),
    quizSubmit: document.querySelector('#quiz-submit'),
    quizStatus: document.querySelector('[data-quiz-status]'),
    chatbotPanel: document.querySelector('#mini-chatbot'),
    chatbotToggle: document.querySelector('.js-chatbot-toggle'),
    chatbotClose: document.querySelector('.js-chatbot-close'),
    chatbotQuestions: [...document.querySelectorAll('.chatbot-question')],
    chatbotAnswer: document.querySelector('[data-chatbot-answer]'),
    chatbotWhatsApp: document.querySelector('.js-chatbot-whatsapp')
  };

  function formatCounterValue(value, decimals, suffix = '') {
    const formatter = new Intl.NumberFormat('pt-BR', {
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals
    });

    return `${formatter.format(value)}${suffix}`;
  }

  function getWhatsAppMessage(link) {
    if (link.dataset.whatsappMessage) return link.dataset.whatsappMessage;

    if (link.classList.contains('js-service')) {
      return `Olá, vim pelo site da Amaro e preciso de informações sobre ${link.dataset.serviceLabel}.`;
    }

    return DEFAULT_WHATSAPP_MESSAGE;
  }

  function syncWhatsAppLinks() {
    document.querySelectorAll('.js-whatsapp').forEach((link) => {
      link.href = buildWhatsAppUrl(getWhatsAppMessage(link));
    });
  }

  function bindTrackedLinks() {
    document.querySelectorAll('.js-whatsapp').forEach((link) => {
      link.addEventListener('click', () => {
        const serviceName = link.dataset.serviceName || 'atendimento_geral';
        const ctaLocation = link.dataset.ctaLocation || 'unknown';

        if (link.classList.contains('js-service')) {
          trackEvent('service_click', {
            service_name: serviceName,
            cta_location: ctaLocation,
            link_url: WHATSAPP_BASE_URL
          });
        }

        trackEvent('click_whatsapp', {
          service_name: serviceName,
          cta_location: ctaLocation,
          link_url: WHATSAPP_BASE_URL
        });
      });
    });

    document.querySelectorAll('.js-instagram').forEach((link) => {
      link.addEventListener('click', () => {
        trackEvent('click_instagram', {
          service_name: 'instagram',
          cta_location: link.dataset.ctaLocation || 'unknown',
          link_url: INSTAGRAM_URL
        });
      });
    });

    document.querySelector('.js-routes')?.addEventListener('click', () => {
      trackEvent('click_routes', {
        service_name: 'location',
        cta_location: 'location',
        link_url: ROUTES_URL
      });
    });

    document.querySelector('.js-review')?.addEventListener('click', () => {
      trackEvent('review_click', {
        service_name: 'google_reviews',
        cta_location: 'reviews',
        link_url: GOOGLE_URL
      });
    });
  }

  function initializeQuiz() {
    if (!elements.quizForm || !elements.quizSubmit || !elements.quizStatus) return;

    elements.quizForm.querySelectorAll('.quiz-option').forEach((option) => {
      option.setAttribute('aria-pressed', 'false');
    });

    elements.quizForm.addEventListener('click', (event) => {
      const option = event.target.closest('.quiz-option');
      if (!option) return;

      const step = option.dataset.step;
      const question = option.dataset.question;
      const value = option.dataset.value;

      if (!state.quizStarted) {
        state.quizStarted = true;
        trackEvent('quiz_start', {
          service_name: 'pre_atendimento',
          cta_location: 'quiz'
        });
      }

      elements.quizForm.querySelectorAll(`.quiz-option[data-step="${step}"]`).forEach((button) => {
        const isActive = button === option;
        button.classList.toggle('is-selected', isActive);
        button.setAttribute('aria-pressed', String(isActive));
      });

      state.quizAnswers[step] = { question, value };

      trackEvent('quiz_answer', {
        service_name: 'pre_atendimento',
        cta_location: 'quiz',
        quiz_step: Number(step),
        quiz_question: question,
        quiz_answer: value
      });

      updateQuizSubmit();
    });

    elements.quizSubmit.addEventListener('click', (event) => {
      if (elements.quizSubmit.getAttribute('aria-disabled') === 'true') {
        event.preventDefault();
        return;
      }

      const service = state.quizAnswers['1']?.value;
      const situation = state.quizAnswers['2']?.value;

      trackEvent('quiz_submit', {
        service_name: service || 'pre_atendimento',
        cta_location: 'quiz',
        quiz_step: 2,
        quiz_question: 'urgencia',
        quiz_answer: situation || '',
        link_url: WHATSAPP_BASE_URL
      });

      trackEvent('click_whatsapp', {
        service_name: service || 'pre_atendimento',
        cta_location: 'quiz',
        link_url: WHATSAPP_BASE_URL
      });
    });
  }

  function updateQuizSubmit() {
    const service = state.quizAnswers['1'];
    const situation = state.quizAnswers['2'];

    if (!service || !situation) {
      elements.quizStatus.textContent = service
        ? 'Agora selecione uma opção na segunda etapa.'
        : 'Selecione uma opção em cada etapa.';
      elements.quizSubmit.classList.add('is-disabled');
      elements.quizSubmit.setAttribute('aria-disabled', 'true');
      elements.quizSubmit.href = buildWhatsAppUrl(DEFAULT_WHATSAPP_MESSAGE);
      return;
    }

    const message = `Olá, vim pelo site da Amaro e preciso de informações sobre ${service.value}. Minha situação: ${situation.value}.`;
    elements.quizStatus.textContent = 'Pronto. Continue o atendimento no WhatsApp.';
    elements.quizSubmit.href = buildWhatsAppUrl(message);
    elements.quizSubmit.classList.remove('is-disabled');
    elements.quizSubmit.setAttribute('aria-disabled', 'false');
  }

  function initializeFaqTracking() {
    document.querySelectorAll('.faq-item').forEach((item) => {
      item.addEventListener('toggle', () => {
        if (!item.open) return;

        trackEvent('faq_open', {
          question_id: item.dataset.questionId,
          cta_location: 'faq'
        });
      });
    });
  }

  function openChatbot({ track = true } = {}) {
    if (!elements.chatbotPanel || state.chatbotOpen) return;

    state.chatbotOpen = true;
    elements.chatbotPanel.hidden = false;
    elements.chatbotToggle?.setAttribute('aria-expanded', 'true');

    if (track) {
      trackEvent('chatbot_open', {
        cta_location: 'floating_chatbot'
      });
    }
  }

  function closeChatbot({ track = true } = {}) {
    if (!elements.chatbotPanel || !state.chatbotOpen) return;

    state.chatbotOpen = false;
    elements.chatbotPanel.hidden = true;
    elements.chatbotToggle?.setAttribute('aria-expanded', 'false');

    if (track) {
      trackEvent('chatbot_close', {
        cta_location: 'floating_chatbot'
      });
    }
  }

  function initializeChatbot() {
    if (!elements.chatbotPanel || !elements.chatbotWhatsApp) return;

    elements.chatbotWhatsApp.href = buildWhatsAppUrl(CHATBOT_WHATSAPP_MESSAGE);

    elements.chatbotToggle?.addEventListener('click', () => {
      if (state.chatbotOpen) closeChatbot();
      else openChatbot();
    });

    elements.chatbotClose?.addEventListener('click', () => closeChatbot());

    elements.chatbotQuestions.forEach((button) => {
      button.addEventListener('click', () => {
        const questionId = button.dataset.questionId;
        const response = CHATBOT_RESPONSES[questionId];
        if (!response) return;

        state.activeChatbotQuestion = questionId;
        elements.chatbotQuestions.forEach((item) => item.classList.toggle('is-active', item === button));
        elements.chatbotAnswer.textContent = response.answer;
        elements.chatbotWhatsApp.href = buildWhatsAppUrl(CHATBOT_WHATSAPP_MESSAGE);

        trackEvent('chatbot_question_click', {
          question_id: questionId,
          cta_location: 'chatbot'
        });
      });
    });

    elements.chatbotWhatsApp.addEventListener('click', () => {
      trackEvent('chatbot_whatsapp_click', {
        question_id: state.activeChatbotQuestion || 'generic',
        cta_location: 'chatbot',
        link_url: WHATSAPP_BASE_URL
      });

      trackEvent('click_whatsapp', {
        service_name: 'chatbot',
        cta_location: 'chatbot',
        question_id: state.activeChatbotQuestion || 'generic',
        link_url: WHATSAPP_BASE_URL
      });
    });

    document.addEventListener('keydown', (event) => {
      if (event.key === 'Escape') closeChatbot();
    });
  }

  function initializeCarousels() {
    document.querySelectorAll('[data-carousel]').forEach((shell) => {
      const track = shell.querySelector('.carousel-track');
      const items = [...track.children];
      const previousButton = shell.querySelector('[data-carousel-prev]');
      const nextButton = shell.querySelector('[data-carousel-next]');
      const dotsContainer = shell.querySelector('.carousel-dots');
      let activeIndex = 0;
      let scrollFrame = 0;

      const dots = items.map((item, index) => {
        const dot = document.createElement('button');
        dot.type = 'button';
        dot.setAttribute('aria-label', `Ir para o item ${index + 1}`);
        dot.addEventListener('click', () => scrollToItem(index));
        dotsContainer?.append(dot);
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
          if (previousButton) previousButton.disabled = true;
          if (nextButton) nextButton.disabled = true;
          return;
        }

        const trackRect = track.getBoundingClientRect();
        const center = trackRect.left + trackRect.width / 2;
        let closestDistance = Number.POSITIVE_INFINITY;

        items.forEach((item, index) => {
          const rect = item.getBoundingClientRect();
          const distance = Math.abs(rect.left + rect.width / 2 - center);
          if (distance < closestDistance) {
            closestDistance = distance;
            activeIndex = index;
          }
        });

        dots.forEach((dot, index) => dot.classList.toggle('is-active', index === activeIndex));
        if (previousButton) previousButton.disabled = activeIndex === 0;
        if (nextButton) nextButton.disabled = activeIndex === items.length - 1;
      }

      track.addEventListener('scroll', () => {
        window.cancelAnimationFrame(scrollFrame);
        scrollFrame = window.requestAnimationFrame(update);
      }, { passive: true });

      previousButton?.addEventListener('click', () => scrollToItem(Math.max(0, activeIndex - 1)));
      nextButton?.addEventListener('click', () => scrollToItem(Math.min(items.length - 1, activeIndex + 1)));

      carouselControllers.push({
        refresh() {
          track.scrollLeft = 0;
          window.requestAnimationFrame(update);
        }
      });

      update();
    });
  }

  function refreshCarousels() {
    carouselControllers.forEach((controller) => controller.refresh());
  }

  function initializeCounters() {
    const counters = [...document.querySelectorAll('[data-counter]')];
    if (!counters.length) return;

    const renderFinalValues = () => counters.forEach((counter) => {
      counter.textContent = formatCounterValue(
        Number(counter.dataset.value),
        Number(counter.dataset.decimals || 0),
        counter.dataset.suffix || ''
      );
    });

    if (reduceMotion || !('IntersectionObserver' in window)) {
      renderFinalValues();
      return;
    }

    counters.forEach((counter) => {
      counter.textContent = formatCounterValue(0, Number(counter.dataset.decimals || 0), counter.dataset.suffix || '');
    });

    const observer = new IntersectionObserver((entries) => {
      if (!entries.some((entry) => entry.isIntersecting)) return;
      observer.disconnect();

      const start = performance.now();
      const duration = 950;

      const animate = (now) => {
        const progress = Math.min(1, (now - start) / duration);
        const eased = 1 - Math.pow(1 - progress, 3);

        counters.forEach((counter) => {
          const target = Number(counter.dataset.value);
          const decimals = Number(counter.dataset.decimals || 0);
          const suffix = counter.dataset.suffix || '';
          counter.textContent = formatCounterValue(target * eased, decimals, suffix);
        });

        if (progress < 1) {
          window.requestAnimationFrame(animate);
        } else {
          renderFinalValues();
        }
      };

      window.requestAnimationFrame(animate);
    }, { threshold: 0.35 });

    const group = document.querySelector('[data-counter-group]') || counters[0];
    observer.observe(group);
  }

  function initializeReveals() {
    const revealElements = document.querySelectorAll('.reveal');
    if (!revealElements.length) return;

    if (reduceMotion || !('IntersectionObserver' in window)) {
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
    if (!elements.preloader) return;

    const delay = reduceMotion ? 0 : 1050;

    window.setTimeout(() => {
      elements.preloader.classList.add('is-hidden');
      document.documentElement.classList.add('is-ready');
      window.setTimeout(() => elements.preloader.remove(), reduceMotion ? 0 : 420);
    }, delay);
  }

  function updateStickyHeader() {
    elements.siteHeader?.classList.toggle('is-scrolled', window.scrollY > 20);
  }

  function updateFloatingActions() {
    if (!elements.floatingActions) return;

    const shouldShow = window.scrollY > 500;
    elements.floatingActions.classList.toggle('is-visible', shouldShow);

    if (!shouldShow) closeChatbot({ track: false });
  }

  function bindPlaceholderLinks() {
    document.querySelectorAll('a[href="#"]').forEach((link) => {
      link.addEventListener('click', (event) => event.preventDefault());
    });
  }

  function initializePage() {
    syncWhatsAppLinks();
    bindTrackedLinks();
    initializeQuiz();
    initializeFaqTracking();
    initializeChatbot();
    initializeCarousels();
    initializeCounters();
    initializeReveals();
    initializePreloader();
    bindPlaceholderLinks();
    updateStickyHeader();
    updateFloatingActions();

    const year = document.querySelector('#current-year');
    if (year) year.textContent = String(new Date().getFullYear());
  }

  window.addEventListener('scroll', () => {
    updateStickyHeader();
    updateFloatingActions();
  }, { passive: true });

  window.addEventListener('resize', refreshCarousels);
  window.addEventListener('load', refreshCarousels, { once: true });

  initializePage();
})();
