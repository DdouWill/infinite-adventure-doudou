import { createRequire } from 'node:module';

const require = createRequire(import.meta.url);
const { chromium } = require('playwright');

const url = withBattleDelay(process.env.SMOKE_URL || 'http://127.0.0.1:4173');
const screenshotsDir = process.env.SMOKE_SCREENSHOTS || 'screenshots';
const ACTIVE_PLAYERS_KEY = 'infinite-adventure-doudou-active-players-v1';

function withBattleDelay(rawUrl) {
  const nextUrl = new URL(rawUrl);
  if (!nextUrl.searchParams.has('battleDelayMs')) nextUrl.searchParams.set('battleDelayMs', '120');
  if (!nextUrl.searchParams.has('battleSeed')) nextUrl.searchParams.set('battleSeed', 'turn-skill-showcase');
  return nextUrl.toString();
}

async function assertTerminalLoginGate(page, label, options = {}) {
  const loginVisible = await page.locator('#login-view').isVisible();
  if (!loginVisible) throw new Error(`${label} smoke failed: login view should be visible before entering game.`);
  const appVisible = await page.locator('.app-shell').isVisible();
  if (appVisible) throw new Error(`${label} smoke failed: game shell should be hidden before login.`);
  const createVisible = await page.locator('#create-view').isVisible();
  if (createVisible) throw new Error(`${label} smoke failed: character creation should not be visible before login.`);
  const loginText = await page.locator('#login-view').innerText();
  for (const expected of ['AUTH_GATE', '帳號', '密碼', '登入遊戲', '帳號註冊', '系統公告', '伺服器狀態']) {
    if (!loginText.includes(expected)) throw new Error(`${label} smoke failed: terminal login block missing ${expected}.`);
  }
  const onlineListText = await page.locator('#login-online-list').innerText();
  for (const expected of ['本機遊玩帳號', 'LOCAL']) {
    if (!onlineListText.includes(expected)) throw new Error(`${label} smoke failed: login local player list missing ${expected}.`);
  }
  for (const forbidden of ['晨星勇者', '光紋術士', '星砂貓', '星門守衛', '封印調查員']) {
    if (onlineListText.includes(forbidden)) throw new Error(`${label} smoke failed: login list must not show fabricated account ${forbidden}.`);
  }
  const expectedAccounts = options.expectedAccounts || [];
  if (expectedAccounts.length === 0 && !onlineListText.includes('尚無本機遊玩帳號')) {
    throw new Error(`${label} smoke failed: empty local account list should say there are no real played accounts.`);
  }
  for (const expectedAccount of expectedAccounts) {
    if (!onlineListText.includes(expectedAccount)) throw new Error(`${label} smoke failed: local account list missing actual account ${expectedAccount}.`);
  }
  const renderedAccountCount = await page.locator('#login-online-names li:not(.terminal-login__online-empty)').count();
  if (renderedAccountCount !== expectedAccounts.length) {
    throw new Error(`${label} smoke failed: local account count mismatch ${renderedAccountCount}/${expectedAccounts.length}.`);
  }
  const onlineListLayout = await page.evaluate(() => {
    const header = document.querySelector('.terminal-login__header')?.getBoundingClientRect();
    const online = document.querySelector('#login-online-list')?.getBoundingClientRect();
    const grid = document.querySelector('.terminal-login__grid')?.getBoundingClientRect();
    return header && online && grid ? { headerBottom: header.bottom, onlineTop: online.top, onlineBottom: online.bottom, gridTop: grid.top } : null;
  });
  if (!onlineListLayout || onlineListLayout.onlineTop < onlineListLayout.headerBottom || onlineListLayout.onlineBottom > onlineListLayout.gridTop) {
    throw new Error(`${label} smoke failed: login online list should sit between title block and login grid ${JSON.stringify(onlineListLayout)}.`);
  }
  const registerModalHidden = await page.locator('#register-modal').evaluate((el) => el.hidden && el.classList.contains('is-hidden'));
  if (!registerModalHidden) throw new Error(`${label} smoke failed: registration should be hidden in a modal before clicking register.`);
  const registerModalCopy = await page.locator('#register-modal').textContent();
  for (const expected of ['自行建立', 'Google 帳號授權']) {
    if (!registerModalCopy.includes(expected)) throw new Error(`${label} smoke failed: registration modal missing ${expected}.`);
  }
  const manualGoogleInputCount = await page.locator('#google-email, #google-name').count();
  if (manualGoogleInputCount !== 0) throw new Error(`${label} smoke failed: Google auth must not require manually typed account fields.`);
  const googleButtonText = await page.locator('#google-oauth-button').innerText();
  if (!googleButtonText.includes('Google 授權')) throw new Error(`${label} smoke failed: Google OAuth button missing.`);
  const forbiddenText = ['BadGameShow', '註冊帳號', '原版', '注意事項'];
  for (const forbidden of forbiddenText) {
    if (loginText.includes(forbidden)) throw new Error(`${label} smoke failed: copied/original login text leaked (${forbidden}).`);
  }
  const forbiddenAssets = await page.locator('#login-view img').evaluateAll((imgs) => imgs.map((img) => img.getAttribute('src') || '').filter((src) => src.includes('/assets/original/ui/') || src.includes('badgameshow')));
  if (forbiddenAssets.length) throw new Error(`${label} smoke failed: copied login assets leaked ${forbiddenAssets.join(',')}.`);
  const keyartSrc = await page.locator('#login-keyart').getAttribute('src');
  if (!keyartSrc?.includes('/assets/generated/login-terminal-keyart.webp')) throw new Error(`${label} smoke failed: optimized terminal key art missing (${keyartSrc}).`);
  const loginPanelStyle = await page.locator('.terminal-login__panel--main').evaluate((el) => {
    const style = getComputedStyle(el);
    return { color: style.color, backgroundColor: style.backgroundColor, borderColor: style.borderColor, borderRadius: style.borderRadius, fontFamily: style.fontFamily };
  });
  if (loginPanelStyle.color !== 'rgb(245, 245, 245)' || loginPanelStyle.backgroundColor !== 'rgb(10, 10, 10)' || loginPanelStyle.borderColor !== 'rgb(255, 255, 255)' || loginPanelStyle.borderRadius !== '0px') {
    throw new Error(`${label} smoke failed: terminal login panel style missing ${JSON.stringify(loginPanelStyle)}.`);
  }
  if (!loginPanelStyle.fontFamily.toLowerCase().includes('mono') && !loginPanelStyle.fontFamily.toLowerCase().includes('consolas')) {
    throw new Error(`${label} smoke failed: terminal login monospace font missing ${loginPanelStyle.fontFamily}.`);
  }
}

