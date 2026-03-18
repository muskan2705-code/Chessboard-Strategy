(() => {
  const cards = document.querySelectorAll('.cards details');
  if (!cards.length) return;

  cards.forEach((card) => {
    card.addEventListener('click', (event) => {
      const summary = event.target.closest('summary');
      const back = event.target.closest('.back');

      if (summary) {
        event.preventDefault();
        card.open = !card.open;
        return;
      }

      if (back) {
        event.preventDefault();
        card.open = false;
      }
    });

    card.addEventListener('keydown', (event) => {
      const summaryFocused = document.activeElement === card.querySelector('summary');
      if (!summaryFocused) return;
      if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault();
        card.open = !card.open;
      }
    });
  });
})();
