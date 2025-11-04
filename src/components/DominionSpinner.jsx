import React, { useMemo, useRef, useState } from 'react';
import { DOMINIONS } from './DominionWheel';

function Wheel({ label, onResult }) {
  const [angle, setAngle] = useState(0);
  const [spinning, setSpinning] = useState(false);
  const [result, setResult] = useState(null);
  const seg = 360 / DOMINIONS.length;

  const spin = () => {
    if (spinning) return;
    setSpinning(true);
    const targetIndex = Math.floor(Math.random() * DOMINIONS.length);
    // target at top (0deg). We rotate negative so the chosen segment lands at pointer.
    const baseRotations = 4 + Math.floor(Math.random() * 3); // 4-6 full spins
    const targetAngle = -(targetIndex * seg) + baseRotations * 360 + (Math.random()*seg - seg/2) * 0.15;
    setAngle((prev) => prev + targetAngle);
    setTimeout(() => {
      const chosen = DOMINIONS[targetIndex].key;
      setResult(chosen);
      onResult(chosen);
      setSpinning(false);
    }, 1800);
  };

  return (
    <div className="rounded-2xl p-4 bg-gradient-to-br from-fuchsia-500/10 to-indigo-500/10 border border-white/10 text-white">
      <div className="flex items-center justify-between mb-3">
        <div className="font-bold">{label}</div>
        <div className="text-sm text-white/70">{result ? `Chosen: ${result}` : '—'}</div>
      </div>
      <div className="relative mx-auto w-full max-w-xs aspect-square">
        {/* pointer */}
        <div className="absolute left-1/2 -translate-x-1/2 -top-3 z-10">
          <div className="w-0 h-0 border-l-8 border-r-8 border-b-[14px] border-transparent border-b-fuchsia-400 drop-shadow" />
        </div>
        <div
          className="w-full h-full rounded-full border border-white/10 bg-black/30 shadow-inner overflow-hidden"
          style={{
            transform: `rotate(${angle}deg)`,
            transition: 'transform 1.6s cubic-bezier(0.22, 1, 0.36, 1)'
          }}
        >
          {DOMINIONS.map((d, i) => (
            <div
              key={d.key}
              className={`absolute inset-0 flex items-center justify-center text-[11px] font-bold text-white/95`}
              style={{
                transform: `rotate(${i * seg}deg)`
              }}
            >
              <div
                className={`origin-top w-[2px] h-1/2 bg-white/10`}
                style={{ transform: 'rotate(0deg)' }}
              />
              <div
                className={`absolute top-4 left-1/2 -translate-x-1/2 px-2 py-1 rounded-full bg-gradient-to-r ${d.color} text-[11px] shadow border border-white/20`}
              >
                {d.key}
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className="mt-4 flex justify-center">
        <button onClick={spin} disabled={spinning} className="px-4 py-2 rounded-xl bg-fuchsia-600 hover:bg-fuchsia-500 font-extrabold disabled:opacity-50">
          {spinning ? 'Spinning…' : 'Spin Wheel'}
        </button>
      </div>
    </div>
  );
}

export default function DominionSpinner({ onReveal }) {
  const [p1, setP1] = useState(null);
  const [p2, setP2] = useState(null);

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-extrabold">Fated Dominion — Spin the Wheel</h2>
      <p className="text-white/80 text-sm">Each player spins to receive a dominion. Destiny decides.</p>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Wheel label="P1" onResult={setP1} />
        <Wheel label="P2" onResult={setP2} />
      </div>
      <div className="flex justify-end">
        <button
          disabled={!p1 || !p2}
          onClick={() => onReveal(p1, p2)}
          className="px-5 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 font-extrabold disabled:opacity-50"
        >
          Lock In & Continue
        </button>
      </div>
    </div>
  );
}
