const { createReadStream, createWriteStream } = require('fs');
const { mkdir, rm, readdir, copyFile } = require('fs/promises');
const { join, parse } = require('path');
const dist = join(__dirname, 'project-dist');
const stylesPath = join(__dirname, 'styles');
const assetsPath = join(__dirname, 'assets');

(function createDistDir() {
  try {
    mkdir(dist, {
      recursive: true,
    });
  } catch (err) {
    console.error('Ошибка:', err.message);
  }
})();

(async function createIndexFile() {
  function map(elem) {
    return `{{${elem}}}`;
  }

  try {
    let str = '';
    const input = createReadStream(join(__dirname, 'template.html'), 'utf-8');

    str = await new Promise((resolve, reject) => {
      let data = '';
      input.on('data', (chunk) => {
        data += chunk;
      });
      input.on('end', () => resolve(data));
      input.on('error', (err) => reject(err));
    });

    const output = createWriteStream(join(dist, 'index.html'), { flags: 'w' });
    const componentsPath = join(__dirname, 'components');

    const files = await readdir(componentsPath, { withFileTypes: true });

    for (const file of files) {
      if (file.isFile() && file.name.endsWith('.html')) {
        const compName = map(parse(file.name).name);
        const componentContent = await new Promise((resolve, reject) => {
          const readableStream = createReadStream(
            join(componentsPath, file.name),
            'utf-8',
          );

          let content = '';
          readableStream.on('data', (chunk) => {
            content += chunk;
          });
          readableStream.on('end', () => resolve(content));
          readableStream.on('error', (err) => reject(err));
        });

        str = str.replace(new RegExp(compName, 'g'), componentContent);
      }
    }

    output.write(str);
  } catch (err) {
    console.error('Ошибка:', err.message);
  }
})();

(async function compStyles() {
  try {
    const files = await readdir(stylesPath, { withFileTypes: true });
    const writeStream = createWriteStream(join(dist, 'style.css'));
    for (const file of files) {
      if (file.isFile && file.name.endsWith('.css')) {
        const readStream = createReadStream(join(stylesPath, file.name), {
          encoding: 'utf8',
        });
        readStream.on('data', (chunk) =>
          writeStream.write(chunk.toString() + '\n'),
        );
      }
    }
  } catch (err) {
    console.error(err.message);
  }
})();

(async function copyDir(
  sourcePath = assetsPath,
  targetPath = join(dist, 'assets'),
) {
  try {
    await rm(targetPath, { recursive: true, force: true });
    await mkdir(targetPath);
    const files = await readdir(sourcePath, { withFileTypes: true });

    for (const file of files) {
      const srcFilePath = join(sourcePath, file.name);
      const trgFilePath = join(targetPath, file.name);
      console.log(file);
      console.log('isFile', file.isFile);
      if (file.isFile()) {
        await copyFile(srcFilePath, trgFilePath);
      } else if (file.isDirectory()) {
        await copyDir(srcFilePath, trgFilePath);
      }
    }
  } catch (err) {
    console.error(err.message);
  }
})();
