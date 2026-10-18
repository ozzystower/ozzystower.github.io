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
    // Sparse hand-drawn tumbleweed: a loose rounded bush made of branching stems,
    // not a geometric ring. Lots of transparent gaps between the twigs.
    ctx.strokeStyle = '#DBFB51';
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    const stems = [
      [[-31,8],[-27,-15],[-8,-30],[9,-28],[28,-13]],
      [[-34,-4],[-22,-21],[-2,-30],[21,-22],[32,-1]],
      [[-28,19],[-12,29],[13,25],[30,12]],
      [[-34,4],[-15,12],[-2,24],[19,25]],
      [[-24,-23],[-20,-4],[-3,8],[18,20]],
      [[-7,-31],[0,-14],[16,0],[27,16]],
      [[23,-24],[11,-10],[-7,0],[-26,20]],
      [[-26,-8],[-8,-18],[12,-10],[30,4]],
      [[-15,28],[0,12],[17,7],[31,-7]],
      [[-29,14],[-14,-2],[4,-1],[19,-18]]
    ];
    ctx.lineWidth = 1.7;
    stems.forEach((p) => {
      ctx.beginPath();
      ctx.moveTo(...p[0]);
      ctx.bezierCurveTo(...p[1],...p[2],...p[3]);
      ctx.lineTo(...p[4]);
      ctx.stroke();
    });
    // Small organic branch forks instead of large spikes or perfect outlines.
    const forks = [
      [[-27,-15],[-34,-20]], [[-8,-30],[-10,-37]],
      [[9,-28],[16,-33]], [[28,-13],[36,-15]],
      [[-12,29],[-15,36]], [[13,25],[20,32]],
      [[-15,12],[-23,17]], [[-3,8],[-6,17]],
      [[-20,-4],[-30,-3]], [[18,20],[23,30]],
      [[0,-14],[-5,-23]], [[16,0],[27,-2]],
      [[11,-10],[15,-21]], [[-7,0],[-15,-9]],
      [[-8,-18],[-11,-26]], [[12,-10],[21,-16]],
      [[0,12],[4,22]], [[17,7],[24,13]]
    ];
    ctx.lineWidth = 1.3;
    forks.forEach(([p,q]) => {
      ctx.beginPath();
      ctx.moveTo(...p);
      ctx.quadraticCurveTo((p[0]+q[0])/2+2,(p[1]+q[1])/2-3,...q);
      ctx.stroke();
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
