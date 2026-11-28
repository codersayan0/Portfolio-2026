/* ================================================================
   SAYAN MANDAL PORTFOLIO v2 — main.js
   ================================================================ */

/* ---- INTRO LOADER ---- */
/* ---- THREE.JS STAR FIELD ---- */
function initStars() {
  const canvas = document.getElementById('bg-canvas');
  if (!canvas || canvas.dataset.starsReady || typeof THREE === 'undefined' || matchMedia('(max-width: 768px), (prefers-reduced-motion: reduce)').matches) return;

  let renderer; try { renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: false }); } catch { return; }
  canvas.dataset.starsReady = "true";
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
  renderer.setSize(window.innerWidth, window.innerHeight);

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 1000);
  camera.position.z = 90;

  // Stars
  const starGeo = new THREE.BufferGeometry();
  const COUNT = 650;
  const pos = new Float32Array(COUNT * 3);
  for (let i = 0; i < COUNT * 3; i++) pos[i] = (Math.random() - 0.5) * 280;
  starGeo.setAttribute('position', new THREE.BufferAttribute(pos, 3));
  const starMat = new THREE.PointsMaterial({ color: 0x00f5d4, size: 0.35, transparent: true, opacity: 0.5 });
  const stars = new THREE.Points(starGeo, starMat);
  scene.add(stars);

  // Grid lines for depth
  const gridGeo = new THREE.BufferGeometry();
  const gridPos = [];
  for (let i = -5; i <= 5; i++) {
    gridPos.push(i * 12, -40, -60, i * 12, -40, -140);
    gridPos.push(-60, -40, i * 12 - 100, 60, -40, i * 12 - 100);
  }
  gridGeo.setAttribute('position', new THREE.BufferAttribute(new Float32Array(gridPos), 3));
  const gridMat = new THREE.LineBasicMaterial({ color: 0x00f5d4, transparent: true, opacity: 0.08 });
  scene.add(new THREE.LineSegments(gridGeo, gridMat));

  let mx = 0, my = 0;
  document.addEventListener('mousemove', e => {
    mx = (e.clientX / window.innerWidth - 0.5) * 0.3;
    my = (e.clientY / window.innerHeight - 0.5) * 0.2;
  });

  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  function tick() {
    requestAnimationFrame(tick);
    if (document.hidden || document.documentElement.dataset.theme === 'light') return;
    stars.rotation.y += 0.0003 + mx * 0.0006;
    stars.rotation.x += 0.0001 + my * 0.0004;
    renderer.render(scene, camera);
  }
  if (reduceMotion) renderer.render(scene, camera); else tick();

  window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
  });
}
initStars();
document.getElementById("three-library")?.addEventListener("load", initStars, {once:true});

/* ---- CUSTOM CURSOR ---- */
const dot  = document.querySelector('.cursor-dot');
const ring = document.querySelector('.cursor-ring');
let rx = 0, ry = 0, ax = 0, ay = 0;

document.addEventListener('mousemove', e => {
  ax = e.clientX; ay = e.clientY;
  if (dot) { dot.style.left = ax + 'px'; dot.style.top = ay + 'px'; }
});

(function lagRing() {
  if (!matchMedia('(pointer: fine) and (prefers-reduced-motion: no-preference)').matches) return;
  if (ring) {
    rx += (ax - rx) * 0.1;
    ry += (ay - ry) * 0.1;
    ring.style.left = rx + 'px';
    ring.style.top  = ry + 'px';
  }
  requestAnimationFrame(lagRing);
})();

document.querySelectorAll('a, button, .skill-card, .project-card, .feature, .tech-icon-item').forEach(el => {
  el.addEventListener('mouseenter', () => ring && ring.classList.add('expand'));
  el.addEventListener('mouseleave', () => ring && ring.classList.remove('expand'));
});

/* ---- HEADER SCROLL ---- */
const header = document.getElementById('header');
window.addEventListener('scroll', () => {
  header.classList.toggle('scrolled', window.scrollY > 50);
});

/* ---- SCROLL UP ---- */
const scrollUpBtn = document.getElementById('scroll-up');
window.addEventListener('scroll', () => {
  scrollUpBtn.classList.toggle('show', window.scrollY > 500);
});

