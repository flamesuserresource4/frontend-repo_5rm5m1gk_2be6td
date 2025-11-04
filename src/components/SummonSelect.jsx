import React from 'react';

// Updated for STAT_MAX=7. Avatar at tier 7 lets you set one stat to 7 and adds +5 hidden Luck.
const SUMMON_POOLS = {
  0: [
    { name: 'Wisp Sprite', buff: { Speed: 1 }, hiddenLuck: 0, info: '+1 Speed' },
    { name: 'Clay Pupil', buff: { Defense: 1 }, hiddenLuck: 0, info: '+1 Defense' },
  ],
  1: [
    { name: 'Shade Imp', buff: { Speed: 2 }, hiddenLuck: 0, info: '+2 Speed' },
    { name: 'Gloom Pixie', buff: {}, hiddenLuck: 2, info: '+2 Luck (hidden)' },
  ],
  2: [
    { name: 'Stonefang Cub', buff: { Defense: 3 }, hiddenLuck: 0, info: '+3 Defense' },
    { name: 'Mist Serpent', buff: { Speed: 3 }, hiddenLuck: 0, info: '+3 Speed' },
  ],
  3: [
    { name: 'Ember Wisp', buff: { Strength: 4 }, hiddenLuck: 0, info: '+4 Strength' },
    { name: 'Frostling', buff: { Endurance: 4 }, hiddenLuck: 0, info: '+4 Endurance' },
    { name: 'Iron Beetle', buff: { Defense: 4 }, hiddenLuck: 0, info: '+4 Defense' },
  ],
  4: [
    { name: 'Lunara Hound', buff: { Strength: 5 }, hiddenLuck: 0, info: '+5 Strength' },
    { name: 'Storm Lynx', buff: { Speed: 5 }, hiddenLuck: 0, info: '+5 Speed' },
    { name: 'Spirit Treant', buff: { Stamina: 5 }, hiddenLuck: 0, info: '+5 Stamina' },
  ],
  5: [
    { name: 'Drakefang', buff: { Strength: 6 }, hiddenLuck: 0, info: '+6 Strength' },
    { name: 'Thunder Roc', buff: {}, hiddenLuck: 6, info: '+6 Luck (hidden)' },
    { name: 'Abyssal Horror', buff: { Defense: 6 }, hiddenLuck: 0, info: '+6 Defense' },
  ],
  6: [
    { name: 'Solar Griffin', buff: { Stamina: 7 }, hiddenLuck: 0, info: '+7 Stamina' },
    { name: 'Void Seraph', buff: { Focus: 7 }, hiddenLuck: 0, info: '+7 Focus' },
    { name: 'Crystal Golem', buff: { Defense: 7 }, hiddenLuck: 0, info: '+7 Defense' },
  ],
  7: [
    { name: 'Dominion Avatar', buff: {}, hiddenLuck: 5, avatar: true, info: 'Set one stat to 7 (S++) and +5 Luck (hidden)' },
  ],
};

const gradeOf = (v) => ['F','D','C','B','A','S','S+','S++'][v] || 'F';

export default function SummonSelect({ stats, summon, onChoose }) {
  const will = stats["Summoner's Will"] ?? 0;
  const tier = Math.max(0, Math.min(7, will));
  const options = SUMMON_POOLS[tier] || [];

  const chooseAvatarStat = (k) => {
    const capped = 7;
    const newStats = { ...stats, [k]: capped };
    onChoose({ name: 'Dominion Avatar', buff: { [k]: capped - (stats[k]||0) }, hiddenLuck: 5, avatar: true }, newStats);
  };

  return (
    <div>
      <h2 className="text-xl font-bold text-white">Choose Summon</h2>
      <p className="text-white/70 text-sm mb-3">Tier {tier} based on Summoner's Will ({stats["Summoner's Will"]}). Avatar at tier 7.</p>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {options.map((opt) => (
          <button
            key={opt.name}
            onClick={() => !opt.avatar && onChoose(opt, stats)}
            className={`relative rounded-xl p-4 text-left bg-white/5 hover:bg-white/10 border border-white/10 text-white transition active:scale-95 ${summon?.name===opt.name?'ring-2 ring-fuchsia-300':''}`}
          >
            <div className="text-lg font-extrabold">{opt.name}</div>
            <div className="text-xs opacity-90 mt-1">{opt.info}</div>
          </button>
        ))}
      </div>
      {options.find(o=>o.avatar) && (
        <div className="mt-4 p-3 rounded-xl bg-gradient-to-r from-fuchsia-500/20 to-indigo-500/20 border border-white/10 text-white">
          <div className="font-semibold mb-2">Dominion Avatar: set one stat to 7 (S++)</div>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
            {Object.keys(stats).map((k)=> (
              <button key={k} onClick={()=>chooseAvatarStat(k)} className="px-3 py-2 rounded bg-white/10 hover:bg-white/20 text-left">
                {k} → <span className="font-bold">7</span> ({gradeOf(7)})
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export { SUMMON_POOLS };
