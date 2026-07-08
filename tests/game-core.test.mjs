import assert from 'node:assert/strict';
import test from 'node:test';
import {
  availableMaps,
  availableRebirthJobs,
  buyItem,
  bestiaryEntries,
  careerPowerScore,
  claimMilestone,
  claimQuestReward,
  createBattleEncounter,
  createPlayer,
  equipItem,
  maps,
  milestonesFor,
  parsePlayer,
  performBattle,
  portraitForMonster,
  portraitForPlayer,
  progressionGuide,
  rebirthPlayer,
  restAtInn,
  serializePlayer,
  shopItems,
  totalStats,
  useItem
} from '../assets/game-core.js';

function rngSequence(values) {
  let index = 0;
  return () => values[index++ % values.length];
}

test('createPlayer validates name and initializes core stats', () => {
  const player = createPlayer({ name: '晨星勇者', element: '光', archetype: 'blade' });
  assert.equal(player.name, '晨星勇者');
  assert.equal(player.level, 1);
  assert.equal(player.hp, player.maxHp);
  assert.equal(player.inventory.includes('novice_badge'), true);
  assert.deepEqual(player.milestonesClaimed, []);
  assert.deepEqual(player.bestiary, {});
  assert.deepEqual(player.mapRuns, {});
  assert.equal(player.jobId, 'blade');
  assert.equal(player.job, '劍士');
  assert.equal(player.log.some((line) => line.includes('豆豆')), false);
});

test('rebirth jobs stay hidden until exact hard conditions are met', () => {
  const player = createPlayer({ name: '轉生勇者', element: '光', archetype: 'blade' });
  player.level = 5;
  player.mastery = 500;
  player.battles = 5;
  player.quest.completed = true;
  const basicNames = availableRebirthJobs(player).map((job) => job.name);
  assert.deepEqual(basicNames, ['劍之傳人', '熾天使', '大魔法師', '神職者', '夜使者', '馴獸師']);
  assert.equal(basicNames.includes('界斷者'), false);
  player.level = 12;
  player.mastery = 8000;
  player.wins = 80;
  player.bestiary = Object.fromEntries(Array.from({ length: 20 }, (_, index) => [`魔物${index}`, { name: `魔物${index}`, count: 1 }]));
  player.mapWins = { tower: 1, forbidden: 1, demon_castle: 1 };
  player.inventory.push('short_sword', 'long_sword', 'short_bow', 'double_axe', 'flame_sword');
  player.careerFlags.lowHpWins = 3;
  const hiddenNames = availableRebirthJobs(player).map((job) => job.name);
  assert.equal(hiddenNames.includes('界斷者'), true);
});

test('career power tiers rise with difficulty without making regular rebirths obsolete', () => {
  assert.ok(careerPowerScore('sword_heir') > careerPowerScore('blade'));
  assert.ok(careerPowerScore('boundary_cutter') > careerPowerScore('sword_heir'));
  assert.ok(careerPowerScore('unbound') > careerPowerScore('boundary_cutter'));
  assert.ok(careerPowerScore('boundary_cutter') < careerPowerScore('unbound'));
  assert.ok(careerPowerScore('sword_heir') <= 1.28);
  assert.ok(careerPowerScore('boundary_cutter') <= 1.7);
});

test('rebirth applies a job once available and battle uses its skill kit with one ultimate max', () => {
  let player = createPlayer({ name: '轉職勇者', element: '雷', archetype: 'blade' });
  player.level = 5;
  player.mastery = 1200;
  player.battles = 6;
  player.quest.completed = true;
  player = rebirthPlayer(player, 'sword_heir');
  assert.equal(player.job, '劍之傳人');
  assert.equal(player.rebirthCount, 1);
  player.mp = player.maxMp = 200;
  player.attack = 80;
  player.gold = 999;
  const encounter = createBattleEncounter(player, 'meadow', rngSequence([0, 0.01, 0.99, 0.01, 0.01, 0.99, 0.99]));
  const playerSkills = encounter.scene.turns.filter((turn) => turn.side === 'player').map((turn) => turn.skill);
  assert.ok(playerSkills.some((skill) => ['破空斬', '追星連斬', '劍心凝聚', '無限劍域'].includes(skill)));
  assert.ok(playerSkills.filter((skill) => skill === '無限劍域').length <= 1);
});

