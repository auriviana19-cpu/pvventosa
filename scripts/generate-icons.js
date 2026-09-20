// Gera os ícones PNG do PWA (sem dependências externas) a partir do mesmo
// desenho simples do icon.svg: fundo azul + 3 barras brancas ascendentes.
const fs = require("fs");
const path = require("path");
const zlib = require("zlib");

const OUT_DIR = path.join(__dirname, "..", "public", "icons");
const BG = [0x2a, 0x78, 0xd6, 0xff];
const FG = [0xff, 0xff, 0xff, 0xff];

const BARS = [
  { x: 24, y: 54, w: 14, h: 26 },
  { x: 43, y: 40, w: 14, h: 40 },
  { x: 62, y: 24, w: 14, h: 56 },
];

function crc32(buf) {
  let c;
  const table = crc32.table || (crc32.table = (() => {
    const t = [];
    for (let n = 0; n < 256; n++) {
      c = n;
      for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
      t[n] = c;
    }
    return t;
  })());
  let crc = 0xffffffff;
  for (let i = 0; i < buf.length; i++) crc = table[(crc ^ buf[i]) & 0xff] ^ (crc >>> 8);
  return (crc ^ 0xffffffff) >>> 0;
}

function chunk(type, data) {
  const typeBuf = Buffer.from(type, "ascii");
  const len = Buffer.alloc(4);
  len.writeUInt32BE(data.length, 0);
  const crcBuf = Buffer.alloc(4);
  crcBuf.writeUInt32BE(crc32(Buffer.concat([typeBuf, data])), 0);
  return Buffer.concat([len, typeBuf, data, crcBuf]);
}

function encodePng(width, height, rgba) {
  const signature = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]);
  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(width, 0);
  ihdr.writeUInt32BE(height, 4);
  ihdr[8] = 8; // bit depth
  ihdr[9] = 6; // color type RGBA
  ihdr[10] = 0;
  ihdr[11] = 0;
  ihdr[12] = 0;

  const stride = width * 4;
  const raw = Buffer.alloc((stride + 1) * height);
  for (let y = 0; y < height; y++) {
    raw[y * (stride + 1)] = 0; // no filter
    rgba.copy(raw, y * (stride + 1) + 1, y * stride, y * stride + stride);
  }
  const idat = zlib.deflateSync(raw, { level: 9 });

  return Buffer.concat([signature, chunk("IHDR", ihdr), chunk("IDAT", idat), chunk("IEND", Buffer.alloc(0))]);
}

function drawIcon(size, padScale) {
  const buf = Buffer.alloc(size * size * 4);
  for (let i = 0; i < size * size; i++) buf.set(BG, i * 4);

  const cx = 50;
  const cy = 50;
  const scale = (size / 100) * padScale;

  for (const bar of BARS) {
    const x0 = Math.round((cx + (bar.x - cx)) * scale + (size - size * padScale) / 2);
    const y0 = Math.round((cy + (bar.y - cy)) * scale + (size - size * padScale) / 2);
    const w = Math.round(bar.w * scale);
    const h = Math.round(bar.h * scale);
    for (let y = y0; y < y0 + h && y < size; y++) {
      if (y < 0) continue;
      for (let x = x0; x < x0 + w && x < size; x++) {
        if (x < 0) continue;
        buf.set(FG, (y * size + x) * 4);
      }
    }
  }
  return buf;
}

fs.mkdirSync(OUT_DIR, { recursive: true });

const targets = [
  { name: "icon-192.png", size: 192, padScale: 1 },
  { name: "icon-512.png", size: 512, padScale: 1 },
  { name: "icon-maskable-512.png", size: 512, padScale: 0.7 },
  { name: "apple-touch-icon.png", size: 180, padScale: 1 },
];

for (const t of targets) {
  const rgba = drawIcon(t.size, t.padScale);
  const png = encodePng(t.size, t.size, rgba);
  fs.writeFileSync(path.join(OUT_DIR, t.name), png);
  console.log(`gerado ${t.name}`);
}
