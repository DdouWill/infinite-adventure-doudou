import {
  availableMaps,
  availableRebirthJobs,
  bestiaryEntries,
  buyItem,
  claimMilestone,
  claimQuestReward,
  countries,
  createBattleEncounter,
  createPlayer,
  equipItem,
  getItem,
  maps,
  milestonesFor,
  parsePlayer,
  portraitForMonster,
  portraitForPlayer,
  progressionGuide,
  rankingsFor,
  rebirthPlayer,
  restAtInn,
  serializePlayer,
  shopItems,
  totalStats,
  useItem
} from './game-core.js';
import { referenceCatalog } from './reference-catalog.js';

const STORAGE_KEY = 'infinite-adventure-doudou-save-v1';
const LOGIN_KEY = 'infinite-adventure-doudou-login-v1';
const ACTIVE_PLAYERS_KEY = 'infinite-adventure-doudou-active-players-v1';
const LOGIN_TOKEN_PATTERN = /^[A-Za-z0-9_]{4,8}$/;
const GOOGLE_EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const GOOGLE_OAUTH_SCOPE = 'openid email profile';
const GOOGLE_USERINFO_ENDPOINT = 'https://openidconnect.googleapis.com/v1/userinfo';
let loginSession = loadLoginSession();
let state = loadPlayer();
let selectedMapId = 'meadow';
let currentView = 'battle';
let battleTimers = [];
let activeBattleFinalPlayer = null;
let activeBattleFinished = false;

const uiIcons = {
  views: { battle: '⚔', character: '◎', inventory: '▣', quest: '?', world: '◇', save: '⇩' },
  menu: {
    'player-list-panel': '人',
    'system-news': '!',
    'news-log': '◇',
    'battle-records': '⚔',
    'ranking-panel': '#',
    'legend-panel': '★',
    'world-panel': '◎',
    'town-panel': '⌂',
    'public-index-panel': '::',
    'help-panel': '?',
    'guide-panel': '→',
    'map-guide-panel': '⌖',
    'mechanics-panel': '✦',
    'equip-panel': '†',
    'item-panel': '+',
    'icon-panel': '▦',
    'lineage-panel': '⟲'
  }
};

const $ = (selector) => document.querySelector(selector);
const $$ = (selector) => Array.from(document.querySelectorAll(selector));

const nodes = {
  loginView: $('#login-view'),
  appShell: $('.app-shell'),
  loginForm: $('#login-form'),
  loginMessage: $('#login-message'),
  loginId: $('#login-id'),
  loginPass: $('#login-pass'),
  registerToggleButton: $('#register-toggle-button'),
  registerModal: $('#register-modal'),
  registerPanel: $('#register-panel'),
  registerMessage: $('#register-message'),
  localRegisterForm: $('#local-register-form'),
  googleOauthButton: $('#google-oauth-button'),
  googleOauthStatus: $('#google-oauth-status'),
  registerId: $('#register-id'),
  createView: $('#create-view'),
  gameView: $('#game-view'),
  createForm: $('#create-form'),
  playerTitle: $('#player-title'),
  statGrid: $('#stat-grid'),
  adventureGuide: $('#adventure-guide'),
  mapList: $('#map-list'),
  battleButton: $('#battle-button'),
  restButton: $('#rest-button'),
  clearLogButton: $('#clear-log-button'),
  battleLog: $('#battle-log'),
  characterSheet: $('#character-sheet'),
  inventoryList: $('#inventory-list'),
  shopList: $('#shop-list'),
  questBoard: $('#quest-board'),
  worldView: $('#world-view'),
  exportButton: $('#export-button'),
  importButton: $('#import-button'),
  logoutButton: $('#logout-button'),
  resetButton: $('#reset-button'),
  saveData: $('#save-data'),
  onlineCount: $('#online-count'),
  loginOnlineCount: $('#login-online-count'),
  loginOnlineNames: $('#login-online-names'),
  playerListNames: $('#player-list-names'),
  functionMenu: $('#function-menu'),
  functionMenuButton: $('#function-menu-button'),
  functionMenuPanel: $('#function-menu-panel'),
  battlePage: $('#battle-page'),
  battlePageTitle: $('#battle-page-title'),
  battlePageStatus: $('#battle-page-status'),
  battlePlayerPortrait: $('#battle-player-portrait'),
  battlePlayerName: $('#battle-player-name'),
  battlePlayerHp: $('#battle-player-hp'),
  battlePlayerHpText: $('#battle-player-hp-text'),
  battlePlayerMp: $('#battle-player-mp'),
  battlePlayerMpText: $('#battle-player-mp-text'),
  battleMapName: $('#battle-map-name'),
  battleMonsterPortrait: $('#battle-monster-portrait'),
  battleMonsterName: $('#battle-monster-name'),
  battleMonsterHp: $('#battle-monster-hp'),
  battleMonsterHpText: $('#battle-monster-hp-text'),
  battleTurnFeed: $('#battle-turn-feed'),
  battleReturnButton: $('#battle-return-button'),
  battleReturnHint: $('#battle-return-hint')
};

decorateStaticUiIcons();

nodes.functionMenuButton.addEventListener('click', () => {
  const isOpen = nodes.functionMenuButton.getAttribute('aria-expanded') === 'true';
  setFunctionMenuOpen(!isOpen);
});

nodes.functionMenuPanel.addEventListener('click', (event) => {
  if (event.target.closest('a')) setFunctionMenuOpen(false);
});

document.addEventListener('click', (event) => {
  if (!nodes.functionMenu.contains(event.target)) setFunctionMenuOpen(false);
});

document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape') {
    if (!nodes.registerModal.hidden) closeRegisterModal();
    setFunctionMenuOpen(false);
  }
});

nodes.loginForm.addEventListener('submit', (event) => {
  event.preventDefault();
  const form = new FormData(nodes.loginForm);
  const account = String(form.get('id') || '').trim();
  const password = String(form.get('pass') || '').trim();
  if (!LOGIN_TOKEN_PATTERN.test(account) || !LOGIN_TOKEN_PATTERN.test(password)) {
    nodes.loginMessage.textContent = '帳號與密碼請使用 4～8 個半形英數字或底線。';
    return;
  }
  nodes.loginMessage.textContent = '登入成功，正在進入遊戲介面...';
  completeLoginSession({ account, source: 'password' }, account);
});

