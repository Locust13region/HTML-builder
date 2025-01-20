const { rm, mkdir, readdir, copyFile } = require('fs/promises');
const { join } = require('path');
const sourcePath = join(__dirname, 'files');
const targetPath = join(__dirname, 'files-copy');

async function copyDir(sourcePath, targetPath) {
  try {
    await rm(targetPath, { recursive: true, force: true });
    await mkdir(targetPath);
    const files = await readdir(sourcePath, { withFileTypes: true });

    for (const file of files) {
      const srcFilePath = join(sourcePath, file.name);
      const trgFilePath = join(targetPath, file.name);
      if (file.isFile()) {
        await copyFile(srcFilePath, trgFilePath);
      } else if (file.isDirectory()) {
        await copyDir(srcFilePath, trgFilePath);
      }
    }
  } catch (err) {
    console.error(err.message);
  }
}

copyDir(sourcePath, targetPath);
