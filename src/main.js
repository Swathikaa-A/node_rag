import readline from 'readline';
import { getChunks } from './ingestion/chunks.js';
import { getEmbeddingsForChunks, getEmbedding } from './ingestion/embeddings.js';
import { initCollection, uploadChunks, querySimilar } from './vectordb.js';
import { queryLLM } from './llm.js';

async function main() {
  const chunks = await getChunks('./source.txt');
  console.log('Chunks created:', chunks.length);

  const chunksWithEmbeddings = await getEmbeddingsForChunks(chunks);
  await initCollection(chunksWithEmbeddings[0].embedding.length);
  await uploadChunks(chunksWithEmbeddings);
  console.log('Chunks uploaded to Qdrant');

  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });

  rl.question('Enter your blockchain question: ', async (query) => {
    try {
      const queryEmbedding = await getEmbedding(query);

      const context = await querySimilar(queryEmbedding, 3);

      const llmPrompt = `
You are an expert in blockchain technology. Use the context below to answer the question clearly, concisely, and in your own words. 

Instructions:
- Answer in 3–5 sentences (or bullets if needed).  
- Explain key concepts simply, as if for a student.  
- Do not copy verbatim from the context; paraphrase.  
- Include examples if it helps clarify the concept.  
- Focus only on information relevant to the question.

Context:
${context.join('\n')}

Question:
${query}

Answer:
`;

      const answer = await queryLLM(llmPrompt);
      console.log('\nAnswer:\n', answer);
    } catch (err) {
      console.error('Error:', err);
    } finally {
      rl.close();
    }
  });
}

main();