nodes.loginForm.addEventListener('reset', () => {
  nodes.loginMessage.textContent = '';
});

nodes.registerToggleButton.addEventListener('click', () => {
  openRegisterModal();
});

$$('[data-register-close]').forEach((button) => {
  button.addEventListener('click', () => closeRegisterModal());
});

nodes.localRegisterForm.addEventListener('submit', (event) => {
  event.preventDefault();
  const form = new FormData(nodes.localRegisterForm);
  const account = String(form.get('register-id') || '').trim();
  const password = String(form.get('register-pass') || '').trim();
  const confirmPassword = String(form.get('register-pass-confirm') || '').trim();
  if (!LOGIN_TOKEN_PATTERN.test(account) || !LOGIN_TOKEN_PATTERN.test(password) || !LOGIN_TOKEN_PATTERN.test(confirmPassword)) {
    nodes.registerMessage.textContent = '自行建立帳號時，帳號與密碼都要是 4～8 個半形英數字或底線。';
    return;
  }
  if (password !== confirmPassword) {
    nodes.registerMessage.textContent = '兩次密碼輸入不一致。';
    return;
  }
  nodes.registerMessage.textContent = '本機帳號建立完成，正在進入遊戲介面...';
  completeLoginSession({ account, source: 'local-register' }, account);
});

nodes.googleOauthButton.addEventListener('click', () => {
  startGoogleAuthorization();
});

$$('[data-login-focus]').forEach((button) => {
  button.addEventListener('click', () => {
    const target = button.dataset.loginFocus === 'pass' ? nodes.loginPass : nodes.loginId;
    target?.focus();
  });
});

nodes.createForm.addEventListener('submit', (event) => {
  event.preventDefault();
  const form = new FormData(nodes.createForm);
  state = createPlayer({
    name: form.get('hero-name'),
    element: form.get('hero-element'),
    archetype: form.get('hero-archetype')
  });
  savePlayer();
  if (loginSession) {
    loginSession = { ...loginSession, displayName: state.name };
    saveLoginSession();
    recordActivePlayer(loginSession, state.name);
  }
  render();
});

nodes.battleButton.addEventListener('click', () => {
  if (!state) return;
  startBattlePage();
});

nodes.battleReturnButton.addEventListener('click', () => {
  if (!activeBattleFinished) return;
  closeBattlePage();
});

nodes.restButton.addEventListener('click', () => {
  if (!state) return;
  state = restAtInn(state);
  savePlayer();
  render();
});

nodes.clearLogButton.addEventListener('click', () => {
  if (!state) return;
  state.log = [];
  savePlayer();
  renderBattleLog();
});

nodes.exportButton.addEventListener('click', () => {
  nodes.saveData.value = state ? serializePlayer(state) : '';
});

nodes.importButton.addEventListener('click', () => {
  try {
    state = parsePlayer(nodes.saveData.value);
    savePlayer();
    render();
  } catch (error) {
    nodes.saveData.value = `匯入失敗：${error.message}`;
  }
});

nodes.logoutButton.addEventListener('click', () => {
  localStorage.removeItem(LOGIN_KEY);
  loginSession = null;
  clearBattleTimers();
  nodes.battlePage.classList.add('is-hidden');
  setFunctionMenuOpen(false);
  render();
  window.location.hash = 'login';
});

nodes.resetButton.addEventListener('click', () => {
  const confirmed = window.confirm('確定要刪除目前角色存檔嗎？');
  if (!confirmed) return;
  localStorage.removeItem(STORAGE_KEY);
  state = null;
  render();
});

$$('.tab-button').forEach((button) => {
  button.addEventListener('click', () => {
    currentView = button.dataset.view;
    renderPanels();
  });
});

function decorateStaticUiIcons() {
  $$('.tab-button').forEach((button) => {
    if (button.querySelector('.ui-icon')) return;
    const view = button.dataset.view;
    const label = button.textContent.trim();
    button.innerHTML = `${iconMarkup(uiIcons.views[view] || '>')}<span>${escapeHtml(label)}</span>`;
  });

  $$('.function-menu__item').forEach((item) => {
    const summary = item.querySelector('summary');
    if (!summary || summary.querySelector('.ui-icon')) return;
    const label = summary.textContent.trim();
    summary.innerHTML = `${iconMarkup(uiIcons.menu[item.id] || '>')}<span>${escapeHtml(label)}</span>`;
  });

  const homeLink = $('.function-menu__home');
  if (homeLink && !homeLink.querySelector('.ui-icon')) {
    const label = homeLink.textContent.trim();
    homeLink.innerHTML = `${iconMarkup('⌂')}<span>${escapeHtml(label)}</span>`;
  }
}

function iconMarkup(icon, extraClass = '') {
  return `<span class="ui-icon${extraClass ? ` ${extraClass}` : ''}" aria-hidden="true">${escapeHtml(icon)}</span>`;
}

function setFunctionMenuOpen(isOpen) {
  nodes.functionMenu.classList.toggle('is-open', isOpen);
  nodes.functionMenuButton.setAttribute('aria-expanded', String(isOpen));
  nodes.functionMenuPanel.hidden = !isOpen;
}

function startBattlePage() {
  clearBattleTimers();
  const encounter = createBattleEncounter(state, selectedMapId, battleRng());
  activeBattleFinalPlayer = encounter.player;
  activeBattleFinished = false;
  setFunctionMenuOpen(false);
  if (window.location.hash !== '#battle-page') window.history.pushState(null, '', '#battle-page');
  renderBattlePage(encounter);
  revealBattleTurns(encounter);
}

function renderBattlePage(encounter) {
  const scene = encounter.scene;
  nodes.battlePage.classList.remove('is-hidden');
  document.body.classList.add('battle-page-active');
  nodes.battlePageTitle.textContent = `${scene.map.name}｜${scene.monster.name}`;
  nodes.battlePageStatus.textContent = '回合演出中';
  nodes.battlePlayerPortrait.src = portraitForPlayer(state);
  nodes.battlePlayerPortrait.alt = `${state.name} 圖像`;
  nodes.battlePlayerName.textContent = state.name;
  nodes.battleMapName.textContent = `${scene.map.category}｜Lv.${scene.map.level}`;
  nodes.battleMonsterPortrait.src = scene.monster.portrait || portraitForMonster(scene.monster.name);
  nodes.battleMonsterPortrait.alt = `${scene.monster.name} 圖像`;
  nodes.battleMonsterName.textContent = scene.monster.name;
  nodes.battleTurnFeed.innerHTML = '';
  nodes.battleReturnButton.disabled = true;
  nodes.battleReturnButton.textContent = '戰鬥進行中...';
  nodes.battleReturnHint.textContent = '回合攻擊正在進行，結束後即可返回主畫面。';
  updateBattleMeters(scene.playerStart, scene.monsterStart);
  nodes.battlePage.focus?.();
}

