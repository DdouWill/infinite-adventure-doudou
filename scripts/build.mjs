import { cp, mkdir, rm } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = dirname(dirname(fileURLToPath(import.meta.url)));
const dist = join(root, 'dist');

await rm(dist, { recursive: true, force: true });
await mkdir(dist, { recursive: true });
await cp(join(root, 'index.html'), join(dist, 'index.html'));
await cp(join(root, '_headers'), join(dist, '_headers'));
await cp(join(root, 'robots.txt'), join(dist, 'robots.txt'));
await cp(join(root, 'assets'), join(dist, 'assets'), { recursive: true });
console.log(`Built Cloudflare Pages output at ${dist}`);
