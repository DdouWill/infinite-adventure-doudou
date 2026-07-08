import {
  buyItem,
  claimQuestReward,
  countries,
  createPlayer,
  equipItem,
  getItem,
  maps,
  parsePlayer,
  performBattle,
  rankingsFor,
  restAtInn,
  serializePlayer,
  shopItems,
  totalStats
} from './game-core.js';

const STORAGE_KEY = 'infinite-adventure-doudou-save-v1';
let state = loadPlayer();
let selectedMapId = 'meadow';
let currentView = 'battle';

const $ = (selector) => document.querySelector(selector);
const $$ = (selector) => Array.from(document.querySelectorAll(selector));

const nodes = {
  createView: $('#create-view'),
  gameView: $('#game-view'),
  createForm: $('#create-form'),
  playerTitle: $('#player-title'),
  statGrid: $('#stat-grid'),
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
  resetButton: $('#reset-button'),
  saveData: $('#save-data'),
  onlineCount: $('#online-count')
};

nodes.createForm.addEventListener('submit', (event) => {
  event.preventDefault();
  const form = new FormData(nodes.createForm);
  state = createPlayer({
    name: form.get('hero-name'),
    element: form.get('hero-element'),
    archetype: form.get('hero-archetype')
  });
  savePlayer();
  render();
});

