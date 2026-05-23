(() => {
  const PISTON_URL = 'https://emkc.org/api/v2/piston/execute';

  const LANGS = {
    python: {
      monaco: 'python',
      piston: 'python',
      version: '3.10',
      starter: `# Python Code Editor
# กด ▶ Run เพื่อรันโค้ด

def greet(name):
    return f"Hello, {name}!"

print(greet("VoidSector"))

# ลอง input() ก็ได้ — ใส่ค่าใน stdin ด้านล่าง
`,
    },
    javascript: {
      monaco: 'javascript',
      piston: 'javascript',
      version: '18',
      starter: `// JavaScript (Node.js)
// กด ▶ Run เพื่อรันโค้ด

function greet(name) {
  return \`Hello, \${name}!\`;
}

console.log(greet("VoidSector"));

const nums = [1, 2, 3, 4, 5];
const sum = nums.reduce((a, b) => a + b, 0);
console.log("Sum:", sum);
`,
    },
    csharp: {
      monaco: 'csharp',
      piston: 'csharp',
      version: '6',
      starter: `// C# Code
// กด ▶ Run เพื่อรันโค้ด

using System;
using System.Collections.Generic;
using System.Linq;

class Program {
    static void Main() {
        string Greet(string name) => $"Hello, {name}!";

        Console.WriteLine(Greet("VoidSector"));

        var nums = new List<int> { 1, 2, 3, 4, 5 };
        Console.WriteLine("Sum: " + nums.Sum());
    }
}
`,
    },
  };

  let editor = null;
  let currentLang = 'python';

  const runBtn    = document.getElementById('ce-run-btn');
  const clearBtn  = document.getElementById('ce-clear-btn');
  const outputEl  = document.getElementById('ce-output');
  const statusEl  = document.getElementById('ce-status');
  const tabs      = document.querySelectorAll('.ce-lang-tab');

  // ── Monaco setup ─────────────────────────────────────────────────────
  require.config({ paths: { vs: 'https://cdn.jsdelivr.net/npm/monaco-editor@0.45.0/min/vs' } });
  require(['vs/editor/editor.main'], () => {
    monaco.editor.defineTheme('void-dark', {
      base: 'vs-dark',
      inherit: true,
      rules: [
        { token: 'comment', foreground: '52525b', fontStyle: 'italic' },
        { token: 'keyword', foreground: 'a5b4fc' },
        { token: 'string', foreground: '86efac' },
        { token: 'number', foreground: 'fbbf24' },
        { token: 'type', foreground: '67e8f9' },
      ],
      colors: {
        'editor.background': '#07070e',
        'editor.foreground': '#e4e4e7',
        'editorLineNumber.foreground': '#3f3f46',
        'editorLineNumber.activeForeground': '#6366f1',
        'editor.selectionBackground': '#312e81',
        'editor.lineHighlightBackground': '#0f0f1e',
        'editorCursor.foreground': '#818cf8',
        'editorIndentGuide.background': '#18181b',
        'editorIndentGuide.activeBackground': '#3f3f46',
      },
    });

    editor = monaco.editor.create(document.getElementById('ce-editor'), {
      value: LANGS[currentLang].starter,
      language: LANGS[currentLang].monaco,
      theme: 'void-dark',
      fontSize: 14,
      lineHeight: 22,
      fontFamily: '"JetBrains Mono", ui-monospace, Menlo, Consolas, monospace',
      fontLigatures: true,
      minimap: { enabled: false },
      scrollBeyondLastLine: false,
      renderLineHighlight: 'line',
      smoothScrolling: true,
      cursorBlinking: 'smooth',
      padding: { top: 16, bottom: 16 },
      tabSize: 4,
      wordWrap: 'on',
      automaticLayout: true,
    });

    // Ctrl/Cmd + Enter → run
    editor.addCommand(
      monaco.KeyMod.CtrlCmd | monaco.KeyCode.Enter,
      () => runCode()
    );
  });

  // ── Language tabs ─────────────────────────────────────────────────────
  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      const lang = tab.dataset.lang;
      if (lang === currentLang) return;

      tabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      currentLang = lang;

      if (editor) {
        const cfg = LANGS[lang];
        monaco.editor.setModelLanguage(editor.getModel(), cfg.monaco);
        editor.setValue(cfg.starter);
        editor.focus();
      }
      setOutput('// กด ▶ Run เพื่อรันโค้ด', '', '');
    });
  });

  // ── Run ──────────────────────────────────────────────────────────────
  async function runCode() {
    if (!editor) return;
    const code = editor.getValue();
    if (!code.trim()) return;

    runBtn.disabled = true;
    runBtn.textContent = '⏳ Running…';
    setOutput('', 'run', 'กำลังรัน…');

    try {
      const cfg = LANGS[currentLang];
      const resp = await fetch(PISTON_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          language: cfg.piston,
          version: cfg.version,
          files: [{ content: code }],
        }),
      });

      if (!resp.ok) throw new Error(`HTTP ${resp.status}`);
      const data = await resp.json();
      const run = data.run || {};

      const stdout = run.stdout || '';
      const stderr = run.stderr || '';
      const exitCode = run.code ?? 0;

      const combined = [stdout, stderr].filter(Boolean).join('\n');

      if (exitCode !== 0 || stderr) {
        setOutput(combined || 'Error (no output)', 'err', `exit ${exitCode}`);
      } else {
        setOutput(stdout || '(no output)', 'ok', `exit 0`);
      }
    } catch (e) {
      setOutput(`ไม่สามารถเชื่อมต่อ Piston API ได้\n${e.message}`, 'err', 'error');
    } finally {
      runBtn.disabled = false;
      runBtn.textContent = '▶ Run';
    }
  }

  function setOutput(text, statusType, statusText) {
    outputEl.textContent = text;
    outputEl.className = 'ce-output' + (statusType === 'err' ? ' ce-output--err' : '');
    statusEl.textContent = statusText;
    statusEl.className = 'ce-status' + (statusType ? ` ce-status--${statusType}` : '');
  }

  // ── Clear ─────────────────────────────────────────────────────────────
  clearBtn.addEventListener('click', () => {
    setOutput('// กด ▶ Run เพื่อรันโค้ด', '', '');
  });

  runBtn.addEventListener('click', runCode);
})();
