import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import ChatShell from '../components/ChatShell';
import chatApi from '../api/client';
import { vi } from 'vitest';

// Mock the API client
vi.mock('../api/client', () => ({
  default: {
    createSession: vi.fn().mockResolvedValue({ id: 'test-session' }),
    searchFaq: vi.fn().mockResolvedValue({
      answer: 'Track your order by: 1) Going to Orders in your account...',
      confidence: 0.9
    }),
    sendMessage: vi.fn().mockResolvedValue({
      id: 'test-msg',
      content: 'Here is your order status...',
      role: 'assistant',
      timestamp: new Date().toISOString(),
      confidence: 0.8
    })
  }
}));

describe('ChatFlow', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  test('renders main menu options', () => {
    render(<ChatShell />);
    expect(screen.getByText('Orders')).toBeInTheDocument();
    expect(screen.getByText('Account')).toBeInTheDocument();
    expect(screen.getByText('Returns')).toBeInTheDocument();
  });

  test('shows sub-options when main option is selected', async () => {
    render(<ChatShell />);
    
    // Click on Orders option
    fireEvent.click(screen.getByText('Orders'));
    
    // Sub-options should appear
    await waitFor(() => {
      expect(screen.getByText('Track Order')).toBeInTheDocument();
      expect(screen.getByText('Cancel Order')).toBeInTheDocument();
    });
  });

  test('displays FAQ answer when sub-option is selected', async () => {
    render(<ChatShell />);
    
    // Navigate through menu
    fireEvent.click(screen.getByText('Orders'));
    await waitFor(() => {
      fireEvent.click(screen.getByText('Track Order'));
    });

    // Check if FAQ response is displayed
    await waitFor(() => {
      expect(screen.getByText(/Track your order by/)).toBeInTheDocument();
    });

    // Verify API was called
    expect(chatApi.searchFaq).toHaveBeenCalled();
  });

  test('handles free text input and LLM response', async () => {
    render(<ChatShell />);
    
    // Type and send a message
    const input = screen.getByPlaceholderText('Type your message...');
    fireEvent.change(input, { target: { value: 'Where is my order?' } });
    fireEvent.click(screen.getByRole('button', { name: '' }));  // Submit button

    // Check if response is displayed
    await waitFor(() => {
      expect(screen.getByText(/Here is your order status/)).toBeInTheDocument();
    });

    // Verify API was called
    expect(chatApi.sendMessage).toHaveBeenCalled();
  });
});
