// Portfolio site logic: load config + projects, render sections, filters, modal, theming.
(function () {
  const els = {};
  const qs = (s, r = document) => r.querySelector(s);
  const qsa = (s, r = document) => Array.from(r.querySelectorAll(s));

  const defaultConfig = {
    name: "Your Name",
    role: "Data Scientist & GenAI Engineer",
    location: "Your City, Country",
    email: "your@email.com",
    github: "https://github.com/your-github",
    linkedin: "https://www.linkedin.com/in/your-linkedin/",
    twitter: "",
    resume_url: "#",
    hero_tagline: "Data Scientist & GenAI Engineer",
    hero_subtitle: "I build end-to-end machine learning and generative AI systems that create measurable business impact.",
    about_text: "I specialize in applied machine learning, LLM systems, and data engineering. I combine strong fundamentals with pragmatic execution to deliver production-ready solutions across NLP, vision, and time series.",
    phone: "",
    highlights: [
      "Production LLM apps: RAG, tools, evals",
      "MLOps: tracking, CI, serving, monitoring",
      "NLP, CV, time series forecasting",
      "Cloud: AWS/GCP; Vector DBs; GPUs"
    ],
    education: [
      {
        school: "Example University",
        degree: "M.S. Data Science",
        duration: "2023 – 2025",
        location: "City, Country",
        focus: "Graduate coursework in machine learning, AI, and big data engineering.",
        highlights: [
          "Capstone: NLP system for financial insights.",
          "Teaching assistant for Statistical Learning."
        ]
      }
    ],
    experience: [
      {
        company: "Example Corp",
        role: "Senior Data Scientist",
        duration: "2022 – Present",
        location: "Remote",
        summary: "Leading applied ML projects across NLP and time-series forecasting.",
        highlights: [
          "Reduced churn by 12% via uplift modeling.",
          "Scaled model serving with Kubernetes and MLflow."
        ]
      }
    ],
    certifications: [
      {
        title: "Advanced ML Certification",
        org: "Institute of Data",
        issued: "2024",
        link: "https://example.com/cert"
      }
    ],
    skills: [
      "Python", "PyTorch", "TensorFlow", "scikit-learn", "XGBoost",
      "LangChain", "OpenAI API", "LlamaIndex", "HuggingFace",
      "RAG", "Vector DBs", "LLM Orchestration", "Prompting",
      "Airflow", "Docker", "Kubernetes", "AWS", "GCP",
      "PostgreSQL", "BigQuery", "dbt", "Apache Spark"
    ],
    contact_text: "Open to collaborations, research, and roles in data science and generative AI. Let’s build something meaningful.",
    socials: [
      { label: "GitHub", href: "https://github.com/your-github" },
      { label: "LinkedIn", href: "https://www.linkedin.com/in/your-linkedin/" },
    ]
  };

  const defaultProjects = [
    {
      title: "RAG System for Enterprise Docs",
      description: "Retrieval‑Augmented Generation pipeline with chunking, hybrid search, and domain‑tuned reranking; robust evaluation and guardrails.",
      tags: ["LLM", "RAG", "VectorDB", "OpenAI"],
      tech: ["Python", "LangChain", "FAISS"],
      image: "assets/no-image.svg",
      github: "https://github.com/your-github/rag-enterprise",
      demo: "",
      stars: 5,
      date: "2024-06-01",
      featured: true
    },
    {
      title: "Demand Forecasting Platform",
      description: "Hierarchical time series forecasts with feature store, model ensembling, and ML monitoring. 18% MAPE improvement.",
      tags: ["Forecasting", "Time Series"],
      tech: ["Python", "Prophet", "LightGBM", "Airflow"],
      image: "assets/no-image.svg",
      github: "https://github.com/your-github/demand-forecasting",
      demo: "",
      stars: 4,
      date: "2023-12-15",
      featured: false
    },
    {
      title: "Defect Detection (Vision)",
      description: "Transfer learning + active learning loop for industrial defects; achieved 97% F1 on imbalanced dataset.",
      tags: ["Computer Vision", "ML"],
      tech: ["PyTorch", "FastAPI", "Docker"],
      image: "assets/no-image.svg",
      github: "https://github.com/your-github/defect-detection",
      demo: "",
      stars: 3,
      date: "2023-06-01",
      featured: false
    }
  ];

  async function loadJSON(path, fallback) {
    try {
      const res = await fetch(path, { cache: 'no-store' });
      if (!res.ok) throw new Error('HTTP ' + res.status);
      return await res.json();
    } catch (e) {
      return fallback;
    }
  }

  function setTheme(initial) {
    const saved = localStorage.getItem('theme');
    const theme = saved || initial || (window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark');
    if (theme === 'light') document.documentElement.setAttribute('data-theme', 'light');
  }

  function el(tag, attrs = {}, children = []) {
    const n = document.createElement(tag);
    for (const [k, v] of Object.entries(attrs)) {
      if (k === 'class') n.className = v;
      else if (k.startsWith('on') && typeof v === 'function') n.addEventListener(k.substring(2), v);
      else if (v != null) n.setAttribute(k, v);
    }
    for (const c of children) n.append(c);
    return n;
  }

  function renderConfig(c) {
    qs('#brandName').textContent = c.name;
    qs('#heroTitle').textContent = c.hero_tagline || c.role;
    qs('#heroSubtitle').textContent = c.hero_subtitle || '';
    qs('#resumeLink').href = c.resume_url || '#';
    const resumeBtn = qs('#resumeButton');
    if (resumeBtn) {
      resumeBtn.href = c.resume_url || '#';
      if (!c.resume_url || c.resume_url === '#') {
        resumeBtn.removeAttribute('target');
      }
    }
    qs('#linkedinLink').href = c.linkedin || '#';
    qs('#emailLink').href = c.email ? `mailto:${c.email}` : '#';
    qs('#locationText').textContent = c.location || '';
    qs('#footerName').textContent = c.name;
    qs('#year').textContent = new Date().getFullYear();
    qs('#aboutText').textContent = c.about_text || '';
    const phoneRow = qs('#phoneRow');
    const phoneLink = qs('#phoneLink');
    if (phoneRow && phoneLink) {
      if (c.phone) {
        phoneLink.textContent = c.phone;
        phoneLink.href = `tel:${c.phone.replace(/[^+\d]/g, '')}`;
        phoneRow.style.display = '';
      } else {
        phoneRow.style.display = 'none';
      }
    }

    const socials = qs('#socials');
    socials.innerHTML = '';
    (c.socials || []).forEach(s => {
      const a = el('a', { href: s.href, target: '_blank', rel: 'noopener', 'data-click-sfx': '' }, [s.label]);
      const li = el('li', {}, [a]);
      socials.append(li);
    });

    const highlights = qs('#highlights');
    highlights.innerHTML = '';
    (c.highlights || []).forEach(h => highlights.append(el('li', {}, [h])));

    const eduSection = qs('#education');
    const eduList = qs('#educationList');
    if (eduList) {
      eduList.innerHTML = '';
      const entries = c.education || [];
      if (!entries.length && eduSection) eduSection.style.display = 'none';
      entries.forEach(ed => {
        const item = el('article', { class: 'timeline-item' });
        const header = el('div', { class: 'timeline-header' });
        if (ed.degree) header.append(el('span', { class: 'timeline-degree' }, [ed.degree]));
        if (ed.duration) header.append(el('span', { class: 'timeline-duration' }, [ed.duration]));
        const meta = el('div', { class: 'timeline-meta' });
        if (ed.school) meta.append(el('span', { class: 'timeline-school' }, [ed.school]));
        if (ed.location) meta.append(el('span', { class: 'timeline-location' }, [ed.location]));
        item.append(header, meta);
        if (ed.focus) item.append(el('p', { class: 'timeline-focus' }, [ed.focus]));
        if (Array.isArray(ed.highlights) && ed.highlights.length) {
          const list = el('ul', { class: 'timeline-highlights' });
          ed.highlights.forEach(h => list.append(el('li', {}, [h])));
          item.append(list);
        }
        eduList.append(item);
      });
      if (eduSection) eduSection.style.display = entries.length ? '' : 'none';
    }

    const expSection = qs('#experience');
    const expRow = qs('#experienceRow');
    if (expRow) {
      expRow.innerHTML = '';
      const items = c.experience || [];
      if (!items.length && expSection) expSection.style.display = 'none';
      items.forEach(exp => {
        const card = el('article', { class: 'experience-card' });
        const header = el('div', { class: 'experience-header' });
        if (exp.role) header.append(el('span', { class: 'experience-role' }, [exp.role]));
        if (exp.duration) header.append(el('span', { class: 'experience-duration' }, [exp.duration]));
        const meta = el('div', { class: 'experience-meta' });
        if (exp.company) meta.append(el('span', { class: 'experience-company' }, [exp.company]));
        if (exp.location) meta.append(el('span', { class: 'experience-location' }, [exp.location]));
        card.append(header, meta);
        if (exp.summary) card.append(el('p', { class: 'experience-summary' }, [exp.summary]));
        if (Array.isArray(exp.highlights) && exp.highlights.length) {
          const list = el('ul', { class: 'experience-highlights' });
          exp.highlights.forEach(h => list.append(el('li', {}, [h])));
          card.append(list);
        }
        expRow.append(card);
      });
      if (expSection) expSection.style.display = items.length ? '' : 'none';
    }

    const certSection = qs('#certifications');
    const certList = qs('#certList');
    if (certList) {
      certList.innerHTML = '';
      const certs = c.certifications || [];
      if (!certs.length && certSection) certSection.style.display = 'none';
      certs.forEach(cert => {
        const card = el('article', { class: 'cert-card' });
        card.append(
          el('div', { class: 'cert-header' }, [
            el('span', { class: 'cert-title' }, [cert.title]),
            cert.issued ? el('span', { class: 'cert-issued' }, [cert.issued]) : ''
          ].filter(Boolean)),
          el('div', { class: 'cert-meta' }, [
            cert.org ? el('span', { class: 'cert-org' }, [cert.org]) : '',
            cert.id ? el('span', { class: 'cert-id' }, [`ID ${cert.id}`]) : '',
            cert.skills ? el('span', { class: 'cert-skill' }, [cert.skills]) : ''
          ].filter(Boolean))
        );
        if (cert.link) {
          card.append(el('a', { class: 'cert-link', href: cert.link, target: '_blank', rel: 'noopener', 'data-click-sfx': '' }, ['View credential']));
        }
        certList.append(card);
      });
      if (certSection) certSection.style.display = certs.length ? '' : 'none';
    }

    const skills = qs('#skillsList');
    skills.innerHTML = '';
    (c.skills || []).forEach(sk => skills.append(el('li', {}, [sk])));
  }

  function uniqueTags(projects) {
    const s = new Set();
    projects.forEach(p => (p.tags || []).forEach(t => s.add(t)));
    return Array.from(s).sort((a, b) => a.localeCompare(b));
  }

  function renderTagFilter(projects) {
    const tags = uniqueTags(projects);
    const sel = qs('#tagFilter');
    sel.innerHTML = '<option value="">All tags</option>';
    tags.forEach(t => sel.append(el('option', { value: t }, [t])));
  }

  function projectCard(p) {
    const card = el('article', { class: 'card', tabindex: '0' });
    const media = el('div', { class: 'card-media' });
    if (p.image) media.style.backgroundImage = `url('${p.image}')`;
    const body = el('div', { class: 'card-body' });
    const title = el('h3', { class: 'card-title' }, [p.title]);
    const desc = el('p', { class: 'card-desc' }, [p.description || '']);
    const chips = el('div', { class: 'chip-row' });
    (p.tags || []).forEach(t => chips.append(el('span', { class: 'chip' }, [t])));
    const actions = el('div', { class: 'card-actions' });
    if (p.github) actions.append(el('a', { href: p.github, target: '_blank', rel: 'noopener', 'data-click-sfx': '' }, ['GitHub']));
    if (p.demo) actions.append(el('a', { href: p.demo, target: '_blank', rel: 'noopener', 'data-click-sfx': '' }, ['Demo']));

    body.append(title, desc, chips);
    card.append(media, body, actions);

    card.addEventListener('click', (e) => {
      const tag = e.target.tagName.toLowerCase();
      if (tag === 'a' || e.target.closest('a')) return; // let links work
      openModal(p);
    });
    card.addEventListener('keydown', (e) => { if (e.key === 'Enter') openModal(p); });
    return card;
  }

  function renderProjects(projects) {
    const cont = qs('#projectsGrid');
    cont.innerHTML = '';
    projects.forEach(p => cont.append(projectCard(p)));
  }

  function filteredProjects(all) {
    const q = qs('#searchInput').value.trim().toLowerCase();
    const tag = qs('#tagFilter').value;
    const s = qs('#sortSelect').value;
    let res = all.filter(p => {
      const hay = [p.title, p.description, ...(p.tags || []), ...(p.tech || [])].join(' ').toLowerCase();
      const okQ = !q || hay.includes(q);
      const okT = !tag || (p.tags || []).includes(tag);
      return okQ && okT;
    });
    if (s === 'alpha') res.sort((a, b) => a.title.localeCompare(b.title));
    else if (s === 'stars') res.sort((a, b) => (b.stars || 0) - (a.stars || 0));
    else res.sort((a, b) => new Date(b.date || 0) - new Date(a.date || 0));
    return res;
  }

  function openModal(p) {
    const m = qs('#projectModal');
    const b = qs('#modalBody');
    b.innerHTML = '';
    b.append(
      el('div', { class: 'modal-header' }, [
        el('h3', { id: 'modalTitle', class: 'modal-title' }, [p.title]),
      ]),
      el('div', { class: 'modal-media', style: p.image ? `background: center/cover no-repeat url('${p.image}')` : '' }),
      el('p', {}, [p.description || '']),
      el('div', { class: 'chip-row', style: 'margin: 10px 0 6px' }, (p.tech || []).map(t => el('span', { class: 'chip' }, [t]))),
      el('div', { class: 'card-actions' }, [
        p.github ? el('a', { href: p.github, target: '_blank', rel: 'noopener', 'data-click-sfx': '' }, ['GitHub']) : '',
        p.demo ? el('a', { href: p.demo, target: '_blank', rel: 'noopener', 'data-click-sfx': '' }, ['Demo']) : ''
      ].filter(Boolean))
    );
    m.setAttribute('aria-hidden', 'false');
    if (window.SFX) SFX.open();
  }

  function closeModal() {
    qs('#projectModal').setAttribute('aria-hidden', 'true');
    if (window.SFX) SFX.close();
  }

  function wireModal() {
    qsa('[data-close-modal]').forEach(el => el.addEventListener('click', closeModal));
    document.addEventListener('keydown', (e) => { if (e.key === 'Escape') closeModal(); });
  }

  function wireNav() {
    const nav = qs('.site-nav');
    const toggle = qs('#navToggle');
    toggle?.addEventListener('click', () => nav.classList.toggle('open'));
    qsa('.site-nav a').forEach(a => a.addEventListener('click', () => nav.classList.remove('open')));
  }

  function wireFilters(state) {
    const update = () => renderProjects(filteredProjects(state.allProjects));
    ['searchInput', 'tagFilter', 'sortSelect'].forEach(id => qs('#' + id).addEventListener('input', update));
  }

  function wireTheme() {
    const btn = qs('#themeToggle');
    btn.addEventListener('click', () => {
      const isLight = document.documentElement.getAttribute('data-theme') === 'light';
      if (isLight) document.documentElement.removeAttribute('data-theme');
      else document.documentElement.setAttribute('data-theme', 'light');
      localStorage.setItem('theme', document.documentElement.getAttribute('data-theme') || 'dark');
      if (window.SFX) SFX.click();
    });
  }

  async function init() {
    setTheme();
    wireNav();
    wireModal();
    wireTheme();

    const [config, projects] = await Promise.all([
      loadJSON('data/config.json', defaultConfig),
      loadJSON('data/projects.json', defaultProjects)
    ]);

    renderConfig(config);
    renderTagFilter(projects);

    const state = { allProjects: projects };
    renderProjects(filteredProjects(state.allProjects));
    wireFilters(state);
  }

  window.addEventListener('DOMContentLoaded', init);
})();
