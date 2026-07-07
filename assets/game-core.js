export const elements = ['火', '水', '風', '星', '雷', '光', '闇'];

export const maps = [
  {
    id: 'meadow',
    name: '晨露草原',
    level: 1,
    cost: 0,
    description: '新手練功地。怪物弱，但仍要注意 HP。',
    monsters: ['跳跳史萊姆', '迷路菇菇', '貪吃豆鳥'],
    reward: { exp: 16, gold: 22, mastery: 8 }
  },
  {
    id: 'marsh',
    name: '霧氣沼地',
    level: 3,
    cost: 20,
    description: '需要一點裝備。怪物會造成較高傷害。',
    monsters: ['泥沼蛙兵', '毒霧水母', '濕地咒偶'],
    reward: { exp: 34, gold: 58, mastery: 17 }
  },
  {
    id: 'tower',
    name: '星屑高塔',
    level: 6,
    cost: 60,
    description: '掉寶率較高，但新手硬闖很容易倒下。',
    monsters: ['星光守衛', '裂紋魔書', '塔頂小惡魔'],
    reward: { exp: 78, gold: 132, mastery: 38 }
  }
];

export const shopItems = [
  { id: 'wood_sword', type: 'weapon', name: '豆木短劍', price: 80, attack: 7, defense: 0, description: '公會發放的木劍升級版。' },
  { id: 'wind_dagger', type: 'weapon', name: '風芽匕首', price: 220, attack: 15, defense: 0, description: '輕巧，適合想先秒怪的新手。' },
  { id: 'linen_robe', type: 'armor', name: '旅行布衣', price: 90, attack: 0, defense: 6, description: '比公會制服更耐打。' },
  { id: 'bronze_mail', type: 'armor', name: '青銅胸甲', price: 260, attack: 0, defense: 14, description: '穩定通過沼地的第一步。' },
  { id: 'star_charm', type: 'trinket', name: '星砂護符', price: 180, attack: 3, defense: 3, description: '小幅提升攻防，附帶好心情。' }
];

export const countries = [
  { name: '豆豆王國', element: '光', ruler: '小豆王', people: 42, gold: 124800, territory: 5 },
  { name: '夜芽同盟', element: '闇', ruler: '黑豆參謀', people: 31, gold: 98300, territory: 4 },
  { name: '風車自由城', element: '風', ruler: '旅人晴空', people: 27, gold: 72100, territory: 3 }
];

export const npcRankings = [
  { name: '小豆王', level: 12, wins: 388, element: '光' },
  { name: '黑豆參謀', level: 10, wins: 301, element: '闇' },
  { name: '旅人晴空', level: 9, wins: 244, element: '風' },
  { name: '紅豆騎士', level: 7, wins: 188, element: '火' }
];

export function createPlayer({ name, element, archetype }) {
  const safeName = String(name || '').trim().slice(0, 12);
  if (safeName.length < 2) throw new Error('角色名稱至少需要 2 個字。');
  if (!elements.includes(element)) throw new Error('請選擇有效屬性。');

  const base = {
    blade: { job: '豆豆劍士', hp: 120, mp: 28, attack: 18, defense: 8, speed: 9 },
    sage: { job: '微光術士', hp: 92, mp: 62, attack: 13, defense: 7, speed: 8 },
    ranger: { job: '草原巡守', hp: 104, mp: 36, attack: 15, defense: 7, speed: 14 }
  }[archetype] || { job: '豆豆冒險者', hp: 105, mp: 36, attack: 15, defense: 8, speed: 10 };

  return {
    version: 1,
    name: safeName,
    element,
    job: base.job,
    level: 1,
    exp: 0,
    nextExp: 80,
    gold: 120,
    hp: base.hp,
    maxHp: base.hp,
    mp: base.mp,
    maxMp: base.mp,
    attack: base.attack,
    defense: base.defense,
    speed: base.speed,
    mastery: 0,
    wins: 0,
    losses: 0,
    battles: 0,
    inventory: ['novice_badge'],
    equipment: { weapon: null, armor: null, trinket: null },
    quest: { id: 'first_hunt', title: '草原討伐', target: 3, progress: 0, completed: false },
    log: ['歡迎來到豆豆冒險公會。先去晨露草原試試身手吧！'],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };
}

