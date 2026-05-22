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
      'nav.cta': 'Get in Touch',

      'hero.badge': 'Based in Jersey City, NJ',
      'hero.title1': 'Software',
      'hero.title2': 'that <em class="gradient-text">moves</em> you',
      'hero.title3': '<em class="gradient-text">forward</em>',
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

      'services.card3Title': 'CMS-Based Web Development',
      'services.card3Desc': 'Beautiful, easy-to-update websites built on platforms your team can manage on their own. WordPress and Squarespace builds with the polish of a custom site and the flexibility to edit content without touching code.',
      'services.benefit7': '<strong>Update without a developer.</strong> Publish news, events, and pages in minutes through an intuitive editor — no code, no waiting on outside help.',
      'services.benefit9': '<strong>Lower long-term costs.</strong> Your team handles routine updates in-house, keeping ongoing maintenance fees down without sacrificing professional polish.',

      'work.tag': 'Selected Work',
      'work.title': 'Products that solve<br /><span class="gradient-text">real problems.</span>',
      'work.museCat': 'Non-Profit Platform',
      'work.museDesc': 'A subscription-based platform built for <a href="https://www.jerseycitypoetryfestival.org/">Jersey City\'s Poet Laureate, Melida Rodas.</a> Local artists discover cultural events on an interactive map with calendar integration, while a paid subscription tier lets organizers post their own events — generating a recurring revenue stream for the non-profit.',
      'work.housesCat': 'Civic Automation',
      'work.housesDesc': 'Built for <a href="https://www.quetzalconsultingnj.com/affordablehousingstock" target="_blank" rel="noopener">Quetzal Consulting,</a> this tool automates Affirmative Fair Housing Marketing Plan reports for Jersey City\'s Department of Affordable Housing. What used to take the business owner several hours of manual Census data lookup per property is now generated in minutes — saving several hours every month across an entire real estate portfolio.',
      'work.bandsCat': 'AI Music Discovery',
      'work.bandsDesc': 'A live music discovery app that helps users find and favorite nearby concerts, with personalized recommendations powered by Anthropic\'s Claude AI. Users select the genres they\'re into, and the app surfaces shows they\'re most likely to love — turning the chaos of local event listings into a curated tonight\'s lineup.',
      'work.viewProject': 'View Project',

      'about.tag': 'About',
      'about.title': 'A developer<br />who\'s shipped at<br /><span class="gradient-text">every scale.</span>',
      'about.leadRole': 'Lead Developer & Founder',
      'about.leadBio': 'As the sole developer behind Hudson Technology Solutions, Roberto brings the engineering rigor he honed at Pinterest, PSEG, and PowerOptions directly to every client. No account managers, no offshore handoffs — just one engineer fully invested in your project from kickoff to launch.',

      'about.bio1': 'Hudson Technology Solutions was founded by <strong>Roberto Rodas-Herndon</strong>, a Boston University Computer Science graduate. While at Boston University, he served as <strong>President of the Hack4Impact chapter (2021–2023)</strong>, leading a student-run team that built free software for non-profits — the same mission that inspired the founding of this agency.',
      'about.bio2': 'From navigating <strong>Pinterest\'s</strong> codebase at their headquarters in San Francisco alongside senior engineers, to providing technical insights across the enterprise at <strong>PSEG</strong>, we bring big-company engineering rigor to organizations that need it most — those shaping their communities.',
      'about.bio3': 'Every project ships with modern architecture and a focus on real-world impact. We\'re also <strong>bilingual (English &amp; Spanish)</strong>, which helps us serve Hudson County\'s diverse communities directly in their language.',

      'timeline.role1': 'Founded Hudson Technology Solutions LLC',
      'timeline.role2': 'Data Scientist — PSEG',
      'timeline.desc2': 'Public Service Enterprise Group — one of the largest publicly-traded energy & utility companies in the U.S., serving millions of customers across New Jersey.',
      'timeline.role3': 'Data Engineer — PowerOptions',
      'timeline.desc3': 'New England\'s largest energy-buying consortium, helping non-profits and public entities negotiate better rates on electricity & natural gas.',
      'timeline.role4': 'Software Engineer Intern — Pinterest',
      'timeline.desc4': 'Image-sharing and social media platform headquartered in San Francisco, where Roberto built internal observability tools alongside senior engineers.',
      'timeline.role5': 'President — BU Hack4Impact',
      'timeline.desc5': 'A national network of college-student chapters that build free software for non-profits. Roberto led the Boston University chapter for two years.',

      'contact.tag': 'Start a Project',
      'contact.title': 'Let\'s build something<br /><span class="gradient-text">that matters.</span>',
      'contact.cta': 'Schedule a Free Call',

      'footer.copy': '© 2026 Hudson Technology Solutions LLC. Jersey City, NJ.'
    },
    es: {
      'nav.services': 'Servicios',
      'nav.work': 'Proyectos',
      'nav.about': 'Acerca',
      'nav.cta': 'Contáctame',

      'hero.badge': 'Ubicado en Jersey City, NJ',
      'hero.title1': 'Software',
      'hero.title2': 'que <em class="gradient-text">te impulsa</em>',
      'hero.title3': '<em class="gradient-text">hacia adelante</em>',
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

      'services.card3Title': 'Desarrollo Web con CMS',
      'services.card3Desc': 'Sitios web bonitos y fáciles de actualizar, construidos sobre plataformas que tu equipo puede gestionar por su cuenta. WordPress y Squarespace con la elegancia de un sitio personalizado y la flexibilidad de editar contenido sin tocar código.',
      'services.benefit7': '<strong>Actualiza sin un desarrollador.</strong> Publica noticias, eventos y páginas en minutos a través de un editor intuitivo — sin código, sin esperar ayuda externa.',
      'services.benefit9': '<strong>Menores costos a largo plazo.</strong> Tu equipo gestiona las actualizaciones rutinarias internamente, reduciendo los gastos de mantenimiento sin sacrificar la calidad profesional.',

      'work.tag': 'Proyectos Destacados',
      'work.title': 'Productos que resuelven<br /><span class="gradient-text">problemas reales.</span>',
      'work.museCat': 'Plataforma Sin Fines de Lucro',
      'work.museDesc': 'Una plataforma por suscripción creada para <a href="https://www.jerseycitypoetryfestival.org/">la Poeta Laureada de Jersey City, Melida Rodas.</a> Los artistas locales descubren eventos culturales en un mapa interactivo con calendario integrado, mientras que un nivel de suscripción de pago permite a los organizadores publicar sus propios eventos — generando una fuente recurrente de ingresos para la organización sin fines de lucro.',
      'work.housesCat': 'Automatización Cívica',
      'work.housesDesc': 'Creado para <a href="https://www.quetzalconsultingnj.com/affordablehousingstock" target="_blank" rel="noopener">Quetzal Consulting,</a> esta herramienta automatiza los informes del Plan de Comercialización de Vivienda Justa Afirmativa para el Departamento de Vivienda Asequible de Jersey City. Lo que antes le tomaba al dueño del negocio varias horas de búsqueda manual de datos del Censo por propiedad ahora se genera en minutos — ahorrando varias horas cada mes en toda una cartera inmobiliaria.',
      'work.bandsCat': 'Descubrimiento Musical con IA',
      'work.bandsDesc': 'Una app de descubrimiento de música en vivo que ayuda a los usuarios a encontrar y guardar conciertos cercanos, con recomendaciones personalizadas impulsadas por Claude de Anthropic. Los usuarios seleccionan los géneros que les gustan, y la app destaca los shows que más les encantarán — convirtiendo el caos de las listas de eventos locales en un cartel curado para esta noche.',
      'work.viewProject': 'Ver Proyecto',

      'about.tag': 'Acerca',
      'about.title': 'Un desarrollador<br />con experiencia a<br /><span class="gradient-text">cualquier escala.</span>',
      'about.leadRole': 'Desarrollador Principal y Fundador',
      'about.leadBio': 'Como único desarrollador detrás de Hudson Technology Solutions, Roberto aporta el rigor de ingeniería que perfeccionó en Pinterest, PSEG y PowerOptions directamente a cada cliente. Sin gestores de cuenta, sin entregas a terceros — solo un ingeniero totalmente comprometido con tu proyecto desde el inicio hasta el lanzamiento.',

      'about.bio1': 'Hudson Technology Solutions fue fundada por <strong>Roberto Rodas-Herndon</strong>, graduado en Ciencias de la Computación de Boston University. Durante sus estudios fue <strong>Presidente del capítulo de Hack4Impact (2021–2023)</strong>, liderando un equipo estudiantil que creaba software gratuito para organizaciones sin fines de lucro — la misma misión que inspiró la fundación de esta agencia.',
      'about.bio2': 'Desde navegar el código de <strong>Pinterest</strong> en su sede de San Francisco junto a ingenieros senior, hasta aportar perspectivas técnicas a toda la empresa en <strong>PSEG</strong>, traemos el rigor de ingeniería de grandes compañías a las organizaciones que más lo necesitan — aquellas que dan forma a sus comunidades.',
      'about.bio3': 'Cada proyecto se entrega con arquitectura moderna y enfoque en impacto real. También somos <strong>bilingües (inglés y español)</strong>, lo que nos permite servir a las diversas comunidades del condado de Hudson directamente en su idioma.',

      'timeline.role1': 'Fundé Hudson Technology Solutions LLC',
      'timeline.role2': 'Científico de Datos — PSEG',
      'timeline.desc2': 'Public Service Enterprise Group — una de las mayores empresas de energía y servicios públicos de EE.UU., atendiendo a millones de clientes en Nueva Jersey.',
      'timeline.role3': 'Ingeniero de Datos — PowerOptions',
      'timeline.desc3': 'El mayor consorcio de compra de energía de Nueva Inglaterra, ayudando a organizaciones sin fines de lucro y entidades públicas a negociar mejores tarifas de electricidad y gas natural.',
      'timeline.role4': 'Ingeniero de Software — Pinterest',
      'timeline.desc4': 'Plataforma de redes sociales con sede en San Francisco, donde Roberto desarrolló herramientas internas de observabilidad junto a ingenieros senior.',
      'timeline.role5': 'Presidente — BU Hack4Impact',
      'timeline.desc5': 'Una red nacional de capítulos universitarios que crean software gratuito para organizaciones sin fines de lucro. Roberto lideró el capítulo de Boston University durante dos años.',

      'contact.tag': 'Iniciar un Proyecto',
      'contact.title': 'Construyamos algo<br /><span class="gradient-text">que importe.</span>',
      'contact.cta': 'Agenda una Llamada Gratis',

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
