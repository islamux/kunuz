import { describe, expect, it } from 'vitest';
import { removeTashkeel, matchesSearch, stripTashkeelForDisplay, toArabicDigits } from './arabic';

describe('removeTashkeel', () => {
  it('removes fatha, damma and shadda', () => {
    expect(removeTashkeel('السَّلَامُ')).toBe('السلام');
  });

  it('removes tatweel', () => {
    expect(removeTashkeel('السلامـ')).toBe('السلام');
  });

  it('normalizes إ/أ/آ to ا', () => {
    expect(removeTashkeel('إأآٱ')).toBe('اااا');
  });

  it('normalizes ة to ه and ى to ي', () => {
    expect(removeTashkeel('ةى')).toBe('هي');
  });

  it('returns empty string for empty input', () => {
    expect(removeTashkeel('')).toBe('');
  });
});

describe('matchesSearch', () => {
  it('matches content with tashkeel against a plain query', () => {
    expect(matchesSearch('السلام', 'السَّلَام')).toBe(true);
  });

  it('matches plain content against a query with tashkeel', () => {
    expect(matchesSearch('السَّلَام', 'السلام')).toBe(true);
  });

  it('returns false for non-matching content', () => {
    expect(matchesSearch('الرحمن', 'السلام')).toBe(false);
  });

  it('returns true for an empty query', () => {
    expect(matchesSearch('السلام', '')).toBe(true);
    expect(matchesSearch('السلام', '   ')).toBe(true);
  });
});

describe('stripTashkeelForDisplay', () => {
  it('removes the display tashkeel range but keeps other marks', () => {
    expect(stripTashkeelForDisplay('سَلَام')).toBe('سلام');
    expect(stripTashkeelForDisplay('شَدَّة')).toBe('شدة');
  });

  it('returns empty string for empty input', () => {
    expect(stripTashkeelForDisplay('')).toBe('');
  });
});

describe('toArabicDigits', () => {
  it('converts ASCII digits to Arabic-Indic digits', () => {
    expect(toArabicDigits(0)).toBe('٠');
    expect(toArabicDigits(140)).toBe('١٤٠');
    expect(toArabicDigits(42)).toBe('٤٢');
  });
});