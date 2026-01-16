import { BackgroundOption, StyleOption, ToneOption } from './types';

export const BACKGROUND_OPTIONS: BackgroundOption[] = [
  {
    id: 'office',
    label: 'Văn phòng chuyên gia',
    promptDesc: 'high-end modern professional office, blurred bookshelves in background, cinematic depth of field',
    icon: '🏢'
  },
  {
    id: 'cafe',
    label: 'Quán cà phê',
    promptDesc: 'cozy aesthetic coffee shop, warm ambient lighting, soft bokeh, relaxed atmosphere',
    icon: '☕'
  },
  {
    id: 'studio',
    label: 'Studio tối giản',
    promptDesc: 'clean minimal studio background, solid soft color, professional studio lighting, high contrast',
    icon: '🎙️'
  },
  {
    id: 'home',
    label: 'Nhà riêng cao cấp',
    promptDesc: 'luxury living room, modern interior design, soft natural window light, comfortable vibe',
    icon: '🛋️'
  },
  {
    id: 'custom',
    label: 'Tùy chỉnh...',
    promptDesc: '', // Will be filled from custom input
    icon: '✨'
  }
];

export const STYLE_OPTIONS: StyleOption[] = [
  { id: 'professional', label: 'Chuyên gia - Chuyên nghiệp', promptDesc: 'professional, authoritative, credible, business casual' },
  { id: 'friendly', label: 'Gần gũi - Thân thiện', promptDesc: 'friendly, approachable, warm, casual, authentic' },
  { id: 'inspiring', label: 'Truyền cảm hứng', promptDesc: 'inspiring, energetic, dynamic, motivational lighting' },
];

export const TONE_OPTIONS: ToneOption[] = [
  { id: 'confident', label: 'Tự tin', promptDesc: 'confident, strong voice, direct eye contact' },
  { id: 'warm', label: 'Ấm áp', promptDesc: 'warm, soft spoken, empathetic, gentle' },
  { id: 'motivational', label: 'Truyền động lực', promptDesc: 'uplifting, powerful, energetic, engaging' },
];

export const QUANTITY_OPTIONS = [1, 3, 6];

export const DEFAULT_SETTINGS = {
  content: '',
  background: 'office',
  customBackground: '',
  aspectRatio: '9:16' as const,
  style: 'professional',
  tone: 'confident',
  quantity: 1
};