/* ---- ACTIVE NAV LINK ---- */
const sections = document.querySelectorAll('section[id]');
function setActiveLink() {
  const y = window.scrollY + 130;
  sections.forEach(sec => {
    const top = sec.offsetTop;
    const bot = top + sec.offsetHeight;
    const id  = sec.getAttribute('id');
    const link = document.querySelector(`.nav__link[href="#${id}"]`);
    if (link) link.classList.toggle('active-link', y >= top && y < bot);
  });
}
window.addEventListener('scroll', setActiveLink);

/* ---- MOBILE NAV ---- */
const navMenu   = document.getElementById('nav-menu');
const navToggle = document.getElementById('nav-toggle');

navToggle.addEventListener('click', () => {
  const open = navMenu.classList.toggle('open');
  navToggle.setAttribute('aria-expanded', String(open));
  const spans = navToggle.querySelectorAll('span');
  if (open) {
    spans[0].style.transform = 'translateY(7px) rotate(45deg)';
    spans[1].style.opacity = '0';
    spans[2].style.transform = 'translateY(-7px) rotate(-45deg)';
  } else {
    spans.forEach(s => { s.style.transform = ''; s.style.opacity = ''; });
  }
});

document.querySelectorAll('.nav__link').forEach(link => {
  link.addEventListener('click', () => {
    navMenu.classList.remove('open');
    navToggle.setAttribute('aria-expanded', 'false');
    navToggle.querySelectorAll('span').forEach(s => { s.style.transform = ''; s.style.opacity = ''; });
  });
});

/* ---- SKILL GROUPS: staggered reveal + cursor spotlight ---- */
(function () {
  const groups = document.querySelectorAll('.skill-group');
  if (!groups.length) return;
  const io = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); }
    });
  }, { threshold: 0.15 });
  document.querySelectorAll('.skill-chip img').forEach(im => im.addEventListener('error', () => im.remove()));
  groups.forEach(g => {
    io.observe(g);
    g.addEventListener('pointermove', e => {
      const r = g.getBoundingClientRect();
      g.style.setProperty('--mx', (e.clientX - r.left) + 'px');
      g.style.setProperty('--my', (e.clientY - r.top) + 'px');
    });
    g.addEventListener('mouseenter', () => ring && ring.classList.add('expand'));
    g.addEventListener('mouseleave', () => ring && ring.classList.remove('expand'));
  });
})();

/* ---- QUALIFICATION TABS ---- */
document.querySelectorAll('.qual__tab').forEach(tab => {
  tab.addEventListener('click', () => {
    document.querySelectorAll('.qual__tab').forEach(t => t.classList.remove('active'));
    document.querySelectorAll('.qual__content').forEach(c => c.classList.remove('active'));
    tab.classList.add('active');
    const c = document.getElementById('qtab-' + tab.dataset.qtab);
    if (c) c.classList.add('active');
  });
});

/* ---- CERTIFICATIONS — Open Google Drive ---- */
document.querySelectorAll('.view-cert-btn').forEach(btn => {
  btn.addEventListener('click', function (e) {
    e.preventDefault();
    const driveId = this.closest('.cert__card').dataset.drive;
    if (driveId && !driveId.startsWith('PASTE_')) {
      window.open('https://drive.google.com/file/d/' + driveId + '/view', '_blank');
    } else {
      showToast('Certificate link coming soon!');
    }
  });
});

/* ---- SCROLL REVEAL ---- */
const revealEls = document.querySelectorAll(
  '.section-header, .about__grid, .skill-card, ' +
  '.timeline__item, .project-card, .contact__info, ' +
  '.contact__form, .stat-card, .tech-marquee, .feature'
);
revealEls.forEach(el => el.classList.add('reveal'));
const revealObs = new IntersectionObserver((entries) => {
  entries.forEach((entry, i) => {
    if (entry.isIntersecting) {
      setTimeout(() => entry.target.classList.add('visible'), i * 60);
      revealObs.unobserve(entry.target);
    }
  });
}, { threshold: 0.08 });
revealEls.forEach(el => revealObs.observe(el));