export function getItem(itemId) {
  if (itemId === 'novice_badge') {
    return { id: 'novice_badge', type: 'trinket', name: '新手豆徽章', price: 0, attack: 1, defense: 1, description: '象徵你加入公會的第一天。' };
  }
  return shopItems.find((item) => item.id === itemId) || null;
}

export function equipmentBonus(player) {
  return Object.values(player.equipment).reduce((bonus, itemId) => {
    const item = getItem(itemId);
    if (!item) return bonus;
    bonus.attack += item.attack || 0;
    bonus.defense += item.defense || 0;
    return bonus;
  }, { attack: 0, defense: 0 });
}

export function totalStats(player) {
  const bonus = equipmentBonus(player);
  return {
    attack: player.attack + bonus.attack,
    defense: player.defense + bonus.defense,
    speed: player.speed
  };
}

export function chooseMap(mapId) {
  return maps.find((map) => map.id === mapId) || maps[0];
}

export function performBattle(player, mapId, rng = Math.random) {
  const map = chooseMap(mapId);
  const next = clonePlayer(player);
  const stats = totalStats(next);
  const monsterName = map.monsters[Math.floor(rng() * map.monsters.length)] || map.monsters[0];
  const monsterPower = map.level * 12 + 10;
  const variance = 0.82 + rng() * 0.36;
  const playerPower = stats.attack * 1.55 + stats.defense * 0.85 + stats.speed * 0.45 + next.level * 8;
  const winChance = clamp(0.2 + (playerPower - monsterPower) / 120, 0.18, 0.92);
  const didWin = rng() <= winChance;
  const damageBase = Math.max(4, Math.round((monsterPower * variance) - stats.defense * 0.75));
  const damage = didWin ? Math.max(2, Math.round(damageBase * 0.55)) : Math.max(8, Math.round(damageBase * 1.15));

  next.battles += 1;
  next.hp = Math.max(0, next.hp - damage);

  const messages = [];
  if (next.gold < map.cost) {
    messages.push(`金幣不足，無法前往 ${map.name}。`);
    next.updatedAt = new Date().toISOString();
    next.log = mergeLog(next.log, messages);
    return { player: next, result: 'blocked', messages };
  }
  next.gold -= map.cost;

  if (didWin && next.hp > 0) {
    const expGain = Math.round(map.reward.exp * (0.85 + rng() * 0.4));
    const goldGain = Math.round(map.reward.gold * (0.75 + rng() * 0.6));
    const masteryGain = Math.round(map.reward.mastery * (0.8 + rng() * 0.5));
    next.exp += expGain;
    next.gold += goldGain;
    next.mastery += masteryGain;
    next.wins += 1;
    next.quest = updateQuest(next.quest, map.id);
    messages.push(`你在 ${map.name} 擊倒了「${monsterName}」，獲得 ${expGain} EXP、${goldGain} 金幣、${masteryGain} 熟練。`);

    if (rng() < itemDropChance(map.level)) {
      const drop = randomDrop(map.level, rng);
      next.inventory.push(drop.id);
      messages.push(`打寶成功：獲得「${drop.name}」。`);
    }

    const levelMessages = applyLevelUps(next);
    messages.push(...levelMessages);
  } else {
    const lostGold = Math.floor(next.gold * 0.15);
    next.gold -= lostGold;
    next.losses += 1;
    messages.push(`你被「${monsterName}」打退，損失 ${lostGold} 金幣。回旅店整理一下吧。`);
  }

  next.updatedAt = new Date().toISOString();
  next.log = mergeLog(next.log, messages);
  return { player: next, result: didWin ? 'win' : 'loss', messages };
}

export function restAtInn(player) {
  const next = clonePlayer(player);
  const cost = Math.max(10, Math.round(next.level * 18));
  if (next.gold < cost) {
    next.log = mergeLog(next.log, [`旅店需要 ${cost} 金幣，你目前金幣不足。`]);
    return next;
  }
  next.gold -= cost;
  next.hp = next.maxHp;
  next.mp = next.maxMp;
  next.updatedAt = new Date().toISOString();
  next.log = mergeLog(next.log, [`花費 ${cost} 金幣休息，HP / MP 已完全恢復。`]);
  return next;
}

