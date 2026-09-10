const listeners = new Set<(speaking: boolean) => void>();

function notify(speaking: boolean): void {
  for (const listener of listeners) {
    listener(speaking);
  }
}

let voicesPrimed = false;

function onVoicesChanged(): void {
  window.speechSynthesis.getVoices();
  window.speechSynthesis.removeEventListener('voiceschanged', onVoicesChanged);
}

function primeVoiceLookup(): void {
  if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;
  if (voicesPrimed) return;
  if (window.speechSynthesis.getVoices().length > 0) return;
  voicesPrimed = true;
  window.speechSynthesis.addEventListener('voiceschanged', onVoicesChanged);
}

let currentUtterance: SpeechSynthesisUtterance | null = null;

export function speakArabicText(
  text: string,
  onStart?: () => void,
  onEnd?: () => void,
  onError?: () => void
): boolean {
  if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
    return false;
  }

  window.speechSynthesis.cancel();

  const cleanText = text.replace(/«|»|[\(\)\[\]]/g, ' ');
  const utterance = new SpeechSynthesisUtterance(cleanText);
  utterance.lang = 'ar-SA';
  utterance.rate = 0.92;
  utterance.pitch = 1.0;

  primeVoiceLookup();
  const voices = window.speechSynthesis.getVoices();
  const arabicVoice = voices.find(v => v.lang.startsWith('ar'));
  if (arabicVoice) {
    utterance.voice = arabicVoice;
  }

  utterance.onstart = () => {
    notify(true);
    if (onStart) onStart();
  };

  utterance.onend = () => {
    currentUtterance = null;
    notify(false);
    if (onEnd) onEnd();
  };

  utterance.onerror = () => {
    currentUtterance = null;
    notify(false);
    if (onError) onError();
  };

  currentUtterance = utterance;
  window.speechSynthesis.speak(utterance);
  notify(true);
  return true;
}

export function stopArabicSpeech(): void {
  if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
    window.speechSynthesis.cancel();
    currentUtterance = null;
    notify(false);
  }
}

export function subscribeToSpeech(listener: (speaking: boolean) => void): () => void {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}