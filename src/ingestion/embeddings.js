const axios = require('axios');
const OLLAMA_URL = 'http://localhost:11434';

async function getEmbedding(text) {
  const response = await axios.post(`${OLLAMA_URL}/api/embed`, {
    model: 'nomic-embed-text:v1.5',
    input: text
    });

  return response.data.embeddings[0];
}

async function getEmbeddingsForChunks(chunks) {
  // const results = [];

  // for (const chunk of chunks) {
  //   const embedding = await getEmbedding(chunk);
  //   results.push({ chunk, embedding });
  // }

  // return results;
  const embeddings = await Promise.all(
    chunks.map(chunk=>getEmbedding(chunk))
  );

  return chunks.map((chunk, i) => ({
    chunk,
    embedding: embeddings[i],
  }));
}

module.exports = {
  getEmbedding,
  getEmbeddingsForChunks,
};