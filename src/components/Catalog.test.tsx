import { render, screen, fireEvent, act } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { BrowserRouter } from 'react-router-dom';
import Catalog from './Catalog';

// Mock navigate
const mockedNavigate = vi.fn();
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => mockedNavigate,
  };
});

// Wrapper for Router context
const renderWithRouter = (component: React.ReactNode) => {
  return render(<BrowserRouter>{component}</BrowserRouter>);
};

describe('Catalog Component', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  /** Advance past the 1500ms loading timer so Catalog renders its content. */
  const waitForLoad = () => act(() => vi.advanceTimersByTime(1600));

  it('renders the title and tabs', () => {
    renderWithRouter(<Catalog />);
    waitForLoad();

    expect(screen.getByText('Catálogo 🐾')).toBeInTheDocument();
    expect(screen.getByText('Alimento Económico')).toBeInTheDocument();
    expect(screen.getByText('Alimento Premium')).toBeInTheDocument();
  });

  it('changes tabs on click', () => {
    renderWithRouter(<Catalog />);
    waitForLoad();

    const premiumTab = screen.getByText('Alimento Premium');
    fireEvent.click(premiumTab);

    expect(premiumTab).toBeEnabled();
  });

  it('filters products when searching', () => {
    renderWithRouter(<Catalog />);
    waitForLoad();

    const searchInput = screen.getByPlaceholderText(/Buscar producto/i);
    fireEvent.change(searchInput, { target: { value: 'XYZNONEXISTENT' } });

    expect(screen.getByText(/No encontramos productos/)).toBeInTheDocument();
  });

  it('navigates back home when back button is clicked', () => {
    renderWithRouter(<Catalog />);
    waitForLoad();

    const backButton = screen.getByLabelText('Volver');
    fireEvent.click(backButton);

    expect(mockedNavigate).toHaveBeenCalledWith('/');
  });
});
