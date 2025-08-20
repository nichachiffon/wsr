import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import './App.css';
import HeartbeatMonitor from './components/HeartbeatMonitor';
import LoveButton from './components/LoveButton';
import LoveMessage from './components/LoveMessage';
import BackgroundMusic from './components/BackgroundMusic';
import LoveLock from './components/LoveLock';

function App() {
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [showMessage, setShowMessage] = useState(false);
  const [currentMessage, setCurrentMessage] = useState(0);

  // Debug useEffect
  useEffect(() => {
    console.log('showMessage changed to:', showMessage);
    console.log('currentMessage changed to:', currentMessage);
  }, [showMessage, currentMessage]);

  const loveMessages = [
    "เค้ารักเบบี๋ อิอิ",
    "เค้ารักเบบี๋ที่สุดในโลก(ของเค้าเอง)",
    "Happy birthday to the one Who stole my heart !",
    "ขอให้เบบี๋ไม่ปวดหลังตลอดไป",
    "คิดไม่ออกละ คิดถึงแต่เบบี๋",
    "เค้าจาไม่ร้องให้แงแงให้เบบี๋ไม่สบายใจแล้วค่ะ",
    "เบบี๋คนเก่งโตแย้ว ม่ายดื้อและนะคะ",
    "เค้าขอให้ เบบี๋ มีความสุขม้ากมากนะคะ",
    "ขอให้เธอสบายใจที่จะอยู่กับเค้าแบบนี้ตลอดไปนะคะ",
    "ขอให้เธอมีความสุขม้ากมากนะคะ",
    "สุขสันต์วันเกิดเธอนะคะ",
    "ขอบคุณที่เป็นคนที่น่ารักมากๆนะคะ",
  ];

  const handleLoveClick = () => {
    console.log('Button clicked!');
    const randomIndex = Math.floor(Math.random() * loveMessages.length);
    console.log('Random index:', randomIndex);
    console.log('Message:', loveMessages[randomIndex]);
    
    // ปิด popup ก่อนเพื่อให้แสดงใหม่ในตำแหน่งใหม่
    setShowMessage(false);
    
    // รอสักครู่แล้วแสดง popup ใหม่
    setTimeout(() => {
      setCurrentMessage(randomIndex);
      setShowMessage(true);
      console.log('showMessage set to true with new position');
    }, 100);
  };

  const handleMessageClose = () => {
    setShowMessage(false);
  };

  return (
    <div className="App">
      {/* Background Music */}
      <BackgroundMusic />
      
      {!isUnlocked && (
        <LoveLock onUnlock={() => setIsUnlocked(true)} />
      )}
      
      {isUnlocked && (
        <>
      {/* Background Grid */}
      <div className="grid"></div>
      
      {/* Main Content */}
      <div className="content">
        <motion.h1 
          className="title"
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.5 }}
        >
          ❀ To the sweetest boyfriend ever ❀
        </motion.h1>
        
        <motion.p 
          className="subtitle"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 1 }}
        >
sending you birthday wishes, xoxo
</motion.p>

        {/* Heartbeat Monitor */}
        <HeartbeatMonitor />

        {/* Love Button */}
        <LoveButton onClick={handleLoveClick} />

        {/* Love Messages */}
        <AnimatePresence>
          {showMessage && (
            <LoveMessage 
              message={loveMessages[currentMessage]}
              onClose={handleMessageClose}
            />
          )}
        </AnimatePresence>
      </div>

      {/* Floating Hearts */}
      <div className="floating-hearts">
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className="floating-heart"
            initial={{ 
              x: Math.random() * window.innerWidth,
              y: window.innerHeight + 100,
              opacity: 0
            }}
            animate={{ 
              y: -100,
              opacity: [0, 1, 0],
              scale: [0, 1, 0]
            }}
            transition={{
              duration: Math.random() * 6 + 8, // ช้าลงจากเดิม
              repeat: Infinity,
              delay: Math.random() * 4, // หน่วงเวลามากขึ้น
              ease: "easeInOut"
            }}
          >
            {['ʚɞ', '♡', '✿', '❤︎', '✮', '𔓘', '✦︎'][Math.floor(Math.random() * 7)]}
          </motion.div>
        ))}
      </div>
        </>
      )}
    </div>
  );
}

export default App; 