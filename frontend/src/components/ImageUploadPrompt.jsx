import { useState } from 'react';
import { motion } from 'framer-motion';

const ImageUploadPrompt = () => {
  const [previewUrl, setPreviewUrl] = useState(null);

  const handleImageChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      console.log('Selected file:', file); // For development
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="mt-4 p-4 bg-white/50 backdrop-blur-sm rounded-xl border border-teal-100"
    >
      <p className="text-sm text-gray-600 mb-3">
        Please provide an image for better understanding:
      </p>
      
      <div className="flex items-center gap-4">
        <label className="flex-shrink-0 px-4 py-2 rounded-full bg-gradient-to-r from-blue-400 to-teal-400 
                       text-white text-sm cursor-pointer hover:shadow-lg transition-shadow">
          Choose Image
          <input
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            className="hidden"
          />
        </label>

        {previewUrl && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="relative group"
          >
            <img
              src={previewUrl}
              alt="Preview"
              className="w-16 h-16 object-cover rounded-lg shadow-md"
            />
            <button
              onClick={() => setPreviewUrl(null)}
              className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-5 h-5 
                       flex items-center justify-center text-xs opacity-0 group-hover:opacity-100 
                       transition-opacity"
            >
              ×
            </button>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
};

export default ImageUploadPrompt;
