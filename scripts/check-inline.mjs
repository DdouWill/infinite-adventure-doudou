import { readFile } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = dirname(dirname(fileURLToPath(import.meta.url)));
const html = await readFile(join(root, 'index.html'), 'utf8');
const inlineScript = /<script\b(?![^>]*\bsrc=)[^>]*>/i.test(html);
const inlineStyle = /<style\b|\sstyle=/i.test(html);
if (inlineScript || inlineStyle) {
  console.error('index.html must not contain inline script/style because CSP disallows inline execution.');
  process.exit(1);
}
console.log('No inline script/style found.');
