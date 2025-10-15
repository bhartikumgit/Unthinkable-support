import { useState, useEffect } from 'react';
import { AnimatePresence } from 'framer-motion';
import LandingAnimation from './components/LandingAnimation';
import ChatWindow from './components/ChatWindow';
import * as chatApi from './api/client';
import '@fontsource/poppins';

function App() {
  const [showLanding, setShowLanding] = useState(true);
  const [session, setSession] = useState(null);
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const initSession = async () => {
      try {
        const newSession = await chatApi.createSession();
        setSession(newSession);
      } catch (error) {
        console.error('Failed to create session:', error);
      }
    };
    initSession();
  }, []);

  const handleSendMessage = async (message) => {
    if (!session) return;

    const userMessage = {
      id: Date.now().toString(),
      content: message,
      role: 'user',
      timestamp: new Date().toISOString()
    };

    setMessages(prev => [...prev, userMessage]);
    setIsLoading(true);

    try {
      const response = await chatApi.sendMessage({
        session_id: session.id,
        message
      });

      setMessages(prev => [...prev, response]);
    } catch (error) {
      console.error('Failed to get response:', error);
      setMessages(prev => [...prev, {
        id: Date.now().toString(),
        content: 'Sorry, I encountered an error. Please try again.',
        role: 'assistant',
        timestamp: new Date().toISOString()
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-50 to-blue-50">
      <AnimatePresence>
        {showLanding ? (
          <LandingAnimation onComplete={() => setShowLanding(false)} />
        ) : (
          <div className="container mx-auto px-4 py-8 flex items-center justify-center min-h-screen">
            <ChatWindow
              messages={messages}
              onSendMessage={handleSendMessage}
              isLoading={isLoading}
            />
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default App;
