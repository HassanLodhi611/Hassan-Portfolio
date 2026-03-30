import React, { useEffect, useRef } from 'react';
import styles from './Hero.module.css';

export default function Hero() {
  const canvasRef = useRef(null);

  /* ── Particle + grid canvas animation ── */
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let animId;

    const resize = () => {
      canvas.width  = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    };
    resize();
    window.addEventListener('resize', resize);

    const drawGrid = (W, H) => {
      ctx.strokeStyle = 'rgba(0,255,198,0.04)';
      ctx.lineWidth = 1;
      const s = 60;
      for (let x = 0; x < W; x += s) { ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, H); ctx.stroke(); }
      for (let y = 0; y < H; y += s) { ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(W, y); ctx.stroke(); }
    };

    class Particle {
      constructor(W, H) { this.W = W; this.H = H; this.reset(); }
      reset() {
        this.x     = Math.random() * this.W;
        this.y     = Math.random() * this.H;
        this.vx    = (Math.random() - 0.5) * 0.4;
        this.vy    = (Math.random() - 0.5) * 0.4;
        this.r     = Math.random() * 1.5 + 0.5;
        this.alpha = Math.random() * 0.5 + 0.1;
        this.color = Math.random() > 0.7 ? '255,77,109' : '0,255,198';
      }
      update() {
        this.x += this.vx; this.y += this.vy;
        if (this.x < 0 || this.x > this.W || this.y < 0 || this.y > this.H) this.reset();
      }
      draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${this.color},${this.alpha})`;
        ctx.fill();
      }
    }

    let particles = Array.from({ length: 80 }, () => new Particle(canvas.width, canvas.height));

    const drawConnections = (W) => {
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const d  = Math.sqrt(dx * dx + dy * dy);
          if (d < 120) {
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.strokeStyle = `rgba(0,255,198,${0.08 * (1 - d / 120)})`;
            ctx.lineWidth = 0.5;
            ctx.stroke();
          }
        }
      }
    };

    const frame = () => {
      const W = canvas.width, H = canvas.height;
      ctx.clearRect(0, 0, W, H);
      drawGrid(W, H);
      drawConnections(W);
      particles.forEach((p) => { p.update(); p.draw(); });
      animId = requestAnimationFrame(frame);
    };
    frame();

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', resize);
    };
  }, []);

  return (
    <section id="hero" className={styles.hero}>
      <div className={styles.canvasWrap}>
        <canvas ref={canvasRef} className={styles.canvas} />
      </div>

      <div className={styles.content}>
        {/* Left column */}
        <div className={styles.left}>
          <div className={styles.badge}>Available for opportunities</div>

          <h1 className={styles.name}>
            Hassan<br />
            <span className="accent-mint">Lodhi</span>
          </h1>

          <div className={styles.title}>
            Web Developer
            <span className={styles.slash}>/</span>
            Cybersecurity Enthusiast
          </div>

          <p className={styles.desc}>
            Building <code className={styles.code}>secure</code> and scalable web
            applications — bridging the gap between modern development and cybersecurity
            fundamentals.
          </p>

          <div className={styles.cta}>
            <a href="#projects" className="btn-primary">
              <span>⬡</span> View Projects
            </a>
            <a href="#contact" className="btn-secondary">
              <span>→</span> Contact Me
            </a>
          </div>

          <div className={styles.stats}>
            {[
              { num: '15+', label: ' projects built' },
              { num: '5+',  label: ' certifications' },
              { num: 'MERN',label: ' stack' },
              { num: '∞',   label: ' learning' },
            ].map((s) => (
              <div key={s.label} className={styles.statCard}>
                <div className={styles.statNum}>{s.num}</div>
                <div className={styles.statLabel}>{s.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Terminal */}
        <div className={styles.terminal}>
          <div className={styles.termHeader}>
            <span className={`${styles.dot} ${styles.dotRed}`}   />
            <span className={`${styles.dot} ${styles.dotYellow}`}/>
            <span className={`${styles.dot} ${styles.dotGreen}`} />
            <span className={styles.termTitle}>hassan@dev ~</span>
          </div>
          <div className={styles.termBody}>
            <div className={styles.tLine}><span className={styles.tPrompt}>$</span> cat about.json</div>
            <div className={styles.tLine}>{'{'}</div>
            <div className={styles.tLine}>&nbsp; <span className={styles.tKey}>"name"</span>: <span className={styles.tStr}>"Hassan Lodhi"</span>,</div>
            <div className={styles.tLine}>&nbsp; <span className={styles.tKey}>"role"</span>: <span className={styles.tStr}>"Web Developer"</span>,</div>
            <div className={styles.tLine}>&nbsp; <span className={styles.tKey}>"learning"</span>: [</div>
            <div className={styles.tLine}>&nbsp;&nbsp;&nbsp; <span className={styles.tStr}>"MERN Stack"</span>,</div>
            <div className={styles.tLine}>&nbsp;&nbsp;&nbsp; <span className={styles.tStr}>"Cybersecurity"</span></div>
            <div className={styles.tLine}>&nbsp; ],</div>
            <div className={styles.tLine}>&nbsp; <span className={styles.tKey}>"status"</span>: <span className={styles.tVal}>"building"</span></div>
            <div className={styles.tLine}>{'}'}</div>
            <div className={styles.tLine}><span className={styles.tPrompt}>$</span> <span className={styles.tCursor} /></div>
          </div>
        </div>
      </div>
    </section>
  );
}
