import { labels, searchConcepts } from './search.mjs';
const $ = id => document.getElementById(id);
export const escapeHtml = value => String(value).replace(/[&<>"']/g, ch => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[ch]));
const e = escapeHtml;
const list = items => `<ul>${items.map(x => `<li>${e(x)}</li>`).join('')}</ul>`;
const formatLabel = value => value === 'XV' ? '15 人制' : '7 人制';
const reviewLabel = c => c.review.status === 'expert-reviewed' ? '専門家レビュー記録あり' : '専門家レビュー待ち';
const tags = c => `<span class="tag ${e(c.side)}">${e(labels.side[c.side])}</span><span class="tag">${e(labels.level[c.level])}</span>${c.formats.map(f => `<span class="tag">${formatLabel(f)}</span>`).join('')}`;
let dataset;
let lastDetailId;
let renderedURL;
function filtersFromURL() {
  const p = new URLSearchParams(location.search);
  for (const key of ['q','side','level','format']) {
    const control = $(key === 'q' ? 'query' : key);
    control.value = (p.get(key) || '').slice(0,200);
    if (control.tagName === 'SELECT' && control.selectedIndex === -1) control.value = '';
  }
}
function filterState() { return { q: $('query').value, side: $('side').value, level: $('level').value, format: $('format').value }; }
function syncURL() {
  const url = new URL(location.href);
  for (const [key, value] of Object.entries(filterState())) value ? url.searchParams.set(key,value) : url.searchParams.delete(key);
  history.replaceState(null,'',url);
}
function card(c) {
  return `<a class="card" href="#${encodeURIComponent(c.id)}"><div class="card-tags">${tags(c)}</div><h3>${e(c.name.ja)}</h3><p class="en-name" lang="en">${e(c.name.en)}</p><p class="card-summary">${e(c.summary.ja)}</p><div class="card-bottom"><span>公開資料に基づく · ${reviewLabel(c)}</span><b aria-hidden="true">↗</b></div></a>`;
}
function renderResults() {
  const results = searchConcepts(dataset.concepts,filterState());
  $('results').innerHTML = results.map(card).join('');
  $('result-count').textContent = `${results.length} 件 / ${dataset.concepts.length} のコンセプト`;
  $('empty').hidden = results.length > 0;
}
function block(title, content, full=false) { return `<section class="detail-block ${full?'full':''}"><h2>${e(title)}</h2>${content}</section>`; }
function conceptView(c) {
  const sources = new Map(dataset.sources.map(s=>[s.id,s]));
  const aliases = c.aliases.length ? c.aliases.map(a=>`<div class="alias">${e(a.label)} <small>(${e(a.language)})</small><span>${a.kind==='contextual'?'文脈依存の候補':a.kind==='translation'?'編集上の訳語':'出典上の別名'} · ${e(a.note)}</span></div>`).join('') : '<p>登録された別名はありません。</p>';
  const roleHtml = `<div class="role-list">${c.mechanics.roles.map(r=>`<article class="role"><h3>${e(r.label)}</h3><p>${e(r.task)}</p><p class="small-note">role: ${e(r.id)}</p></article>`).join('')}</div>`;
  const steps = `<ol class="sequence">${c.mechanics.sequence.map(s=>`<li><strong>${e(s.description)}</strong><span>きっかけ: ${e(s.trigger)}</span><br><span class="small-note">${e(s.actor)} → ${e(s.action)}</span></li>`).join('')}</ol>`;
  const decisions = c.mechanics.decisions.map(d=>`<article class="decision"><h3>${e(d.cue)}</h3>${list(d.options.map(o=>`${o.when} → ${o.action}`))}<p class="small-note">不確実性: ${e(d.uncertainty)}</p></article>`).join('');
  const relations = c.relationships.length ? `<ul class="relation-list">${c.relationships.map(r=>{const target=dataset.concepts.find(x=>x.id===r.target);return `<li><a href="#${encodeURIComponent(r.target)}"><span>${e(target.name.ja)}<br><small>${e(r.note)}</small></span><span class="tag">${e(labels.relation[r.type])} ↗</span></a></li>`;}).join('')}</ul>` : '<p class="small-note">関係はまだ登録されていません。関係がないことを意味しません。</p>';
  const evidence = c.claims.map(claim=>`<article class="source"><p class="claim"><strong>${e(claim.text)}</strong></p>${claim.evidence.map(v=>{const s=sources.get(v.source);return `<p>${v.support==='direct'?'資料の記述を確認':'資料をもとにした編集上の構造化'}</p><a href="${e(s.url)}" target="_blank" rel="noopener noreferrer">${e(s.title)} ↗</a><p>${e(s.publisher)} · ${e(s.accessed)} 確認 · ${e(v.locator)}</p>`;}).join('')}</article>`).join('');
  const jsonPath = `./data/concepts/${c.id.slice(4)}.json`;
  return `<a class="back-link" href="#explorer">← 戦術一覧に戻る</a><div class="detail-header"><div class="tag-row">${tags(c)}</div><h1 id="detail-title" tabindex="-1">${e(c.name.ja)}</h1><p class="en-name" lang="en">${e(c.name.en)}</p><p class="detail-lead">${e(c.summary.ja)}</p><p class="small-note" lang="en">${e(c.summary.en)}</p><p class="detail-id">${e(c.id)} · concept v${e(c.version)} · dataset v${e(dataset.version)}</p></div><div class="review-banner"><strong>資料確認済み / ${reviewLabel(c)} / 自動実行不可</strong>${e(c.review.note)}<br>日本語名・説明は編集上の訳・要約です。公式訳や統一規格ではありません。</div><div class="detail-grid">${block('何を狙うか',list(c.intent))}${block('別名と用語の注意',aliases)}${block('使う条件',list(c.applicability.conditions))}${block('適用できないこと・注意',list(c.applicability.limits))}${block('役割と位置関係',`<p class="small-note">以下は説明用の構造化です。検証済みの実行手順ではありません。固定の背番号・座標を指定しません。</p>${roleHtml}${list(c.mechanics.positioning.map(p=>`${p.subject} ${p.relation} ${p.object}: ${p.note}`))}`,true)}${block('動きの流れ',steps)}${block('見るものと、判断の分岐',decisions)}${block('関連するコンセプト',relations)}${block('バリエーションと不確実性',`${c.variations.length?list(c.variations.map(v=>`${v.name}: ${v.difference}`)):''}${list(c.uncertainties)}`)}${block('出典と根拠の範囲',evidence,true)}${block('データを使う',`<p>このコンセプトは <strong>execution.ready = false</strong> です。${e(c.execution.reason)}</p><div class="json-tools"><a href="${e(jsonPath)}" download>JSON をダウンロード ↗</a><button type="button" id="copy-json">JSON をコピー</button><p id="copy-status" role="status" aria-live="polite"></p></div><details class="json-details"><summary>構造化 JSON を表示</summary><pre tabindex="0" aria-label="コンセプト JSON"><code>${e(JSON.stringify(c,null,2))}</code></pre></details>`,true)}</div>`;
}
function route() {
  // A fragment navigation may emit both popstate and hashchange. Render only once
  // so the second event does not remove the element that just received focus.
  if (renderedURL === location.href) return;
  renderedURL = location.href;
  let id;
  try { id=decodeURIComponent(location.hash.slice(1)); } catch { id='invalid'; }
  const selected = id.startsWith('rtk:') ? dataset.concepts.find(c=>c.id===id) : null;
  const isDetail = Boolean(selected) || id.startsWith('rtk:') || id==='invalid';
  $('hero').hidden=isDetail; $('explorer').hidden=isDetail; $('detail').hidden=!isDetail;
  if (selected) {
    $('detail').innerHTML=conceptView(selected);
    document.title=`${selected.name.ja} | Rugby Tactics DB`;
    $('copy-json').addEventListener('click', async()=>{
      try { if (!navigator.clipboard?.writeText) throw new Error('Clipboard unavailable'); await navigator.clipboard.writeText(JSON.stringify(selected,null,2)); $('copy-status').textContent='コピーしました'; }
      catch { $('copy-status').textContent='コピーできませんでした。JSON をダウンロードしてください。'; }
    });
    if (lastDetailId!==id) { $('detail-title').focus({preventScroll:true}); window.scrollTo(0,0); }
  } else if (isDetail) {
    $('detail').innerHTML='<a class="back-link" href="#explorer">← 戦術一覧に戻る</a><div class="error-panel"><h1 id="detail-title" tabindex="-1">コンセプトが見つかりません</h1><p>リンクの ID を確認するか、一覧から検索してください。削除された ID を別の戦術に自動変換することはありません。</p></div>';
    document.title='コンセプトが見つかりません | Rugby Tactics DB'; $('detail-title').focus();
  } else {
    document.title='Rugby Tactics DB | ラグビー戦術の共通知識';
    filtersFromURL(); renderResults();
    if(lastDetailId && (!id || id==='explorer')) { const current=document.querySelector(`a.card[href="#${encodeURIComponent(lastDetailId)}"]`); $('explorer').scrollIntoView(); requestAnimationFrame(()=>{ if (current?.isConnected && !$('explorer').hidden) current.focus({preventScroll:true}); }); }
  }
  lastDetailId=isDetail?id:null;
  if (!isDetail && id==='about') $('about').scrollIntoView();
}
function reset() { for(const key of ['query','side','level','format']) $(key).value=''; syncURL();renderResults();$('query').focus(); }
async function init() {
  try {
    const response=await fetch(new URL('./data/dataset.json',import.meta.url));
    if(!response.ok) throw new Error(`HTTP ${response.status}`);
    dataset=await response.json();
    if(!Array.isArray(dataset.concepts)||!dataset.concepts.length) throw new Error('Invalid dataset');
    $('concept-count').textContent=dataset.concepts.length; $('source-count').textContent=dataset.sources.length;
    filtersFromURL();renderResults();route();
    document.querySelector('.skip').addEventListener('click',event=>{event.preventDefault();$('main').focus();});
    $('search-form').addEventListener('submit',ev=>{ev.preventDefault();syncURL();renderResults();});
    $('query').addEventListener('input',()=>{syncURL();renderResults();});
    for(const key of ['side','level','format']) $(key).addEventListener('change',()=>{syncURL();renderResults();});
    $('reset').addEventListener('click',reset);$('empty-reset').addEventListener('click',reset);
    window.addEventListener('hashchange',route);
    window.addEventListener('popstate',()=>{filtersFromURL();route();});
  } catch(error) {
    $('result-count').textContent='データを読み込めませんでした';
    $('results').innerHTML='<div class="error-panel"><h3>読み込みに失敗しました</h3><p>接続を確認して再読み込みしてください。</p><button type="button" id="retry">再読み込み</button> <a href="https://github.com/Kou-ISK/rugby-tactics-db">GitHub で確認する</a></div>';
    $('retry').addEventListener('click',()=>location.reload());
    console.error('Dataset load failed:',error.message);
  }
}
init();
