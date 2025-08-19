import React from 'react';

const LoveMessage = ({ message, onClose }) => {
  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        background: 'rgba(0, 0, 0, 0.8)',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 2000,
        animation: 'fadeIn 0.3s ease-in-out'
      }}
      onClick={onClose}
    >
      <div
        style={{
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          borderRadius: '20px',
          padding: '40px',
          maxWidth: '500px',
          textAlign: 'center',
          position: 'relative',
          animation: 'messageSlideIn 0.5s ease-out',
          boxShadow: '0 20px 60px rgba(0,0,0,0.3)',
          overflow: 'hidden'
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <div
          style={{
            fontSize: '48px',
            marginBottom: '20px',
            animation: 'heartBeat 1s infinite ease-in-out'
          }}
        >
          💖
        </div>
        
        <p
          style={{
            color: 'white',
            fontSize: '20px',
            margin: '20px 0',
            lineHeight: '1.6',
            animation: 'textFadeIn 0.5s ease-out 0.2s both',
            opacity: 0
          }}
        >
          {message || "ขอบคุณที่กดนะคะ! ❤️ เป็นเบบี๋ที่น่ารักมากเลย 🥰"}
        </p>
        
        <button
          onClick={onClose}
          style={{
            background: 'linear-gradient(45deg, #ff6b6b, #ee5a24)',
            border: 'none',
            borderRadius: '25px',
            padding: '10px 25px',
            color: 'white',
            fontSize: '16px',
            cursor: 'pointer',
            fontWeight: 'bold',
            boxShadow: '0 4px 15px rgba(238, 90, 36, 0.4)',
            transition: 'all 0.3s ease',
            animation: 'buttonFadeIn 0.5s ease-out 0.4s both',
            opacity: 0
          }}
          onMouseEnter={(e) => {
            e.target.style.transform = 'scale(1.1)';
            e.target.style.boxShadow = '0 6px 20px rgba(238, 90, 36, 0.6)';
          }}
          onMouseLeave={(e) => {
            e.target.style.transform = 'scale(1)';
            e.target.style.boxShadow = '0 4px 15px rgba(238, 90, 36, 0.4)';
          }}
        >
          CLOSE
        </button>
        
        {/* Floating hearts around the message */}
        {[...Array(8)].map((_, i) => (
          <div
            key={i}
            style={{
              position: 'absolute',
              fontSize: '20px',
              pointerEvents: 'none',
              animation: `floatingHeart${i % 4} 2s infinite ease-in-out`,
              animationDelay: `${i * 0.1}s`
            }}
          >
            {['💖', '💕', '💗', '💓', '💘', '💞'][i % 6]}
          </div>
        ))}
      </div>

      <style jsx>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }

        @keyframes messageSlideIn {
          from {
            opacity: 0;
            transform: scale(0) rotate(-180deg);
          }
          to {
            opacity: 1;
            transform: scale(1) rotate(0deg);
          }
        }

        @keyframes heartBeat {
          0%, 100% { 
            transform: scale(1) rotate(0deg); 
          }
          25% { 
            transform: scale(1.2) rotate(10deg); 
          }
          75% { 
            transform: scale(1.1) rotate(-10deg); 
          }
        }

        @keyframes textFadeIn {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes buttonFadeIn {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes floatingHeart0 {
          0% { 
            opacity: 0; 
            transform: scale(0) translate(50px, 50px); 
          }
          50% { 
            opacity: 1; 
            transform: scale(1) translate(120px, -80px); 
          }
          100% { 
            opacity: 0; 
            transform: scale(0) translate(180px, -150px); 
          }
        }

        @keyframes floatingHeart1 {
          0% { 
            opacity: 0; 
            transform: scale(0) translate(-50px, 50px); 
          }
          50% { 
            opacity: 1; 
            transform: scale(1) translate(-120px, -80px); 
          }
          100% { 
            opacity: 0; 
            transform: scale(0) translate(-180px, -150px); 
          }
        }

        @keyframes floatingHeart2 {
          0% { 
            opacity: 0; 
            transform: scale(0) translate(0, -50px); 
          }
          50% { 
            opacity: 1; 
            transform: scale(1) translate(0, -120px); 
          }
          100% { 
            opacity: 0; 
            transform: scale(0) translate(0, -200px); 
          }
        }

        @keyframes floatingHeart3 {
          0% { 
            opacity: 0; 
            transform: scale(0) translate(0, 50px); 
          }
          50% { 
            opacity: 1; 
            transform: scale(1) translate(0, 120px); 
          }
          100% { 
            opacity: 0; 
            transform: scale(0) translate(0, 200px); 
          }
        }
      `}</style>
    </div>
  );
};

export default LoveMessage;