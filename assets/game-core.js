import { referenceCatalog } from './reference-catalog.js';

export const elements = ['火', '水', '風', '星', '雷', '光', '闇'];

function referenceMap(name) {
  return referenceCatalog.maps.find((map) => map.name === name) || { name, category: '戰鬥地圖', description: '', drop: '' };
}

function makeMap(name, options) {
  const reference = referenceMap(name);
  return {
    id: options.id,
    name,
    category: options.category || reference.category,
    stage: options.stage,
    level: options.level,
    cost: options.cost,
    description: reference.description,
    routeHint: `原版掉落／特色：${reference.drop}`,
    monsters: options.monsters,
    reward: options.reward
  };
}

export const maps = [
  makeMap('草原', { id: 'meadow', stage: '新手入門', level: 1, cost: 0, monsters: ['草原鼠', '爪貓', '黃斑狗', '獨色鳥', '紅蟻'], reward: { exp: 16, gold: 22, mastery: 8 } }),
  makeMap('沼地', { id: 'marsh', stage: '裝備檢定', level: 3, cost: 20, monsters: ['犀牛', '蜂群'], reward: { exp: 34, gold: 58, mastery: 17 } }),
  makeMap('森林', { id: 'forest', stage: '掉寶初階', level: 5, cost: 45, monsters: ['魔狼', '夜狐'], reward: { exp: 58, gold: 96, mastery: 28 } }),
  makeMap('高塔', { id: 'tower', stage: '高塔試煉', level: 7, cost: 70, monsters: ['七彩鳥', '惡龍'], reward: { exp: 86, gold: 138, mastery: 42 } }),
  makeMap('廢城', { id: 'ruined_city', stage: '原料狩獵', level: 9, cost: 110, monsters: ['七個小矮人(火)', '七個小矮人(水)', '七個小矮人(風)', '七個小矮人(雷)', '七個小矮人(星)', '七個小矮人(光)', '七個小矮人(暗)'], reward: { exp: 122, gold: 190, mastery: 58 } }),
  makeMap('禁地', { id: 'forbidden', stage: '王座 26 層', level: 12, cost: 160, monsters: ['禁地守護者', '白羊座', '金牛座', '雙子座', '巨蟹座', '獅子座', '處女座', '天秤座', '天蠍座', '射手座', '山羊座', '水瓶座', '雙魚座', '魔王'], reward: { exp: 180, gold: 260, mastery: 86 } }),
  makeMap('魔王城', { id: 'demon_castle', stage: '奧義石狩獵', level: 14, cost: 220, monsters: ['爆彈魔將', '星際劍皇', '歡樂外送魔'], reward: { exp: 230, gold: 340, mastery: 112 } }),
  makeMap('寶箱的廢棄船', { id: 'treasure_ship', stage: '寶箱航線', level: 15, cost: 250, monsters: ['死神-路克', 'EnderMan', '寶箱的守財奴', '寵物箱子的封印箱', '裝備奧石的守門員'], reward: { exp: 248, gold: 390, mastery: 124 } }),
  makeMap('廢棄後山', { id: 'ruins', stage: '分身寵物', level: 16, cost: 280, monsters: ['實驗失敗體', '母體帶孩子', '後山奇獸'], reward: { exp: 268, gold: 420, mastery: 132 } }),
  makeMap('光明草原', { id: 'bright_meadow', stage: '界限突破', level: 8, cost: 80, monsters: ['螳螂', '蚱蜢', '蟑螂'], reward: { exp: 96, gold: 80, mastery: 70 } }),
  makeMap('藍天之下', { id: 'blue_sky', stage: '稀有連鎖', level: 11, cost: 140, monsters: ['藍天守衛', '雲海飛獸', '天空幻影'], reward: { exp: 166, gold: 240, mastery: 96 } }),
  makeMap('地獄', { id: 'hell', stage: '高級素材', level: 13, cost: 200, monsters: ['地獄犬', '熔岩惡魔', '解放守衛'], reward: { exp: 210, gold: 300, mastery: 120 } }),
  makeMap('財寶洞穴', { id: 'treasure_cave', stage: '金錢洞穴', level: 2, cost: 15, monsters: ['洞穴鼠', '寶箱蟲', '金幣守衛'], reward: { exp: 24, gold: 120, mastery: 12 } }),
  makeMap('修行者之塔', { id: 'training_tower', stage: '熟練練功', level: 4, cost: 35, monsters: ['塔中修行者', '試煉石像', '修行鳥'], reward: { exp: 48, gold: 88, mastery: 34 } }),
  makeMap('神秘的湖泊', { id: 'mystic_lake', stage: '連鎖湖泊', level: 4, cost: 35, monsters: ['湖泊水靈', '沉水犀牛', '霧面魚'], reward: { exp: 46, gold: 82, mastery: 30 } }),
  makeMap('黃金宮殿', { id: 'gold_palace', stage: '大量金錢', level: 6, cost: 65, monsters: ['黃金守衛', '宮殿魔狼', '女神像守衛'], reward: { exp: 68, gold: 260, mastery: 36 } }),
  makeMap('暗黑雪原', { id: 'dark_snowfield', stage: '界限 +1', level: 8, cost: 95, monsters: ['雪原夜狐', '暗黑惡龍', '古董守護者'], reward: { exp: 112, gold: 170, mastery: 72 } }),
  makeMap('星空下的夜', { id: 'starlit_night', stage: '稀有寶物', level: 10, cost: 130, monsters: ['星夜幻影', '流星獸', '夜空守衛'], reward: { exp: 148, gold: 230, mastery: 88 } }),
  makeMap('神秘的女神像', { id: 'goddess_statue', stage: '鑰匙掉落', level: 6, cost: 60, monsters: ['女神像守衛', '希望鐘守護者', '太陽鑰守衛'], reward: { exp: 74, gold: 145, mastery: 44 } }),
  makeMap('飛龍之塔', { id: 'dragon_tower', stage: '界限必升', level: 11, cost: 150, monsters: ['飛龍', '龍塔守衛', '古龍幻影'], reward: { exp: 176, gold: 260, mastery: 110 } }),
  makeMap('傳說秘地', { id: 'legendary_secret', stage: '神秘寶箱', level: 12, cost: 180, monsters: ['秘地守護者', '神秘寶箱', '傳說幻影'], reward: { exp: 190, gold: 320, mastery: 112 } }),
  makeMap('滿月下的夜', { id: 'full_moon_night', stage: '稀有連鎖', level: 10, cost: 135, monsters: ['滿月狼人', '夜狐', '月光守衛'], reward: { exp: 150, gold: 230, mastery: 90 } }),
  makeMap('冒險者的試練', { id: 'adventurer_trial', stage: '戰數觸發', level: 3, cost: 25, monsters: ['試練草原鼠', '試練爪貓'], reward: { exp: 36, gold: 110, mastery: 18 } }),
  makeMap('勇者的試練', { id: 'hero_trial', stage: '戰數觸發', level: 5, cost: 50, monsters: ['試練犀牛', '試練蜂群'], reward: { exp: 64, gold: 180, mastery: 32 } }),
  makeMap('英雄的試練', { id: 'legend_trial', stage: '戰數觸發', level: 7, cost: 85, monsters: ['試練魔狼', '試練夜狐'], reward: { exp: 96, gold: 260, mastery: 48 } }),
  makeMap('星空迷宮', { id: 'star_maze', stage: '迷宮跳板', level: 9, cost: 120, monsters: ['星空迷宮獸', '迷宮守門員', '流星傀儡'], reward: { exp: 130, gold: 220, mastery: 74 } }),
  makeMap('秘寶迷宮', { id: 'secret_treasure_maze', stage: '迷宮跳板', level: 10, cost: 135, monsters: ['秘寶守財奴', '迷宮寶箱', '寶藏魔像'], reward: { exp: 150, gold: 300, mastery: 82 } }),
  makeMap('艾恩葛朗特', { id: 'aincrad', stage: '世界地圖', level: 15, cost: 260, monsters: ['樓層守衛', '樓層武器', '艾恩葛朗特 Boss'], reward: { exp: 252, gold: 380, mastery: 136 } }),
  makeMap('上塔之門', { id: 'upper_tower_gate', stage: 'BOSS 專屬', level: 18, cost: 360, monsters: ['上塔守門員', '樓層 Boss', '啟動武器-樓層'], reward: { exp: 360, gold: 520, mastery: 180 } })
];

