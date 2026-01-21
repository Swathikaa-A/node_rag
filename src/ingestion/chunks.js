const fs = require('fs');
const {split} = require('llm-splitter');

function getChunks(filePath) {
  const text = fs.readFileSync(filePath, 'utf-8');

  const rawChunks = split(text, {
    chunkSize: 500,
    chunkOverlap: 50,
  });

  const chunks = rawChunks.map(chunk => chunk.text);
  return chunks;
}

module.exports = {getChunks};