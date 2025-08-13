import React, { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload, FileText, CheckCircle, AlertCircle, Loader } from 'lucide-react';
import { uploadPDF } from '../services/api';

interface FileUploadProps {
  onUploadSuccess: () => void;
}

export function FileUpload({ onUploadSuccess }: FileUploadProps) {
  const [uploading, setUploading] = useState(false);
  const [uploadStatus, setUploadStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [uploadMessage, setUploadMessage] = useState('');

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (!file || file.type !== 'application/pdf') {
      setUploadStatus('error');
      setUploadMessage('Please upload a PDF file');
      return;
    }

    setUploading(true);
    setUploadStatus('idle');
    
    try {
      const result = await uploadPDF(file);
      setUploadStatus('success');
      setUploadMessage(`Successfully processed ${result.fileName} with ${result.chunks} chunks`);
      onUploadSuccess();
    } catch (error) {
      setUploadStatus('error');
      setUploadMessage('Failed to upload PDF. Please try again.');
    } finally {
      setUploading(false);
    }
  }, [onUploadSuccess]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/pdf': ['.pdf']
    },
    multiple: false,
    disabled: uploading
  });

  return (
    <div className="bg-white rounded-xl shadow-lg p-8">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-slate-900 mb-2">Upload Your PDF</h2>
        <p className="text-slate-600">
          Upload a PDF document to start chatting with its contents
        </p>
      </div>

      <div
        {...getRootProps()}
        className={`border-2 border-dashed rounded-xl p-12 text-center transition-colors cursor-pointer ${
          isDragActive
            ? 'border-blue-400 bg-blue-50'
            : uploading
            ? 'border-slate-300 bg-slate-50'
            : 'border-slate-300 hover:border-blue-400 hover:bg-blue-50'
        }`}
      >
        <input {...getInputProps()} />
        
        <div className="flex flex-col items-center space-y-4">
          {uploading ? (
            <>
              <Loader className="w-12 h-12 text-blue-500 animate-spin" />
              <div className="text-lg font-medium text-slate-700">Processing PDF...</div>
              <div className="text-sm text-slate-500">Extracting text and creating embeddings</div>
            </>
          ) : (
            <>
              <div className="p-4 bg-blue-100 rounded-full">
                <Upload className="w-8 h-8 text-blue-600" />
              </div>
              
              {isDragActive ? (
                <div className="text-lg font-medium text-blue-600">Drop your PDF here</div>
              ) : (
                <div>
                  <div className="text-lg font-medium text-slate-700 mb-2">
                    Drag & drop your PDF here
                  </div>
                  <div className="text-sm text-slate-500">
                    or click to browse files
                  </div>
                </div>
              )}
              
              <div className="flex items-center space-x-2 text-sm text-slate-400">
                <FileText className="w-4 h-4" />
                <span>PDF files only</span>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Status Messages */}
      {uploadStatus !== 'idle' && (
        <div className={`mt-6 p-4 rounded-lg flex items-center space-x-3 ${
          uploadStatus === 'success' 
            ? 'bg-green-50 text-green-700' 
            : 'bg-red-50 text-red-700'
        }`}>
          {uploadStatus === 'success' ? (
            <CheckCircle className="w-5 h-5 flex-shrink-0" />
          ) : (
            <AlertCircle className="w-5 h-5 flex-shrink-0" />
          )}
          <span>{uploadMessage}</span>
        </div>
      )}
    </div>
  );
}