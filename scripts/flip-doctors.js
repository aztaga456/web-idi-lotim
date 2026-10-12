const fs = require('fs');
const path = require('path');
const { PNG } = require('pngjs');

const inputPath = path.join(__dirname, '../public/images/hero-3-doctors-cutout.png');
const outputPath = path.join(__dirname, '../public/images/hero-3-doctors-flipped.png');

console.log('Loading:', inputPath);
const buffer = fs.readFileSync(inputPath);
const png = PNG.sync.read(buffer);

const width = png.width;
const height = png.height;
const flipped = new PNG({ width, height });

for (let y = 0; y < height; y++) {
  for (let x = 0; x < width; x++) {
    const srcIdx = (y * width + x) * 4;
    const dstIdx = (y * width + (width - 1 - x)) * 4;

    flipped.data[dstIdx] = png.data[srcIdx];
    flipped.data[dstIdx + 1] = png.data[srcIdx + 1];
    flipped.data[dstIdx + 2] = png.data[srcIdx + 2];
    flipped.data[dstIdx + 3] = png.data[srcIdx + 3];
  }
}

const outBuffer = PNG.sync.write(flipped);
fs.writeFileSync(outputPath, outBuffer);
console.log('Successfully saved flipped doctors PNG to:', outputPath);
