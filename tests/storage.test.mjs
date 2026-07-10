import assert from 'node:assert/strict';
import test from 'node:test';
import { createPlayer, serializePlayer } from '../assets/game-core.js';
import {
  LEGACY_PLAYER_STORAGE_KEY,
  clearPlayerForSession,
  loadPlayerForSession,
  playerStorageKey,
  savePlayerForSession
} from '../assets/storage.js';

class MemoryStorage {
  #values = new Map();

  getItem(key) {
    return this.#values.has(key) ? this.#values.get(key) : null;
  }

  setItem(key, value) {
    this.#values.set(key, String(value));
  }

  removeItem(key) {
    this.#values.delete(key);
  }
}

function player(name) {
  return createPlayer({ name, element: '光', archetype: 'blade' });
}

test('player storage keys isolate accounts and share one namespace for local login paths', () => {
  assert.notEqual(
    playerStorageKey({ account: 'first01', source: 'password' }),
    playerStorageKey({ account: 'other01', source: 'password' })
  );
  assert.equal(
    playerStorageKey({ account: 'first01', source: 'password' }),
    playerStorageKey({ account: 'first01', source: 'local-register' })
  );
  assert.notEqual(
    playerStorageKey({ account: 'first01', source: 'password' }),
    playerStorageKey({ account: 'first01', source: 'google-oauth' })
  );
});

test('different login sessions save and load independent players', () => {
  const storage = new MemoryStorage();
  const first = { account: 'first01', source: 'password' };
  const other = { account: 'other01', source: 'password' };

  savePlayerForSession(storage, first, player('第一勇者'));
  savePlayerForSession(storage, other, player('第二勇者'));

  assert.equal(loadPlayerForSession(storage, first).player.name, '第一勇者');
  assert.equal(loadPlayerForSession(storage, other).player.name, '第二勇者');
  clearPlayerForSession(storage, first);
  assert.equal(loadPlayerForSession(storage, first).player, null);
  assert.equal(loadPlayerForSession(storage, other).player.name, '第二勇者');
});

test('legacy global save migrates once into the active account namespace', () => {
  const storage = new MemoryStorage();
  const session = { account: 'legacy01', source: 'password' };
  storage.setItem(LEGACY_PLAYER_STORAGE_KEY, serializePlayer(player('舊存檔勇者')));

  const loaded = loadPlayerForSession(storage, session);

  assert.equal(loaded.player.name, '舊存檔勇者');
  assert.equal(loaded.migrated, true);
  assert.equal(storage.getItem(LEGACY_PLAYER_STORAGE_KEY), null);
  assert.ok(storage.getItem(playerStorageKey(session)));
});

test('corrupt primary save recovers the last known good backup', () => {
  const storage = new MemoryStorage();
  const session = { account: 'backup01', source: 'password' };
  savePlayerForSession(storage, session, player('備份勇者'));
  const updated = player('更新勇者');
  savePlayerForSession(storage, session, updated);
  storage.setItem(playerStorageKey(session), '{broken');

  const loaded = loadPlayerForSession(storage, session);

  assert.equal(loaded.player.name, '備份勇者');
  assert.equal(loaded.recovered, true);
  assert.match(loaded.warning, /備份/);
});
