(() => {
  const form = document.querySelector('#contact-form');
  if (!form) return;
  const note = document.querySelector('#form-note');
  form.addEventListener('submit', (event) => {
    event.preventDefault();
    const honeypot = form.elements.website;
    const email = form.elements.email.value.trim();
    const message = form.elements.message.value.trim();
    if (honeypot.value) return;
    if (!form.elements.email.checkValidity()) {
      note.textContent = 'Please enter a valid email address.';
      note.classList.add('is-error');
      return;
    }
    if (!message || message.length > 100) {
      note.textContent = 'Please add a message of 100 characters or fewer.';
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
  const messageField = form.elements.message;
  const count = form.querySelector('.character-count');
  const updateCount = () => { count.textContent = `${messageField.value.length}/100`; };
  messageField.addEventListener('input', updateCount);
  updateCount();
})();