import React, { useMemo, useState } from 'react';
import { MATCHUPS } from './DominionWheel';
import { GRADE } from './StatAllocator';

const POINTS_TOTAL = 30;
const STAT_MAX = 7;
const DOMINION_ADV_MULT = 1.25;
const RANDOMNESS_RANGE = 0.05; // ±5%

const COUNTERS = {
  Strength: 'Defense',
  Speed: 'Strength',
  Defense: 'Speed',
  Endurance: 'Stamina',
  'Dominion Mastery': 'Defense',
  'Battle IQ': 'Dominion Mastery',
  Focus: 'Strength',
  "Summoner's Will": 'Endurance',
};

function sumStats(stats) {
  return Object.values(stats).reduce((a,b)=>a+b,0);
}

function applyStatFloorAndOffset(stats) {
  // Rule: if unassigned it's not zero → becomes 1; others increased by 1 as well
  const next = {};
  for (const [k, v] of Object.entries(stats)) {
    const nv = (v || 0) + 1;
    next[k] = nv;
  }
  return next;
}

function applySummon(stats, summon) {
  const next = { ...stats };
  if (summon?.buff) {
    for (const [k, v] of Object.entries(summon.buff)) {
      next[k] = (next[k] || 0) + v;
    }
  }
  return next;
}

function computePower(p, opp) {
  let base = sumStats(p.statsBuffed);

  let counterMult = 1;
  for (const [a, b] of Object.entries(COUNTERS)) {
    const va = p.statsBuffed[a] || 0;
    const vb = opp.statsBuffed[b] || 0;
    if (va > vb) counterMult *= 1.15;
    else if (va < vb) counterMult *= 0.85;
  }

  let domMult = 1;
  const rel = MATCHUPS[p.dominion];
  if (rel) {
    if (rel.strong === opp.dominion) domMult *= DOMINION_ADV_MULT;
    if (rel.weak === opp.dominion) domMult /= DOMINION_ADV_MULT;
  }

  const rand = 0; // randomness applied at resolve time to remain fair between reveals
  const luckTilt = (p.summon?.hiddenLuck || 0) * 0.005;

  const total = base * counterMult * domMult * (1 + rand + luckTilt);
  return { total, parts: { base, counterMult, domMult, rand, luckTilt } };
}

function grade(v) { return GRADE[Math.max(0, Math.min(STAT_MAX, v))] || 'F'; }

function lineSummary(idx, p1, p2, r, roll1, roll2) {
  const p1Adj = r.p1.total * (1 + roll1/12);
  const p2Adj = r.p2.total * (1 + roll2/12);
  const lead = p1Adj >= p2Adj ? 'P1' : 'P2';
  const winner = lead==='P1'?p1:p2; const loser = lead==='P1'?p2:p1;
  const domNote = r[lead.toLowerCase()].parts.domMult>1? 'dominance surge' : r[lead.toLowerCase()].parts.domMult<1? 'elemental drag' : 'neutral flow';
  const luckNote = winner.summon?.hiddenLuck? `Luck favored them (+${(winner.summon.hiddenLuck*0.5).toFixed(1)}%).` : 'Fate stayed even.';
  const lines = [
    `Round ${idx+1}! ${p1.dominion} vs ${p2.dominion} — the Soul Arena ignites!`,
    `${winner.label} rides ${domNote}. Summons: ${winner.summon?.name||'None'}; buffs applied.`,
    `Clash peak: ${winner.label}'s ${Object.keys(COUNTERS)[idx%Object.keys(COUNTERS).length]} grade ${grade(winner.statsBuffed[Object.keys(COUNTERS)[idx%Object.keys(COUNTERS).length]])} overwhelms!`,
    `${luckNote}`,
    `Soul Dice → P1 d6=${roll1} · P2 d6=${roll2}. Score updated: P1 ${p1.wins} — P2 ${p2.wins}.`,
  ];
  return lines;
}

