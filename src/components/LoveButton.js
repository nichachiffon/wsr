import React, { useState } from 'react';
import { motion } from 'framer-motion';
import './LoveButton.css';

const LoveButton = ({ onClick }) => {
  const [isPressed, setIsPressed] = useState(false);

  const handleClick = () => {
    setIsPressed(true);
    onClick();

    // Reset button state after animation
    setTimeout(() => setIsPressed(false), 300);
  };

  return (
    <motion.div
      className="love-button-container"
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ duration: 0.5, delay: 2 }}
    >
      <motion.button
        className={`love-button ${isPressed ? 'pressed' : ''}`}
        onClick={handleClick}
        whileHover={{ 
          scale: 1.1,
          rotate: [0, -10, 10, -10, 0],
          transition: { duration: 0.3 }
        }}
        whileTap={{ scale: 0.9 }}
        animate={isPressed ? {
          scale: [1, 1.2, 1],
          rotate: [0, 15, -15, 0],
          transition: { duration: 0.3 }
        } : {}}
      >
        <motion.div
          className="heart-icon"
          animate={{
            scale: [1, 1.2, 1],
            rotate: [0, 5, -5, 0]
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        >
          🩷
        </motion.div>

        <motion.div
          className="button-text"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 2.5 }}
        >
          รบกวนเบบี๋มากดตงนิ ⎛⎝( ` ᢍ ´ )⎠⎞ᵐᵘʰᵃʰᵃ
        </motion.div>
      </motion.button>
    </motion.div>
  );
};

export default LoveButton; 