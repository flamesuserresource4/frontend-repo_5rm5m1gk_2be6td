import React from 'react';
import Spline from '@splinetool/react-spline';

export default function HeroCover() {
  return (
    <div className="relative w-full h-[320px] md:h-[420px] rounded-2xl overflow-hidden border border-white/10 shadow-lg">
      <Spline scene="https://prod.spline.design/atN3lqky4IzF-KEP/scene.splinecode" style={{ width: '100%', height: '100%' }} />
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#0b0f16] via-transparent to-transparent" />
      <div className="pointer-events-none absolute inset-0 flex items-end p-6">
        <div className="max-w-3xl">
          <h1 className="text-2xl md:text-4xl font-extrabold tracking-tight text-white drop-shadow-[0_6px_30px_rgba(0,0,0,0.6)]">
            Dominion Clash: <span className="text-fuchsia-300">Soul Arena</span>
          </h1>
          <p className="mt-2 text-sm md:text-base text-white/80">
            A hot-seat anime duel for desktop and iPad. Spin the Dominion, forge your build, summon your ally, and clash to 3 round wins.
          </p>
        </div>
      </div>
    </div>
  );
}