function catalogWeapon(id, name, price, slot = 'weapon') {
  const weapon = referenceCatalog.weapons.find((item) => item.name === name);
  const power = weapon?.power ?? 10;
  const weight = weapon?.weight ?? 5;
  return {
    id,
    type: slot,
    name,
    price,
    attack: slot === 'weapon' ? Math.max(2, Math.round(power / 7)) : 0,
    defense: slot === 'armor' ? Math.max(2, Math.round((power + weight) / 12)) : slot === 'trinket' ? Math.max(1, Math.round(power / 25)) : 0,
    description: weapon ? `原版武器清單：${weapon.element}屬性，威力 ${weapon.power}，重量 ${weapon.weight}，產地 ${weapon.origin}。${weapon.ougi !== '無' ? `奧義：${weapon.ougi}` : ''}` : '參考原版裝備命名。'
  };
}

function consumable(id, name, price, effect, value, description) {
  return { id, type: 'consumable', name, price, attack: 0, defense: 0, effect, value, description };
}

export const shopItems = [
  catalogWeapon('short_sword', '短劍', 80),
  catalogWeapon('long_sword', '長劍', 180),
  catalogWeapon('short_bow', '短弓', 320),
  catalogWeapon('double_axe', '雙刃斧', 560),
  catalogWeapon('flame_sword', '炎之劍', 700),
  catalogWeapon('ice_lance', '冰點下的槍', 860),
  catalogWeapon('storm_staff', '暴風杖', 760),
  catalogWeapon('thunder_sword', '雷鳴劍', 980),
  catalogWeapon('firefly_bow', '螢的弓', 1200),
  catalogWeapon('holy_lance', '聖槍', 2600),
  catalogWeapon('cloth_armor', '護甲', 120, 'armor'),
  catalogWeapon('water_robe', '袍', 240, 'armor'),
  catalogWeapon('thunder_mail', '鎧', 520, 'armor'),
  catalogWeapon('holy_armor', '聖甲', 900, 'armor'),
  catalogWeapon('hope_bell', '希望之鐘', 480, 'trinket'),
  catalogWeapon('dark_key', '暗闇之鑰', 580, 'trinket'),
  consumable('herb', '藥草', 30, 'heal', 50, '原版道具：使用後可補血。'),
  consumable('basic_potion', '初級回復藥', 120, 'heal', 120, '原版道具：在戰鬥後自動補血；豆豆版改為主動使用。'),
  consumable('mastery_book', '熟練之書', 420, 'mastery', 1000, '原版道具：增加 1000 熟練。豆豆版同步為熟練大幅提升。'),
  consumable('sword_book', '劍術之書', 360, 'attack', 3, '原版道具：增加劍術熟練；豆豆版轉為攻擊成長。'),
  consumable('life_fruit', '生命之果', 520, 'maxHp', 12, '原版道具：生命力上限 +1；豆豆版轉為 HP 上限提升。'),
  consumable('hope_fruit', '希望果實', 900, 'gold', 250, '原版道具：有機率進入星空下的夜；豆豆版轉為稀有冒險資金。')
];

