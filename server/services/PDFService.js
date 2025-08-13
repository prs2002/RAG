import fs from 'fs';
// import pdfParse from 'pdf-parse';
import * as parser from "pdf-parse/lib/pdf-parse.js";

import { RecursiveCharacterTextSplitter } from 'langchain/text_splitter';

export class PDFService {
  constructor() {
    this.textSplitter = new RecursiveCharacterTextSplitter({
      chunkSize: 1000,
      chunkOverlap: 200,
      separators: ['\n\n', '\n', ' ', '']
    });
  }

  async extractText(filePath) {
    try {
      const dataBuffer = fs.readFileSync(filePath);
      const data = await parser.default(dataBuffer);
      console.log(`Extracted ${data.text.length} characters from PDF`);
      
      // Log the first 500 characters of extracted text for debugging
      const previewText = data.text.substring(0, 500);
      console.log('=== PDF EXTRACTED TEXT PREVIEW ===');
      console.log(previewText);
      if (data.text.length > 500) {
        console.log(`... (truncated, total length: ${data.text.length} characters)`);
      }
      console.log('=== END PDF TEXT PREVIEW ===');
      
      return data.text;
    } catch (error) {
      console.error('Error extracting text from PDF:', error);
      throw error;
    }
  }

  async splitIntoChunks(text) {
    try {
      const chunks = await this.textSplitter.splitText(text);
      return chunks.filter(chunk => chunk.trim().length > 0);
    } catch (error) {
      console.error('Error splitting text into chunks:', error);
      throw error;
    }
  }
}