// import { PineconeStore } from '@langchain/community/vectorstores/pinecone';
// import { Document } from 'langchain/document';

import { Pinecone } from '@pinecone-database/pinecone';
import { PineconeStore } from "@langchain/pinecone";
import { Document } from "@langchain/core/documents";
import { OpenAIEmbeddings } from '@langchain/openai';
import { OllamaEmbeddings } from "@langchain/ollama";

export class VectorStoreService {
  constructor() {
    console.log('PINECONE_API_KEY:', process.env.PINECONE_API_KEY);
    this.pinecone = new Pinecone({
      apiKey: process.env.PINECONE_API_KEY,
    });
    
    // this.embeddings = new OpenAIEmbeddings({
    //   openAIApiKey: process.env.OPENAI_API_KEY,
    //   modelName: 'text-embedding-ada-002',
    // });
    this.embeddings = new OllamaEmbeddings({
      model: 'all-minilm:latest',
      baseUrl: process.env.OLLAMA_BASE_URL,
    });
    
    this.indexName = process.env.PINECONE_INDEX_NAME;
    this.vectorStores = new Map(); // Cache vector stores per file

  }

  async storeDocuments(chunks, fileName) {
    try {
      const index = this.pinecone.Index(this.indexName);
      const namespace = this.getNamespace(fileName);

      const documents = chunks.map((chunk, i) => 
        new Document({
          pageContent: chunk,
          metadata: {
            source: fileName,
            chunkId: i,
            timestamp: new Date().toISOString()
          }
        })
      );

      const vectorStore = await PineconeStore.fromDocuments(documents, this.embeddings, {
        pineconeIndex: index,
        // namespace: fileName.replace(/[^a-zA-Z0-9]/g, '_'),
        namespace: namespace,
      });
      this.vectorStores.set(fileName, vectorStore);

      console.log(`Stored ${documents.length} documents for ${fileName}`);
    } catch (error) {
      console.error('Error storing documents:', error);
      throw error;
    }
  }
  getNamespace(fileName) {
    return fileName.replace(/[^a-zA-Z0-9]/g, '_').toLowerCase();
  }

  async similaritySearch(query, fileName, k = 4) {
    try {
      if (!fileName) {
        throw new Error('fileName is required for similarity search');
      }

      const namespace = this.getNamespace(fileName);
      
      console.log(`Searching for: "${query}" in namespace: ${namespace}`);
      
      // Try to get cached vector store first
      let vectorStore = this.vectorStores.get(fileName);
      if (!vectorStore) {
        // Create new vector store connection
        const index = this.pinecone.Index(this.indexName);
        vectorStore = new PineconeStore(this.embeddings, {
          pineconeIndex: index,
          namespace: namespace,
        });
        this.vectorStores.set(fileName, vectorStore);
      }

      const results = await vectorStore.similaritySearch(query, k);
      console.log(`Found ${results.length} similar documents`);
      
      if (results.length === 0) {
        console.log(`No documents found in namespace: ${namespace}`);
        // Try to search without namespace as fallback
        const fallbackVectorStore = new PineconeStore(this.embeddings, {
          pineconeIndex: this.pinecone.Index(this.indexName),
        });
        const fallbackResults = await fallbackVectorStore.similaritySearch(query, k);
        console.log(`Fallback search found ${fallbackResults.length} documents`);
        return fallbackResults;
      }
      
      // Enhanced logging for retrieved relevant documents
      console.log('\n=== RETRIEVED RELEVANT DOCUMENTS ===');
      results.forEach((doc, index) => {
        console.log(`\n--- Document ${index + 1} ---`);
        console.log(`Source: ${doc.metadata.source}`);
        console.log(`Chunk ID: ${doc.metadata.chunkId}`);
        console.log(`Timestamp: ${doc.metadata.timestamp}`);
        console.log(`Content Preview: ${doc.pageContent.substring(0, 300)}...`);
        console.log(`Full Content Length: ${doc.pageContent.length} characters`);
        if (doc.pageContent.length > 300) {
          console.log(`... (truncated for preview)`);
        }
      });
      console.log('=== END RETRIEVED DOCUMENTS ===\n');

      return results;
    } catch (error) {
      console.error('Error in similarity search:', error);
      throw error;
    }
  }
}