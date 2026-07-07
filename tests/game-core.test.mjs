import assert from 'node:assert/strict';
import test from 'node:test';
import {
  buyItem,
  claimQuestReward,
  createPlayer,
  equipItem,
  parsePlayer,
  performBattle,
  restAtInn,
  serializePlayer,
  totalStats
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
  player = buyItem(player, 'wood_sword');
  player = equipItem(player, 'wood_sword');
  assert.equal(player.equipment.weapon, 'wood_sword');
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
