const orbStyles = `
  @keyframes breathe {
    0%, 100% { transform: scale(1); }
    50% { transform: scale(1.12); }
  }
  @keyframes flicker {
    0%   { transform: scale(0.9);  opacity: 0.4; }
    25%  { transform: scale(1.2);  opacity: 1;   }
    50%  { transform: scale(0.95); opacity: 0.5; }
    75%  { transform: scale(1.25); opacity: 1;   }
    100% { transform: scale(0.9);  opacity: 0.4; }
  }
  @keyframes bloom {
    0%, 100% { transform: scale(1);    }
    50%       { transform: scale(1.15); }
  }
  @keyframes pull {
    0%, 100% { transform: scale(1);    }
    50%       { transform: scale(0.85); }
  }
  .orb-idle      { animation: breathe 4s ease-in-out infinite; }
  .orb-listening { animation: pull 1.5s ease-in-out infinite; }
  .orb-thinking  { animation: flicker 0.25s ease-in-out infinite; }
  .orb-speaking  { animation: bloom 0.6s ease-in-out infinite; }
`

export default function Orb({ state }) {
  return (
    <>
      <style>{orbStyles}</style>
      <div className={`orb-${state} relative flex items-center justify-center pointer-events-none`}>

        {/* Outer ambient glow */}
        <div className={`absolute rounded-full transition-all duration-1000 bg-white blur-3xl ${
          state === 'idle'      ? 'w-64 h-64 opacity-10' :
          state === 'listening' ? 'w-56 h-56 opacity-5'  :
          state === 'thinking'  ? 'w-72 h-72 opacity-20' :
                                  'w-80 h-80 opacity-15'
        }`} />

        {/* Mid glow */}
        <div className={`absolute rounded-full transition-all duration-700 bg-white blur-2xl ${
          state === 'idle'      ? 'w-32 h-32 opacity-20' :
          state === 'listening' ? 'w-28 h-28 opacity-15' :
          state === 'thinking'  ? 'w-36 h-36 opacity-40' :
                                  'w-40 h-40 opacity-30'
        }`} />

        {/* Core */}
        <div className={`absolute rounded-full transition-all duration-500 bg-white blur-xl ${
          state === 'idle'      ? 'w-16 h-16 opacity-60' :
          state === 'listening' ? 'w-14 h-14 opacity-50' :
          state === 'thinking'  ? 'w-20 h-20 opacity-90' :
                                  'w-24 h-24 opacity-80'
        }`} />

        {/* Hotspot */}
        <div className={`relative rounded-full transition-all duration-300 bg-white blur-sm ${
          state === 'idle'      ? 'w-6 h-6 opacity-90'   :
          state === 'listening' ? 'w-4 h-4 opacity-70'   :
          state === 'thinking'  ? 'w-8 h-8 opacity-100'  :
                                  'w-10 h-10 opacity-100'
        }`} />

      </div>
    </>
  )
}