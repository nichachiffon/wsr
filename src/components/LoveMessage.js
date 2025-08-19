import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import './LoveMessage.css';

const LoveMessage = ({ message, onClose }) => {
  const [randomPosition, setRandomPosition] = useState({ x: 0, y: 0 });
  
  useEffect(() => {
    // สร้างตำแหน่ง random ที่หลากหลายมากขึ้น
    const generateRandomPosition = () => {
      // สุ่มตำแหน่งแบบกระจายทั่วหน้าจอ
      const screenWidth = window.innerWidth;
      const screenHeight = window.innerHeight;
      
      // คำนวณขนาดของ popup (ประมาณ 400px width, 300px height)
      const popupWidth = 400;
      const popupHeight = 300;
      
      // สุ่มตำแหน่ง x และ y แบบกระจายทั่วหน้าจอ
      // ห่างขอบจออย่างน้อย 50px และไม่ให้ popup เกินขอบจอ
      const minX = 50;
      const maxX = screenWidth - popupWidth - 50;
      const minY = 50;
      const maxY = screenHeight - popupHeight - 50;
      
      const x = Math.random() * (maxX - minX) + minX;
      const y = Math.random() * (maxY - minY) + minY;
      
      return { x: Math.floor(x), y: Math.floor(y) };
    };
    
    const newPosition = generateRandomPosition();
    setRandomPosition(newPosition);
    console.log('New random position:', newPosition);
  }, [message]); // เปลี่ยนตำแหน่งทุกครั้งที่ message เปลี่ยน

  console.log('LoveMessage rendered with message:', message);
  
  return (
    <motion.div
      className="love-message-popup"
      initial={{ opacity: 0, scale: 0 }}
      animate={{ 
        opacity: 1, 
        scale: 1
      }}
      exit={{ opacity: 0, scale: 0 }}
      transition={{ 
        type: "spring", 
        stiffness: 300, 
        damping: 20,
        duration: 0.5
      }}
      style={{
        position: 'fixed',
        top: `${randomPosition.y}px`,
        left: `${randomPosition.x}px`,
        transform: 'none' // ไม่ใช้ transform แบบเดิม
      }}
    >
      <motion.div
        className="message-heart"
        animate={{
          scale: [1, 1.2, 1],
          rotate: [0, 10, -10, 0]
        }}
        transition={{
          duration: 1.5,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      >
        💖
      </motion.div>

      <motion.p
        className="message-text"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3, duration: 0.5 }}
      >
        {message}
      </motion.p>

      <motion.button
        className="close-button"
        onClick={onClose}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5, duration: 0.5 }}
      >
        ปิด
      </motion.button>

      {/* Floating hearts around the message */}
      {[...Array(6)].map((_, i) => (
        <motion.div
          key={i}
          className="message-floating-heart"
          initial={{ 
            opacity: 0,
            scale: 0,
            x: 0,
            y: 0
          }}
          animate={{ 
            opacity: [0, 1, 0],
            scale: [0, 1, 0],
            x: Math.cos(i * 60 * Math.PI / 180) * 80,
            y: Math.sin(i * 60 * Math.PI / 180) * 80
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            delay: i * 0.2,
            ease: "easeInOut"
          }}
        >
          {['💖', '💕', '💗', '💓', '💘', '💞'][i % 6]}
        </motion.div>
      ))}
    </motion.div>
  );
};

export default LoveMessage; 