function revealBattleTurns(encounter) {
  const turns = encounter.scene.turns;
  const delay = battleTurnDelayMs();
  turns.forEach((turn, index) => {
    const timer = window.setTimeout(() => {
      appendBattleTurn(turn);
      updateBattleMeters({
        hp: turn.playerHp,
        maxHp: encounter.scene.playerStart.maxHp,
        mp: turn.playerMp,
        maxMp: encounter.scene.playerStart.maxMp
      }, {
        hp: turn.monsterHp,
        maxHp: encounter.scene.monsterStart.maxHp
      });
      if (index === turns.length - 1) finishBattlePage(encounter);
    }, delay * (index + 1));
    battleTimers.push(timer);
  });
}

function appendBattleTurn(turn) {
  const line = document.createElement('p');
  line.className = `battle-turn battle-turn--${turn.side}`;
  line.innerHTML = `${iconMarkup(battleTurnIcon(turn.side), 'turn-icon')}<span>${escapeHtml(turn.text)}</span>`;
  nodes.battleTurnFeed.append(line);
  pulseBattleActor(turn.side);
  nodes.battleTurnFeed.scrollTop = nodes.battleTurnFeed.scrollHeight;
}

function pulseBattleActor(side) {
  const actor = side === 'monster'
    ? document.querySelector('.battle-actor--player')
    : side === 'player'
      ? document.querySelector('.battle-actor--monster')
      : null;
  if (!actor) return;
  actor.classList.remove('is-hit-flash');
  void actor.offsetWidth;
  actor.classList.add('is-hit-flash');
  window.setTimeout(() => actor.classList.remove('is-hit-flash'), 360);
}

function finishBattlePage(encounter) {
  activeBattleFinished = true;
  state = activeBattleFinalPlayer;
  activeBattleFinalPlayer = null;
  savePlayer();
  render();
  nodes.battlePage.classList.remove('is-hidden');
  document.body.classList.add('battle-page-active');
  updateBattleMeters(encounter.scene.playerEnd, encounter.scene.monsterEnd);
  nodes.battlePageStatus.textContent = encounter.result === 'win' ? '戰鬥勝利' : encounter.result === 'blocked' ? '無法出擊' : '戰鬥結束';
  nodes.battleReturnButton.disabled = false;
  nodes.battleReturnButton.textContent = '返回主頁面';
  nodes.battleReturnHint.textContent = '戰鬥已結束，可以返回主畫面。';
}

function closeBattlePage() {
  clearBattleTimers();
  activeBattleFinalPlayer = null;
  activeBattleFinished = false;
  nodes.battlePage.classList.add('is-hidden');
  document.body.classList.remove('battle-page-active');
  if (window.location.hash === '#battle-page') window.history.pushState(null, '', '#main');
  document.querySelector('#game-panel')?.scrollIntoView({ block: 'start' });
}

function updateBattleMeters(playerMeter, monsterMeter) {
  setProgress(nodes.battlePlayerHp, nodes.battlePlayerHpText, 'HP', playerMeter.hp, playerMeter.maxHp);
  setProgress(nodes.battlePlayerMp, nodes.battlePlayerMpText, 'MP', playerMeter.mp, playerMeter.maxMp);
  setProgress(nodes.battleMonsterHp, nodes.battleMonsterHpText, 'HP', monsterMeter.hp, monsterMeter.maxHp);
}

function setProgress(progress, label, prefix, current, max) {
  const safeMax = Math.max(1, Number(max) || 1);
  const safeCurrent = Math.min(safeMax, Math.max(0, Number(current) || 0));
  progress.max = safeMax;
  progress.value = safeCurrent;
  label.textContent = `${prefix} ${safeCurrent}/${safeMax}`;
}

function clearBattleTimers() {
  battleTimers.forEach((timer) => window.clearTimeout(timer));
  battleTimers = [];
}

function battleRng() {
  const seedText = new URLSearchParams(window.location.search).get('battleSeed');
  if (!seedText) return Math.random;
  let seed = 2166136261;
  for (const char of seedText) {
    seed ^= char.charCodeAt(0);
    seed = Math.imul(seed, 16777619);
  }
  return () => {
    seed = Math.imul(seed ^ (seed >>> 15), 2246822507);
    seed = Math.imul(seed ^ (seed >>> 13), 3266489909);
    seed ^= seed >>> 16;
    return (seed >>> 0) / 4294967296;
  };
}

function battleTurnDelayMs() {
  const value = Number(new URLSearchParams(window.location.search).get('battleDelayMs'));
  return Number.isFinite(value) && value >= 0 ? value : 620;
}

function render() {
  renderActivePlayerLists();
  if (!loginSession) {
    nodes.loginView.classList.remove('is-hidden');
    nodes.appShell.classList.add('is-hidden');
    nodes.createView.classList.add('is-hidden');
    nodes.gameView.classList.add('is-hidden');
    return;
  }
  nodes.loginView.classList.add('is-hidden');
  nodes.appShell.classList.remove('is-hidden');
  if (!state) {
    nodes.createView.classList.remove('is-hidden');
    nodes.gameView.classList.add('is-hidden');
    return;
  }
  nodes.createView.classList.add('is-hidden');
  nodes.gameView.classList.remove('is-hidden');
  nodes.playerTitle.textContent = `${state.name}｜Lv.${state.level} ${state.element}・${state.job}`;
  renderStats();
  renderAdventureGuide();
  renderMaps();
  renderBattleLog();
  renderCharacter();
  renderInventory();
  renderQuest();
  renderWorld();
  renderReferenceCatalog();
  renderPanels();
}

