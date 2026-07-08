import { createRequire } from 'node:module';

const require = createRequire(import.meta.url);
const { chromium } = require('playwright');

const url = process.env.SMOKE_URL || 'http://127.0.0.1:4173';
const screenshotsDir = process.env.SMOKE_SCREENSHOTS || 'screenshots';

const browser = await chromium.launch({ headless: true });
const desktop = await browser.newPage({ viewport: { width: 1280, height: 900 } });
await desktop.goto(url, { waitUntil: 'networkidle' });
await desktop.fill('#hero-name', '豆豆測試員');
await desktop.selectOption('#hero-element', '光');
await desktop.selectOption('#hero-archetype', 'blade');
await desktop.click('button:has-text("建立角色")');
await desktop.click('#battle-button');
await desktop.screenshot({ path: `${screenshotsDir}/desktop.png`, fullPage: true });
const title = await desktop.locator('#player-title').innerText();
if (!title.includes('豆豆測試員')) throw new Error('Desktop smoke failed: player title not rendered.');
const vitalBars = await desktop.locator('.vital-card .resource-meter').count();
if (vitalBars !== 2) throw new Error('Desktop smoke failed: HP/MP vital block should contain exactly 2 meters.');
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
const guideText = await desktop.locator('#guide-panel').innerText();
if (!guideText.includes('小白版新手指南同步') || !guideText.includes('修行者高塔')) {
  throw new Error('Desktop smoke failed: Xiaobai guide sync panel missing.');
}
const lineageText = await desktop.locator('#lineage-panel').innerText();
if (!lineageText.includes('老頭版') || !lineageText.includes('BadGameShow')) {
  throw new Error('Desktop smoke failed: lineage panel missing old-version references.');
}
const mapCategories = await desktop.locator('.map-card__category').evaluateAll((nodes) => nodes.map((node) => node.textContent));
for (const expected of ['一般地圖', '試煉地圖', '特殊地圖', '封閉專區']) {
  if (!mapCategories.includes(expected)) throw new Error(`Desktop smoke failed: missing map category ${expected}.`);
}

const mobile = await browser.newPage({ viewport: { width: 390, height: 844 }, isMobile: true });
await mobile.goto(url, { waitUntil: 'networkidle' });
await mobile.fill('#hero-name', '手機豆豆');
await mobile.selectOption('#hero-element', '水');
await mobile.selectOption('#hero-archetype', 'sage');
await mobile.click('button:has-text("建立角色")');
await mobile.click('#battle-button');
await mobile.screenshot({ path: `${screenshotsDir}/mobile.png`, fullPage: true });
const navVisible = await mobile.locator('.tab-nav').isVisible();
if (!navVisible) throw new Error('Mobile smoke failed: tab nav not visible.');
const mobileVitalBars = await mobile.locator('.vital-card .resource-meter').count();
if (mobileVitalBars !== 2) throw new Error('Mobile smoke failed: HP/MP vital block not rendered.');
const mobileInfoVisible = await mobile.locator('.character-info-card').isVisible();
if (!mobileInfoVisible) throw new Error('Mobile smoke failed: character info block not visible.');
await browser.close();
console.log('Smoke test passed.');
