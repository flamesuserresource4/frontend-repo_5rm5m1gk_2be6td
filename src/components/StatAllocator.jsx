import React, { useMemo } from 'react';

const STATS = [
  'Strength',
  'Endurance',
  'Speed',
  'Stamina',
  'Defense',
  'Dominion Mastery',
  'Battle IQ',
  'Focus',
  "Summoner's Will",
];

const GRADE = ['F', 'D', 'C', 'B', 'A', 'S', 'S+', 'S+', 'S++'];

export default function StatAllocator({
  values,
  onChange,
  pointsTotal = 30,
}) {
  const used = Object.values(values).reduce((a, b) => a + b, 0);
  const remaining = pointsTotal - used;

  const glowStats = useMemo(() =>
    Object.fromEntries(
      Object.entries(values).map(([k, v]) => [k, v >= 8])
    ), [values]
  );

  const adjust = (k, delta) => {
    const curr = values[k] ?? 0;
    const next = Math.max(0, Math.min(8, curr + delta));
    const nextUsed = used - curr + next;
    if (nextUsed <= pointsTotal) {
      onChange({ ...values, [k]: next });
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-xl font-bold text-white">Assign Stats</h2>
        <div className={`text-sm font-semibold ${remaining === 0 ? 'text-emerald-300' : 'text-amber-300'}`}>Remaining: {remaining}</div>
      </div>
      <div className="space-y-3">
        {STATS.map((k) => {
          const v = values[k] ?? 0;
          return (
            <div key={k} className={`rounded-xl p-3 bg-white/5 border ${glowStats[k] ? 'border-fuchsia-300/70 shadow-[0_0_15px_rgba(217,70,239,0.35)]' : 'border-white/10'}`}>
              <div className="flex items-center gap-2">
                <div className="w-36 text-sm text-white">{k}</div>
                <div className="flex-1 h-3 bg-white/10 rounded overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-fuchsia-400 to-indigo-400" style={{ width: `${(v / 8) * 100}%` }} />
                </div>
                <div className="w-10 text-center text-xs text-white/80">{v}</div>
                <div className="w-12 text-center text-xs font-bold text-fuchsia-200">{GRADE[v]}</div>
                <div className="flex items-center gap-2">
                  <button onClick={() => adjust(k, -1)} className="px-2 py-1 rounded bg-white/10 hover:bg-white/20 text-white text-sm disabled:opacity-40" disabled={v <= 0}>-</button>
                  <button onClick={() => adjust(k, +1)} className="px-2 py-1 rounded bg-white/10 hover:bg-white/20 text-white text-sm disabled:opacity-40" disabled={v >= 8 || remaining <= 0}>+</button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
      <p className="mt-3 text-[12px] text-white/70">Grades: F, D, C, B, A, S, S+, S++, with S++ glowing aura.</p>
    </div>
  );
}

export { STATS, GRADE };
