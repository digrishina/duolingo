const PAGES = new Set(['landing', 'onboarding', 'account', 'dashboard']);

export const go = (page) => {
  if (!PAGES.has(page)) return;
  window.location.href = `./${page}.html`;
};

export const currentPage = () => {
  const name = (window.location.pathname.split('/').pop() || '').toLowerCase();
  return name.replace('.html', '');
};

export const wireBackButton = (fallback = 'landing') => {
  const btn = document.querySelector('.back');
  if (!btn) return;
  btn.addEventListener('click', (e) => {
    e.preventDefault();
    if (window.history.length > 1) window.history.back();
    else go(fallback);
  });
};