async function loginThroughGate(page, account, password) {
  await page.fill('#login-id', account);
  await page.fill('#login-pass', password);
  await page.click('#login-submit');
  await page.waitForFunction(() => document.querySelector('#login-view')?.classList.contains('is-hidden'));
  const gameShellVisible = await page.locator('.app-shell').isVisible();
  if (!gameShellVisible) throw new Error('Login smoke failed: game shell should become visible after login.');
  const createViewVisible = await page.locator('#create-view').isVisible();
  if (!createViewVisible) throw new Error('Login smoke failed: character creation should be visible after login when no save exists.');
}

async function loginExistingThroughGate(page, account, password, expectedPlayerName) {
  await page.fill('#login-id', account);
  await page.fill('#login-pass', password);
  await page.click('#login-submit');
  await page.waitForFunction(() => document.querySelector('#login-view')?.classList.contains('is-hidden'));
  const title = await page.locator('#player-title').innerText();
  if (!title.includes(expectedPlayerName)) {
    throw new Error(`Login smoke failed: scoped player save missing after login (${title}).`);
  }
}

async function openRegisterModal(page, label) {
  await page.click('#register-toggle-button');
  await page.waitForFunction(() => !document.querySelector('#register-modal')?.hidden);
  const modalState = await page.locator('#register-modal').evaluate((el) => {
    const style = getComputedStyle(el);
    const dialogBox = el.querySelector('.terminal-modal__dialog')?.getBoundingClientRect();
    return { position: style.position, hidden: el.hidden, dialogTop: dialogBox?.top ?? null };
  });
  if (modalState.hidden || modalState.position !== 'fixed' || modalState.dialogTop === null) {
    throw new Error(`${label} smoke failed: register modal should float over the login page ${JSON.stringify(modalState)}.`);
  }
  const expanded = await page.locator('#register-toggle-button').getAttribute('aria-expanded');
  if (expanded !== 'true') throw new Error(`${label} smoke failed: register button aria-expanded not true after opening modal.`);
  const modalIsolation = await page.evaluate(() => ({
    loginFormInert: document.querySelector('#login-form')?.inert,
    sideInert: document.querySelector('.terminal-login__side')?.inert,
    scrollLocked: document.body.classList.contains('register-modal-active')
  }));
  if (!modalIsolation.loginFormInert || !modalIsolation.sideInert || !modalIsolation.scrollLocked) {
    throw new Error(`${label} smoke failed: register modal background is not isolated ${JSON.stringify(modalIsolation)}.`);
  }
  await page.evaluate(() => {
    const focusable = Array.from(document.querySelectorAll('#register-panel button:not([disabled]), #register-panel input:not([disabled]), #register-panel a[href]'))
      .filter((element) => element.getClientRects().length > 0);
    focusable.at(-1)?.focus();
  });
  await page.keyboard.press('Tab');
  const focusStayedInside = await page.evaluate(() => document.querySelector('#register-panel')?.contains(document.activeElement));
  if (!focusStayedInside) throw new Error(`${label} smoke failed: register modal focus escaped to the background.`);
}

async function closeRegisterModal(page, label) {
  await page.click('#register-modal-close');
  await page.waitForFunction(() => document.querySelector('#register-modal')?.hidden);
  const expanded = await page.locator('#register-toggle-button').getAttribute('aria-expanded');
  if (expanded !== 'false') throw new Error(`${label} smoke failed: register button aria-expanded not false after closing modal.`);
}

async function assertActivePlayers(page, expectedNames) {
  const activePlayers = await page.evaluate((key) => JSON.parse(localStorage.getItem(key) || '[]'), ACTIVE_PLAYERS_KEY);
  for (const expectedName of expectedNames) {
    if (!activePlayers.some((player) => player.displayName === expectedName || player.account === expectedName)) {
      throw new Error(`Active player smoke failed: missing actual player ${expectedName} in ${JSON.stringify(activePlayers)}.`);
    }
  }
}

async function seedActivePlayers(page, players) {
  await page.evaluate(({ key, players: seededPlayers }) => {
    localStorage.setItem(key, JSON.stringify(seededPlayers));
  }, { key: ACTIVE_PLAYERS_KEY, players });
  await page.reload({ waitUntil: 'networkidle' });
}

async function registerLocalThroughGate(page, account, password) {
  await openRegisterModal(page, 'Local register');
  await page.fill('#register-id', account);
  await page.fill('#register-pass', password);
  await page.fill('#register-pass-confirm', password);
  await page.click('#register-submit');
  await page.waitForFunction(() => document.querySelector('#login-view')?.classList.contains('is-hidden'));
  const session = await page.evaluate(() => JSON.parse(localStorage.getItem('infinite-adventure-doudou-login-v2')));
  if (session.source !== 'local-register' || session.account !== account) {
    throw new Error(`Register smoke failed: local registration session mismatch ${JSON.stringify(session)}.`);
  }
  const heroName = await page.locator('#hero-name').inputValue();
  if (heroName !== account) throw new Error(`Register smoke failed: local registration did not prefill hero name (${heroName}).`);
  await page.waitForFunction(() => document.activeElement?.id === 'hero-name');
  await assertActivePlayers(page, [account]);
}

async function authorizeGoogleThroughGate(page, email, displayName) {
  await page.evaluate(() => {
    document.querySelector('meta[name="google-oauth-client-id"]').content = 'smoke-google-client-id';
    window.google = {
      accounts: {
        oauth2: {
          initTokenClient(options) {
            window.__googleOAuthOptions = options;
            return {
              requestAccessToken() {
                options.callback({ access_token: 'smoke-access-token', scope: options.scope });
              }
            };
          }
        }
      }
    };
    window.fetch = async (url, options) => {
      window.__googleUserInfoRequest = { url: String(url), auth: options?.headers?.Authorization || '' };
      return {
        ok: true,
        json: async () => ({ email: 'adventurer@gmail.com', name: '星門旅人', picture: 'https://example.test/avatar.png' })
      };
    };
  });
  await openRegisterModal(page, 'Google OAuth register');
  await page.click('#google-oauth-button');
  await page.waitForFunction(() => document.querySelector('#login-view')?.classList.contains('is-hidden'));
  const session = await page.evaluate(() => JSON.parse(localStorage.getItem('infinite-adventure-doudou-login-v2')));
  if (session.source !== 'google-oauth' || session.account !== email || session.displayName !== displayName) {
    throw new Error(`Register smoke failed: Google OAuth session mismatch ${JSON.stringify(session)}.`);
  }
  const userInfoRequest = await page.evaluate(() => window.__googleUserInfoRequest);
  if (!userInfoRequest?.auth?.includes('smoke-access-token')) throw new Error(`Register smoke failed: Google OAuth userinfo request missing bearer token ${JSON.stringify(userInfoRequest)}.`);
  const heroName = await page.locator('#hero-name').inputValue();
  if (heroName !== displayName) throw new Error(`Register smoke failed: Google OAuth did not prefill hero name (${heroName}).`);
  await assertActivePlayers(page, [displayName]);
}

