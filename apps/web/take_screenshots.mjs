import fs from 'fs';
import path from 'path';
import { chromium } from '@playwright/test';
import { globSync } from 'glob';

const BASE_URL = 'http://localhost:3002';
const APP_DIR = 'src/app';
const PAGES_DIR = 'src/pages';
const OUT_DIR = 'C:\\Users\\asus\\.gemini\\antigravity-ide\\brain\\b2c2e110-1494-4ea8-a311-c5cc6b7e4359\\artifacts\\screenshots';

if (!fs.existsSync(OUT_DIR)) {
  fs.mkdirSync(OUT_DIR, { recursive: true });
}

function getAppRoutes() {
  const files = globSync(`${APP_DIR}/**/page.tsx`, { windowsPathsNoEscape: true });
  return files.map(file => {
    let route = file.replace(/\\/g, '/').replace(APP_DIR, '');
    route = route.replace(/\/page\.tsx$/, '');
    route = route.replace(/\/\([^)]+\)/g, ''); // Remove route groups like (dashboard)
    route = route.replace(/\[([^\]]+)\]/g, '123'); // Replace dynamic segments with 123
    return route || '/';
  });
}

function getPagesRoutes() {
  const files = globSync(`${PAGES_DIR}/**/*.tsx`, { windowsPathsNoEscape: true });
  return files.map(file => {
    let route = file.replace(/\\/g, '/').replace(PAGES_DIR, '');
    route = route.replace(/\.tsx$/, '');
    route = route.replace(/\/index$/, '');
    return route || '/';
  }).filter(route => !route.includes('/_app') && !route.includes('/_document') && !route.startsWith('/api/'));
}

async function main() {
  const appRoutes = getAppRoutes();
  const pagesRoutes = getPagesRoutes();
  const allRoutes = [...new Set([...appRoutes, ...pagesRoutes])];

  console.log(`Found ${allRoutes.length} routes to screenshot.`);

  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({ viewport: { width: 1280, height: 800 } });

  for (let i = 0; i < allRoutes.length; i++) {
    const route = allRoutes[i];
    const url = `${BASE_URL}${route === '/' ? '' : route}`;
    const filename = (route === '/' ? 'home' : route.replace(/\//g, '_').substring(1)) + '.png';
    const filepath = path.join(OUT_DIR, filename);

    console.log(`[${i + 1}/${allRoutes.length}] Capturing ${url} -> ${filename}`);
    
    const page = await context.newPage();
    try {
      await page.goto(url, { waitUntil: 'load', timeout: 3000 }).catch(e => {});
      
      const client = await page.context().newCDPSession(page);
      const screenshotPromise = client.send('Page.captureScreenshot', { format: 'png' });
      const timeoutPromise = new Promise((_, reject) => setTimeout(() => reject(new Error('CDP Timeout')), 3000));
      
      const { data } = await Promise.race([screenshotPromise, timeoutPromise]);
      fs.writeFileSync(filepath, Buffer.from(data, 'base64'));
      await client.detach();
    } catch (err) {
      console.log(`  Failed to capture ${url}: ${err.message}`);
    } finally {
      await page.close().catch(e => {});
    }
  }

  await browser.close();
  console.log('Finished capturing all screenshots!');
}

main().catch(console.error);
