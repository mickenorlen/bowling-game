// On load functions

document.addEventListener('DOMContentLoaded', () => {
  // Remove class preventing transitions on load after done loading
  setTimeout(() => {
    document.querySelectorAll('.no-transition-on-load').forEach(el => {
      el.classList.remove('no-transition-on-load');
    });
  }, 500);
});
