import { QdrantClient } from '@qdrant/js-client-rest';

const client = new QdrantClient({ url: 'http://localhost:6333' });

export async function initCollection(vectorSize) {
  try {
    await client.createCollection('documents', {
      vectors: {
        size: vectorSize,
        distance: 'Cosine',
      },
    });
  } catch (e) {
    console.log('Collection may already exist');
  }
}

export async function uploadChunks(chunksWithEmbeddings) {
  const points = chunksWithEmbeddings.map((item, i) => ({
    id: i,
    vector: item.embedding,
    payload: { text: item.chunk },
  }));

  await client.upsert('documents', {
    wait: true,
    points,
  });
}

export async function querySimilar(queryEmbedding, limit = 3) {
  const results = await client.search('documents', {
    vector: queryEmbedding,
    limit,
  });

  return results.map(r => r.payload.text);
}
