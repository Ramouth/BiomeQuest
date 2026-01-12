import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import Navbar from './Navbar';

describe('Navbar Component', () => {
  
  // Test 1: Render all three navigation buttons
  it('should render all three navigation tabs (Home, Register, Progress)', () => {
    const mockOnTabChange = vi.fn();
    
    render(
      <Navbar 
        activeTab="home" 
        onTabChange={mockOnTabChange} 
        score={100}
      />
    );
    
    expect(screen.getByText('Home')).toBeInTheDocument();
    expect(screen.getByText('Register')).toBeInTheDocument();
    expect(screen.getByText('Progress')).toBeInTheDocument();
  });

  // Test 2: Verify home button is active by default
  it('should highlight Home tab when activeTab is "home"', () => {
    const mockOnTabChange = vi.fn();
    
    const { container } = render(
      <Navbar 
        activeTab="home" 
        onTabChange={mockOnTabChange} 
        score={100}
      />
    );
    
    const homeButton = screen.getByText('Home').closest('button');
    expect(homeButton.querySelector('svg').classList.contains('text-green-500')).toBe(true);
  });

  // Test 3: Verify register button active state
  it('should highlight Register tab when activeTab is "register"', () => {
    const mockOnTabChange = vi.fn();
    
    render(
      <Navbar 
        activeTab="register" 
        onTabChange={mockOnTabChange} 
        score={100}
      />
    );
    
    const registerButton = screen.getByText('Register').closest('button');
    const registerCircle = registerButton.querySelector('div');
    expect(registerCircle.classList.contains('bg-green-600')).toBe(true);
  });

  // Test 4: Verify progress button active state
  it('should highlight Progress tab when activeTab is "progress"', () => {
    const mockOnTabChange = vi.fn();
    
    render(
      <Navbar 
        activeTab="progress" 
        onTabChange={mockOnTabChange} 
        score={100}
      />
    );
    
    const progressButton = screen.getByText('Progress').closest('button');
    expect(progressButton.querySelector('svg').classList.contains('text-green-500')).toBe(true);
  });

  // Test 5: Test Home button click triggers callback
  it('should call onTabChange with "home" when Home button is clicked', () => {
    const mockOnTabChange = vi.fn();
    
    render(
      <Navbar 
        activeTab="register" 
        onTabChange={mockOnTabChange} 
        score={100}
      />
    );
    
    const homeButton = screen.getByText('Home').closest('button');
    fireEvent.click(homeButton);
    
    expect(mockOnTabChange).toHaveBeenCalledWith('home');
    expect(mockOnTabChange).toHaveBeenCalledTimes(1);
  });

  // Test 6: Test Register button click triggers callback
  it('should call onTabChange with "register" when Register button is clicked', () => {
    const mockOnTabChange = vi.fn();
    
    render(
      <Navbar 
        activeTab="home" 
        onTabChange={mockOnTabChange} 
        score={100}
      />
    );
    
    const registerButton = screen.getByText('Register').closest('button');
    fireEvent.click(registerButton);
    
    expect(mockOnTabChange).toHaveBeenCalledWith('register');
    expect(mockOnTabChange).toHaveBeenCalledTimes(1);
  });

  // Test 7: Test Progress button click triggers callback
  it('should call onTabChange with "progress" when Progress button is clicked', () => {
    const mockOnTabChange = vi.fn();
    
    render(
      <Navbar 
        activeTab="home" 
        onTabChange={mockOnTabChange} 
        score={100}
      />
    );
    
    const progressButton = screen.getByText('Progress').closest('button');
    fireEvent.click(progressButton);
    
    expect(mockOnTabChange).toHaveBeenCalledWith('progress');
    expect(mockOnTabChange).toHaveBeenCalledTimes(1);
  });

  // Test 8: Score should display only on home tab
  it('should display score only when activeTab is "home"', () => {
    const mockOnTabChange = vi.fn();
    
    const { rerender } = render(
      <Navbar 
        activeTab="home" 
        onTabChange={mockOnTabChange} 
        score={150}
      />
    );
    
    expect(screen.getByText(/Score: 150/)).toBeInTheDocument();

    // Change to register tab
    rerender(
      <Navbar 
        activeTab="register" 
        onTabChange={mockOnTabChange} 
        score={150}
      />
    );
    
    expect(screen.queryByText(/Score: 150/)).not.toBeInTheDocument();
  });

  // Test 9: Score should hide on progress tab
  it('should not display score when activeTab is "progress"', () => {
    const mockOnTabChange = vi.fn();
    
    render(
      <Navbar 
        activeTab="progress" 
        onTabChange={mockOnTabChange} 
        score={200}
      />
    );
    
    expect(screen.queryByText(/Score: 200/)).not.toBeInTheDocument();
  });

  // Test 10: Score value should update
  it('should update score display when score prop changes', () => {
    const mockOnTabChange = vi.fn();
    
    const { rerender } = render(
      <Navbar 
        activeTab="home" 
        onTabChange={mockOnTabChange} 
        score={50}
      />
    );
    
    expect(screen.getByText('Score: 50')).toBeInTheDocument();

    rerender(
      <Navbar 
        activeTab="home" 
        onTabChange={mockOnTabChange} 
        score={150}
      />
    );
    
    expect(screen.getByText('Score: 150')).toBeInTheDocument();
  });

  // Test 11: Inactive tabs should have gray color
  it('should display inactive tabs in gray', () => {
    const mockOnTabChange = vi.fn();
    
    render(
      <Navbar 
        activeTab="home" 
        onTabChange={mockOnTabChange} 
        score={100}
      />
    );
    
    const registerButton = screen.getByText('Register').closest('button');
    const progressButton = screen.getByText('Progress').closest('button');
    
    // For Register button, check the span text color
    const registerSpan = registerButton.querySelector('span');
    expect(registerSpan.classList.contains('text-gray-400')).toBe(true);
    
    // For Progress button, check the SVG icon color
    const progressIcon = progressButton.querySelector('svg');
    expect(progressIcon.classList.contains('text-gray-400')).toBe(true);
  });

  // Test 12: Active tab should have underline indicator
  it('should show underline indicator on active tab', () => {
    const mockOnTabChange = vi.fn();
    
    const { container } = render(
      <Navbar 
        activeTab="home" 
        onTabChange={mockOnTabChange} 
        score={100}
      />
    );
    
    const homeButton = screen.getByText('Home').closest('button');
    const underline = homeButton.querySelector('.absolute.-bottom-1');
    
    expect(underline).toBeInTheDocument();
    expect(underline.classList.contains('bg-green-500')).toBe(true);
  });

  // Test 13: Multiple tab switches
  it('should handle multiple consecutive tab clicks', () => {
    const mockOnTabChange = vi.fn();
    
    render(
      <Navbar 
        activeTab="home" 
        onTabChange={mockOnTabChange} 
        score={100}
      />
    );
    
    const homeButton = screen.getByText('Home').closest('button');
    const registerButton = screen.getByText('Register').closest('button');
    const progressButton = screen.getByText('Progress').closest('button');
    
    fireEvent.click(registerButton);
    fireEvent.click(progressButton);
    fireEvent.click(homeButton);
    
    expect(mockOnTabChange).toHaveBeenCalledTimes(3);
    expect(mockOnTabChange).toHaveBeenNthCalledWith(1, 'register');
    expect(mockOnTabChange).toHaveBeenNthCalledWith(2, 'progress');
    expect(mockOnTabChange).toHaveBeenNthCalledWith(3, 'home');
  });

  // Test 14: Zero score display
  it('should display score of 0', () => {
    const mockOnTabChange = vi.fn();
    
    render(
      <Navbar 
        activeTab="home" 
        onTabChange={mockOnTabChange} 
        score={0}
      />
    );
    
    expect(screen.getByText('Score: 0')).toBeInTheDocument();
  });

  // Test 15: Large score numbers
  it('should display large score numbers correctly', () => {
    const mockOnTabChange = vi.fn();
    
    render(
      <Navbar 
        activeTab="home" 
        onTabChange={mockOnTabChange} 
        score={9999}
      />
    );
    
    expect(screen.getByText('Score: 9999')).toBeInTheDocument();
  });
});
