import { createRequire } from 'module';
import fs   from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const require   = createRequire(import.meta.url);
const puppeteer = require('C:/Users/ogavi/AppData/Local/Temp/puppeteer-test/node_modules/puppeteer');

const __dirname     = path.dirname(fileURLToPath(import.meta.url));
const screenshotDir = path.join(__dirname, 'temporary screenshots');
if (!fs.existsSync(screenshotDir)) fs.mkdirSync(screenshotDir);

const label = process.argv[2] || 'desktop';
let n = 1;
while (fs.existsSync(path.join(screenshotDir, `screenshot-${n}-${label}.png`))) n++;
const outPath = path.join(screenshotDir, `screenshot-${n}-${label}.png`);

const browser = await puppeteer.launch({ headless: true, args: ['--no-sandbox', '--disable-setuid-sandbox'] });
const page    = await browser.newPage();
await page.setViewport({ width: 1280, height: 900, deviceScaleFactor: 1.5 });
await page.goto('http://localhost:3000', { waitUntil: 'networkidle2', timeout: 15000 });
await page.evaluate(() => {
  document.querySelectorAll('.reveal').forEach(el => el.classList.add('vis'));
});
await new Promise(r => setTimeout(r, 600));
await page.screenshot({ path: outPath, fullPage: true });
console.log('Saved:', outPath);
await browser.close();
