import sharp from 'sharp';
import { readFileSync, writeFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const PUBLIC = join(__dirname, 'public');
const SVG_SRC = join(PUBLIC, 'favicon.svg');
const svgBuffer = readFileSync(SVG_SRC);

console.log('🎨 Generating icons from SVG logo...\n');

// All needed sizes
const sizes = [
  { name: 'favicon-16.png',       size: 16  },
  { name: 'favicon-32.png',       size: 32  },
  { name: 'favicon-48.png',       size: 48  },
  { name: 'favicon.png',          size: 192 },
  { name: 'favicon.ico',          size: 32  },
  { name: 'brand-icon.png',       size: 512 },
  { name: 'icon-512.png',         size: 512 },
  { name: 'pwa-192.png',          size: 192 },
  { name: 'pwa-512.png',          size: 512 },
];

for (const { name, size } of sizes) {
  await sharp(svgBuffer, { density: 300 })
    .resize(size, size)
    .png()
    .toFile(join(PUBLIC, name));
  console.log(`✓ ${name} (${size}x${size})`);
}

// Apple touch icon — with ivory background
await sharp(svgBuffer, { density: 300 })
  .resize(180, 180)
  .flatten({ background: { r: 35, g: 67, b: 46 } }) // keep green bg
  .png()
  .toFile(join(PUBLIC, 'apple-touch-icon.png'));
console.log('✓ apple-touch-icon.png (180x180)');

console.log('\n✅ All icons generated from SVG logo!');