const browser = await chromium.launch({ headless: true });
const legacySessionProbe = await browser.newPage({ viewport: { width: 1024, height: 900 } });
await legacySessionProbe.addInitScript(() => {
  localStorage.setItem('infinite-adventure-doudou-login-v1', JSON.stringify({
    account: 'legacy1',
    source: 'password',
    loginAt: '2025-01-01T00:00:00.000Z'
  }));
  localStorage.setItem('infinite-adventure-doudou-save-v1', JSON.stringify({
    name: '舊共用角色',
    element: '火',
    job: '劍士',
    level: 1
  }));
});
await legacySessionProbe.goto(url, { waitUntil: 'networkidle' });
if (!(await legacySessionProbe.locator('#login-view').isVisible()) || (await legacySessionProbe.locator('#app-shell').isVisible())) {
  throw new Error('Legacy session smoke failed: an unverified v1 session bypassed the new login gate.');
}
const legacyMigrationState = await legacySessionProbe.evaluate(() => ({
  legacySessionPresent: localStorage.getItem('infinite-adventure-doudou-login-v1') !== null,
  legacySavePresent: localStorage.getItem('infinite-adventure-doudou-save-v1') !== null,
  scopedSavePresent: Object.keys(localStorage).some((key) => key.startsWith('infinite-adventure-doudou-save-v3:'))
}));
if (legacyMigrationState.legacySessionPresent || !legacyMigrationState.legacySavePresent || legacyMigrationState.scopedSavePresent) {
  throw new Error(`Legacy session smoke failed: shared save migrated under an unverified identity ${JSON.stringify(legacyMigrationState)}.`);
}
await legacySessionProbe.close();
const actualListProbe = await browser.newPage({ viewport: { width: 1024, height: 900 } });
await actualListProbe.goto(url, { waitUntil: 'networkidle' });
await assertTerminalLoginGate(actualListProbe, 'Empty actual local account list');
await seedActivePlayers(actualListProbe, [
  { account: 'play01', displayName: 'play01', source: 'password', lastSeenAt: '2026-07-08T00:00:00.000Z' },
  { account: 'oauth@example.com', displayName: '星門旅人', source: 'google-oauth', lastSeenAt: '2026-07-08T00:01:00.000Z' }
]);
await assertTerminalLoginGate(actualListProbe, 'Seeded actual local account list', { expectedAccounts: ['play01', '星門旅人'] });
await actualListProbe.screenshot({ path: `${screenshotsDir}/desktop-login-actual-accounts.png`, fullPage: true });
await actualListProbe.close();
const localRegisterProbe = await browser.newPage({ viewport: { width: 1024, height: 900 } });
await localRegisterProbe.goto(url, { waitUntil: 'networkidle' });
await assertTerminalLoginGate(localRegisterProbe, 'Local register');
await registerLocalThroughGate(localRegisterProbe, 'newhero', 'pass02');
await localRegisterProbe.close();
const corruptSaveProbe = await browser.newPage({ viewport: { width: 1024, height: 900 } });
await corruptSaveProbe.goto(url, { waitUntil: 'networkidle' });
await registerLocalThroughGate(corruptSaveProbe, 'broken1', 'pass01');
const corruptSaveRaw = '{"name":"尚未修完"';
const corruptSaveKey = await corruptSaveProbe.evaluate((raw) => {
  const session = JSON.parse(localStorage.getItem('infinite-adventure-doudou-login-v2'));
  const key = `infinite-adventure-doudou-save-v3:local:${encodeURIComponent(session.account.toLowerCase())}`;
  localStorage.setItem(key, raw);
  return key;
}, corruptSaveRaw);
await corruptSaveProbe.reload({ waitUntil: 'networkidle' });
if (!(await corruptSaveProbe.locator('#save-recovery').isVisible()) || (await corruptSaveProbe.locator('#create-form').isVisible())) {
  throw new Error('Corrupt save smoke failed: recovery UI was not shown exclusively before character creation.');
}
if ((await corruptSaveProbe.locator('#save-recovery-data').inputValue()) !== corruptSaveRaw) {
  throw new Error('Corrupt save smoke failed: raw save was not exposed for backup and repair.');
}
await corruptSaveProbe.waitForFunction(() => document.activeElement?.id === 'save-recovery-data');
await corruptSaveProbe.screenshot({ path: `${screenshotsDir}/desktop-save-recovery.png`, fullPage: true });
await corruptSaveProbe.click('#save-recovery-import');
await corruptSaveProbe.waitForFunction(() => document.querySelector('#save-recovery-status')?.textContent.includes('修復匯入失敗'));
const rawBeforeDiscard = await corruptSaveProbe.evaluate((key) => localStorage.getItem(key), corruptSaveKey);
if (rawBeforeDiscard !== corruptSaveRaw) throw new Error('Corrupt save smoke failed: raw save changed before explicit discard.');
corruptSaveProbe.once('dialog', (dialog) => dialog.accept());
await corruptSaveProbe.click('#save-recovery-discard');
if (!(await corruptSaveProbe.locator('#create-form').isVisible()) || (await corruptSaveProbe.locator('#save-recovery').isVisible())) {
  throw new Error('Corrupt save smoke failed: explicit discard did not return to character creation.');
}
if (await corruptSaveProbe.evaluate((key) => localStorage.getItem(key), corruptSaveKey)) {
  throw new Error('Corrupt save smoke failed: explicit discard did not clear the corrupt save.');
}
await corruptSaveProbe.close();
const corruptLegacyProbe = await browser.newPage({ viewport: { width: 1024, height: 900 } });
await corruptLegacyProbe.goto(url, { waitUntil: 'networkidle' });
await registerLocalThroughGate(corruptLegacyProbe, 'legacy2', 'pass01');
const corruptLegacyRaw = '{"name":"舊檔未修完"';
await corruptLegacyProbe.evaluate((raw) => localStorage.setItem('infinite-adventure-doudou-save-v1', raw), corruptLegacyRaw);
await corruptLegacyProbe.reload({ waitUntil: 'networkidle' });
if (!(await corruptLegacyProbe.locator('#save-recovery').isVisible())
  || (await corruptLegacyProbe.locator('#save-recovery-data').inputValue()) !== corruptLegacyRaw) {
  throw new Error('Legacy recovery smoke failed: corrupt legacy raw was not exposed for repair.');
}
corruptLegacyProbe.once('dialog', (dialog) => dialog.accept());
await corruptLegacyProbe.click('#save-recovery-discard');
if (await corruptLegacyProbe.evaluate(() => localStorage.getItem('infinite-adventure-doudou-save-v1'))) {
  throw new Error('Legacy recovery smoke failed: explicit discard did not remove the corrupt legacy save.');
}
await corruptLegacyProbe.reload({ waitUntil: 'networkidle' });
if (!(await corruptLegacyProbe.locator('#create-form').isVisible()) || (await corruptLegacyProbe.locator('#save-recovery').isVisible())) {
  throw new Error('Legacy recovery smoke failed: discarded legacy save returned after reload.');
}
await corruptLegacyProbe.close();
const googleRegisterProbe = await browser.newPage({ viewport: { width: 1024, height: 900 } });
await googleRegisterProbe.goto(url, { waitUntil: 'networkidle' });
await assertTerminalLoginGate(googleRegisterProbe, 'Google OAuth register');
await authorizeGoogleThroughGate(googleRegisterProbe, 'adventurer@gmail.com', '星門旅人');
await googleRegisterProbe.close();
const battleReloadUrl = new URL(url);
battleReloadUrl.searchParams.set('battleDelayMs', '1000');
const battleReloadProbe = await browser.newPage({ viewport: { width: 1024, height: 900 } });
await battleReloadProbe.goto(battleReloadUrl.toString(), { waitUntil: 'networkidle' });
await registerLocalThroughGate(battleReloadProbe, 'reload1', 'pass01');
await battleReloadProbe.fill('#hero-name', '重載測試員');
await battleReloadProbe.selectOption('#hero-element', '火');
await battleReloadProbe.selectOption('#hero-archetype', 'blade');
await battleReloadProbe.click('button:has-text("建立角色")');
await battleReloadProbe.click('#battle-button');
const committedBattleCount = await battleReloadProbe.evaluate(() => {
  const key = Object.keys(localStorage).find((name) => name.startsWith('infinite-adventure-doudou-save-v3:'));
  return key ? JSON.parse(localStorage.getItem(key)).battles : null;
});
if (committedBattleCount !== 1) throw new Error(`Battle persistence smoke failed: result was not committed before animation (${committedBattleCount}).`);
await battleReloadProbe.reload({ waitUntil: 'networkidle' });
const reloadedBattleCount = await battleReloadProbe.evaluate(() => {
  const key = Object.keys(localStorage).find((name) => name.startsWith('infinite-adventure-doudou-save-v3:'));
  return key ? JSON.parse(localStorage.getItem(key)).battles : null;
});
if (reloadedBattleCount !== 1 || !(await battleReloadProbe.locator('#game-view').isVisible())) {
  throw new Error(`Battle persistence smoke failed: reload lost the committed result (${reloadedBattleCount}).`);
}
await battleReloadProbe.close();
const desktop = await browser.newPage({ viewport: { width: 1280, height: 900 } });
await desktop.goto(url, { waitUntil: 'networkidle' });
await assertTerminalLoginGate(desktop, 'Desktop');
await desktop.screenshot({ path: `${screenshotsDir}/desktop-login.png`, fullPage: true });
await openRegisterModal(desktop, 'Desktop register screenshot');
await desktop.screenshot({ path: `${screenshotsDir}/desktop-register-modal.png` });
await closeRegisterModal(desktop, 'Desktop register screenshot');
await registerLocalThroughGate(desktop, 'test01', 'pass01');
const terminalTheme = await desktop.evaluate(() => {
  const body = getComputedStyle(document.body);
  const panel = getComputedStyle(document.querySelector('.game-card'));
  const button = getComputedStyle(document.querySelector('.primary-action'));
  const badge = document.querySelector('.hero__badge')?.textContent || '';
  return {
    fontFamily: body.fontFamily,
    color: body.color,
    backgroundColor: body.backgroundColor,
    panelRadius: panel.borderRadius,
    panelBorderColor: panel.borderColor,
    buttonRadius: button.borderRadius,
    buttonBackground: button.backgroundColor,
    badge
  };
});
if (!terminalTheme.fontFamily.toLowerCase().includes('mono') && !terminalTheme.fontFamily.toLowerCase().includes('consolas')) {
  throw new Error(`Desktop smoke failed: terminal monospace font not applied (${terminalTheme.fontFamily}).`);
}
if (terminalTheme.color !== 'rgb(245, 245, 245)' || terminalTheme.backgroundColor !== 'rgb(10, 10, 10)') {
  throw new Error('Desktop smoke failed: black/white terminal colors not applied.');
}
if (terminalTheme.panelRadius !== '0px' || terminalTheme.buttonRadius !== '0px') {
  throw new Error('Desktop smoke failed: terminal zero-radius style not applied.');
}
if (!terminalTheme.badge.includes('~$')) throw new Error('Desktop smoke failed: ASCII terminal logo missing.');
const menuButtonBox = await desktop.locator('#function-menu-button').boundingBox();
if (!menuButtonBox || Math.abs((menuButtonBox.x + menuButtonBox.width) - 1266) > 3 || menuButtonBox.y > 30) {
  throw new Error('Desktop smoke failed: function menu button is not fixed at the top-right.');
}
const menuHiddenBefore = await desktop.locator('#function-menu-panel').evaluate((el) => el.hidden);
if (!menuHiddenBefore) throw new Error('Desktop smoke failed: function menu should be hidden by default.');
await desktop.click('#function-menu-button');
const expanded = await desktop.locator('#function-menu-button').getAttribute('aria-expanded');
if (expanded !== 'true') throw new Error('Desktop smoke failed: function menu aria-expanded not true after click.');
const menuText = await desktop.locator('#function-menu-panel').innerText();
if (!menuText.includes('情報') || !menuText.includes('解說') || !menuText.includes('最新情報') || !menuText.includes('遊戲說明')) {
  throw new Error('Desktop smoke failed: function menu does not contain info/explanation items.');
}
const menuIconCount = await desktop.locator('#function-menu-panel .function-menu__item summary .ui-icon').count();
if (menuIconCount < 16) throw new Error(`Desktop smoke failed: function menu icon layer incomplete (${menuIconCount}).`);
const menuIconStyle = await desktop.locator('#function-menu-panel .function-menu__item summary .ui-icon').first().evaluate((el) => {
  const style = getComputedStyle(el);
  return { display: style.display, borderTopWidth: style.borderTopWidth, color: style.color };
});
if (menuIconStyle.display !== 'grid' || menuIconStyle.borderTopWidth !== '1px') {
  throw new Error(`Desktop smoke failed: terminal menu icon style missing ${JSON.stringify(menuIconStyle)}.`);
}
await desktop.locator('#player-list-panel summary').click();
const actualPlayerPanelText = await desktop.locator('#player-list-panel').innerText();
if (!actualPlayerPanelText.includes('test01')) throw new Error('Desktop smoke failed: player-list menu should show the actual logged-in account.');
for (const forbidden of ['晨星勇者', '光紋術士', '星砂貓', '星門守衛']) {
  if (actualPlayerPanelText.includes(forbidden)) throw new Error(`Desktop smoke failed: player-list menu leaked fabricated account ${forbidden}.`);
}
await desktop.locator('#guide-panel summary').click();
const openedGuideText = await desktop.locator('#guide-panel').innerText();
if (!openedGuideText.includes('森林') || !openedGuideText.includes('高塔')) {
  throw new Error('Desktop smoke failed: guide content should live inside the function menu without hidden-map leaks.');
}
await desktop.locator('#ranking-panel summary').click();
const rankingText = await desktop.locator('#ranking-panel').innerText();
for (const expected of ['頭像', 'HP', 'MP', '戰數', '打寶之王']) {
  if (!rankingText.includes(expected)) throw new Error(`Desktop smoke failed: reference ranking table missing ${expected}.`);
}
const referenceCatalogCounts = await desktop.evaluate(() => ({
  weapons: document.querySelectorAll('#reference-weapon-catalog tbody tr').length,
  items: document.querySelectorAll('#reference-item-catalog tbody tr').length,
  techniques: document.querySelectorAll('#reference-technique-catalog tbody tr').length,
  ougis: document.querySelectorAll('#reference-ougi-catalog tbody tr').length,
  maps: document.querySelectorAll('#reference-map-catalog tbody tr').length
}));
if (referenceCatalogCounts.weapons < 100 || referenceCatalogCounts.items < 60 || referenceCatalogCounts.techniques < 150 || referenceCatalogCounts.ougis < 150 || referenceCatalogCounts.maps !== 9) {
  throw new Error(`Desktop smoke failed: original reference catalogs or visible map catalog incomplete ${JSON.stringify(referenceCatalogCounts)}.`);
}
await desktop.locator('#icon-panel summary').click();
const iconCellCount = await desktop.locator('#icon-panel .icon-grid__cell').count();
if (iconCellCount !== 70) throw new Error(`Desktop smoke failed: icon grid should contain 70 cells, got ${iconCellCount}.`);
const iconImageCount = await desktop.locator('#icon-panel .icon-grid__image').count();
if (iconImageCount !== 70) throw new Error(`Desktop smoke failed: icon grid should use 70 original character GIFs, got ${iconImageCount}.`);
const firstIconSrc = await desktop.locator('#icon-panel .icon-grid__image').first().getAttribute('src');
if (!firstIconSrc.includes('/assets/original/chara/1.gif')) throw new Error(`Desktop smoke failed: first original character GIF missing (${firstIconSrc}).`);
const menuRankingImageCount = await desktop.locator('#ranking-panel .avatar-image').count();
if (menuRankingImageCount < 4) throw new Error('Desktop smoke failed: menu ranking should use character sprite images.');
await desktop.locator('#lineage-panel summary').click();
const lineageText = (await desktop.locator('#lineage-panel').innerText()).toLowerCase();
if (!lineageText.includes('badgameshow') || !lineageText.includes('farland history')) {
  throw new Error('Desktop smoke failed: lineage/reference block missing source context.');
}
await desktop.screenshot({ path: `${screenshotsDir}/desktop-menu-open.png`, fullPage: true });
await desktop.keyboard.press('Escape');
const menuHiddenAfterEscape = await desktop.locator('#function-menu-panel').evaluate((el) => el.hidden);
if (!menuHiddenAfterEscape) throw new Error('Desktop smoke failed: function menu did not close on Escape.');
const mainInfoBlocks = await desktop.locator('.classic-main-column > #player-list-panel, .classic-main-column > #system-news, .classic-main-column > #news-log, .classic-main-column > #battle-records, .classic-main-column > .classic-info-grid').count();
if (mainInfoBlocks !== 0) throw new Error('Desktop smoke failed: info/explanation blocks should not render in the main screen.');
const sideInfoBlocks = await desktop.locator('.classic-side-column > .side-box').count();
if (sideInfoBlocks !== 0) throw new Error('Desktop smoke failed: sidebar info/explanation boxes should be removed from the main screen.');
const footerBlocks = await desktop.locator('.classic-footer').count();
if (footerBlocks !== 0) throw new Error('Desktop smoke failed: footer info block should be moved out of the main screen.');
const heroStatusBlocks = await desktop.locator('.hero__status').count();
if (heroStatusBlocks !== 0) throw new Error('Desktop smoke failed: hero info cards should be moved into the function menu.');
await desktop.fill('#hero-name', '終端測試員');
await desktop.selectOption('#hero-element', '光');
await desktop.selectOption('#hero-archetype', 'blade');
await desktop.click('button:has-text("建立角色")');
const navIconCount = await desktop.locator('.tab-button .ui-icon').count();
if (navIconCount !== 6) throw new Error(`Desktop smoke failed: tab nav should have 6 command icons, got ${navIconCount}.`);
const guideTextBeforeBattle = await desktop.locator('#adventure-guide').innerText();
if (!guideTextBeforeBattle.includes('冒險指南') || !guideTextBeforeBattle.includes('草原討伐')) {
  throw new Error('Desktop smoke failed: adventure guide should show beginner next action.');
}
const routeStepCount = await desktop.locator('#adventure-guide .route-step').count();
if (routeStepCount !== 5) throw new Error(`Desktop smoke failed: adventure guide should show 5 route steps, got ${routeStepCount}.`);
await desktop.click('.tab-button[data-view="save"]');
const maliciousSave = '{"name":"壞資料","element":"火","level":1,"wins":"<img src=x onerror=alert(1)>"}';
await desktop.fill('#save-data', maliciousSave);
await desktop.click('#import-button');
const importFailure = await desktop.locator('#save-message').innerText();
if (!importFailure.includes('匯入失敗') || (await desktop.locator('#save-data').inputValue()) !== maliciousSave) {
  throw new Error('Desktop smoke failed: invalid import replaced input or bypassed schema validation.');
}
await desktop.click('.tab-button[data-view="battle"]');
const commandEffect = await desktop.locator('#battle-button').evaluate((el) => {
  const style = getComputedStyle(el);
  return { backgroundImage: style.backgroundImage, transitionDuration: style.transitionDuration };
});
if (!commandEffect.backgroundImage.includes('linear-gradient') || commandEffect.transitionDuration === '0s') {
  throw new Error(`Desktop smoke failed: command micro-effect style missing ${JSON.stringify(commandEffect)}.`);
}
await desktop.click('#battle-button');
await desktop.waitForSelector('#battle-page:not(.is-hidden)');
const battleHash = await desktop.evaluate(() => window.location.hash);
if (battleHash !== '#battle-page') throw new Error('Desktop smoke failed: battle action should jump to the battle page hash.');
const battleIsolation = await desktop.evaluate(() => ({
  mainInert: document.querySelector('#main')?.inert,
  dialogFocused: document.querySelector('#battle-page')?.contains(document.activeElement)
}));
if (!battleIsolation.mainInert || !battleIsolation.dialogFocused) {
  throw new Error(`Desktop smoke failed: battle dialog did not isolate background focus ${JSON.stringify(battleIsolation)}.`);
}
await desktop.click('#battle-skip-button');
await desktop.waitForSelector('.battle-turn--player');
await desktop.waitForSelector('.battle-turn--monster');
await desktop.waitForFunction(() => !document.querySelector('#battle-return-button')?.disabled);
const battleSummary = await desktop.locator('#battle-result-summary').innerText();
if (!battleSummary.trim()) throw new Error('Desktop smoke failed: battle result summary is empty after skip.');
const battlePageText = await desktop.locator('#battle-page').innerText();
if (!battlePageText.includes('第 1 回合') || !battlePageText.includes('返回主頁面')) {
  throw new Error('Desktop smoke failed: turn-by-turn battle page did not finish correctly.');
}
if (!battlePageText.includes('施放') && !battlePageText.includes('使出')) {
  throw new Error('Desktop smoke failed: probabilistic skills were not shown in the battle page.');
}
const battleSpriteCount = await desktop.locator('#battle-page .battle-portrait').count();
if (battleSpriteCount !== 2) throw new Error('Desktop smoke failed: battle page should show player and monster sprites.');
const battleSpriteSrcs = await desktop.locator('#battle-page .battle-portrait').evaluateAll((imgs) => imgs.map((img) => img.getAttribute('src')));
if (!battleSpriteSrcs.some((src) => src?.includes('/assets/original/chara/')) || !battleSpriteSrcs.some((src) => src?.includes('/assets/original/monster/'))) {
  throw new Error(`Desktop smoke failed: battle page should use original character/monster GIFs (${battleSpriteSrcs.join(',')}).`);
}
const battleTurnIconCount = await desktop.locator('#battle-page .battle-turn .turn-icon').count();
if (battleTurnIconCount < 2) throw new Error('Desktop smoke failed: battle turns should show player/monster terminal icons.');
const battleProgressTones = await desktop.evaluate(() => {
  const tone = (selector) => getComputedStyle(document.querySelector(selector)).getPropertyValue('--tone-color').trim().toLowerCase();
  const border = (selector) => getComputedStyle(document.querySelector(selector)).borderColor;
  const color = (selector) => getComputedStyle(document.querySelector(selector)).color;
  return {
    playerHp: tone('#battle-player-hp'),
    playerMp: tone('#battle-player-mp'),
    enemyHp: tone('#battle-monster-hp'),
    turnBorder: border('.battle-turn--player'),
    playerName: color('.battle-actor--player strong'),
    monsterName: color('.battle-actor--monster strong')
  };
});
if (battleProgressTones.playerHp !== '#ff5f73' || battleProgressTones.playerMp !== '#58c7ff' || battleProgressTones.enemyHp !== '#ff5f73') {
  throw new Error(`Desktop smoke failed: battle progress colors missing ${JSON.stringify(battleProgressTones)}.`);
}
if (battleProgressTones.turnBorder !== 'rgb(255, 255, 255)') {
  throw new Error(`Desktop smoke failed: battle turn frame should stay monochrome ${JSON.stringify(battleProgressTones)}.`);
}
if (battleProgressTones.playerName !== 'rgb(245, 245, 245)' || battleProgressTones.monsterName !== 'rgb(245, 245, 245)') {
  throw new Error(`Desktop smoke failed: battle names should stay monochrome ${JSON.stringify(battleProgressTones)}.`);
}
const battleTurnAnimation = await desktop.locator('#battle-page .battle-turn').first().evaluate((el) => getComputedStyle(el).animationName);
if (battleTurnAnimation !== 'none') throw new Error(`Desktop smoke failed: skipped battle turns should render immediately (${battleTurnAnimation}).`);
await desktop.screenshot({ path: `${screenshotsDir}/desktop-battle-page.png` });
await desktop.click('#battle-return-button');
await desktop.waitForFunction(() => document.querySelector('#battle-page')?.classList.contains('is-hidden'));
const returnHash = await desktop.evaluate(() => window.location.hash);
if (returnHash !== '#main') throw new Error('Desktop smoke failed: return button should jump back to main hash.');
await desktop.screenshot({ path: `${screenshotsDir}/desktop.png`, fullPage: true });
const title = await desktop.locator('#player-title').innerText();
if (!title.includes('終端測試員')) throw new Error('Desktop smoke failed: player title not rendered.');
const vitalBars = await desktop.locator('.vital-card .resource-meter').count();
if (vitalBars !== 2) throw new Error('Desktop smoke failed: HP/MP vital block should contain exactly 2 meters.');
const characterPortraitVisible = await desktop.locator('.character-info-card .character-portrait').isVisible();
if (!characterPortraitVisible) throw new Error('Desktop smoke failed: character portrait sprite not visible in status block.');
const expBars = await desktop.locator('.character-info-card .resource-row--exp .resource-meter').count();
if (expBars !== 1) throw new Error('Desktop smoke failed: EXP should be inside character info block.');
const statusToneColors = await desktop.evaluate(() => {
  const tone = (selector) => {
    const node = document.querySelector(selector);
    return node ? getComputedStyle(node).getPropertyValue('--tone-color').trim().toLowerCase() : '';
  };
  const border = (selector) => getComputedStyle(document.querySelector(selector)).borderColor;
  return {
    hp: tone('.resource-row--hp'),
    mp: tone('.resource-row--mp'),
    exp: tone('.resource-row--exp'),
    attack: tone('.stat-chip--attack'),
    resourceFrame: border('.resource-row--hp'),
    statFrame: border('.stat-chip--attack'),
    readinessFrame: border('.readiness-pill')
  };
});
const expectedToneColors = { hp: '#ff5f73', mp: '#58c7ff', exp: '#ffd166', attack: '#ff9f6e' };
for (const [key, expected] of Object.entries(expectedToneColors)) {
  if (statusToneColors[key] !== expected) throw new Error(`Desktop smoke failed: ${key} color token mismatch ${statusToneColors[key]} !== ${expected}.`);
}
for (const key of ['resourceFrame', 'statFrame', 'readinessFrame']) {
  if (statusToneColors[key] !== 'rgb(255, 255, 255)') throw new Error(`Desktop smoke failed: ${key} should stay monochrome ${JSON.stringify(statusToneColors)}.`);
}
const hpText = await desktop.locator('.vital-card .resource-row--hp .resource-card__header strong').innerText();
if (!/\d+\/\d+/.test(hpText)) throw new Error('Desktop smoke failed: HP meter value missing.');
const infoText = await desktop.locator('.character-info-card').innerText();
if (!infoText.includes('戰績') || !infoText.includes('裝備') || !infoText.includes('金幣')) {
  throw new Error('Desktop smoke failed: character info block not rendered.');
}
const hudIconCount = await desktop.locator('.stat-grid .ui-icon').count();
if (hudIconCount < 9) throw new Error(`Desktop smoke failed: status HUD icons missing (${hudIconCount}).`);
const recordIconCount = await desktop.locator('#battle-log .record-line .ui-icon').count();
if (recordIconCount < 1) throw new Error('Desktop smoke failed: battle log record icons missing.');
const recordFrameColor = await desktop.locator('#battle-log .record-line').first().evaluate((el) => getComputedStyle(el).borderLeftColor);
if (recordFrameColor !== 'rgb(255, 255, 255)') throw new Error(`Desktop smoke failed: battle log frame should stay monochrome (${recordFrameColor}).`);
const desktopAreas = await desktop.locator('.stat-grid').evaluate((el) => getComputedStyle(el).gridTemplateAreas);
if (!desktopAreas.includes('vitals') || !desktopAreas.includes('info')) {
  throw new Error('Desktop smoke failed: HP/MP + character info grid areas missing.');
}
const mapOptionCount = await desktop.locator('#map-select option').count();
if (mapOptionCount !== 9) throw new Error(`Desktop smoke failed: new player map dropdown should only contain 9 original constant maps, got ${mapOptionCount}.`);
const mapGroupLabels = await desktop.locator('#map-select optgroup').evaluateAll((nodes) => nodes.map((node) => node.label));
if (mapGroupLabels.length !== 1 || mapGroupLabels[0] !== '常駐開放') {
  throw new Error(`Desktop smoke failed: hidden map optgroups should not leak before discovery (${mapGroupLabels.join(',')}).`);
}
const initialMapSelectText = await desktop.locator('#map-select').innerText();
for (const hiddenMap of ['財寶洞穴', '修行者之塔', '神秘的湖泊', '艾恩葛朗特', '上塔之門', '???']) {
  if (initialMapSelectText.includes(hiddenMap)) throw new Error(`Desktop smoke failed: hidden map leaked before unlock (${hiddenMap}).`);
}
await desktop.selectOption('#map-select', 'ruins');
const selectedMapText = await desktop.locator('.selected-map-card').innerText();
if (!selectedMapText.includes('廢棄後山') || !selectedMapText.includes('常駐開放')) {
  throw new Error('Desktop smoke failed: selected map summary did not update from dropdown.');
}
if (!selectedMapText.includes('高風險') && !selectedMapText.includes('可挑戰') && !selectedMapText.includes('金幣不足')) {
  throw new Error('Desktop smoke failed: selected map should include readiness guidance.');
}
const unaffordableBattleState = await desktop.locator('#battle-button').evaluate((button) => ({ disabled: button.disabled, text: button.textContent }));
if (!unaffordableBattleState.disabled || !unaffordableBattleState.text.includes('尚缺')) {
  throw new Error(`Desktop smoke failed: unaffordable map CTA should stay inline and disabled ${JSON.stringify(unaffordableBattleState)}.`);
}
const selectedMapIconVisible = await desktop.locator('.selected-map-card .map-card__category .ui-icon').isVisible();
if (!selectedMapIconVisible) throw new Error('Desktop smoke failed: selected map category icon missing.');
await desktop.click('.tab-button[data-view="character"]');
const rebirthText = await desktop.locator('#character-sheet').innerText();
if (!rebirthText.includes('轉生職業')) throw new Error('Desktop smoke failed: rebirth career panel missing.');
for (const hiddenName of ['界斷者', '星界賢者', '影月獵神', '無界者', '???']) {
  if (rebirthText.includes(hiddenName)) throw new Error(`Desktop smoke failed: hidden career leaked before unlock (${hiddenName}).`);
}
const visibleBodyText = await desktop.locator('body').innerText();
if (visibleBodyText.includes('豆豆') || visibleBodyText.toLowerCase().includes('doudou')) throw new Error('Desktop smoke failed: legacy visible naming should be removed.');
const createFormPrompt = await desktop.locator('.create-form label').first().evaluate((el) => getComputedStyle(el, '::before').content);
if (createFormPrompt.toLowerCase().includes('doudou')) throw new Error(`Desktop smoke failed: terminal prompt still uses legacy name (${createFormPrompt}).`);
await desktop.click('.tab-button[data-view="quest"]');
const questText = await desktop.locator('#quest-board').innerText();
for (const expected of ['冒險目標', '第一次出擊', '討伐圖鑑', '地圖紀錄', '草原']) {
  if (!questText.includes(expected)) throw new Error(`Desktop smoke failed: quest progression board missing ${expected}.`);
}
const milestoneCount = await desktop.locator('#quest-board .milestone-card').count();
if (milestoneCount !== 6) throw new Error(`Desktop smoke failed: should render 6 milestone cards, got ${milestoneCount}.`);
const collectionCardCount = await desktop.locator('#quest-board .collection-card').count();
if (collectionCardCount !== 2) throw new Error(`Desktop smoke failed: should render bestiary and map collection cards, got ${collectionCardCount}.`);
await desktop.click('[data-claim-milestone="first_battle"]');
const claimedMilestoneText = await desktop.locator('[data-claim-milestone="first_battle"]').innerText();
if (!claimedMilestoneText.includes('已領取')) throw new Error('Desktop smoke failed: first battle milestone should be claimable and become claimed.');
await desktop.click('.tab-button[data-view="inventory"]');
const itemIconCount = await desktop.locator('.item-card .item-card__icon').count();
if (itemIconCount < 3) throw new Error(`Desktop smoke failed: inventory/shop item icons missing (${itemIconCount}).`);
await desktop.click('.tab-button[data-view="world"]');
const worldRankingText = await desktop.locator('#world-view .classic-ranking-table').innerText();
for (const expected of ['頭像', 'HP', 'MP', '職業', '戰數']) {
  if (!worldRankingText.includes(expected)) throw new Error(`Desktop smoke failed: world ranking table missing ${expected}.`);
}
await desktop.click('.tab-button[data-view="battle"]');
const mobile = await browser.newPage({ viewport: { width: 390, height: 844 }, isMobile: true });
await mobile.goto(url, { waitUntil: 'networkidle' });
await assertTerminalLoginGate(mobile, 'Mobile');
await mobile.screenshot({ path: `${screenshotsDir}/mobile-login.png`, fullPage: true });
await openRegisterModal(mobile, 'Mobile register screenshot');
await mobile.screenshot({ path: `${screenshotsDir}/mobile-register-modal.png` });
await closeRegisterModal(mobile, 'Mobile register screenshot');
await registerLocalThroughGate(mobile, 'mobi01', 'pass01');
const mobileMenuButtonBox = await mobile.locator('#function-menu-button').boundingBox();
if (!mobileMenuButtonBox || Math.abs((mobileMenuButtonBox.x + mobileMenuButtonBox.width) - 382) > 3 || mobileMenuButtonBox.y > 16) {
  throw new Error('Mobile smoke failed: function menu button is not fixed at the top-right.');
}
await mobile.click('#function-menu-button');
const mobileMenuVisible = await mobile.locator('#function-menu-panel').isVisible();
if (!mobileMenuVisible) throw new Error('Mobile smoke failed: function menu panel not visible after click.');
const mobileMenuIconCount = await mobile.locator('#function-menu-panel .ui-icon').count();
if (mobileMenuIconCount < 16) throw new Error(`Mobile smoke failed: function menu icons missing (${mobileMenuIconCount}).`);
await mobile.locator('#guide-panel summary').click();
const mobileGuideText = await mobile.locator('#guide-panel').innerText();
if (!mobileGuideText.includes('森林') || !mobileGuideText.includes('高塔')) throw new Error('Mobile smoke failed: function menu guide content missing or leaking hidden maps.');
await mobile.screenshot({ path: `${screenshotsDir}/mobile-menu-open.png`, fullPage: true });
await mobile.locator('#function-menu-panel a[href="#main"]').click();
const mobileMenuClosedAfterLink = await mobile.locator('#function-menu-panel').evaluate((el) => el.hidden);
if (!mobileMenuClosedAfterLink) throw new Error('Mobile smoke failed: function menu did not close after home link click.');
await mobile.fill('#hero-name', '手機測試員');
await mobile.selectOption('#hero-element', '水');
await mobile.selectOption('#hero-archetype', 'sage');
await mobile.click('button:has-text("建立角色")');
const mobileGuideVisible = await mobile.locator('#adventure-guide').isVisible();
if (!mobileGuideVisible) throw new Error('Mobile smoke failed: adventure guide not visible after create.');
const mobileRouteStepCount = await mobile.locator('#adventure-guide .route-step').count();
if (mobileRouteStepCount !== 5) throw new Error(`Mobile smoke failed: route steps missing (${mobileRouteStepCount}).`);
const mobileBattleButtonBox = await mobile.locator('#battle-button').boundingBox();
if (!mobileBattleButtonBox || mobileBattleButtonBox.y < 0 || mobileBattleButtonBox.y + mobileBattleButtonBox.height > 844) {
  throw new Error(`Mobile smoke failed: primary battle CTA is not visible without scrolling ${JSON.stringify(mobileBattleButtonBox)}.`);
}
await mobile.click('#battle-button');
await mobile.waitForSelector('#battle-page:not(.is-hidden)');
const mobileBattleHash = await mobile.evaluate(() => window.location.hash);
if (mobileBattleHash !== '#battle-page') throw new Error('Mobile smoke failed: battle action should jump to battle page hash.');
await mobile.click('#battle-skip-button');
await mobile.waitForSelector('.battle-turn--player');
const mobileBattleSpriteCount = await mobile.locator('#battle-page .battle-portrait').count();
if (mobileBattleSpriteCount !== 2) throw new Error('Mobile smoke failed: battle page sprites missing.');
await mobile.waitForFunction(() => !document.querySelector('#battle-return-button')?.disabled);
const mobileBattleLayout = await mobile.evaluate(() => {
  const frame = document.querySelector('.battle-page__frame');
  const feed = document.querySelector('.battle-turn-feed');
  return {
    frameOverflow: frame.scrollHeight - frame.clientHeight,
    feedOverflow: feed.scrollHeight - feed.clientHeight,
    feedOverflowStyle: getComputedStyle(feed).overflowY
  };
});
if (mobileBattleLayout.frameOverflow > 2 || !['auto', 'scroll'].includes(mobileBattleLayout.feedOverflowStyle)) {
  throw new Error(`Mobile smoke failed: battle page should use one scroll container ${JSON.stringify(mobileBattleLayout)}.`);
}
const mobileBattleBoxes = await mobile.evaluate(() => {
  const box = (selector) => {
    const rect = document.querySelector(selector).getBoundingClientRect();
    return { top: rect.top, bottom: rect.bottom, height: rect.height };
  };
  return {
    header: box('.battle-page__header'),
    arena: box('.battle-page__arena'),
    feed: box('.battle-turn-feed'),
    actions: box('.battle-page__actions')
  };
});
if (mobileBattleBoxes.header.bottom > mobileBattleBoxes.arena.top + 1
  || mobileBattleBoxes.arena.bottom > mobileBattleBoxes.feed.top + 1
  || mobileBattleBoxes.feed.bottom > mobileBattleBoxes.actions.top + 1) {
  throw new Error(`Mobile smoke failed: battle sections overlap ${JSON.stringify(mobileBattleBoxes)}.`);
}
await mobile.screenshot({ path: `${screenshotsDir}/mobile-battle-page.png` });
await mobile.click('#battle-return-button');
await mobile.waitForFunction(() => document.querySelector('#battle-page')?.classList.contains('is-hidden'));
const mobileReturnHash = await mobile.evaluate(() => window.location.hash);
if (mobileReturnHash !== '#main') throw new Error('Mobile smoke failed: return button should jump back to main hash.');
await mobile.screenshot({ path: `${screenshotsDir}/mobile.png`, fullPage: true });
const navVisible = await mobile.locator('.tab-nav').isVisible();
if (!navVisible) throw new Error('Mobile smoke failed: tab nav not visible.');
const mobileVitalBars = await mobile.locator('.vital-card .resource-meter').count();
if (mobileVitalBars !== 2) throw new Error('Mobile smoke failed: HP/MP vital block not rendered.');
const mobileInfoVisible = await mobile.locator('.character-info-card').isVisible();
if (!mobileInfoVisible) throw new Error('Mobile smoke failed: character info block not visible.');
const mobileMapSelectVisible = await mobile.locator('#map-select').isVisible();
if (!mobileMapSelectVisible) throw new Error('Mobile smoke failed: map dropdown not visible.');
const mobileMapOptionText = await mobile.locator('#map-select').innerText();
if (mobileMapOptionText.includes('上塔之門') || mobileMapOptionText.includes('???')) throw new Error('Mobile smoke failed: hidden maps should not appear before discovery.');
await mobile.selectOption('#map-select', 'ruins');
const mobileSelectedMapText = await mobile.locator('.selected-map-card').innerText();
if (!mobileSelectedMapText.includes('廢棄後山')) throw new Error('Mobile smoke failed: map dropdown summary did not update.');
await desktop.click('.tab-button[data-view="save"]');
await desktop.click('#logout-button');
await assertTerminalLoginGate(desktop, 'Desktop logout', { expectedAccounts: ['終端測試員'] });
await desktop.fill('#login-id', 'test01');
await desktop.fill('#login-pass', 'wrong1');
await desktop.click('#login-submit');
await desktop.waitForFunction(() => document.querySelector('#login-message')?.textContent.includes('密碼不正確'));
if (!(await desktop.locator('#login-view').isVisible())) throw new Error('Account smoke failed: wrong password should not enter the game.');
await loginExistingThroughGate(desktop, 'test01', 'pass01', '終端測試員');
await desktop.click('.tab-button[data-view="save"]');
await desktop.click('#logout-button');
await registerLocalThroughGate(desktop, 'other01', 'pass02');
if (!(await desktop.locator('#create-view').isVisible()) || (await desktop.locator('#game-view').isVisible())) {
  throw new Error('Account smoke failed: a second account inherited the first account player save.');
}
await browser.close();
console.log('Smoke test passed.');
