import React, { useState, useEffect, useRef } from 'react';
import './BackgroundMusic.css';

const BackgroundMusic = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(0.5);
  const [player, setPlayer] = useState(null);
  const [isReady, setIsReady] = useState(false);
  const [error, setError] = useState(null);
  const [isExpanded, setIsExpanded] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [thumbnail, setThumbnail] = useState('');
  const [isDragging, setIsDragging] = useState(false);
  const [currentSongIndex, setCurrentSongIndex] = useState(0);
  const [isMuted, setIsMuted] = useState(false);
  const [hasStarted, setHasStarted] = useState(false);
  const [showPlaylist, setShowPlaylist] = useState(false);
  
  const playerRef = useRef(null);
  const initializationRef = useRef(false);
  const progressRef = useRef(null);
  const timeUpdateInterval = useRef(null);

  // Playlist data
  const playlist = [
    {
      id: 'nR-eDSChKqw',
      title: 'FALL IN LOVE W/NOT',
      artist: 'NOT',
      thumbnail: 'https://img.youtube.com/vi/nR-eDSChKqw/maxresdefault.jpg'
    },
    {
      id: 'lYl7WhMvq9g',
      title: 'ข้อดีข้อเดียวคือรักน้อต',
      artist: 'NOT',
      thumbnail: 'https://img.youtube.com/vi/lYl7WhMvq9g/maxresdefault.jpg'
    },
    {
      id: '1QkX7Qetu2Q',
      title: 'I LOVE NOT A CHATHAI',
      artist: 'NOT',
      thumbnail: 'https://img.youtube.com/vi/1QkX7Qetu2Q/maxresdefault.jpg'
    },
    {
      id: '37tdCAli3N0',
      title: '사랑해',
      artist: 'NOT',
      thumbnail: 'https://img.youtube.com/vi/37tdCAli3N0/maxresdefault.jpg'
    },
    {
      id: 'YAB_X4Tdbgs',
      title: 'NOT IS MINE !!!',
      artist: 'NOT',
      thumbnail: 'https://img.youtube.com/vi/YAB_X4Tdbgs/maxresdefault.jpg'
    },
    {
      id: '7vSdwtHm5q0',
      title: 'LOVE NOT 24/7',
      artist: 'NOT',
      thumbnail: 'https://img.youtube.com/vi/7vSdwtHm5q0/maxresdefault.jpg'
    },
    {
      id: 'LmJUzENql-w',
      title: 'อยากไปKISSน้อต',
      artist: 'NOT',
      thumbnail: 'https://img.youtube.com/vi/LmJUzENql-w/maxresdefault.jpg'
    },
    {
      id: 'MaeX5dV0njY',
        title: 'เค้าจะใจดีกับน้อตเอง',
        artist: 'NOT',
      thumbnail: 'https://img.youtube.com/vi/MaeX5dV0njY/maxresdefault.jpg'
    },
    {
      id: '1fKbgG0c3OI',
      title: 'เป็นน้อตใช่อ๊ะเป่า',
      artist: 'NOT',
      thumbnail: 'https://img.youtube.com/vi/1fKbgG0c3OI/maxresdefault.jpg'
    },
    {
      id: 'rWCULtx785s',
      title: 'ให้เค้าดูแลน้อต',
      artist: 'NOT',
      thumbnail: 'https://img.youtube.com/vi/rWCULtx785s/maxresdefault.jpg'
    },
    {
      id: 'hO0R0YTqnow',
      title: 'น้อตคนโปรด',
      artist: 'NOT',
      thumbnail: 'https://img.youtube.com/vi/hO0R0YTqnow/maxresdefault.jpg'
    },
    {
      id: 'wYUWlWchJ6A',
      title: 'ชอบหน้าหนาวที่มีน้อต',
      artist: 'NOT',
      thumbnail: 'https://img.youtube.com/vi/wYUWlWchJ6A/maxresdefault.jpg'
    },
    {
      id: 'ziVAoQZ8CjA',
      title: 'ถ้าน้อตฟังอยู่',
      artist: 'NOT',
      thumbnail: 'https://img.youtube.com/vi/ziVAoQZ8CjA/maxresdefault.jpg'
    },
    {
      id: 'SnNbi3i-SPU',
      title: 'ฟ้าคงเหงาเมื่อไร้น้อต',
      artist: 'NOT',
      thumbnail: 'https://img.youtube.com/vi/SnNbi3i-SPU/maxresdefault.jpg'
    },
    {
      id: 'm6qgxvYcjGU',
      title: 'น้อตคือชาไทยในยามเช้า',
      artist: 'NOT',
      thumbnail: 'https://img.youtube.com/vi/m6qgxvYcjGU/maxresdefault.jpg'
    },
    {
      id: '5wunh46uVKY',
      title: 'รู้งี้เป็นแฟนน้อตนานแล้ว',
      artist: 'NOT',
      thumbnail: 'https://img.youtube.com/vi/5wunh46uVKY/maxresdefault.jpg'
    },
    {
      id: 'fgj8x925w0o',
      title: 'ตั้งแต่มีน้อตเค้ามีความสุข',
      artist: 'NOT',
      thumbnail: 'https://img.youtube.com/vi/fgj8x925w0o/maxresdefault.jpg'
    },
    {
      id: 'rCAJmH4BA5Y',
      title: 'ฤดูของน้อต',
      artist: 'NOT',
      thumbnail: 'https://img.youtube.com/vi/rCAJmH4BA5Y/maxresdefault.jpg'
    },
    {
      id: 'M7mK5Adi1z8',
      title: 'แต่น้อตไม่เจ้าชู้',
      artist: 'NOT',
      thumbnail: 'https://img.youtube.com/vi/M7mK5Adi1z8/maxresdefault.jpg'
    },
    {
      id: 'fF8YZaquWhg',
      title: 'เมื่อได้พบน้อต',
      artist: 'NOT',
      thumbnail: 'https://img.youtube.com/vi/fF8YZaquWhg/maxresdefault.jpg'
    },
    {
      id: 'CSZozBW7xMI',
      title: 'หลงน้อต',
      artist: 'NOT',
      thumbnail: 'https://img.youtube.com/vi/CSZozBW7xMI/maxresdefault.jpg'
    }
  ];

  useEffect(() => {
    // Prevent multiple initializations
    if (initializationRef.current) return;
    initializationRef.current = true;

    // Set initial thumbnail
    setThumbnail(playlist[currentSongIndex].thumbnail);

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
          videoId: playlist[currentSongIndex].id,
          playerVars: {
            autoplay: 0, // Disable autoplay
            controls: 0,
            disablekb: 1,
            enablejsapi: 1,
            fs: 0,
            iv_load_policy: 3,
            modestbranding: 1,
            rel: 0,
            start: 10, // Start at 10 seconds
            end: 0,   // Play until end
            loop: 0,    // No looping
            mute: 0 // Start unmuted
          },
          events: {
            onReady: (event) => {
              console.log('Player ready!');
              try {
                event.target.setVolume(volume * 100);
                setPlayer(event.target);
                setIsReady(true);
                setError(null);
                
                // Start time update interval
                timeUpdateInterval.current = setInterval(() => {
                  if (event.target.getCurrentTime && event.target.getDuration) {
                    setCurrentTime(event.target.getCurrentTime());
                    setDuration(event.target.getDuration());
                  }
                }, 1000);
                
                console.log('Player ready - no autoplay');
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
                  // Song ended - just stop
                  console.log('Song ended');
                  setIsPlaying(false);
                  setCurrentTime(0);
                } else if (state === playerState.PLAYING) {
                  setIsPlaying(true);
                  setError(null);
                  console.log('Playing...');
                  
                  // Start time update interval if not already running
                  if (!timeUpdateInterval.current) {
                    timeUpdateInterval.current = setInterval(() => {
                      if (event.target.getCurrentTime && event.target.getDuration) {
                        setCurrentTime(event.target.getCurrentTime());
                        setDuration(event.target.getDuration());
                      }
                    }, 1000);
                    console.log('Started time update interval');
                  }
                } else if (state === playerState.CUED) {
                  console.log('Player cued and ready');
                  setCurrentTime(0);
                  setDuration(0);
                } else if (state === playerState.PAUSED) {
                  setIsPlaying(false);
                  console.log('Paused at:', event.target.getCurrentTime());
                } else if (state === playerState.BUFFERING) {
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
      if (timeUpdateInterval.current) {
        clearInterval(timeUpdateInterval.current);
      }
    };
  }, []);

  useEffect(() => {
    if (player && isReady && typeof player.setVolume === 'function') {
      try {
        if (isMuted) {
          player.setVolume(0);
        } else {
          player.setVolume(volume * 100);
        }
      } catch (err) {
        console.error('Error setting volume:', err);
      }
    }
  }, [volume, player, isReady, isMuted]);

  // Reset hasStarted when player changes
  useEffect(() => {
    if (player) {
      setHasStarted(false);
    }
  }, [player]);

  // Auto-scroll playlist to current song when opened
  useEffect(() => {
    if (showPlaylist) {
      // Small delay to ensure DOM is rendered
      setTimeout(() => {
        const activeItem = document.querySelector('.playlist-item.active');
        if (activeItem) {
          activeItem.scrollIntoView({ 
            behavior: 'smooth', 
            block: 'center' 
          });
        }
      }, 100);
    }
  }, [showPlaylist, currentSongIndex]);

  const togglePlay = () => {
    if (!player || !isReady) {
      console.log('Player not ready yet');
      return;
    }

    try {
      if (isPlaying) {
        // Pause the video at current position
        player.pauseVideo();
      } else {
        // Resume from current position, only seek to 10 if it's the first time
        if (!hasStarted) {
          player.seekTo(10);
          setHasStarted(true);
        }
        // If already started, just resume from current position
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
    // If volume is set to 0, unmute
    if (newVolume > 0 && isMuted) {
      setIsMuted(false);
    }
  };

  const clearError = () => {
    setError(null);
  };

  const toggleExpanded = () => {
    setIsExpanded(!isExpanded);
  };

  const toggleMinimized = () => {
    setIsMinimized(!isMinimized);
  };

  const toggleMute = () => {
    if (!player || !isReady) return;
    
    try {
      if (isMuted) {
        // Unmute
        setIsMuted(false);
        player.setVolume(volume * 100);
      } else {
        // Mute
        setIsMuted(true);
        player.setVolume(0);
      }
    } catch (err) {
      console.error('Error toggling mute:', err);
    }
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleProgressClick = (e) => {
    if (!player || !isReady) return;
    
    const rect = progressRef.current.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const progressWidth = rect.width;
    const clickPercent = clickX / progressWidth;
    const newTime = clickPercent * duration;
    
    player.seekTo(newTime);
    setCurrentTime(newTime);
  };

  const handleProgressDrag = (e) => {
    if (!player || !isReady) return;
    
    setIsDragging(true);
    const rect = progressRef.current.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const progressWidth = rect.width;
    const clickPercent = Math.max(0, Math.min(1, clickX / progressWidth));
    const newTime = clickPercent * duration;
    
    setCurrentTime(newTime);
  };

  const handleProgressDragEnd = () => {
    if (!player || !isReady) return;
    
    setIsDragging(false);
    player.seekTo(currentTime);
  };

  const togglePlaylist = (e) => {
    if (e) {
      e.stopPropagation();
    }
    setShowPlaylist(!showPlaylist);
  };

  const selectSongFromPlaylist = (index) => {
    console.log('Selecting song from playlist:', index, playlist[index].title);
    changeSong(index);
    setShowPlaylist(false); // ปิด playlist หลังจากเลือกเพลง
  };

  const changeSong = (index) => {
    console.log('changeSong called with index:', index, 'currentSongIndex:', currentSongIndex);
    if (index === currentSongIndex) {
      console.log('Same song, returning early');
      return;
    }
    
    console.log('Changing to song:', playlist[index].title);
    setCurrentSongIndex(index);
    setThumbnail(playlist[index].thumbnail);
    setHasStarted(false);
    setCurrentTime(0);
    setDuration(0);
    
    // Clear existing time update interval
    if (timeUpdateInterval.current) {
      clearInterval(timeUpdateInterval.current);
      timeUpdateInterval.current = null;
    }
    
    if (player && isReady) {
      console.log('Loading new video:', playlist[index].id);
      try {
        // Use cueVideoById and then start playing at 10 seconds
        player.cueVideoById(playlist[index].id, 10);
        
        // Auto-play the new song after a short delay
        setTimeout(() => {
          if (player && player.playVideo) {
            player.playVideo();
            setIsPlaying(true);
            setHasStarted(true);
            console.log('New song started playing at 10 seconds');
          }
        }, 500);
        
        console.log('New song cued and will start playing');
      } catch (err) {
        console.error('Error changing song:', err);
        setError('เกิดข้อผิดพลาดในการเปลี่ยนเพลง');
      }
    } else {
      console.log('Player not ready or not available');
    }
  };

  const nextSong = () => {
    const nextIndex = (currentSongIndex + 1) % playlist.length;
    changeSong(nextIndex);
  };

  const prevSong = () => {
    const prevIndex = currentSongIndex === 0 ? playlist.length - 1 : currentSongIndex - 1;
    changeSong(prevIndex);
  };

  return (
    <div className={`background-music ${isMinimized ? 'minimized' : ''}`}>
      {/* Hidden YouTube player */}
      <div 
        ref={playerRef}
        style={{ display: 'none' }}
      />
      
      {/* Main Music Player */}
      <div 
        className={`music-player ${isExpanded ? 'expanded' : ''}`}
        onClick={isMinimized ? toggleMinimized : undefined}
        style={{ cursor: isMinimized ? 'pointer' : 'default' }}
      >
        {/* Header with expand/collapse and minimize */}
        <div className="music-header" onClick={toggleExpanded}>
          <div className="music-icon">
            <span className="music-note">♪</span>
            {isPlaying && !isMinimized && <div className="music-waves">
              <span></span>
              <span></span>
              <span></span>
            </div>}
          </div>
          {!isMinimized && (
            <div className="header-controls">
              <button 
                className={`control-btn playlist-btn ${showPlaylist ? 'active' : ''}`}
                onClick={(e) => {
                  e.stopPropagation();
                  togglePlaylist();
                }}
                title="ดู Playlist"
              >
                📋
              </button>
              <button 
                className={`control-btn mute-btn ${isMuted ? 'active' : ''}`}
                onClick={(e) => {
                  e.stopPropagation();
                  toggleMute();
                }}
                title={isMuted ? "เปิดเสียง" : "ปิดเสียง"}
              >
                {isMuted ? '🔇' : '🔊'}
              </button>
              <button 
                className="control-btn minimize-btn"
                onClick={(e) => {
                  e.stopPropagation();
                  toggleMinimized();
                }}
                title={isMinimized ? "ขยาย" : "ย่อ"}
              >
                {isMinimized ? '🔽' : '🔼'}
              </button>
              <div className="expand-icon">
                {isExpanded ? '−' : '+'}
              </div>
            </div>
          )}
        </div>

        {/* Thumbnail and Basic Info (always visible when not minimized) */}
        {!isMinimized && (
          <div className="music-thumbnail">
            <img 
              src={playlist[currentSongIndex].thumbnail} 
              alt={`${playlist[currentSongIndex].title} cover`}
              className="thumbnail-image"
              onError={(e) => {
                e.target.style.display = 'none';
                const fallback = e.target.nextSibling;
                if (fallback && fallback.classList.contains('fallback-overlay')) {
                  fallback.classList.add('show');
                }
              }}
            />
            <div className="thumbnail-overlay fallback-overlay">
              <div className="song-title-mini">{playlist[currentSongIndex].title}</div>
              <div className="song-artist-mini">{playlist[currentSongIndex].artist}</div>
            </div>
          </div>
        )}

        {/* Expanded Content */}
        {isExpanded && !isMinimized && (
          <div className="music-content">
            {/* Error display */}
            {error && (
              <div className="error-message">
                <span className="error-text">{error}</span>
                <button 
                  className="error-close"
                  onClick={clearError}
                >
                  ✕
                </button>
              </div>
            )}
            
            {/* Progress Bar */}
            <div className="progress-section">
              <div className="time-display">
                <span className="current-time">{formatTime(currentTime)}</span>
                <span className="duration">{formatTime(duration)}</span>
              </div>
              <div 
                className="progress-bar"
                ref={progressRef}
                onClick={handleProgressClick}
                onMouseDown={handleProgressDrag}
                onMouseMove={isDragging ? handleProgressDrag : undefined}
                onMouseUp={handleProgressDragEnd}
                onMouseLeave={handleProgressDragEnd}
              >
                <div className="progress-fill" style={{ width: `${(currentTime / duration) * 100}%` }}></div>
                <div className="progress-thumb" style={{ left: `${(currentTime / duration) * 100}%` }}></div>
              </div>
            </div>
            
            {/* Music controls */}
            <div className="music-controls">
              <button
                className="control-btn prev-btn"
                onClick={prevSong}
                title="Previous Song"
              >
                ⏮
              </button>
              
              <button
                className={`play-button ${isPlaying ? 'playing' : ''} ${!isReady ? 'disabled' : ''}`}
                onClick={togglePlay}
                disabled={!isReady}
              >
                <span className="play-icon">
                  {isPlaying ? '⏸' : '▶'}
                </span>
              </button>
              
              <button
                className="control-btn next-btn"
                onClick={nextSong}
                title="Next Song"
              >
                ⏭
              </button>
            </div>
            
            {/* Volume Section */}
            <div className="volume-section">
              <div className="volume-icon">
                {isMuted ? '🔇' : '🔊'}
              </div>
              <input
                type="range"
                className="volume-slider"
                min="0"
                max="1"
                step="0.1"
                value={isMuted ? 0 : volume}
                onChange={handleVolumeChange}
                disabled={!isReady}
              />
              <span className="volume-percentage">
                {isMuted ? '0%' : `${Math.round(volume * 100)}%`}
              </span>
            </div>
            
            {/* Music info */}
            <div className="music-info">
              <div className="song-title">
                {playlist[currentSongIndex].title}
              </div>
              <div className="song-artist">
                {playlist[currentSongIndex].artist}
              </div>
              <div className="song-status">
                {error ? 'เกิดข้อผิดพลาด' : 
                 isReady ? (isPlaying ? 'กำลังเล่น ♪' : 'พร้อมเล่น ♪') : 'กำลังโหลด...'}
                {isMuted && ' (ปิดเสียง)'}
              </div>
            </div>
          </div>
        )}

        {/* Playlist section removed */}
      </div>

      {/* Playlist Section */}
      {showPlaylist && !isMinimized && (
        <div className="playlist-section">
          <div className="playlist-header">
            <h3>🎵  Playlist Love song  ⋆˚✿˖</h3>
            <button 
              className="close-playlist-btn"
              onClick={(e) => {
                e.stopPropagation();
                togglePlaylist();
              }}
              title="ปิด Playlist"
            >
              ✕
            </button>
          </div>
          <div className="playlist-content">
            {playlist.map((song, index) => (
              <div 
                key={song.id}
                className={`playlist-item ${index === currentSongIndex ? 'active' : ''}`}
                onClick={(e) => {
                  e.stopPropagation();
                  selectSongFromPlaylist(index);
                }}
              >
                <div className="playlist-thumbnail">
                  <img 
                    src={song.thumbnail} 
                    alt={`${song.title} cover`}
                    onError={(e) => {
                      e.target.style.display = 'none';
                    }}
                  />
                </div>
                <div className="playlist-info">
                  <div className="playlist-title">{song.title}</div>
                  <div className="playlist-artist">{song.artist}</div>
                </div>
                <div className="playlist-status">
                  {index === currentSongIndex ? '▶️ กำลังเล่น' : ''}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default BackgroundMusic;