function renderStats() {
  const stats = totalStats(state);
  const vitalRows = [
    { label: 'HP', current: state.hp, max: state.maxHp, tone: 'hp', caption: '生命值' },
    { label: 'MP', current: state.mp, max: state.maxMp, tone: 'mp', caption: '魔力值' }
  ].map(({ label, current, max, tone, caption }) => resourceRow({ label, current, max, tone, caption })).join('');
  const expRow = resourceRow({ label: 'EXP', current: state.exp, max: state.nextExp, tone: 'exp', caption: '升級進度' });

  const equipped = compactEquipmentSummary(state);
  const portrait = portraitForPlayer(state);
  const statRows = [
    ['金幣', state.gold, '$', 'gold'],
    ['攻擊', stats.attack, '†', 'attack'],
    ['防禦', stats.defense, '▣', 'defense'],
    ['速度', stats.speed, '»', 'speed'],
    ['熟練', state.mastery, '✦', 'mastery']
  ].map(([label, value, icon, tone]) => `
    <div class="stat-chip stat-chip--${escapeHtml(tone)}">
      ${iconMarkup(icon)}
      <span>${escapeHtml(label)}</span>
      <strong>${escapeHtml(String(value))}</strong>
    </div>
  `).join('');

  nodes.statGrid.innerHTML = `
    <article class="stat-card vital-card" aria-label="HP 與 MP">
      <div class="compact-block-title">
        ${iconMarkup('♥')}
        <span>生命 / 魔力</span>
        <strong>HP・MP</strong>
      </div>
      <div class="resource-stack">${vitalRows}</div>
    </article>
    <article class="stat-card character-info-card" aria-label="其餘角色資訊">
      <div class="character-info__header">
        <img class="character-portrait" src="${escapeHtml(portrait)}" alt="${escapeHtml(state.name)} 圖像" width="64" height="64">
        ${iconMarkup('◎')}
        <span>角色情報</span>
        <strong>${escapeHtml(state.element)}・${escapeHtml(state.job)}｜Lv.${state.level}</strong>
      </div>
      <div class="character-info__body">
        <dl class="character-info__meta">
          <div><dt>戰績</dt><dd>${state.wins}勝/${state.losses}敗</dd></div>
          <div><dt>戰數</dt><dd>${state.battles}</dd></div>
          <div><dt>裝備</dt><dd>${escapeHtml(equipped)}</dd></div>
        </dl>
        <div class="character-info__exp">${expRow}</div>
        <div class="stat-chip-row" aria-label="角色能力摘要">${statRows}</div>
      </div>
    </article>
  `;
}

function resourceRow({ label, current, max, tone, caption }) {
  const safeMax = Math.max(1, Number(max) || 1);
  const safeCurrent = Math.min(safeMax, Math.max(0, Number(current) || 0));
  const percent = Math.round((safeCurrent / safeMax) * 100);
  return `
    <div class="resource-row resource-row--${tone}">
      <div class="resource-card__header">
        ${iconMarkup(resourceIcon(tone))}
        <span>${escapeHtml(label)}</span>
        <strong>${safeCurrent}/${safeMax}</strong>
      </div>
      <progress class="resource-meter" max="${safeMax}" value="${safeCurrent}" aria-label="${escapeHtml(label)} ${safeCurrent}/${safeMax}"></progress>
      <code class="ascii-meter" aria-hidden="true">${asciiBar(safeCurrent, safeMax)}</code>
      <small>${escapeHtml(caption)}｜${percent}%</small>
    </div>
  `;
}

function asciiBar(current, max) {
  const total = 18;
  const filled = Math.round((Math.max(0, current) / Math.max(1, max)) * total);
  return `[${'|'.repeat(filled)}${'.'.repeat(total - filled)}]`;
}

function compactEquipmentSummary(player) {
  return ['weapon', 'armor', 'trinket']
    .map((slot) => {
      const itemId = player.equipment?.[slot];
      const item = itemId ? getItem(itemId) : null;
      return item ? item.name : `${slotLabel(slot)}未裝`;
    })
    .join(' / ');
}

function renderAdventureGuide() {
  const guide = progressionGuide(state, selectedMapId);
  nodes.adventureGuide.innerHTML = `
    <article class="guide-card guide-card--${escapeHtml(guide.readiness.tone)}">
      <div class="guide-card__main">
        <div class="compact-block-title">
          ${iconMarkup('>')}
          <span>冒險指南</span>
          <strong>Stage ${guide.stage}</strong>
        </div>
        <p>${escapeHtml(guide.nextAction)}</p>
        <div class="route-steps" aria-label="新手路線進度">
          ${guide.route.map((step) => `
            <span class="route-step ${step.done ? 'is-done' : ''}">${iconMarkup(step.done ? '✓' : '·')}<span>${escapeHtml(step.label)}</span></span>
          `).join('')}
        </div>
      </div>
      <div class="readiness-card" data-tone="${escapeHtml(guide.readiness.tone)}">
        <span>${iconMarkup(readinessIcon(guide.readiness.tone))}${escapeHtml(guide.readiness.label)}</span>
        <small>${escapeHtml(guide.readiness.detail)}</small>
        ${guide.suggestedMapId !== selectedMapId
          ? `<button class="ghost-button compact-button" type="button" data-suggest-map="${escapeHtml(guide.suggestedMapId)}">前往 ${escapeHtml(guide.suggestedMapName)}</button>`
          : ''}
      </div>
    </article>
  `;
  $('[data-suggest-map]')?.addEventListener('click', (event) => {
    selectedMapId = event.currentTarget.dataset.suggestMap;
    renderAdventureGuide();
    renderMaps();
  });
}

