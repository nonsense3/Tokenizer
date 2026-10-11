import './style.css';

const input = document.querySelector('#prompt-input');
const modelSelect = document.querySelector('#model-select');
const tokenCount = document.querySelector('#token-count');
const characterCount = document.querySelector('#stat-characters');
const wordCount = document.querySelector('#stat-words');
const contextUsed = document.querySelector('#context-used');
const inputCost = document.querySelector('#input-cost');
const contextBar = document.querySelector('#context-bar');
const charCount = document.querySelector('#char-count');
const accuracyNote = document.querySelector('#accuracy-note');

const models = {
  'gpt-4o': { context: 128000, price: 2.5, ratio: 0.25, label: 'GPT-4o' },
  'claude-3-5-sonnet': { context: 200000, price: 3, ratio: 0.26, label: 'Claude 3.5 Sonnet' },
  'gemini-1-5-pro': { context: 2000000, price: 1.25, ratio: 0.24, label: 'Gemini 1.5 Pro' },
  'llama-3-1': { context: 128000, price: 0.7, ratio: 0.27, label: 'Llama 3.1' }
};

function estimateTokens(text) {
  if (!text.trim()) return 0;
  const pieces = text.match(/[\p{L}\p{N}]+|[^\s\p{L}\p{N}]/gu) || [];
  const words = text.match(/[\p{L}\p{N}]+/gu) || [];
  const punctuation = pieces.length - words.length;
  const longWords = words.reduce((total, word) => total + Math.max(0, Math.ceil(word.length / 4) - 1), 0);
  return Math.max(1, Math.round(words.length * 0.72 + punctuation * 0.55 + longWords));
}

function update() {
  const text = input.value;
  const model = models[modelSelect.value];
  const characters = text.length;
  const words = (text.match(/[\p{L}\p{N}]+/gu) || []).length;
  const tokens = estimateTokens(text);
  const usage = Math.min((tokens / model.context) * 100, 100);
  const cost = (tokens / 1000000) * model.price;

  tokenCount.textContent = tokens.toLocaleString();
  characterCount.textContent = characters.toLocaleString();
  wordCount.textContent = words.toLocaleString();
  contextUsed.textContent = `${usage.toFixed(1)}%`;
  inputCost.textContent = `$${cost.toFixed(4)}`;
  charCount.textContent = `${characters.toLocaleString()} ${characters === 1 ? 'character' : 'characters'}`;
  contextBar.style.width = `${Math.max(usage, text ? 1 : 0)}%`;
  accuracyNote.textContent = `${model.label} estimate · ${model.context.toLocaleString()} token context`;
}

input.addEventListener('input', update);
modelSelect.addEventListener('change', update);
document.querySelector('#clear-button').addEventListener('click', () => {
  input.value = '';
  input.focus();
  update();
});
document.querySelector('#analyze-button').addEventListener('click', () => {
  input.focus();
  input.animate([{ backgroundColor: '#fbfaf7' }, { backgroundColor: '#f1ede4' }, { backgroundColor: '#fbfaf7' }], { duration: 420 });
});
input.addEventListener('keydown', (event) => {
  if ((event.metaKey || event.ctrlKey) && event.key === 'Enter') {
    event.preventDefault();
    update();
  }
});

update();