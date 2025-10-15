import { useState, useEffect } from 'react';
import chatApi, { Message } from '../api/client';
import ChatBox from './ChatBox';
import OptionMenu from './OptionMenu';
import SubOptionMenu from './SubOptionMenu';
import EscalationModal from './EscalationModal';

const ChatShell = () => {
  const [session, setSession] = useState<{ id: string } | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [selectedMainOption, setSelectedMainOption] = useState<string | null>(null);
  const [showEscalation, setShowEscalation] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    initializeSession();
  }, []);

  const initializeSession = async () => {
    try {
      const newSession = await chatApi.createSession();
      setSession(newSession);
      setMessages([{
        id: 'welcome',
        content: 'Hello! I\'m your Unthinkable Support assistant. How can I help you today?',
        role: 'assistant',
        timestamp: new Date().toISOString(),
        confidence: 1
      }]);
    } catch (error) {
      console.error('Failed to initialize session:', error);
    }
  };

  const handleMainOptionSelect = (option: string) => {
    console.log('Main option selected:', option);
    setSelectedMainOption(option);
  };

  const handleSubOptionSelect = async (subOption: string) => {
    if (!session) {
      console.error('No active session');
      return;
    }

    const message = `I need help with ${subOption}`;
    console.log('Submitting subtopic query:', message, {
      session_id: session.id,
      category: selectedMainOption,
      subtopic: subOption
    });

    // Add user message to chat
    const userMessage: Message = {
      id: Date.now().toString(),
      content: message,
      role: 'user',
      timestamp: new Date().toISOString()
    };
    setMessages(prev => [...prev, userMessage]);
    setLoading(true);

    try {
      const response = await chatApi.sendMessage({
        session_id: session.id,
        message,
        category: selectedMainOption || undefined,
        subtopic: subOption
      });

      setMessages(prev => [...prev, response]);

      if (response.confidence && response.confidence < 0.45) {
        setShowEscalation(true);
      }
    } catch (error) {
      console.error('Failed to get response:', error);
      setMessages(prev => [...prev, {
        id: Date.now().toString(),
        content: 'Sorry, I encountered an error processing your request.',
        role: 'assistant',
        timestamp: new Date().toISOString(),
        confidence: 0
      }]);
    } finally {
      setLoading(false);
    }
  };

  const handleSendMessage = async (message: string) => {
    if (!session) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      content: message,
      role: 'user',
      timestamp: new Date().toISOString()
    };

    setMessages(prev => [...prev, userMessage]);
    setLoading(true);

    try {
      const response = await chatApi.sendMessage({
        session_id: session.id,
        message
      });

      setMessages(prev => [...prev, response]);

      if (response.confidence && response.confidence < 0.45) {
        setShowEscalation(true);
      }
    } catch (error) {
      console.error('Failed to send message:', error);
      setMessages(prev => [...prev, {
        id: Date.now().toString(),
        content: 'Sorry, I encountered an error processing your request.',
        role: 'assistant',
        timestamp: new Date().toISOString(),
        confidence: 0
      }]);
    } finally {
      setLoading(false);
    }
  };

  const handleEscalate = async (issue: string) => {
    if (!session) return;

    try {
      await chatApi.createEscalation(session.id, issue);
      setShowEscalation(false);
      
      const escalationMessage: Message = {
        id: Date.now().toString(),
        content: 'I\'ve created an escalation ticket for your issue. A support representative will contact you soon.',
        role: 'assistant',
        timestamp: new Date().toISOString(),
        confidence: 1
      };

      setMessages(prev => [...prev, escalationMessage]);
    } catch (error) {
      console.error('Failed to create escalation:', error);
    }
  };

  return (
    <div className="flex flex-col md:flex-row gap-6 min-h-[600px]">
      <div className="w-full md:w-1/3 space-y-4">
        <OptionMenu 
          onSelect={handleMainOptionSelect}
          selectedOption={selectedMainOption}
        />
        {selectedMainOption && (
          <SubOptionMenu
            mainOption={selectedMainOption}
            onSelect={handleSubOptionSelect}
          />
        )}
      </div>
      <div className="w-full md:w-2/3">
        <ChatBox
          messages={messages}
          onSendMessage={handleSendMessage}
          loading={loading}
        />
      </div>
      {showEscalation && (
        <EscalationModal
          onClose={() => setShowEscalation(false)}
          onEscalate={handleEscalate}
        />
      )}
    </div>
  );
};

export default ChatShell;