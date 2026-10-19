(() => {
  const form = document.querySelector('#contact-form');
  if (!form) return;
  const note = document.querySelector('#form-note');
  form.addEventListener('submit', (event) => {
    event.preventDefault();
    const honeypot = form.elements.website;
    const email = form.elements.email.value.trim();
    if (honeypot.value) return;
    if (!form.elements.email.checkValidity()) {
      note.textContent = 'Please enter a valid email address.';
      note.classList.add('is-error');
      return;
    }
    const subject = encodeURIComponent('hello from ozzystower');
    const body = encodeURIComponent(`Hi ozzystower,

My email is ${email}.

`);
    note.textContent = 'Opening your email app…';
    note.classList.remove('is-error');
    window.location.href = `mailto:info@ozzystower.com?subject=${subject}&body=${body}`;
  });
})();