export const milestones = [
  {
    id: 'first_battle',
    icon: '⚔',
    title: '第一次出擊',
    description: '完成任意 1 場戰鬥，熟悉回合演出。',
    reward: { gold: 80, item: 'herb' },
    condition: (player) => player.battles >= 1
  },
  {
    id: 'grassland_patrol',
    icon: '✓',
    title: '草原巡邏完成',
    description: '在草原任務累積 3 次討伐。',
    reward: { gold: 120, exp: 45 },
    condition: (player) => player.quest?.completed || player.quest?.progress >= player.quest?.target
  },
  {
    id: 'first_equipment',
    icon: '†',
    title: '裝備上手',
    description: '裝備任意武器或防具，開始形成角色方向。',
    reward: { mastery: 80, item: 'basic_potion' },
    condition: (player) => Boolean(player.equipment?.weapon || player.equipment?.armor)
  },
  {
    id: 'training_ready',
    icon: '▲',
    title: '修行者準備',
    description: '角色達到 Lv.3，準備挑戰沼地與修行者之塔。',
    reward: { gold: 180, item: 'mastery_book' },
    condition: (player) => player.level >= 3
  },
  {
    id: 'map_explorer',
    icon: '⌖',
    title: '地圖探勘者',
    description: '挑戰 3 種不同地圖。',
    reward: { exp: 80, mastery: 120 },
    condition: (player) => Object.keys(player.mapRuns || {}).length >= 3
  },
  {
    id: 'bestiary_keeper',
    icon: '▦',
    title: '討伐紀錄員',
    description: '圖鑑記錄 5 種不同魔物。',
    reward: { gold: 260, item: 'sword_book' },
    condition: (player) => Object.keys(player.bestiary || {}).length >= 5
  }
];

export const countries = [
  { name: '豆豆王國', element: '光', ruler: '小豆王', people: 42, gold: 124800, territory: 5 },
  { name: '夜芽同盟', element: '闇', ruler: '黑豆參謀', people: 31, gold: 98300, territory: 4 },
  { name: '風車自由城', element: '風', ruler: '旅人晴空', people: 27, gold: 72100, territory: 3 }
];

export const heroPortraits = {
  blade: './assets/sprites/heroes/blade.svg',
  sage: './assets/sprites/heroes/sage.svg',
  ranger: './assets/sprites/heroes/ranger.svg',
  default: './assets/sprites/heroes/default.svg',
  king: './assets/sprites/heroes/king.svg',
  shadow: './assets/sprites/heroes/shadow.svg',
  wind: './assets/sprites/heroes/wind.svg',
  knight: './assets/sprites/heroes/knight.svg'
};

