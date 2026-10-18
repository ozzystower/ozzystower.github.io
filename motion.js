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
  if (!canvas || !stage) return;
  const ctx = canvas.getContext('2d');
  if (!ctx) return;
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  let width = 1, height = 1;
  const duration = 3.6;
  const radius = 35;
  const clamp = x => Math.max(0, Math.min(1, x));
  const floor = () => height * .82;
  const resize = () => {
    width = Math.max(1, stage.clientWidth);
    height = Math.max(1, stage.clientHeight);
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = Math.round(width * dpr);
    canvas.height = Math.round(height * dpr);
    ctx.setTransform(dpr,0,0,dpr,0,0);
    if (reduced) render(.28);
  };
  function render(t) {
    ctx.clearRect(0,0,width,height);
    const ground = floor();
    ctx.strokeStyle = 'rgba(245,241,232,.26)';
    ctx.lineWidth = 1.5;
    ctx.beginPath();ctx.moveTo(0,ground);ctx.lineTo(width,ground);ctx.stroke();

    // A permanent crumpled-paper tumbleweed: wind gusts, brief skitters,
    // tiny hops, and lots of grounded rolling. Never opens or becomes flat.
    const impactTime = .36 / duration;
    const u = clamp(t / impactTime);
    const rolling = clamp((t-impactTime)/(1-impactTime));
    const startX = width * .85;
    const distance = startX + radius * 3;
    // Wind gusts vary the speed without reversing the ball's direction.
    const drift = rolling + .018*Math.sin(rolling*14)*Math.sin(Math.PI*rolling)
      + .009*Math.sin(rolling*31)*Math.sin(Math.PI*rolling);
    const x = t < impactTime ? startX + 5*u : startX-distance*clamp(drift);
    // Keep the ball touching ground except for three short wind-lifted hops.
    const gust1 = Math.pow(Math.max(0,1-Math.abs(rolling-.21)/.065),2)*10;
    const gust2 = Math.pow(Math.max(0,1-Math.abs(rolling-.49)/.05),2)*7;
    const gust3 = Math.pow(Math.max(0,1-Math.abs(rolling-.73)/.055),2)*11;
    const hop = gust1+gust2+gust3;
    const y = t < impactTime ? ground-radius-78*(1-u*u) : ground-radius-hop;
    const squash = t >= impactTime ? .11*Math.exp(-rolling*28)*Math.abs(Math.sin(rolling*42)) : 0;
    const angle = t < impactTime ? -.3+u*.5 : -distance*clamp(drift)/radius
      + .09*Math.sin(rolling*21);

    // Contact shadow stays below the falling ball; tighter upon landing.
    ctx.fillStyle = 'rgba(0,0,0,.4)';
    ctx.beginPath();
    ctx.ellipse(x,ground-2,21+(1-u)*5+hop*0.15,4.5,0,0,Math.PI*2);ctx.fill();

    ctx.save();
    ctx.translate(x,y);
    ctx.rotate(angle);
    ctx.scale(1+squash,1-squash);
    // Sparse, charming mid-century newspaper-cartoon tumbleweed.
    // Only a handful of loose crooked twigs and generous empty space.
    ctx.strokeStyle = '#DBFB51';
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    // Rounded, airy Charlie Brown-style twig ring with a sparse interior.
    const twigs = [
      [[-30,0],[-25,-15],[-12,-26],[3,-30],[18,-24],[28,-12],[31,3]],
      [[31,3],[24,19],[10,28],[-6,29],[-21,21],[-30,8]],
      [[-25,-15],[-10,-9],[8,-19],[24,-14]],
      [[-30,8],[-15,3],[0,13],[18,8],[29,3]],
      [[-12,-26],[-6,-11],[9,4],[10,28]],
      [[18,-24],[12,-8],[-4,5],[-21,21]],
      [[-21,21],[-8,16],[8,22],[24,19]]
    ];
    ctx.lineWidth = 2.2;
    twigs.forEach(points => {
      ctx.beginPath();
      points.forEach(([px,py],i) => i ? ctx.lineTo(px,py) : ctx.moveTo(px,py));
      ctx.stroke();
    });
    ctx.lineWidth = 1.8;
    [
      [[-25,-15],[-30,-20]], [[3,-30],[7,-35]],
      [[18,-24],[25,-28]], [[28,-12],[34,-13]],
      [[31,3],[37,7]], [[24,19],[28,26]],
      [[10,28],[11,34]], [[-6,29],[-9,35]],
      [[-21,21],[-28,26]], [[-30,8],[-36,10]]
    ].forEach(([p,q]) => {
      ctx.beginPath();ctx.moveTo(...p);ctx.lineTo(...q);ctx.stroke();
    });
    ctx.restore();
  }
  new ResizeObserver(resize).observe(stage);
  resize();
  if (reduced) { render(.28); return; }
  let origin = null;
  function tick(now) {
    if (origin === null) origin = now;
    render((((now-origin)/1000) % duration)/duration);
    requestAnimationFrame(tick);
  }
  requestAnimationFrame(tick);
})();
