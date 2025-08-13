import React, { useState, useEffect } from 'react';
import { FileText, Clock, RefreshCw } from 'lucide-react';
import { getUploadedFiles } from '../services/api';

interface FileInfo {
  name: string;
  uploadDate: string;
}

interface FileListProps {
  selectedFile: string | null;
  onFileSelect: (fileName: string) => void;
}

export function FileList({ selectedFile, onFileSelect }: FileListProps) {
  const [files, setFiles] = useState<FileInfo[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchFiles = async () => {
    setLoading(true);
    try {
      const response = await getUploadedFiles();
      setFiles(response.files);
    } catch (error) {
      console.error('Error fetching files:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFiles();
  }, []);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-semibold text-slate-900">Your Documents</h2>
        <button
          onClick={fetchFiles}
          disabled={loading}
          className="p-2 text-slate-400 hover:text-slate-600 transition-colors"
        >
          <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
        </button>
      </div>

      {loading ? (
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="animate-pulse">
              <div className="h-12 bg-slate-200 rounded-lg"></div>
            </div>
          ))}
        </div>
      ) : files.length === 0 ? (
        <div className="text-center py-8 text-slate-500">
          <FileText className="w-12 h-12 mx-auto mb-4 text-slate-300" />
          <p className="text-sm">No documents uploaded yet</p>
        </div>
      ) : (
        <div className="space-y-2">
          {files.map((file) => (
            <button
              key={file.name}
              onClick={() => onFileSelect(file.name)}
              className={`w-full text-left p-3 rounded-lg border transition-colors ${
                selectedFile === file.name
                  ? 'border-blue-500 bg-blue-50 text-blue-900'
                  : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50'
              }`}
            >
              <div className="flex items-start space-x-3">
                <FileText className={`w-5 h-5 flex-shrink-0 mt-0.5 ${
                  selectedFile === file.name ? 'text-blue-500' : 'text-slate-400'
                }`} />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate" title={file.name}>
                    {file.name.replace(/^\d+-/, '')}
                  </p>
                  <div className="flex items-center space-x-1 mt-1 text-xs text-slate-500">
                    <Clock className="w-3 h-3" />
                    <span>{formatDate(file.uploadDate)}</span>
                  </div>
                </div>
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}