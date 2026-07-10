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

const hiddenMapRules = {
  bright_meadow: (player) => masteryAtLeast(player, 500) || mapWin(player, 'tower'),
  blue_sky: (player) => masteryAtLeast(player, 3000) || mapWin(player, 'star_maze'),
  hell: (player) => Number(player?.gold) >= 100000 || Number(player?.wins) >= 100,
  treasure_cave: (player) => mapWin(player, 'meadow', 2) || mapWin(player, 'forest'),
  training_tower: (player) => Number(player?.battles) >= 5 || Number(player?.level) >= 3,
  mystic_lake: (player) => mapWin(player, 'marsh'),
  gold_palace: (player) => mapWin(player, 'treasure_cave'),
  dark_snowfield: (player) => mapWin(player, 'tower') || mapWin(player, 'ruined_city'),
  starlit_night: (player) => hasItem(player, 'hope_fruit') || masteryAtLeast(player, 3000) || mapWin(player, 'blue_sky'),
  goddess_statue: (player) => mapWin(player, 'gold_palace') || hasItem(player, 'dark_key') || hasItem(player, 'hope_bell'),
  dragon_tower: (player) => mapWin(player, 'goddess_statue'),
  legendary_secret: (player) => mapWin(player, 'secret_treasure_maze') || mapWin(player, 'treasure_ship'),
  full_moon_night: (player) => mapWin(player, 'dark_snowfield') || mapWin(player, 'starlit_night') || Number(player?.bestiary?.['夜狐']?.count) >= 3,
  adventurer_trial: (player) => Number(player?.battles) >= 10,
  hero_trial: (player) => Number(player?.battles) >= 30,
  legend_trial: (player) => Number(player?.battles) >= 60,
  star_maze: (player) => Number(player?.battles) >= 100,
  secret_treasure_maze: (player) => Number(player?.battles) >= 150,
  aincrad: (player) => Number(player?.wins) >= 120 && (mapWin(player, 'dragon_tower') || mapWin(player, 'legendary_secret')),
  upper_tower_gate: (player) => mapWin(player, 'aincrad', 3)
};

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

