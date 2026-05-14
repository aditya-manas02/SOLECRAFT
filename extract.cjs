const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const dir = 'public/models/shoes';
const files = fs.readdirSync(dir);
const zips = files.filter(f => f.endsWith('.zip'));

for (const zip of zips) {
  const name = zip.replace('.zip', '');
  const outDir = path.join(dir, name);
  
  if (!fs.existsSync(outDir)) {
    console.log('Extracting ' + zip + '...');
    try {
      execSync(`powershell -Command "Expand-Archive -Force -Path 'public/models/shoes/${zip}' -DestinationPath '${outDir}'"`);
      console.log('Extracted ' + zip);
    } catch (e) {
      console.error('Failed to extract ' + zip, e.message);
    }
  }
}
console.log('Done extraction.');