export const monsterPortraits = {
  '草原鼠': './assets/sprites/monsters/slime.svg',
  '爪貓': './assets/sprites/monsters/mist_beast.svg',
  '黃斑狗': './assets/sprites/monsters/frog_soldier.svg',
  '獨色鳥': './assets/sprites/monsters/bean_bird.svg',
  '紅蟻': './assets/sprites/monsters/slime.svg',
  '犀牛': './assets/sprites/monsters/frog_soldier.svg',
  '蜂群': './assets/sprites/monsters/bean_bird.svg',
  '魔狼': './assets/sprites/monsters/mist_beast.svg',
  '夜狐': './assets/sprites/monsters/mist_beast.svg',
  '七彩鳥': './assets/sprites/monsters/star_guard.svg',
  '惡龍': './assets/sprites/monsters/rift_herald.svg',
  '七個小矮人(火)': './assets/sprites/monsters/marsh_doll.svg',
  '七個小矮人(水)': './assets/sprites/monsters/marsh_doll.svg',
  '七個小矮人(風)': './assets/sprites/monsters/marsh_doll.svg',
  '七個小矮人(雷)': './assets/sprites/monsters/marsh_doll.svg',
  '七個小矮人(星)': './assets/sprites/monsters/marsh_doll.svg',
  '七個小矮人(光)': './assets/sprites/monsters/marsh_doll.svg',
  '七個小矮人(暗)': './assets/sprites/monsters/marsh_doll.svg',
  '禁地守護者': './assets/sprites/monsters/seal_guardian.svg',
  '白羊座': './assets/sprites/monsters/star_guard.svg',
  '金牛座': './assets/sprites/monsters/star_guard.svg',
  '雙子座': './assets/sprites/monsters/star_guard.svg',
  '巨蟹座': './assets/sprites/monsters/star_guard.svg',
  '獅子座': './assets/sprites/monsters/star_guard.svg',
  '處女座': './assets/sprites/monsters/star_guard.svg',
  '天秤座': './assets/sprites/monsters/star_guard.svg',
  '天蠍座': './assets/sprites/monsters/star_guard.svg',
  '射手座': './assets/sprites/monsters/star_guard.svg',
  '山羊座': './assets/sprites/monsters/star_guard.svg',
  '水瓶座': './assets/sprites/monsters/star_guard.svg',
  '雙魚座': './assets/sprites/monsters/star_guard.svg',
  '魔王': './assets/sprites/monsters/rift_herald.svg',
  '爆彈魔將': './assets/sprites/monsters/tower_imp.svg',
  '星際劍皇': './assets/sprites/monsters/star_golem.svg',
  '歡樂外送魔': './assets/sprites/monsters/bean_bird.svg',
  '死神-路克': './assets/sprites/monsters/rift_herald.svg',
  'EnderMan': './assets/sprites/monsters/mist_beast.svg',
  '寶箱的守財奴': './assets/sprites/monsters/chest_guard.svg',
  '寵物箱子的封印箱': './assets/sprites/monsters/chest_guard.svg',
  '裝備奧石的守門員': './assets/sprites/monsters/seal_guardian.svg',
  '螳螂': './assets/sprites/monsters/slime.svg',
  '蚱蜢': './assets/sprites/monsters/bean_bird.svg',
  '蟑螂': './assets/sprites/monsters/slime.svg',
  '地獄犬': './assets/sprites/monsters/mist_beast.svg',
  '樓層武器': './assets/sprites/monsters/crack_book.svg',
  '啟動武器-樓層': './assets/sprites/monsters/crack_book.svg',
  '跳跳史萊姆': './assets/sprites/monsters/slime.svg',
  '迷路菇菇': './assets/sprites/monsters/mushroom.svg',
  '貪吃豆鳥': './assets/sprites/monsters/bean_bird.svg',
  '泥沼蛙兵': './assets/sprites/monsters/frog_soldier.svg',
  '毒霧水母': './assets/sprites/monsters/fog_jelly.svg',
  '濕地咒偶': './assets/sprites/monsters/marsh_doll.svg',
  '星光守衛': './assets/sprites/monsters/star_guard.svg',
  '裂紋魔書': './assets/sprites/monsters/crack_book.svg',
  '塔頂小惡魔': './assets/sprites/monsters/tower_imp.svg',
  '後山山賊': './assets/sprites/monsters/bandit.svg',
  '霧隱獸': './assets/sprites/monsters/mist_beast.svg',
  '寶箱守衛': './assets/sprites/monsters/chest_guard.svg',
  '封印守護者': './assets/sprites/monsters/seal_guardian.svg',
  '星門魔像': './assets/sprites/monsters/star_golem.svg',
  '裂界使者': './assets/sprites/monsters/rift_herald.svg'
};

export const npcRankings = [
  { name: '小豆王', level: 12, wins: 388, battles: 401, element: '光', hp: 1880, maxHp: 1880, mp: 920, maxMp: 920, job: '賢者', portrait: heroPortraits.king },
  { name: '黑豆參謀', level: 10, wins: 301, battles: 326, element: '闇', hp: 1640, maxHp: 1640, mp: 610, maxMp: 610, job: '影術士', portrait: heroPortraits.shadow },
  { name: '旅人晴空', level: 9, wins: 244, battles: 260, element: '風', hp: 1320, maxHp: 1320, mp: 520, maxMp: 520, job: '草原巡守', portrait: heroPortraits.wind },
  { name: '紅豆騎士', level: 7, wins: 188, battles: 205, element: '火', hp: 1180, maxHp: 1180, mp: 360, maxMp: 360, job: '豆豆劍士', portrait: heroPortraits.knight }
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
    milestonesClaimed: [],
    bestiary: {},
    mapRuns: {},
    log: ['歡迎來到豆豆冒險公會。先去草原試試身手吧！'],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };
}

