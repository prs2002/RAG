import { ChatOllama } from "@langchain/ollama";
import { ChatOpenAI } from '@langchain/openai';
import { PromptTemplate } from '@langchain/core/prompts';
import { RunnableSequence } from '@langchain/core/runnables';

export class ChatService {
  constructor() {
    // Use Ollama as the free option, fallback to OpenAI if configured
    if (process.env.OLLAMA_BASE_URL) {
      this.llm = new ChatOllama({
        baseUrl: process.env.OLLAMA_BASE_URL,
        model: 'llama3:8b',
        temperature: 0.7,
      });
      console.log(`Using Ollama at ${process.env.OLLAMA_BASE_URL} with model llama3:8b`);
    } else if (process.env.OPENAI_API_KEY) {
      this.llm = new ChatOpenAI({
        openAIApiKey: process.env.OPENAI_API_KEY,
        modelName: 'gpt-3.5-turbo',
        temperature: 0.7,
      });
      console.log('Using OpenAI GPT-3.5-turbo');
    } else {
      throw new Error('No LLM configured. Please set up either Ollama or OpenAI.');
    }

    this.promptTemplate = PromptTemplate.fromTemplate(`
      You are a helpful AI assistant that answers questions based on the provided context from PDF documents.
      
      Context from PDF:
      {context}
      
      Question: {question}
      
      Please provide a comprehensive answer based on the context provided. If the context doesn't contain enough information to answer the question, say so clearly.
      
      Answer:
    `);
  }

  async generateResponse(question, relevantDocs) {
    try {
            // Debug logging
      console.log(`Question: ${question}`);
      console.log(`Found ${relevantDocs.length} relevant documents`);
      
      if (!relevantDocs || relevantDocs.length === 0) {
        return "I couldn't find any relevant information in the document to answer your question. Please make sure you've uploaded a PDF and try rephrasing your question.";
      }

      const context = relevantDocs.map(doc => doc.pageContent).join('\n\n');
      console.log(`Context length: ${context.length} characters`);

      const chain = RunnableSequence.from([
        this.promptTemplate,
        this.llm,
      ]);

      const response = await chain.invoke({
        context: context,
        question: question,
      });

      return response.content || response;
    } catch (error) {
      console.error('Error generating response:', error);

      if (error.message.includes('ECONNREFUSED')) {
        throw new Error('Cannot connect to Ollama. Make sure Ollama is running with: ollama serve');
      }

      throw error;
    }
  }
}