function consumable(id, name, price, effect, value, description, useLimit = null) {
  return { id, type: 'consumable', name, price, attack: 0, defense: 0, effect, value, description, useLimit };
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
  consumable('basic_potion', '初級回復藥', 120, 'heal', 120, '原版道具：在戰鬥後自動補血；終端版改為主動使用。'),
  consumable('mastery_book', '熟練之書', 420, 'mastery', 1000, '原版道具：增加 1000 熟練。終端版同步為熟練大幅提升；每名角色限用一次。', 1),
  consumable('sword_book', '劍術之書', 360, 'attack', 3, '原版道具：增加劍術熟練；終端版轉為一次性攻擊成長。', 1),
  consumable('life_fruit', '生命之果', 520, 'maxHp', 12, '原版道具：生命力上限 +1；終端版轉為一次性 HP 上限提升。', 1),
  consumable('hope_fruit', '希望果實', 900, 'gold', 250, '原版道具：有機率進入星空下的夜；終端版轉為稀有冒險資金。')
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

export const jobDefinitions = [
  {
    id: 'blade',
    name: '劍士',
    tier: 'base',
    branch: 'blade',
    power: 1,
    description: '攻擊較高的前線職業，適合穩定起步。',
    skills: [
      { name: '快速打擊', chance: 0.30, mpCost: 10, multiplier: 1.18, type: 'physical', phrase: '以基礎步伐快速切入' },
      { name: '斬擊', chance: 0.25, mpCost: 20, multiplier: 1.42, type: 'physical', phrase: '揮出基礎劍技' },
      { name: '破強劍', chance: 0.18, mpCost: 28, multiplier: 1.66, type: 'physical', defensePierce: 0.12, phrase: '突破敵人的防線' }
    ]
  },
  {
    id: 'sage',
    name: '術士',
    tier: 'base',
    branch: 'sage',
    power: 1.02,
    description: 'MP 較高，依靠魔法與續戰能力成長。',
    skills: [
      { name: '魔法飛彈', chance: 0.34, mpCost: 12, multiplier: 1.28, type: 'magic', phrase: '凝出魔法飛彈' },
      { name: '光彈', chance: 0.24, mpCost: 22, multiplier: 1.52, type: 'magic', phrase: '以光彈貫穿敵影' },
      { name: '星火術', chance: 0.14, mpCost: 34, multiplier: 1.88, type: 'magic', phrase: '引燃細碎星火' }
    ]
  },
  {
    id: 'ranger',
    name: '巡守',
    tier: 'base',
    branch: 'ranger',
    power: 1.01,
    description: '速度較高，適合先手與穩定探索。',
    skills: [
      { name: '迅捷射擊', chance: 0.32, mpCost: 10, multiplier: 1.22, type: 'speed', phrase: '以迅捷射擊壓制' },
      { name: '追蹤打擊', chance: 0.24, mpCost: 18, multiplier: 1.48, type: 'speed', phrase: '循著破綻追擊' },
      { name: '風切', chance: 0.16, mpCost: 28, multiplier: 1.76, type: 'speed', phrase: '斬出風切軌跡' }
    ]
  },
  {
    id: 'sword_heir',
    name: '劍之傳人',
    tier: 'advanced',
    branch: 'blade',
    power: 1.22,
    statBonus: { attack: 8, speed: 2, maxHp: 18 },
    description: '高攻擊、高連擊、擅長收尾斬殺。',
    skills: [
      { name: '破空斬', chance: 0.32, mpCost: 18, multiplier: 1.58, type: 'physical', defensePierce: 0.1, phrase: '斬開前方氣流' },
      { name: '追星連斬', chance: 0.24, mpCost: 28, multiplier: 1.28, type: 'physical', hits: 2, phrase: '連續追擊兩段劍光' },
      { name: '劍心凝聚', chance: 0.16, mpCost: 36, multiplier: 2.02, type: 'physical', phrase: '凝聚劍心後重擊' }
    ],
    ultimate: { name: '無限劍域', chance: 0.18, mpCost: 56, masteryCost: 30, multiplier: 1.35, hits: 3, type: 'physical', defensePierce: 0.18, phrase: '展開連續三段劍域' }
  },
  {
    id: 'seraph',
    name: '熾天使',
    tier: 'advanced',
    branch: 'blade',
    power: 1.2,
    statBonus: { maxHp: 34, defense: 6, attack: 4 },
    description: '攻守平衡，能以聖盾反擊穩定推圖。',
    skills: [
      { name: '光斬', chance: 0.30, mpCost: 18, multiplier: 1.42, type: 'hybrid', healRatio: 0.16, phrase: '以光刃切入並回復傷勢' },
      { name: '聖盾反擊', chance: 0.22, mpCost: 30, multiplier: 1.32, type: 'physical', guard: 0.34, phrase: '架起聖盾後反擊' },
      { name: '天罰劍', chance: 0.15, mpCost: 42, multiplier: 1.96, type: 'hybrid', defensePierce: 0.12, phrase: '降下審判劍光' }
    ],
    ultimate: { name: '神聖護體・終', chance: 0.16, mpCost: 58, multiplier: 2.35, type: 'hybrid', guard: 0.55, healRatio: 0.22, phrase: '以神聖護體承受攻勢並反擊' }
  },
  {
    id: 'archmage',
    name: '大魔法師',
    tier: 'advanced',
    branch: 'sage',
    power: 1.24,
    statBonus: { maxMp: 42, attack: 4, speed: 1 },
    description: '高 MP 與高法術爆發，適合挑戰高血量敵人。',
    skills: [
      { name: '多重魔法球', chance: 0.34, mpCost: 24, multiplier: 1.55, type: 'magic', hits: 2, phrase: '放出多重魔法球' },
      { name: '火牆術', chance: 0.22, mpCost: 34, multiplier: 1.92, type: 'magic', phrase: '築起灼熱火牆' },
      { name: '召喚魔龍', chance: 0.12, mpCost: 58, multiplier: 2.55, type: 'magic', defensePierce: 0.1, phrase: '召喚魔龍吐息' }
    ],
    ultimate: { name: '星界崩解', chance: 0.17, mpCost: 72, masteryCost: 45, multiplier: 3.05, type: 'magic', defensePierce: 0.2, phrase: '讓星界裂解成巨大衝擊' }
  },
  {
    id: 'cleric',
    name: '神職者',
    tier: 'advanced',
    branch: 'sage',
    power: 1.18,
    statBonus: { maxHp: 24, maxMp: 28, defense: 5 },
    description: '恢復、防護、低血量逆轉，容錯最高。',
    skills: [
      { name: '恢復術', chance: 0.30, mpCost: 22, multiplier: 1.12, type: 'magic', healRatio: 0.42, phrase: '施展恢復術穩住戰線' },
      { name: '祝福結界', chance: 0.24, mpCost: 30, multiplier: 1.18, type: 'magic', guard: 0.42, phrase: '張開祝福結界' },
      { name: '審判光', chance: 0.18, mpCost: 40, multiplier: 2.0, type: 'magic', phrase: '以審判光照穿敵人' }
    ],
    ultimate: { name: '奇蹟再生', chance: 0.2, mpCost: 62, multiplier: 1.95, type: 'magic', guard: 0.5, healRatio: 0.75, phrase: '引發奇蹟再生並反擊' }
  },
  {
    id: 'nightstalker',
    name: '夜使者',
    tier: 'advanced',
    branch: 'ranger',
    power: 1.23,
    statBonus: { speed: 7, attack: 5, maxHp: 12 },
    description: '速度、爆擊、毒與斬殺，傷害高但波動大。',
    skills: [
      { name: '影襲', chance: 0.32, mpCost: 18, multiplier: 1.52, type: 'speed', phrase: '從影中襲擊' },
      { name: '猛毒斬', chance: 0.22, mpCost: 28, multiplier: 1.72, type: 'speed', phrase: '留下猛毒傷口' },
      { name: '斷喉連擊', chance: 0.15, mpCost: 42, multiplier: 1.2, hits: 3, type: 'speed', phrase: '瞄準弱點連擊' }
    ],
    ultimate: { name: '月下瞬殺', chance: 0.16, mpCost: 60, multiplier: 2.85, type: 'speed', executeBelow: 0.25, phrase: '在月影下完成瞬殺' }
  },
  {
    id: 'beastmaster',
    name: '馴獸師',
    tier: 'advanced',
    branch: 'ranger',
    power: 1.19,
    statBonus: { maxHp: 20, speed: 4, defense: 3 },
    description: '穩定輸出、探索收益與召喚支援。',
    skills: [
      { name: '召喚靈鳥', chance: 0.32, mpCost: 18, multiplier: 1.35, type: 'hybrid', healRatio: 0.14, phrase: '召喚靈鳥協同攻擊' },
      { name: '野性號令', chance: 0.24, mpCost: 28, multiplier: 1.52, type: 'physical', guard: 0.18, phrase: '發出野性號令穩住攻防' },
      { name: '追蹤射擊', chance: 0.18, mpCost: 36, multiplier: 1.9, type: 'speed', phrase: '以追蹤射擊命中破綻' }
    ],
    ultimate: { name: '萬獸同盟', chance: 0.17, mpCost: 64, multiplier: 2.55, hits: 2, type: 'hybrid', phrase: '號召獸群展開同盟攻勢' },
    dropBonus: 0.08
  },
  {
    id: 'boundary_cutter',
    name: '界斷者',
    tier: 'hidden',
    branch: 'blade',
    power: 1.58,
    statBonus: { attack: 18, speed: 5, maxHp: 30 },
    description: '極限物理爆發、破防與斬殺。',
    skills: [
      { name: '斷界斬', chance: 0.34, mpCost: 34, multiplier: 2.08, type: 'physical', defensePierce: 0.32, phrase: '切斷防線與界面' },
      { name: '裂空連閃', chance: 0.24, mpCost: 48, multiplier: 1.35, hits: 3, type: 'speed', defensePierce: 0.16, phrase: '以裂空殘光連閃' },
      { name: '終末劍痕', chance: 0.18, mpCost: 58, multiplier: 2.65, type: 'physical', executeBelow: 0.3, phrase: '留下終末劍痕' }
    ],
    ultimate: { name: '天地一閃', chance: 0.2, mpCost: 96, masteryCost: 120, multiplier: 4.0, type: 'physical', defensePierce: 0.45, executeBelow: 0.35, phrase: '以天地一閃抹去距離' }
  },
  {
    id: 'astral_sage',
    name: '星界賢者',
    tier: 'hidden',
    branch: 'sage',
    power: 1.6,
    statBonus: { maxMp: 90, attack: 8, defense: 4 },
    description: '極限魔法、MP 轉換與法術連鎖。',
    skills: [
      { name: '星核魔法球', chance: 0.34, mpCost: 42, multiplier: 2.18, type: 'magic', phrase: '壓縮星核魔法球' },
      { name: '禁咒詠唱', chance: 0.22, mpCost: 66, multiplier: 3.0, type: 'magic', defensePierce: 0.24, phrase: '完成禁咒詠唱' },
      { name: '虛空返流', chance: 0.2, mpCost: 52, multiplier: 2.1, type: 'magic', mpRefund: 22, phrase: '讓虛空魔力返流' }
    ],
    ultimate: { name: '星界崩滅', chance: 0.2, mpCost: 110, masteryCost: 140, multiplier: 4.25, type: 'magic', defensePierce: 0.36, phrase: '引爆星界崩滅' }
  },
  {
    id: 'eclipse_hunter',
    name: '影月獵神',
    tier: 'hidden',
    branch: 'ranger',
    power: 1.56,
    statBonus: { speed: 18, attack: 10, maxHp: 20 },
    description: '速度極限、毒、追擊、暗殺與探索收益。',
    skills: [
      { name: '月影穿喉', chance: 0.34, mpCost: 36, multiplier: 2.05, type: 'speed', defensePierce: 0.18, phrase: '以月影貫穿要害' },
      { name: '黑毒標記', chance: 0.24, mpCost: 48, multiplier: 2.25, type: 'speed', phrase: '刻下黑毒標記' },
      { name: '獵神追擊', chance: 0.2, mpCost: 62, multiplier: 1.5, hits: 3, type: 'speed', phrase: '展開獵神追擊' }
    ],
    ultimate: { name: '月蝕狩獵', chance: 0.21, mpCost: 104, masteryCost: 120, multiplier: 3.85, type: 'speed', executeBelow: 0.32, phrase: '在月蝕下完成終局狩獵' },
    dropBonus: 0.12
  },
  {
    id: 'unbound',
    name: '無界者',
    tier: 'ultimate',
    branch: 'ultimate',
    power: 1.88,
    statBonus: { maxHp: 90, maxMp: 90, attack: 22, defense: 14, speed: 18 },
    description: '超越職業、屬性與界線的終極道路。',
    skills: [
      { name: '斷界星痕', chance: 0.34, mpCost: 72, masteryCost: 80, multiplier: 2.95, type: 'hybrid', defensePierce: 0.35, phrase: '劃開斷界星痕' },
      { name: '影月輪迴', chance: 0.26, mpCost: 88, masteryCost: 90, multiplier: 1.62, hits: 4, type: 'speed', defensePierce: 0.2, phrase: '讓影月殘像輪迴追擊' },
      { name: '萬象歸一', chance: 0.22, mpCost: 110, masteryCost: 120, multiplier: 3.75, type: 'adaptive', defensePierce: 0.28, phrase: '令萬象歸於一擊' }
    ],
    ultimate: { name: '無限終焉', chance: 0.22, mpCost: 160, masteryCost: 260, multiplier: 5.35, hits: 2, type: 'adaptive', defensePierce: 0.5, executeBelow: 0.35, phrase: '展開無限終焉' }
  }
];

export const countries = [
  { name: '晨露王國', element: '光', ruler: '晨星王', people: 42, gold: 124800, territory: 5 },
  { name: '夜芽同盟', element: '闇', ruler: '夜芽參謀', people: 31, gold: 98300, territory: 4 },
  { name: '風車自由城', element: '風', ruler: '旅人晴空', people: 27, gold: 72100, territory: 3 }
];

export const heroPortraits = {
  blade: './assets/original/chara/47.gif',
  sage: './assets/original/chara/37.gif',
  ranger: './assets/original/chara/42.gif',
  default: './assets/original/chara/14.gif',
  king: './assets/original/chara/69.gif',
  shadow: './assets/original/chara/48.gif',
  wind: './assets/original/chara/42.gif',
  knight: './assets/original/chara/69.gif'
};

const originalMonsters = {
  mouse: './assets/original/monster/1.gif',
  cat: './assets/original/monster/2.gif',
  beast: './assets/original/monster/3.gif',
  bird: './assets/original/monster/4.gif',
  ant: './assets/original/monster/5.gif'
};

export const monsterPortraits = {
  '草原鼠': originalMonsters.mouse,
  '爪貓': originalMonsters.cat,
  '黃斑狗': originalMonsters.beast,
  '獨色鳥': originalMonsters.bird,
  '紅蟻': originalMonsters.ant,
  '犀牛': originalMonsters.beast,
  '蜂群': originalMonsters.ant,
  '魔狼': originalMonsters.cat,
  '夜狐': originalMonsters.cat,
  '七彩鳥': originalMonsters.bird,
  '惡龍': originalMonsters.beast,
  '七個小矮人(火)': originalMonsters.cat,
  '七個小矮人(水)': originalMonsters.cat,
  '七個小矮人(風)': originalMonsters.cat,
  '七個小矮人(雷)': originalMonsters.cat,
  '七個小矮人(星)': originalMonsters.cat,
  '七個小矮人(光)': originalMonsters.cat,
  '七個小矮人(暗)': originalMonsters.cat,
  '禁地守護者': originalMonsters.beast,
  '白羊座': originalMonsters.beast,
  '金牛座': originalMonsters.beast,
  '雙子座': originalMonsters.cat,
  '巨蟹座': originalMonsters.ant,
  '獅子座': originalMonsters.cat,
  '處女座': originalMonsters.bird,
  '天秤座': originalMonsters.bird,
  '天蠍座': originalMonsters.ant,
  '射手座': originalMonsters.bird,
  '山羊座': originalMonsters.beast,
  '水瓶座': originalMonsters.bird,
  '雙魚座': originalMonsters.bird,
  '魔王': originalMonsters.beast,
  '爆彈魔將': originalMonsters.beast,
  '星際劍皇': originalMonsters.beast,
  '歡樂外送魔': originalMonsters.bird,
  '死神-路克': originalMonsters.beast,
  'EnderMan': originalMonsters.cat,
  '寶箱的守財奴': originalMonsters.mouse,
  '寵物箱子的封印箱': originalMonsters.mouse,
  '裝備奧石的守門員': originalMonsters.beast,
  '螳螂': originalMonsters.ant,
  '蚱蜢': originalMonsters.ant,
  '蟑螂': originalMonsters.ant,
  '地獄犬': originalMonsters.beast,
  '樓層武器': originalMonsters.beast,
  '啟動武器-樓層': originalMonsters.beast,
  '跳跳史萊姆': originalMonsters.mouse,
  '迷路菇菇': originalMonsters.mouse,
  '貪吃靈鳥': originalMonsters.bird,
  '泥沼蛙兵': originalMonsters.beast,
  '毒霧水母': originalMonsters.bird,
  '濕地咒偶': originalMonsters.mouse,
  '星光守衛': originalMonsters.bird,
  '裂紋魔書': originalMonsters.beast,
  '塔頂小惡魔': originalMonsters.cat,
  '後山山賊': originalMonsters.cat,
  '霧隱獸': originalMonsters.cat,
  '寶箱守衛': originalMonsters.mouse,
  '封印守護者': originalMonsters.beast,
  '星門魔像': originalMonsters.beast,
  '裂界使者': originalMonsters.beast
};

export const npcRankings = [
  { name: '晨星王', level: 12, wins: 388, battles: 401, element: '光', hp: 1880, maxHp: 1880, mp: 920, maxMp: 920, job: '賢者', jobId: 'astral_sage', portrait: heroPortraits.king },
  { name: '夜芽參謀', level: 10, wins: 301, battles: 326, element: '闇', hp: 1640, maxHp: 1640, mp: 610, maxMp: 610, job: '影術士', jobId: 'nightstalker', portrait: heroPortraits.shadow },
  { name: '旅人晴空', level: 9, wins: 244, battles: 260, element: '風', hp: 1320, maxHp: 1320, mp: 520, maxMp: 520, job: '巡守', jobId: 'ranger', portrait: heroPortraits.wind },
  { name: '紅蓮騎士', level: 7, wins: 188, battles: 205, element: '火', hp: 1180, maxHp: 1180, mp: 360, maxMp: 360, job: '劍士', jobId: 'blade', portrait: heroPortraits.knight }
];

export function createPlayer({ name, element, archetype }) {
  const safeName = String(name || '').trim().slice(0, 12);
  if (safeName.length < 2) throw new Error('角色名稱至少需要 2 個字。');
  if (!elements.includes(element)) throw new Error('請選擇有效屬性。');

  const base = {
    blade: { jobId: 'blade', hp: 120, mp: 28, attack: 18, defense: 8, speed: 9 },
    sage: { jobId: 'sage', hp: 92, mp: 62, attack: 13, defense: 7, speed: 8 },
    ranger: { jobId: 'ranger', hp: 104, mp: 36, attack: 15, defense: 7, speed: 14 }
  }[archetype] || { jobId: 'blade', hp: 105, mp: 36, attack: 15, defense: 8, speed: 10 };
  const baseJob = jobById(base.jobId);

  return {
    version: 3,
    name: safeName,
    element,
    jobId: base.jobId,
    job: baseJob.name,
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
    itemUseCounts: {},
    equipment: { weapon: null, armor: null, trinket: null },
    quest: { id: 'first_hunt', title: '草原討伐', target: 3, progress: 0, completed: false },
    milestonesClaimed: [],
    bestiary: {},
    mapRuns: {},
    mapWins: {},
    careerWins: {},
    careerBattles: {},
    careerFlags: { lowHpWins: 0, lowMpWins: 0, highRiskWins: 0 },
    jobBonusesClaimed: [],
    rebirthCount: 0,
    log: ['歡迎來到冒險者公會。先去草原試試身手吧！'],
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
  const safe = normalizePlayer({ ...player });
  const bonus = equipmentBonus(safe);
  const job = jobById(safe.jobId);
  const jobStatBias = job?.tier === 'base' ? 0 : Math.round((job?.power || 1) * 2);
  return {
    attack: safe.attack + bonus.attack + jobStatBias,
    defense: safe.defense + bonus.defense + Math.floor(jobStatBias / 2),
    speed: safe.speed
  };
}

export function availableRebirthJobs(player) {
  const safe = clonePlayer(player);
  return jobDefinitions
    .filter((job) => job.tier !== 'base' && job.id !== safe.jobId && jobRequirementMet(safe, job))
    .map(publicJobView);
}

export function rebirthPlayer(player, jobId) {
  const next = clonePlayer(player);
  const job = jobById(jobId);
  if (!job || job.tier === 'base') {
    next.log = mergeLog(next.log, ['目前沒有可轉生為該職業的道路。']);
    return next;
  }
  if (!availableRebirthJobs(next).some((candidate) => candidate.id === job.id)) {
    next.log = mergeLog(next.log, ['轉生條件尚未達成。']);
    return next;
  }
  if (!next.jobBonusesClaimed.includes(job.id)) {
    applyJobBonus(next, job);
    next.jobBonusesClaimed.push(job.id);
  }
  next.jobId = job.id;
  next.job = job.name;
  next.rebirthCount += 1;
  next.careerBattles[job.id] = next.careerBattles[job.id] || 0;
  next.careerWins[job.id] = next.careerWins[job.id] || 0;
  next.hp = next.maxHp;
  next.mp = next.maxMp;
  next.updatedAt = new Date().toISOString();
  const revealText = job.tier === 'hidden' || job.tier === 'ultimate'
    ? `新的道路在沉默中開啟：${job.name}。`
    : `轉生為「${job.name}」，獲得新的招式與成長加成。`;
  next.log = mergeLog(next.log, [revealText]);
  return next;
}

export function careerPowerScore(jobId) {
  return jobById(jobId)?.power || 1;
}

export function availableMaps(player) {
  const safe = player ? clonePlayer(player) : null;
  return maps.filter((map) => mapAvailable(safe, map));
}

export function chooseMap(mapId) {
  return maps.find((map) => map.id === mapId) || maps[0];
}

export function createBattleEncounter(player, mapId, rng = Math.random) {
  const next = clonePlayer(player);
  const map = chooseMap(mapId);
  if (!mapAvailable(next, map)) return buildHiddenMapBlock(next);
  const messages = [];
  const turns = [];
  const stats = totalStats(next);
  const monsterName = map.monsters[Math.floor(rng() * map.monsters.length)] || map.monsters[0];
  const monster = createMonster(map, monsterName, rng);
  const playerStart = { hp: next.hp, maxHp: next.maxHp, mp: next.mp, maxMp: next.maxMp };
  const startingLevel = next.level;
  const monsterStart = { hp: monster.hp, maxHp: monster.maxHp };

  if (next.hp <= 0) {
    messages.push('HP 已歸零，請先到旅店休息。');
    turns.push({
      side: 'system',
      round: 0,
      text: '公會醫護員擋下了出擊：請先到旅店恢復體力。',
      playerHp: next.hp,
      playerMp: next.mp,
      monsterHp: monster.hp
    });
    next.updatedAt = new Date().toISOString();
    next.log = mergeLog(next.log, messages);
    return buildBattleEncounter({ next, map, monsterName, monster, playerStart, monsterStart, turns, messages, result: 'blocked' });
  }

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
  next.careerBattles[next.jobId] = (next.careerBattles[next.jobId] || 0) + 1;
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
  const skillState = { ultimateUsed: false };
  for (let round = 1; round <= 8 && next.hp > 0 && monster.hp > 0; round += 1) {
    turns.push({ side: 'system', round, text: `第 ${round} 回合`, playerHp: next.hp, playerMp: next.mp, monsterHp: monster.hp });
    const playerFirst = stats.speed + rng() * 10 >= monster.speed + rng() * 10;
    if (playerFirst) {
      guardRate = takePlayerTurn({ next, monster, map, stats, turns, round, rng, guardRate, skillState });
      if (monster.hp > 0) guardRate = takeMonsterTurn({ next, monster, map, stats, turns, round, rng, guardRate });
    } else {
      guardRate = takeMonsterTurn({ next, monster, map, stats, turns, round, rng, guardRate });
      if (next.hp > 0) guardRate = takePlayerTurn({ next, monster, map, stats, turns, round, rng, guardRate, skillState });
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
    recordCareerWin(next, map, playerStart, startingLevel);
    next.quest = updateQuest(next.quest, map.id);
    monster.hp = 0;
    messages.push(`你在 ${map.name} 擊倒了「${monsterName}」，獲得 ${expGain} EXP、${goldGain} 金幣、${masteryGain} 熟練。`);
    turns.push({ side: 'system', round: 9, text: `戰鬥結束！${next.name} 擊倒了「${monsterName}」。`, playerHp: next.hp, playerMp: next.mp, monsterHp: monster.hp });

    const dropChance = itemDropChance(map.level) + (jobById(next.jobId)?.dropBonus || 0);
    if (rng() < dropChance) {
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

function buildHiddenMapBlock(next) {
  const messages = ['尚未發現這個地點。'];
  const turns = [{
    side: 'system',
    round: 0,
    text: '公會地圖上還沒有這個地點的座標。',
    playerHp: next.hp,
    playerMp: next.mp,
    monsterHp: 0
  }];
  next.updatedAt = new Date().toISOString();
  next.log = mergeLog(next.log, messages);
  return {
    player: next,
    result: 'blocked',
    messages,
    scene: {
      map: { id: 'unknown', name: '未發現地點', category: '未知', level: 0 },
      monster: { name: '未遭遇', maxHp: 1, portrait: originalMonsters.beast },
      playerStart: { hp: next.hp, maxHp: next.maxHp, mp: next.mp, maxMp: next.maxMp },
      monsterStart: { hp: 0, maxHp: 1 },
      playerEnd: { hp: next.hp, maxHp: next.maxHp, mp: next.mp, maxMp: next.maxMp },
      monsterEnd: { hp: 0, maxHp: 1 },
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

const monsterBattleSkills = [
  { name: '強烈攻擊', chance: 0.25, multiplier: 1.32, phrase: '以強烈攻擊壓迫過來' },
  { name: '猛毒斬', chance: 0.16, multiplier: 1.52, phrase: '帶著猛毒斬擊逼近' },
  { name: '初級必殺', chance: 0.10, multiplier: 1.82, phrase: '嘗試發動必殺攻勢' },
  { name: '魅惑', chance: 0.10, multiplier: 0.82, phrase: '以魅惑擾亂節奏後突襲' }
];

function takePlayerTurn({ next, monster, stats, turns, round, rng, skillState }) {
  const skill = choosePlayerSkill(next, monster, rng, skillState);
  const multiplier = skill?.multiplier || 1;
  const variance = 0.88 + rng() * 0.24;
  const rawDamage = Math.round(playerSkillBaseDamage(next, stats, skill) * multiplier * variance - monster.defense * (0.52 * (1 - (skill?.defensePierce || 0))));
  let damage = Math.max(2, rawDamage);
  if (skill?.hits) damage = Math.round(damage * skill.hits * 0.78);
  if (skill?.executeBelow && monster.hp / monster.maxHp <= skill.executeBelow) damage = Math.max(damage, Math.round(monster.hp * 1.15));
  if (skill) {
    next.mp = Math.max(0, next.mp - (skill.mpCost || 0));
    next.mastery = Math.max(0, next.mastery - (skill.masteryCost || 0));
  }
  monster.hp = Math.max(0, monster.hp - damage);
  if (skill?.healRatio) next.hp = Math.min(next.maxHp, next.hp + Math.max(1, Math.round(damage * skill.healRatio)));
  if (skill?.mpRefund) next.mp = Math.min(next.maxMp, next.mp + skill.mpRefund);
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

function choosePlayerSkill(player, monster, rng, skillState) {
  const job = jobById(player.jobId);
  const ultimate = job?.ultimate;
  if (ultimate && !skillState.ultimateUsed && canPaySkill(player, ultimate)) {
    const hpPressure = monster.hp / Math.max(1, monster.maxHp) <= (ultimate.executeBelow || 0.28) ? 0.08 : 0;
    if (rng() <= ultimate.chance + hpPressure) {
      skillState.ultimateUsed = true;
      return ultimate;
    }
  }
  return chooseSkill(job?.skills || jobById('blade').skills, rng, player.mp, player.mastery);
}

function playerSkillBaseDamage(player, stats, skill) {
  const type = skill?.type || 'physical';
  const magicBase = player.maxMp * 0.32 + player.level * 5 + Math.sqrt(Math.max(0, player.mastery)) * 0.65;
  const speedBase = stats.attack * 0.72 + stats.speed * 2.35 + player.level * 3;
  if (type === 'magic') return magicBase;
  if (type === 'speed') return speedBase;
  if (type === 'hybrid') return (stats.attack * 0.82 + magicBase * 0.55 + stats.speed * 0.8 + player.level * 2);
  if (type === 'adaptive') return Math.max(stats.attack * 1.35 + player.level * 5, magicBase * 1.12, speedBase * 1.08);
  return stats.attack + player.level * 4;
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

function chooseSkill(skills, rng, availableMp = Infinity, availableMastery = Infinity) {
  const roll = rng();
  let threshold = 0;
  for (const skill of skills) {
    threshold += skill.chance;
    if (roll <= threshold && availableMp >= (skill.mpCost || 0) && availableMastery >= (skill.masteryCost || 0)) return skill;
  }
  return null;
}

function canPaySkill(player, skill) {
  return player.mp >= (skill.mpCost || 0) && player.mastery >= (skill.masteryCost || 0);
}

export function portraitForPlayer(player) {
  if (!player) return heroPortraits.default;
  const jobId = player.jobId || inferJobId(player.job);
  return {
    blade: heroPortraits.blade,
    sage: heroPortraits.sage,
    ranger: heroPortraits.ranger,
    sword_heir: heroPortraits.blade,
    seraph: heroPortraits.knight,
    archmage: heroPortraits.sage,
    cleric: heroPortraits.king,
    nightstalker: heroPortraits.shadow,
    beastmaster: heroPortraits.ranger,
    boundary_cutter: heroPortraits.knight,
    astral_sage: heroPortraits.king,
    eclipse_hunter: heroPortraits.shadow,
    unbound: heroPortraits.default
  }[jobId] || player.portrait || heroPortraits.default;
}

export function portraitForMonster(name) {
  return monsterPortraits[name] || originalMonsters.beast;
}

export function restAtInn(player) {
  const next = clonePlayer(player);
  const cost = Math.max(10, Math.round(next.level * 18));
  if (next.hp <= 0 && next.gold < cost) {
    next.hp = Math.max(1, Math.ceil(next.maxHp * 0.3));
    next.mp = Math.max(1, Math.ceil(next.maxMp * 0.3));
    next.updatedAt = new Date().toISOString();
    next.log = mergeLog(next.log, ['公會啟動緊急救援，免費恢復 30% HP / MP。']);
    return next;
  }
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
  const ownedUses = (Number(next.itemUseCounts[item.id]) || 0) + next.inventory.filter((inventoryId) => inventoryId === item.id).length;
  if (item.useLimit && ownedUses >= item.useLimit) {
    next.log = mergeLog(next.log, [`「${item.name}」已達每名角色 ${item.useLimit} 次的購買上限。`]);
    return next;
  }
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
  const useCount = Number(next.itemUseCounts[itemId]) || 0;
  if (item.useLimit && useCount >= item.useLimit) {
    next.log = mergeLog(next.log, [`「${item.name}」已達每名角色 ${item.useLimit} 次的使用上限。`]);
    return next;
  }
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
  if (item.useLimit) next.itemUseCounts[itemId] = useCount + 1;
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
  const visibleMaps = availableMaps(safe);
  const selectedMap = visibleMaps.find((map) => map.id === mapId) || visibleMaps[0] || chooseMap('meadow');
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
    selectedMapId: selectedMap.id,
    selectedMapName: selectedMap.name,
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
  if (typeof json !== 'string' || json.length > 250000) throw new Error('存檔大小超過限制。');
  let data;
  try {
    data = JSON.parse(json);
  } catch {
    throw new Error('存檔 JSON 無法解析。');
  }
  if (!isPlainObject(data)) throw new Error('存檔格式錯誤。');
  const sourceVersion = data.version === undefined ? 1 : data.version;
  if (!Number.isSafeInteger(sourceVersion) || sourceVersion < 1 || sourceVersion > 3) throw new Error('存檔版本不支援。');
  if (sourceVersion === 3 && (data.itemUseCounts === undefined || data.jobBonusesClaimed === undefined)) {
    throw new Error('v3 存檔缺少一次性限制紀錄。');
  }

  const name = importText(data.name, '角色名稱', { min: 2, max: 12 });
  if (!elements.includes(data.element)) throw new Error('存檔屬性無效。');
  const requestedJobId = data.jobId === undefined ? inferJobId(data.job) : importText(data.jobId, '職業', { min: 1, max: 40 });
  const job = jobById(requestedJobId);
  if (!job) throw new Error('存檔職業無效。');
  const baseArchetype = ['blade', 'sage', 'ranger'].includes(job.id)
    ? job.id
    : ['blade', 'sage', 'ranger'].includes(job.branch) ? job.branch : 'blade';
  const player = createPlayer({ name, element: data.element, archetype: baseArchetype });
  player.version = 3;
  player.jobId = job.id;
  player.job = job.name;

  const scalarRules = [
    ['level', 1, 1000],
    ['exp', 0, 1000000000000],
    ['nextExp', 1, 1000000000000],
    ['gold', 0, 1000000000000],
    ['maxHp', 1, 10000000],
    ['maxMp', 1, 10000000],
    ['attack', 0, 1000000],
    ['defense', 0, 1000000],
    ['speed', 0, 1000000],
    ['mastery', 0, 1000000000000],
    ['wins', 0, 1000000000],
    ['losses', 0, 1000000000],
    ['battles', 0, 1000000000],
    ['rebirthCount', 0, 1000000]
  ];
  scalarRules.forEach(([key, min, max]) => {
    player[key] = importInteger(data, key, player[key], min, max);
  });
  player.hp = importInteger(data, 'hp', player.maxHp, 0, player.maxHp);
  player.mp = importInteger(data, 'mp', player.maxMp, 0, player.maxMp);

  if (data.inventory !== undefined) {
    if (!Array.isArray(data.inventory) || data.inventory.length > 500) throw new Error('存檔背包格式錯誤。');
    player.inventory = data.inventory.map((itemId) => {
      if (typeof itemId !== 'string' || !getItem(itemId)) throw new Error('存檔包含無效物品。');
      return itemId;
    });
  }

  if (data.equipment !== undefined) {
    if (!isPlainObject(data.equipment)) throw new Error('存檔裝備格式錯誤。');
    player.equipment = Object.fromEntries(['weapon', 'armor', 'trinket'].map((slot) => {
      const itemId = data.equipment[slot];
      if (itemId === undefined || itemId === null || itemId === '') return [slot, null];
      const item = typeof itemId === 'string' ? getItem(itemId) : null;
      if (!item || item.type !== slot) throw new Error('存檔包含無效裝備。');
      return [slot, itemId];
    }));
  }

  player.itemUseCounts = importLimitedItemCounts(data.itemUseCounts);
  if (sourceVersion < 3 && data.itemUseCounts === undefined) {
    player.itemUseCounts = Object.fromEntries(
      shopItems.filter((item) => item.useLimit).map((item) => [item.id, item.useLimit])
    );
  }
  player.jobBonusesClaimed = importIdList(data.jobBonusesClaimed, new Set(jobDefinitions.map((entry) => entry.id)), '轉生獎勵');
  player.milestonesClaimed = importIdList(data.milestonesClaimed, new Set(milestones.map((entry) => entry.id)), '里程碑');
  player.mapRuns = importCounterRecord(data.mapRuns, new Set(maps.map((map) => map.id)), '地圖紀錄');
  player.mapWins = importCounterRecord(data.mapWins, new Set(maps.map((map) => map.id)), '地圖勝場');
  player.careerWins = importCounterRecord(data.careerWins, new Set(jobDefinitions.map((entry) => entry.id)), '職業勝場');
  player.careerBattles = importCounterRecord(data.careerBattles, new Set(jobDefinitions.map((entry) => entry.id)), '職業戰數');
  const historicalJobs = [...Object.keys(player.careerBattles), ...Object.keys(player.careerWins), job.id]
    .filter((id) => jobById(id)?.tier !== 'base');
  if (sourceVersion < 3 && data.jobBonusesClaimed === undefined) {
    player.jobBonusesClaimed = [...new Set(historicalJobs)];
  } else if (sourceVersion === 3 && historicalJobs.some((id) => !player.jobBonusesClaimed.includes(id))) {
    throw new Error('存檔轉生獎勵紀錄與職業歷史不一致。');
  }
  player.careerFlags = importCareerFlags(data.careerFlags);
  player.bestiary = importBestiary(data.bestiary);
  player.quest = importQuest(data.quest, player.quest);
  player.log = importLog(data.log, player.log);
  player.createdAt = importTimestamp(data.createdAt, player.createdAt);
  player.updatedAt = importTimestamp(data.updatedAt, player.updatedAt);
  return normalizePlayer(player);
}

function isPlainObject(value) {
  return Boolean(value) && typeof value === 'object' && !Array.isArray(value);
}

function importText(value, label, { min = 0, max = 100 } = {}) {
  if (typeof value !== 'string') throw new Error(`存檔${label}格式錯誤。`);
  const text = value.trim();
  if (text.length < min || text.length > max || /[\u0000-\u001f\u007f]/.test(text)) throw new Error(`存檔${label}格式錯誤。`);
  return text;
}

function importInteger(source, key, fallback, min, max) {
  if (source[key] === undefined) return fallback;
  const value = source[key];
  if (!Number.isSafeInteger(value) || value < min || value > max) throw new Error(`存檔欄位「${key}」格式錯誤。`);
  return value;
}

function importIdList(value, validIds, label) {
  if (value === undefined) return [];
  if (!Array.isArray(value) || value.length > validIds.size) throw new Error(`存檔${label}格式錯誤。`);
  const ids = value.map((id) => {
    if (typeof id !== 'string' || !validIds.has(id)) throw new Error(`存檔${label}包含無效資料。`);
    return id;
  });
  return [...new Set(ids)];
}

function importCounterRecord(value, validIds, label) {
  if (value === undefined) return {};
  if (!isPlainObject(value) || Object.keys(value).length > validIds.size) throw new Error(`存檔${label}格式錯誤。`);
  return Object.fromEntries(Object.entries(value).map(([id, count]) => {
    if (!validIds.has(id) || !Number.isSafeInteger(count) || count < 0 || count > 1000000000) {
      throw new Error(`存檔${label}包含無效資料。`);
    }
    return [id, count];
  }));
}

function importLimitedItemCounts(value) {
  if (value === undefined) return {};
  if (!isPlainObject(value) || Object.keys(value).length > shopItems.length) throw new Error('存檔道具使用紀錄格式錯誤。');
  return Object.fromEntries(Object.entries(value).map(([itemId, count]) => {
    const item = getItem(itemId);
    if (!item?.useLimit || !Number.isSafeInteger(count) || count < 0 || count > item.useLimit) {
      throw new Error('存檔道具使用紀錄包含無效資料。');
    }
    return [itemId, count];
  }));
}

function importCareerFlags(value) {
  if (value === undefined) return { lowHpWins: 0, lowMpWins: 0, highRiskWins: 0 };
  if (!isPlainObject(value)) throw new Error('存檔職業旗標格式錯誤。');
  return {
    lowHpWins: importInteger(value, 'lowHpWins', 0, 0, 1000000000),
    lowMpWins: importInteger(value, 'lowMpWins', 0, 0, 1000000000),
    highRiskWins: importInteger(value, 'highRiskWins', 0, 0, 1000000000)
  };
}

function importBestiary(value) {
  if (value === undefined) return {};
  if (!isPlainObject(value) || Object.keys(value).length > 250) throw new Error('存檔圖鑑格式錯誤。');
  return Object.fromEntries(Object.entries(value).map(([key, entry]) => {
    if (['__proto__', 'prototype', 'constructor'].includes(key) || !isPlainObject(entry)) throw new Error('存檔圖鑑包含無效資料。');
    const name = importText(entry.name === undefined ? key : entry.name, '圖鑑名稱', { min: 1, max: 60 });
    const count = importInteger(entry, 'count', 1, 1, 1000000000);
    const lastMapId = entry.lastMapId === undefined || entry.lastMapId === ''
      ? ''
      : importText(entry.lastMapId, '圖鑑地圖', { min: 1, max: 50 });
    if (lastMapId && !maps.some((map) => map.id === lastMapId)) throw new Error('存檔圖鑑地圖無效。');
    return [name, {
      name,
      count,
      firstMap: entry.firstMap === undefined ? '' : importText(entry.firstMap, '圖鑑初遇地圖', { max: 80 }),
      lastMap: entry.lastMap === undefined ? '' : importText(entry.lastMap, '圖鑑最近地圖', { max: 80 }),
      lastMapId,
      portrait: portraitForMonster(name)
    }];
  }));
}

function importQuest(value, fallback) {
  if (value === undefined) return fallback;
  if (!isPlainObject(value)) throw new Error('存檔任務格式錯誤。');
  const progress = importInteger(value, 'progress', 0, 0, fallback.target);
  if (value.completed !== undefined && typeof value.completed !== 'boolean') throw new Error('存檔任務完成狀態格式錯誤。');
  return { ...fallback, progress, completed: value.completed ?? false };
}

function importLog(value, fallback) {
  if (value === undefined) return fallback;
  if (!Array.isArray(value) || value.length > 40) throw new Error('存檔紀錄格式錯誤。');
  return value.map((entry) => cleanLegacyName(importText(entry, '紀錄', { max: 300 })));
}

function importTimestamp(value, fallback) {
  if (value === undefined) return fallback;
  if (typeof value !== 'string' || value.length > 40 || !Number.isFinite(Date.parse(value))) throw new Error('存檔時間格式錯誤。');
  return new Date(value).toISOString();
}

function normalizePlayer(player) {
  if (!Array.isArray(player.inventory)) player.inventory = [];
  if (!player.itemUseCounts || typeof player.itemUseCounts !== 'object' || Array.isArray(player.itemUseCounts)) player.itemUseCounts = {};
  player.equipment = {
    weapon: player.equipment?.weapon || null,
    armor: player.equipment?.armor || null,
    trinket: player.equipment?.trinket || null
  };
  if (!player.jobId) player.jobId = inferJobId(player.job);
  const job = jobById(player.jobId) || jobById('blade');
  player.jobId = job.id;
  player.job = job.name;
  if (!player.quest) player.quest = { id: 'first_hunt', title: '草原討伐', target: 3, progress: 0, completed: false };
  if (!Array.isArray(player.log)) player.log = [];
  player.log = player.log.map(cleanLegacyName);
  if (!Array.isArray(player.milestonesClaimed)) player.milestonesClaimed = [];
  if (!player.bestiary || typeof player.bestiary !== 'object' || Array.isArray(player.bestiary)) player.bestiary = {};
  if (!player.mapRuns || typeof player.mapRuns !== 'object' || Array.isArray(player.mapRuns)) player.mapRuns = {};
  if (!player.mapWins || typeof player.mapWins !== 'object' || Array.isArray(player.mapWins)) player.mapWins = {};
  if (!player.careerWins || typeof player.careerWins !== 'object' || Array.isArray(player.careerWins)) player.careerWins = {};
  if (!player.careerBattles || typeof player.careerBattles !== 'object' || Array.isArray(player.careerBattles)) player.careerBattles = {};
  player.careerFlags = {
    lowHpWins: Number(player.careerFlags?.lowHpWins) || 0,
    lowMpWins: Number(player.careerFlags?.lowMpWins) || 0,
    highRiskWins: Number(player.careerFlags?.highRiskWins) || 0
  };
  if (!Array.isArray(player.jobBonusesClaimed)) player.jobBonusesClaimed = [];
  player.rebirthCount = Number(player.rebirthCount) || 0;
  return player;
}

function inferJobId(jobName = '') {
  const legacy = {
    '豆豆劍士': 'blade',
    '微光術士': 'sage',
    '草原巡守': 'ranger',
    '豆豆冒險者': 'blade',
    劍士: 'blade',
    術士: 'sage',
    巡守: 'ranger',
    劍之傳人: 'sword_heir',
    熾天使: 'seraph',
    大魔法師: 'archmage',
    神職者: 'cleric',
    夜使者: 'nightstalker',
    馴獸師: 'beastmaster',
    界斷者: 'boundary_cutter',
    星界賢者: 'astral_sage',
    影月獵神: 'eclipse_hunter',
    無界者: 'unbound'
  };
  return legacy[jobName] || 'blade';
}

function cleanLegacyName(text) {
  return String(text)
    .replaceAll('豆豆冒險公會', '冒險者公會')
    .replaceAll('豆豆劍士', '劍士')
    .replaceAll('微光術士', '術士')
    .replaceAll('草原巡守', '巡守')
    .replaceAll('豆豆冒險者', '冒險者')
    .replaceAll('豆豆版', '終端版');
}

function jobById(jobId) {
  return jobDefinitions.find((job) => job.id === jobId) || null;
}

function publicJobView(job) {
  return {
    id: job.id,
    name: job.name,
    tier: job.tier,
    branch: job.branch,
    description: job.description,
    power: job.power,
    skillNames: [...(job.skills || []).map((skill) => skill.name), job.ultimate?.name].filter(Boolean),
    ultimateName: job.ultimate?.name || ''
  };
}

function applyJobBonus(player, job) {
  const bonus = job.statBonus || {};
  player.maxHp += bonus.maxHp || 0;
  player.maxMp += bonus.maxMp || 0;
  player.attack += bonus.attack || 0;
  player.defense += bonus.defense || 0;
  player.speed += bonus.speed || 0;
}

function mapAvailable(player, map) {
  const rule = hiddenMapRules[map.id];
  return !rule || Boolean(rule(player || {}));
}

function mapWin(player, mapId, count = 1) {
  return Number(player?.mapWins?.[mapId]) >= count;
}

function hasItem(player, itemId) {
  return (player?.inventory || []).includes(itemId) || Object.values(player?.equipment || {}).includes(itemId);
}

function masteryAtLeast(player, value) {
  return Number(player?.mastery) >= value;
}

function jobRequirementMet(player, job) {
  if (job.tier === 'advanced') return regularRebirthReady(player);
  if (job.id === 'boundary_cutter') return boundaryCutterReady(player);
  if (job.id === 'astral_sage') return astralSageReady(player);
  if (job.id === 'eclipse_hunter') return eclipseHunterReady(player);
  if (job.id === 'unbound') return unboundReady(player);
  return false;
}

function regularRebirthReady(player) {
  return player.level >= 5 && player.mastery >= 500 && player.battles >= 5 && Boolean(player.quest?.completed);
}

function boundaryCutterReady(player) {
  return player.level >= 12
    && player.mastery >= 8000
    && player.wins >= 80
    && bestiaryCount(player) >= 20
    && weaponCollectionCount(player) >= 5
    && mapWinAtLeast(player, ['tower', 'forbidden', 'demon_castle'], 1)
    && player.careerFlags.lowHpWins >= 3;
}

function astralSageReady(player) {
  return player.level >= 12
    && player.maxMp >= 180
    && player.mastery >= 9000
    && bestiaryCount(player) >= 15
    && mapWinAtLeast(player, ['starlit_night', 'star_maze', 'aincrad'], 1)
    && player.careerFlags.lowMpWins >= 3;
}

function eclipseHunterReady(player) {
  return player.level >= 12
    && player.speed >= 35
    && player.mastery >= 8000
    && bestiaryCount(player) >= 25
    && Object.keys(player.mapWins || {}).length >= 10
    && Object.values(player.mapWins || {}).filter((count) => Number(count) >= 3).length >= 5
    && ['夜狐', '滿月狼人', '死神-路克'].some((name) => Number(player.bestiary?.[name]?.count) > 0);
}

function unboundReady(player) {
  return player.level >= 25
    && player.mastery >= 50000
    && player.battles >= 500
    && player.wins >= 400
    && ['boundary_cutter', 'astral_sage', 'eclipse_hunter'].every((jobId) => Number(player.careerWins?.[jobId]) >= 30)
    && mapWinAtLeast(player, ['forbidden', 'demon_castle', 'treasure_ship', 'ruins', 'dragon_tower', 'legendary_secret', 'aincrad', 'upper_tower_gate'], 3)
    && bestiaryCount(player) >= 40
    && Object.values(player.bestiary || {}).filter((entry) => Number(entry.count) >= 5).length >= 10
    && player.careerFlags.lowHpWins >= 5
    && player.careerFlags.lowMpWins >= 5
    && player.careerFlags.highRiskWins >= 20;
}

function bestiaryCount(player) {
  return Object.keys(player.bestiary || {}).length;
}

function weaponCollectionCount(player) {
  const ids = new Set([...(player.inventory || []), ...Object.values(player.equipment || {})].filter(Boolean));
  return [...ids].filter((itemId) => getItem(itemId)?.type === 'weapon').length;
}

function mapWinAtLeast(player, mapIds, count) {
  return mapIds.every((mapId) => Number(player.mapWins?.[mapId]) >= count);
}

function recordCareerWin(player, map, playerStart, startingLevel) {
  player.mapWins[map.id] = (player.mapWins[map.id] || 0) + 1;
  player.careerWins[player.jobId] = (player.careerWins[player.jobId] || 0) + 1;
  const hpRatio = player.hp / Math.max(1, player.maxHp);
  const mpRatio = player.mp / Math.max(1, player.maxMp);
  if (hpRatio <= 0.1 || playerStart.hp / Math.max(1, playerStart.maxHp) <= 0.1) player.careerFlags.lowHpWins += 1;
  if (mpRatio <= 0.1 || playerStart.mp / Math.max(1, playerStart.maxMp) <= 0.1) player.careerFlags.lowMpWins += 1;
  if (map.level > startingLevel + 4) player.careerFlags.highRiskWins += 1;
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
  const visibleMaps = availableMaps(player);
  const affordable = visibleMaps.filter((map) => map.cost <= player.gold && map.level <= player.level + 2);
  if (!player.quest?.completed) return chooseMap('meadow');
  const treasureCave = affordable.find((map) => map.id === 'treasure_cave');
  if (player.level < 3 && treasureCave) return treasureCave;
  const trainingTower = affordable.find((map) => map.id === 'training_tower');
  if (player.level < 5 && trainingTower) return trainingTower;
  return affordable.sort((a, b) => b.level - a.level)[0] || visibleMaps.find((map) => map.cost <= player.gold) || chooseMap('meadow');
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
