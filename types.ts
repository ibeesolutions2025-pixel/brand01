export interface GenerationSettings {
  content: string;
  background: string;
  customBackground: string; // New field for custom input
  aspectRatio: '9:16' | '16:9';
  style: string;
  tone: string;
  quantity: number; // New field for number of outputs
}

export interface GeneratedResult {
  id: string; // Unique ID for React keys
  imageUrl: string;
  veoPrompt: string;
  script: string;
  variantName: string; // e.g., "Phiên bản 1"
}

export interface BackgroundOption {
  id: string;
  label: string;
  promptDesc: string;
  icon: string;
}

export interface StyleOption {
  id: string;
  label: string;
  promptDesc: string;
}

export interface ToneOption {
  id: string;
  label: string;
  promptDesc: string;
}