export function getItem(itemId) {
  if (itemId === 'novice_badge') {
    return { id: 'novice_badge', type: 'trinket', name: '菜鳥新手徽章', price: 0, attack: 1, defense: 1, description: '參考原版「菜鳥新手」出身，象徵第一次登錄冒險。' };
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

export function createBattleEncounter(player, mapId, rng = Math.random) {
  const map = chooseMap(mapId);
  const next = clonePlayer(player);
  const messages = [];
  const turns = [];
  const stats = totalStats(next);
  const monsterName = map.monsters[Math.floor(rng() * map.monsters.length)] || map.monsters[0];
  const monster = createMonster(map, monsterName, rng);
  const playerStart = { hp: next.hp, maxHp: next.maxHp, mp: next.mp, maxMp: next.maxMp };
  const monsterStart = { hp: monster.hp, maxHp: monster.maxHp };

  if (next.gold < map.cost) {
    messages.push(`金幣不足，無法前往 ${map.name}。`);
    turns.push({
      side: 'system',
      round: 0,
      text: `公會櫃台擋下了出擊：前往 ${map.name} 需要 ${map.cost} 金幣。`,
      playerHp: next.hp,
      playerMp: next.mp,
      monsterHp: monster.hp
    });
    next.updatedAt = new Date().toISOString();
    next.log = mergeLog(next.log, messages);
    return buildBattleEncounter({ next, map, monsterName, monster, playerStart, monsterStart, turns, messages, result: 'blocked' });
  }

  next.gold -= map.cost;
  next.battles += 1;
  next.mapRuns[map.id] = (next.mapRuns[map.id] || 0) + 1;
  turns.push({
    side: 'system',
    round: 0,
    text: `${next.name} 進入「${map.name}」，遭遇「${monsterName}」！`,
    playerHp: next.hp,
    playerMp: next.mp,
    monsterHp: monster.hp
  });

  let guardRate = 0;
  for (let round = 1; round <= 8 && next.hp > 0 && monster.hp > 0; round += 1) {
    turns.push({ side: 'system', round, text: `第 ${round} 回合`, playerHp: next.hp, playerMp: next.mp, monsterHp: monster.hp });
    const playerFirst = stats.speed + rng() * 10 >= monster.speed + rng() * 10;
    if (playerFirst) {
      guardRate = takePlayerTurn({ next, monster, map, stats, turns, round, rng, guardRate });
      if (monster.hp > 0) guardRate = takeMonsterTurn({ next, monster, map, stats, turns, round, rng, guardRate });
    } else {
      guardRate = takeMonsterTurn({ next, monster, map, stats, turns, round, rng, guardRate });
      if (next.hp > 0) guardRate = takePlayerTurn({ next, monster, map, stats, turns, round, rng, guardRate });
    }
  }

  const playerRatio = next.hp / next.maxHp;
  const monsterRatio = monster.hp / monster.maxHp;
  const didWin = monster.hp <= 0 || (next.hp > 0 && monsterRatio <= playerRatio * 0.72);
  next.hp = Math.max(0, next.hp);
  next.mp = Math.max(0, next.mp);

  if (didWin && next.hp > 0) {
    const expGain = Math.round(map.reward.exp * (0.85 + rng() * 0.4));
    const goldGain = Math.round(map.reward.gold * (0.75 + rng() * 0.6));
    const masteryGain = Math.round(map.reward.mastery * (0.8 + rng() * 0.5));
    next.exp += expGain;
    next.gold += goldGain;
    next.mastery += masteryGain;
    next.wins += 1;
    recordMonsterDefeat(next, monsterName, map);
    next.quest = updateQuest(next.quest, map.id);
    monster.hp = 0;
    messages.push(`你在 ${map.name} 擊倒了「${monsterName}」，獲得 ${expGain} EXP、${goldGain} 金幣、${masteryGain} 熟練。`);
    turns.push({ side: 'system', round: 9, text: `戰鬥結束！${next.name} 擊倒了「${monsterName}」。`, playerHp: next.hp, playerMp: next.mp, monsterHp: monster.hp });

    if (rng() < itemDropChance(map.level)) {
      const drop = randomDrop(map.level, rng);
      next.inventory.push(drop.id);
      messages.push(`打寶成功：獲得「${drop.name}」。`);
      turns.push({ side: 'system', round: 9, text: `打寶成功：獲得「${drop.name}」。`, playerHp: next.hp, playerMp: next.mp, monsterHp: monster.hp });
    }

    const levelMessages = applyLevelUps(next);
    messages.push(...levelMessages);
    levelMessages.forEach((text) => turns.push({ side: 'system', round: 9, text, playerHp: next.hp, playerMp: next.mp, monsterHp: monster.hp }));
  } else {
    const lostGold = Math.floor(next.gold * 0.15);
    next.gold -= lostGold;
    next.losses += 1;
    messages.push(`你被「${monsterName}」打退，損失 ${lostGold} 金幣。回旅店整理一下吧。`);
    turns.push({ side: 'system', round: 9, text: `戰鬥結束……${next.name} 被「${monsterName}」打退。`, playerHp: next.hp, playerMp: next.mp, monsterHp: monster.hp });
  }

  next.updatedAt = new Date().toISOString();
  next.log = mergeLog(next.log, messages);
  return buildBattleEncounter({ next, map, monsterName, monster, playerStart, monsterStart, turns, messages, result: didWin && next.hp > 0 ? 'win' : 'loss' });
}

export function performBattle(player, mapId, rng = Math.random) {
  const encounter = createBattleEncounter(player, mapId, rng);
  return { player: encounter.player, result: encounter.result, messages: encounter.messages };
}

function buildBattleEncounter({ next, map, monsterName, monster, playerStart, monsterStart, turns, messages, result }) {
  return {
    player: next,
    result,
    messages,
    scene: {
      map: { id: map.id, name: map.name, category: map.category, level: map.level },
      monster: { name: monsterName, maxHp: monster.maxHp, portrait: portraitForMonster(monsterName) },
      playerStart,
      monsterStart,
      playerEnd: { hp: next.hp, maxHp: next.maxHp, mp: next.mp, maxMp: next.maxMp },
      monsterEnd: { hp: Math.max(0, monster.hp), maxHp: monster.maxHp },
      turns
    }
  };
}

function createMonster(map, name, rng) {
  const maxHp = Math.round(52 + map.level * 30 + rng() * (18 + map.level * 4));
  return {
    name,
    maxHp,
    hp: maxHp,
    attack: 12 + map.level * 7,
    defense: 5 + map.level * 3,
    speed: 7 + map.level * 2
  };
}

const playerBattleSkills = [
  { name: '快速打擊', chance: 0.30, mpCost: 10, multiplier: 1.18, phrase: '以新手技能快速切入' },
  { name: '斬擊', chance: 0.25, mpCost: 20, multiplier: 1.42, phrase: '揮出基礎劍技' },
  { name: '破強劍', chance: 0.18, mpCost: 28, multiplier: 1.66, phrase: '以武士劍技突破防線' },
  { name: '彗星斬', chance: 0.12, mpCost: 36, multiplier: 1.92, phrase: '拖出彗星軌跡斬向敵人' },
  { name: '雷擊劍', chance: 0.08, mpCost: 42, multiplier: 2.18, phrase: '將雷光灌入劍身爆發' }
];

const monsterBattleSkills = [
  { name: '強烈攻擊', chance: 0.25, multiplier: 1.32, phrase: '以強烈攻擊壓迫過來' },
  { name: '猛毒斬', chance: 0.16, multiplier: 1.52, phrase: '帶著猛毒斬擊逼近' },
  { name: '初級必殺', chance: 0.10, multiplier: 1.82, phrase: '嘗試發動必殺攻勢' },
  { name: '魅惑', chance: 0.10, multiplier: 0.82, phrase: '以魅惑擾亂節奏後突襲' }
];

function takePlayerTurn({ next, monster, stats, turns, round, rng }) {
  const skill = chooseSkill(playerBattleSkills, rng, next.mp);
  const multiplier = skill?.multiplier || 1;
  const variance = 0.88 + rng() * 0.24;
  const rawDamage = Math.round((stats.attack * multiplier + next.level * 4) * variance - monster.defense * 0.52);
  const damage = Math.max(2, rawDamage);
  if (skill) next.mp = Math.max(0, next.mp - skill.mpCost);
  monster.hp = Math.max(0, monster.hp - damage);
  turns.push({
    side: 'player',
    round,
    skill: skill?.name || '普通攻擊',
    text: skill
      ? `${next.name} 施放「${skill.name}」，${skill.phrase}，造成 ${damage} 傷害。`
      : `${next.name} 進行攻擊，造成 ${damage} 傷害。`,
    playerHp: next.hp,
    playerMp: next.mp,
    monsterHp: monster.hp
  });
  return skill?.guard || 0;
}

function takeMonsterTurn({ next, monster, stats, turns, round, rng, guardRate }) {
  const skill = chooseSkill(monsterBattleSkills, rng);
  const multiplier = skill?.multiplier || 1;
  const variance = 0.86 + rng() * 0.28;
  const rawDamage = Math.round((monster.attack * multiplier + monster.maxHp * 0.035) * variance - stats.defense * 0.68);
  const guardedDamage = Math.round(Math.max(2, rawDamage) * (1 - guardRate));
  const damage = Math.max(1, guardedDamage);
  next.hp = Math.max(0, next.hp - damage);
  const guardText = guardRate > 0 ? '護盾削弱了攻勢，' : '';
  turns.push({
    side: 'monster',
    round,
    skill: skill?.name || '普通攻擊',
    text: skill
      ? `「${monster.name}」使出「${skill.name}」，${guardText}${skill.phrase}，造成 ${damage} 傷害。`
      : `「${monster.name}」反擊，${guardText}造成 ${damage} 傷害。`,
    playerHp: next.hp,
    playerMp: next.mp,
    monsterHp: monster.hp
  });
  return 0;
}

function chooseSkill(skills, rng, availableMp = Infinity) {
  const roll = rng();
  let threshold = 0;
  for (const skill of skills) {
    threshold += skill.chance;
    if (roll <= threshold && availableMp >= (skill.mpCost || 0)) return skill;
  }
  return null;
}

export function portraitForPlayer(player) {
  if (!player) return heroPortraits.default;
  return {
    '豆豆劍士': heroPortraits.blade,
    '微光術士': heroPortraits.sage,
    '草原巡守': heroPortraits.ranger,
    '豆豆冒險者': heroPortraits.default,
    '賢者': heroPortraits.king,
    '影術士': heroPortraits.shadow
  }[player.job] || player.portrait || heroPortraits.default;
}

export function portraitForMonster(name) {
  return monsterPortraits[name] || './assets/sprites/monsters/unknown.svg';
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
  if (!['weapon', 'armor', 'trinket'].includes(item.type)) throw new Error('這是道具，請使用而不是裝備。');
  const next = clonePlayer(player);
  if (!next.inventory.includes(itemId)) throw new Error('背包中沒有這個物品。');
  next.equipment[item.type] = item.id;
  next.updatedAt = new Date().toISOString();
  next.log = mergeLog(next.log, [`已裝備「${item.name}」。`]);
  return next;
}

export function useItem(player, itemId) {
  const item = getItem(itemId);
  if (!item) throw new Error('找不到物品。');
  if (item.type !== 'consumable') throw new Error('這個物品需要裝備，不能直接使用。');
  const next = clonePlayer(player);
  const index = next.inventory.indexOf(itemId);
  if (index < 0) throw new Error('背包中沒有這個物品。');
  next.inventory.splice(index, 1);
  switch (item.effect) {
    case 'heal':
      next.hp = Math.min(next.maxHp, next.hp + item.value);
      next.mp = Math.min(next.maxMp, next.mp + Math.round(item.value / 3));
      next.log = mergeLog(next.log, [`使用「${item.name}」，HP / MP 回復。`]);
      break;
    case 'mastery':
      next.mastery += item.value;
      next.log = mergeLog(next.log, [`閱讀「${item.name}」，熟練增加 ${item.value}。`]);
      break;
    case 'attack':
      next.attack += item.value;
      next.log = mergeLog(next.log, [`使用「${item.name}」，攻擊永久 +${item.value}。`]);
      break;
    case 'maxHp':
      next.maxHp += item.value;
      next.hp += item.value;
      next.log = mergeLog(next.log, [`使用「${item.name}」，HP 上限 +${item.value}。`]);
      break;
    case 'gold':
      next.gold += item.value;
      next.log = mergeLog(next.log, [`使用「${item.name}」，獲得 ${item.value} 金幣。`]);
      break;
    default:
      next.log = mergeLog(next.log, [`使用「${item.name}」。`]);
  }
  next.updatedAt = new Date().toISOString();
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

export function milestonesFor(player) {
  const safe = clonePlayer(player);
  const claimed = new Set(safe.milestonesClaimed || []);
  return milestones.map((milestone) => {
    const complete = Boolean(milestone.condition(safe));
    const isClaimed = claimed.has(milestone.id);
    return {
      id: milestone.id,
      icon: milestone.icon,
      title: milestone.title,
      description: milestone.description,
      complete,
      claimed: isClaimed,
      rewardText: rewardText(milestone.reward)
    };
  });
}

export function claimMilestone(player, milestoneId) {
  const next = clonePlayer(player);
  const milestone = milestones.find((item) => item.id === milestoneId);
  if (!milestone) throw new Error('找不到冒險目標。');
  if (next.milestonesClaimed.includes(milestone.id)) return next;
  if (!milestone.condition(next)) {
    next.log = mergeLog(next.log, [`冒險目標尚未完成：${milestone.title}`]);
    return next;
  }
  applyReward(next, milestone.reward);
  next.milestonesClaimed.push(milestone.id);
  const levelMessages = applyLevelUps(next);
  next.updatedAt = new Date().toISOString();
  next.log = mergeLog(next.log, [`領取冒險目標「${milestone.title}」：${rewardText(milestone.reward)}。`, ...levelMessages]);
  return next;
}

export function bestiaryEntries(player) {
  const safe = clonePlayer(player);
  return Object.values(safe.bestiary)
    .sort((a, b) => b.count - a.count || a.name.localeCompare(b.name, 'zh-Hant'));
}

export function progressionGuide(player, mapId = 'meadow') {
  const safe = clonePlayer(player);
  const selectedMap = chooseMap(mapId);
  const hpRatio = safe.hp / Math.max(1, safe.maxHp);
  const mpRatio = safe.mp / Math.max(1, safe.maxMp);
  const hasWeapon = Boolean(safe.equipment?.weapon);
  const claimable = milestonesFor(safe).find((milestone) => milestone.complete && !milestone.claimed);
  const suggestedMap = recommendedMap(safe);
  const readiness = mapReadiness(safe, selectedMap);
  const route = [
    { label: '出擊 1 場', done: safe.battles >= 1 },
    { label: '完成草原討伐', done: Boolean(safe.quest?.completed) },
    { label: '裝備武器', done: hasWeapon },
    { label: 'Lv.3 修行', done: safe.level >= 3 },
    { label: '探索 3 地圖', done: Object.keys(safe.mapRuns || {}).length >= 3 }
  ];

  let nextAction = `推薦前往「${suggestedMap.name}」穩定累積 EXP / 金幣。`;
  if (hpRatio < 0.35 || mpRatio < 0.18) nextAction = 'HP / MP 偏低，先旅店休息或使用藥草，避免新手挫折。';
  else if (claimable) nextAction = `可到任務頁領取冒險目標「${claimable.title}」。`;
  else if (!safe.quest?.completed) nextAction = `先完成「${safe.quest?.title || '草原討伐'}」，這是最短的新手路線。`;
  else if (!hasWeapon && safe.gold >= 80) nextAction = '建議到背包頁購買並裝備「短劍」，提升戰鬥穩定度。';
  else if (selectedMap.cost > safe.gold) nextAction = `目前金幣不足，先回「${suggestedMap.name}」補資金。`;
  else if (selectedMap.level > safe.level + 4) nextAction = `「${selectedMap.name}」偏難，先挑戰 Lv.${suggestedMap.level} 的「${suggestedMap.name}」。`;

  return {
    stage: route.filter((step) => step.done).length + 1,
    nextAction,
    suggestedMapId: suggestedMap.id,
    suggestedMapName: suggestedMap.name,
    readiness,
    route
  };
}

export function rankingsFor(player) {
  const playerRow = player ? [{
    name: player.name,
    level: player.level,
    wins: player.wins,
    battles: player.battles,
    element: player.element,
    hp: player.hp,
    maxHp: player.maxHp,
    mp: player.mp,
    maxMp: player.maxMp,
    job: player.job,
    portrait: portraitForPlayer(player)
  }] : [];
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
  return normalizePlayer(data);
}

function normalizePlayer(player) {
  if (!Array.isArray(player.inventory)) player.inventory = [];
  player.equipment = {
    weapon: player.equipment?.weapon || null,
    armor: player.equipment?.armor || null,
    trinket: player.equipment?.trinket || null
  };
  if (!player.quest) player.quest = { id: 'first_hunt', title: '草原討伐', target: 3, progress: 0, completed: false };
  if (!Array.isArray(player.log)) player.log = [];
  if (!Array.isArray(player.milestonesClaimed)) player.milestonesClaimed = [];
  if (!player.bestiary || typeof player.bestiary !== 'object' || Array.isArray(player.bestiary)) player.bestiary = {};
  if (!player.mapRuns || typeof player.mapRuns !== 'object' || Array.isArray(player.mapRuns)) player.mapRuns = {};
  return player;
}

function recordMonsterDefeat(player, monsterName, map) {
  const existing = player.bestiary[monsterName] || { name: monsterName, count: 0, firstMap: map.name, lastMap: map.name, portrait: portraitForMonster(monsterName) };
  player.bestiary[monsterName] = {
    ...existing,
    count: (Number(existing.count) || 0) + 1,
    lastMap: map.name,
    lastMapId: map.id,
    portrait: portraitForMonster(monsterName)
  };
}

function applyReward(player, reward) {
  if (reward.gold) player.gold += reward.gold;
  if (reward.exp) player.exp += reward.exp;
  if (reward.mastery) player.mastery += reward.mastery;
  if (reward.item) player.inventory.push(reward.item);
}

function rewardText(reward) {
  return [
    reward.gold ? `${reward.gold} 金幣` : '',
    reward.exp ? `${reward.exp} EXP` : '',
    reward.mastery ? `${reward.mastery} 熟練` : '',
    reward.item ? `道具「${getItem(reward.item)?.name || reward.item}」` : ''
  ].filter(Boolean).join('、') || '紀錄完成';
}

function recommendedMap(player) {
  const affordable = maps.filter((map) => map.cost <= player.gold && map.level <= player.level + 2);
  if (!player.quest?.completed) return chooseMap('meadow');
  if (player.level < 3) return chooseMap('treasure_cave');
  if (player.level < 5) return chooseMap('training_tower');
  return affordable.sort((a, b) => b.level - a.level)[0] || chooseMap('meadow');
}

function mapReadiness(player, map) {
  const hpRatio = player.hp / Math.max(1, player.maxHp);
  const mpRatio = player.mp / Math.max(1, player.maxMp);
  if (map.cost > player.gold) {
    return { tone: 'danger', label: '金幣不足', detail: `需要 ${map.cost} 金幣，目前 ${player.gold}。` };
  }
  if (hpRatio < 0.35 || mpRatio < 0.18) {
    return { tone: 'warning', label: '建議整備', detail: 'HP / MP 偏低，先休息或用藥更穩。' };
  }
  if (map.level > player.level + 4) {
    return { tone: 'danger', label: '高風險', detail: `地圖 Lv.${map.level} 高於目前 Lv.${player.level}，容易被打退。` };
  }
  if (map.level > player.level + 2) {
    return { tone: 'warning', label: '可挑戰', detail: '等級略高，建議先裝備武器或備藥。' };
  }
  return { tone: 'safe', label: '適合挑戰', detail: '目前狀態適合出擊，能穩定累積資源。' };
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
  const candidates = level >= 12
    ? ['holy_lance', 'hope_fruit', 'dark_key', 'life_fruit']
    : level >= 7
      ? ['flame_sword', 'ice_lance', 'mastery_book', 'hope_bell']
      : level >= 4
        ? ['short_bow', 'double_axe', 'basic_potion', 'sword_book']
        : ['novice_badge', 'short_sword', 'herb'];
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
  return normalizePlayer(JSON.parse(JSON.stringify(player)));
}

function clamp(value, min, max) {
  return Math.min(max, Math.max(min, value));
}
