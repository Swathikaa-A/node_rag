const { getChunks } = require('./ingestion/chunks');
const { getEmbeddingsForChunks } = require('./ingestion/embeddings');
const { initCollection, uploadChunks } = require('./vectordb');

async function ingest() {
  const chunks = getChunks('./source.txt');
  console.log('Chunks created:', chunks.length);

  const chunksWithEmbeddings = await getEmbeddingsForChunks(chunks);

  await initCollection(chunksWithEmbeddings[0].embedding.length);
  await uploadChunks(chunksWithEmbeddings);

  console.log('Ingestion complete');
}

ingest();
