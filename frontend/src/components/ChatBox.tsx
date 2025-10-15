import { useState, useRef, useEffect } from 'react';
import { Message } from '../api/client';
import MessageBubble from './MessageBubble';
import { PaperAirplaneIcon } from '@heroicons/react/24/solid';

interface ChatBoxProps {
  messages: Message[];
  onSendMessage: (message: string) => void;
  loading?: boolean;
}

const ChatBox = ({ messages, onSendMessage, loading = false }: ChatBoxProps) => {
  const [input, setInput] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim() && !loading) {
      onSendMessage(input.trim());
      setInput('');
    }
  };

  return (
    <div className="flex flex-col h-[600px] bg-white rounded-xl shadow-md">
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message) => (
          <MessageBubble key={message.id} message={message} />
        ))}
        <div ref={messagesEndRef} />
      </div>
      
      <form onSubmit={handleSubmit} className="p-4 border-t">
        <div className="flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type your message..."
            className="flex-1 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-1"
            disabled={loading}
          />
          <button
            type="submit"
            disabled={!input.trim() || loading}
            className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <PaperAirplaneIcon className="h-5 w-5" />
          </button>
        </div>
        {loading && (
          <div className="text-sm text-muted mt-2">
            Thinking...
          </div>
        )}
      </form>
    </div>
  );
};

export default ChatBox;
