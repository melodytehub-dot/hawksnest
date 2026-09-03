import sharp from 'sharp';
import fs from 'node:fs';
import path from 'node:path';

const DIR = path.resolve('public/images/airbnb');
const files = fs.readdirSync(DIR).filter((f) => f.endsWith('.jpg') || f.endsWith('.jpeg'));
const maxW = 1600;

let totalIn = 0, totalOut = 0;

for (const f of files) {
  const full = path.join(DIR, f);
  const inBuf = fs.statSync(full).size;
  totalIn += inBuf;
  try {
    const meta = await sharp(full).metadata();
    const img = sharp(full).rotate();
    if ((meta.width || 0) > maxW) {
      img.resize({ width: maxW, withoutEnlargement: true });
    }
    const outBuf = await img.jpeg({ quality: 74, mozjpeg: true }).toBuffer();
    fs.writeFileSync(full, outBuf);
    totalOut += outBuf.length;
  } catch (e) {
    console.log('SKIP', f, e.message);
  }
}

console.log(`Optimized ${files.length} images: ${(totalIn/1e6).toFixed(1)}MB -> ${(totalOut/1e6).toFixed(1)}MB`);