/* ---- 3D CARD TILT ---- */
document.querySelectorAll('[data-tilt]').forEach(card => {
  card.addEventListener('mousemove', e => {
    if (e.target.closest('a')) return;
    const rect = card.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    const rx = ((e.clientY - cy) / (rect.height / 2)) * -7;
    const ry = ((e.clientX - cx) / (rect.width  / 2)) *  7;
    card.style.transform = `perspective(900px) rotateX(${rx}deg) rotateY(${ry}deg) translateY(-6px)`;
    card.style.boxShadow = `${-ry}px ${rx}px 40px rgba(0,245,212,0.12)`;
  });
  card.addEventListener('mouseleave', () => {
    card.style.transform = '';
    card.style.boxShadow = '';
  });
// Stop tilt when mouse is over links
  card.querySelectorAll('a').forEach(link => {
    link.addEventListener('mouseenter', () => {
      card.style.transform = '';
      card.style.boxShadow = '';
    });
  });
});

/* ---- CONTACT FORM ---- */
/* ---- CONTACT FORM (EmailJS) ---- */
function showToast(msg, isError = false) {
  const toast = document.getElementById('toast');
  if (!toast) return;
  toast.textContent = msg;
  toast.style.borderColor = isError ? '#ff2d6d' : 'var(--accent)';
  toast.classList.add('show');
  setTimeout(() => toast.classList.remove('show'), 4000);
}

function setFeedback(msg, type) {
  const fb = document.getElementById('form-feedback');
  if (!fb) return;
  fb.textContent = msg;
  fb.className = 'form-feedback ' + type;
  setTimeout(() => {
    fb.className = 'form-feedback';
    fb.textContent = '';
  }, 5000);
}

const contactForm = document.getElementById('contact-form');
if (contactForm) {
  contactForm.addEventListener('submit', function(e) {
    e.preventDefault();

    const btn     = document.getElementById('submit-btn');
    const btnText = document.getElementById('btn-text');
    const btnIcon = document.getElementById('btn-icon');

    const name    = document.getElementById('user_name').value.trim();
    const email   = document.getElementById('user_email').value.trim();
    const message = document.getElementById('message').value.trim();
    const subject = document.getElementById('subject').value.trim() || 'Portfolio Contact';

    /* Validation */
    if (!name) {
      setFeedback('✗ Please enter your name.', 'error'); return;
    }
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setFeedback('✗ Please enter a valid email.', 'error'); return;
    }
    if (!window.emailjs) { setFeedback("Email service unavailable. Please use the direct email link.", "error"); return; }
    if (name.length > 100 || email.length > 254 || subject.length > 150 || message.length > 3000) { setFeedback("Please shorten your message or details.", "error"); return; }
    if (!message) {
      setFeedback('✗ Please write a message.', 'error'); return;
    }

    /* Loading state */
    btn.disabled = true;
    btnText.textContent = 'Sending…';
    btnIcon.className = 'fas fa-spinner fa-spin';

    /* Send via EmailJS */
    emailjs.send('service_scqtr9i', 'template_9xyap4t', {
      user_name:  name,
      user_email: email,
      subject:    subject,
      message:    message
    })
    .then(() => {
      /* Success */
      btnText.textContent = 'Sent!';
      btnIcon.className = 'fas fa-check';
      btn.style.background = '#22c55e';
      btn.style.boxShadow = '0 0 24px rgba(34,197,94,0.4)';
      setFeedback('✓ Message sent! Thank you for reaching out.', 'success');
      showToast('✓ Message sent successfully!');
      contactForm.reset();

      setTimeout(() => {
        btnText.textContent = 'Send Message';
        btnIcon.className = 'fas fa-paper-plane';
        btn.style.background = '';
        btn.style.boxShadow = '';
        btn.disabled = false;
      }, 10000);
    })
    .catch((err) => {
      /* Error */
      console.error('EmailJS Error:', err);
      btnText.textContent = 'Send Message';
      btnIcon.className = 'fas fa-paper-plane';
      btn.disabled = false;
      setFeedback('✗ Failed. Email me at sayanmandal7212@gmail.com', 'error');
      showToast('✗ Send failed. Try emailing directly.', true);
    });
  });
}

/* ---- SCROLL PROGRESS BAR ---- */
(function () {
  const bar = document.getElementById('scroll-progress');
  if (!bar) return;
  const update = () => {
    const max = document.documentElement.scrollHeight - window.innerHeight;
    bar.style.transform = `scaleX(${max > 0 ? Math.min(window.scrollY / max, 1) : 0})`;
  };
  window.addEventListener('scroll', update, { passive: true });
  window.addEventListener('resize', update);
  update();
})();