export function buyItem(player, itemId) {
  const item = getItem(itemId);
  if (!item || item.price <= 0) throw new Error('找不到商品。');
  const next = clonePlayer(player);
  if (next.gold < item.price) {
    next.log = mergeLog(next.log, [`金幣不足，無法購買「${item.name}」。`]);
    return next;
  }
  next.gold -= item.price;
  next.inventory.push(item.id);
  next.updatedAt = new Date().toISOString();
  next.log = mergeLog(next.log, [`購買「${item.name}」成功。`]);
  return next;
}

export function equipItem(player, itemId) {
  const item = getItem(itemId);
  if (!item) throw new Error('找不到物品。');
  const next = clonePlayer(player);
  if (!next.inventory.includes(itemId)) throw new Error('背包中沒有這個物品。');
  next.equipment[item.type] = item.id;
  next.updatedAt = new Date().toISOString();
  next.log = mergeLog(next.log, [`已裝備「${item.name}」。`]);
  return next;
}

export function claimQuestReward(player) {
  const next = clonePlayer(player);
  if (!next.quest || next.quest.completed) return next;
  if (next.quest.progress < next.quest.target) {
    next.log = mergeLog(next.log, [`任務尚未完成：${next.quest.progress}/${next.quest.target}`]);
    return next;
  }
  next.quest.completed = true;
  next.gold += 160;
  next.exp += 45;
  const levelMessages = applyLevelUps(next);
  next.updatedAt = new Date().toISOString();
  next.log = mergeLog(next.log, [`完成「${next.quest.title}」，獲得 160 金幣與 45 EXP。`, ...levelMessages]);
  return next;
}

export function rankingsFor(player) {
  const playerRow = player ? [{ name: player.name, level: player.level, wins: player.wins, element: player.element }] : [];
  return [...playerRow, ...npcRankings]
    .sort((a, b) => b.level - a.level || b.wins - a.wins)
    .map((row, index) => ({ ...row, rank: index + 1 }));
}

export function serializePlayer(player) {
  return JSON.stringify(player, null, 2);
}

export function parsePlayer(json) {
  const data = JSON.parse(json);
  if (!data || typeof data !== 'object') throw new Error('存檔格式錯誤。');
  if (!data.name || !data.element || !Number.isFinite(data.level)) throw new Error('存檔缺少必要角色資料。');
  if (!Array.isArray(data.inventory)) data.inventory = [];
  if (!data.equipment) data.equipment = { weapon: null, armor: null, trinket: null };
  if (!Array.isArray(data.log)) data.log = [];
  return data;
}

function updateQuest(quest, mapId) {
  if (!quest || quest.completed || mapId !== 'meadow') return quest;
  return { ...quest, progress: Math.min(quest.target, quest.progress + 1) };
}

function applyLevelUps(player) {
  const messages = [];
  while (player.exp >= player.nextExp) {
    player.exp -= player.nextExp;
    player.level += 1;
    player.nextExp = Math.round(player.nextExp * 1.32 + 30);
    player.maxHp += 16 + player.level * 2;
    player.maxMp += 6 + Math.floor(player.level / 2);
    player.attack += 3;
    player.defense += 2;
    player.speed += player.level % 2 === 0 ? 2 : 1;
    player.hp = player.maxHp;
    player.mp = player.maxMp;
    messages.push(`等級提升！目前 Lv.${player.level}，HP / MP 已恢復。`);
  }
  return messages;
}

function randomDrop(level, rng) {
  const candidates = level >= 5
    ? ['star_charm', 'bronze_mail', 'wind_dagger']
    : ['novice_badge', 'wood_sword', 'linen_robe'];
  const id = candidates[Math.floor(rng() * candidates.length)] || candidates[0];
  return getItem(id);
}

function itemDropChance(level) {
  return clamp(0.08 + level * 0.025, 0.08, 0.28);
}

function mergeLog(oldLog, messages) {
  return [...messages, ...(oldLog || [])].slice(0, 40);
}

function clonePlayer(player) {
  return JSON.parse(JSON.stringify(player));
}

function clamp(value, min, max) {
  return Math.min(max, Math.max(min, value));
}
