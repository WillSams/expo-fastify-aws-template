import { rmSync } from 'fs';

const dirs = [
  './node_modules',
  './apps/api/node_modules',
  './apps/api/dist',
  './apps/api/coverage',
  './apps/mobile/node_modules',
  './apps/mobile/.expo',
  './packages/types/node_modules',
  './packages/types/dist',
];

for (const dir of dirs) {
  rmSync(dir, { recursive: true, force: true });
}
