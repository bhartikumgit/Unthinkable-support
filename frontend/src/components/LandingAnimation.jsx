import { motion } from 'framer-motion';
import { useEffect } from 'react';

const LandingAnimation = ({ onComplete }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onComplete();
    }, 6000); // 6 seconds

    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 flex items-center justify-center bg-gradient-to-br from-blue-500 via-blue-600 to-blue-700"
    >
      <div className="relative">
        {/* Background blur circle */}
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ duration: 1.5, ease: "easeOut" }}
          className="absolute inset-0 bg-white/20 rounded-full blur-3xl"
          style={{ width: '600px', height: '600px', transform: 'translate(-50%, -50%)' }}
        />
        
        {/* Text animation */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 1 }}
          className="relative text-5xl font-bold text-white text-center font-poppins"
        >
          Welcome to
          <motion.span
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 1.5, duration: 0.8 }}
            className="block text-6xl mt-4 bg-clip-text text-transparent bg-gradient-to-r from-teal-200 to-teal-100"
          >
            Unthinkable Seva
          </motion.span>
        </motion.h1>
      </div>
    </motion.div>
  );
};

export default LandingAnimation;
