import { motion } from 'framer-motion';
import ImageUploadPrompt from './ImageUploadPrompt';

const MessageBubble = ({ message, isUser, isFirstAiMessage }) => {
  const timestamp = new Date(message.timestamp).toLocaleTimeString([], { 
    hour: '2-digit', 
    minute: '2-digit' 
  });

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`flex ${isUser ? 'justify-end' : 'justify-start'} mb-4`}
    >
      <div className="max-w-[85%]">
        <div
          className={`
            p-4 rounded-xl shadow-lg
            ${isUser 
              ? 'bg-gradient-to-r from-teal-400 to-blue-500 text-white' 
              : 'bg-white/90 border border-teal-100 backdrop-blur-sm text-gray-800'
            }
          `}
        >
          <pre className={`
            whitespace-pre-line font-poppins text-[16px] leading-relaxed tracking-wide
            ${!isUser && 'bot-message'}
          `}>
            {message.content}
          </pre>
          
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.7 }}
            transition={{ delay: 0.5 }}
            className={`mt-2 text-xs font-light ${isUser ? 'text-teal-100' : 'text-gray-500'}`}
          >
            {timestamp}
          </motion.div>
        </div>

        {/* Image upload prompt after first AI message */}
        {!isUser && isFirstAiMessage && <ImageUploadPrompt />}
      </div>
    </motion.div>
  );
};

export default MessageBubble;