'use client';

import { useState, useRef, useEffect } from 'react';
import { Play, Pause, Volume2, VolumeX, Maximize, RotateCcw, ExternalLink } from 'lucide-react';

interface VideoPlayerProps {
  videoUrl: string;
  title?: string;
  onProgress?: (currentTime: number, duration: number) => void;
  onComplete?: () => void;
  className?: string;
  startTime?: number;
}

export default function VideoPlayer({
  videoUrl,
  title,
  onProgress,
  onComplete,
  className = '',
  startTime = 0
}: VideoPlayerProps) {
  // Validar que videoUrl sea válido
  if (!videoUrl || typeof videoUrl !== 'string') {
    return (
      <div className={`video-container error-container ${className}`}>
        <div className="error-message">
          <p>Error: URL de video no válida</p>
        </div>
        <style jsx>{`
          .error-container {
            padding: 2rem;
            background: #f3f4f6;
            border-radius: 12px;
            text-align: center;
            color: #6b7280;
          }
          .error-message p {
            margin: 0;
            font-size: 1rem;
          }
        `}</style>
      </div>
    );
  }

  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  const [isMuted, setIsMuted] = useState(false);
  const [showControls, setShowControls] = useState(true);
  const [isFullscreen, setIsFullscreen] = useState(false);
  
  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const controlsTimeoutRef = useRef<NodeJS.Timeout>();

  // Detectar si es una URL de YouTube
  const isYouTubeUrl = (url: string) => {
    if (!url || typeof url !== 'string') return false;
    return url.includes('youtube.com') || url.includes('youtu.be');
  };

  // Convertir URL de YouTube a embed con parámetros para mantener en la plataforma
  const getYouTubeEmbedUrl = (url: string) => {
    const videoId = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\n?#]+)/)?.[1];
    if (videoId) {
      // Parámetros para mantener el video dentro de la plataforma
      const params = new URLSearchParams({
        autoplay: '0',
        modestbranding: '1',
        rel: '0',
        showinfo: '0',
        controls: '1',
        disablekb: '0',
        fs: '1',
        iv_load_policy: '3',
        cc_load_policy: '0',
        origin: window.location.origin
      });
      return `https://www.youtube.com/embed/${videoId}?${params.toString()}`;
    }
    return url;
  };

  // Configurar controles automáticos
  const showControlsTemporarily = () => {
    setShowControls(true);
    if (controlsTimeoutRef.current) {
      clearTimeout(controlsTimeoutRef.current);
    }
    controlsTimeoutRef.current = setTimeout(() => {
      if (isPlaying) {
        setShowControls(false);
      }
    }, 3000);
  };

  // Eventos del video
  const handleLoadedMetadata = () => {
    if (videoRef.current) {
      setDuration(videoRef.current.duration);
      // Establecer el tiempo inicial si se proporciona
      if (startTime > 0) {
        videoRef.current.currentTime = startTime;
        setCurrentTime(startTime);
      }
    }
  };

  const handleTimeUpdate = () => {
    if (videoRef.current) {
      const current = videoRef.current.currentTime;
      setCurrentTime(current);
      onProgress?.(current, duration);
    }
  };

  const handleEnded = () => {
    setIsPlaying(false);
    onComplete?.();
  };

  // Controles del video
  const togglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const time = parseFloat(e.target.value);
    if (videoRef.current) {
      videoRef.current.currentTime = time;
      setCurrentTime(time);
    }
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVolume = parseFloat(e.target.value);
    setVolume(newVolume);
    if (videoRef.current) {
      videoRef.current.volume = newVolume;
    }
    if (newVolume === 0) {
      setIsMuted(true);
    } else if (isMuted) {
      setIsMuted(false);
    }
  };

  const toggleMute = () => {
    if (videoRef.current) {
      if (isMuted) {
        videoRef.current.volume = volume;
        setIsMuted(false);
      } else {
        videoRef.current.volume = 0;
        setIsMuted(true);
      }
    }
  };

  const toggleFullscreen = () => {
    if (containerRef.current) {
      if (!isFullscreen) {
        containerRef.current.requestFullscreen();
        setIsFullscreen(true);
      } else {
        document.exitFullscreen();
        setIsFullscreen(false);
      }
    }
  };

  const restart = () => {
    if (videoRef.current) {
      videoRef.current.currentTime = 0;
      setCurrentTime(0);
    }
  };

  // Formatear tiempo
  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  // Limpiar timeout al desmontar
  useEffect(() => {
    return () => {
      if (controlsTimeoutRef.current) {
        clearTimeout(controlsTimeoutRef.current);
      }
    };
  }, []);

  // Si es una URL de YouTube, mostrar iframe integrado
  if (isYouTubeUrl(videoUrl)) {
    return (
      <div className={`video-container youtube-container ${className}`}>
        <div className="video-wrapper">
          <iframe
            src={getYouTubeEmbedUrl(videoUrl)}
            title={title || 'Video de YouTube'}
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen
            className="youtube-iframe"
          />
          {title && (
            <div className="video-title-overlay">
              <h3 className="video-title">{title}</h3>
            </div>
          )}
        </div>
        <style jsx>{`
          .video-container {
            position: relative;
            margin: 2rem 0;
            border-radius: 12px;
            overflow: hidden;
            box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
            background: #000;
          }
          
          .video-wrapper {
            position: relative;
            padding-bottom: 56.25%;
            height: 0;
            width: 100%;
          }
          
          .youtube-iframe {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            border-radius: 12px;
          }
          
          .video-title-overlay {
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            background: linear-gradient(180deg, rgba(0,0,0,0.8) 0%, transparent 100%);
            padding: 1rem;
            z-index: 10;
          }
          
          .video-title {
            color: white;
            margin: 0;
            font-size: 1.1rem;
            font-weight: 600;
            text-shadow: 0 2px 4px rgba(0,0,0,0.5);
          }
          
          @media (max-width: 768px) {
            .video-container {
              margin: 1rem 0;
              border-radius: 8px;
            }
            
            .youtube-iframe {
              border-radius: 8px;
            }
            
            .video-title {
              font-size: 1rem;
            }
          }
        `}</style>
      </div>
    );
  }

  // Para videos subidos (UploadThing)
  return (
    <div 
      ref={containerRef}
      className={`relative bg-black rounded-lg overflow-hidden group ${className}`}
      onMouseMove={showControlsTemporarily}
      onMouseLeave={() => {
        if (isPlaying) {
          setShowControls(false);
        }
      }}
    >
      {/* Video */}
      <video
        ref={videoRef}
        src={videoUrl}
        className="w-full h-full object-contain"
        onLoadedMetadata={handleLoadedMetadata}
        onTimeUpdate={handleTimeUpdate}
        onEnded={handleEnded}
        onPlay={() => setIsPlaying(true)}
        onPause={() => setIsPlaying(false)}
        onClick={togglePlay}
        autoPlay
        playsInline
      />

      {/* Overlay de controles */}
      <div 
        className={`absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent transition-opacity duration-300 ${
          showControls ? 'opacity-100' : 'opacity-0'
        }`}
      >


        {/* Barra de progreso */}
        <div className="absolute bottom-16 left-4 right-4">
          <input
            type="range"
            min="0"
            max={duration || 0}
            value={currentTime}
            onChange={handleSeek}
            className="w-full h-1 bg-white/30 rounded-lg appearance-none cursor-pointer slider"
            style={{
              background: `linear-gradient(to right, #3b82f6 0%, #3b82f6 ${(currentTime / duration) * 100}%, rgba(255,255,255,0.3) ${(currentTime / duration) * 100}%, rgba(255,255,255,0.3) 100%)`
            }}
          />
        </div>

        {/* Controles inferiores */}
        <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            {/* Tiempo */}
            <span className="text-white text-sm">
              {formatTime(currentTime)} / {formatTime(duration)}
            </span>

            {/* Volumen */}
            <div className="flex items-center space-x-2">
              <button onClick={toggleMute} className="text-white hover:text-gray-300">
                {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
              </button>
              <input
                type="range"
                min="0"
                max="1"
                step="0.1"
                value={isMuted ? 0 : volume}
                onChange={handleVolumeChange}
                className="w-16 h-1 bg-white/30 rounded-lg appearance-none cursor-pointer slider"
              />
            </div>
          </div>

          <div className="flex items-center space-x-2">
            {/* Reiniciar */}
            <button
              onClick={restart}
              className="text-white hover:text-gray-300 p-1"
              title="Reiniciar"
            >
              <RotateCcw className="w-4 h-4" />
            </button>

            {/* Pantalla completa */}
            <button
              onClick={toggleFullscreen}
              className="text-white hover:text-gray-300 p-1"
              title="Pantalla completa"
            >
              <Maximize className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Estilos para el slider */}
      <style jsx>{`
        .slider::-webkit-slider-thumb {
          appearance: none;
          height: 12px;
          width: 12px;
          border-radius: 50%;
          background: #3b82f6;
          cursor: pointer;
        }
        .slider::-moz-range-thumb {
          height: 12px;
          width: 12px;
          border-radius: 50%;
          background: #3b82f6;
          cursor: pointer;
          border: none;
        }

        @media (max-width: 768px) {
          .video-container {
            aspect-ratio: 16/9;
            max-height: 50vh;
          }
          
          .video-container iframe {
            height: 100%;
            min-height: 200px;
          }
          
          .video-container video {
            height: 100%;
            min-height: 200px;
          }
          
          .absolute.top-4.left-4 {
            top: 0.5rem;
            left: 0.5rem;
            font-size: 0.875rem;
          }
          
          .absolute.bottom-16.left-4.right-4 {
            bottom: 3rem;
            left: 0.5rem;
            right: 0.5rem;
          }
          
          .absolute.bottom-4.left-4.right-4 {
            bottom: 0.5rem;
            left: 0.5rem;
            right: 0.5rem;
            flex-direction: column;
            gap: 0.5rem;
            align-items: stretch;
          }
          
          .flex.items-center.space-x-4 {
            justify-content: space-between;
            width: 100%;
          }
          
          .flex.items-center.space-x-2 {
            gap: 0.25rem;
          }
          
          .text-white.text-sm {
            font-size: 0.75rem;
          }
          
          .w-16 {
            width: 3rem;
          }
          
          .w-8.h-8 {
            width: 1.5rem;
            height: 1.5rem;
          }
          
          .w-4.h-4 {
            width: 1rem;
            height: 1rem;
          }
          
          .p-4 {
            padding: 0.75rem;
          }
        }

        @media (max-width: 480px) {
          .video-container {
            max-height: 40vh;
          }
          
          .video-container iframe,
          .video-container video {
            min-height: 150px;
          }
          
          .absolute.top-4.left-4 {
            font-size: 0.75rem;
            top: 0.25rem;
            left: 0.25rem;
          }
          
          .absolute.bottom-16.left-4.right-4 {
            bottom: 2.5rem;
            left: 0.25rem;
            right: 0.25rem;
          }
          
          .absolute.bottom-4.left-4.right-4 {
            bottom: 0.25rem;
            left: 0.25rem;
            right: 0.25rem;
          }
          
          .text-white.text-sm {
            font-size: 0.7rem;
          }
          
          .w-16 {
            width: 2.5rem;
          }
          
          .w-8.h-8 {
            width: 1.25rem;
            height: 1.25rem;
          }
          
          .w-4.h-4 {
            width: 0.875rem;
            height: 0.875rem;
          }
          
          .p-4 {
            padding: 0.5rem;
          }
        }

        @media (max-width: 375px) {
          .video-container {
            max-height: 35vh;
          }
          
          .video-container iframe,
          .video-container video {
            min-height: 120px;
          }
          
          .absolute.top-4.left-4 {
            font-size: 0.7rem;
          }
          
          .text-white.text-sm {
            font-size: 0.65rem;
          }
          
          .w-16 {
            width: 2rem;
          }
          
          .w-8.h-8 {
            width: 1rem;
            height: 1rem;
          }
          
          .w-4.h-4 {
            width: 0.75rem;
            height: 0.75rem;
          }
          
          .p-4 {
            padding: 0.375rem;
          }
        }
      `}</style>
    </div>
  );
} 