function renderMaps() {
  const visibleMaps = availableMaps(state);
  const selectedMap = visibleMaps.find((map) => map.id === selectedMapId) || visibleMaps[0] || maps[0];
  const guide = progressionGuide(state, selectedMap.id);
  selectedMapId = selectedMap.id;
  const categories = visibleMaps.reduce((groups, map) => {
    const category = map.category || '戰鬥地圖';
    groups[category] = groups[category] || [];
    groups[category].push(map);
    return groups;
  }, {});
  const optionGroups = Object.entries(categories).map(([category, categoryMaps]) => `
    <optgroup label="${escapeHtml(category)}">
      ${categoryMaps.map((map) => `
        <option value="${escapeHtml(map.id)}" ${map.id === selectedMapId ? 'selected' : ''}>
          Lv.${map.level}｜${escapeHtml(map.name)}｜${escapeHtml(map.stage || '冒險')}
        </option>
      `).join('')}
    </optgroup>
  `).join('');

  nodes.mapList.innerHTML = `
    <label class="map-select-field" for="map-select">
      <span class="map-select-field__label">${iconMarkup('⌖')}<span>選擇戰鬥地圖</span></span>
      <select id="map-select" class="map-select" aria-label="選擇戰鬥地圖">
        ${optionGroups}
      </select>
      <small>地圖會依冒險進度更新；目前只列已確認座標。</small>
    </label>
    <article class="selected-map-card" aria-live="polite">
      <div class="selected-map-card__header">
        <span class="map-card__category">${iconMarkup(mapCategoryIcon(selectedMap.category))}${escapeHtml(selectedMap.category || '戰鬥地圖')}</span>
        <span class="readiness-pill readiness-pill--${escapeHtml(guide.readiness.tone)}">${iconMarkup(readinessIcon(guide.readiness.tone))}${escapeHtml(guide.readiness.label)}</span>
        <span class="map-card__level">Lv.${selectedMap.level}｜${escapeHtml(selectedMap.stage || '冒險')}</span>
      </div>
      <strong>${escapeHtml(selectedMap.name)}</strong>
      <p>${escapeHtml(selectedMap.description)}</p>
      <dl class="selected-map-card__stats">
        <div><dt>${iconMarkup('$')}入場</dt><dd>${selectedMap.cost} 金幣</dd></div>
        <div><dt>${iconMarkup('▲')}EXP</dt><dd>${selectedMap.reward.exp}</dd></div>
        <div><dt>${iconMarkup('✦')}熟練</dt><dd>${selectedMap.reward.mastery}</dd></div>
      </dl>
      <em>${escapeHtml(guide.readiness.detail)}｜${escapeHtml(selectedMap.routeHint || '依照目前 HP / MP 決定是否出擊。')}</em>
    </article>
  `;

  $('#map-select')?.addEventListener('change', (event) => {
    selectedMapId = event.target.value;
    renderAdventureGuide();
    renderMaps();
  });
}

function renderBattleLog() {
  nodes.battleLog.innerHTML = (state.log || [])
    .map((line) => `<p class="record-line">${iconMarkup(battleLogIcon(line))}<span>${escapeHtml(line)}</span></p>`)
    .join('') || `<p class="record-line">${iconMarkup('…')}<span>尚無戰鬥紀錄。</span></p>`;
}

function renderCharacter() {
  const equipped = Object.entries(state.equipment)
    .map(([slot, itemId]) => {
      const item = itemId ? getItem(itemId) : null;
      return `<li>${iconMarkup(slotIcon(slot))}<span>${slotLabel(slot)}</span><strong>${item ? escapeHtml(item.name) : '未裝備'}</strong></li>`;
    })
    .join('');
  const rebirthJobs = availableRebirthJobs(state);

  nodes.characterSheet.innerHTML = `
    <div class="character-card character-card--portrait">
      <img class="character-portrait character-portrait--large" src="${escapeHtml(portraitForPlayer(state))}" alt="${escapeHtml(state.name)} 圖像" width="96" height="96">
      <div>
        <h3>${escapeHtml(state.name)}</h3>
        <p>${escapeHtml(state.element)}屬性｜${escapeHtml(state.job)}｜Lv.${state.level}</p>
      </div>
      <ul class="clean-list">
        <li>${iconMarkup('✓')}<span>勝敗</span><strong>${state.wins} 勝 / ${state.losses} 敗</strong></li>
        <li>${iconMarkup('#')}<span>總戰數</span><strong>${state.battles}</strong></li>
        <li>${iconMarkup('✦')}<span>熟練度</span><strong>${state.mastery}</strong></li>
        <li>${iconMarkup('⟲')}<span>轉生次數</span><strong>${state.rebirthCount || 0}</strong></li>
      </ul>
    </div>
    <div class="character-card">
      <h3>裝備中</h3>
      <ul class="clean-list">${equipped}</ul>
    </div>
    <div class="character-card character-card--rebirth">
      <h3>${iconMarkup('⟲')}轉生職業</h3>
      <p class="muted-copy">達成條件後才會出現可選職業；特殊道路不會以未解鎖提示占位。</p>
      ${rebirthJobs.length ? `
        <div class="rebirth-list">
          ${rebirthJobs.map((job) => `
            <article class="rebirth-card rebirth-card--${escapeHtml(job.tier)}">
              <div>
                <strong>${escapeHtml(job.name)}</strong>
                <p>${escapeHtml(job.description)}</p>
                <small>招式：${escapeHtml(job.skillNames.slice(0, 3).join(' / '))}｜超奧義：${escapeHtml(job.ultimateName)}</small>
              </div>
              <button class="ghost-button compact-button" type="button" data-rebirth="${escapeHtml(job.id)}">轉生</button>
            </article>
          `).join('')}
        </div>
      ` : '<p>目前沒有可轉生職業。先提升 Lv.5、熟練 500、完成草原討伐與 5 場戰鬥。</p>'}
    </div>
  `;
  $$('[data-rebirth]').forEach((button) => {
    button.addEventListener('click', () => {
      state = rebirthPlayer(state, button.dataset.rebirth);
      savePlayer();
      render();
    });
  });
}

function renderInventory() {
  const inventoryCounts = state.inventory.reduce((acc, itemId) => {
    acc[itemId] = (acc[itemId] || 0) + 1;
    return acc;
  }, {});

  nodes.inventoryList.innerHTML = Object.entries(inventoryCounts).map(([itemId, count]) => {
    const item = getItem(itemId);
    if (!item) return '';
    return `
      <article class="item-card item-card--${escapeHtml(item.type)}">
        <span class="item-card__icon" aria-hidden="true">${escapeHtml(itemIcon(item))}</span>
        <div>
          <strong>${escapeHtml(item.name)} × ${count}</strong>
          <p>${escapeHtml(item.description)}</p>
          <small>${itemSummary(item)}</small>
        </div>
        ${item.type === 'consumable'
          ? `<button class="ghost-button" type="button" data-use="${item.id}">使用</button>`
          : `<button class="ghost-button" type="button" data-equip="${item.id}">裝備</button>`}
      </article>
    `;
  }).join('') || '<p>背包是空的。</p>';

  nodes.shopList.innerHTML = shopItems.map((item) => `
    <article class="item-card item-card--${escapeHtml(item.type)}">
      <span class="item-card__icon" aria-hidden="true">${escapeHtml(itemIcon(item))}</span>
      <div>
        <strong>${escapeHtml(item.name)}</strong>
        <p>${escapeHtml(item.description)}</p>
        <small>${item.price} 金幣｜${itemSummary(item)}</small>
      </div>
      <button class="ghost-button" type="button" data-buy="${item.id}">購買</button>
    </article>
  `).join('');

  $$('[data-buy]').forEach((button) => {
    button.addEventListener('click', () => {
      state = buyItem(state, button.dataset.buy);
      savePlayer();
      render();
    });
  });
  $$('[data-equip]').forEach((button) => {
    button.addEventListener('click', () => {
      state = equipItem(state, button.dataset.equip);
      savePlayer();
      render();
    });
  });
  $$('[data-use]').forEach((button) => {
    button.addEventListener('click', () => {
      state = useItem(state, button.dataset.use);
      savePlayer();
      render();
    });
  });
}

