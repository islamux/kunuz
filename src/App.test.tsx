import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import App from './App';

describe('App', () => {
  it('renders the brand title and treasure cards', () => {
    render(<App />);

    expect(
      screen.getByRole('heading', { level: 1, name: 'كنوز من السنة المطهرة' }),
    ).toBeInTheDocument();

    const treasureCards = document.querySelectorAll('article');
    expect(treasureCards.length).toBeGreaterThan(0);
  });
});