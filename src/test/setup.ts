import '@testing-library/jest-dom/vitest';
import { vi } from 'vitest';

class SpeechSynthesisUtteranceMock {
  text: string = '';
  lang: string = '';
  voice: SpeechSynthesisVoice | null = null;
  volume: number = 1;
  rate: number = 1;
  pitch: number = 1;
}

Object.defineProperty(window, 'SpeechSynthesisUtterance', {
  writable: true,
  value: SpeechSynthesisUtteranceMock,
});

Object.defineProperty(window, 'speechSynthesis', {
  writable: true,
  value: {
    cancel: vi.fn(),
    speak: vi.fn(),
    pause: vi.fn(),
    resume: vi.fn(),
    getVoices: vi.fn(() => []),
  },
});

vi.mock('canvas-confetti', () => ({
  default: vi.fn(),
}));