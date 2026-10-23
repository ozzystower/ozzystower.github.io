(() => {
  const form = document.querySelector('#contact-form');
  if (!form) return;
  const note = document.querySelector('#form-note');
  form.addEventListener('submit', (event) => {
    const honeypot = form.elements.website;
    const message = form.elements.message.value.trim();
    if (honeypot.value) {
      event.preventDefault();
      return;
    }
    if (!form.elements.email.checkValidity()) {
      event.preventDefault();
      note.textContent = 'Please enter a valid email address.';
      note.classList.add('is-error');
      return;
    }
    if (!message || message.length > 100) {
      event.preventDefault();
      note.textContent = 'Please add a message of 100 characters or fewer.';
      note.classList.add('is-error');
      return;
    }
    note.textContent = 'Sending…';
    note.classList.remove('is-error');
  });
  const messageField = form.elements.message;
  const count = form.querySelector('.character-count');
  const updateCount = () => { count.textContent = `${messageField.value.length}/100`; };
  messageField.addEventListener('input', updateCount);
  updateCount();
})();