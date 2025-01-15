const fs = require('fs');
const path = require('path');

const textPath = path.resolve(__dirname, 'text.txt');
const stream = fs.createReadStream(textPath, { encoding: 'utf-8' });
stream.on('data', (chunk) => console.log(chunk));
stream.on('error', (error) => console.log(error));
