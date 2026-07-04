const fs = require('fs');
const path = require('path');
function walk(dir) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const filePath = path.join(dir, file);
    if (fs.statSync(filePath).isDirectory()) {
      if (!filePath.includes('node_modules')) walk(filePath);
    } else if (filePath.endsWith('.tsx')) {
      let content = fs.readFileSync(filePath, 'utf-8');
      let changed = false;
      if (content.includes('\\`')) {
        content = content.replace(/\\`/g, '`');
        changed = true;
      }
      if (content.includes('\\$')) {
        content = content.replace(/\\\$/g, '$');
        changed = true;
      }
      if (changed) {
        fs.writeFileSync(filePath, content, 'utf-8');
        console.log('Fixed', filePath);
      }
    }
  }
}
walk('c:/Users/maris/Downloads/unnati/src/components');
