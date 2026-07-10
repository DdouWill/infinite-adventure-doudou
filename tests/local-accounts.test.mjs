import assert from 'node:assert/strict';
import test from 'node:test';
import {
  hasLocalAccount,
  registerLocalAccount,
  verifyLocalAccount
} from '../assets/local-accounts.js';

class MemoryStorage {
  #data = new Map();

  getItem(key) {
    return this.#data.has(key) ? this.#data.get(key) : null;
  }

  setItem(key, value) {
    this.#data.set(key, String(value));
  }
}

test('local account registration stores a salted digest instead of plaintext password', async () => {
  const storage = new MemoryStorage();
  await registerLocalAccount(storage, 'Hero01', 'pass01');

  assert.equal(hasLocalAccount(storage, 'hero01'), true);
  assert.equal(await verifyLocalAccount(storage, 'HERO01', 'pass01'), true);
  assert.equal(await verifyLocalAccount(storage, 'hero01', 'wrong1'), false);
  assert.equal(await verifyLocalAccount(storage, 'other1', 'pass01'), false);

  const raw = storage.getItem('infinite-adventure-doudou-local-accounts-v1');
  assert.equal(raw.includes('pass01'), false);
  const record = JSON.parse(raw).accounts.hero01;
  assert.match(record.salt, /^[0-9a-f]{32}$/);
  assert.match(record.digest, /^[0-9a-f]{64}$/);
});

test('local account registration rejects duplicate canonical account IDs', async () => {
  const storage = new MemoryStorage();
  await registerLocalAccount(storage, 'Hero01', 'pass01');

  await assert.rejects(
    registerLocalAccount(storage, 'hero01', 'pass02'),
    /已存在/
  );
});