function itemSummary(item) {
  if (item.type === 'consumable') return `道具｜${escapeHtml(item.effect || '使用')}${item.value ? ` +${escapeHtml(String(item.value))}` : ''}`;
  return `${slotLabel(item.type)}｜攻擊 +${item.attack || 0}｜防禦 +${item.defense || 0}`;
}

function renderQuest() {
  const quest = state.quest;
  const questReady = !quest.completed && quest.progress >= quest.target;
  const milestoneRows = milestonesFor(state);
  const bestiaryRows = bestiaryEntries(state).slice(0, 8);
  const mapRunRows = Object.entries(state.mapRuns || {})
    .map(([mapId, count]) => ({ map: maps.find((map) => map.id === mapId), count }))
    .filter((entry) => entry.map)
    .sort((a, b) => b.count - a.count || a.map.level - b.map.level)
    .slice(0, 8);

  nodes.questBoard.innerHTML = `
    <article class="quest-card quest-card--main">
      <span class="quest-card__icon" aria-hidden="true">?</span>
      <div>
        <h3>${escapeHtml(quest.title)}</h3>
        <p>在草原擊倒 ${quest.target} 隻怪物，完成後會解鎖更清楚的新手節奏。</p>
        <progress max="${quest.target}" value="${quest.progress}"></progress>
        <small>${quest.completed ? '已完成' : `${quest.progress}/${quest.target}`}</small>
      </div>
      <button id="claim-quest" class="primary-action" type="button" ${questReady ? '' : 'disabled'}>${quest.completed ? '已完成' : questReady ? '領取獎勵' : '未完成'}</button>
    </article>

    <section class="milestone-board" aria-label="冒險目標">
      <div class="compact-block-title">
        ${iconMarkup('✓')}
        <span>冒險目標</span>
        <strong>${milestoneRows.filter((milestone) => milestone.claimed).length}/${milestoneRows.length}</strong>
      </div>
      <div class="milestone-list">
        ${milestoneRows.map((milestone) => `
          <article class="milestone-card ${milestone.complete ? 'is-complete' : ''} ${milestone.claimed ? 'is-claimed' : ''}">
            <span class="milestone-card__icon" aria-hidden="true">${escapeHtml(milestone.icon)}</span>
            <div>
              <h3>${escapeHtml(milestone.title)}</h3>
              <p>${escapeHtml(milestone.description)}</p>
              <small>獎勵：${escapeHtml(milestone.rewardText)}</small>
            </div>
            <button class="ghost-button compact-button" type="button" data-claim-milestone="${escapeHtml(milestone.id)}" ${!milestone.complete || milestone.claimed ? 'disabled' : ''}>
              ${milestone.claimed ? '已領取' : milestone.complete ? '領取' : '未完成'}
            </button>
          </article>
        `).join('')}
      </div>
    </section>

    <section class="collection-board" aria-label="探索紀錄">
      <article class="collection-card">
        <div class="compact-block-title">
          ${iconMarkup('▦')}
          <span>討伐圖鑑</span>
          <strong>${Object.keys(state.bestiary || {}).length} 種</strong>
        </div>
        ${bestiaryRows.length ? `
          <ul class="collection-list">
            ${bestiaryRows.map((entry) => `
              <li>
                <img class="avatar-image" src="${escapeHtml(entry.portrait || portraitForMonster(entry.name))}" alt="${escapeHtml(entry.name)} 圖像" width="28" height="28">
                <span>${escapeHtml(entry.name)}</span>
                <strong>${entry.count} 勝</strong>
                <small>${escapeHtml(entry.firstMap || entry.lastMap || '未知地圖')}</small>
              </li>
            `).join('')}
          </ul>
        ` : '<p>尚未記錄魔物。先從草原開始討伐吧。</p>'}
      </article>
      <article class="collection-card">
        <div class="compact-block-title">
          ${iconMarkup('⌖')}
          <span>地圖紀錄</span>
          <strong>${Object.keys(state.mapRuns || {}).length} 張</strong>
        </div>
        ${mapRunRows.length ? `
          <ul class="collection-list collection-list--maps">
            ${mapRunRows.map(({ map, count }) => `
              <li>
                ${iconMarkup(mapCategoryIcon(map.category))}
                <span>${escapeHtml(map.name)}</span>
                <strong>${count} 次</strong>
                <small>Lv.${map.level}｜${escapeHtml(map.stage || map.category)}</small>
              </li>
            `).join('')}
          </ul>
        ` : '<p>尚未探索地圖。每次出擊都會自動記錄。</p>'}
      </article>
    </section>
  `;
  $('#claim-quest').addEventListener('click', () => {
    state = claimQuestReward(state);
    savePlayer();
    render();
  });
  $$('[data-claim-milestone]').forEach((button) => {
    button.addEventListener('click', () => {
      state = claimMilestone(state, button.dataset.claimMilestone);
      savePlayer();
      render();
    });
  });
}

