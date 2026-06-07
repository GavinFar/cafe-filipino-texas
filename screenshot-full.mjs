import { createRequire } from 'module';
import fs   from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const require   = createRequire(import.meta.url);
const puppeteer = require('C:/Users/ogavi/AppData/Local/Temp/puppeteer-test/node_modules/puppeteer');

const __dirname     = path.dirname(fileURLToPath(import.meta.url));
const screenshotDir = path.join(__dirname, 'temporary screenshots');
if (!fs.existsSync(screenshotDir)) fs.mkdirSync(screenshotDir);

const url   = process.argv[2] || 'http://localhost:3000';
const label = process.argv[3] || 'full';

let n = 1;
while (fs.existsSync(path.join(screenshotDir, `screenshot-${n}-${label}.png`))) n++;
const outPath = path.join(screenshotDir, `screenshot-${n}-${label}.png`);

const browser = await puppeteer.launch({ headless: true, args: ['--no-sandbox', '--disable-setuid-sandbox'] });
const page    = await browser.newPage();
await page.setViewport({ width: 390, height: 844, deviceScaleFactor: 2 });
await page.goto(url, { waitUntil: 'networkidle2', timeout: 15000 });

// Trigger all scroll reveals by scrolling
await page.evaluate(async () => {
  document.querySelectorAll('.reveal').forEach(el => el.classList.add('vis'));
  window.scrollTo(0, 0);
});
await new Promise(r => setTimeout(r, 500));

await page.screenshot({ path: outPath, fullPage: true });
console.log('Saved:', outPath);
await browser.close();
