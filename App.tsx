import React, { useState } from 'react';
import { DEFAULT_SETTINGS } from './constants';
import { GenerationSettings, GeneratedResult } from './types';
import { generateAssets } from './services/geminiService';
import { InputSection } from './components/InputSection';
import { OutputSection } from './components/OutputSection';

const App: React.FC = () => {
  const [settings, setSettings] = useState<GenerationSettings>(DEFAULT_SETTINGS);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  // Changed: result is now an array
  const [results, setResults] = useState<GeneratedResult[] | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleGenerate = async () => {
    if (!selectedFile) {
      setError('Vui lòng chọn ảnh.');
      return;
    }
    if (!settings.content.trim()) {
      setError('Vui lòng nhập nội dung.');
      return;
    }
    if (settings.background === 'custom' && !settings.customBackground.trim()) {
      setError('Vui lòng nhập mô tả cho không gian tùy chỉnh.');
      return;
    }
    
    // Check for API Key
    const apiKey = process.env.API_KEY;
    if (!apiKey) {
      setError('API Key chưa được cấu hình. Vui lòng kiểm tra môi trường.');
      return;
    }

    setIsGenerating(true);
    setError(null);
    setResults(null); // Clear previous result while loading

    try {
      const data = await generateAssets(apiKey, selectedFile, settings);
      setResults(data);
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'Có lỗi xảy ra trong quá trình tạo nội dung. Vui lòng thử lại.');
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 pb-20">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-3">
             <div className="w-10 h-10 bg-gradient-to-br from-primary to-blue-600 rounded-lg flex items-center justify-center text-white text-xl shadow-lg">
                V
             </div>
             <div>
               <h1 className="text-xl font-bold text-slate-900 tracking-tight">VeoAsset Creator</h1>
               <p className="text-xs text-slate-500 font-medium">GenAI cho Thương Hiệu Cá Nhân</p>
             </div>
          </div>
          <div className="hidden md:flex space-x-6 text-sm font-medium text-slate-600">
             <span>✨ Powered by Gemini 2.5</span>
             <span>Batch Generation Support</span>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Intro */}
        <div className="mb-8 text-center max-w-2xl mx-auto">
          <h2 className="text-3xl font-bold text-slate-900 mb-3">Tạo Video Talking-Head từ 1 Bức Ảnh</h2>
          <p className="text-slate-600">
            AI sẽ giúp bạn tối ưu hình ảnh, viết prompt cho Veo 3 và kịch bản 8 giây chuyên nghiệp. Hỗ trợ tạo hàng loạt phiên bản.
          </p>
        </div>

        {/* Error Message */}
        {error && (
          <div className="max-w-4xl mx-auto mb-6 p-4 bg-red-50 border border-red-200 text-red-700 rounded-xl flex items-center">
            <svg className="w-5 h-5 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            {error}
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: Input Form */}
          <div className="lg:col-span-5 xl:col-span-4">
            <InputSection
              settings={settings}
              setSettings={setSettings}
              onFileChange={setSelectedFile}
              selectedFile={selectedFile}
              isGenerating={isGenerating}
              onGenerate={handleGenerate}
            />
          </div>

          {/* Right Column: Results */}
          <div className="lg:col-span-7 xl:col-span-8">
             <OutputSection 
               results={results} 
               aspectRatio={settings.aspectRatio} 
             />
          </div>
        </div>
      </main>
    </div>
  );
};

export default App;