export default function BattleArena({ p1, p2, onComplete }) {
  const [log, setLog] = useState([]);
  const [score, setScore] = useState({ p1: 0, p2: 0 });
  const [round, setRound] = useState(0);
  const [rolls, setRolls] = useState({ p1: null, p2: null });

  const prepared = useMemo(() => {
    // Apply floor/offset before buffs
    const s1Base = applyStatFloorAndOffset(p1.stats);
    const s2Base = applyStatFloorAndOffset(p2.stats);
    const s1 = applySummon(s1Base, p1.summon);
    const s2 = applySummon(s2Base, p2.summon);
    return {
      p1: { ...p1, statsBuffed: s1 },
      p2: { ...p2, statsBuffed: s2 },
    };
  }, [p1, p2]);

  const canResolve = rolls.p1 != null && rolls.p2 != null && score.p1 < 3 && score.p2 < 3;

  const handleRoll = (who) => {
    setRolls((R) => ({ ...R, [who]: Math.ceil(Math.random()*6) }));
  };

  const resolveRound = () => {
    if (!canResolve) return;
    const r1 = computePower(prepared.p1, prepared.p2);
    const r2 = computePower(prepared.p2, prepared.p1);
    // Stronger dice influence: multiply totals by (1 + roll/12) → up to +50%
    const p1Total = r1.total * (1 + rolls.p1/12) + ((Math.random()*2 - 1) * RANDOMNESS_RANGE * r1.total);
    const p2Total = r2.total * (1 + rolls.p2/12) + ((Math.random()*2 - 1) * RANDOMNESS_RANGE * r2.total);

    let sp1 = score.p1; let sp2 = score.p2;
    const winner = p1Total >= p2Total ? 'p1' : 'p2';
    if (winner === 'p1') sp1++; else sp2++;

    const p1Info = { ...prepared.p1, wins: sp1 };
    const p2Info = { ...prepared.p2, wins: sp2 };
    const lines = lineSummary(round, p1Info, p2Info, { p1: r1, p2: r2 }, rolls.p1, rolls.p2);

    const newLog = [...log, ...lines];
    setLog(newLog);
    setScore({ p1: sp1, p2: sp2 });
    setRound((r) => r + 1);
    setRolls({ p1: null, p2: null });

    if (sp1 >= 3 || sp2 >= 3) {
      onComplete({ winner: sp1 > sp2 ? 'P1' : 'P2', log: newLog, score: { p1: sp1, p2: sp2 } });
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-white">Battle</h2>
        <div className="text-white/80">First to 3 wins</div>
      </div>
      <div className="mt-3 grid grid-cols-1 md:grid-cols-2 gap-3">
        {[prepared.p1, prepared.p2].map((p, idx) => (
          <div key={idx} className="rounded-xl p-4 bg-gradient-to-br from-fuchsia-500/10 to-indigo-500/10 border border-white/10 text-white">
            <div className="flex items-center justify-between">
              <div className="font-bold">{idx===0?'P1':'P2'} · {p.dominion}</div>
              <div className="text-fuchsia-300 font-bold text-lg">{idx===0?score.p1:score.p2}</div>
            </div>
            <div className="text-xs opacity-80">Summon: {p.summon?.name||'None'}</div>
            <div className="mt-3 flex items-center gap-2">
              <button onClick={()=>handleRoll(idx===0?'p1':'p2')} className="px-3 py-2 rounded bg-fuchsia-600 hover:bg-fuchsia-500 font-bold">Roll d6</button>
              <div className="text-sm">{(idx===0?rolls.p1:rolls.p2)!=null ? `Rolled: ${idx===0?rolls.p1:rolls.p2}` : '—'}</div>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-4 flex items-center justify-between">
        <div className="text-white/70 text-sm">Both players must roll before resolving the round.</div>
        <button disabled={!canResolve} onClick={resolveRound} className="px-5 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 font-extrabold disabled:opacity-50">Resolve Round</button>
      </div>

      <div className="mt-4 h-56 overflow-y-auto rounded-xl bg-black/40 border border-white/10 p-3 text-fuchsia-100 text-sm">
        {log.map((line, i)=>(
          <div key={i} className={`mb-2 ${line.startsWith('Round')?'font-extrabold text-white':''}`}>{line}</div>
        ))}
      </div>
    </div>
  );
}

export { POINTS_TOTAL, STAT_MAX, DOMINION_ADV_MULT, RANDOMNESS_RANGE };