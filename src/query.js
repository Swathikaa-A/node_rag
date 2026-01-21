const readline = require('readline');
const axios = require('axios');
const { getEmbedding } = require('./ingestion/embeddings');
const { querySimilar } = require('./vectordb');
const OLLAMA_URL = 'http://localhost:11434';

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

rl.question('Enter your question: ', async (query) => {
  try {
    const queryEmbedding = await getEmbedding(query);
    const context = await querySimilar(queryEmbedding, 3);

    const prompt = `
You are an expert in blockchain technology. Use the context below to answer the question clearly, concisely, and in your own words. 

Instructions:
- Answer in 3-5 sentences (or bullets if needed).  
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

    const res = await axios.post(`${OLLAMA_URL}/api/chat`, {
      model: 'gemma3:1b',
      stream: false,
      messages: [
        { role: 'user', content: prompt }
      ]
    });

    const answer = res.data?.message?.content;

    if (!answer) {
      throw new Error('No response content returned from Ollama');
    }

    console.log('\nAnswer:\n', answer);

  } catch (e) {
    console.error(e.message);
  } finally {
    rl.close();
  }
});
