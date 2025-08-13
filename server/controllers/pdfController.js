import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { PDFService } from '../services/PDFService.js';
import { VectorStoreService } from '../services/VectorStoreService.js';
import { ChatService } from '../services/ChatService.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const pdfService = new PDFService();
const vectorStoreService = new VectorStoreService();
const chatService = new ChatService();

export async function uploadPDF(req, res) {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No PDF file uploaded' });
    }

    const filePath = req.file.path;
    const fileName = req.file.originalname;
    
    console.log(`Processing PDF: ${fileName}`);
    
    // Extract text from PDF
    const text = await pdfService.extractText(filePath);
    
    // Split text into chunks
    const chunks = await pdfService.splitIntoChunks(text);
    
    // Store in vector database
    await vectorStoreService.storeDocuments(chunks, fileName);
    
    console.log(`Successfully processed ${fileName} with ${chunks.length} chunks`);
    
    res.json({
      message: 'PDF uploaded and processed successfully',
      fileName,
      chunks: chunks.length
    });
    
  } catch (error) {
    console.error('Error processing PDF:', error);
    res.status(500).json({ error: 'Failed to process PDF' });
  }
}

export async function chatWithPDF(req, res) {
  try {
    const { message, fileName } = req.body;
    
    if (!message) {
      return res.status(400).json({ error: 'Message is required' });
    }

    if (!fileName) {
      return res.status(400).json({ error: 'Please select a PDF file first' });
    }
    
    console.log(`Chat query: ${message}`);
    console.log(`Selected file: ${fileName}`);

    // Get relevant documents
    const relevantDocs = await vectorStoreService.similaritySearch(message, fileName);
    console.log(`Retrieved ${relevantDocs.length} relevant documents`);
    relevantDocs.forEach((doc, index) => {
      console.log(`Document ${index + 1} content preview: ${doc.pageContent.substring(0, 150)}...`);
      console.log(`Document ${index + 1} metadata:`, doc.metadata);
    });
    
    if (!relevantDocs || relevantDocs.length === 0) {
      return res.json({ 
        response: "I couldn't find any relevant information in the selected document. Please try rephrasing your question or make sure the document contains information related to your query." 
      });
    }
    
    // Generate response
    const response = await chatService.generateResponse(message, relevantDocs);
    
    res.json({ response });
    
  } catch (error) {
    console.error('Error in chat:', error);
    res.status(500).json({ error: 'Failed to generate response' });
  }
}

export async function getUploadedFiles(req, res) {
  try {
    const uploadsDir = path.join(__dirname, '..', 'uploads');
    const files = fs.readdirSync(uploadsDir)
      .filter(file => file.endsWith('.pdf'))
      .map(file => ({
        name: file,
        uploadDate: fs.statSync(path.join(uploadsDir, file)).mtime
      }));
    
    res.json({ files });
  } catch (error) {
    console.error('Error getting files:', error);
    res.status(500).json({ error: 'Failed to get files' });
  }
}