test('ultimate hidden job only appears after all hidden careers are mastered and remains absent otherwise', () => {
  const player = createPlayer({ name: '終極勇者', element: '星', archetype: 'ranger' });
  player.level = 25;
  player.mastery = 50000;
  player.battles = 500;
  player.wins = 400;
  player.careerWins = { boundary_cutter: 30, astral_sage: 30, eclipse_hunter: 29 };
  player.mapWins = { forbidden: 3, demon_castle: 3, treasure_ship: 3, ruins: 3, dragon_tower: 3, legendary_secret: 3, aincrad: 3, upper_tower_gate: 3 };
  player.bestiary = Object.fromEntries(Array.from({ length: 40 }, (_, index) => [`終局魔物${index}`, { name: `終局魔物${index}`, count: index < 10 ? 5 : 1 }]));
  player.careerFlags.lowHpWins = 5;
  player.careerFlags.lowMpWins = 5;
  player.careerFlags.highRiskWins = 20;
  assert.equal(availableRebirthJobs(player).some((job) => job.id === 'unbound'), false);
  player.careerWins.eclipse_hunter = 30;
  assert.equal(availableRebirthJobs(player).some((job) => job.id === 'unbound' && job.name === '無界者'), true);
});

test('portrait helpers resolve local character and monster sprites', () => {
  const player = createPlayer({ name: '圖像勇者', element: '光', archetype: 'sage' });
  assert.match(portraitForPlayer(player), /assets\/original\/chara\/37\.gif$/);
  assert.match(portraitForMonster('草原鼠'), /assets\/original\/monster\/1\.gif$/);
  assert.match(portraitForMonster('爪貓'), /assets\/original\/monster\/2\.gif$/);
  assert.match(portraitForMonster('黃斑狗'), /assets\/original\/monster\/3\.gif$/);
  const encounter = createBattleEncounter(player, 'meadow', rngSequence([0, 0.1, 0.9]));
  assert.match(encounter.scene.monster.portrait, /assets\/original\/monster\/[1-5]\.gif$/);
});

test('reference catalogs drive original-style maps, weapons, items, and consumables', () => {
  assert.equal(maps.length, 29);
  assert.ok(maps.some((map) => map.name === '草原'));
  assert.ok(maps.some((map) => map.name === '上塔之門'));
  assert.ok(shopItems.some((item) => item.name === '短劍'));
  assert.ok(shopItems.some((item) => item.name === '藥草' && item.type === 'consumable'));
  let player = createPlayer({ name: '道具勇者', element: '水', archetype: 'sage' });
  player.inventory.push('mastery_book');
  const used = useItem(player, 'mastery_book');
  assert.equal(used.mastery, player.mastery + 1000);
  assert.equal(used.inventory.includes('mastery_book'), false);
});

