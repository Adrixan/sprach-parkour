import { mkdir, writeFile } from 'fs/promises';
import { existsSync } from 'fs';

const ASSETS_DIR = 'public/assets';

const assets = [
  {
    filename: 'dude.png',
    url: 'https://raw.githubusercontent.com/phaserjs/examples/master/public/src/games/firstgame/assets/dude.png'
  },
  {
    filename: 'platform.png',
    url: 'https://raw.githubusercontent.com/phaserjs/examples/master/public/src/games/firstgame/assets/platform.png'
  },
  {
    filename: 'sky.png',
    url: 'https://raw.githubusercontent.com/phaserjs/examples/master/public/src/games/firstgame/assets/sky.png'
  },
  {
    filename: 'star.png',
    url: 'https://raw.githubusercontent.com/phaserjs/examples/master/public/src/games/firstgame/assets/star.png'
  }
];

async function downloadAsset(url) {
  return new Promise((resolve, reject) => {
    const https = url.startsWith('https') ? require('https') : require('http');
    https.get(url, (res) => {
      const chunks = [];
      res.on('data', (chunk) => chunks.push(chunk));
      res.on('end', () => resolve(Buffer.concat(chunks)));
      res.on('error', reject);
    }).on('error', reject);
  });
}

async function main() {
  console.log('Setting up assets directory...');
  
  if (!existsSync(ASSETS_DIR)) {
    await mkdir(ASSETS_DIR, { recursive: true });
  }

  for (const asset of assets) {
    try {
      console.log(`Downloading ${asset.filename}...`);
      const buffer = await downloadAsset(asset.url);
      await writeFile(`${ASSETS_DIR}/${asset.filename}`, buffer);
      console.log(`✓ Saved ${asset.filename}`);
    } catch (error) {
      console.error(`✗ Failed to download ${asset.filename}:`, error.message);
    }
  }

  console.log('Asset download complete!');
}

main().catch(console.error);
