import "katex/dist/katex.min.css";
import "highlight.js/styles/github.css";
import "highlight.js/styles/github-dark.css";
import "./style.css";

import { EditorView, basicSetup } from "codemirror";
import { EditorState, Compartment } from "@codemirror/state";
import { markdown } from "@codemirror/lang-markdown";
import { oneDark } from "@codemirror/theme-one-dark";
import MarkdownIt from "markdown-it";
import hljs from "highlight.js";
import renderMathInElement from "katex/contrib/auto-render";

const previewEl = document.querySelector("#preview");
const statusEl = document.querySelector("#status");
const editorHost = document.querySelector("#editor");

let currentFilePath = null;
const themeToggleButton = document.querySelector('[data-action="toggleTheme"]');

function prefersDark() {
  return window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches;
}

function applyTheme(theme) {
  const next = theme === "dark" || theme === "light" ? theme : prefersDark() ? "dark" : "light";
  document.documentElement.dataset.theme = next;
  localStorage.setItem("theme", next);
}

applyTheme(localStorage.getItem("theme"));

const md = new MarkdownIt({
  html: true,
  linkify: true,
  typographer: true,
  highlight(str, lang) {
    if (lang && hljs.getLanguage(lang)) {
      try {
        return hljs.highlight(str, { language: lang, ignoreIllegals: true }).value;
      } catch (err) {
        return "";
      }
    }
    try {
      return hljs.highlightAuto(str).value;
    } catch (err) {
      return "";
    }
  },
});

function toFileUrl(src) {
  if (!src) {
    return src;
  }
  if (src.startsWith("http://") || src.startsWith("https://") || src.startsWith("data:") || src.startsWith("file://")) {
    return src;
  }
  if (src.startsWith("/")) {
    return `app://${encodeURI(src)}`;
  }
  if (/^[A-Za-z]:[\\/]/.test(src)) {
    const normalized = src.replace(/\\/g, "/");
    return `app:///${encodeURI(normalized)}`;
  }
  return src;
}

const defaultImageRule = md.renderer.rules.image;
md.renderer.rules.image = (tokens, idx, options, env, self) => {
  const token = tokens[idx];
  const src = token.attrGet("src");
  if (src) {
    token.attrSet("src", toFileUrl(src));
  }
  if (defaultImageRule) {
    return defaultImageRule(tokens, idx, options, env, self);
  }
  return self.renderToken(tokens, idx, options);
};

function renderPreview(docText) {
  previewEl.innerHTML = md.render(docText);
  renderMathInElement(previewEl, {
    delimiters: [
      { left: "$$", right: "$$", display: true },
      { left: "$", right: "$", display: false },
      { left: "\\(", right: "\\)", display: false },
      { left: "\\[", right: "\\]", display: true },
    ],
    throwOnError: false,
  });
}

const updateListener = EditorView.updateListener.of((update) => {
  if (update.docChanged) {
    const text = update.state.doc.toString();
    renderPreview(text);
    statusEl.textContent = "Edited";
  }
});

const lightSurface = EditorView.theme({
  ".cm-scroller": { backgroundColor: "#fffaf3", color: "#1a1a1a" },
  ".cm-content": { color: "#1a1a1a" },
  ".cm-gutters": { backgroundColor: "#fffaf3", color: "#6b6b6b", border: "none" },
});

const darkSurface = EditorView.theme(
  {
    ".cm-scroller": { backgroundColor: "#1a1916", color: "#efe7db" },
    ".cm-content": { color: "#efe7db" },
    ".cm-gutters": { backgroundColor: "#1a1916", color: "#b0a79b", border: "none" },
  },
  { dark: true }
);

const selectionTheme = EditorView.theme(
  {
    ".cm-selectionBackground": { backgroundColor: "rgba(0, 0, 0, 0.75)" },
    "&.cm-focused .cm-selectionBackground": { backgroundColor: "rgba(0, 0, 0, 0.85)" },
    ".cm-content ::selection": { backgroundColor: "rgba(0, 0, 0, 0.85)", color: "#ffffff" },
    ".cm-line.cm-activeLine": { backgroundColor: "transparent" },
    ".cm-gutterElement.cm-activeLineGutter": { backgroundColor: "transparent" },
    ".cm-selectionMatch": { backgroundColor: "rgba(0, 0, 0, 0.6)" },
  },
  { dark: true }
);

function editorThemeExtension() {
  const explicitTheme = document.documentElement.dataset.theme;
  const useDark = explicitTheme === "dark";
  return useDark ? [oneDark, selectionTheme, darkSurface] : [lightSurface];
}

const themeCompartment = new Compartment();

function editorExtensions() {
  return [
    basicSetup,
    markdown(),
    EditorView.lineWrapping,
    updateListener,
    themeCompartment.of(editorThemeExtension()),
  ];
}

const state = EditorState.create({
  doc: "",
  extensions: editorExtensions(),
});

const view = new EditorView({
  state,
  parent: editorHost,
});

renderPreview("");

function toggleTheme() {
  const current = document.documentElement.dataset.theme;
  const next = current === "dark" ? "light" : "dark";
  applyTheme(next);
  view.dispatch({ effects: themeCompartment.reconfigure(editorThemeExtension()) });
}

themeToggleButton?.addEventListener("click", toggleTheme);

