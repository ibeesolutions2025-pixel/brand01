import React, { useRef } from 'react';
import { GenerationSettings } from '../types';
import { BACKGROUND_OPTIONS, STYLE_OPTIONS, TONE_OPTIONS, QUANTITY_OPTIONS } from '../constants';

interface InputSectionProps {
  settings: GenerationSettings;
  setSettings: React.Dispatch<React.SetStateAction<GenerationSettings>>;
  onFileChange: (file: File) => void;
  selectedFile: File | null;
  isGenerating: boolean;
  onGenerate: () => void;
}

export const InputSection: React.FC<InputSectionProps> = ({
  settings,
  setSettings,
  onFileChange,
  selectedFile,
  isGenerating,
  onGenerate
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      onFileChange(e.target.files[0]);
    }
  };

  const updateSetting = (key: keyof GenerationSettings, value: any) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };

  return (
    <div className="bg-white rounded-2xl shadow-xl p-6 md:p-8 space-y-8 border border-slate-200">
      
      {/* 1. Image Upload */}
      <section>
        <h3 className="text-lg font-semibold text-slate-800 mb-3 flex items-center">
          <span className="bg-primary/10 text-primary w-8 h-8 rounded-full flex items-center justify-center mr-2 text-sm">1</span>
          Tải ảnh người thật
        </h3>
        <div 
          onClick={() => fileInputRef.current?.click()}
          className={`
            border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all
            ${selectedFile ? 'border-primary bg-primary/5' : 'border-slate-300 hover:border-primary hover:bg-slate-50'}
          `}
        >
          <input 
            type="file" 
            ref={fileInputRef} 
            onChange={handleFileChange} 
            accept="image/*" 
            className="hidden" 
          />
          {selectedFile ? (
            <div className="flex flex-col items-center">
               <div className="w-20 h-20 rounded-full overflow-hidden bg-slate-200 mb-3 border-2 border-white shadow-md">
                  <img src={URL.createObjectURL(selectedFile)} alt="Preview" className="w-full h-full object-cover" />
               </div>
               <p className="text-primary font-medium truncate max-w-[200px]">{selectedFile.name}</p>
               <p className="text-xs text-slate-500 mt-1">Nhấn để thay đổi</p>
            </div>
          ) : (
            <div className="flex flex-col items-center text-slate-500">
              <svg className="w-12 h-12 mb-3 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <p className="font-medium">Tải ảnh chân dung hoặc bán thân</p>
              <p className="text-xs mt-1 text-slate-400">JPG, PNG (Max 5MB)</p>
            </div>
          )}
        </div>
      </section>

      {/* 2. Content */}
      <section>
        <h3 className="text-lg font-semibold text-slate-800 mb-3 flex items-center">
          <span className="bg-primary/10 text-primary w-8 h-8 rounded-full flex items-center justify-center mr-2 text-sm">2</span>
          Nội dung chia sẻ
        </h3>
        <textarea
          value={settings.content}
          onChange={(e) => updateSetting('content', e.target.value)}
          placeholder="Ví dụ: Giới thiệu bản thân, câu chuyện thương hiệu, chia sẻ kinh nghiệm, quan điểm cá nhân…"
          className="w-full p-4 rounded-xl border border-slate-300 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all h-32 resize-none text-slate-700 placeholder:text-slate-400"
        />
      </section>

      {/* 3. Background */}
      <section>
        <h3 className="text-lg font-semibold text-slate-800 mb-3 flex items-center">
          <span className="bg-primary/10 text-primary w-8 h-8 rounded-full flex items-center justify-center mr-2 text-sm">3</span>
          Chọn không gian ngồi
        </h3>
        <div className="grid grid-cols-2 gap-3 mb-3">
          {BACKGROUND_OPTIONS.map((option) => (
            <button
              key={option.id}
              onClick={() => updateSetting('background', option.id)}
              className={`
                p-3 rounded-lg border text-left flex items-center transition-all
                ${settings.background === option.id 
                  ? 'border-primary bg-primary/5 text-primary ring-1 ring-primary' 
                  : 'border-slate-200 hover:border-slate-300 text-slate-600'}
              `}
            >
              <span className="text-xl mr-2">{option.icon}</span>
              <span className="text-sm font-medium">{option.label}</span>
            </button>
          ))}
        </div>
        {settings.background === 'custom' && (
          <div className="animate-fadeIn">
            <input
              type="text"
              value={settings.customBackground}
              onChange={(e) => updateSetting('customBackground', e.target.value)}
              placeholder="Mô tả không gian mong muốn (VD: Penthouse sang trọng view biển, ánh sáng vàng...)"
              className="w-full p-3 rounded-lg border border-primary/30 focus:border-primary focus:ring-1 focus:ring-primary outline-none text-sm text-slate-700 bg-primary/5 placeholder:text-slate-400"
            />
          </div>
        )}
      </section>

      {/* 4. Aspect Ratio & Quantity */}
      <section>
        <h3 className="text-lg font-semibold text-slate-800 mb-3 flex items-center">
          <span className="bg-primary/10 text-primary w-8 h-8 rounded-full flex items-center justify-center mr-2 text-sm">4</span>
          Cấu hình Video
        </h3>
        
        <div className="space-y-4">
          <div>
            <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2 block">Tỷ lệ khung hình</label>
            <div className="flex gap-4">
              <button
                onClick={() => updateSetting('aspectRatio', '9:16')}
                className={`flex-1 p-3 rounded-xl border flex items-center justify-center gap-2 transition-all ${settings.aspectRatio === '9:16' ? 'border-primary bg-primary/5 ring-1 ring-primary text-primary' : 'border-slate-200 text-slate-600'}`}
              >
                  <div className="w-3 h-5 border border-current rounded-[1px]"></div>
                  <span className="text-sm font-medium">9:16 (Dọc)</span>
              </button>
              <button
                onClick={() => updateSetting('aspectRatio', '16:9')}
                className={`flex-1 p-3 rounded-xl border flex items-center justify-center gap-2 transition-all ${settings.aspectRatio === '16:9' ? 'border-primary bg-primary/5 ring-1 ring-primary text-primary' : 'border-slate-200 text-slate-600'}`}
              >
                  <div className="w-5 h-3 border border-current rounded-[1px]"></div>
                  <span className="text-sm font-medium">16:9 (Ngang)</span>
              </button>
            </div>
          </div>

          <div>
            <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2 block">Số lượng phiên bản</label>
            <div className="flex gap-2">
              {QUANTITY_OPTIONS.map((qty) => (
                <button
                  key={qty}
                  onClick={() => updateSetting('quantity', qty)}
                  className={`
                    flex-1 py-2 rounded-lg border text-sm font-medium transition-all
                    ${settings.quantity === qty 
                      ? 'bg-accent text-white border-accent shadow-md' 
                      : 'border-slate-200 hover:border-slate-300 text-slate-600'}
                  `}
                >
                  {qty} Cảnh
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* 5 & 6. Style & Tone */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <section>
          <h3 className="text-lg font-semibold text-slate-800 mb-3 flex items-center">
            <span className="bg-primary/10 text-primary w-8 h-8 rounded-full flex items-center justify-center mr-2 text-sm">5</span>
            Phong cách
          </h3>
          <div className="space-y-2">
            {STYLE_OPTIONS.map((style) => (
               <label key={style.id} className="flex items-center space-x-3 p-2 rounded hover:bg-slate-50 cursor-pointer">
                  <input 
                    type="radio" 
                    name="style" 
                    checked={settings.style === style.id}
                    onChange={() => updateSetting('style', style.id)}
                    className="text-primary focus:ring-primary h-4 w-4"
                  />
                  <span className="text-sm text-slate-700 font-medium">{style.label}</span>
               </label>
            ))}
          </div>
        </section>
        
        <section>
          <h3 className="text-lg font-semibold text-slate-800 mb-3 flex items-center">
            <span className="bg-primary/10 text-primary w-8 h-8 rounded-full flex items-center justify-center mr-2 text-sm">6</span>
            Tông cảm xúc
          </h3>
          <div className="space-y-2">
            {TONE_OPTIONS.map((tone) => (
               <label key={tone.id} className="flex items-center space-x-3 p-2 rounded hover:bg-slate-50 cursor-pointer">
                  <input 
                    type="radio" 
                    name="tone" 
                    checked={settings.tone === tone.id}
                    onChange={() => updateSetting('tone', tone.id)}
                    className="text-primary focus:ring-primary h-4 w-4"
                  />
                  <span className="text-sm text-slate-700 font-medium">{tone.label}</span>
               </label>
            ))}
          </div>
        </section>
      </div>

      {/* Submit Button */}
      <button
        onClick={onGenerate}
        disabled={isGenerating || !selectedFile || !settings.content}
        className={`
          w-full py-4 rounded-xl text-white font-bold text-lg shadow-lg flex items-center justify-center space-x-2 transition-all transform hover:scale-[1.01]
          ${isGenerating || !selectedFile || !settings.content
            ? 'bg-slate-300 cursor-not-allowed text-slate-500 shadow-none' 
            : 'bg-gradient-to-r from-primary to-blue-600 hover:shadow-primary/30'}
        `}
      >
        {isGenerating ? (
          <>
            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            <span>Đang khởi tạo {settings.quantity} phiên bản...</span>
          </>
        ) : (
          <>
            <span>🚀</span>
            <span>Tạo {settings.quantity} phiên bản Veo 3</span>
          </>
        )}
      </button>

    </div>
  );
};