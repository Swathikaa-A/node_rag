const { QdrantClient } = require('@qdrant/js-client-rest');
const crypto = require('crypto');

const client = new QdrantClient({ url: 'http://localhost:6333' });

async function initCollection(vectorSize) {
  try {
    await client.createCollection('documents', {
      vectors: {
        size: vectorSize,
        distance: 'Cosine',
      },
    });
    console.log('Quadrant collection created');
  } catch (e) {
    console.log('Collection may already exist');
  }
}

async function uploadChunks(chunksWithEmbeddings) {
  const points = chunksWithEmbeddings.map((item) => ({
    id: crypto.randomUUID(),
    vector: item.embedding,
    payload: { text: item.chunk },
  }));

  await client.upsert('documents', {
    wait: true, 
    points,
  });
}

async function querySimilar(queryEmbedding, limit = 3) {
  const results = await client.search('documents', {
    vector: queryEmbedding,
    limit,
  });

  return results.map(r => r.payload.text);
}

module.exports = {
    initCollection,
    uploadChunks,
    querySimilar,
};
