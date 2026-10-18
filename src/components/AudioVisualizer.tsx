import { useEffect, useRef } from 'react';

interface AudioVisualizerProps {
  isPlaying: boolean;
  audioRef?: React.RefObject<HTMLAudioElement | null>;
  className?: string;
}

export function AudioVisualizer({ isPlaying, className = '' }: AudioVisualizerProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let phase = 0;

    const render = () => {
      const width = canvas.width;
      const height = canvas.height;
      ctx.clearRect(0, 0, width, height);

      const numBars = 48;
      const barWidth = width / numBars - 2;

      for (let i = 0; i < numBars; i++) {
        const x = i * (barWidth + 2);

        // Calculate dynamic height based on playing state and smooth sine variations
        let barHeight = 8;
        if (isPlaying) {
          const wave1 = Math.sin((i * 0.25) + phase);
          const wave2 = Math.cos((i * 0.15) - (phase * 1.5));
          const wave3 = Math.sin((i * 0.4) + (phase * 0.8));
          const combined = (Math.abs(wave1 + wave2 + wave3) / 3);
          barHeight = Math.max(6, combined * (height * 0.85));
        } else {
          // Static sleek waveform preview
          const centerDist = 1 - Math.abs(i - numBars / 2) / (numBars / 2);
          barHeight = 6 + (Math.sin(i * 0.4) * 0.5 + 0.5) * 16 * centerDist;
        }

        const y = (height - barHeight) / 2;

        // Gradient for each bar
        const gradient = ctx.createLinearGradient(0, y, 0, y + barHeight);
        if (isPlaying) {
          gradient.addColorStop(0, '#2563eb'); // Blue 600
          gradient.addColorStop(0.5, '#3b82f6'); // Blue 500
          gradient.addColorStop(1, '#60a5fa'); // Blue 400
        } else {
          gradient.addColorStop(0, '#1e3a8a'); // Blue 900
          gradient.addColorStop(1, '#1e293b'); // Slate 800
        }

        ctx.fillStyle = gradient;
        ctx.beginPath();
        // Rounded bars
        const radius = Math.min(barWidth / 2, 2);
        ctx.roundRect(x, y, barWidth, barHeight, radius);
        ctx.fill();
      }

      if (isPlaying) {
        phase += 0.08;
      }

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, [isPlaying]);

  return (
    <canvas
      ref={canvasRef}
      width={480}
      height={48}
      className={`w-full h-12 block ${className}`}
    />
  );
}
