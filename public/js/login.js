(function(){
  const form = document.getElementById('loginForm');
  if (!form) return;
  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const fd = new FormData(form);
    const payload = Object.fromEntries(fd.entries());
    try {
      const res = await fetch('/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (data.success) {
        await Swal.fire({ icon: 'success', title: 'สำเร็จ', text: data.msg, background: '#111', color: '#fff' });
        location.href = '/';
      } else {
        Swal.fire({ icon: 'error', title: 'ไม่สำเร็จ', text: data.msg || 'เกิดข้อผิดพลาด', background: '#111', color: '#fff' });
      }
    } catch {
      Swal.fire({ icon: 'error', title: 'Error', text: 'เชื่อมต่อเซิร์ฟเวอร์ไม่ได้', background: '#111', color: '#fff' });
    }
  });
})();
