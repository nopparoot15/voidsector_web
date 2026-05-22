(function () {
  const container = document.getElementById('flashcard-container');
  if (!container) return;
  const langCode = container.dataset.langCode;

  let cards = [];
  let current = 0;
  let flipped = false;

  const progressEl = document.getElementById('fc-progress');
  const flashcard = document.getElementById('flashcard');
  const cardFront = document.getElementById('card-front');
  const cardBack = document.getElementById('card-back');
  const flipBtn = document.getElementById('flip-btn');
  const ratingArea = document.getElementById('rating-area');
  const doneScreen = document.getElementById('done-screen');

  async function init() {
    const res = await fetch(`/api/flashcards/${langCode}/review`);
    cards = await res.json();
    if (!cards.length) { showDone(); return; }
    showCard();
  }

  function showCard() {
    if (current >= cards.length) { showDone(); return; }
    flipped = false;
    const card = cards[current];
    progressEl.textContent = `${current + 1} / ${cards.length}`;

    cardFront.querySelector('.card-word').textContent = card.word;
    cardFront.querySelector('.card-lang').textContent = langLabel(langCode);
    cardBack.querySelector('.card-reading').textContent = card.reading || '';
    cardBack.querySelector('.card-translation').textContent = card.translation || '';
    cardBack.querySelector('.card-example').textContent = card.example ? `"${card.example}"` : '';

    cardBack.classList.add('hidden');
    cardFront.classList.remove('hidden');
    ratingArea.classList.add('hidden');
    flashcard.classList.remove('flipped');
    flipBtn.style.display = '';
  }

  function doFlip() {
    if (flipped) return;
    flipped = true;
    flashcard.classList.add('flipped');
    cardFront.classList.add('hidden');
    cardBack.classList.remove('hidden');
    ratingArea.classList.remove('hidden');
    flipBtn.style.display = 'none';
  }

  flipBtn.addEventListener('click', doFlip);
  flashcard.addEventListener('click', doFlip);

  ratingArea.querySelectorAll('[data-q]').forEach(btn => {
    btn.addEventListener('click', async () => {
      const quality = parseInt(btn.dataset.q);
      const card = cards[current];
      try {
        await fetch(`/api/flashcards/${card.vocab_id}/review`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ quality })
        });
      } catch (e) { /* ignore */ }
      current++;
      showCard();
    });
  });

  function showDone() {
    document.getElementById('card-area').classList.add('hidden');
    ratingArea.classList.add('hidden');
    doneScreen.classList.remove('hidden');
    progressEl.textContent = 'เสร็จแล้ว!';
  }

  function langLabel(code) {
    return { en: 'English', ja: '日本語', zh: '中文' }[code] || code;
  }

  init();
})();
