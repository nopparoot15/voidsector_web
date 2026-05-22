// public/js/terminal.js
document.addEventListener('DOMContentLoaded', () => {
  const root = document.getElementById('fake-terminal');
  const out = document.getElementById('ft-output');
  const input = document.getElementById('ft-input');
  const promptEl = document.getElementById('ft-prompt');

  if (!root || !out || !input || !promptEl) return;

  root.addEventListener('pointerdown', () => input.focus());

  const me = window.__USER__ || null;
  const username = (me?.username || 'guest').trim() || 'guest';

  const FS = {
    '/': { type: 'dir', children: ['projects', 'skills.txt', 'contact.txt', 'readme.txt'] },
    '/readme.txt': {
      type: 'file',
      content: [
        '⬡ Welcome to VoidSector Terminal',
        'Fake terminal — no real shell, safe to use.',
        '',
        'Commands:',
        '  help         show all commands',
        '  ls           list directory',
        '  cd <dir>     change directory',
        '  cat <file>   read file',
        '  whoami       current user',
        '  clear        clear screen   (Ctrl+L)',
        '  neofetch     system info',
        '  hack         try it',
        '',
        'Tip: cd projects && ls',
      ].join('\n'),
    },
    '/skills.txt': {
      type: 'file',
      content: [
        'Languages & Tools:',
        '  Python · JavaScript · Node.js',
        '  HTML/CSS · PostgreSQL · Git',
        '',
        'Frameworks:',
        '  Express · discord.py',
        '',
        'Currently learning: Japanese 🇯🇵',
      ].join('\n'),
    },
    '/contact.txt': {
      type: 'file',
      content: [
        'Contact:',
        '  GitHub   https://github.com/nopparoot15',
        '  Discord  https://discord.gg/MXH9fSwEve',
      ].join('\n'),
    },
    '/projects': { type: 'dir', children: ['voidsector.txt', 'discord-bot.txt'] },
    '/projects/voidsector.txt': {
      type: 'file',
      content: [
        'Project: VoidSector',
        'Status:  🟢 Live — https://voidsector.up.railway.app',
        'Stack:   Node.js · Express · PostgreSQL · EJS',
        '',
        'Features:',
        '  - Language learning (EN / JA / ZH)',
        '  - Spaced repetition flashcards (SM-2)',
        '  - 5 exercise types per lesson',
        '  - XP & streak system',
        '  - Tools: Terminal, Calculator',
      ].join('\n'),
    },
    '/projects/discord-bot.txt': {
      type: 'file',
      content: [
        'Project: Discord Bot (salty)',
        'Status:  🔨 WIP',
        'Stack:   Python · discord.py',
        '',
        'Features planned:',
        '  - Moderation & auto-verification',
        '  - Role assignment dashboard',
        '  - Member activity tracking',
      ].join('\n'),
    },
  };

  let cwd = '/';
  const history = [];
  let histIndex = -1;

  function setPrompt() {
    promptEl.innerHTML =
      `<span class="c-cyan">${esc(username)}</span>` +
      `:<span class="c-mag">${esc(cwd)}</span>$ `;
  }

  function esc(s) {
    return String(s)
      .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;').replace(/'/g, '&#039;');
  }

  function line(text, cls = '') {
    const div = document.createElement('div');
    div.className = `ft-line ${cls}`.trim();
    div.textContent = text;
    out.appendChild(div);
    out.scrollTop = out.scrollHeight;
  }

  function hline(html, cls = '') {
    const div = document.createElement('div');
    div.className = `ft-line ${cls}`.trim();
    div.innerHTML = html;
    out.appendChild(div);
    out.scrollTop = out.scrollHeight;
  }

  function clearScreen() { out.innerHTML = ''; }

  function normalize(p) {
    const stack = [];
    for (const part of p.split('/').filter(Boolean)) {
      if (part === '.') continue;
      if (part === '..') stack.pop();
      else stack.push(part);
    }
    return '/' + stack.join('/');
  }

  function resolve(p) {
    if (!p || p === '~') return '/';
    if (p.startsWith('/')) return normalize(p);
    return normalize((cwd === '/' ? '' : cwd) + '/' + p);
  }

  function node(p) { return FS[p] || null; }

  function cmdLs() {
    const n = node(cwd);
    if (!n || n.type !== 'dir') { line('ls: not a directory', 'dim'); return; }
    const html = (n.children || []).map(name => {
      const p = normalize((cwd === '/' ? '' : cwd) + '/' + name);
      const isDir = node(p)?.type === 'dir';
      return isDir
        ? `<span class="c-cyan">${esc(name)}/</span>`
        : `<span class="c-mag">${esc(name)}</span>`;
    }).join('  ');
    hline(html || '(empty)');
  }

  function cmdCd(arg) {
    if (!arg) { cwd = '/'; setPrompt(); return; }
    const p = resolve(arg);
    const n = node(p);
    if (!n) { line(`cd: no such directory: ${arg}`, 'dim'); return; }
    if (n.type !== 'dir') { line(`cd: not a directory: ${arg}`, 'dim'); return; }
    cwd = p;
    setPrompt();
  }

  function cmdCat(arg) {
    if (!arg) { line('cat: missing operand', 'dim'); return; }
    const p = resolve(arg);
    const n = node(p);
    if (!n) { line(`cat: ${arg}: No such file`, 'dim'); return; }
    if (n.type !== 'file') { line(`cat: ${arg}: Is a directory`, 'dim'); return; }
    line(n.content);
  }

  function cmdWhoami() { line(username); }

  function cmdNeofetch() {
    const xp = me?.xp ?? 0;
    const streak = me?.streak ?? 0;
    hline([
      `<span class="c-cyan">         ⬡</span>`,
      `<span class="c-cyan">        ⬡ ⬡</span>  <span class="c-mag">${esc(username)}</span>@voidsector`,
      `<span class="c-cyan">       ⬡   ⬡</span>  ─────────────────────`,
      `<span class="c-cyan">      ⬡     ⬡</span>  <span class="c-cyan">XP:</span>      ${xp}`,
      `<span class="c-cyan">       ⬡   ⬡</span>  <span class="c-cyan">Streak:</span>  🔥 ${streak} days`,
      `<span class="c-cyan">        ⬡ ⬡</span>  <span class="c-cyan">Stack:</span>   Node / Express / PG`,
      `<span class="c-cyan">         ⬡</span>  <span class="c-cyan">Lang:</span>    EN / JA / ZH`,
    ].join('\n'));
  }

  function cmdHelp() {
    line('Commands:');
    line('  help       แสดงคำสั่งทั้งหมด');
    line('  ls         แสดงไฟล์ในโฟลเดอร์');
    line('  cd <dir>   เข้าโฟลเดอร์');
    line('  cat <file> อ่านไฟล์');
    line('  whoami     ชื่อผู้ใช้ปัจจุบัน');
    line('  neofetch   ข้อมูลระบบ');
    line('  clear      ล้างหน้าจอ  (Ctrl+L)');
    line('  hack       ลองดู');
  }

  function sleep(ms) { return new Promise(r => setTimeout(r, ms)); }

  async function cmdHack() {
    line('Initializing exploit sequence...', 'dim');
    await progress('Scanning targets', 16);
    await progress('Bypassing firewall', 22);
    await progress('Escalating privileges', 18);
    hline(`<span class="c-red">ACCESS DENIED ❌</span>`);
    hline(`<span class="c-cyan">Tip:</span> <span class="c-gray">This is a safe simulator 😉</span>`);
  }

  async function progress(label, steps) {
    const el = document.createElement('div');
    el.className = 'ft-line dim';
    out.appendChild(el);
    for (let i = 0; i <= steps; i++) {
      const pct = Math.floor((i / steps) * 100);
      const f = Math.floor((i / steps) * 20);
      el.textContent = `${label}: [${'█'.repeat(f)}${'░'.repeat(20 - f)}] ${pct}%`;
      out.scrollTop = out.scrollHeight;
      await sleep(30 + Math.random() * 55);
    }
  }

  async function run(raw) {
    const inputCmd = raw.trim();
    if (!inputCmd) return;
    const [cmd, ...rest] = inputCmd.split(/\s+/);
    const arg = rest.join(' ');
    switch (cmd) {
      case 'help':     return cmdHelp();
      case 'ls':       return cmdLs();
      case 'cd':       return cmdCd(arg);
      case 'cat':      return cmdCat(arg);
      case 'whoami':   return cmdWhoami();
      case 'neofetch': return cmdNeofetch();
      case 'clear':    return clearScreen();
      case 'hack':     return cmdHack();
      default: line(`${esc(cmd)}: command not found — try "help"`, 'dim');
    }
  }

  function printPrompt(cmd) {
    hline(
      `<span class="c-cyan">${esc(username)}</span>` +
      `:<span class="c-mag">${esc(cwd)}</span>$ ${esc(cmd)}`
    );
  }

  // boot
  setPrompt();
  hline(`<span class="c-cyan">⬡ VoidSector Terminal</span> <span class="c-gray">(simulator)</span>`, 'dim');
  line('Type "help" to see available commands.', 'dim');
  input.focus();

  input.addEventListener('keydown', async (e) => {
    if (e.key === 'Enter') {
      const cmd = input.value;
      input.value = '';
      if (!cmd.trim()) return;
      history.push(cmd);
      histIndex = history.length;
      printPrompt(cmd);
      await run(cmd);
      out.scrollTop = out.scrollHeight;
      return;
    }
    if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (!history.length) return;
      histIndex = Math.max(0, histIndex - 1);
      input.value = history[histIndex] ?? '';
      requestAnimationFrame(() => input.setSelectionRange(input.value.length, input.value.length));
      return;
    }
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      histIndex = Math.min(history.length, histIndex + 1);
      input.value = history[histIndex] ?? '';
      requestAnimationFrame(() => input.setSelectionRange(input.value.length, input.value.length));
      return;
    }
    if (e.ctrlKey && (e.key === 'l' || e.key === 'L')) {
      e.preventDefault();
      clearScreen();
    }
  });
});
