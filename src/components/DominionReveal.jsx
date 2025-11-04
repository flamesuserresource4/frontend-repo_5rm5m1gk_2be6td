import React, { useState } from 'react';
import { DOMINIONS } from './DominionWheel';

export default function DominionReveal({ p1, p2, onReveal }) {
  const [localP1, setLocalP1] = useState(p1 || null);
  const [localP2, setLocalP2] = useState(p2 || null);

  const rollDominion = () => DOMINIONS[Math.floor(Math.random()*DOMINIONS.length)].key;

  const handleReveal = () => {
    const d1 = rollDominion();
    let d2 = rollDominion();
    // ensure not the same dominion for extra variety
    let safety = 10;
    while (d2 === d1 && safety-- > 0) d2 = rollDominion();
    setLocalP1(d1); setLocalP2(d2);
    onReveal(d1, d2);
  };

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-extrabold">Fated Dominions</h2>
      <p className="text-white/80 text-sm">Destiny chooses your path. You cannot choose your dominion.</p>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {[{label:'P1', d: localP1}, {label:'P2', d: localP2}].map((x, i)=> (
          <div key={i} className="rounded-2xl p-5 bg-gradient-to-br from-fuchsia-500/15 to-indigo-500/15 border border-white/10">
            <div className="text-sm text-white/70">{x.label}</div>
            <div className="mt-1 text-2xl font-extrabold tracking-wide">{x.d || '—'}</div>
          </div>
        ))}
      </div>
      <div className="flex justify-end">
        <button onClick={handleReveal} className="px-5 py-3 rounded-xl bg-fuchsia-600 hover:bg-fuchsia-500 font-extrabold">Reveal Dominions</button>
      </div>
    </div>
  );
}