let syncingScroll = false;
view.scrollDOM.addEventListener("scroll", () => {
  if (syncingScroll) {
    return;
  }
  const editorScroll = view.scrollDOM;
  const editorMax = editorScroll.scrollHeight - editorScroll.clientHeight;
  const previewMax = previewEl.scrollHeight - previewEl.clientHeight;
  if (editorMax <= 0 || previewMax <= 0) {
    return;
  }
  syncingScroll = true;
  const ratio = editorScroll.scrollTop / editorMax;
  previewEl.scrollTop = ratio * previewMax;
  syncingScroll = false;
});

function replaceDocument(text) {
  view.dispatch({
    changes: { from: 0, to: view.state.doc.length, insert: text },
  });
  renderPreview(text);
}

function insertText(text) {
  const selection = view.state.selection.main;
  view.dispatch({
    changes: { from: selection.from, to: selection.to, insert: text },
    selection: { anchor: selection.from + text.length },
  });
  view.focus();
}

async function openFile(filePath) {
  let path;
  try {
    path = filePath || (await window.api.openMarkdownDialog());
  } catch (err) {
    console.error("[electron-markdown-editor] openMarkdownDialog failed", err);
    statusEl.textContent = "Open failed";
    return;
  }
  if (!path) {
    statusEl.textContent = "Open canceled";
    return;
  }
  const data = await window.api.readTextFile(path);
  currentFilePath = path;
  replaceDocument(data);
  statusEl.textContent = `Opened: ${path}`;
}

async function saveFile() {
  if (!currentFilePath) {
    return saveFileAs();
  }
  await window.api.writeTextFile(currentFilePath, view.state.doc.toString());
  statusEl.textContent = `Saved: ${currentFilePath}`;
}

async function saveFileAs() {
  let path;
  try {
    path = await window.api.saveMarkdownDialog();
  } catch (err) {
    console.error("[electron-markdown-editor] saveMarkdownDialog failed", err);
    statusEl.textContent = "Save failed";
    return;
  }
  if (!path) {
    statusEl.textContent = "Save canceled";
    return;
  }
  currentFilePath = path;
  await window.api.writeTextFile(currentFilePath, view.state.doc.toString());
  statusEl.textContent = `Saved: ${currentFilePath}`;
}

async function insertImage() {
  const path = await window.api.openImageDialog();
  if (!path) {
    return;
  }
  insertText(`![title](${path})`);
}

async function insertVideo() {
  const path = await window.api.openVideoDialog();
  if (!path) {
    return;
  }
  const src = toFileUrl(path);
  insertText(`<video controls src="${src}"></video>`);
}

async function insertFile() {
  const path = await window.api.openFileDialog();
  if (!path) {
    return;
  }
  insertText(`[title](${path})`);
}

function insertTable() {
  const dialog = document.querySelector("#table-dialog");
  const rowsInput = document.querySelector("#table-rows");
  const colsInput = document.querySelector("#table-cols");

  if (!dialog || !rowsInput || !colsInput) {
    return;
  }

  if (typeof dialog.showModal !== "function") {
    const rows = 2;
    const cols = 2;
    const header = `| ${Array.from({ length: cols }, () => "Header").join(" | ")} |`;
    const separator = `| ${Array.from({ length: cols }, () => "---").join(" | ")} |`;
    const bodyRows = Array.from({ length: Math.max(rows - 1, 1) }, () =>
      `| ${Array.from({ length: cols }, () => "").join(" | ")} |`
    );
    insertText([header, separator, ...bodyRows].join("\n"));
    return;
  }

  dialog.showModal();

  const cancelButton = dialog.querySelector("[data-dialog-cancel]");
  const onCancel = () => dialog.close("cancel");
  cancelButton?.addEventListener("click", onCancel, { once: true });

  const onClose = () => {
    dialog.removeEventListener("close", onClose);
    if (dialog.returnValue !== "ok") {
      return;
    }
    const rows = Math.max(Number(rowsInput.value) || 0, 1);
    const cols = Math.max(Number(colsInput.value) || 0, 1);
    const header = `| ${Array.from({ length: cols }, () => "Header").join(" | ")} |`;
    const separator = `| ${Array.from({ length: cols }, () => "---").join(" | ")} |`;
    const bodyRows = Array.from({ length: Math.max(rows - 1, 1) }, () =>
      `| ${Array.from({ length: cols }, () => "").join(" | ")} |`
    );
    insertText([header, separator, ...bodyRows].join("\n"));
  };

  dialog.addEventListener("close", onClose);
}

function wrapSelection(before, after = before) {
  const selection = view.state.selection.main;
  const selectedText = view.state.doc.sliceString(selection.from, selection.to);
  const insert = `${before}${selectedText}${after}`;
  view.dispatch({
    changes: { from: selection.from, to: selection.to, insert },
    selection: { anchor: selection.from + before.length, head: selection.from + before.length + selectedText.length },
  });
  view.focus();
}

function insertLink() {
  wrapSelection("[", "](http://)");
}

const actions = {
  open: () => openFile(),
  save: () => saveFile(),
  saveAs: () => saveFileAs(),
  bold: () => wrapSelection("**"),
  italic: () => wrapSelection("*"),
  link: () => insertLink(),
  image: () => insertImage(),
  video: () => insertVideo(),
  file: () => insertFile(),
  table: () => insertTable(),
};

document.querySelectorAll("[data-action]").forEach((button) => {
  button.addEventListener("click", () => {
    const action = button.dataset.action;
    if (actions[action]) {
      actions[action]();
    }
  });
});

window.api.onMenuOpenFile(() => openFile());
window.api.onMenuSaveFile(() => saveFile());
window.api.onMenuSaveFileAs(() => saveFileAs());
window.api.onAppOpenFile((event, filePath) => openFile(filePath));
