(async function () {
  const category = window.__COURSE_CATEGORY__;
  if (!category || category === 'playground') return;

  const epButtons = document.getElementById('epButtons');
  const mainVideo = document.getElementById('mainVideo');
  const courseTitle = document.getElementById('courseTitle');
  const courseDesc = document.getElementById('courseDesc');
  const quizContainer = document.getElementById('quizContainer');
  const submitBtn = document.getElementById('submitBtn');

  let episodes = [];
  let currentEPIdx = 0;

  function renderQuiz(questions) {
    quizContainer.innerHTML = '';
    if (!questions || questions.length === 0) {
      quizContainer.innerHTML = '<p style="color:#666;">No questions available.</p>';
      return;
    }

    questions.forEach((item, qIdx) => {
      const div = document.createElement('div');
      div.className = 'quiz-item-container';
      div.innerHTML = `
        <p style="color:#fff; margin-bottom:10px;">Q${qIdx + 1}: ${item.q}</p>
        <div style="display:grid; grid-template-columns:1fr 1fr; gap:10px;">
          ${item.o
            .map(
              (opt, oIdx) => `
              <label style="background: rgba(255,255,255,0.05); padding:10px; border-radius:5px; cursor:pointer; display:block;">
                <input type="radio" name="q${qIdx}" value="${oIdx}"> ${opt}
              </label>`
            )
            .join('')}
        </div>`;
      quizContainer.appendChild(div);
    });
  }

  function loadEP(idx) {
    currentEPIdx = idx;
    const data = episodes[idx];

    mainVideo.src = `https://www.youtube.com/embed/${data.videoId}`;
    courseTitle.innerText = data.title;
    courseDesc.innerText = data.desc;

    document.querySelectorAll('.btn-ep').forEach(btn => btn.classList.remove('active'));
    const activeBtn = document.getElementById(`btn-ep-${idx}`);
    if (activeBtn) activeBtn.classList.add('active');

    renderQuiz(data.questions);
  }

  function initEPButtons() {
    epButtons.innerHTML = '';
    episodes.forEach((ep, idx) => {
      const btn = document.createElement('button');
      btn.className = 'btn-ep';
      btn.id = `btn-ep-${idx}`;
      btn.innerText = `EP ${(idx + 1).toString().padStart(2, '0')}`;
      btn.onclick = () => loadEP(idx);
      epButtons.appendChild(btn);
    });
    if (episodes.length) loadEP(0);
  }

  async function submitAllAnswers() {
    const data = episodes[currentEPIdx];
    if (!data || !data.questions) return;

    let score = 0;
    const missing = [];

    data.questions.forEach((_, idx) => {
      if (!document.querySelector(`input[name="q${idx}"]:checked`)) missing.push(idx + 1);
    });

    if (missing.length > 0) {
      Swal.fire({ icon: 'error', title: 'Incomplete', text: `Please answer: ${missing.join(', ')}`, background: '#111', color: '#fff' });
      return;
    }

    data.questions.forEach((item, idx) => {
      const sel = document.querySelector(`input[name="q${idx}"]:checked`);
      const div = document.getElementsByClassName('quiz-item-container')[idx];
      const isCorrect = parseInt(sel.value, 10) === item.a;
      div.style.borderColor = isCorrect ? '#0f0' : '#f00';

      const old = div.querySelector('.feedback');
      if (old) old.remove();

      if (!isCorrect) {
        const f = document.createElement('div');
        f.className = 'feedback';
        f.innerHTML = `❌ Wrong! Answer: <b>${item.o[item.a]}</b>`;
        div.appendChild(f);
      } else {
        score++;
      }
    });

    // Save latest score for leaderboard (best effort)
    let saved = false;
    try {
      const res = await fetch('/api/quiz/submit', {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          category,
          episodeIdx: currentEPIdx,
          score,
          total: data.questions.length,
        }),
      });
      const json = await res.json();
      saved = !!json.success;
    } catch (e) {
      console.warn('score save failed', e);
    }

    Swal.fire({
      title: 'RESULT',
      html: `SCORE: <b style="color:#0ff">${score} / ${data.questions.length}</b><div style="margin-top:10px;color:#9fb0c2;font-size:12px;">${saved ? '✅ บันทึกคะแนนเพื่อจัดอันดับแล้ว' : '⚠️ บันทึกคะแนนไม่สำเร็จ (แต่ผลลัพธ์ยังถูกต้อง)'}</div>`,
      background: '#111',
      color: '#fff'
    });
  }

  try {
    const res = await fetch(`/api/courses/${category}`);
    const json = await res.json();
    if (!json.success) throw new Error(json.msg || 'load failed');
    episodes = json.episodes || [];
    initEPButtons();
  } catch (err) {
    console.error(err);
    if (epButtons) epButtons.innerHTML = '<p style="color:#f66;">โหลดข้อมูลคอร์สไม่สำเร็จ</p>';
  }

  if (submitBtn) submitBtn.addEventListener('click', submitAllAnswers);
})();
