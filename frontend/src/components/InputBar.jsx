import { useState } from 'react';
import { motion } from 'framer-motion';

const quickOptions = [
  "Reset Password",
  "Track Order",
  "Browser Issues",
  "Refund",
  "Technical Support",
  "Account Help",
  "Payment Issues",
  "Others"
];

const InputBar = ({ onSendMessage, isLoading }) => {
  const [message, setMessage] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (message.trim()) {
      onSendMessage(message);
      setMessage('');
    }
  };

  const handleQuickOption = (option) => {
    onSendMessage(option);
  };

  return (
    <div className="w-full space-y-4">
      {/* Quick Options */}
      <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide -mx-2 px-2">
        {quickOptions.map((option) => (
          <motion.button
            key={option}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => handleQuickOption(option)}
            className="px-4 py-2 rounded-full bg-gradient-to-r from-blue-400 to-teal-400 
                     text-white text-sm font-medium whitespace-nowrap shadow hover:shadow-lg 
                     transition-shadow flex-shrink-0"
          >
            {option}
          </motion.button>
        ))}
      </div>

      {/* Input Form */}
      <form onSubmit={handleSubmit} className="relative flex items-center">
        <div className="flex-1 flex items-center bg-white/70 backdrop-blur-md rounded-full 
                      px-4 py-2 shadow-inner border border-teal-100">
          <input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Type your message..."
            className="w-full bg-transparent border-none focus:outline-none font-poppins 
                     text-gray-700 placeholder-gray-400 pr-[100px]"
            disabled={isLoading}
          />
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            type="submit"
            disabled={isLoading || !message.trim()}
            className="absolute right-2 px-6 py-2 rounded-full bg-gradient-to-r 
                     from-teal-400 to-blue-500 text-white font-medium disabled:opacity-50 
                     hover:shadow-lg transition-shadow"
          >
            Send
          </motion.button>
        </div>
      </form>
    </div>
  );
};

export default InputBar;