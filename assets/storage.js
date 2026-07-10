import { parsePlayer, serializePlayer } from './game-core.js';

export const LEGACY_PLAYER_STORAGE_KEY = 'infinite-adventure-doudou-save-v1';
const PLAYER_STORAGE_PREFIX = 'infinite-adventure-doudou-save-v3:';
const BACKUP_SUFFIX = ':backup';

export function playerStorageKey(session) {
  const account = String(session?.account || '').trim().toLowerCase();
  const rawSource = String(session?.source || 'password').trim().toLowerCase();
  const source = rawSource === 'google-oauth' ? 'google' : 'local';
  if (!account) throw new Error('缺少登入身份，無法存取角色存檔。');
  return `${PLAYER_STORAGE_PREFIX}${encodeURIComponent(source)}:${encodeURIComponent(account)}`;
}

export function savePlayerForSession(storage, session, player) {
  const key = playerStorageKey(session);
  const backupKey = `${key}${BACKUP_SUFFIX}`;
  const previous = storage.getItem(key);
  if (previous !== null) {
    try {
      parsePlayer(previous);
      storage.setItem(backupKey, previous);
    } catch {
      // Do not replace a known-good backup with corrupt data.
    }
  }
  storage.setItem(key, serializePlayer(player));
  return key;
}

export function loadPlayerForSession(storage, session) {
  if (!session?.account) return { player: null, warning: '' };
  const key = playerStorageKey(session);
  const primary = storage.getItem(key);
  if (primary !== null) {
    try {
      return { player: parsePlayer(primary), warning: '' };
    } catch {
      const recovered = recoverBackup(storage, key);
      if (recovered) return recovered;
      return {
        player: null,
        corruptRaw: primary,
        warning: '目前身份的角色存檔已損壞，請先匯出原始內容、修復匯入或明確捨棄。'
      };
    }
  }

  const legacy = storage.getItem(LEGACY_PLAYER_STORAGE_KEY);
  if (legacy === null) return { player: null, warning: '' };
  try {
    const player = parsePlayer(legacy);
    savePlayerForSession(storage, session, player);
    storage.removeItem(LEGACY_PLAYER_STORAGE_KEY);
    return { player, migrated: true, warning: '已將舊版共用存檔移轉到目前身份。' };
  } catch {
    return {
      player: null,
      corruptRaw: legacy,
      corruptSource: 'legacy',
      warning: '舊版角色存檔已損壞，請先匯出原始內容、修復匯入或明確捨棄。'
    };
  }
}

export function clearPlayerForSession(storage, session) {
  const key = playerStorageKey(session);
  storage.removeItem(key);
  storage.removeItem(`${key}${BACKUP_SUFFIX}`);
}

export function clearPlayerRecoveryForSession(storage, session, source = 'scoped') {
  if (source === 'legacy') {
    storage.removeItem(LEGACY_PLAYER_STORAGE_KEY);
    return;
  }
  clearPlayerForSession(storage, session);
}

function recoverBackup(storage, key) {
  const backup = storage.getItem(`${key}${BACKUP_SUFFIX}`);
  if (backup === null) return null;
  try {
    const player = parsePlayer(backup);
    try {
      storage.setItem(key, backup);
    } catch {
      // The parsed backup can still be used for this session when storage is read-only.
    }
    return { player, recovered: true, warning: '主要存檔損壞，已恢復上一份有效備份。' };
  } catch {
    return null;
  }
}
