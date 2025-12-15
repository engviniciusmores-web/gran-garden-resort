import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Button } from './Button';

describe('Button Component', () => {
  it('should render button with text', () => {
    render(<Button>Clique Aqui</Button>);
    expect(screen.getByRole('button', { name: /clique aqui/i })).toBeInTheDocument();
  });

  it('should call onClick handler when clicked', async () => {
    const handleClick = vi.fn();
    const user = userEvent.setup();
    
    render(<Button onClick={handleClick}>Clique Aqui</Button>);
    
    const button = screen.getByRole('button', { name: /clique aqui/i });
    await user.click(button);
    
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('should be disabled when disabled prop is true', () => {
    render(<Button disabled>Botão Desabilitado</Button>);
    
    const button = screen.getByRole('button', { name: /botão desabilitado/i });
    expect(button).toBeDisabled();
  });

  it('should apply primary variant styles by default', () => {
    render(<Button>Botão Primário</Button>);
    
    const button = screen.getByRole('button', { name: /botão primário/i });
    expect(button).toHaveClass('bg-blue-600');
  });

  it('should apply secondary variant styles', () => {
    render(<Button variant="secondary">Botão Secundário</Button>);
    
    const button = screen.getByRole('button', { name: /botão secundário/i });
    expect(button).toHaveClass('bg-slate-600');
  });

  it('should render with icon', () => {
    const icon = <span data-testid="test-icon">📝</span>;
    render(<Button icon={icon}>Botão com Ícone</Button>);
    
    expect(screen.getByTestId('test-icon')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /botão com ícone/i })).toBeInTheDocument();
  });

  it('should apply fullWidth class when fullWidth is true', () => {
    render(<Button fullWidth>Botão Largo</Button>);
    
    const button = screen.getByRole('button', { name: /botão largo/i });
    expect(button).toHaveClass('w-full');
  });

  it('should have correct button type', () => {
    render(<Button type="submit">Enviar</Button>);
    
    const button = screen.getByRole('button', { name: /enviar/i });
    expect(button).toHaveAttribute('type', 'submit');
  });
});
