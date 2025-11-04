import React from 'react';

// Summon pools keyed by tier 0-8. We only offer choices from 1..8; tier 0 yields small familiars.
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
    { name: 'Eclipse Dragon', buff: { Strength: 8 }, hiddenLuck: 0, info: '+8 Strength' },
    { name: 'Abyss Leviathan', buff: { Endurance: 8 }, hiddenLuck: 0, info: '+8 Endurance' },
    { name: 'Phoenix Ascendant', buff: { Speed: 8 }, hiddenLuck: 0, info: '+8 Speed' },
  ],
  8: [
    { name: 'Dominion Avatar', buff: {}, hiddenLuck: 5, avatar: true, info: 'Set one stat to 8 (S++) and +5 Luck (hidden)' },
  ],
};

const gradeOf = (v) => ['F','D','C','B','A','S','S+','S+','S++'][v] || 'F';

export default function SummonSelect({ stats, summon, onChoose }) {
  const will = stats["Summoner's Will"] ?? 0;
  const tier = Math.max(0, Math.min(8, will));
  const options = SUMMON_POOLS[tier] || [];

  const chooseAvatarStat = (k) => {
    const newStats = { ...stats, [k]: 8 };
    onChoose({ name: 'Dominion Avatar', buff: { [k]: 8 - (stats[k]||0) }, hiddenLuck: 5, avatar: true }, newStats);
  };

  return (
    <div>
      <h2 className="text-xl font-bold text-white">Choose Summon</h2>
      <p className="text-white/70 text-sm mb-3">Tier {tier} based on Summoner's Will ({stats["Summoner's Will"]}) · Top grades glow when S++.</p>
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
          <div className="font-semibold mb-2">Dominion Avatar: set one stat to 8 (S++)</div>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
            {Object.keys(stats).map((k)=> (
              <button key={k} onClick={()=>chooseAvatarStat(k)} className="px-3 py-2 rounded bg-white/10 hover:bg-white/20 text-left">
                {k} → <span className="font-bold">8</span> ({gradeOf(8)})
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export { SUMMON_POOLS };
