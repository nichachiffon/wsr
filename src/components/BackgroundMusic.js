import React, { useState, useEffect, useRef } from 'react';

const BackgroundMusic = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(0.5);
  const [player, setPlayer] = useState(null);
  const [isReady, setIsReady] = useState(false);
  const [error, setError] = useState(null);
  const playerRef = useRef(null);
  const initializationRef = useRef(false);

  useEffect(() => {
    // Prevent multiple initializations
    if (initializationRef.current) return;
    initializationRef.current = true;

    // Load YouTube API
    const loadYouTubeAPI = () => {
      return new Promise((resolve, reject) => {
        if (window.YT && window.YT.Player) {
          resolve();
          return;
        }

        // Set up the callback before loading script
        window.onYouTubeIframeAPIReady = () => {
          resolve();
        };
        
        if (!document.querySelector('script[src*="youtube"]')) {
          const script = document.createElement('script');
          script.src = 'https://www.youtube.com/iframe_api';
          script.async = true;
          script.onerror = () => reject(new Error('Failed to load YouTube API'));
          document.head.appendChild(script);
        } else {
          // Script already exists, wait for it to load
          const checkAPI = () => {
            if (window.YT && window.YT.Player) {
              resolve();
            } else {
              setTimeout(checkAPI, 100);
            }
          };
          checkAPI();
        }
      });
    };

    const initializePlayer = async () => {
      try {
        await loadYouTubeAPI();
        
        if (!playerRef.current) {
          console.error('Player ref not available');
          return;
        }
        
        const ytPlayer = new window.YT.Player(playerRef.current, {
          height: '0',
          width: '0',
          videoId: 'ThEftPScNwA',
          playerVars: {
            autoplay: 0,
            controls: 0,
            disablekb: 1,
            enablejsapi: 1,
            fs: 0,
            iv_load_policy: 3,
            modestbranding: 1,
            rel: 0,
            start: 14, // Start at 14 seconds
            end: 0,   // Play until end
            loop: 0,    // We'll handle looping manually
            playlist: 'ThEftPScNwA' // Required for looping
          },
          events: {
            onReady: (event) => {
              console.log('Player ready!');
              try {
                event.target.setVolume(volume * 100);
                setPlayer(event.target);
                setIsReady(true);
                setError(null);
              } catch (err) {
                console.error('Error in onReady:', err);
                setError('เกิดข้อผิดพลาดในการเตรียม player');
              }
            },
            onStateChange: (event) => {
              try {
                const state = event.data;
                const playerState = window.YT.PlayerState;
                
                if (state === playerState.ENDED) {
                  // Loop back to 14 seconds
                  event.target.seekTo(14);
                  event.target.playVideo();
                } else if (state === playerState.PLAYING) {
                  setIsPlaying(true);
                  // Check if we need to loop (removed time range check since we play full video)
                  console.log('Playing...');
                } else if (state === playerState.PAUSED) {
                  setIsPlaying(false);
                } else if (state === playerState.BUFFERING) {
                  // Handle buffering state
                  console.log('Player is buffering...');
                }
              } catch (err) {
                console.error('Error in onStateChange:', err);
              }
            },
            onError: (event) => {
              console.error('YouTube player error:', event.data);
              const errorMessages = {
                2: 'วิดีโอ ID ไม่ถูกต้อง',
                5: 'เกิดข้อผิดพลาดของ HTML5 player',
                100: 'ไม่พบวิดีโอ',
                101: 'เจ้าของวิดีโอไม่อนุญาตให้ฝังในเว็บไซต์อื่น',
                150: 'เจ้าของวิดีโอไม่อนุญาตให้ฝังในเว็บไซต์อื่น'
              };
              setError(errorMessages[event.data] || `เกิดข้อผิดพลาด: ${event.data}`);
              setIsReady(false);
            }
          }
        });
      } catch (error) {
        console.error('Failed to initialize YouTube player:', error);
        setError('ไม่สามารถเริ่มต้น YouTube player ได้');
      }
    };

    // Add a small delay to ensure DOM is ready
    setTimeout(initializePlayer, 100);

    return () => {
      if (player && typeof player.destroy === 'function') {
        try {
          player.destroy();
        } catch (err) {
          console.error('Error destroying player:', err);
        }
      }
    };
  }, []); // Remove volume dependency to prevent re-initialization

  useEffect(() => {
    if (player && isReady && typeof player.setVolume === 'function') {
      try {
        player.setVolume(volume * 100);
      } catch (err) {
        console.error('Error setting volume:', err);
      }
    }
  }, [volume, player, isReady]);

  const togglePlay = () => {
    if (!player || !isReady) {
      console.log('Player not ready yet');
      return;
    }

    try {
      if (isPlaying) {
        player.pauseVideo();
      } else {
        // Start from 14 seconds
        player.seekTo(14);
        player.playVideo();
      }
    } catch (error) {
      console.error('Error toggling play:', error);
      setError('เกิดข้อผิดพลาดในการควบคุมการเล่น');
    }
  };

  const handleVolumeChange = (e) => {
    const newVolume = parseFloat(e.target.value);
    setVolume(newVolume);
  };

  const clearError = () => {
    setError(null);
  };

  return (
    <div className="background-music" style={{
      position: 'fixed',
      top: '20px',
      right: '20px',
      zIndex: 1000,
      background: 'rgba(0, 0, 0, 0.8)',
      borderRadius: '15px',
      padding: '15px',
      backdropFilter: 'blur(10px)',
      border: '1px solid rgba(255, 255, 255, 0.1)',
      fontFamily: 'Arial, sans-serif',
      maxWidth: '350px'
    }}>
      {/* Hidden YouTube player */}
      <div 
        ref={playerRef}
        style={{ display: 'none' }}
      />
      
      {/* Error display */}
      {error && (
        <div style={{
          background: 'rgba(255, 0, 0, 0.2)',
          border: '1px solid rgba(255, 0, 0, 0.5)',
          borderRadius: '8px',
          padding: '8px',
          marginBottom: '10px',
          fontSize: '12px',
          color: '#ffcccc',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <span>{error}</span>
          <button 
            onClick={clearError}
            style={{
              background: 'none',
              border: 'none',
              color: '#ffcccc',
              cursor: 'pointer',
              fontSize: '14px',
              padding: '0 5px'
            }}
          >
            ✕
          </button>
        </div>
      )}
      
      {/* Music controls */}
      <div 
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '15px',
          color: 'white'
        }}
      >
        <button
          onClick={togglePlay}
          disabled={!isReady}
          style={{
            background: isPlaying ? 'linear-gradient(45deg, #ff6b6b, #ee5a24)' : 'linear-gradient(45deg, #4CAF50, #45a049)',
            border: 'none',
            borderRadius: '50%',
            width: '50px',
            height: '50px',
            fontSize: '20px',
            cursor: isReady ? 'pointer' : 'not-allowed',
            transition: 'all 0.3s ease',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            opacity: isReady ? 1 : 0.5,
            boxShadow: isReady ? '0 4px 15px rgba(0,0,0,0.3)' : 'none'
          }}
          onMouseEnter={(e) => {
            if (isReady) e.target.style.transform = 'scale(1.1)';
          }}
          onMouseLeave={(e) => {
            e.target.style.transform = 'scale(1)';
          }}
        >
          {isPlaying ? '⏸️' : '▶️'}
        </button>
        
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flex: 1 }}>
          <span style={{ fontSize: '16px' }}>🔊</span>
          <input
            type="range"
            min="0"
            max="1"
            step="0.1"
            value={volume}
            onChange={handleVolumeChange}
            disabled={!isReady}
            style={{
              width: '80px',
              height: '5px',
              borderRadius: '5px',
              background: isReady ? '#ddd' : '#666',
              outline: 'none',
              cursor: isReady ? 'pointer' : 'not-allowed',
              opacity: isReady ? 1 : 0.5
            }}
          />
          <span style={{ fontSize: '12px', minWidth: '30px' }}>
            {Math.round(volume * 100)}%
          </span>
        </div>
      </div>
      
      <div style={{
        marginTop: '10px',
        fontSize: '12px',
        textAlign: 'center',
        color: 'white'
      }}>
        <div style={{ fontWeight: 'bold', marginBottom: '2px' }}>
         FALL IN LOVE W/NOT
        </div>
        <div style={{ opacity: 0.7, fontSize: '10px' }}>
          {error ? 'เกิดข้อผิดพลาด' : 
           isReady ? (isPlaying ? 'กำลังเล่น' : 'พร้อมเล่น') : 'กำลังโหลด...'}
        </div>
      </div>
    </div>
  );
};

export default BackgroundMusic;