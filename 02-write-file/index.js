const fs = require('node:fs');
const path = require('node:path');
const readline = require('node:readline');
const { stdin: input, stdout: output } = require('node:process');

const outputPath = path.resolve(__dirname, 'text.txt');
const stream = fs.createWriteStream(outputPath, { flags: 'a' });

const rl = readline.createInterface({ input, output });

console.log('Type some text here or "exit" to quit.');

rl.on('line', (input) => {
  if (input.trim().toLowerCase() === 'exit') {
    console.log('Bye!');
    rl.close();
  } else {
    stream.write(input + '\n');
  }
});

rl.on('SIGINT', () => {
  console.log('\nCtrl+C interruption');
  rl.close();
});

rl.on('close', () => {
  stream.end();
  process.exit(0);
});
