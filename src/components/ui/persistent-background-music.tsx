import { useState, useRef, useEffect, memo } from 'react';
import { Volume2, VolumeX, Music, SkipForward, SkipBack, Play, Pause } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

interface PersistentBackgroundMusicProps {
  tracks?: string[];
  autoPlay?: boolean;
  className?: string;
}

// Instância global para manter o áudio persistente
let globalAudio: HTMLAudioElement | null = null;
let globalState = {
  isPlaying: false,
  isMuted: false,
  currentTrack: 0,
  volume: 0.5,
  isExpanded: false,
  initialized: false,
  tracks: [
    'https://jidwywpecgmcqduzmvcv.supabase.co/storage/v1/object/public/tracks/Untitled%20(4).mp3',
    'https://jidwywpecgmcqduzmvcv.supabase.co/storage/v1/object/public/tracks/Untitled%20(3).mp3',
    '/musica3.mp3' // Temporariamente servindo da pasta public
  ]
};

export const PersistentBackgroundMusic = memo(({ 
  tracks = [
    'https://jidwywpecgmcqduzmvcv.supabase.co/storage/v1/object/public/tracks/Untitled%20(4).mp3',
    'https://jidwywpecgmcqduzmvcv.supabase.co/storage/v1/object/public/tracks/Untitled%20(3).mp3',
    '/musica3.mp3' // Temporariamente servindo da pasta public
  ], 
  autoPlay = false,
  className = ""
}: PersistentBackgroundMusicProps) => {
  const [isPlaying, setIsPlaying] = useState(globalState.isPlaying);
  const [isMuted, setIsMuted] = useState(globalState.isMuted);
  const [currentTrack, setCurrentTrack] = useState(globalState.currentTrack);
  const [isExpanded, setIsExpanded] = useState(globalState.isExpanded);
  const [volume, setVolume] = useState(globalState.volume);
  const audioRef = useRef<HTMLAudioElement>(null);

  // Inicializar áudio global se não existir
  useEffect(() => {
    if (!globalAudio && !globalState.initialized) {
      globalAudio = new Audio();
      globalAudio.loop = false;
      globalAudio.preload = 'auto';
      globalAudio.volume = globalState.isMuted ? 0 : globalState.volume;
      globalAudio.src = globalState.tracks[globalState.currentTrack];
      globalState.initialized = true;
      
      globalAudio.onended = () => {
        if (globalState.tracks.length > 1) {
          const nextTrack = (globalState.currentTrack + 1) % globalState.tracks.length;
          globalState.currentTrack = nextTrack;
          globalAudio!.src = globalState.tracks[nextTrack];
          if (globalState.isPlaying) {
            globalAudio!.play();
          }
          setCurrentTrack(nextTrack);
        }
      };

      // Auto-play apenas na primeira inicialização
      if (autoPlay) {
        globalAudio.play().then(() => {
          globalState.isPlaying = true;
          setIsPlaying(true);
        }).catch(() => {
          // Falha no autoplay - deixar para o usuário iniciar
        });
      }
    } else if (globalAudio) {
      // Sincronizar estado com áudio existente
      setIsPlaying(globalState.isPlaying);
      setIsMuted(globalState.isMuted);
      setCurrentTrack(globalState.currentTrack);
      setVolume(globalState.volume);
      setIsExpanded(globalState.isExpanded);
    }

    // Sincronizar o ref local com o áudio global
    if (audioRef.current && globalAudio) {
      audioRef.current = globalAudio;
    }
  }, [autoPlay]);

  useEffect(() => {
    if (globalAudio) {
      globalAudio.volume = isMuted ? 0 : volume;
      globalState.volume = volume;
      globalState.isMuted = isMuted;
    }
  }, [volume, isMuted]);

  useEffect(() => {
    if (globalAudio && globalAudio.src !== tracks[currentTrack]) {
      globalAudio.src = tracks[currentTrack];
      globalState.currentTrack = currentTrack;
      globalState.tracks = tracks;
      if (isPlaying) {
        globalAudio.play();
      }
    }
  }, [currentTrack, tracks, isPlaying]);

  const togglePlay = () => {
    if (globalAudio) {
      if (isPlaying) {
        globalAudio.pause();
        globalState.isPlaying = false;
      } else {
        globalAudio.play();
        globalState.isPlaying = true;
      }
      setIsPlaying(!isPlaying);
    }
  };

  const toggleMute = () => {
    const newMuted = !isMuted;
    setIsMuted(newMuted);
    globalState.isMuted = newMuted;
    if (globalAudio) {
      globalAudio.volume = newMuted ? 0 : volume;
    }
  };

  const nextTrack = () => {
    const next = (currentTrack + 1) % tracks.length;
    setCurrentTrack(next);
  };

  const prevTrack = () => {
    const prev = (currentTrack - 1 + tracks.length) % tracks.length;
    setCurrentTrack(prev);
  };

  const toggleExpanded = () => {
    const newExpanded = !isExpanded;
    setIsExpanded(newExpanded);
    globalState.isExpanded = newExpanded;
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVolume = parseFloat(e.target.value);
    setVolume(newVolume);
  };

  return (
    <>
      {/* Hidden Audio Element - usando o global */}
      <audio
        ref={audioRef}
        style={{ display: 'none' }}
      />

      {/* Music Controls */}
      <div className={`${className.includes('relative') ? 'relative' : 'fixed bottom-6 right-6'} z-[9999]`}>
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
              <div className="flex items-center gap-2 ml-2">
                {/* Previous Track */}
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={prevTrack}
                  className="p-1"
                  disabled={tracks.length <= 1}
                >
                  <SkipBack className="w-3 h-3" />
                </Button>

                {/* Next Track */}
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={nextTrack}
                  className="p-1"
                  disabled={tracks.length <= 1}
                >
                  <SkipForward className="w-3 h-3" />
                </Button>

                {/* Volume Slider */}
                <div className="flex items-center gap-1 min-w-16">
                  <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.05"
                    value={volume}
                    onChange={handleVolumeChange}
                    className="w-12 h-1 bg-muted rounded-lg appearance-none cursor-pointer slider"
                  />
                </div>

                {/* Track Info */}
                <div className="text-xs text-muted-foreground">
                  {currentTrack + 1}/{tracks.length}
                </div>
              </div>
            )}
          </div>
        </Card>
      </div>
    </>
  );
});

PersistentBackgroundMusic.displayName = 'PersistentBackgroundMusic';
