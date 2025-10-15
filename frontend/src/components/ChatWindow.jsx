import { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import MessageBubble from './MessageBubble';
import InputBar from './InputBar';

const ChatWindow = ({ messages, onSendMessage, isLoading }) => {
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Find index of first AI message for image upload prompt
  const firstAiMessageIndex = messages.findIndex(msg => msg.role === 'assistant');

  return (
    <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-blue-50 to-teal-50 p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full md:w-[80%] lg:w-[70%] h-[88vh] bg-white/80 backdrop-blur-lg 
                 shadow-2xl rounded-3xl flex flex-col"
      >
        {/* Chat Header */}
        <div className="px-6 py-4 border-b border-teal-100 bg-white/50 backdrop-blur-sm rounded-t-3xl">
          <motion.h2 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-xl font-bold text-gray-800 font-poppins tracking-tight"
          >
            Unthinkable Support
          </motion.h2>
          <p className="text-sm text-gray-500 mt-1">We're here to help you</p>
        </div>

        {/* Messages Container */}
        <div className="flex-1 overflow-y-auto space-y-4 px-6 py-4 pr-4">
          {messages.map((message, index) => (
            <MessageBubble
              key={message.id}
              message={message}
              isUser={message.role === 'user'}
              isFirstAiMessage={index === firstAiMessageIndex}
            />
          ))}
          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <div className="p-6 pt-4 border-t border-teal-100 bg-white/50 backdrop-blur-sm rounded-b-3xl">
          <InputBar onSendMessage={onSendMessage} isLoading={isLoading} />
        </div>
      </motion.div>
    </div>
  );
};

export default ChatWindow;