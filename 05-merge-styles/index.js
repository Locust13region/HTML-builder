const { createReadStream, createWriteStream } = require('fs');
const { readdir } = require('fs/promises');
const { join } = require('path');
const stylesPath = join(__dirname, 'styles');
const bundlePath = join(__dirname, 'project-dist', 'bundle.css');

async function compStyles(stylesPath, bundlePath) {
  try {
    const files = await readdir(stylesPath, { withFileTypes: true });
    const writeStream = createWriteStream(bundlePath);
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
}

compStyles(stylesPath, bundlePath);
