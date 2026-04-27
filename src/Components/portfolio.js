import { useEffect, useRef } from "react";



function ParticleCanvas() {
  const canvasRef = useRef(null);
  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    let W, H, particles = [], animId;

    function resize() {
      W = canvas.width = window.innerWidth;
      H = canvas.height = document.body.scrollHeight;
    }

    function Particle() {
      this.x = Math.random() * W; this.y = Math.random() * H;
      this.r = Math.random() * 1.5 + 0.3;
      this.vx = (Math.random() - 0.5) * 0.25; this.vy = (Math.random() - 0.5) * 0.25;
      this.alpha = Math.random() * 0.5 + 0.1;
      this.color = Math.random() > 0.5 ? "167,139,250" : "34,211,238";
    }
    Particle.prototype.update = function () {
      this.x += this.vx; this.y += this.vy;
      if (this.x < 0 || this.x > W) this.vx *= -1;
      if (this.y < 0 || this.y > H) this.vy *= -1;
    };
    Particle.prototype.draw = function () {
      ctx.beginPath(); ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(${this.color},${this.alpha})`; ctx.fill();
    };

    function initParticles() {
      particles = [];
      const count = Math.min(Math.floor((W * H) / 14000), 120);
      for (let i = 0; i < count; i++) particles.push(new Particle());
    }

    function connectParticles() {
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 110) {
            ctx.beginPath();
            ctx.strokeStyle = `rgba(167,139,250,${0.06 * (1 - dist / 110)})`;
            ctx.lineWidth = 0.5;
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.stroke();
          }
        }
      }
    }

    function animate() {
      ctx.clearRect(0, 0, W, H);
      particles.forEach(p => { p.update(); p.draw(); });
      connectParticles();
      animId = requestAnimationFrame(animate);
    }

    resize(); initParticles(); animate();
    const onResize = () => { cancelAnimationFrame(animId); resize(); initParticles(); animate(); };
    window.addEventListener("resize", onResize);
    return () => { cancelAnimationFrame(animId); window.removeEventListener("resize", onResize); };
  }, []);

  return <canvas ref={canvasRef} id="bg-canvas" />;
}

function CursorGlow() {
  const ref = useRef(null);
  useEffect(() => {
    const handler = e => {
      ref.current.style.left = e.clientX + "px";
      ref.current.style.top = (e.clientY + window.scrollY) + "px";
    };
    document.addEventListener("mousemove", handler);
    return () => document.removeEventListener("mousemove", handler);
  }, []);
  return <div className="cursor-glow" ref={ref} />;
}

function useReveal() {
  useEffect(() => {
    const observer = new IntersectionObserver(entries => {
      entries.forEach(el => {
        if (el.isIntersecting) {
          el.target.classList.add("visible");
          el.target.querySelectorAll("[data-target]").forEach(n => {
            const target = parseInt(n.dataset.target);
            const suffix = n.dataset.suffix || "+";
            let cur = 0;
            const step = Math.ceil(target / 40);
            const t = setInterval(() => {
              cur = Math.min(cur + step, target);
              n.textContent = cur + suffix;
              if (cur >= target) clearInterval(t);
            }, 30);
          });
        }
      });
    }, { threshold: 0.15 });
    document.querySelectorAll(".reveal").forEach(el => observer.observe(el));
    return () => observer.disconnect();
  }, []);
}

const skills = [
  { icon: "⚡", title: "Languages", tags: ["JavaScript ES6+", "TypeScript", "HTML5", "CSS3"], hi: [0, 1] },
  { icon: "⚛", title: "Frameworks", tags: ["React.js", "Redux Toolkit", "Zustand", "React Hooks", "Redux"], hi: [0, 1] },
  { icon: "🎨", title: "UI Libraries", tags: ["Material-UI", "Ant Design", "Tailwind CSS", "Styled Components", "CoreUI", "Bootstrap"], hi: [] },
  { icon: "🔌", title: "API & Real-Time", tags: ["RESTful APIs", "WebSocket", "Axios"], hi: [0, 1] },
  {
    icon: "🤖", title: "AI Tools", tags: [
      "ChatGPT",
      "Claude",
      "Gemini",
    ], hi: [0, 1]
  },
  { icon: "🛠", title: "Tools", tags: ["Git / GitHub", "VS Code", "Postman", "SCM"], hi: [] },
];

const projects = [
  { num: "01 — HOTEL BOOKING", title: "Multi-Role Booking System", desc: "Production-grade platform with role-based dashboards for Hotel Owners, Agencies & Corporate Clients. Three international payment gateways integrated.", tags: ["React.js", "Redux Toolkit", "Styled Components"], hi: [0] },
  { num: "02 — B2B PLATFORM", title: "Sales & Distribution Dashboard", desc: "Enterprise frontend serving 200+ distributors. Real-time inventory tracking, dynamic order management, and 8+ API integrations.", tags: ["React.js", "Material-UI", "Redux Toolkit"], hi: [0] },
  { num: "03 — REAL-TIME CHAT", title: "Internal Chat Tool", desc: "WebSocket-powered real-time communication. 40% re-render reduction via optimised Zustand store architecture and targeted subscriptions.", tags: ["React.js", "Zustand", "WebSocket"], hi: [0, 2] },
  {
    num: "04 — PORTFOLIO",
    title: "Personal Portfolio Website",
    desc: "Developer portfolio built based on my professional experience and projects, showcasing skills, work history, and real-world applications. Features interactive UI, animated particle background, and smooth scroll-based transitions for an engaging user experience.",
    tags: ["React.js", "CSS3", "Canvas API", "Responsive Design"],
    hi: [0, 2]
  }
];

const contacts = [
  { ico: "✉", label: "Email", val: "manikrish567@gmail.com", href: "mailto:manikrish567@gmail.com" },
  { ico: "in", label: "LinkedIn", val: "linkedin.com/in/manimaran05", href: "https://www.linkedin.com/in/mani-reactjs-developer/" },
  { ico: "GH", label: "GitHub", val: "github.com/Manikrish52", href: "https://github.com/Manikrish52" },
  { ico: "☎", label: "Phone", val: "+91 93618 44901", href: "tel:+919361844901" },
];

export default function Portfolio() {
  useEffect(() => {
    const s = document.createElement("style");
    s.textContent = CSS;
    document.head.appendChild(s);
    return () => document.head.removeChild(s);
  }, []);
  useReveal();

  return (
    <>
      <ParticleCanvas />
      <CursorGlow />

      <nav className="pf-nav">
        <span className="pf-logo">MK.DEV</span>
        <div className="pf-navlinks">
          {["skills", "experience", "projects", "contact"].map(s => (
            <a key={s} href={`#${s}`}>{s}</a>
          ))}
        </div>
      </nav>

      <div className="pf-hero">
        <div className="pf-hero-inner">
          <div className="pf-hero-chip"><span className="pf-dot" />Open to opportunities</div>
          <h1 className="pf-h1">
            <span className="pf-h1-name">ManiMaran K.</span>
            <span className="pf-h1-role">&lt; Frontend Developer /&gt;</span>
          </h1>
          <p className="pf-hero-desc">
            Crafting high-performance React.js applications — 2+ years shipping production apps across B2B, hospitality, and enterprise domains.
          </p>
          <div className="pf-hero-btns">
            <a href="mailto:manikrish567@gmail.com" className="pf-btn-p">Get in touch →</a>
            <a href="#projects" className="pf-btn-g">View work ↓</a>
          </div>
        </div>
      </div>

      <section id="about" className="pf-section" style={{ paddingTop: "1rem", paddingBottom: "1rem" }}>
        <div className="pf-stats reveal">
          {[
            { n: "2", s: "+", l: "Years exp." },
            { n: "4", s: "+", l: "Production apps" },
            { n: "40", s: "%", l: "Render reduction" },
            { n: "200", s: "+", l: "Distributors" },
            { n: "8", s: "+", l: "APIs integrated" },
          ].map(st => (
            <div className="pf-stat" key={st.l}>
              <span className="pf-stat-n" data-target={st.n} data-suffix={st.s}>0</span>
              <span className="pf-stat-l">{st.l}</span>
            </div>
          ))}
        </div>
      </section>

      <hr className="pf-hr" />

      <section id="skills" className="pf-section reveal">
        <h2 className="sec-h2">Technical skills</h2>
        <div className="pf-skills-grid">
          {skills.map(sk => (
            <div className="pf-skill" key={sk.title}>
              <div className="pf-skill-icon">{sk.icon}</div>
              <h3>{sk.title}</h3>
              <div className="pf-tags">
                {sk.tags.map((t, i) => <span key={t} className={`pf-tag${sk.hi.includes(i) ? " hi" : ""}`}>{t}</span>)}
              </div>
            </div>
          ))}
        </div>
      </section>

      <hr className="pf-hr" />

      <section id="experience" className="pf-section">
        <h2 className="sec-h2 reveal">Experience</h2>
        <div className="pf-exp-list">
          <div className="pf-exp reveal">
            <div>
              <div className="pf-exp-period">May 2025 — Feb 2026</div>
              <div className="pf-exp-co">Namlatech India Pvt Ltd</div>
            </div>
            <div className="pf-exp-body">
              <h3>Frontend Developer</h3>
              <ul className="pf-exp-ul">
                <li>Built multi-role hotel booking system with tailored dashboards for Hotel Owners, Agencies & Corporate Clients with role-based access control.</li>
                <li>Designed core user flows — Home, Hotel Listings, Details, Booking — fully responsive across all devices.</li>
                <li>Integrated 3 payment gateways: International Credit Cards, CIB/Dahabia, Wire Transfer.</li>
                <li>Sole frontend developer — drove end-to-end UI from wireframes to production in Agile environment.</li>
              </ul>
              <div className="pf-exp-tags">
                {["React.js", "Redux Toolkit", "Styled Components", "Agile"].map((t, i) => (
                  <span key={t} className={`pf-tag${i === 0 ? " hi" : ""}`}>{t}</span>
                ))}
              </div>
            </div>
          </div>
          <div className="pf-exp reveal">
            <div>
              <div className="pf-exp-period">Jan 2024 — Apr 2025</div>
              <div className="pf-exp-co">HEPL — CavinKare Group</div>
            </div>
            <div className="pf-exp-body">
              <h3>Frontend Developer</h3>
              <ul className="pf-exp-ul">
                <li>Delivered B2B Sales & Distribution Platform used by 200+ distributors with dynamic dashboards, order management, and real-time inventory tracking with 8+ RESTful APIs.</li>
                <li>Built time-tracking tool integrated with Java Spring Boot backend for 50+ employees — task logging, timesheets, manager approvals.</li>
                <li>Real-time WebSocket chat using Zustand — reduced re-renders by 40% through targeted store slicing.</li>
              </ul>
              <div className="pf-exp-tags">
                {["React.js", "Material-UI", "Redux Toolkit", "WebSocket", "Zustand"].map((t, i) => (
                  <span key={t} className={`pf-tag${i === 0 || i === 3 ? " hi" : ""}`}>{t}</span>
                ))}
              </div>
            </div>
          </div>
          <div className="pf-exp reveal">
            <div>
              <div className="pf-exp-co">Personal Project</div>
            </div>

            <div className="pf-exp-body">
              <h3>Frontend Developer — Portfolio Website</h3>
              <ul className="pf-exp-ul">
                <li>Developed a personal portfolio application showcasing professional experience, projects, and technical skills with a modern UI.
                </li>
                <li>
                  Implemented interactive particle background using Canvas API and optimized rendering for smooth performance.
                </li>
                <li>
                  Built reusable components and scroll-based animations using custom React hooks and Intersection Observer.
                </li>
                <li>
                  Designed fully responsive layouts ensuring seamless experience across desktop and mobile devices.
                </li>
              </ul>

              <div className="pf-exp-tags">
                {["React.js", "CSS3", "Canvas API", "Responsive Design"].map((t, i) => (
                  <span key={t} className={`pf-tag${i === 0 || i === 2 ? " hi" : ""}`}>
                    {t}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <hr className="pf-hr" />

      <section id="projects" className="pf-section">
        <h2 className="sec-h2 reveal">Projects</h2>
        <div className="pf-proj-grid">
          {projects.map((p, idx) => (
            <div className="pf-proj reveal" key={p.num} style={{ transitionDelay: `${idx * 0.1}s` }}>
              <div className="pf-proj-line" />
              <div className="pf-proj-num">{p.num}</div>
              <h3>{p.title}</h3>
              <p>{p.desc}</p>
              <div className="pf-tags">
                {p.tags.map((t, i) => <span key={t} className={`pf-tag${p.hi.includes(i) ? " hi" : ""}`}>{t}</span>)}
              </div>
            </div>
          ))}
        </div>
      </section>

      <hr className="pf-hr" />

      <section id="contact" className="pf-section reveal">
        <h2 className="sec-h2">Contact & education</h2>
        <div className="pf-contact-wrap">
          <div className="pf-contact-links">
            {contacts.map(c => (
              <a key={c.label} href={c.href} className="pf-clink" target={c.href.startsWith("http") ? "_blank" : undefined} rel="noreferrer">
                <div className="pf-clink-ico">{c.ico}</div>
                <div>
                  <div className="pf-clink-label">{c.label}</div>
                  <div className="pf-clink-val">{c.val}</div>
                </div>
                <span className="pf-clink-arr">→</span>
              </a>
            ))}
          </div>
          <div className="pf-edu">
            <div className="pf-edu-card">
              <span className="pf-edu-badge">Bachelors</span>
              <h3>BCA — Computer Applications</h3>
              <p>St. Joseph College of Arts & Science, Cuddalore<br />2020 – 2023 · CGPA 7.2 / 10</p>
            </div>
            <div className="pf-edu-card">
              <span className="pf-edu-badge">Higher Secondary</span>
              <h3>HSC — Science Stream</h3>
              <p>St. Antony's Matric Hr. Sec. School<br />2019 – 2020 · 70%</p>
            </div>
          </div>
        </div>
      </section>

      <footer className="pf-footer">
        <p>© 2026 ManiMaran K. — Cuddalore, Tamil Nadu</p>
        <p>React.js · Frontend Developer</p>
      </footer>
    </>
  );
}