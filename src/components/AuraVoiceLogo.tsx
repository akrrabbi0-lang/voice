interface AuraVoiceLogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  isAnimated?: boolean;
}

export function AuraVoiceLogo({
  className = '',
  size = 'md',
  isAnimated = false,
}: AuraVoiceLogoProps) {
  const sizeMap = {
    sm: 'w-8 h-8',
    md: 'w-10 h-10',
    lg: 'w-12 h-12',
    xl: 'w-16 h-16',
  };

  return (
    <div
      className={`relative rounded-2xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-cyan-400 p-[1.5px] border border-blue-400/40 flex-shrink-0 group ${sizeMap[size]} ${className}`}
    >
      {/* Inner ambient glow backdrop */}
      <div className="w-full h-full rounded-[14px] bg-[#0c101d] flex items-center justify-center overflow-hidden relative">
        <div className="absolute inset-0 bg-gradient-to-tr from-indigo-500/20 via-purple-500/20 to-cyan-400/20 backdrop-blur-sm" />

        {/* Futuristic Soundwave Crystal SVG */}
        <svg
          viewBox="0 0 36 36"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className={`w-[68%] h-[68%] relative z-10 text-white ${
            isAnimated ? 'animate-pulse' : ''
          }`}
        >
          <defs>
            <linearGradient id="auraWaveGrad" x1="0" y1="0" x2="36" y2="36" gradientUnits="userSpaceOnUse">
              <stop stopColor="#a5b4fc" />
              <stop offset="0.5" stopColor="#c084fc" />
              <stop offset="1" stopColor="#38bdf8" />
            </linearGradient>
            <filter id="auraGlow" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="1.5" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
          </defs>

          {/* Equalizer Bars with dynamic heights */}
          {/* Bar 1 */}
          <rect
            x="5"
            y="13"
            width="3"
            height="10"
            rx="1.5"
            fill="url(#auraWaveGrad)"
            className={isAnimated ? 'animate-[pulse_1.2s_ease-in-out_infinite]' : ''}
          />
          {/* Bar 2 */}
          <rect
            x="11"
            y="8"
            width="3"
            height="20"
            rx="1.5"
            fill="url(#auraWaveGrad)"
            className={isAnimated ? 'animate-[pulse_0.9s_ease-in-out_infinite_0.15s]' : ''}
          />
          {/* Central Peak Bar with Core Diamond */}
          <rect
            x="17"
            y="4"
            width="3.2"
            height="28"
            rx="1.6"
            fill="#ffffff"
            filter="url(#auraGlow)"
            className={isAnimated ? 'animate-[pulse_0.7s_ease-in-out_infinite_0.3s]' : ''}
          />
          {/* Bar 4 */}
          <rect
            x="23"
            y="9"
            width="3"
            height="18"
            rx="1.5"
            fill="url(#auraWaveGrad)"
            className={isAnimated ? 'animate-[pulse_1.0s_ease-in-out_infinite_0.2s]' : ''}
          />
          {/* Bar 5 */}
          <rect
            x="29"
            y="14"
            width="3"
            height="8"
            rx="1.5"
            fill="url(#auraWaveGrad)"
            className={isAnimated ? 'animate-[pulse_1.3s_ease-in-out_infinite_0.1s]' : ''}
          />

          {/* Corner Sparkle */}
          <circle cx="28" cy="7" r="1.5" fill="#38bdf8" className="animate-ping" style={{ animationDuration: '3s' }} />
        </svg>

        {/* Ambient radial reflection */}
        <div className="absolute -bottom-2 inset-x-0 h-4 bg-gradient-to-t from-cyan-500/20 to-transparent blur-[2px]" />
      </div>
    </div>
  );
}
