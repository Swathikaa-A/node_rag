Initialize dependencies:
npm init -y
npm install ollama llm-splitter @qdrant/js-client-rest qdrant-node axios

Pull the LLM model :
ollama pull gemma3:1b

Start Qdrant using Docker:
docker run -p 6333:6333 qdrant/qdrant

Run the pipeline:
npm run ingest
npm run query
