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
const menuIconCount = await desktop.locator('#function-menu-panel .function-menu__item summary .ui-icon').count();
if (menuIconCount < 16) throw new Error(`Desktop smoke failed: function menu icon layer incomplete (${menuIconCount}).`);
const menuIconStyle = await desktop.locator('#function-menu-panel .function-menu__item summary .ui-icon').first().evaluate((el) => {
  const style = getComputedStyle(el);
  return { display: style.display, borderTopWidth: style.borderTopWidth, color: style.color };
});
if (menuIconStyle.display !== 'grid' || menuIconStyle.borderTopWidth !== '1px') {
  throw new Error(`Desktop smoke failed: terminal menu icon style missing ${JSON.stringify(menuIconStyle)}.`);
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
const battleSpriteSrcs = await desktop.locator('#battle-page .battle-portrait').evaluateAll((imgs) => imgs.map((img) => img.getAttribute('src')));
if (!battleSpriteSrcs.some((src) => src?.includes('/assets/original/chara/')) || !battleSpriteSrcs.some((src) => src?.includes('/assets/original/monster/'))) {
  throw new Error(`Desktop smoke failed: battle page should use original character/monster GIFs (${battleSpriteSrcs.join(',')}).`);
}
const battleTurnIconCount = await desktop.locator('#battle-page .battle-turn .turn-icon').count();
if (battleTurnIconCount < 2) throw new Error('Desktop smoke failed: battle turns should show player/monster terminal icons.');
const battleToneColors = await desktop.evaluate(() => {
  const tone = (selector) => getComputedStyle(document.querySelector(selector)).getPropertyValue('--tone-color').trim().toLowerCase();
  return {
    player: tone('.battle-turn--player'),
    monster: tone('.battle-turn--monster')
  };
});
if (battleToneColors.player !== '#58c7ff' || battleToneColors.monster !== '#ff5f73') {
  throw new Error(`Desktop smoke failed: battle turn colors missing ${JSON.stringify(battleToneColors)}.`);
}
const battleTurnAnimation = await desktop.locator('#battle-page .battle-turn').first().evaluate((el) => getComputedStyle(el).animationName);
if (!battleTurnAnimation.includes('terminal-line-in')) throw new Error(`Desktop smoke failed: battle turn line-in animation missing (${battleTurnAnimation}).`);
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
  return {
    hp: tone('.resource-row--hp'),
    mp: tone('.resource-row--mp'),
    exp: tone('.resource-row--exp'),
    readiness: tone('.readiness-pill')
  };
});
const expectedToneColors = { hp: '#ff5f73', mp: '#58c7ff', exp: '#ffd166' };
for (const [key, expected] of Object.entries(expectedToneColors)) {
  if (statusToneColors[key] !== expected) throw new Error(`Desktop smoke failed: ${key} color token mismatch ${statusToneColors[key]} !== ${expected}.`);
}
if (!['#7ee787', '#ffd166', '#ff5f73'].includes(statusToneColors.readiness)) {
  throw new Error(`Desktop smoke failed: readiness color token missing (${statusToneColors.readiness}).`);
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
const mobileMapOptionText = await mobile.locator('#map-select').innerText();
if (mobileMapOptionText.includes('上塔之門') || mobileMapOptionText.includes('???')) throw new Error('Mobile smoke failed: hidden maps should not appear before discovery.');
await mobile.selectOption('#map-select', 'ruins');
const mobileSelectedMapText = await mobile.locator('.selected-map-card').innerText();
if (!mobileSelectedMapText.includes('廢棄後山')) throw new Error('Mobile smoke failed: map dropdown summary did not update.');
await browser.close();
console.log('Smoke test passed.');
