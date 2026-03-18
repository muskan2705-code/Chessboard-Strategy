(function () {
  document.addEventListener('DOMContentLoaded', function () {
    const track = document.querySelector('.clients-track');
    if (!track) return;
    if (track.dataset.duplicated === 'true') return;

    const items = Array.from(track.children);
    items.forEach((item) => track.appendChild(item.cloneNode(true)));
    track.dataset.duplicated = 'true';
  });
})();
