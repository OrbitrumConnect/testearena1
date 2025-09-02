import React from 'react';

interface VideoBackgroundProps {
  videoPath: string;
  fallbackImage?: string;
  className?: string;
}

export const VideoBackground: React.FC<VideoBackgroundProps> = ({ 
  videoPath, 
  fallbackImage,
  className = "" 
}) => {
  return (
    <div className={`absolute inset-0 overflow-hidden ${className}`}>
      {/* Vídeo de Background */}
      <video
        autoPlay
        muted
        loop
        playsInline
        className="absolute inset-0 w-full h-full object-cover"
        poster={fallbackImage}
        style={{
          transform: 'scale(1.75, 1.1)',
          transformOrigin: 'center center'
        }}
      >
        <source src={videoPath} type="video/mp4" />
        {/* Fallback para navegadores que não suportam vídeo */}
        {fallbackImage && (
          <img 
            src={fallbackImage} 
            alt="Background" 
            className="absolute inset-0 w-full h-full object-cover"
            style={{
              transform: 'scale(1.75, 1.1)',
              transformOrigin: 'center center'
            }}
          />
        )}
      </video>
      
      {/* Overlay escuro para melhorar legibilidade do conteúdo */}
      <div className="absolute inset-0 bg-black/50" />
    </div>
  );
};