nodes.battleButton.addEventListener('click', () => {
  if (!state) return;
  const battle = performBattle(state, selectedMapId);
  state = battle.player;
  savePlayer();
  render();
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

function render() {
  nodes.onlineCount.textContent = String(18 + new Date().getMinutes() % 9);
  if (!state) {
    nodes.createView.classList.remove('is-hidden');
    nodes.gameView.classList.add('is-hidden');
    return;
  }
  nodes.createView.classList.add('is-hidden');
  nodes.gameView.classList.remove('is-hidden');
  nodes.playerTitle.textContent = `${state.name}｜Lv.${state.level} ${state.element}・${state.job}`;
  renderStats();
  renderMaps();
  renderBattleLog();
  renderCharacter();
  renderInventory();
  renderQuest();
  renderWorld();
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
  const statRows = [
    ['金幣', state.gold],
    ['攻擊', stats.attack],
    ['防禦', stats.defense],
    ['速度', stats.speed],
    ['熟練', state.mastery]
  ].map(([label, value]) => `
    <div class="stat-chip">
      <span>${escapeHtml(label)}</span>
      <strong>${escapeHtml(String(value))}</strong>
    </div>
  `).join('');

  nodes.statGrid.innerHTML = `
    <article class="stat-card vital-card" aria-label="HP 與 MP">
      <div class="compact-block-title">
        <span>生命 / 魔力</span>
        <strong>HP・MP</strong>
      </div>
      <div class="resource-stack">${vitalRows}</div>
    </article>
    <article class="stat-card character-info-card" aria-label="其餘角色資訊">
      <div class="character-info__header">
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
        <span>${escapeHtml(label)}</span>
        <strong>${safeCurrent}/${safeMax}</strong>
      </div>
      <progress class="resource-meter" max="${safeMax}" value="${safeCurrent}" aria-label="${escapeHtml(label)} ${safeCurrent}/${safeMax}"></progress>
      <small>${escapeHtml(caption)}｜${percent}%</small>
    </div>
  `;
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

function renderMaps() {
  const selectedMap = maps.find((map) => map.id === selectedMapId) || maps[0];
  selectedMapId = selectedMap.id;
  const categories = maps.reduce((groups, map) => {
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
      <span>選擇戰鬥地圖</span>
      <select id="map-select" class="map-select" aria-label="選擇戰鬥地圖">
        ${optionGroups}
      </select>
      <small>以原版下拉選單方式切換一般 / 試煉 / 特殊 / 封閉地圖。</small>
    </label>
    <article class="selected-map-card" aria-live="polite">
      <div class="selected-map-card__header">
        <span class="map-card__category">${escapeHtml(selectedMap.category || '戰鬥地圖')}</span>
        <span class="map-card__level">Lv.${selectedMap.level}｜${escapeHtml(selectedMap.stage || '冒險')}</span>
      </div>
      <strong>${escapeHtml(selectedMap.name)}</strong>
      <p>${escapeHtml(selectedMap.description)}</p>
      <dl class="selected-map-card__stats">
        <div><dt>入場</dt><dd>${selectedMap.cost} 金幣</dd></div>
        <div><dt>EXP</dt><dd>${selectedMap.reward.exp}</dd></div>
        <div><dt>熟練</dt><dd>${selectedMap.reward.mastery}</dd></div>
      </dl>
      <em>${escapeHtml(selectedMap.routeHint || '依照目前 HP / MP 決定是否出擊。')}</em>
    </article>
  `;

  $('#map-select')?.addEventListener('change', (event) => {
    selectedMapId = event.target.value;
    renderMaps();
  });
}

function renderBattleLog() {
  nodes.battleLog.innerHTML = (state.log || [])
    .map((line) => `<p>${escapeHtml(line)}</p>`)
    .join('') || '<p>尚無戰鬥紀錄。</p>';
}

function renderCharacter() {
  const equipped = Object.entries(state.equipment)
    .map(([slot, itemId]) => {
      const item = itemId ? getItem(itemId) : null;
      return `<li><span>${slotLabel(slot)}</span><strong>${item ? escapeHtml(item.name) : '未裝備'}</strong></li>`;
    })
    .join('');

  nodes.characterSheet.innerHTML = `
    <div class="character-card">
      <h3>${escapeHtml(state.name)}</h3>
      <p>${escapeHtml(state.element)}屬性｜${escapeHtml(state.job)}｜Lv.${state.level}</p>
      <ul class="clean-list">
        <li><span>勝敗</span><strong>${state.wins} 勝 / ${state.losses} 敗</strong></li>
        <li><span>總戰數</span><strong>${state.battles}</strong></li>
        <li><span>熟練度</span><strong>${state.mastery}</strong></li>
      </ul>
    </div>
    <div class="character-card">
      <h3>裝備中</h3>
      <ul class="clean-list">${equipped}</ul>
    </div>
  `;
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
      <article class="item-card">
        <div>
          <strong>${escapeHtml(item.name)} × ${count}</strong>
          <p>${escapeHtml(item.description)}</p>
          <small>攻擊 +${item.attack || 0}｜防禦 +${item.defense || 0}</small>
        </div>
        <button class="ghost-button" type="button" data-equip="${item.id}">裝備</button>
      </article>
    `;
  }).join('') || '<p>背包是空的。</p>';

  nodes.shopList.innerHTML = shopItems.map((item) => `
    <article class="item-card">
      <div>
        <strong>${escapeHtml(item.name)}</strong>
        <p>${escapeHtml(item.description)}</p>
        <small>${item.price} 金幣｜攻擊 +${item.attack}｜防禦 +${item.defense}</small>
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
}

function renderQuest() {
  const quest = state.quest;
  nodes.questBoard.innerHTML = `
    <article class="quest-card">
      <div>
        <h3>${escapeHtml(quest.title)}</h3>
        <p>在晨露草原擊倒 ${quest.target} 隻怪物。</p>
        <progress max="${quest.target}" value="${quest.progress}"></progress>
        <small>${quest.completed ? '已完成' : `${quest.progress}/${quest.target}`}</small>
      </div>
      <button id="claim-quest" class="primary-action" type="button" ${quest.completed ? 'disabled' : ''}>領取獎勵</button>
    </article>
  `;
  $('#claim-quest').addEventListener('click', () => {
    state = claimQuestReward(state);
    savePlayer();
    render();
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
      <td>${row.rank}</td>
      <td>${escapeHtml(row.name)}</td>
      <td>${escapeHtml(row.element)}</td>
      <td>${row.level}</td>
      <td>${row.wins}</td>
    </tr>
  `).join('');
  nodes.worldView.innerHTML = `
    <div class="table-wrap">
      <h3>勢力表</h3>
      <table>
        <thead><tr><th>國名</th><th>屬性</th><th>領主</th><th>人數</th><th>資金</th><th>領土</th></tr></thead>
        <tbody>${countryRows}</tbody>
      </table>
    </div>
    <div class="table-wrap">
      <h3>傳說排行</h3>
      <table>
        <thead><tr><th>名次</th><th>名稱</th><th>屬性</th><th>等級</th><th>勝場</th></tr></thead>
        <tbody>${rankingRows}</tbody>
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

function slotLabel(slot) {
  return { weapon: '武器', armor: '防具', trinket: '飾品' }[slot] || slot;
}

function escapeHtml(value) {
  return value.replace(/[&<>'"]/g, (char) => ({
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    "'": '&#39;',
    '"': '&quot;'
  }[char]));
}

render();
