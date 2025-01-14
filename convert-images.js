import sharp from 'sharp';
import { promises as fs } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function convertToWebP() {
  try {
    const publicDir = path.join(__dirname, 'public');
    const files = await fs.readdir(publicDir);
    
    for (const file of files) {
      if (file.match(/\.(png|jpg|jpeg)$/i)) {
        const inputPath = path.join(publicDir, file);
        const outputPath = path.join(publicDir, `${path.parse(file).name}.webp`);
        
        await sharp(inputPath)
          .webp({ quality: 80 })
          .toFile(outputPath);
        
        console.log(`Converted ${file} to WebP`);
      }
    }
  } catch (error) {
    console.error('Error converting images:', error);
  }
}

convertToWebP();