/* ---- COUNT-UP NUMBERS ---- */
(function () {
  const els = document.querySelectorAll('[data-count]');
  const fmt = (el, v) => {
    const dec = parseInt(el.dataset.dec || '0', 10);
    el.textContent = v.toFixed(dec) + (el.dataset.suffix || '');
  };
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const obs = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (!e.isIntersecting) return;
      const el = e.target, end = parseFloat(el.dataset.count);
      obs.unobserve(el);
      if (reduce) { fmt(el, end); return; }
      const dur = 1400, t0 = performance.now();
      (function step(t) {
        const p = Math.min((t - t0) / dur, 1);
        fmt(el, end * (1 - Math.pow(1 - p, 3)));
        if (p < 1) requestAnimationFrame(step);
      })(t0);
    });
  }, { threshold: 0.4 });
  els.forEach(el => { fmt(el, parseFloat(el.dataset.count)); obs.observe(el); });
})();


/* ================================================================
   v4 — PROJECTS (data-driven grid + modal) and extra motion
   To add a project: add one object to PROJECTS below. That's it.
   cat: any of 'ai' | 'backend' | 'fullstack' | 'devops'
   ================================================================ */
(function () {
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const fine   = matchMedia('(hover: hover) and (pointer: fine)').matches;

  const PROJECTS = [
  {
    "name": "MediMitra",
    "fc": "#06b6d4",
    "cat": [
      "ai",
      "fullstack"
    ],
    "img": "images/projects/medimitra.webp",
    "status": "Deployed",
    "tag": "AI-powered multilingual healthcare platform",
    "desc": "A multilingual platform for patient case management, symptom analysis, report summarization and doctor appointment booking, bringing patients, doctors and admins together in one place.",
    "points": [
      "AI case interview with chat and voice input",
      "Report upload and summarization using RAG with the Gemini API",
      "Doctor appointment booking, unique patient ID generation and patient health history",
      "Role-based access (patient, doctor, admin) with JWT and email OTP authentication",
      "English, Bengali and Hindi support"
    ],
    "metrics": [
      [
        3,
        "User roles"
      ],
      [
        3,
        "Languages"
      ]
    ],
    "tags": [
      "React",
      "Vite",
      "TypeScript",
      "Tailwind CSS",
      "Python",
      "FastAPI",
      "MongoDB Atlas",
      "Gemini API",
      "RAG",
      "JWT",
      "EmailJS"
    ],
    "live": "https://medimitra-codersayan.vercel.app/"
  },
  {
    "name": "AgroPulse",
    "fc": "#22c55e",
    "cat": [
      "ai",
      "backend"
    ],
    "img": "images/projects/agropulse.webp",
    "status": "Deployed",
    "tag": "AI farm advisory for Indian farmers",
    "desc": "A multilingual farm advisory application offering crop, fertilizer and disease guidance through a mobile-friendly web interface.",
    "points": [
      "AI farm advisor on Gemini with voice input, in English, Hindi, Bengali, Tamil and Telugu",
      "Crop and fertilizer recommendation using Random Forest models trained on Kaggle datasets",
      "Leaf-photo disease detection through Gemini Vision, with a MobileNetV2 model kept as backup",
      "Live weather forecast and mandi prices; all API keys stay on the FastAPI backend"
    ],
    "metrics": [
      [
        6,
        "Modules"
      ],
      [
        5,
        "Languages"
      ]
    ],
    "tags": [
      "Python",
      "FastAPI",
      "Scikit-learn",
      "TensorFlow",
      "Gemini API",
      "OpenWeatherMap",
      "API Ninjas",
      "MongoDB Atlas",
      "Vercel",
      "Render"
    ],
    "live": "https://agro-pulse-two.vercel.app"
  },
  {
    "name": "SmartRoom",
    "fc": "#7b2fff",
    "cat": [
      "fullstack",
      "backend"
    ],
    "img": "images/projects/smartroom.webp",
    "status": "Deployed",
    "tag": "Intelligent classroom management platform",
    "desc": "A classroom platform where students sign in through a two-step check and teachers get a clear view of content, access requests and session activity.",
    "points": [
      "Two-step login: email OTP or face recognition (face-api.js in the browser, DeepFace on the backend)",
      "JWT role-based access for students and teachers, bcrypt password hashing, OTP auto-expiry via MongoDB TTL index",
      "Teacher dashboard: upload videos and files, approve registrations, view activity log, export CSV",
      "Automatic session tracking with login time and duration per student"
    ],
    "metrics": [
      [
        20,
        "API endpoints"
      ],
      [
        2,
        "Roles"
      ],
      [
        2,
        "Login factors"
      ]
    ],
    "tags": [
      "Python",
      "FastAPI",
      "MongoDB Atlas",
      "DeepFace",
      "face-api.js",
      "JWT",
      "SendGrid",
      "Cloudinary",
      "Vercel",
      "Render"
    ],
    "live": "https://smart-classroom-sayan.vercel.app",
    "gh": "https://github.com/codersayan0/SmartClassroom"
  },
  {
    "name": "MediaDrop DevOps",
    "fc": "#f59e0b",
    "cat": [
      "devops",
      "backend"
    ],
    "img": "images/projects/mediadrop.webp",
    "status": "Deployed",
    "tag": "Cloud-native video-to-audio platform",
    "desc": "A cloud-native video-to-audio conversion platform built with Python microservices, containerized with Docker, orchestrated on Kubernetes and deployed on AWS EKS.",
    "points": [
      "Microservices: authentication (JWT), API gateway for upload/download, video converter and email notifications",
      "Docker containers, Kubernetes orchestration and Helm-based deployment to AWS EKS",
      "RabbitMQ messaging between services, MongoDB for app data and PostgreSQL for metadata",
      "CI/CD with GitHub Actions (build, test, deploy), monitored with Prometheus and Grafana"
    ],
    "metrics": [],
    "tags": [
      "Python",
      "FastAPI",
      "Docker",
      "Kubernetes",
      "Helm",
      "AWS EKS",
      "RabbitMQ",
      "MongoDB",
      "PostgreSQL",
      "GitHub Actions",
      "Prometheus",
      "Grafana",
      "Render"
    ],
    "live": "https://video-audio-devops.onrender.com/",
    "gh": "https://github.com/codersayan0/video-audio-devops"
  },
  {
    "name": "Sayan's Chatbot",
    "fc": "#a855f7",
    "cat": [
      "ai"
    ],
    "img": "images/projects/chatbot.webp",
    "status": "On GitHub",
    "tag": "Multimodal AI chatbot with voice, text and image input",
    "desc": "Multimodal AI chatbot powered by Google Gemini Flash 1.5, built with Gradio. Accepts text, voice, and image inputs and responds with voice and text.",
    "points": [
      "Text, voice and image inputs in one interface",
      "Responds with both voice and text",
      "Powered by Google Gemini Flash 1.5 with a Gradio front end"
    ],
    "metrics": [],
    "tags": [
      "Python",
      "Gemini API",
      "Gradio",
      "Multimodal"
    ],
    "gh": "https://github.com/codersayan0/Sayan-Chatbot"
  },
  {
    "name": "Jarvis",
    "fc": "#ec4899",
    "cat": [
      "ai"
    ],
    "img": "images/projects/jarves.webp",
    "status": "On GitHub",
    "tag": "Python voice assistant built on NLP and automation",
    "desc": "Python-based virtual assistant built with NLP and automation. It answers by voice and handles everyday desktop tasks.",
    "points": [
      "Checks the time and date, searches Wikipedia",
      "Plays music, takes screenshots, tells jokes",
      "Controls the system (shutdown / restart)"
    ],
    "metrics": [],
    "tags": [
      "Python",
      "NLP",
      "Automation",
      "Speech"
    ],
    "gh": "https://github.com/codersayan0/Jarvis"
  }
];

  const grid = document.getElementById('pgrid');
  const modal = document.getElementById('pmodal');
  const bar = document.getElementById('pfilter');
  if (!grid || !modal) return;
  const ring = document.querySelector('.cursor-ring');
  const cols = () => (matchMedia('(max-width: 640px)').matches ? 2 : 3);
  const esc = s => String(s).replace(/[&<>"']/g, ch => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[ch]));

  /* ---- render cards ---- */
  grid.innerHTML = PROJECTS.map((p, i) => `
    <article class="pcard" tabindex="0" role="button" data-cat="${p.cat.join(' ')}" data-i="${i}" aria-label="${esc(p.name)} – open details" style="--fc:${p.fc};--i:${i % cols()}">
      <div class="pcard__img">
        <img src="${p.img}" alt="${esc(p.name)} project preview" width="1200" height="675" loading="lazy" />
        <span class="pcard__badge ${p.live ? '' : 'pcard__badge--src'}"><i></i>${p.status}</span>
      </div>
      <div class="pcard__body">
        <h3 class="pcard__title">${esc(p.name)}</h3>
        <p class="pcard__tag">${esc(p.tag)}</p>
        <div class="pcard__tags">${p.tags.slice(0, 3).map(t => `<span>${esc(t)}</span>`).join('')}</div>
        <div class="pcard__foot">
          <span class="pcard__more">Details <i class="fas fa-arrow-right"></i></span>
          <span class="pcard__links">
            ${p.live ? `<a href="${p.live}" target="_blank" rel="noopener noreferrer" aria-label="${esc(p.name)} live demo"><i class="fas fa-external-link-alt"></i></a>` : ''}
            ${p.gh ? `<a href="${p.gh}" target="_blank" rel="noopener noreferrer" aria-label="${esc(p.name)} on GitHub"><i class="fab fa-github"></i></a>` : ''}
          </span>
        </div>
      </div>
    </article>`).join('');
  const cards = [...grid.children];

  /* ---- reveal on scroll (staggered per row) ---- */
  const io = new IntersectionObserver(es => es.forEach(e => {
    if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); }
  }), { threshold: 0.12 });
  cards.forEach(c => io.observe(c));

  /* ---- spotlight, 3D tilt, cursor ring, open ---- */
  cards.forEach(c => {
    c.addEventListener('pointermove', e => {
      const r = c.getBoundingClientRect(), x = e.clientX - r.left, y = e.clientY - r.top;
      c.style.setProperty('--mx', x + 'px'); c.style.setProperty('--my', y + 'px');
      if (fine && !reduce) {
        c.style.setProperty('--rx', ((y / r.height - 0.5) * -7).toFixed(2) + 'deg');
        c.style.setProperty('--ry', ((x / r.width - 0.5) * 7).toFixed(2) + 'deg');
      }
    });
    c.addEventListener('pointerleave', () => { c.style.setProperty('--rx', '0deg'); c.style.setProperty('--ry', '0deg'); });
    c.addEventListener('mouseenter', () => ring && ring.classList.add('expand'));
    c.addEventListener('mouseleave', () => ring && ring.classList.remove('expand'));
    c.addEventListener('click', e => { if (!e.target.closest('a')) openModal(PROJECTS[c.dataset.i]); });
    c.addEventListener('keydown', e => {
      if ((e.key === 'Enter' || e.key === ' ') && e.target === c) { e.preventDefault(); openModal(PROJECTS[c.dataset.i]); }
    });
  });

  /* ---- filter ---- */
  bar.addEventListener('click', e => {
    const b = e.target.closest('button'); if (!b) return;
    bar.querySelectorAll('button').forEach(x => { x.classList.toggle('active', x === b); x.setAttribute('aria-pressed', String(x === b)); });
    const f = b.dataset.f;
    cards.forEach(c => c.classList.add('out'));
    setTimeout(() => {
      let n = 0;
      cards.forEach(c => {
        const show = f === 'all' || c.dataset.cat.split(' ').includes(f);
        c.hidden = !show;
        if (show) { c.style.setProperty('--i', n++ % cols()); c.classList.add('in'); requestAnimationFrame(() => c.classList.remove('out')); }
      });
    }, reduce ? 0 : 220);
  });

  /* ---- modal ---- */
  let modalTrigger;
  function openModal(p) {
    modalTrigger = document.activeElement;
    modal.style.setProperty('--fc', p.fc);
    modal.innerHTML = `
      <div class="pm">
        <button class="pm__x" data-close aria-label="Close"><i class="fas fa-xmark"></i></button>
        <div class="pm__img"><img src="${p.img}" alt="${esc(p.name)} banner" /></div>
        <div class="pm__body">
          <div class="pm__col">
            <h3 class="pm__title">${esc(p.name)}</h3>
            <p class="pm__tag">${esc(p.tag)}</p>
            <div class="pm__btns">
              ${p.live ? `<a class="project-card__btn" href="${p.live}" target="_blank" rel="noopener noreferrer"><i class="fas fa-external-link-alt"></i> Live Demo</a>` : ''}
              ${p.gh ? `<a class="project-card__btn project-card__btn--ghost" href="${p.gh}" target="_blank" rel="noopener noreferrer"><i class="fab fa-github"></i> GitHub</a>` : ''}
            </div>
            <p class="pm__desc">${esc(p.desc)}</p>
            ${p.metrics.length ? `<div class="pm__metrics">${p.metrics.map(m => `<div><b data-n="${m[0]}" data-dec="${m[3] || 0}" data-suf="${m[2] || ''}">0</b><span>${m[1]}</span></div>`).join('')}</div>` : ''}
          </div>
          <div class="pm__col">
            <ul class="pm__pts">${p.points.map(t => `<li><i class="fas fa-check"></i><span>${esc(t)}</span></li>`).join('')}</ul>
            <div class="pm__tags">${p.tags.map(t => `<span>${esc(t)}</span>`).join('')}</div>
          </div>
        </div>
      </div>`;
    modal.querySelectorAll('.pm__col > *').forEach((el, i) => el.style.setProperty('--k', i));
    document.body.style.overflow = 'hidden';
    modal.showModal();
    modal.querySelectorAll('[data-n]').forEach(el => {
      const end = parseFloat(el.dataset.n), dec = +el.dataset.dec, suf = el.dataset.suf;
      const put = v => { el.textContent = v.toFixed(dec) + suf; };
      if (reduce) return put(end);
      const t0 = performance.now();
      (function step(t) { const k = Math.min((t - t0) / 1100, 1); put(end * (1 - Math.pow(1 - k, 3))); if (k < 1) requestAnimationFrame(step); })(t0);
    });
  }
  function closeModal() {
    if (!modal.open) return;
    modal.classList.add('closing');
    setTimeout(() => { modal.close(); modal.classList.remove('closing'); }, reduce ? 0 : 220);
  }
  modal.addEventListener('click', e => { if (e.target === modal || e.target.closest('[data-close]')) closeModal(); });
  modal.addEventListener('cancel', e => { e.preventDefault(); closeModal(); });
  modal.addEventListener('close', () => { document.body.style.overflow = ''; modalTrigger?.focus(); });
})();

