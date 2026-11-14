import sharp from 'sharp';
import { readFileSync, writeFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const PUBLIC = join(__dirname, '../artifacts/clickers/public');
const SRC    = join(PUBLIC, 'brand-icon.png');

console.log('🎨 Generating icons from brand-icon.png...\n');

// 1. favicon-16.png
await sharp(SRC).resize(16, 16).toFile(join(PUBLIC, 'favicon-16.png'));
console.log('✓ favicon-16.png');

// 2. favicon-32.png
await sharp(SRC).resize(32, 32).toFile(join(PUBLIC, 'favicon-32.png'));
console.log('✓ favicon-32.png');

// 3. favicon-48.png
await sharp(SRC).resize(48, 48).toFile(join(PUBLIC, 'favicon-48.png'));
console.log('✓ favicon-48.png');

// 4. favicon.png (192x192 — the main one)
await sharp(SRC).resize(192, 192).toFile(join(PUBLIC, 'favicon.png'));
console.log('✓ favicon.png (192x192)');

// 5. apple-touch-icon.png (180x180)
await sharp(SRC)
  .resize(180, 180)
  .flatten({ background: { r: 245, g: 240, b: 227 } }) // ivory bg for Apple icon
  .toFile(join(PUBLIC, 'apple-touch-icon.png'));
console.log('✓ apple-touch-icon.png (180x180)');

// 6. icon-512.png (PWA splash)
await sharp(SRC).resize(512, 512).toFile(join(PUBLIC, 'icon-512.png'));
console.log('✓ icon-512.png (512x512)');

// 7. favicon.svg — embed the PNG as a base64 data URI inside SVG
const pngBuf = readFileSync(join(PUBLIC, 'favicon-32.png'));
const b64 = pngBuf.toString('base64');
const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32">
  <image href="data:image/png;base64,${b64}" width="32" height="32"/>
</svg>`;
writeFileSync(join(PUBLIC, 'favicon.svg'), svg);
console.log('✓ favicon.svg');

// 8. OG image — use the existing background hero image (1200x630)
// Just resize alrehab-bg.png to OG dimensions
await sharp(join(PUBLIC, 'دار الرحاب_ من الفكرة للحكاية.png'))
  .resize(1200, 630, { fit: 'cover', position: 'centre' })
  .jpeg({ quality: 85 })
  .toFile(join(PUBLIC, 'og-image.jpg'));
console.log('✓ og-image.jpg (1200x630 OG)');

// 9. twitter-image (same as OG)
await sharp(join(PUBLIC, 'دار الرحاب_ من الفكرة للحكاية.png'))
  .resize(1200, 600, { fit: 'cover', position: 'centre' })
  .jpeg({ quality: 85 })
  .toFile(join(PUBLIC, 'twitter-image.jpg'));
console.log('✓ twitter-image.jpg (1200x600)');

// 10. Web manifest icon copies
await sharp(SRC).resize(192, 192).toFile(join(PUBLIC, 'pwa-192.png'));
await sharp(SRC).resize(512, 512).toFile(join(PUBLIC, 'pwa-512.png'));
console.log('✓ pwa-192.png + pwa-512.png');

console.log('\n✅ All icons generated successfully!');

