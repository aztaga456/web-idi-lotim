const fs = require('fs');
const path = require('path');
const jpeg = require('jpeg-js');
const { PNG } = require('pngjs');

const inputPath = path.join(__dirname, '../public/images/hero-doctors-composite.jpg');
const outputPath = path.join(__dirname, '../public/images/hero-doctors-composite.png');

console.log('Loading:', inputPath);
const jpegData = fs.readFileSync(inputPath);
const raw = jpeg.decode(jpegData, { useTArray: true });

const width = raw.width;
const height = raw.height;

function getRGB(x, y) {
  const i = (y * width + x) * 4;
  return { r: raw.data[i], g: raw.data[i + 1], b: raw.data[i + 2] };
}

// Background detection: matches the pale off-white background
function isBgColor(r, g, b) {
  const isLight = r >= 234 && g >= 228 && b >= 224;
  const isLowSat = Math.abs(r - g) < 24 && Math.abs(r - b) < 28 && Math.abs(g - b) < 20;
  return isLight && isLowSat;
}

const isVisited = new Uint8Array(width * height);
const queue = [];

for (let x = 0; x < width; x++) {
  const t = getRGB(x, 0);
  if (isBgColor(t.r, t.g, t.b)) {
    isVisited[x] = 1;
    queue.push(x, 0);
  }
  const b = getRGB(x, height - 1);
  if (isBgColor(b.r, b.g, b.b)) {
    isVisited[(height - 1) * width + x] = 1;
    queue.push(x, height - 1);
  }
}

for (let y = 0; y < height; y++) {
  const l = getRGB(0, y);
  if (isBgColor(l.r, l.g, l.b)) {
    isVisited[y * width] = 1;
    queue.push(0, y);
  }
  const r = getRGB(width - 1, y);
  if (isBgColor(r.r, r.g, r.b)) {
    isVisited[y * width + width - 1] = 1;
    queue.push(width - 1, y);
  }
}

let head = 0;
while (head < queue.length) {
  const x = queue[head++];
  const y = queue[head++];

  const neighbors = [
    [x + 1, y],
    [x - 1, y],
    [x, y + 1],
    [x, y - 1],
  ];

  for (const [nx, ny] of neighbors) {
    if (nx >= 0 && nx < width && ny >= 0 && ny < height) {
      const nidx = ny * width + nx;
      if (!isVisited[nidx]) {
        const nrgb = getRGB(nx, ny);
        if (isBgColor(nrgb.r, nrgb.g, nrgb.b)) {
          isVisited[nidx] = 1;
          queue.push(nx, ny);
        }
      }
    }
  }
}

// Distance map from background to feather edges
const alphaMap = new Uint8Array(width * height);
for (let i = 0; i < width * height; i++) {
  alphaMap[i] = isVisited[i] ? 0 : 255;
}

// 1-pixel feathering pass: if a foreground pixel touches a background pixel, calculate smooth alpha based on brightness
for (let y = 1; y < height - 1; y++) {
  for (let x = 1; x < width - 1; x++) {
    const idx = y * width + x;
    if (!isVisited[idx]) {
      const hasBgNeighbor =
        isVisited[idx - 1] ||
        isVisited[idx + 1] ||
        isVisited[idx - width] ||
        isVisited[idx + width];
      if (hasBgNeighbor) {
        const p = getRGB(x, y);
        // If it's near background color, smoothly ramp alpha
        if (p.r > 220 && p.g > 215 && p.b > 210) {
          const bgDist = Math.max(0, 255 - Math.max(p.r, p.g, p.b));
          alphaMap[idx] = Math.min(255, Math.max(30, bgDist * 8));
        }
      }
    }
  }
}

const png = new PNG({ width, height });
for (let i = 0; i < width * height; i++) {
  const pIdx = i * 4;
  png.data[pIdx] = raw.data[pIdx];
  png.data[pIdx + 1] = raw.data[pIdx + 1];
  png.data[pIdx + 2] = raw.data[pIdx + 2];
  png.data[pIdx + 3] = alphaMap[i];
}

const buffer = PNG.sync.write(png);
fs.writeFileSync(outputPath, buffer);
console.log('Successfully saved feathered transparent hero PNG:', buffer.length, 'bytes');
