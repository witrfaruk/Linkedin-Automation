if ('scrollRestoration' in history) {
  history.scrollRestoration = 'manual';
}
window.scrollTo(0, 0);

window.addEventListener('beforeunload', () => {
  window.scrollTo(0, 0);
});

document.addEventListener('DOMContentLoaded', () => {
  window.scrollTo(0, 0);

  if (window.location.hash) {
    history.replaceState(null, '', window.location.pathname + window.location.search);
  }

  window.addEventListener('hashchange', () => {
    history.replaceState(null, '', window.location.pathname + window.location.search);
  });

  const toggleBtn = document.querySelector('.mobile-toggle');
  const navMenu = document.querySelector('.nav-menu');

  if (toggleBtn && navMenu) {
    toggleBtn.addEventListener('click', () => {
      navMenu.classList.toggle('open');
      toggleBtn.innerHTML = navMenu.classList.contains('open') ? '✕' : '☰';
    });
  }

  document.querySelectorAll('[data-target]').forEach((btn) => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const targetId = btn.getAttribute('data-target');
      if (!targetId) return;

      const targetEl = document.getElementById(targetId);
      if (targetEl) {
        if (navMenu && navMenu.classList.contains('open')) {
          navMenu.classList.remove('open');
          if (toggleBtn) toggleBtn.innerHTML = '☰';
        }

        const headerOffset = 85;
        const elementPosition = targetEl.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

        window.scrollTo({
          top: offsetPosition,
          behavior: 'smooth'
        });

        history.replaceState(null, '', window.location.pathname + window.location.search);
      } else {
        window.location.href = 'index.html';
      }
    });
  });

  function showToast(message, icon = '🚀') {
    let toast = document.querySelector('.brutal-toast');
    if (!toast) {
      toast = document.createElement('div');
      toast.className = 'brutal-toast';
      document.body.appendChild(toast);
    }
    toast.innerHTML = `<span style="font-size: 1.3rem;">${icon}</span> <span>${message}</span>`;
    toast.classList.add('show');
    setTimeout(() => {
      toast.classList.remove('show');
    }, 3000);
  }

  document.querySelectorAll('.code-copy-btn').forEach((button) => {
    button.addEventListener('click', () => {
      const targetId = button.getAttribute('data-copy-id');
      let textToCopy = '';

      if (targetId) {
        const targetElement = document.getElementById(targetId);
        if (targetElement) {
          const scopeChips = targetElement.querySelectorAll('.scope-chip');
          if (scopeChips.length > 0) {
            textToCopy = Array.from(scopeChips)
              .map(c => c.getAttribute('data-scope') || c.querySelector('span')?.innerText.trim() || '')
              .filter(Boolean)
              .join(' ');
          } else {
            textToCopy = targetElement.innerText.trim();
          }
        }
      } else {
        const pre = button.closest('.code-box')?.querySelector('pre');
        if (pre) {
          textToCopy = pre.innerText.trim();
        } else {
          const chips = button.closest('.code-box')?.querySelectorAll('.scope-chip');
          if (chips && chips.length > 0) {
            textToCopy = Array.from(chips)
              .map(c => c.getAttribute('data-scope') || c.querySelector('span')?.innerText.trim() || '')
              .filter(Boolean)
              .join(' ');
          }
        }
      }

      if (textToCopy) {
        navigator.clipboard.writeText(textToCopy).then(() => {
          const originalText = button.innerHTML;
          button.innerHTML = 'COPIED! 🔥';
          showToast('Copied to clipboard!');
          setTimeout(() => {
            button.innerHTML = originalText;
          }, 2000);
        });
      }
    });
  });

  document.querySelectorAll('.copy-secret-btn').forEach((button) => {
    button.addEventListener('click', () => {
      const secretName = button.getAttribute('data-secret') || button.innerText.trim();
      navigator.clipboard.writeText(secretName).then(() => {
        showToast(`Secret '${secretName}' copied!`, '📋');
      });
    });
  });

  document.querySelectorAll('.download-zip-btn').forEach((button) => {
    button.addEventListener('click', () => {
      showToast('Starting instant ZIP download...', '📦');
    });
  });

  const contactForm = document.getElementById('contactForm');
  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const submitBtn = contactForm.querySelector('button[type="submit"]');
      const originalText = submitBtn.innerHTML;

      submitBtn.disabled = true;
      submitBtn.innerHTML = 'SENDING... ⚡';

      setTimeout(() => {
        submitBtn.innerHTML = 'MESSAGE SENT! 💥';
        showToast('Thanks for reaching out! We received your message.', '📬');
        contactForm.reset();
        setTimeout(() => {
          submitBtn.disabled = false;
          submitBtn.innerHTML = originalText;
        }, 3000);
      }, 750);
    });
  }
});

window.addEventListener('load', () => {
  window.scrollTo(0, 0);
});
