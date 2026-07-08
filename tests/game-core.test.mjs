import assert from 'node:assert/strict';
import test from 'node:test';
import {
  buyItem,
  bestiaryEntries,
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
  const player = createPlayer({ name: '小豆勇者', element: '光', archetype: 'blade' });
  assert.equal(player.name, '小豆勇者');
  assert.equal(player.level, 1);
  assert.equal(player.hp, player.maxHp);
  assert.equal(player.inventory.includes('novice_badge'), true);
  assert.deepEqual(player.milestonesClaimed, []);
  assert.deepEqual(player.bestiary, {});
  assert.deepEqual(player.mapRuns, {});
});

test('portrait helpers resolve local character and monster sprites', () => {
  const player = createPlayer({ name: '圖像勇者', element: '光', archetype: 'sage' });
  assert.match(portraitForPlayer(player), /sprites\/heroes\/sage\.svg$/);
  assert.match(portraitForMonster('跳跳史萊姆'), /sprites\/monsters\/slime\.svg$/);
  const encounter = createBattleEncounter(player, 'meadow', rngSequence([0, 0.1, 0.9]));
  assert.match(encounter.scene.monster.portrait, /sprites\/monsters\/.+\.svg$/);
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
  assert.equal(progressionGuide(player, 'upper_tower_gate').readiness.tone, 'danger');
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
