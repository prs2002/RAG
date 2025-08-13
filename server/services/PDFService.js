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
      const data = await pdfParse.default(dataBuffer);
      console.log(`Extracted ${data.text.length} characters from PDF`);
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