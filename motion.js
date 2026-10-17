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
    if (now - last < 70 || event.clientY > 220) return;
    last = now;
    const dot = document.createElement('i');
    dot.className = 'cursor-mark';
    dot.style.left = `${event.clientX}px`;
    dot.style.top = `${event.clientY}px`;
    document.body.append(dot);
    trail.push(dot);
    window.setTimeout(() => {
      dot.remove();
      trail.shift();
    }, 520);
    if (trail.length > 8) trail.shift().remove();
  }, { passive: true });
})();