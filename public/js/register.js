(function(){
  const form = document.getElementById('registerForm');
  if (!form) return;
  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const fd = new FormData(form);
    const payload = Object.fromEntries(fd.entries());
    try {
      const res = await fetch('/api/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (data.success) {
        // Auto login after successful register
        await fetch('/api/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ username: payload.username, password: payload.password })
        }).catch(() => null);

        await Swal.fire({ icon: 'success', title: 'สมัครสำเร็จ', text: 'กำลังพาเข้า VOIDSECTOR...', background: '#111', color: '#fff' });
        location.href = '/';
      } else {
        Swal.fire({ icon: 'error', title: 'ไม่สำเร็จ', text: data.msg || 'เกิดข้อผิดพลาด', background: '#111', color: '#fff' });
      }
    } catch {
      Swal.fire({ icon: 'error', title: 'Error', text: 'เชื่อมต่อเซิร์ฟเวอร์ไม่ได้', background: '#111', color: '#fff' });
    }
  });
})();