/* ---- Magnetic buttons + hero parallax (desktop pointers only) ---- */
(function () {
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (reduce || !matchMedia('(hover: hover) and (pointer: fine)').matches) return;

  document.querySelectorAll('.btn, .home__socials a, .social-pill').forEach(el => {
    let last = '0px 0px';
    el.addEventListener('pointermove', e => {
      const r = el.getBoundingClientRect();
      last = `${(e.clientX - r.left - r.width / 2) * 0.25}px ${(e.clientY - r.top - r.height / 2) * 0.35}px`;
      el.style.translate = last;
    });
    el.addEventListener('pointerleave', () => {
      el.animate({ translate: [last, '0px 0px'] }, { duration: 380, easing: 'cubic-bezier(.2,.8,.2,1)' });
      el.style.translate = '';
    });
  });

  const vis = document.querySelector('.home__visual');
  if (vis) document.addEventListener('pointermove', e => {
    vis.style.translate = `${(e.clientX / innerWidth - 0.5) * -18}px ${(e.clientY / innerHeight - 0.5) * -14}px`;
  }, { passive: true });
})();

/* ---- Section titles "decode" into place when they scroll in ---- */
(function () {
  if (matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  const glyphs = '01<>/{}_#$%*';
  const obs = new IntersectionObserver(es => es.forEach(e => {
    if (!e.isIntersecting) return;
    obs.unobserve(e.target);
    const el = e.target, txt = el.textContent; let f = 0;
    const id = setInterval(() => {
      f++;
      el.textContent = [...txt].map((c, i) => (c === ' ' || c === '&' || i < txt.length * f / 16) ? c : glyphs[Math.random() * glyphs.length | 0]).join('');
      if (f >= 16) { clearInterval(id); el.textContent = txt; }
    }, 38);
  }), { threshold: 0.8 });
  document.querySelectorAll('.section-title').forEach(t => obs.observe(t));
})();

