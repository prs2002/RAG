import React, { useState } from 'react';
import { FileUpload } from './components/FileUpload';
import { ChatInterface } from './components/ChatInterface';
import { FileList } from './components/FileList';
import { MessageSquare, Upload, FileText } from 'lucide-react';

function App() {
  const [activeTab, setActiveTab] = useState('upload');
  const [selectedFile, setSelectedFile] = useState(null);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-blue-600 rounded-lg">
                <FileText className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-slate-900">PDF Chat AI</h1>
                <p className="text-sm text-slate-600">Chat with your documents using AI</p>
              </div>
            </div>
            
            {/* Tab Navigation */}
            <nav className="flex space-x-1 bg-slate-100 rounded-lg p-1">
              <button
                onClick={() => setActiveTab('upload')}
                className={`flex items-center space-x-2 px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                  activeTab === 'upload'
                    ? 'bg-white text-blue-600 shadow-sm'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <Upload className="w-4 h-4" />
                <span>Upload</span>
              </button>
              <button
                onClick={() => setActiveTab('chat')}
                className={`flex items-center space-x-2 px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                  activeTab === 'chat'
                    ? 'bg-white text-blue-600 shadow-sm'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <MessageSquare className="w-4 h-4" />
                <span>Chat</span>
              </button>
            </nav>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <FileList 
              selectedFile={selectedFile}
              onFileSelect={setSelectedFile}
            />
          </div>

          {/* Main Content Area */}
          <div className="lg:col-span-3">
            {activeTab === 'upload' ? (
              <FileUpload onUploadSuccess={() => setActiveTab('chat')} />
            ) : (
              <ChatInterface selectedFile={selectedFile} />
            )}
          </div>
        </div>
      </main>
    </div>
  );
}

export default App;