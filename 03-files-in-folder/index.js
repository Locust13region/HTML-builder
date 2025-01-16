const fs = require('fs/promises');
const path = require('path');

const secretPath = path.join(__dirname, 'secret-folder');

async function readSecretFolder(folderPath) {
  try {
    const files = await fs.readdir(folderPath, { withFileTypes: true });

    for (const file of files) {
      const filePath = path.join(folderPath, file.name);

      if (file.isFile()) {
        const fileExt = path.extname(file.name).slice(1);
        const fileName = path.parse(file.name).name;

        const stats = await fs.stat(filePath);
        const fileSize = (stats.size / 1024).toFixed(3);

        console.log(`${fileName} - ${fileExt} - ${fileSize} KB`);
      }
    }
  } catch (err) {
    console.error('Ошибка чтения папки:', err.message);
  }
}

readSecretFolder(secretPath);
