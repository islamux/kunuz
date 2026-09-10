import { beforeEach, describe, expect, it, vi } from 'vitest';
import { speakArabicText, stopArabicSpeech, subscribeToSpeech } from './speech';

describe('speech', () => {
  beforeEach(() => {
    vi.mocked(window.speechSynthesis.speak).mockClear();
    vi.mocked(window.speechSynthesis.cancel).mockClear();
    vi.mocked(window.speechSynthesis.getVoices).mockReturnValue([]);
  });

  it('speakArabicText returns true when speechSynthesis is present', () => {
    expect(speakArabicText('السلام عليكم')).toBe(true);
  });

  it('stopArabicSpeech does not throw', () => {
    expect(() => stopArabicSpeech()).not.toThrow();
  });

  it('subscribeToSpeech returns a function and forwards speaking events', () => {
    const events: boolean[] = [];
    const unsubscribe = subscribeToSpeech((speaking) => events.push(speaking));
    expect(typeof unsubscribe).toBe('function');

    speakArabicText('السلام عليكم');
    expect(events).toEqual([true]);

    stopArabicSpeech();
    expect(events).toEqual([true, false]);

    events.length = 0;
    unsubscribe();
    stopArabicSpeech();
    expect(events).toEqual([]);
  });

  it('notifies listeners on start and end of an utterance', () => {
    const events: boolean[] = [];
    const unsubscribe = subscribeToSpeech((speaking) => events.push(speaking));

    speakArabicText('السلام عليكم');
    const utterance = vi.mocked(window.speechSynthesis.speak).mock.calls[0][0] as SpeechSynthesisUtterance;

    utterance.onstart?.(null as unknown as SpeechSynthesisEvent);
    expect(events).toEqual([true, true]);

    utterance.onend?.(null as unknown as SpeechSynthesisEvent);
    expect(events).toEqual([true, true, false]);

    unsubscribe();
  });
});