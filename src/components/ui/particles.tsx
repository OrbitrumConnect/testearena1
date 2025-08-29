import { useEffect, useState } from 'react';

interface Particle {
  id: number;
  left: number;
  size: number;
  animationDelay: number;
  animationDuration: number;
}

export const ParticleBackground = () => {
  const [particles, setParticles] = useState<Particle[]>([]);

  useEffect(() => {
    const newParticles = Array.from({ length: 20 }, (_, i) => ({
      id: i,
      left: Math.random() * 100,
      size: Math.random() * 4 + 2,
      animationDelay: Math.random() * 15,
      animationDuration: Math.random() * 10 + 15,
    }));
    setParticles(newParticles);
  }, []);

  return (
    <div className="particles">
      {particles.map((particle) => (
        <div
          key={particle.id}
          className="particle"
          style={{
            left: `${particle.left}%`,
            width: `${particle.size}px`,
            height: `${particle.size}px`,
            animationDelay: `${particle.animationDelay}s`,
            animationDuration: `${particle.animationDuration}s`,
          }}
        />
      ))}
    </div>
  );
};