(() => {
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const cards = document.querySelectorAll('.project-card');
  const sections = document.querySelectorAll('.manifesto, .works, .contact');
  if (reduce) return;

  const reveal = new IntersectionObserver((entries, observer) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add('is-visible');
      observer.unobserve(entry.target);
    });
  }, { threshold: 0.14 });

  sections.forEach((section) => reveal.observe(section));
  cards.forEach((card) => reveal.observe(card));

  const trail = [];
  let last = 0;
  window.addEventListener('pointermove', (event) => {
    const now = performance.now();
    if (now - last < 38 || event.clientY > 260) return;
    last = now;
    const mark = document.createElement('i');
    mark.className = 'cursor-mark';
    mark.style.left = `${event.clientX}px`;
    mark.style.top = `${event.clientY}px`;
    mark.style.setProperty('--turn', `${Math.round((Math.random() - 0.5) * 34)}deg`);
    document.body.append(mark);
    trail.push(mark);
    window.setTimeout(() => {
      mark.remove();
      const index = trail.indexOf(mark);
      if (index !== -1) trail.splice(index, 1);
    }, 900);
    if (trail.length > 14) trail.shift().remove();
  }, { passive: true });
})();

(() => {
  const canvas = document.querySelector('#tower-paper');
  const stage = document.querySelector('.works-stage');
  if (!canvas || !stage || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  const ctx = canvas.getContext('2d');
  let w = 0, h = 0, dpr = 1, last = 0, elapsed = 0, next = 0, frame = 0;
  const paper = { x: 0, y: 0, angle: 0, phase: 0 };
  const resize = () => { w = stage.clientWidth; h = stage.clientHeight; dpr = Math.min(devicePixelRatio || 1, 2); canvas.width = w*dpr; canvas.height = h*dpr; ctx.setTransform(dpr,0,0,dpr,0,0); };
  const draw = () => {
    ctx.clearRect(0,0,w,h); if (!w) return;
    ctx.save(); ctx.translate(paper.x,paper.y); ctx.rotate(paper.angle);
    ctx.fillStyle = '#f5f1e8'; ctx.strokeStyle = '#151515'; ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(-64,-18); ctx.lineTo(-46,-43); ctx.lineTo(-15,-35); ctx.lineTo(10,-49); ctx.lineTo(48,-36); ctx.lineTo(68,-9);
    ctx.lineTo(54,22); ctx.lineTo(28,40); ctx.lineTo(-8,31); ctx.lineTo(-38,43); ctx.lineTo(-68,20); ctx.closePath();
    ctx.fill(); ctx.stroke();
    ctx.strokeStyle = '#aaa49a'; ctx.lineWidth = 1;
    ctx.beginPath(); ctx.moveTo(-42,-38); ctx.lineTo(-25,4); ctx.lineTo(-8,-34); ctx.moveTo(10,-47); ctx.lineTo(18,3); ctx.lineTo(53,-34); ctx.moveTo(-61,18); ctx.lineTo(-18,11); ctx.lineTo(28,38); ctx.moveTo(-8,31); ctx.lineTo(5,-7); ctx.lineTo(54,22); ctx.stroke();
    ctx.fillStyle = '#151515'; ctx.font = '700 15px Arial, sans-serif'; ctx.textAlign = 'center'; ctx.fillText('ozzystower',0,7);
    ctx.restore();
  };
  const tick = (now) => {
    if (document.hidden) { frame = requestAnimationFrame(tick); return; }
    const dt = Math.min((now-last)/1000 || 0, .04); last = now; elapsed += dt;
    if (elapsed >= next) { paper.x = w + 90; paper.y = h*.18; paper.angle = -.3; paper.phase = 0; next = elapsed + 4.2; }
    if (paper.x > -100) {
      paper.phase += dt;
      if (paper.phase < 1.1) { const t=paper.phase/1.1; paper.x=(w+90)+(w*.46-w-90)*t; paper.y=h*.18+(h*.82-h*.18)*t-Math.abs(Math.sin(t*8))*22; paper.angle=-.3+t*2.2; }
      else { const t=Math.min((paper.phase-1.1)/3.1,1); paper.x=w*.46+( -w*.42-w*.46)*t*t; paper.y=h*.82-Math.abs(Math.sin(t*12))*5; paper.angle=.5-t*8; }
      if (paper.phase>4.2) paper.x=-120;
    }
    draw(); frame=requestAnimationFrame(tick);
  };
  new ResizeObserver(resize).observe(stage); resize(); next=.3; frame=requestAnimationFrame(tick);
  window.addEventListener('beforeunload',()=>cancelAnimationFrame(frame),{once:true});
})();

