# RAG PDF Chat Application

A sophisticated RAG (Retrieval Augmented Generation) application that allows users to upload PDF documents and chat with their contents using AI. Built with React, Node.js, LangChain, PineconeDB, and supports free LLMs via Ollama.

## Features

- **PDF Processing**: Upload and extract text from PDF documents
- **Vector Storage**: Store document embeddings in PineconeDB for efficient retrieval
- **AI Chat**: Interactive chat interface with streaming responses
- **Multiple LLM Support**: Use free models via Ollama or OpenAI
- **Document Management**: View and select from uploaded documents
- **Responsive Design**: Modern, clean UI that works on all devices

## Setup Instructions

### Prerequisites

1. **Pinecone Account**: Create a free account at [Pinecone](https://www.pinecone.io/)
2. **Ollama** (Free Option): Install [Ollama](https://ollama.ai/) locally
   - After installation, run: `ollama pull llama2`
3. **OpenAI API Key** (Alternative): Get from [OpenAI](https://platform.openai.com/api-keys)

### Installation

1. Clone and install dependencies:
```bash
npm install
cd server && npm install
```

2. Create environment file:
```bash
cp server/.env.example server/.env
```

3. Configure your environment variables in `server/.env`:
```env
# Pinecone Configuration (Required)
PINECONE_API_KEY=your_pinecone_api_key
PINECONE_INDEX_NAME=pdf-chat

# Ollama Configuration (Free Option)
OLLAMA_BASE_URL=http://localhost:11434

# OpenAI Configuration (Alternative)
OPENAI_API_KEY=your_openai_api_key

# Server Configuration
PORT=3001
```

4. Set up Pinecone Index:
   - Create a new index in Pinecone console
   - Use dimension: 1536 (for OpenAI embeddings)
   - Use metric: cosine

5. Start Ollama (if using free option):
```bash
ollama serve
ollama pull llama2
```

### Running the Application

Start both frontend and backend:
```bash
npm run dev
```

Or start them separately:
```bash
# Frontend (port 5173)
npm run dev:client

# Backend (port 3001)
npm run dev:server
```

## Usage

1. **Upload PDF**: Use the upload tab to drag and drop or select PDF files
2. **Select Document**: Choose a processed document from the sidebar
3. **Chat**: Ask questions about your document content
4. **Get Responses**: Receive AI-powered answers based on document context

## Architecture

- **Frontend**: React with TypeScript and Tailwind CSS
- **Backend**: Node.js with Express
- **AI Framework**: LangChain for RAG pipeline
- **Vector Database**: PineconeDB for embeddings storage
- **LLM**: Ollama (free) or OpenAI GPT models
- **File Processing**: PDF-parse for text extraction

## API Endpoints

- `POST /api/upload` - Upload and process PDF
- `POST /api/chat` - Chat with document
- `GET /api/files` - Get uploaded documents
- `GET /api/health` - Health check

## Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## License

MIT License - feel free to use this project for personal or commercial purposes.