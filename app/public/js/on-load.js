document.addEventListener('DOMContentLoaded', () => {
    setTimeout(() => {
        document.querySelectorAll('.no-transition-on-load').forEach(el => {
            el.classList.remove('no-transition-on-load');
        });
    }, 500);
});