test('availableMaps restores original hidden map visibility without placeholder leaks', () => {
  const player = createPlayer({ name: '地圖勇者', element: '光', archetype: 'blade' });
  const initial = availableMaps(player).map((map) => map.id);
  assert.equal(initial.includes('meadow'), true);
  assert.equal(initial.includes('forbidden'), true);
  assert.equal(initial.includes('treasure_cave'), false);
  assert.equal(initial.includes('training_tower'), false);
  assert.equal(initial.includes('aincrad'), false);
  assert.equal(initial.includes('upper_tower_gate'), false);

  player.battles = 5;
  player.mapWins = { meadow: 2, marsh: 1 };
  player.mastery = 500;
  const earlyUnlocked = availableMaps(player).map((map) => map.id);
  assert.equal(earlyUnlocked.includes('treasure_cave'), true);
  assert.equal(earlyUnlocked.includes('training_tower'), true);
  assert.equal(earlyUnlocked.includes('mystic_lake'), true);
  assert.equal(earlyUnlocked.includes('bright_meadow'), true);
  assert.equal(earlyUnlocked.includes('hero_trial'), false);

  player.battles = 30;
  player.mapWins.treasure_cave = 1;
  const chained = availableMaps(player).map((map) => map.id);
  assert.equal(chained.includes('gold_palace'), true);
  assert.equal(chained.includes('adventurer_trial'), true);
  assert.equal(chained.includes('hero_trial'), true);
  assert.equal(chained.includes('legend_trial'), false);
});

test('hidden maps cannot be entered directly before discovery and do not leak names', () => {
  const player = createPlayer({ name: '封鎖勇者', element: '闇', archetype: 'ranger' });
  player.gold = 9999;
  const result = performBattle(player, 'upper_tower_gate', rngSequence([0.1]));
  assert.equal(result.result, 'blocked');
  assert.equal(result.player.gold, 9999);
  assert.equal(result.player.mapRuns.upper_tower_gate, undefined);
  assert.equal(result.messages.join('\n').includes('上塔之門'), false);
  assert.equal(result.messages.join('\n').includes('尚未發現'), true);
});

test('progressionGuide falls back when selected map is still hidden', () => {
  const player = createPlayer({ name: '指南勇者', element: '風', archetype: 'ranger' });
  const guide = progressionGuide(player, 'upper_tower_gate');
  assert.equal(guide.selectedMapId, 'meadow');
  assert.equal(guide.readiness.tone, 'safe');
  assert.equal(guide.suggestedMapId, 'meadow');
});

test('performBattle can win, grants rewards, and advances grassland quest', () => {
  const player = createPlayer({ name: '測試勇者', element: '火', archetype: 'blade' });
  const result = performBattle(player, 'meadow', rngSequence([0, 0, 0, 0.2, 0.99]));
  assert.equal(result.result, 'win');
  assert.equal(result.player.wins, 1);
  assert.equal(result.player.quest.progress, 1);
  assert.ok(result.player.exp > player.exp);
  assert.ok(result.player.gold > 0);
});

test('performBattle records map runs and bestiary on wins', () => {
  const player = createPlayer({ name: '圖鑑勇者', element: '火', archetype: 'blade' });
  const result = performBattle(player, 'meadow', rngSequence([0, 0, 0, 0.2, 0.99]));
  assert.equal(result.result, 'win');
  assert.equal(result.player.mapRuns.meadow, 1);
  const entries = bestiaryEntries(result.player);
  assert.equal(entries.length, 1);
  assert.equal(entries[0].name, '草原鼠');
  assert.equal(entries[0].count, 1);
});

test('milestones can be claimed once and grant simple rewards', () => {
  let player = createPlayer({ name: '目標勇者', element: '光', archetype: 'blade' });
  player.battles = 1;
  const firstBattle = milestonesFor(player).find((milestone) => milestone.id === 'first_battle');
  assert.equal(firstBattle.complete, true);
  assert.equal(firstBattle.claimed, false);
  player = claimMilestone(player, 'first_battle');
  assert.equal(player.milestonesClaimed.includes('first_battle'), true);
  assert.equal(player.inventory.includes('herb'), true);
  const goldAfterClaim = player.gold;
  player = claimMilestone(player, 'first_battle');
  assert.equal(player.gold, goldAfterClaim);
});

test('progressionGuide gives next action and map readiness without extra complexity', () => {
  const player = createPlayer({ name: '指南勇者', element: '風', archetype: 'ranger' });
  const guide = progressionGuide(player, 'meadow');
  assert.equal(guide.suggestedMapId, 'meadow');
  assert.equal(guide.readiness.tone, 'safe');
  assert.ok(guide.nextAction.includes('草原討伐'));
  player.hp = 10;
  assert.ok(progressionGuide(player, 'meadow').nextAction.includes('HP / MP'));
});

