import { existsSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { cwd, exit } from 'node:process';

const root = cwd();
const failures = [];

function requireFile(path) {
  if (!existsSync(join(root, path))) failures.push(`missing ${path}`);
}

function read(path) {
  return readFileSync(join(root, path), 'utf8');
}

for (const path of [
  'dist/index.html',
  'dist/_headers',
  'dist/robots.txt',
  'dist/assets/app.js',
  'dist/assets/game-core.js',
  'dist/assets/styles.css',
  'wrangler.toml',
]) {
  requireFile(path);
}

if (existsSync(join(root, 'functions'))) {
  failures.push('functions/ directory exists; this demo should remain static-only for Free tier');
}

if (existsSync(join(root, 'worker.js')) || existsSync(join(root, 'src/worker.js'))) {
  failures.push('Worker entrypoint found; this demo should deploy as Cloudflare Pages static assets');
}

const wrangler = existsSync(join(root, 'wrangler.toml')) ? read('wrangler.toml') : '';
if (!/pages_build_output_dir\s*=\s*["']dist["']/.test(wrangler)) {
  failures.push('wrangler.toml must set pages_build_output_dir = "dist"');
}

const paidOrBindingPatterns = [
  /\[\[?d1_databases\]?\]/i,
  /\[\[?kv_namespaces\]?\]/i,
  /\[\[?r2_buckets\]?\]/i,
  /\[\[?queues\.?/i,
  /\[durable_objects\]/i,
  /\[\[?services\]?\]/i,
  /workers_dev\s*=/i,
];
for (const pattern of paidOrBindingPatterns) {
  if (pattern.test(wrangler)) {
    failures.push(`wrangler.toml contains disallowed Free-tier static demo setting: ${pattern}`);
  }
}

const headers = existsSync(join(root, '_headers')) ? read('_headers') : '';
if (/unsafe-inline|unsafe-eval/.test(headers)) {
  failures.push('_headers CSP should not allow unsafe-inline or unsafe-eval');
}
if (!/Content-Security-Policy:/i.test(headers)) failures.push('_headers missing Content-Security-Policy');
if (!/frame-ancestors\s+'none'/i.test(headers)) failures.push('_headers missing frame-ancestors none');

const pkg = JSON.parse(read('package.json'));
if (pkg.scripts?.['deploy:cf:free'] !== 'npm run check && npx wrangler pages deploy dist --project-name infinite-adventure-doudou --branch main') {
  failures.push('package.json deploy:cf:free script is missing or unexpected');
}
if (!pkg.scripts?.['check:cloudflare-free']) {
  failures.push('package.json missing check:cloudflare-free script');
}

if (failures.length > 0) {
  console.error('Cloudflare Free tier validation failed:');
  for (const failure of failures) console.error(`- ${failure}`);
  exit(1);
}

console.log('Cloudflare Pages Free tier static validation passed.');
