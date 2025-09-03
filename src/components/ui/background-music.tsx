import { useState, useRef, useEffect } from 'react';
import { Volume2, VolumeX, Music, SkipForward, SkipBack, Play, Pause } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

interface BackgroundMusicProps {
  tracks?: string[];
  autoPlay?: boolean;
  className?: string;
}

export const BackgroundMusic = ({ 
  tracks = [
    '/Untitled (4).mp3',
    '/Untitled (3).mp3',
    '/musica3.mp3',
    '/musica4.mp3',
    '/musica5.mp3',
    '/musica6.mp3',
                      '/musica7.mp3',
    '/musica8.mp3',
    '/musica9.mp3',
    '/musica10.mp3',
    '/musica11.mp3'
  ], 
  autoPlay = false,
  className = ""
}: BackgroundMusicProps) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [currentTrack, setCurrentTrack] = useState(0);
  const [isExpanded, setIsExpanded] = useState(false);
  const [volume, setVolume] = useState(0.5);
  const audioRef = useRef<HTMLAudioElement>(null);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = isMuted ? 0 : volume;
    }
  }, [volume, isMuted]);

  useEffect(() => {
    if (audioRef.current) {
      // Forçar recarregamento da música
      audioRef.current.load();
      audioRef.current.src = tracks[currentTrack];
      
      // Adicionar logs para debug
      console.log('🎵 Carregando música:', tracks[currentTrack]);
      console.log('🎵 Track atual:', currentTrack + 1);
      console.log('🎵 Elemento de áudio:', audioRef.current);
      
      // Testar se a URL é válida
      if (tracks[currentTrack].startsWith('http')) {
        console.log('🌐 Testando URL externa:', tracks[currentTrack]);
        fetch(tracks[currentTrack], { method: 'HEAD' })
          .then(response => {
            console.log('✅ URL válida, status:', response.status);
          })
          .catch(error => {
            console.error('❌ URL inválida:', error);
          });
      }
      
      if (isPlaying) {
        audioRef.current.play().catch(error => {
          console.error('❌ Erro ao tocar música:', error);
          console.error('🎵 Src da música:', tracks[currentTrack]);
          console.error('🎵 Tipo de erro:', error.name, error.message);
        });
      }
    }
  }, [currentTrack, tracks]);

  useEffect(() => {
    if (autoPlay && audioRef.current) {
      audioRef.current.play();
      setIsPlaying(true);
    }
  }, [autoPlay]);

  const togglePlay = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const toggleMute = () => {
    setIsMuted(!isMuted);
  };

  const nextTrack = () => {
    const nextTrackIndex = (currentTrack + 1) % tracks.length;
    console.log('⏭️ Próxima música:', nextTrackIndex + 1, 'de', tracks.length);
    console.log('🎵 URL da próxima música:', tracks[nextTrackIndex]);
    setCurrentTrack(nextTrackIndex);
  };

  const prevTrack = () => {
    setCurrentTrack((prev) => (prev - 1 + tracks.length) % tracks.length);
  };

  const toggleExpanded = () => {
    setIsExpanded(!isExpanded);
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVolume = parseFloat(e.target.value);
    setVolume(newVolume);
    if (audioRef.current) {
      audioRef.current.volume = isMuted ? 0 : newVolume;
    }
  };

  return (
    <>
      {/* Hidden Audio Element */}
      <audio
        ref={audioRef}
        loop={tracks.length === 1}
        onEnded={() => {
          if (tracks.length > 1) {
            console.log('🔄 Música terminou, indo para próxima...');
            nextTrack();
          }
        }}
        onError={(e) => {
          console.error('❌ Erro no elemento de áudio:', e);
          console.error('🎵 Src atual:', tracks[currentTrack]);
          console.error('🎵 Target:', e.target);
        }}
        onLoadStart={() => {
          console.log('📥 Iniciando carregamento da música:', tracks[currentTrack]);
        }}
        onCanPlay={() => {
          console.log('✅ Música pronta para tocar:', tracks[currentTrack]);
        }}
        preload="auto"
      />

      {/* Music Controls */}
      <div className={`${className.includes('relative') ? 'relative' : 'fixed bottom-6 right-6'} z-50`}>
        <Card className={`arena-card p-2 transition-all duration-300 ${isExpanded ? 'w-64' : 'w-auto'}`}>
          <div className="flex items-center gap-2">
            {/* Play/Pause Button */}
            <Button
              variant="outline"
              size="sm"
              onClick={togglePlay}
              className="p-2"
            >
              {isPlaying ? (
                <Pause className="w-4 h-4 text-epic" />
              ) : (
                <Play className="w-4 h-4 text-epic" />
              )}
            </Button>

            {/* Mute Button */}
            <Button
              variant="outline"
              size="sm"
              onClick={toggleMute}
              className="p-2"
            >
              {isMuted ? (
                <VolumeX className="w-4 h-4 text-destructive" />
              ) : (
                <Volume2 className="w-4 h-4 text-victory" />
              )}
            </Button>

            {/* Expand Button */}
            <Button
              variant="ghost"
              size="sm"
              onClick={toggleExpanded}
              className="p-2"
            >
              <Music className="w-4 h-4" />
            </Button>

            {/* Expanded Controls */}
            {isExpanded && (
              <>
                {/* Track Navigation */}
                {tracks.length > 1 && (
                  <div className="flex gap-1">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={prevTrack}
                      className="p-1"
                    >
                      <SkipBack className="w-3 h-3" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={nextTrack}
                      className="p-1"
                    >
                      <SkipForward className="w-3 h-3" />
                    </Button>
                  </div>
                )}

                {/* Volume Slider */}
                <div className="flex items-center gap-1 min-w-16">
                  <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.1"
                    value={volume}
                    onChange={handleVolumeChange}
                    className="w-16 h-1 bg-muted rounded-lg appearance-none cursor-pointer"
                  />
                </div>

                {/* Track Info */}
                <div className="text-xs text-muted-foreground">
                  {currentTrack + 1}/8
                </div>
              </>
            )}
          </div>

          {/* Status */}
          {isPlaying && (
            <div className="mt-1 text-center">
              <div className="text-xs text-muted-foreground">
                {isMuted ? '🔇 Silenciado' : '🎵 Tocando'}
              </div>
            </div>
          )}
        </Card>
      </div>
    </>
  );
};