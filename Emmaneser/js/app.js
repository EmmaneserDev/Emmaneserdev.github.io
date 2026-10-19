(() => {
  'use strict';

  const $ = (sel, root = document) => root.querySelector(sel);
  const $$ = (sel, root = document) => Array.from(root.querySelectorAll(sel));

  // Year
  $('#year').textContent = new Date().getFullYear();

  // Navbar scroll effect
  const nav = $('#mainNav');
  const onScroll = () => {
    if (!nav) return;
    nav.classList.toggle('scrolled', window.scrollY > 18);
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  // Reveal on scroll (IntersectionObserver)
  const revealEls = $$('.reveal');
  if ('IntersectionObserver' in window) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) {
          e.target.classList.add('visible');
          io.unobserve(e.target);
        }
      });
    }, { threshold: 0.12 });
    revealEls.forEach(el => io.observe(el));
  } else {
    revealEls.forEach(el => el.classList.add('visible'));
  }

  // Typed role (simple, no deps)
  const roles = [
    'Full-Stack Software Developer',
    'Front-end & Back-end Engineer',
    'PHP / MySQL Developer',
    'Responsive UI & API Builder'
  ];


  const typedEl = $('#typedRole');
  if (typedEl) {
    let roleIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    const speed = 52;
    const deleteSpeed = 28;
    const pause = 900;

    const tick = () => {
      const role = roles[roleIndex];
      if (!isDeleting) {
        charIndex++;
        typedEl.textContent = role.slice(0, charIndex);
        if (charIndex >= role.length) {
          isDeleting = true;
          setTimeout(tick, pause);
          return;
        }
        setTimeout(tick, speed);
      } else {
        charIndex--;
        typedEl.textContent = role.slice(0, charIndex);
        if (charIndex <= 0) {
          isDeleting = false;
          roleIndex = (roleIndex + 1) % roles.length;
          setTimeout(tick, 200);
          return;
        }
        setTimeout(tick, deleteSpeed);
      }
    };
    tick();
  }

  // Animated counters when visible
  const counters = $$('[data-counter]');
  if ('IntersectionObserver' in window) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        const el = entry.target;
        const target = Number(el.getAttribute('data-counter')) || 0;
        const duration = 900 + Math.min(800, target * 8);
        const start = performance.now();

        const from = 0;
        const animate = (t) => {
          const p = Math.min(1, (t - start) / duration);
          const eased = 1 - Math.pow(1 - p, 3);
          el.textContent = Math.round(from + (target - from) * eased);
          if (p < 1) requestAnimationFrame(animate);
        };
        requestAnimationFrame(animate);
        io.unobserve(el);
      });
    }, { threshold: 0.25 });
    counters.forEach(c => io.observe(c));
  }

  // Smooth scroll for internal anchors
  document.addEventListener('click', (e) => {
    const a = e.target.closest('a[href^="#"]');
    if (!a) return;
    const href = a.getAttribute('href');
    if (!href || href.length < 2) return;
    const target = document.querySelector(href);
    if (!target) return;
    e.preventDefault();
    target.scrollIntoView({ behavior: 'smooth', block: 'start' });
  });

  // Data (replace placeholders)
  const PROJECTS = [
    {
      title: 'Realtime Dashboard',
      subtitle: 'Web app with streaming updates',
      tags: ['frontend', 'performance'],
      desc: 'Designed a realtime dashboard with responsive charts, state synchronization, and optimized rendering for smooth updates.',
      live: '#',
      repo: '#',
      meta: 'JavaScript • Performance • Responsive UI'
    },
    {
      title: 'API Platform',
      subtitle: 'REST APIs with clean architecture',
      tags: ['backend', 'testing'],
      desc: 'Built a scalable API layer with validation, structured errors, and automated tests to ensure reliability and maintainability.',
      live: '#',
      repo: '#',
      meta: 'Node.js • REST • Testing'
    },
    {
      title: 'E-commerce UI Kit',
      subtitle: 'Reusable components & UX polish',
      tags: ['frontend'],
      desc: 'Created a component-driven UI kit focused on accessibility, consistent design tokens, and micro-interactions.',
      live: '#',
      repo: '#',
      meta: 'UI/UX • Components • Accessibility'
    },
    {
      title: 'Performance Audit',
      subtitle: 'Faster pages, happier users',
      tags: ['performance', 'testing'],
      desc: 'Implemented performance improvements using profiling, caching strategies, and regression checks via automated testing.',
      live: '#',
      repo: '#',
      meta: 'Profiling • Caching • QA'
    },
    {
      title: 'Automation Suite',
      subtitle: 'CI workflows and quality gates',
      tags: ['testing', 'backend'],
      desc: 'Set up CI pipelines with linting, tests, and release checks to keep delivery predictable and safe.',
      live: '#',
      repo: '#',
      meta: 'CI/CD • Reliability • Testing'
    },
    {
      title: 'Client Portal',
      subtitle: 'Secure app with role-based UX',
      tags: ['backend', 'frontend'],
      desc: 'Developed a role-aware portal experience with secure API flows, intuitive navigation, and responsive layouts.',
      live: '#',
      repo: '#',
      meta: 'Security • UX • Responsive App'
    }
  ];

  const projectGrid = $('#projectGrid');
  const projectCount = $('#projectCount');
  const filterButtons = $$('.filter-btn');

  const projectModalEl = $('#projectModal');
  const projectModal = projectModalEl ? new bootstrap.Modal(projectModalEl) : null;

  const modalLabel = $('#projectModalLabel');
  const modalMeta = $('#projectModalMeta');
  const modalDesc = $('#projectModalDesc');
  const modalTags = $('#projectModalTags');
  const modalLive = $('#projectModalLive');
  const modalRepo = $('#projectModalRepo');

  const tagLabel = (t) => {
    switch (t) {
      case 'frontend': return 'Front-end';
      case 'backend': return 'Back-end';
      case 'performance': return 'Performance';
      case 'testing': return 'Testing';
      default: return t;
    }
  };

  const renderProjects = (filter = 'all') => {
    if (!projectGrid) return;
    projectGrid.innerHTML = '';

    const filtered = filter === 'all'
      ? PROJECTS
      : PROJECTS.filter(p => p.tags.includes(filter));

    if (projectCount) projectCount.textContent = `${filtered.length} ${filtered.length === 1 ? 'project' : 'projects'}`;

    filtered.forEach((p, idx) => {
      const card = document.createElement('div');
      card.className = 'project-card reveal';
      card.style.transitionDelay = `${Math.min(200, idx * 45)}ms`;
      card.tabIndex = 0;
      card.setAttribute('role', 'button');
      card.setAttribute('aria-label', `Open project: ${p.title}`);

      card.innerHTML = `
        <div class="pc-top">
          <div class="pc-title">${p.title}</div>
          <div class="pc-sub">${p.subtitle}</div>
        </div>
        <div class="pc-tags">${p.tags.map(t => `<span class="pc-tag">${tagLabel(t)}</span>`).join('')}</div>
      `;

      const open = () => {
        if (!projectModal) return;
        if (modalLabel) modalLabel.textContent = p.title;
        if (modalMeta) modalMeta.textContent = p.meta;
        if (modalDesc) modalDesc.textContent = p.desc;
        if (modalTags) modalTags.innerHTML = p.tags.map(t => `<span class="pc-tag">${tagLabel(t)}</span>`).join('');
        if (modalLive) modalLive.href = p.live || '#';
        if (modalRepo) modalRepo.href = p.repo || '#';
        projectModal.show();
      };

      card.addEventListener('click', open);
      card.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          open();
        }
      });

      projectGrid.appendChild(card);
    });

    // Ensure reveal works for injected cards
    const injected = $$('.project-card', projectGrid);
    if ('IntersectionObserver' in window) {
      const io = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            io.unobserve(entry.target);
          }
        });
      }, { threshold: 0.1 });
      injected.forEach(el => io.observe(el));
    } else {
      injected.forEach(el => el.classList.add('visible'));
    }
  };

  let activeFilter = 'all';

  const setFilter = (f) => {
    activeFilter = f;
    filterButtons.forEach(b => b.classList.toggle('active', b.dataset.filter === f));
    renderProjects(f);
  };

  filterButtons.forEach(btn => {
    btn.addEventListener('click', () => setFilter(btn.dataset.filter || 'all'));
  });

  renderProjects('all');

  // Skill -> project tag highlighting / filtering
  const skillRows = $$('.skill-row');
  const activeSkillLabel = $('#activeSkillLabel');

  const skillToFilter = (skillText) => {
    const s = (skillText || '').toLowerCase();
    if (s.includes('front')) return 'frontend';
    if (s.includes('back')) return 'backend';
    if (s.includes('performance')) return 'performance';
    if (s.includes('testing') || s.includes('test')) return 'testing';
    return 'all';
  };

  skillRows.forEach(row => {
    row.addEventListener('click', () => {
      skillRows.forEach(r => r.classList.remove('active'));
      row.classList.add('active');
      const skill = row.getAttribute('data-skill') || '';
      const f = skillToFilter(skill);
      if (activeSkillLabel) activeSkillLabel.textContent = `Selected: ${skill}`;
      setFilter(f === 'all' ? 'all' : f);
    });
  });

  // Tag interactions
  const tags = $$('#tagCloud .tag');
  const tagSetToFilter = (tag) => {
    if (tag === 'frontend') return 'frontend';
    if (tag === 'backend') return 'backend';
    if (tag === 'performance') return 'performance';
    if (tag === 'testing') return 'testing';
    return 'all';
  };

  tags.forEach(t => {
    t.addEventListener('click', () => {
      tags.forEach(x => x.classList.remove('active'));
      t.classList.add('active');
      const tag = t.dataset.tag || 'all';
      const f = tagSetToFilter(tag);
      if (activeSkillLabel) {
        const label = t.textContent.trim();
        activeSkillLabel.textContent = `Selected: ${label}`;
      }
      setFilter(f);
    });
  });

  // Contact form (demo)
  const contactForm = $('#contactForm');
  const status = $('#formStatus');
  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();

      const name = $('#name');
      const email = $('#email');
      const subject = $('#subject');
      const message = $('#message');

      const inputs = [name, email, subject, message].filter(Boolean);
      let valid = true;

      inputs.forEach(i => {
        if (typeof i.checkValidity === 'function' && !i.checkValidity()) {
          i.classList.add('is-invalid');
          valid = false;
        } else {
          i.classList.remove('is-invalid');
        }
      });

      if (!valid) {
        if (status) status.textContent = 'Please fix the highlighted fields.';
        return;
      }

      const toEmail = 'okereemmanuelobinna02@gmail.com';

      const mailTo = (raw) => encodeURIComponent(String(raw || ''));
      const subjectVal = subject?.value?.trim?.() || '';
      const bodyVal = [
        `Name: ${name?.value?.trim?.() || ''}`,
        `Email: ${email?.value?.trim?.() || ''}`,
        '',
        `${message?.value?.trim?.() || ''}`
      ].join('\n');

      const href = `mailto:${toEmail}?subject=${mailTo(subjectVal)}&body=${mailTo(bodyVal)}`;
      window.location.href = href;

      if (status) {
        status.textContent = 'Opening your email client...';
      }

      contactForm.reset();
    });


    // Real-time invalid feedback clearing
    contactForm.addEventListener('input', (e) => {
      const t = e.target;
      if (!t || !(t instanceof HTMLElement)) return;
      if (t.classList.contains('is-invalid')) {
        if (typeof t.checkValidity === 'function' && t.checkValidity()) t.classList.remove('is-invalid');
      }
    });
  }

  // Hero Canvas particles (lightweight)
  const canvas = $('#heroCanvas');
  if (canvas && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    const ctx = canvas.getContext('2d');
    let w = 0, h = 0;
    const DPR = Math.min(2, window.devicePixelRatio || 1);

    const rand = (a, b) => a + Math.random() * (b - a);

    const particles = [];
    const COUNT = 90;

    const resize = () => {
      w = window.innerWidth;
      h = window.innerHeight;
      canvas.width = Math.floor(w * DPR);
      canvas.height = Math.floor(h * DPR);
      canvas.style.width = w + 'px';
      canvas.style.height = h + 'px';
      ctx.setTransform(DPR, 0, 0, DPR, 0, 0);

      particles.length = 0;
      for (let i = 0; i < COUNT; i++) {
        particles.push({
          x: rand(0, w),
          y: rand(0, h),
          vx: rand(-0.35, 0.35),
          vy: rand(-0.25, 0.25),
          r: rand(1.0, 2.2),
          a: rand(0.18, 0.55),
        });
      }
    };

    resize();
    window.addEventListener('resize', resize, { passive: true });

    let mouse = { x: w / 2, y: h / 2, active: false };
    const onMove = (e) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
      mouse.active = true;
    };
    window.addEventListener('mousemove', onMove, { passive: true });
    window.addEventListener('mouseleave', () => mouse.active = false, { passive: true });

    const draw = () => {
      ctx.clearRect(0, 0, w, h);

      // subtle vignette
      const grad = ctx.createRadialGradient(w/2, h/2, 0, w/2, h/2, Math.max(w,h));
      grad.addColorStop(0, 'rgba(255,255,255,0.03)');
      grad.addColorStop(1, 'rgba(0,0,0,0.08)');
      ctx.fillStyle = grad;
      ctx.fillRect(0,0,w,h);

      for (const p of particles) {
        // mouse influence
        if (mouse.active) {
          const dx = p.x - mouse.x;
          const dy = p.y - mouse.y;
          const d2 = dx*dx + dy*dy;
          const influence = 130 * 130;
          if (d2 < influence) {
            const d = Math.sqrt(d2) || 1;
            const f = (1 - d / 130);
            p.vx += (-dx / d) * f * 0.004;
            p.vy += (-dy / d) * f * 0.004;
          }
        }

        // drift
        p.x += p.vx;
        p.y += p.vy;

        // wrap
        if (p.x < -10) p.x = w + 10;
        if (p.x > w + 10) p.x = -10;
        if (p.y < -10) p.y = h + 10;
        if (p.y > h + 10) p.y = -10;

        ctx.beginPath();
        ctx.fillStyle = `rgba(109,91,255,${p.a})`;
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fill();
      }

      // links
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const a = particles[i];
          const b = particles[j];
          const dx = a.x - b.x;
          const dy = a.y - b.y;
          const dist = Math.hypot(dx, dy);
          if (dist < 140) {
            const t = 1 - dist / 140;
            ctx.strokeStyle = `rgba(46,233,166,${0.22 * t})`;
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.moveTo(a.x, a.y);
            ctx.lineTo(b.x, b.y);
            ctx.stroke();
          }
        }
      }

      requestAnimationFrame(draw);
    };

    requestAnimationFrame(draw);
  }
})();

