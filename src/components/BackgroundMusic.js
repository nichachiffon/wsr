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
  const [showPlaylist, setShowPlaylist] = useState(false);
  const [currentSongIndex, setCurrentSongIndex] = useState(0);
  const [autoplayAttempted, setAutoplayAttempted] = useState(false);
  const [autoplayEnabled, setAutoplayEnabled] = useState(true);
  const [isMuted, setIsMuted] = useState(false);
  const [hasStarted, setHasStarted] = useState(false);
  
  const playerRef = useRef(null);
  const initializationRef = useRef(false);
  const progressRef = useRef(null);
  const timeUpdateInterval = useRef(null);

  // Playlist data
  const playlist = [
    {
      id: 'ThEftPScNwA',
      title: 'FALL IN LOVE W/NOT',
      artist: 'NOT',
      thumbnail: 'https://img.youtube.com/vi/ThEftPScNwA/maxresdefault.jpg'
    },
    {
      id: 'Am-lOD0AvVE',
      title: 'Plum Condo',
      artist: 'BABYBIGBOY',
      thumbnail: 'https://img.youtube.com/vi/Am-lOD0AvVE/maxresdefault.jpg'
    },
    {
      id: 'dQw4w9WgXcQ',
      title: 'Never Gonna Give You Up',
      artist: 'Rick Astley',
      thumbnail: 'https://img.youtube.com/vi/dQw4w9WgXcQ/maxresdefault.jpg'
    },
    {
      id: '9bZkp7q19f0',
      title: 'PSY - GANGNAM STYLE',
      artist: 'PSY',
      thumbnail: 'https://img.youtube.com/vi/9bZkp7q19f0/maxresdefault.jpg'
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
            autoplay: 1, // Enable autoplay
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
            playlist: playlist[currentSongIndex].id, // Required for looping
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
                
                // Attempt autoplay
                if (!autoplayAttempted && autoplayEnabled) {
                  setAutoplayAttempted(true);
                  setTimeout(() => {
                    try {
                      event.target.seekTo(14);
                      event.target.playVideo();
                      setHasStarted(true);
                      console.log('Autoplay attempted');
                    } catch (err) {
                      console.log('Autoplay failed, user interaction required');
                      setError('คลิกปุ่มเล่นเพื่อเริ่มเพลง (เบราว์เซอร์ต้องการการโต้ตอบจากผู้ใช้)');
                    }
                  }, 1000); // Small delay to ensure player is fully ready
                }
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
                  // Loop back to 14 seconds only when song actually ends
                  event.target.seekTo(14);
                  event.target.playVideo();
                  setHasStarted(false); // Reset for next loop
                } else if (state === playerState.PLAYING) {
                  setIsPlaying(true);
                  setError(null); // Clear any autoplay errors when playing starts
                  console.log('Playing...');
                } else if (state === playerState.PAUSED) {
                  setIsPlaying(false);
                  console.log('Paused at:', event.target.getCurrentTime());
                } else if (state === playerState.BUFFERING) {
                  console.log('Player is buffering...');
                } else if (state === playerState.CUED) {
                  console.log('Player cued and ready');
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
  }, []); // Remove volume dependency to prevent re-initialization

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
        // Resume from current position, only seek to 14 if it's the first time
        if (!hasStarted) {
          player.seekTo(14);
          setHasStarted(true);
        }
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

  const togglePlaylist = () => {
    setShowPlaylist(!showPlaylist);
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

  const toggleAutoplay = () => {
    setAutoplayEnabled(!autoplayEnabled);
    if (!autoplayEnabled && player && isReady && !isPlaying) {
      // If enabling autoplay and player is ready but not playing, start playing
      try {
        player.playVideo();
      } catch (err) {
        console.log('Cannot start playing automatically');
      }
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

  const changeSong = (index) => {
    if (index === currentSongIndex) return;
    
    setCurrentSongIndex(index);
    setThumbnail(playlist[index].thumbnail);
    setHasStarted(false); // Reset hasStarted for new song
    setCurrentTime(0); // Reset current time for new song
    
    if (player && isReady) {
      player.loadVideoById(playlist[index].id);
      player.seekTo(14);
      if (isPlaying) {
        player.playVideo();
      }
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
      <div className={`music-player ${isExpanded ? 'expanded' : ''}`}>
        {/* Header with expand/collapse and minimize */}
        <div className="music-header" onClick={toggleExpanded}>
          <div className="music-icon">
            <span className="music-note">♪</span>
            {isPlaying && <div className="music-waves">
              <span></span>
              <span></span>
              <span></span>
            </div>}
          </div>
          <div className="header-controls">
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
              className={`control-btn autoplay-btn ${autoplayEnabled ? 'active' : ''}`}
              onClick={(e) => {
                e.stopPropagation();
                toggleAutoplay();
              }}
              title={autoplayEnabled ? "ปิด Autoplay" : "เปิด Autoplay"}
            >
              {autoplayEnabled ? '▶️' : '⏸️'}
            </button>
            <button 
              className="control-btn playlist-btn"
              onClick={(e) => {
                e.stopPropagation();
                togglePlaylist();
              }}
              title="Playlist"
            >
              📋
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

        {/* Playlist */}
        {showPlaylist && !isMinimized && (
          <div className="playlist-panel">
            <div className="playlist-header">
              <span className="playlist-title">🎵 Playlist</span>
              <button 
                className="playlist-close"
                onClick={togglePlaylist}
              >
                ✕
              </button>
            </div>
            <div className="playlist-songs">
              {playlist.map((song, index) => (
                <div 
                  key={song.id}
                  className={`playlist-song ${index === currentSongIndex ? 'current' : ''}`}
                  onClick={() => changeSong(index)}
                >
                  <div className="playlist-thumbnail">
                    <img 
                      src={song.thumbnail} 
                      alt={`${song.title} cover`}
                      className="playlist-cover"
                      onError={(e) => {
                        e.target.style.display = 'none';
                        const fallback = e.target.nextSibling;
                        if (fallback && fallback.classList.contains('playlist-fallback')) {
                          fallback.classList.add('show');
                        }
                      }}
                    />
                    <div className="playlist-fallback">
                      <span className="fallback-icon">♪</span>
                    </div>
                  </div>
                  <div className="playlist-song-info">
                    <div className="playlist-song-title">{song.title}</div>
                    <div className="playlist-song-artist">{song.artist}</div>
                  </div>
                  {index === currentSongIndex && (
                    <div className="current-indicator">
                      <span className="playing-icon">♪</span>
                      <span className="playing-text">กำลังเล่น</span>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default BackgroundMusic;