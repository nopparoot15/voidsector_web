(function () {
  const btn = document.getElementById('wbCreatePrivate');
  if (!btn) return;

  btn.addEventListener('click', async () => {
    btn.disabled = true;
    try {
      const r = await fetch('/api/whiteboard/rooms', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({}),
      });

      const j = await r.json().catch(() => ({}));
      if (!j.ok || !j.roomId) throw new Error('create_failed');

      // Redirect with share-key so you can copy/share immediately
      window.location.href = j.shareUrl || `/whiteboard/r/${encodeURIComponent(j.roomId)}`;
    } catch (e) {
      if (window.Swal) {
        Swal.fire({
          icon: 'error',
          title: 'สร้างห้องไม่สำเร็จ',
          text: 'ลองใหม่อีกครั้งนะ',
          background: '#0b0f14',
          color: '#e6f7ff'
        });
      } else {
        alert('Create room failed');
      }
    } finally {
      btn.disabled = false;
    }
  });
})();