test('parsePlayer migrates old saves with progression defaults', () => {
  const parsed = parsePlayer(JSON.stringify({
    name: '舊存檔',
    element: '星',
    level: 1,
    inventory: ['novice_badge']
  }));
  assert.deepEqual(parsed.milestonesClaimed, []);
  assert.deepEqual(parsed.bestiary, {});
  assert.deepEqual(parsed.mapRuns, {});
  assert.deepEqual(parsed.mapWins, {});
  assert.deepEqual(parsed.careerWins, {});
  assert.deepEqual(parsed.careerBattles, {});
  assert.deepEqual(parsed.careerFlags, { lowHpWins: 0, lowMpWins: 0, highRiskWins: 0 });
  assert.equal(parsed.jobId, 'blade');
  assert.equal(parsed.job, '劍士');
  assert.equal(parsed.equipment.weapon, null);
});

test('createBattleEncounter builds turn-by-turn page data with probabilistic skills', () => {
  const player = createPlayer({ name: '演出勇者', element: '雷', archetype: 'blade' });
  player.attack = 22;
  player.maxHp = 220;
  player.hp = 220;
  player.maxMp = 80;
  player.mp = 80;
  player.gold = 999;
  const encounter = createBattleEncounter(player, 'meadow', rngSequence([0, 0.1, 0.9, 0.1, 0.1, 0.1, 0.2, 0.1]));
  assert.ok(encounter.scene.turns.some((turn) => turn.side === 'player'));
  assert.ok(encounter.scene.turns.some((turn) => turn.side === 'monster'));
  assert.ok(encounter.scene.turns.some((turn) => ['快速打擊', '斬擊', '破強劍', '彗星斬', '雷擊劍', '強烈攻擊', '猛毒斬', '初級必殺', '魅惑'].includes(turn.skill)));
  assert.ok(encounter.scene.turns.some((turn) => turn.text.includes('戰鬥結束')));
  assert.equal(encounter.player.battles, player.battles + 1);
});

test('performBattle blocks maps when gold is insufficient before charging cost', () => {
  const player = createPlayer({ name: '窮豆勇者', element: '星', archetype: 'ranger' });
  player.gold = 0;
  const result = performBattle(player, 'tower', rngSequence([0.1]));
  assert.equal(result.result, 'blocked');
  assert.equal(result.player.gold, 0);
});

test('buyItem and equipItem update inventory and total stats', () => {
  let player = createPlayer({ name: '裝備勇者', element: '雷', archetype: 'blade' });
  player.gold = 999;
  player = buyItem(player, 'short_sword');
  player = equipItem(player, 'short_sword');
  assert.equal(player.equipment.weapon, 'short_sword');
  assert.ok(totalStats(player).attack > player.attack);
});

test('restAtInn restores hp and consumes gold', () => {
  const player = createPlayer({ name: '旅店勇者', element: '水', archetype: 'sage' });
  player.hp = 10;
  const rested = restAtInn(player);
  assert.equal(rested.hp, rested.maxHp);
  assert.ok(rested.gold < player.gold);
});

test('claimQuestReward only rewards after progress reaches target', () => {
  const player = createPlayer({ name: '任務勇者', element: '風', archetype: 'ranger' });
  player.quest.progress = player.quest.target;
  const rewarded = claimQuestReward(player);
  assert.equal(rewarded.quest.completed, true);
  assert.ok(rewarded.gold > player.gold);
});

test('serializePlayer and parsePlayer round-trip a valid save', () => {
  const player = createPlayer({ name: '存檔勇者', element: '闇', archetype: 'blade' });
  const parsed = parsePlayer(serializePlayer(player));
  assert.equal(parsed.name, player.name);
  assert.equal(parsed.element, player.element);
});
