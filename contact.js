(() => {
  const form = document.querySelector('#contact-form');
  if (!form) return;
  const note = document.querySelector('#form-note');
  const button = form.querySelector('button[type="submit"]');
  const messageField = form.elements.message;
  const count = form.querySelector('.character-count');

  const updateCount = () => {
    count.textContent = `${messageField.value.length}/100`;
  };

  form.addEventListener('submit', async (event) => {
    event.preventDefault();
    const honeypot = form.elements.website;
    const email = form.elements.email.value.trim();
    const message = messageField.value.trim();

    if (honeypot.value) return;
    if (!form.elements.email.checkValidity()) {
      note.textContent = 'Please enter a valid email address.';
      note.className = 'form-note is-error';
      return;
    }
    if (!message || message.length > 100) {
      note.textContent = 'Please add a message of 100 characters or fewer.';
      note.className = 'form-note is-error';
      return;
    }

    button.disabled = true;
    button.textContent = 'sending…';
    note.textContent = 'sending your note to the tower…';
    note.className = 'form-note';

    try {
      const response = await fetch('https://formsubmit.co/ajax/info@ozzystower.com', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify({
          email,
          message,
          _subject: 'New message from ozzystower.com'
        })
      });
      if (!response.ok) throw new Error('submission failed');
      form.reset();
      updateCount();
      note.textContent = 'sent. why not?';
      note.className = 'form-note is-success';
    } catch {
      note.textContent = 'that didn’t go through. please try again.';
      note.className = 'form-note is-error';
    } finally {
      button.disabled = false;
      button.textContent = 'to the tower!';
    }
  });

  messageField.addEventListener('input', updateCount);
  updateCount();
})();