function renderWorld() {
  const countryRows = countries.map((country) => `
    <tr>
      <td>${escapeHtml(country.name)}</td>
      <td>${escapeHtml(country.element)}</td>
      <td>${escapeHtml(country.ruler)}</td>
      <td>${country.people}</td>
      <td>${country.gold.toLocaleString()}</td>
      <td>${country.territory}</td>
    </tr>
  `).join('');
  const rankingRows = rankingsFor(state).map((row) => `
    <tr>
      <td>${row.rank === 1 ? '★1位' : `${row.rank}位`}</td>
      <td><img class="avatar-image" src="${escapeHtml(rankingPortrait(row))}" alt="${escapeHtml(row.name)} 圖像" width="28" height="28"></td>
      <td>${escapeHtml(row.name)}</td>
      <td>${escapeHtml(row.element)}</td>
      <td>${row.hp}/${row.maxHp}</td>
      <td>${row.mp}/${row.maxMp}</td>
      <td>${escapeHtml(row.job)}</td>
      <td>${row.battles}戰${row.wins}勝</td>
    </tr>
  `).join('');
  nodes.worldView.innerHTML = `
    <div class="table-wrap">
      <h3>${iconMarkup('◇')}勢力表</h3>
      <table>
        <thead><tr><th>國名</th><th>屬性</th><th>領主</th><th>人數</th><th>資金</th><th>領土</th></tr></thead>
        <tbody>${countryRows}</tbody>
      </table>
    </div>
    <div class="table-wrap">
      <h3>${iconMarkup('★')}傳說排行</h3>
      <table class="classic-ranking-table">
        <thead><tr><th>順位</th><th>頭像</th><th>名稱</th><th>屬性</th><th>HP</th><th>MP</th><th>職業</th><th>戰數</th></tr></thead>
        <tbody>${rankingRows}</tbody>
      </table>
    </div>
  `;
}

function renderReferenceCatalog() {
  const visibleMapNames = new Set(availableMaps(state).map((map) => map.name));
  const visibleReferenceMaps = referenceCatalog.maps.filter((map) => visibleMapNames.has(map.name));
  renderReferenceTable('#reference-weapon-catalog', ['名稱', '奧義', '屬性', '威力', '重量', '價格', '產地'], referenceCatalog.weapons, (weapon) => [weapon.name, weapon.ougi, weapon.element, weapon.power, weapon.weight, weapon.price, weapon.origin]);
  renderReferenceTable('#reference-item-catalog', ['名稱', '說明'], referenceCatalog.items, (item) => [item.name, item.description]);
  renderReferenceTable('#reference-technique-catalog', ['技能', '威力', '發動率', '消耗MP', '職業', '說明'], referenceCatalog.techniques, (technique) => [technique.name, technique.power, `${technique.rate}%`, technique.mp, technique.job, technique.extra ? `${technique.description}｜${technique.extra}` : technique.description]);
  renderReferenceTable('#reference-ougi-catalog', ['奧義', '需要熟練', '職業', '說明'], referenceCatalog.ougis, (ougi) => [ougi.name, ougi.mastery, ougi.job, ougi.description]);
  renderReferenceTable('#reference-map-catalog', ['地圖', '分類', '入場', '掉落／特色', '說明'], visibleReferenceMaps, (map) => [map.name, map.category, map.cost, map.drop, map.description]);
}

function renderReferenceTable(selector, headings, rows, mapRow) {
  const node = $(selector);
  if (!node) return;
  node.innerHTML = `
    <p class="reference-catalog-count">${iconMarkup('#')}共 ${rows.length} 筆</p>
    <div class="dense-table-wrap reference-catalog-scroll">
      <table>
        <thead><tr>${headings.map((heading) => `<th>${escapeHtml(heading)}</th>`).join('')}</tr></thead>
        <tbody>
          ${rows.map((row) => `<tr>${mapRow(row).map((cell) => `<td>${escapeHtml(cell)}</td>`).join('')}</tr>`).join('')}
        </tbody>
      </table>
    </div>
  `;
}

function renderPanels() {
  $$('.tab-button').forEach((button) => {
    button.classList.toggle('is-active', button.dataset.view === currentView);
  });
  $$('.view-panel').forEach((panel) => {
    panel.classList.toggle('is-hidden', panel.dataset.panel !== currentView);
  });
}

function savePlayer() {
  if (!state) return;
  localStorage.setItem(STORAGE_KEY, serializePlayer(state));
}

function loadPlayer() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? parsePlayer(raw) : null;
  } catch {
    return null;
  }
}

function openRegisterModal() {
  nodes.registerModal.hidden = false;
  nodes.registerModal.classList.remove('is-hidden');
  nodes.registerToggleButton.setAttribute('aria-expanded', 'true');
  nodes.registerMessage.textContent = '可自行設定帳密，或透過 Google OAuth 授權建立本機 session。';
  nodes.registerId.focus();
}

function closeRegisterModal() {
  nodes.registerModal.hidden = true;
  nodes.registerModal.classList.add('is-hidden');
  nodes.registerToggleButton.setAttribute('aria-expanded', 'false');
  nodes.registerToggleButton.focus();
}

function startGoogleAuthorization() {
  const clientId = getGoogleClientId();
  if (!clientId) {
    setGoogleOauthStatus('尚未設定 Google OAuth Client ID，無法開啟 Google 授權。');
    return;
  }
  if (!window.google?.accounts?.oauth2?.initTokenClient) {
    setGoogleOauthStatus('Google 授權 SDK 尚未載入完成，請稍後再試。');
    return;
  }
  setGoogleOauthStatus('正在開啟 Google 授權視窗...');
  const tokenClient = window.google.accounts.oauth2.initTokenClient({
    client_id: clientId,
    scope: GOOGLE_OAUTH_SCOPE,
    prompt: 'select_account',
    callback: handleGoogleAuthorizationResponse
  });
  tokenClient.requestAccessToken({ prompt: 'select_account' });
}

async function handleGoogleAuthorizationResponse(response) {
  if (response?.error) {
    setGoogleOauthStatus(`Google 授權失敗：${response.error}`);
    return;
  }
  if (!response?.access_token) {
    setGoogleOauthStatus('Google 授權沒有回傳 access token。');
    return;
  }
  try {
    setGoogleOauthStatus('Google 已授權，正在讀取帳號資料...');
    const profile = await fetchGoogleProfile(response.access_token);
    const heroName = deriveGoogleHeroName(profile.name, profile.email);
    nodes.registerMessage.textContent = 'Google 授權完成，正在進入遊戲介面...';
    completeLoginSession({
      account: profile.email,
      displayName: heroName,
      picture: profile.picture || '',
      source: 'google-oauth',
      authProvider: 'google'
    }, heroName);
  } catch (error) {
    setGoogleOauthStatus(`Google 授權資料讀取失敗：${error.message}`);
  }
}

