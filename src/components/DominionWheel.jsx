import React from 'react';

const DOMINIONS = [
  { key: 'Titanus', color: 'from-rose-500 to-orange-500', tagline: 'raw might' },
  { key: 'Aethera', color: 'from-sky-500 to-indigo-500', tagline: 'mystical flow' },
  { key: 'Novaris', color: 'from-fuchsia-500 to-violet-500', tagline: 'cosmic explosion' },
  { key: 'Obsidion', color: 'from-slate-600 to-slate-900', tagline: 'forged resilience' },
  { key: 'Regalus', color: 'from-amber-500 to-red-500', tagline: 'sovereign control' },
  { key: 'Arcannus', color: 'from-emerald-500 to-teal-500', tagline: 'secret wildcard' },
];

const MATCHUPS = {
  Titanus: { strong: 'Regalus', weak: 'Aethera' },
  Aethera: { strong: 'Titanus', weak: 'Novaris' },
  Novaris: { strong: 'Aethera', weak: 'Obsidion' },
  Obsidion: { strong: 'Novaris', weak: 'Arcannus' },
  Regalus: { strong: 'Arcannus', weak: 'Titanus' },
  Arcannus: { strong: 'Obsidion', weak: 'Regalus' },
};

export default function DominionWheel({ value, onChange, playerLabel }) {
  return (
    <div>
      <h2 className="text-xl font-bold text-white flex items-center gap-2">
        Choose Dominion <span className="text-white/60 text-sm">({playerLabel})</span>
      </h2>
      <p className="text-white/70 text-sm mb-4">Tap a crest to align your aura.</p>
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
        {DOMINIONS.map((d) => {
          const active = value === d.key;
          return (
            <button
              key={d.key}
              onClick={() => onChange(d.key)}
              className={`relative rounded-xl p-4 text-left bg-gradient-to-br ${d.color} text-white shadow transition-transform active:scale-95 border border-white/20 ${active ? 'ring-2 ring-white/90' : 'ring-0'}`}
            >
              <div className="text-lg font-extrabold drop-shadow-sm">{d.key}</div>
              <div className="text-xs opacity-90">{d.tagline}</div>
              <div className="mt-3 text-[11px] opacity-95">
                <span className="font-semibold">Strong:</span> {MATCHUPS[d.key].strong} ·{' '}
                <span className="font-semibold">Weak:</span> {MATCHUPS[d.key].weak}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}

export { MATCHUPS, DOMINIONS };
