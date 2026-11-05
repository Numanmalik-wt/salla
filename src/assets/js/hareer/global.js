/**
 * Hareer global behaviour (every page): dismissible announcement bar.
 */
const KEY = 'hareer::announcement-closed';

function initAnnouncement() {
  const bar = document.querySelector('[data-hr-announcement]');
  if (!bar) return;
  const text = bar.textContent.trim();
  let closed = null;
  try { closed = window.sessionStorage.getItem(KEY); } catch (e) { /* storage blocked */ }
  if (closed === text) { bar.remove(); return; }

  bar.querySelector('[data-hr-announcement-close]')?.addEventListener('click', () => {
    try { window.sessionStorage.setItem(KEY, text); } catch (e) { /* storage blocked */ }
    bar.remove();
  });
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initAnnouncement);
} else {
  initAnnouncement();
}
