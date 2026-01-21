// import { spawn } from 'child_process';


// export function queryLLM(prompt) {
//   return new Promise((resolve, reject) => {
//     const llmProcess = spawn('ollama', ['run', 'gemma3:1b'], { stdio: ['pipe', 'pipe', 'pipe'] });

//     let output = '';
//     let errorOutput = '';

//     llmProcess.stdout.on('data', (data) => {
//       output += data.toString();
//     });

//     llmProcess.stderr.on('data', (data) => {
//       errorOutput += data.toString();
//     });

//     llmProcess.on('close', (code) => {
//       if (code !== 0) {
//         console.error('Error querying LLM:', errorOutput);
//         return reject(new Error(`Ollama exited with code ${code}`));
//       }
//       resolve(output.trim());
//     });

//     llmProcess.stdin.write(prompt);
//     llmProcess.stdin.end();
//   });
// }

const ollama = require('ollama');

async function queryLLM(prompt) {
  const response = await ollama.chat({
    model: 'gemma3:1b',
    messages: [
      { role: 'system', content: 'You are an expert in blockchain technology.' },
      { role: 'user', content: prompt }
    ]
  });

  return response.message.content.trim();
}

module.exports = { queryLLM };
