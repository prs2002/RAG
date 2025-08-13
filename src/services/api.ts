import axios from 'axios';

const API_BASE_URL = 'http://localhost:3001/api';

const api = axios.create({
  baseURL: API_BASE_URL,
});

export async function uploadPDF(file: File) {
  const formData = new FormData();
  formData.append('pdf', file);

  const response = await api.post('/upload', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });

  return response.data;
}

export async function chatWithPDF(message: string, fileName?: string | null) {
  const response = await api.post('/chat', {
    message,
    fileName,
  });

  return response.data;
}

export async function getUploadedFiles() {
  const response = await api.get('/files');
  return response.data;
}