async function fetchGoogleProfile(accessToken) {
  const response = await fetch(GOOGLE_USERINFO_ENDPOINT, {
    headers: { Authorization: `Bearer ${accessToken}` }
  });
  if (!response.ok) throw new Error(`userinfo ${response.status}`);
  const profile = await response.json();
  const email = String(profile.email || '').trim();
  if (!GOOGLE_EMAIL_PATTERN.test(email)) throw new Error('Google 帳號沒有可用 Email');
  return {
    email,
    name: String(profile.name || profile.given_name || email.split('@')[0] || '').trim(),
    picture: String(profile.picture || '')
  };
}

function getGoogleClientId() {
  return document.querySelector('meta[name="google-oauth-client-id"]')?.content.trim() || '';
}

function setGoogleOauthStatus(message) {
  nodes.googleOauthStatus.textContent = message;
}

function loadActivePlayers() {
  try {
    const players = JSON.parse(localStorage.getItem(ACTIVE_PLAYERS_KEY) || '[]');
    if (!Array.isArray(players)) return [];
    return players
      .map((player) => ({
        account: String(player?.account || '').trim(),
        displayName: sanitizeActivePlayerName(player?.displayName || player?.account),
        source: String(player?.source || 'local').trim(),
        lastSeenAt: String(player?.lastSeenAt || '')
      }))
      .filter((player) => player.account && player.displayName)
      .slice(0, 12);
  } catch {
    return [];
  }
}

function saveActivePlayers(players) {
  localStorage.setItem(ACTIVE_PLAYERS_KEY, JSON.stringify(players.slice(0, 12)));
}

function recordActivePlayer(session, heroName) {
  const account = String(session?.account || '').trim();
  if (!account) return;
  const displayName = sanitizeActivePlayerName(heroName || session.displayName || account);
  const nextPlayer = {
    account,
    displayName,
    source: session.source || 'local',
    lastSeenAt: new Date().toISOString()
  };
  const existing = loadActivePlayers().filter((player) => player.account !== account);
  saveActivePlayers([nextPlayer, ...existing]);
}

function renderActivePlayerLists() {
  const players = loadActivePlayers();
  const count = String(players.length);
  if (nodes.loginOnlineCount) nodes.loginOnlineCount.textContent = count;
  if (nodes.onlineCount) nodes.onlineCount.textContent = count;
  renderActivePlayerList(nodes.loginOnlineNames, players, 'terminal-login__online-empty');
  renderActivePlayerList(nodes.playerListNames, players, 'function-menu__account-empty');
}

function renderActivePlayerList(container, players, emptyClass) {
  if (!container) return;
  container.innerHTML = '';
  if (players.length === 0) {
    const item = document.createElement('li');
    item.className = emptyClass;
    item.textContent = '尚無本機遊玩帳號';
    container.append(item);
    return;
  }
  for (const player of players) {
    const item = document.createElement('li');
    const name = document.createElement('strong');
    name.textContent = player.displayName;
    const meta = document.createElement('small');
    meta.textContent = accountSourceLabel(player.source);
    item.append(name, meta);
    container.append(item);
  }
}

function sanitizeActivePlayerName(value) {
  const name = String(value || '').trim().replace(/\s+/g, '').slice(0, 18);
  return name || '本機旅人';
}

function accountSourceLabel(source) {
  return source === 'google-oauth' ? 'Google OAuth' : '本機帳號';
}

function completeLoginSession(session, heroName) {
  if (!nodes.registerModal.hidden) closeRegisterModal();
  loginSession = { ...session, loginAt: new Date().toISOString() };
  saveLoginSession();
  recordActivePlayer(loginSession, heroName || session.displayName || session.account);
  prefillHeroName(heroName || session.displayName || session.account);
  render();
  window.location.hash = 'game-panel';
}

function prefillHeroName(value) {
  const input = nodes.createForm.elements['hero-name'];
  if (!state && input && !input.value) input.value = sanitizeHeroName(value);
}

function deriveGoogleHeroName(displayName, email) {
  const fallback = String(email).split('@')[0] || 'Google旅人';
  return sanitizeHeroName(displayName || fallback);
}

function sanitizeHeroName(value) {
  const name = String(value || '').trim().replace(/\s+/g, '').slice(0, 12);
  return name.length >= 2 ? name : 'Google旅人';
}

function saveLoginSession() {
  localStorage.setItem(LOGIN_KEY, JSON.stringify(loginSession));
}

function loadLoginSession() {
  try {
    const raw = localStorage.getItem(LOGIN_KEY);
    const session = raw ? JSON.parse(raw) : null;
    const account = String(session?.account || '');
    if (!account) return null;
    if (session.source === 'google-oauth') return GOOGLE_EMAIL_PATTERN.test(account) ? session : null;
    return LOGIN_TOKEN_PATTERN.test(account) ? session : null;
  } catch {
    return null;
  }
}

function rankingPortrait(row) {
  if (row.name === state?.name) return portraitForPlayer(state);
  return row.portrait || portraitForPlayer(row);
}

function resourceIcon(tone) {
  return { hp: '♥', mp: '✦', exp: '▲' }[tone] || '·';
}

function readinessIcon(tone) {
  return { safe: '✓', warning: '!', danger: '×' }[tone] || '?';
}

function mapCategoryIcon(category = '') {
  if (category.includes('消耗')) return '$';
  if (category.includes('稀有')) return '?';
  if (category.includes('戰數')) return '#';
  if (category.includes('世界')) return '◇';
  return '⌖';
}

function slotIcon(slot) {
  return { weapon: '†', armor: '▣', trinket: '◇' }[slot] || '·';
}

function itemIcon(item) {
  if (item.type === 'consumable') {
    if (item.effect === 'heal') return '+';
    if (item.effect === 'restoreMp') return '✦';
    if (item.effect === 'mastery') return '▲';
    return '*';
  }
  return slotIcon(item.type);
}

function battleLogIcon(line = '') {
  if (line.includes('升級')) return '▲';
  if (line.includes('獲得')) return '$';
  if (line.includes('無法')) return '!';
  if (line.includes('戰敗')) return '×';
  if (line.includes('擊倒')) return '✓';
  return '>';
}

function battleTurnIcon(side) {
  return { player: '>', monster: '<', system: '*' }[side] || '·';
}

function slotLabel(slot) {
  return { weapon: '武器', armor: '防具', trinket: '飾品' }[slot] || slot;
}

function escapeHtml(value) {
  return String(value).replace(/[&<>'"]/g, (char) => ({
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    "'": '&#39;',
    '"': '&quot;'
  }[char]));
}

renderReferenceCatalog();
render();
