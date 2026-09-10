import { act, renderHook } from '@testing-library/react';
import { describe, expect, it, beforeEach } from 'vitest';
import { useFavorites } from './useFavorites';

describe('useFavorites', () => {
  beforeEach(() => localStorage.clear());

  it('returns empty list when nothing saved', () => {
    const { result } = renderHook(() => useFavorites());
    expect(result.current.favorites).toEqual([]);
  });

  it('toggles a favorite and persists to localStorage', () => {
    const { result } = renderHook(() => useFavorites());
    act(() => result.current.toggleFavorite(7));
    expect(result.current.favorites).toEqual([7]);
    expect(JSON.parse(localStorage.getItem('sunnah-favorites')!)).toEqual([7]);
    act(() => result.current.toggleFavorite(7));
    expect(result.current.favorites).toEqual([]);
  });

  it('clears all favorites', () => {
    const { result } = renderHook(() => useFavorites());
    act(() => result.current.toggleFavorite(1));
    act(() => result.current.clearFavorites());
    expect(result.current.favorites).toEqual([]);
  });
});
