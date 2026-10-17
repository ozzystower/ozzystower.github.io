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
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const ctx = canvas.getContext('2d');
  if (!ctx) return;
  let w = 0, h = 0, dpr = 1, frame = 0;
  const ideas = ['V1CE', 'LVG', 'NINE LIVES', 'INTENT', 'BOT FARM'];
  const duration = 5.3;
  const resize = () => {
    w = stage.clientWidth; h = stage.clientHeight;
    dpr = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = Math.max(1, Math.round(w*dpr));
    canvas.height = Math.max(1, Math.round(h*dpr));
    ctx.setTransform(dpr,0,0,dpr,0,0);
    if (reduce) draw(0.95,0);
  };
  const smooth = t => { t = Math.max(0,Math.min(1,t)); return t*t*(3-2*t); };
  function draw(t, index) {
    ctx.clearRect(0,0,w,h);
    if (!w || !h) return;
    // The paper begins flat and physically compresses into a ball. It NEVER unfolds.
    // Crumple in 0.55s, hit the floor by 0.9s, then roll off left.
    const crumple = smooth(t/.105);
    const floor = h*.80;
    const falling = Math.min(1,Math.max(0,(t-.105)/.065));
    const travel = Math.max(0,(t-.17)/.83);
    const x = w*.78-(w+150)*travel;
    const groundY = floor-21;
    const y = t < .17
      ? h*.22 + (groundY-h*.22)*falling*falling
      : groundY-Math.abs(Math.sin(travel*23))*5*(1-travel);
    const angle = -.15 + travel*18;
    const sx = 1-crumple*.67, sy = 1-crumple*.46;
    ctx.save();
    // Fixed floor contact marker: ball stays grounded after the initial impact.
    ctx.strokeStyle='rgba(245,241,232,.16)';ctx.lineWidth=1;
    ctx.beginPath();ctx.moveTo(0,floor+3);ctx.lineTo(w,floor+3);ctx.stroke();
    ctx.translate(x,y);
    ctx.rotate(angle);
    ctx.scale(sx,sy);
    ctx.fillStyle = '#f5f1e8';
    ctx.strokeStyle = '#a9a398';
    ctx.lineWidth = 2.3;
    ctx.beginPath();
    const edges = [[-66,-43],[-42,-49],[-19,-42],[11,-50],[45,-43],[65,-27],[62,18],[49,41],[19,45],[-13,36],[-42,46],[-66,24]];
    for(let i=0;i<edges.length;i++){
      const [ex,ey]=edges[i];
      const bump = crumple*7*Math.sin(i*2.6+index);
      if(i===0)ctx.moveTo(ex+bump,ey);else ctx.lineTo(ex+bump,ey);
    }
    ctx.closePath();ctx.fill();ctx.stroke();
    ctx.strokeStyle='#8c887d';ctx.lineWidth=1.4;
    ctx.beginPath();
    ctx.moveTo(-55,-35);ctx.lineTo(-22,8);ctx.lineTo(-5,-41);
    ctx.moveTo(18,-44);ctx.lineTo(8,5);ctx.lineTo(53,-24);
    ctx.moveTo(-59,21);ctx.lineTo(-7,18);ctx.lineTo(36,39);
    ctx.moveTo(-33,39);ctx.lineTo(12,-8);ctx.lineTo(54,25);
    ctx.stroke();
    // Text is visible only while the sheet is flat, and disappears inside the crumple.
    if(crumple<.65){
      ctx.globalAlpha=1-smooth(crumple/.65);
      ctx.fillStyle='#151515';ctx.font='bold 15px Arial, sans-serif';
      ctx.textAlign='center';ctx.fillText(ideas[index%ideas.length],0,5);
    }
    ctx.restore();
  }
  if (reduce) {
    new ResizeObserver(resize).observe(stage);
    resize();draw(.95,0);
    return;
  }
  let start=null,lastCycle=-1;
  function tick(time){
    if(start===null)start=time;
    const s=(time-start)/1000;
    const cycle=Math.floor(s/duration);
    const t=(s%duration)/duration;
    draw(t,cycle%ideas.length);
    lastCycle=cycle;
    frame=requestAnimationFrame(tick);
  }
  new ResizeObserver(resize).observe(stage);
  resize();
  frame=requestAnimationFrame(tick);
  window.addEventListener('beforeunload',()=>cancelAnimationFrame(frame),{once:true});
})();
