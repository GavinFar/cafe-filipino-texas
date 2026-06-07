import { createRequire } from 'module';
import fs   from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const require   = createRequire(import.meta.url);
const puppeteer = require('C:/Users/ogavi/AppData/Local/Temp/puppeteer-test/node_modules/puppeteer');

const __dirname     = path.dirname(fileURLToPath(import.meta.url));
const screenshotDir = path.join(__dirname, 'temporary screenshots');
if (!fs.existsSync(screenshotDir)) fs.mkdirSync(screenshotDir);

const scrollY = parseInt(process.argv[2] || '0');
const label   = process.argv[3] || `scroll-${scrollY}`;

let n = 1;
while (fs.existsSync(path.join(screenshotDir, `screenshot-${n}-${label}.png`))) n++;
const outPath = path.join(screenshotDir, `screenshot-${n}-${label}.png`);

const browser = await puppeteer.launch({ headless: true, args: ['--no-sandbox', '--disable-setuid-sandbox'] });
const page    = await browser.newPage();
await page.setViewport({ width: 390, height: 844, deviceScaleFactor: 2 });
await page.goto('http://localhost:3000', { waitUntil: 'networkidle2', timeout: 15000 });
await page.evaluate((y) => {
  document.querySelectorAll('.reveal').forEach(el => el.classList.add('vis'));
  window.scrollTo(0, y);
}, scrollY);
await new Promise(r => setTimeout(r, 500));
await page.screenshot({ path: outPath, fullPage: false });
console.log('Saved:', outPath);
await browser.close();
