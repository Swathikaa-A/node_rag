import ollama from 'ollama';

export async function getEmbedding(text) {
  const response = await ollama.embeddings({
    model: 'nomic-embed-text:v1.5',
    prompt: text,
  });

  return response.embedding;
}

export async function getEmbeddingsForChunks(chunks) {
  const results = [];

  for (const chunk of chunks) {
    const embedding = await getEmbedding(chunk);
    results.push({ chunk, embedding });
  }

  return results;
}
