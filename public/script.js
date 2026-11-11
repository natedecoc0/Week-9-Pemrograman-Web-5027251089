const API = '/api/series';
const STATUS = { watching: 'Watching', completed: 'Completed', plan: 'Plan to Watch', hold: 'On Hold' };
let items = [];
let tab = 'watching';

const $ = (s) => document.querySelector(s);
const say = (m) => ($('#msg').textContent = m);
const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

async function api(url, method = 'GET', body) {
  const res = await fetch(url, {
    method,
    headers: { 'Content-Type': 'application/json' },
    body: body ? JSON.stringify(body) : undefined,
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.message || 'Request failed');
  return data;
}

async function put(s, body) {
  const u = await api(`${API}/${s.id}`, 'PUT', body);
  items = items.map((i) => (i.id === u.id ? u : i));
  say(u.status !== s.status ? `"${u.title}" moved to ${STATUS[u.status]}!` : `"${u.title}" updated.`);
}

function card(s) {
  const pct = Math.round((s.watched / s.totalEpisodes) * 100);
  const quick = { watching: ['inc', '+1 Ep'], plan: ['start', '▶ Start'], hold: ['resume', '▶ Resume'], completed: ['review', '✎ Review'] }[s.status];
  const diary = s.status === 'completed'
    ? `<div>${[1, 2, 3, 4, 5].map((n) => `<span class="star ${n <= s.rating ? 'on' : ''}" data-a="rate" data-v="${n}">★</span>`).join('')}</div>
       <blockquote>${s.review ? esc(s.review) : '<small>No review yet...</small>'}</blockquote>`
    : '';
  return `
    <article class="card" data-s="${s.status}" data-id="${s.id}">
      <div class="card-title"><span>${esc(s.title)}</span><button class="del" data-a="del" title="Delete">×</button></div>
      <div class="card-body">
        <div class="meta">${esc(s.genre)} · ${s.totalEpisodes} eps</div>
        <div class="bar"><i style="width:${pct}%"></i></div>
        <div class="meta">Ep ${s.watched}/${s.totalEpisodes} (${pct}%)</div>
        ${diary}
        <div class="actions">
          <select data-a="status">
            ${Object.entries(STATUS).map(([k, v]) => `<option value="${k}" ${k === s.status ? 'selected' : ''}>${v}</option>`).join('')}
          </select>
          <button class="gbtn" data-a="${quick[0]}">${quick[1]}</button>
        </div>
      </div>
    </article>`;
}

function render() {
  const count = (k) => items.filter((i) => i.status === k).length;
  document.querySelectorAll('.tabs button').forEach((b) => {
    b.classList.toggle('active', b.dataset.s === tab);
    b.textContent = `${STATUS[b.dataset.s]} (${count(b.dataset.s)})`;
  });
  const list = items.filter((i) => i.status === tab);
  $('#list').innerHTML = list.length ? list.map(card).join('') : '<p class="empty">~ this folder is empty ~</p>';

  $('#counter').innerHTML = String(items.length).padStart(4, '0').split('').map((d) => `<span>${d}</span>`).join('');
  $('#counts').innerHTML = Object.entries(STATUS)
    .map(([k, v]) => `<li data-s="${k}"><span>${v}</span><b>${count(k)}</b></li>`).join('');
}

const actions = {
  inc: (s) => ({ watched: s.watched + 1 }),
  start: () => ({ status: 'watching' }),
  resume: () => ({ status: 'watching' }),
  rate: (s, el) => ({ rating: Number(el.dataset.v) }),
  review: (s) => {
    const r = prompt('Write your review:', s.review);
    return r === null ? null : { review: r };
  },
};

$('#list').addEventListener('click', async (e) => {
  const el = e.target.closest('[data-a]');
  if (!el || el.tagName === 'SELECT') return;
  const s = items.find((i) => i.id === Number(el.closest('.card').dataset.id));
  try {
    if (el.dataset.a === 'del') {
      if (!confirm(`Delete "${s.title}"?`)) return;
      await api(`${API}/${s.id}`, 'DELETE');
      items = items.filter((i) => i.id !== s.id);
      say(`"${s.title}" deleted.`);
    } else {
      const body = actions[el.dataset.a](s, el);
      if (!body) return;
      await put(s, body);
    }
    render();
  } catch (err) { say('Error: ' + err.message); }
});

$('#list').addEventListener('change', async (e) => {
  if (e.target.dataset.a !== 'status') return;
  const s = items.find((i) => i.id === Number(e.target.closest('.card').dataset.id));
  try { await put(s, { status: e.target.value }); render(); }
  catch (err) { say('Error: ' + err.message); }
});

document.querySelector('.tabs').addEventListener('click', (e) => {
  if (e.target.dataset.s) { tab = e.target.dataset.s; render(); }
});

$('#form').addEventListener('submit', async (e) => {
  e.preventDefault();
  try {
    const s = await api(API, 'POST', Object.fromEntries(new FormData(e.target)));
    items.push(s);
    tab = s.status;
    e.target.reset();
    say(`"${s.title}" added!`);
    render();
  } catch (err) { say('Error: ' + err.message); }
});

const CAT = [
  '.kk..........kk.',
  'kpok........kopk',
  'kppkkkkkkkkkkppk',
  'kooooooooooooook',
  'koookkooookkoook',
  'kooooooppoooooook',
  'kcckkkkkkkkkkcck',
  'kcckrrrrrrrrkcck',
  'kcckrrrrrrrrkcck',
  'kcckrRRRRRRrkcck',
  'kcckkRRRRRRkkcck',
  'kccccckkkkccccck',
  'kcccccccccccccck',
  'kcccccccccccccck',
  '.kkkkkkkkkkkkkk.',
];
const PAL = { k: '#1a1a1a', p: '#f6a5c0', o: '#e9b27a', c: '#f8ecd9', r: '#6a0010', R: '#d84444' };
$('#cat').innerHTML = `<svg viewBox="0 0 16 15" shape-rendering="crispEdges">${CAT.map((row, y) =>
  [...row.slice(0, 16)].map((ch, x) => (PAL[ch] ? `<rect x="${x}" y="${y}" width="1" height="1" fill="${PAL[ch]}"/>` : '')).join('')).join('')}</svg>`;

const tick = () => ($('#clock').textContent = new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }));
(async () => {
  try { items = await api(API); } catch { say('Failed to load data.'); }
  render();
  tick();
  setInterval(tick, 30000);
})();