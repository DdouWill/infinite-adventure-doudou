import { createRequire } from 'node:module';

const require = createRequire(import.meta.url);
const { chromium } = require('playwright');

const url = withBattleDelay(process.env.SMOKE_URL || 'http://127.0.0.1:4173');
const screenshotsDir = process.env.SMOKE_SCREENSHOTS || 'screenshots';

function withBattleDelay(rawUrl) {
  const nextUrl = new URL(rawUrl);
  if (!nextUrl.searchParams.has('battleDelayMs')) nextUrl.searchParams.set('battleDelayMs', '35');
  if (!nextUrl.searchParams.has('battleSeed')) nextUrl.searchParams.set('battleSeed', 'turn-skill-showcase');
  return nextUrl.toString();
}

const browser = await chromium.launch({ headless: true });
const desktop = await browser.newPage({ viewport: { width: 1280, height: 900 } });
await desktop.goto(url, { waitUntil: 'networkidle' });
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
await desktop.locator('#guide-panel summary').click();
const openedGuideText = await desktop.locator('#guide-panel').innerText();
if (!openedGuideText.includes('修行者高塔')) {
  throw new Error('Desktop smoke failed: guide content should live inside the function menu.');
}
await desktop.locator('#ranking-panel summary').click();
const rankingText = await desktop.locator('#ranking-panel').innerText();
for (const expected of ['頭像', 'HP', 'MP', '戰數', '打寶之王']) {
  if (!rankingText.includes(expected)) throw new Error(`Desktop smoke failed: reference ranking table missing ${expected}.`);
}
await desktop.locator('#icon-panel summary').click();
const iconCellCount = await desktop.locator('#icon-panel .icon-grid__cell').count();
if (iconCellCount !== 70) throw new Error(`Desktop smoke failed: icon grid should contain 70 cells, got ${iconCellCount}.`);
const iconImageCount = await desktop.locator('#icon-panel .icon-grid__image').count();
if (iconImageCount < 30) throw new Error('Desktop smoke failed: icon grid should use local sprite thumbnails.');
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
await desktop.fill('#hero-name', '豆豆測試員');
await desktop.selectOption('#hero-element', '光');
await desktop.selectOption('#hero-archetype', 'blade');
await desktop.click('button:has-text("建立角色")');
await desktop.click('#battle-button');
await desktop.waitForSelector('#battle-page:not(.is-hidden)');
const battleHash = await desktop.evaluate(() => window.location.hash);
if (battleHash !== '#battle-page') throw new Error('Desktop smoke failed: battle action should jump to the battle page hash.');
await desktop.waitForSelector('.battle-turn--player');
await desktop.waitForSelector('.battle-turn--monster');
await desktop.waitForFunction(() => !document.querySelector('#battle-return-button')?.disabled);
const battlePageText = await desktop.locator('#battle-page').innerText();
if (!battlePageText.includes('第 1 回合') || !battlePageText.includes('返回主頁面')) {
  throw new Error('Desktop smoke failed: turn-by-turn battle page did not finish correctly.');
}
if (!battlePageText.includes('施放') && !battlePageText.includes('使出')) {
  throw new Error('Desktop smoke failed: probabilistic skills were not shown in the battle page.');
}
const battleSpriteCount = await desktop.locator('#battle-page .battle-portrait').count();
if (battleSpriteCount !== 2) throw new Error('Desktop smoke failed: battle page should show player and monster sprites.');
await desktop.screenshot({ path: `${screenshotsDir}/desktop-battle-page.png` });
await desktop.click('#battle-return-button');
await desktop.waitForFunction(() => document.querySelector('#battle-page')?.classList.contains('is-hidden'));
const returnHash = await desktop.evaluate(() => window.location.hash);
if (returnHash !== '#main') throw new Error('Desktop smoke failed: return button should jump back to main hash.');
await desktop.screenshot({ path: `${screenshotsDir}/desktop.png`, fullPage: true });
const title = await desktop.locator('#player-title').innerText();
if (!title.includes('豆豆測試員')) throw new Error('Desktop smoke failed: player title not rendered.');
const vitalBars = await desktop.locator('.vital-card .resource-meter').count();
if (vitalBars !== 2) throw new Error('Desktop smoke failed: HP/MP vital block should contain exactly 2 meters.');
const characterPortraitVisible = await desktop.locator('.character-info-card .character-portrait').isVisible();
if (!characterPortraitVisible) throw new Error('Desktop smoke failed: character portrait sprite not visible in status block.');
const expBars = await desktop.locator('.character-info-card .resource-row--exp .resource-meter').count();
if (expBars !== 1) throw new Error('Desktop smoke failed: EXP should be inside character info block.');
const hpText = await desktop.locator('.vital-card .resource-row--hp .resource-card__header strong').innerText();
if (!/\d+\/\d+/.test(hpText)) throw new Error('Desktop smoke failed: HP meter value missing.');
const infoText = await desktop.locator('.character-info-card').innerText();
if (!infoText.includes('戰績') || !infoText.includes('裝備') || !infoText.includes('金幣')) {
  throw new Error('Desktop smoke failed: character info block not rendered.');
}
const desktopAreas = await desktop.locator('.stat-grid').evaluate((el) => getComputedStyle(el).gridTemplateAreas);
if (!desktopAreas.includes('vitals') || !desktopAreas.includes('info')) {
  throw new Error('Desktop smoke failed: HP/MP + character info grid areas missing.');
}
const mapOptionCount = await desktop.locator('#map-select option').count();
if (mapOptionCount !== 5) throw new Error('Desktop smoke failed: map dropdown should contain 5 maps.');
const mapGroupLabels = await desktop.locator('#map-select optgroup').evaluateAll((nodes) => nodes.map((node) => node.label));
for (const expected of ['一般地圖', '試煉地圖', '特殊地圖', '封閉專區']) {
  if (!mapGroupLabels.includes(expected)) throw new Error(`Desktop smoke failed: missing map optgroup ${expected}.`);
}
await desktop.selectOption('#map-select', 'ruins');
const selectedMapText = await desktop.locator('.selected-map-card').innerText();
if (!selectedMapText.includes('廢棄後山') || !selectedMapText.includes('特殊地圖')) {
  throw new Error('Desktop smoke failed: selected map summary did not update from dropdown.');
}
await desktop.click('.tab-button[data-view="world"]');
const worldRankingText = await desktop.locator('#world-view .classic-ranking-table').innerText();
for (const expected of ['頭像', 'HP', 'MP', '職業', '戰數']) {
  if (!worldRankingText.includes(expected)) throw new Error(`Desktop smoke failed: world ranking table missing ${expected}.`);
}
await desktop.click('.tab-button[data-view="battle"]');
const mobile = await browser.newPage({ viewport: { width: 390, height: 844 }, isMobile: true });
await mobile.goto(url, { waitUntil: 'networkidle' });
const mobileMenuButtonBox = await mobile.locator('#function-menu-button').boundingBox();
if (!mobileMenuButtonBox || Math.abs((mobileMenuButtonBox.x + mobileMenuButtonBox.width) - 382) > 3 || mobileMenuButtonBox.y > 16) {
  throw new Error('Mobile smoke failed: function menu button is not fixed at the top-right.');
}
await mobile.click('#function-menu-button');
const mobileMenuVisible = await mobile.locator('#function-menu-panel').isVisible();
if (!mobileMenuVisible) throw new Error('Mobile smoke failed: function menu panel not visible after click.');
await mobile.locator('#guide-panel summary').click();
const mobileGuideText = await mobile.locator('#guide-panel').innerText();
if (!mobileGuideText.includes('修行者高塔')) throw new Error('Mobile smoke failed: function menu guide content missing.');
await mobile.screenshot({ path: `${screenshotsDir}/mobile-menu-open.png`, fullPage: true });
await mobile.locator('#function-menu-panel a[href="#main"]').click();
const mobileMenuClosedAfterLink = await mobile.locator('#function-menu-panel').evaluate((el) => el.hidden);
if (!mobileMenuClosedAfterLink) throw new Error('Mobile smoke failed: function menu did not close after home link click.');
await mobile.fill('#hero-name', '手機豆豆');
await mobile.selectOption('#hero-element', '水');
await mobile.selectOption('#hero-archetype', 'sage');
await mobile.click('button:has-text("建立角色")');
await mobile.click('#battle-button');
await mobile.waitForSelector('#battle-page:not(.is-hidden)');
const mobileBattleHash = await mobile.evaluate(() => window.location.hash);
if (mobileBattleHash !== '#battle-page') throw new Error('Mobile smoke failed: battle action should jump to battle page hash.');
await mobile.waitForSelector('.battle-turn--player');
const mobileBattleSpriteCount = await mobile.locator('#battle-page .battle-portrait').count();
if (mobileBattleSpriteCount !== 2) throw new Error('Mobile smoke failed: battle page sprites missing.');
await mobile.waitForFunction(() => !document.querySelector('#battle-return-button')?.disabled);
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
await mobile.selectOption('#map-select', 'sealed_gate');
const mobileSelectedMapText = await mobile.locator('.selected-map-card').innerText();
if (!mobileSelectedMapText.includes('封印之門')) throw new Error('Mobile smoke failed: map dropdown summary did not update.');
await browser.close();
console.log('Smoke test passed.');
