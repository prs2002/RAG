import { uploadPDF, chatWithPDF, getUploadedFiles } from '../controllers/pdfController.js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export function setupRoutes(app, upload) {
  // Ensure uploads directory exists
  const uploadsDir = path.join(__dirname, '..', 'uploads');
  if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir, { recursive: true });
  }

  // Routes
  app.post('/api/upload', upload.single('pdf'), uploadPDF);
  app.post('/api/chat', chatWithPDF);
  app.get('/api/files', getUploadedFiles);
  
  // Health check
  app.get('/api/health', (req, res) => {
    res.json({ status: 'OK', message: 'Server is running' });
  });
}