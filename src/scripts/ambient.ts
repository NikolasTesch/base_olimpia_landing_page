if ('IntersectionObserver' in window) {
  const observer = new IntersectionObserver((entries) => {
    for (const { target, isIntersecting } of entries) {
      target.toggleAttribute('data-ambient-visible', isIntersecting);
    }
  });

  document.querySelectorAll('main > section:not(.hero)').forEach((section) => {
    const field = document.createElement('div');
    field.className = 'ambient-field';
    field.setAttribute('aria-hidden', 'true');
    field.innerHTML = `
      <div class="ambient-light"></div>
      <div class="ambient-beam"></div>
      <svg viewBox="0 0 640 480" class="ambient-court">
        <path d="M190 65 608 125 480 420 55 345Z M145 158 567 221 M99 252 523 318" />
        <path class="ambient-net" d="M123 204 545 269" />
        <path class="ambient-trajectory" d="M104 300 Q330 20 530 220" />
        <circle cx="104" cy="300" r="4" />
        <circle cx="530" cy="220" r="5" />
      </svg>`;
    section.classList.add('ambient-surface');
    section.prepend(field);
    observer.observe(section);
  });

  function syncVisibility() {
    document.documentElement.toggleAttribute('data-ambient-paused', document.hidden);
  }

  document.addEventListener('visibilitychange', syncVisibility);
  syncVisibility();
}
