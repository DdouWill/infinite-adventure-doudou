const LOCAL_ACCOUNTS_KEY = 'infinite-adventure-doudou-local-accounts-v1';
const ACCOUNT_PATTERN = /^[A-Za-z0-9_]{4,8}$/;
const PASSWORD_PATTERN = /^[A-Za-z0-9_]{4,8}$/;

export function hasLocalAccount(storage, account) {
  const accountId = normalizeAccount(account);
  const registry = loadRegistry(storage);
  return Boolean(registry.accounts[accountId]);
}

export async function registerLocalAccount(storage, account, password, cryptoImpl = globalThis.crypto) {
  const accountId = normalizeAccount(account);
  validatePassword(password);
  const registry = loadRegistry(storage);
  if (registry.accounts[accountId]) throw new Error('這個本機帳號已存在。');
  const saltBytes = new Uint8Array(16);
  cryptoImpl.getRandomValues(saltBytes);
  const salt = bytesToHex(saltBytes);
  const digest = await passwordDigest(salt, password, cryptoImpl);
  registry.accounts[accountId] = { salt, digest, createdAt: new Date().toISOString() };
  storage.setItem(LOCAL_ACCOUNTS_KEY, JSON.stringify(registry));
  return accountId;
}

export async function verifyLocalAccount(storage, account, password, cryptoImpl = globalThis.crypto) {
  const accountId = normalizeAccount(account);
  validatePassword(password);
  const record = loadRegistry(storage).accounts[accountId];
  if (!record) return false;
  if (!/^[0-9a-f]{32}$/.test(record.salt) || !/^[0-9a-f]{64}$/.test(record.digest)) {
    throw new Error('本機帳號資料已損壞。');
  }
  return (await passwordDigest(record.salt, password, cryptoImpl)) === record.digest;
}

function loadRegistry(storage) {
  const raw = storage.getItem(LOCAL_ACCOUNTS_KEY);
  if (!raw) return { version: 1, accounts: {} };
  try {
    const parsed = JSON.parse(raw);
    if (parsed?.version !== 1 || !parsed.accounts || typeof parsed.accounts !== 'object' || Array.isArray(parsed.accounts)) {
      throw new Error('invalid registry');
    }
    return parsed;
  } catch {
    throw new Error('本機帳號清單已損壞。');
  }
}

function normalizeAccount(account) {
  const value = String(account || '').trim();
  if (!ACCOUNT_PATTERN.test(value)) throw new Error('帳號格式不符。');
  return value.toLowerCase();
}

function validatePassword(password) {
  if (!PASSWORD_PATTERN.test(String(password || ''))) throw new Error('密碼格式不符。');
}

async function passwordDigest(salt, password, cryptoImpl) {
  if (!cryptoImpl?.subtle || !cryptoImpl?.getRandomValues) throw new Error('瀏覽器不支援本機帳號加密。');
  const bytes = new TextEncoder().encode(`${salt}:${password}`);
  return bytesToHex(new Uint8Array(await cryptoImpl.subtle.digest('SHA-256', bytes)));
}

function bytesToHex(bytes) {
  return Array.from(bytes, (byte) => byte.toString(16).padStart(2, '0')).join('');
}
