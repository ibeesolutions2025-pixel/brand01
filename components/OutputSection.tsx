import React, { useState } from 'react';
import { GeneratedResult } from '../types';

interface OutputSectionProps {
  results: GeneratedResult[] | null;
  aspectRatio: '9:16' | '16:9';
}

export const OutputSection: React.FC<OutputSectionProps> = ({ results, aspectRatio }) => {
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const downloadAllPrompts = () => {
    if (!results) return;
    const content = results.map(r => 
      `--- ${r.variantName} ---\n\n[PROMPT VEO 3]\n${r.veoPrompt}\n\n[KỊCH BẢN]\n${r.script}\n\n`
    ).join('=================================\n\n');
    
    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `veo-assets-all-${Date.now()}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const downloadAllImages = () => {
    if (!results) return;
    results.forEach((r, index) => {
      setTimeout(() => {
        const link = document.createElement('a');
        link.href = r.imageUrl;
        link.download = `veo-image-${r.variantName.replace(/\s+/g, '-')}.png`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      }, index * 500); // Stagger downloads to prevent blocking
    });
  };

  if (!results || results.length === 0) {
    return (
      <div className="bg-white rounded-2xl shadow-xl p-8 border border-slate-200 h-full min-h-[500px] flex flex-col items-center justify-center text-center sticky top-24">
        <div className="w-24 h-24 bg-slate-100 rounded-full flex items-center justify-center mb-6">
          <span className="text-4xl">🎬</span>
        </div>
        <h3 className="text-xl font-bold text-slate-800 mb-2">Chưa có kết quả</h3>
        <p className="text-slate-500 max-w-sm">
          Hãy tải ảnh và điền thông tin bên trái để AI tạo ra bộ nguyên liệu video chuyên nghiệp cho bạn.
        </p>
      </div>
    );
  }

  const isPortrait = aspectRatio === '9:16';

  return (
    <div className="space-y-6">
      
      {/* Header with Bulk Actions */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
        <div>
          <h2 className="text-lg font-bold text-slate-800">Kết quả ({results.length})</h2>
          <p className="text-xs text-slate-500">Đã tạo xong bộ nguyên liệu</p>
        </div>
        <div className="flex gap-2 w-full sm:w-auto">
          <button 
            onClick={downloadAllPrompts}
            className="flex-1 sm:flex-none px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-sm font-medium transition-colors flex items-center justify-center"
          >
            <span className="mr-2">📄</span> Tải Text
          </button>
          <button 
             onClick={downloadAllImages}
             className="flex-1 sm:flex-none px-4 py-2 bg-primary/10 hover:bg-primary/20 text-primary rounded-lg text-sm font-medium transition-colors flex items-center justify-center"
          >
            <span className="mr-2">🖼️</span> Tải Ảnh
          </button>
        </div>
      </div>

      {/* Results List */}
      <div className="space-y-8">
        {results.map((result, index) => (
          <div key={result.id} className="bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden">
            
            {/* Result Header */}
            <div className="bg-slate-50 border-b border-slate-100 p-4 flex justify-between items-center">
              <span className="font-bold text-slate-700 flex items-center">
                <span className="w-6 h-6 rounded-full bg-slate-200 flex items-center justify-center text-xs mr-2">{index + 1}</span>
                {result.variantName}
              </span>
              <span className="text-xs text-slate-400 font-mono">{aspectRatio}</span>
            </div>

            <div className="p-6 grid grid-cols-1 xl:grid-cols-2 gap-6">
              {/* Image Column */}
              <div className="flex flex-col items-center">
                 <div className={`relative shadow-lg rounded-lg overflow-hidden bg-slate-800 ${isPortrait ? 'w-[200px] aspect-[9/16]' : 'w-full aspect-[16/9]'}`}>
                    <img 
                      src={result.imageUrl} 
                      alt={result.variantName} 
                      className="w-full h-full object-cover"
                    />
                 </div>
                 <a 
                   href={result.imageUrl} 
                   download={`veo-image-${index}.png`}
                   className="mt-3 text-sm text-primary hover:underline flex items-center"
                 >
                   <svg className="w-4 h-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                   </svg>
                   Tải ảnh này
                 </a>
              </div>

              {/* Text Column */}
              <div className="space-y-4">
                {/* Prompt */}
                <div className="bg-slate-50 rounded-xl p-4 border border-slate-100">
                   <div className="flex justify-between items-center mb-2">
                      <span className="text-xs font-bold text-slate-500 uppercase">Veo 3 Prompt</span>
                      <button 
                        onClick={() => copyToClipboard(result.veoPrompt, `prompt-${result.id}`)}
                        className="text-xs text-primary hover:text-blue-700 font-medium"
                      >
                        {copiedId === `prompt-${result.id}` ? 'Đã copy' : 'Copy'}
                      </button>
                   </div>
                   <p className="text-xs text-slate-600 font-mono leading-relaxed max-h-32 overflow-y-auto">
                     {result.veoPrompt}
                   </p>
                </div>

                {/* Script */}
                <div className="bg-slate-50 rounded-xl p-4 border border-slate-100">
                   <div className="flex justify-between items-center mb-2">
                      <span className="text-xs font-bold text-slate-500 uppercase">Lời thoại (8s)</span>
                      <button 
                        onClick={() => copyToClipboard(result.script, `script-${result.id}`)}
                        className="text-xs text-primary hover:text-blue-700 font-medium"
                      >
                        {copiedId === `script-${result.id}` ? 'Đã copy' : 'Copy'}
                      </button>
                   </div>
                   <p className="text-sm text-slate-800 italic border-l-2 border-accent pl-3">
                     "{result.script}"
                   </p>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Footer Guide */}
      <div className="bg-blue-50 rounded-xl p-4 border border-blue-100 mt-6">
         <h4 className="text-blue-800 font-semibold text-sm mb-2">ℹ️ Hướng dẫn tiếp theo:</h4>
         <ol className="text-sm text-blue-700 list-decimal list-inside space-y-1">
           <li>Vào <b>Veo 3</b> hoặc <b>VideoFX</b></li>
           <li>Dùng ảnh Keyframe làm <b>First Frame</b></li>
           <li>Copy Prompt tiếng Anh vào mô tả</li>
           <li>Dùng lời thoại để thu âm</li>
         </ol>
      </div>

    </div>
  );
};