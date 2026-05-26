/* ===== PARTICLE GRID CANVAS ===== */
(function () {
  const canvas = document.getElementById('heroCanvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  let w, h, particles, mouse;

  function resize() {
    w = canvas.width = canvas.offsetWidth;
    h = canvas.height = canvas.offsetHeight;
  }

  function init() {
    resize();
    mouse = { x: w / 2, y: h / 2 };
    const spacing = 80;
    const cols = Math.ceil(w / spacing) + 1;
    const rows = Math.ceil(h / spacing) + 1;
    particles = [];
    for (let i = 0; i < cols; i++) {
      for (let j = 0; j < rows; j++) {
        particles.push({
          x: i * spacing,
          y: j * spacing,
          ox: i * spacing,
          oy: j * spacing,
          r: Math.random() * 1.5 + 0.5,
        });
      }
    }
  }

  function draw() {
    ctx.clearRect(0, 0, w, h);
    for (const p of particles) {
      const dx = mouse.x - p.ox;
      const dy = mouse.y - p.oy;
      const dist = Math.sqrt(dx * dx + dy * dy);
      const maxDist = 200;
      if (dist < maxDist) {
        const force = (1 - dist / maxDist) * 20;
        p.x = p.ox + (dx / dist) * force;
        p.y = p.oy + (dy / dist) * force;
      } else {
        p.x += (p.ox - p.x) * 0.1;
        p.y += (p.oy - p.y) * 0.1;
      }
      const alpha = dist < maxDist ? 0.15 + (1 - dist / maxDist) * 0.35 : 0.08;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(108, 99, 255, ${alpha})`;
      ctx.fill();
    }

    // Draw connections
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const a = particles[i];
        const b = particles[j];
        const dx = a.x - b.x;
        const dy = a.y - b.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 100) {
          ctx.beginPath();
          ctx.moveTo(a.x, a.y);
          ctx.lineTo(b.x, b.y);
          ctx.strokeStyle = `rgba(108, 99, 255, ${0.04 * (1 - dist / 100)})`;
          ctx.lineWidth = 0.5;
          ctx.stroke();
        }
      }
    }

    requestAnimationFrame(draw);
  }

  window.addEventListener('resize', () => { resize(); init(); });
  canvas.addEventListener('mousemove', (e) => {
    const rect = canvas.getBoundingClientRect();
    mouse.x = e.clientX - rect.left;
    mouse.y = e.clientY - rect.top;
  });

  init();
  draw();
})();

/* ===== CURSOR GLOW ===== */
(function () {
  const glow = document.getElementById('cursorGlow');
  if (!glow) return;
  let mx = 0, my = 0, gx = 0, gy = 0;

  document.addEventListener('mousemove', (e) => {
    mx = e.clientX;
    my = e.clientY;
  });

  function animate() {
    gx += (mx - gx) * 0.08;
    gy += (my - gy) * 0.08;
    glow.style.left = gx + 'px';
    glow.style.top = gy + 'px';
    requestAnimationFrame(animate);
  }

  animate();
})();

/* ===== SERVICE CARD MOUSE TRACKING ===== */
document.querySelectorAll('.service-card').forEach((card) => {
  card.addEventListener('mousemove', (e) => {
    const rect = card.getBoundingClientRect();
    card.style.setProperty('--mouse-x', ((e.clientX - rect.left) / rect.width) * 100 + '%');
    card.style.setProperty('--mouse-y', ((e.clientY - rect.top) / rect.height) * 100 + '%');
  });
});

/* ===== NAV SCROLL ===== */
(function () {
  const nav = document.getElementById('nav');
  let lastScroll = 0;

  window.addEventListener('scroll', () => {
    const y = window.scrollY;
    if (y > 50) {
      nav.classList.add('scrolled');
    } else {
      nav.classList.remove('scrolled');
    }
    lastScroll = y;
  });
})();

/* ===== MOBILE NAV ===== */
(function () {
  const toggle = document.getElementById('navToggle');
  const links = document.getElementById('navLinks');

  toggle.addEventListener('click', () => {
    toggle.classList.toggle('active');
    links.classList.toggle('open');
  });

  links.querySelectorAll('a').forEach((a) => {
    a.addEventListener('click', () => {
      toggle.classList.remove('active');
      links.classList.remove('open');
    });
  });
})();

/* ===== SCROLL REVEAL ===== */
(function () {
  const reveals = document.querySelectorAll('.reveal');
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
        }
      });
    },
    { threshold: 0.15, rootMargin: '0px 0px -40px 0px' }
  );

  reveals.forEach((el) => observer.observe(el));
})();

/* ===== COUNTER ANIMATION ===== */
(function () {
  const counters = document.querySelectorAll('.stat-number');
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const el = entry.target;
          const target = parseInt(el.getAttribute('data-count'), 10);
          let current = 0;
          const duration = 2000;
          const step = target / (duration / 16);

          function count() {
            current += step;
            if (current >= target) {
              el.textContent = target.toLocaleString();
              return;
            }
            el.textContent = Math.floor(current).toLocaleString();
            requestAnimationFrame(count);
          }

          count();
          observer.unobserve(el);
        }
      });
    },
    { threshold: 0.5 }
  );

  counters.forEach((c) => observer.observe(c));
})();

/* ===== i18n LANGUAGE TOGGLE (EN / ES) ===== */
(function () {
  const translations = {
    en: {
      'nav.services': 'Services',
      'nav.work': 'Work',
      'nav.about': 'About',
      'nav.cta': 'Book a Call',

      'hero.badge': 'Based in Jersey City, NJ',
      'hero.title1': 'Moving <em class="gradient-text">you</em> forward',
      'hero.ctaPrimary': 'View Our Work',
      'hero.ctaSecondary': 'Start a Project',
      'hero.statClients': 'Clients Served',
      'hero.statSaved': 'Saved',

      'services.tag': 'What We Do',
      'services.title': 'Engineering solutions<br />at the intersection of<br /><span class="gradient-text">code &amp; community.</span>',
      'services.valueHeading': 'The world has changed. Have you?',
      'services.valuePara1': 'AI is rewriting entire industries. Customers expect instant, mobile-first experiences. Your competitors — even the small ones — are automating what used to take your team all week. The organizations that thrive in this environment aren\'t the biggest; they\'re the ones that move fastest. And right now, speed runs on software.',
      'services.valuePara2': 'Yet most small businesses and non-profits are still running on spreadsheets, disconnected tools, and manual processes that were outdated five years ago. Every hour your staff spends on data entry, copy-paste reporting, or chasing information across inboxes is an hour not spent on the work that actually grows your organization. That gap isn\'t standing still — it\'s widening every quarter.',
      'services.valuePara3': 'Custom software closes that gap. One well-built application can automate your most time-consuming workflows, give your team real-time visibility into operations, and create the kind of seamless digital experience your clients and community now expect. It\'s the same operational advantage Fortune 500 companies have relied on for decades — built to fit your budget, your workflow, and your goals.',
      'services.valuePara4': 'The question isn\'t whether your organization needs technology — it\'s how long you can afford to wait. We help you stop falling behind and start building the tools that put you ahead.',

      'services.card1Title': 'Web Design / Development',
      'services.card1Desc': 'Polished, fast, and conversion-focused websites for organizations that need a strong online presence without the complexity of a full web app. Perfect for landing pages, portfolios, small business sites, and blogs.',
      'services.benefit1': '<strong>Beautiful first impressions.</strong> Custom-designed pages built to build trust the moment someone lands — modern, branded, and mobile-friendly.',
      'services.benefit2': '<strong>Blazing-fast performance.</strong> Lightweight, hand-coded sites that load instantly — no bloat, no overhead, no plugin fatigue.',
      'services.benefit3': '<strong>Built to convert.</strong> Clear calls to action, contact forms, and landing-page flows that turn visitors into qualified leads.',

      'services.card2Title': 'Full-Stack Web Development',
      'services.card2Desc': 'Complex, custom web applications with secure backends, databases, and user accounts. Built to automate workflows, unlock new revenue, and scale alongside your organization as you grow.',
      'services.benefit4': '<strong>End-to-end development.</strong> Frontend, backend, and database — all engineered by one dedicated partner who owns the full picture from day one.',
      'services.benefit5': '<strong>Cut operating costs.</strong> Automate data entry, reporting, scheduling, and invoicing so your team can focus on mission-critical work instead of busywork.',
      'services.benefit6': '<strong>Unlock new revenue.</strong> Subscription platforms, online booking, secure checkout, and member portals — purpose-built to open revenue streams your current setup can\'t support.',


      'work.tag': 'Selected Work',
      'work.title': 'Products that solve<br /><span class="gradient-text">real problems.</span>',
      'work.museCat': 'Non-Profit Platform',
      'work.museDesc': 'Jersey City\'s Poet Laureate, <a href="https://www.jerseycitypoetryfestival.org/">Melida Rodas</a>, needed to centralize the city\'s scattered cultural calendar — and fund her non-profit at the same time. The solution: an interactive map and event platform where local artists discover what\'s happening, while paid subscriptions let organizers post their own events — turning a community resource into a recurring revenue stream for the non-profit.',
      'work.housesCat': 'Civic Automation',
      'work.housesDesc': '<a href="https://www.quetzalconsultingnj.com/affordablehousingstock" target="_blank" rel="noopener">Quetzal Consulting</a> was losing hours each week to manual Census data lookups for every Affirmative Fair Housing Marketing Plan it filed with Jersey City\'s Department of Affordable Housing. The solution: an automation tool that turns hours of per-property busywork into minutes — saving the owner several hours every month across an entire real estate portfolio, and freeing them to take on more clients.',
      'work.bandsCat': 'AI Music Discovery',
      'work.bandsDesc': 'Local concert listings are scattered across a dozen platforms, leaving fans guessing where to spend their night. The solution: a discovery app that pulls those listings into one place, then layers Anthropic\'s Claude AI on top — users pick the genres they love and the app surfaces the shows most worth showing up for, turning chaotic event feeds into a curated tonight\'s lineup.',
      'work.viewProject': 'View Project',

      'about.tag': 'About',
      'about.title': 'A developer<br />who\'s shipped at<br /><span class="gradient-text">every scale.</span>',
      'about.leadRole': 'Lead Developer & Founder',
      'about.leadBio': 'Roberto is a problem-solver first, engineer second. After sharpening his craft at Pinterest, PSEG, and PowerOptions, he founded Hudson Technology Solutions to do for small organizations what big-tech engineering does for the Fortune 500 — turn operational pain into measurable outcomes. Every project ships under his direct hands, from first conversation to final launch.',

      'about.bio1': 'Hudson Technology Solutions was founded by <strong>Roberto Rodas-Herndon</strong>, a Boston University Computer Science graduate. As <strong>President of BU\'s Hack4Impact chapter (2021–2023)</strong>, he led student engineers in shipping pro-bono software for under-resourced non-profits — proving early that the right code, in the right hands, changes what an organization can actually accomplish.',
      'about.bio2': 'From building internal tooling at <strong>Pinterest\'s</strong> San Francisco headquarters to delivering data-driven insights across the enterprise at <strong>PSEG</strong>, we\'ve solved problems at every scale. The lesson: the same engineering principles that move a public utility forward can transform a Main Street business — when applied by someone who actually understands the problem.',
      'about.bio3': 'Every project ships with modern architecture, measurable outcomes, and a relentless focus on the bottom line. We\'re also <strong>bilingual (English &amp; Spanish)</strong>, so the diverse communities we serve can collaborate in their own language.',

      'timeline.role1': 'Founded Hudson Technology Solutions LLC',
      'timeline.role2': 'Data Scientist — PSEG',
      'timeline.desc2': 'Translated raw data into strategic recommendations at one of the largest publicly-traded energy & utility companies in the U.S. — work that informed decisions affecting millions of customers across New Jersey.',
      'timeline.role3': 'Data Engineer — PowerOptions',
      'timeline.desc3': 'Built data pipelines for New England\'s largest energy-buying consortium, turning raw market data into the leverage non-profits and public entities use to negotiate better electricity & natural gas rates.',
      'timeline.role4': 'Software Engineer Intern — Pinterest',
      'timeline.desc4': 'Shipped internal observability tooling at Pinterest\'s San Francisco headquarters — giving senior engineers the visibility they needed to keep a platform serving hundreds of millions of users running smoothly.',
      'timeline.role5': 'President — BU Hack4Impact',
      'timeline.desc5': 'Led the Boston University chapter for two years, organizing student engineers to ship free software for non-profits that couldn\'t otherwise afford it — the experience that proved technology, well-directed, is the highest-leverage tool a mission-driven organization has.',

      'contact.tag': 'Start a Project',
      'contact.title': 'Let\'s build something<br /><span class="gradient-text">that matters.</span>',
      'contact.cta': 'Book a Call',

      'footer.copy': '© 2026 Hudson Technology Solutions LLC. Jersey City, NJ.'
    },
    es: {
      'nav.services': 'Servicios',
      'nav.work': 'Proyectos',
      'nav.about': 'Acerca',
      'nav.cta': 'Reservar una Llamada',

      'hero.badge': 'Ubicado en Jersey City, NJ',
      'hero.title1': 'Impulsándo<em class="gradient-text">te</em> hacia adelante',
      'hero.ctaPrimary': 'Ver Nuestros Proyectos',
      'hero.ctaSecondary': 'Iniciar un Proyecto',
      'hero.statClients': 'Clientes Atendidos',
      'hero.statSaved': 'Ahorrados',

      'services.tag': 'Lo Que Hacemos',
      'services.title': 'Soluciones de ingeniería<br />en la intersección del<br /><span class="gradient-text">código y la comunidad.</span>',
      'services.valueHeading': 'El mundo cambió. ¿Y tú?',
      'services.valuePara1': 'La inteligencia artificial está transformando industrias enteras. Los clientes esperan experiencias instantáneas y móviles. Tu competencia — incluso la más pequeña — está automatizando lo que a tu equipo le toma toda la semana. Las organizaciones que prosperan hoy no son las más grandes, sino las más rápidas. Y ahora mismo, la velocidad depende del software.',
      'services.valuePara2': 'Sin embargo, la mayoría de los pequeños negocios y organizaciones sin fines de lucro siguen funcionando con hojas de cálculo, herramientas desconectadas y procesos manuales que ya estaban obsoletos hace cinco años. Cada hora que tu personal dedica a la entrada de datos, reportes copiados a mano o persiguiendo información entre bandejas de entrada, es una hora que no se invierte en lo que realmente hace crecer tu organización. Esa brecha no se queda quieta — se amplía cada trimestre.',
      'services.valuePara3': 'El software personalizado cierra esa brecha. Una sola aplicación bien construida puede automatizar tus flujos de trabajo más costosos, darle a tu equipo visibilidad en tiempo real y crear la experiencia digital fluida que tus clientes y comunidad ahora esperan. Es la misma ventaja operativa que las empresas Fortune 500 han usado por décadas — diseñada para tu presupuesto, tu flujo de trabajo y tus objetivos.',
      'services.valuePara4': 'La pregunta no es si tu organización necesita tecnología — es cuánto tiempo puedes darte el lujo de esperar. Te ayudamos a dejar de quedarte atrás y empezar a construir las herramientas que te pongan adelante.',

      'services.card1Title': 'Diseño / Desarrollo Web',
      'services.card1Desc': 'Sitios web pulidos, rápidos y enfocados en conversión para organizaciones que necesitan una presencia digital sólida sin la complejidad de una aplicación completa. Ideales para páginas de aterrizaje, portafolios, sitios de pequeños negocios y blogs.',
      'services.benefit1': '<strong>Primeras impresiones impactantes.</strong> Páginas diseñadas a medida que generan confianza desde el primer instante — modernas, con tu marca y adaptadas a móviles.',
      'services.benefit2': '<strong>Rendimiento ultrarrápido.</strong> Sitios ligeros y codificados a mano que cargan al instante — sin sobrecarga, sin plugins innecesarios.',
      'services.benefit3': '<strong>Diseñados para convertir.</strong> Llamados a la acción claros, formularios de contacto y flujos de páginas que convierten visitantes en clientes potenciales calificados.',

      'services.card2Title': 'Desarrollo Web Full-Stack',
      'services.card2Desc': 'Aplicaciones web complejas y personalizadas con backends seguros, bases de datos y cuentas de usuario. Construidas para automatizar flujos de trabajo, generar nuevos ingresos y escalar junto a tu organización a medida que creces.',
      'services.benefit4': '<strong>Desarrollo de principio a fin.</strong> Frontend, backend y base de datos — todo desarrollado por un solo socio dedicado que entiende el panorama completo desde el día uno.',
      'services.benefit5': '<strong>Reduce costos operativos.</strong> Automatiza entrada de datos, informes, programación y facturación para que tu equipo se enfoque en lo que realmente importa, no en tareas manuales.',
      'services.benefit6': '<strong>Desbloquea nuevos ingresos.</strong> Plataformas de suscripción, reservas en línea, pagos seguros y portales de miembros — diseñados para abrir canales de ingresos que tu configuración actual no puede sostener.',


      'work.tag': 'Proyectos Destacados',
      'work.title': 'Productos que resuelven<br /><span class="gradient-text">problemas reales.</span>',
      'work.museCat': 'Plataforma Sin Fines de Lucro',
      'work.museDesc': '<a href="https://www.jerseycitypoetryfestival.org/">Melida Rodas, Poeta Laureada de Jersey City</a>, necesitaba centralizar el calendario cultural disperso de la ciudad — y financiar su organización sin fines de lucro al mismo tiempo. La solución: una plataforma de eventos con mapa interactivo donde los artistas locales descubren lo que está pasando, mientras que las suscripciones de pago permiten a los organizadores publicar sus propios eventos — convirtiendo un recurso comunitario en una fuente recurrente de ingresos para la organización.',
      'work.housesCat': 'Automatización Cívica',
      'work.housesDesc': '<a href="https://www.quetzalconsultingnj.com/affordablehousingstock" target="_blank" rel="noopener">Quetzal Consulting</a> perdía horas cada semana en búsquedas manuales de datos del Censo para cada Plan de Comercialización de Vivienda Justa Afirmativa que presentaba al Departamento de Vivienda Asequible de Jersey City. La solución: una herramienta de automatización que convierte horas de trabajo por propiedad en minutos — ahorrando al dueño varias horas cada mes en toda una cartera inmobiliaria, y liberándolo para tomar más clientes.',
      'work.bandsCat': 'Descubrimiento Musical con IA',
      'work.bandsDesc': 'Las listas de conciertos locales están dispersas en una docena de plataformas, dejando a los fans adivinando dónde pasar su noche. La solución: una app de descubrimiento que reúne esas listas en un solo lugar y luego añade Claude de Anthropic encima — los usuarios eligen los géneros que les gustan y la app destaca los shows más vale la pena ver, convirtiendo el caos de los eventos locales en un cartel curado para esta noche.',
      'work.viewProject': 'Ver Proyecto',

      'about.tag': 'Acerca',
      'about.title': 'Un desarrollador<br />con experiencia a<br /><span class="gradient-text">cualquier escala.</span>',
      'about.leadRole': 'Desarrollador Principal y Fundador',
      'about.leadBio': 'Roberto es resolutor de problemas primero, ingeniero después. Tras perfeccionar su oficio en Pinterest, PSEG y PowerOptions, fundó Hudson Technology Solutions para hacer por las organizaciones pequeñas lo que la ingeniería de las grandes tecnológicas hace por las Fortune 500 — convertir el dolor operativo en resultados medibles. Cada proyecto se entrega de sus propias manos, desde la primera conversación hasta el lanzamiento final.',

      'about.bio1': 'Hudson Technology Solutions fue fundada por <strong>Roberto Rodas-Herndon</strong>, graduado en Ciencias de la Computación de Boston University. Como <strong>Presidente del capítulo de Hack4Impact de BU (2021–2023)</strong>, lideró a ingenieros estudiantes en la entrega de software gratuito para organizaciones sin fines de lucro con pocos recursos — demostrando desde temprano que el código correcto, en las manos correctas, cambia lo que una organización realmente puede lograr.',
      'about.bio2': 'Desde construir herramientas internas en la sede de <strong>Pinterest</strong> en San Francisco hasta entregar análisis de datos a toda la empresa en <strong>PSEG</strong>, hemos resuelto problemas a todas las escalas. La lección: los mismos principios de ingeniería que hacen avanzar a una empresa de servicios públicos pueden transformar a un negocio local — cuando los aplica alguien que realmente entiende el problema.',
      'about.bio3': 'Cada proyecto se entrega con arquitectura moderna, resultados medibles y un enfoque incansable en los resultados. También somos <strong>bilingües (inglés y español)</strong>, para que las diversas comunidades a las que servimos puedan colaborar en su propio idioma.',

      'timeline.role1': 'Fundé Hudson Technology Solutions LLC',
      'timeline.role2': 'Científico de Datos — PSEG',
      'timeline.desc2': 'Convirtió datos brutos en recomendaciones estratégicas en una de las mayores empresas de energía y servicios públicos de EE.UU. — un trabajo que informó decisiones que afectan a millones de clientes en Nueva Jersey.',
      'timeline.role3': 'Ingeniero de Datos — PowerOptions',
      'timeline.desc3': 'Construyó tuberías de datos para el mayor consorcio de compra de energía de Nueva Inglaterra, convirtiendo datos de mercado en la palanca que las organizaciones sin fines de lucro y entidades públicas usan para negociar mejores tarifas de electricidad y gas natural.',
      'timeline.role4': 'Ingeniero de Software — Pinterest',
      'timeline.desc4': 'Entregó herramientas internas de observabilidad en la sede de Pinterest en San Francisco — dándole a ingenieros senior la visibilidad necesaria para mantener una plataforma que sirve a cientos de millones de usuarios funcionando sin problemas.',
      'timeline.role5': 'Presidente — BU Hack4Impact',
      'timeline.desc5': 'Lideró el capítulo de Boston University durante dos años, organizando a ingenieros estudiantes para entregar software gratuito a organizaciones sin fines de lucro que no podían pagarlo — la experiencia que demostró que la tecnología, bien dirigida, es la herramienta de mayor impacto que tiene una organización con misión social.',

      'contact.tag': 'Iniciar un Proyecto',
      'contact.title': 'Construyamos algo<br /><span class="gradient-text">que importe.</span>',
      'contact.cta': 'Reservar una Llamada',

      'footer.copy': '© 2026 Hudson Technology Solutions LLC. Jersey City, NJ.'
    }
  };

  function applyLanguage(lang) {
    const dict = translations[lang] || translations.en;

    document.querySelectorAll('[data-i18n]').forEach((el) => {
      const key = el.getAttribute('data-i18n');
      if (dict[key] !== undefined) el.textContent = dict[key];
    });

    document.querySelectorAll('[data-i18n-html]').forEach((el) => {
      const key = el.getAttribute('data-i18n-html');
      if (dict[key] !== undefined) el.innerHTML = dict[key];
    });

    document.documentElement.setAttribute('lang', lang);

    document.querySelectorAll('.lang-opt').forEach((opt) => {
      opt.classList.toggle('active', opt.getAttribute('data-lang') === lang);
    });

    try { localStorage.setItem('hudsontech_lang', lang); } catch (e) {}
  }

  const toggle = document.getElementById('langToggle');
  if (toggle) {
    toggle.addEventListener('click', () => {
      const current = document.documentElement.getAttribute('lang') || 'en';
      applyLanguage(current === 'en' ? 'es' : 'en');
    });
  }

  let saved = 'en';
  try { saved = localStorage.getItem('hudsontech_lang') || 'en'; } catch (e) {}
  applyLanguage(saved);
})();

/* ===== SMOOTH SCROLL FOR ANCHOR LINKS ===== */
document.querySelectorAll('a[href^="#"]').forEach((a) => {
  a.addEventListener('click', (e) => {
    const target = document.querySelector(a.getAttribute('href'));
    if (target) {
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  });
});
