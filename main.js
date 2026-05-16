/* ================================================================
   SAYAN MANDAL PORTFOLIO v2 — main.js
   ================================================================ */

/* ---- THREE.JS STAR FIELD ---- */
(function initStars() {
  const canvas = document.getElementById('bg-canvas');
  if (!canvas || typeof THREE === 'undefined') return;

  const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: false });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
  renderer.setSize(window.innerWidth, window.innerHeight);

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 1000);
  camera.position.z = 90;

  // Stars
  const starGeo = new THREE.BufferGeometry();
  const COUNT = 1800;
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

  function tick() {
    requestAnimationFrame(tick);
    stars.rotation.y += 0.0003 + mx * 0.0006;
    stars.rotation.x += 0.0001 + my * 0.0004;
    renderer.render(scene, camera);
  }
  tick();

  window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
  });
})();

/* ---- CUSTOM CURSOR ---- */
const dot  = document.querySelector('.cursor-dot');
const ring = document.querySelector('.cursor-ring');
let rx = 0, ry = 0, ax = 0, ay = 0;

document.addEventListener('mousemove', e => {
  ax = e.clientX; ay = e.clientY;
  if (dot) { dot.style.left = ax + 'px'; dot.style.top = ay + 'px'; }
});

(function lagRing() {
  if (ring) {
    rx += (ax - rx) * 0.1;
    ry += (ay - ry) * 0.1;
    ring.style.left = rx + 'px';
    ring.style.top  = ry + 'px';
  }
  requestAnimationFrame(lagRing);
})();

document.querySelectorAll('a, button, .skill-card, .project-card, .tech-icon-item').forEach(el => {
  el.addEventListener('mouseenter', () => ring && ring.classList.add('expand'));
  el.addEventListener('mouseleave', () => ring && ring.classList.remove('expand'));
});

/* ---- TYPED.JS ---- */
window.addEventListener('load', () => {
  if (typeof Typed !== 'undefined') {
    new Typed('#typed-text', {
      strings: [
        'AI-Powered Systems.',
        'DevOps Pipelines.',
        'Python Applications.',
        'Intelligent Tools.',
        'Clean Solutions.'
      ],
      typeSpeed: 55,
      backSpeed: 35,
      backDelay: 1800,
      loop: true
    });
  }
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
    navToggle.querySelectorAll('span').forEach(s => { s.style.transform = ''; s.style.opacity = ''; });
  });
});

/* ---- SKILLS TABS ---- */
document.querySelectorAll('.skills__tab').forEach(tab => {
  tab.addEventListener('click', () => {
    document.querySelectorAll('.skills__tab').forEach(t => t.classList.remove('active'));
    document.querySelectorAll('.skills__panel').forEach(p => p.classList.remove('active'));
    tab.classList.add('active');
    const panel = document.getElementById('tab-' + tab.dataset.tab);
    if (panel) {
      panel.classList.add('active');
      panel.querySelectorAll('.skill-fill').forEach(f => {
        f.classList.remove('animate');
        void f.offsetWidth;
        f.classList.add('animate');
      });
    }
  });
});
setTimeout(() => {
  document.querySelectorAll('.skills__panel.active .skill-fill').forEach(f => f.classList.add('animate'));
}, 600);

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

/* ---- SCROLL REVEAL ---- */
const revealEls = document.querySelectorAll(
  '.section-header, .about__grid, .skill-card, ' +
  '.timeline__item, .project-card, .contact__info, ' +
  '.contact__form, .stat-card, .tech-marquee'
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
      setFeedback('✓ Message sent! I will reply within 24 hours.', 'success');
      showToast('✓ Message sent successfully!');
      contactForm.reset();

      setTimeout(() => {
        btnText.textContent = 'Send Message';
        btnIcon.className = 'fas fa-paper-plane';
        btn.style.background = '';
        btn.style.boxShadow = '';
        btn.disabled = false;
      }, 3000);
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