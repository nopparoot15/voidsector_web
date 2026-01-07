// public/js/terminal.js
document.addEventListener('DOMContentLoaded', () => {
  const root = document.getElementById('fake-terminal');
  const out = document.getElementById('ft-output');
  const input = document.getElementById('ft-input');
  const promptEl = document.getElementById('ft-prompt');

  if (!root || !out || !input || !promptEl) return;

  // focus when clicking anywhere
  root.addEventListener('pointerdown', () => input.focus());

  // identity
  const me = window.__USER__ || null;
  const username = (me?.username || 'guest').trim() || 'guest';

  // virtual FS
  const FS = {
    '/': { type: 'dir', children: ['projects', 'readme.txt', 'about.txt'] },
    '/projects': { type: 'dir', children: ['readme.txt', 'portal-plan.txt'] },
    '/readme.txt': {
      type: 'file',
      content: [
        'Welcome to CYBER PORTAL',
        'This is a SAFE fake terminal (no real shell).',
        '',
        'Try:',
        '  help',
        '  ls',
        '  cd projects',
        '  cat readme.txt',
        '  whoami',
        '  clear',
        '  hack',
      ].join('\n'),
    },
    '/about.txt': {
      type: 'file',
      content: [
        'CYBER.PORTAL — Tools, Courses, Projects.',
        'Terminal Simulator: pure JS (no external libs).',
      ].join('\n'),
    },
    '/projects/readme.txt': {
      type: 'file',
      content: [
        'Projects folder',
        '- discord-bot-salty (moderation/verification)',
        '- cyber-learning-portal (this site)',
        '',
        'Hint: cat portal-plan.txt',
      ].join('\n'),
    },
    '/projects/portal-plan.txt': {
      type: 'file',
      content: [
        'Roadmap:',
        '  [ ] Regex Puzzle',
        '  [ ] JWT Decoder',
        '  [ ] Log Forensics mini-game',
        '  [ ] Daily challenge + streak',
      ].join('\n'),
    },
  };

  let cwd = '/';

  // history
  const history = [];
  let histIndex = -1;

  function setPrompt() {
    promptEl.innerHTML =
      `<span class="c-cyan">${escapeHtml(username)}</span>` +
      `:<span class="c-mag">${escapeHtml(cwd)}</span>$`;
  }

  function escapeHtml(s) {
    return String(s)
      .replaceAll('&', '&amp;')
      .replaceAll('<', '&lt;')
      .replaceAll('>', '&gt;')
      .replaceAll('"', '&quot;')
      .replaceAll("'", '&#039;');
  }

  function line(text, cls = '') {
    const div = document.createElement('div');
    div.className = `ft-line ${cls}`.trim();
    div.textContent = text;
    out.appendChild(div);
    out.scrollTop = out.scrollHeight;
  }

  function htmlLine(html, cls = '') {
    const div = document.createElement('div');
    div.className = `ft-line ${cls}`.trim();
    div.innerHTML = html;
    out.appendChild(div);
    out.scrollTop = out.scrollHeight;
  }

  function clearScreen() {
    out.innerHTML = '';
  }

  function normalize(p) {
    const parts = p.split('/').filter(Boolean);
    const stack = [];
    for (const part of parts) {
      if (part === '.') continue;
      if (part === '..') stack.pop();
      else stack.push(part);
    }
    return '/' + stack.join('/');
  }

  function resolvePath(p) {
    if (!p || p === '~') return '/';
    if (p.startsWith('/')) return normalize(p);
    if (cwd === '/') return normalize('/' + p);
    return normalize(cwd + '/' + p);
  }

  function getNode(p) {
    return FS[p] || null;
  }

  function ls() {
    const n = getNode(cwd);
    if (!n || n.type !== 'dir') {
      line('ls: not a directory', 'dim');
      return;
    }
    const items = n.children || [];
    const rendered = items.map(name => {
      const p = normalize((cwd === '/' ? '' : cwd) + '/' + name);
      const node = getNode(p);
      if (node?.type === 'dir') return `\x00DIR\x00${name}`;
      return `\x00FILE\x00${name}`;
    });

    // render with colors (without ANSI)
    const html = rendered.map(x => {
      if (x.startsWith('\x00DIR\x00')) {
        const name = escapeHtml(x.slice(5));
        return `<span class="c-cyan">${name}</span>`;
      }
      const name = escapeHtml(x.slice(6));
      return `<span class="c-mag">${name}</span>`;
    }).join('  ');
    htmlLine(html);
  }

  function cd(arg) {
    const target = (arg || '').trim();
    if (!target) {
      cwd = '/';
      setPrompt();
      return;
    }
    const p = resolvePath(target);
    const n = getNode(p);
    if (!n) return line(`cd: no such file or directory: ${target}`, 'dim');
    if (n.type !== 'dir') return line(`cd: not a directory: ${target}`, 'dim');
    cwd = p;
    setPrompt();
  }

  function cat(arg) {
    const target = (arg || '').trim();
    if (!target) return line('cat: missing file operand', 'dim');
    const p = resolvePath(target);
    const n = getNode(p);
    if (!n) return line(`cat: ${target}: No such file`, 'dim');
    if (n.type !== 'file') return line(`cat: ${target}: Is a directory`, 'dim');
    line(n.content);
  }

  function whoami() {
    line(username);
  }

  async function hack() {
    line('Initializing exploit...', 'dim');
    await progress('Probing ports', 22);
    await progress('Bypassing firewall', 18);
    await progress('Escalating privileges', 20);
    htmlLine(`<span class="c-red">ACCESS DENIED ❌</span>`);
    htmlLine(`<span class="c-cyan">Tip:</span> <span class="c-gray">This is a safe simulator 😉</span>`);
  }

  function help() {
    line('Available commands:');
    line('  help');
    line('  ls');
    line('  cd <dir>');
    line('  cat <file>');
    line('  whoami');
    line('  clear');
    line('  hack');
    line('');
    line('Tips: try "cd projects" then "ls" and "cat readme.txt"');
  }

  function unknown(cmd) {
    line(`${cmd}: command not found. Try "help"`, 'dim');
  }

  function sleep(ms) {
    return new Promise(r => setTimeout(r, ms));
  }

  async function progress(label, steps) {
    const barLine = document.createElement('div');
    barLine.className = 'ft-line dim';
    out.appendChild(barLine);

    for (let i = 0; i <= steps; i++) {
      const pct = Math.floor((i / steps) * 100);
      const filled = Math.floor((i / steps) * 18);
      const bar = '█'.repeat(filled) + '░'.repeat(18 - filled);
      barLine.textContent = `${label}: [${bar}] ${pct}%`;
      out.scrollTop = out.scrollHeight;
      await sleep(35 + Math.random() * 65);
    }
  }

  function run(raw) {
    const inputCmd = raw.trim();
    if (!inputCmd) return;

    const [cmd, ...rest] = inputCmd.split(/\s+/);
    const args = rest.join(' ');

    switch (cmd) {
      case 'help': return help();
      case 'ls': return ls();
      case 'cd': return cd(args);
      case 'cat': return cat(args);
      case 'whoami': return whoami();
      case 'clear': return clearScreen();
      case 'hack': return hack();
      default: return unknown(cmd);
    }
  }

  function printPromptLine(command) {
    // show prompt + typed command as a line in output
    htmlLine(
      `<span class="c-cyan">${escapeHtml(username)}</span>` +
      `:<span class="c-mag">${escapeHtml(cwd)}</span>$ ` +
      `${escapeHtml(command)}`
    );
  }

  // boot
  setPrompt();
  htmlLine(`<span class="c-cyan">CYBER PORTAL TERMINAL</span> <span class="c-mag">(fake)</span>`, 'dim');
  line('Type "help" to see available commands.', 'dim');
  input.focus();

  // input handling
  input.addEventListener('keydown', async (e) => {
    if (e.key === 'Enter') {
      const cmd = input.value;
      input.value = '';
      if (!cmd.trim()) return;

      history.push(cmd);
      histIndex = history.length;

      printPromptLine(cmd);
      await run(cmd);
      out.scrollTop = out.scrollHeight;
      return;
    }

    if (e.key === 'ArrowUp') {
      if (!history.length) return;
      e.preventDefault();
      histIndex = Math.max(0, histIndex <= 0 ? 0 : histIndex - 1);
      input.value = history[histIndex] ?? '';
      // move cursor to end
      requestAnimationFrame(() => input.setSelectionRange(input.value.length, input.value.length));
      return;
    }

    if (e.key === 'ArrowDown') {
      if (!history.length) return;
      e.preventDefault();
      histIndex = Math.min(history.length, histIndex + 1);
      input.value = history[histIndex] ?? '';
      requestAnimationFrame(() => input.setSelectionRange(input.value.length, input.value.length));
      return;
    }

    if (e.ctrlKey && (e.key === 'l' || e.key === 'L')) {
      e.preventDefault();
      clearScreen();
      return;
    }
  });
});
