import React, { useEffect, useMemo, useState } from 'react';
import { MATCHUPS } from './DominionWheel';
import { GRADE } from './StatAllocator';

const POINTS_TOTAL = 30;
const STAT_MAX = 8;
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
  // base is sum of 9 stats (after buff)
  let base = sumStats(p.statsBuffed);

  // counters small bonus/malus for each relation
  let counterMult = 1;
  for (const [a, b] of Object.entries(COUNTERS)) {
    const va = p.statsBuffed[a] || 0;
    const vb = opp.statsBuffed[b] || 0;
    if (va > vb) counterMult *= 1.15;
    else if (va < vb) counterMult *= 0.85;
  }

  // dominion matchup
  let domMult = 1;
  const rel = MATCHUPS[p.dominion];
  if (rel) {
    if (rel.strong === opp.dominion) domMult *= DOMINION_ADV_MULT;
    if (rel.weak === opp.dominion) domMult /= DOMINION_ADV_MULT;
  }

  // randomness ±5%
  const rand = (Math.random() * 2 - 1) * RANDOMNESS_RANGE; // -0.05..0.05

  // hidden luck tilts positive: each hiddenLuck point = +0.5%
  const luckTilt = (p.summon?.hiddenLuck || 0) * 0.005;

  const total = base * counterMult * domMult * (1 + rand + luckTilt);
  return { total, parts: { base, counterMult, domMult, rand, luckTilt } };
}

function grade(v) { return GRADE[Math.max(0, Math.min(STAT_MAX, v))] || 'F'; }

function lineSummary(idx, p1, p2, r) {
  const lead = r.p1.total > r.p2.total ? 'P1' : 'P2';
  const winner = lead==='P1'?p1:p2; const loser = lead==='P1'?p2:p1;
  const domNote = r[lead.toLowerCase()].parts.domMult>1? 'dominance surge' : r[lead.toLowerCase()].parts.domMult<1? 'elemental drag' : 'neutral flow';
  const luckNote = winner.summon?.hiddenLuck? `Luck favored them (+${(winner.summon.hiddenLuck*0.5).toFixed(1)}%).` : 'Fate stayed even.';
  const lines = [
    `Round ${idx+1}! ${p1.dominion} vs ${p2.dominion} — the Soul Arena ignites!`,
    `${winner.label} rides ${domNote}. Summons: ${winner.summon?.name||'None'}; buffs applied.`,
    `Clash peak: ${winner.label}'s ${Object.keys(COUNTERS)[idx%Object.keys(COUNTERS).length]} grade ${grade(winner.statsBuffed[Object.keys(COUNTERS)[idx%Object.keys(COUNTERS).length]])} overwhelms!`,
    `${luckNote}`,
    `Score: P1 ${p1.wins} — P2 ${p2.wins}. Soul Dice: P1 d20=${winner.rollP1??''} P2 d20=${winner.rollP2??''}`,
  ];
  return lines;
}

export default function BattleArena({ p1, p2, onComplete }) {
  const [log, setLog] = useState([]);
  const [score, setScore] = useState({ p1: 0, p2: 0 });
  const [round, setRound] = useState(0);
  const [running, setRunning] = useState(false);

  const prepared = useMemo(() => {
    const s1 = applySummon(p1.stats, p1.summon);
    const s2 = applySummon(p2.stats, p2.summon);
    return {
      p1: { ...p1, statsBuffed: s1 },
      p2: { ...p2, statsBuffed: s2 },
    };
  }, [p1, p2]);

  useEffect(() => {
    setRunning(true);
  }, []);

  useEffect(() => {
    if (!running) return;
    if (score.p1 >= 3 || score.p2 >= 3) {
      onComplete({ winner: score.p1 > score.p2 ? 'P1' : 'P2', log, score });
      return;
    }
    // auto play next round with small delay for drama
    const t = setTimeout(() => {
      const roll1 = Math.ceil(Math.random()*20);
      const roll2 = Math.ceil(Math.random()*20);
      const r1 = computePower(prepared.p1, prepared.p2);
      const r2 = computePower(prepared.p2, prepared.p1);
      const p1Total = r1.total + roll1 * 0.1; // tiny additive from d20
      const p2Total = r2.total + roll2 * 0.1;
      let sp1 = score.p1; let sp2 = score.p2;
      const winner = p1Total >= p2Total ? 'p1' : 'p2';
      if (winner === 'p1') sp1++; else sp2++;

      const p1Info = { ...prepared.p1, wins: sp1, rollP1: roll1, rollP2: roll2 };
      const p2Info = { ...prepared.p2, wins: sp2, rollP1: roll1, rollP2: roll2 };
      const lines = lineSummary(round, p1Info, p2Info, { p1: r1, p2: r2 });

      setLog((L) => [...L, ...lines]);
      setScore({ p1: sp1, p2: sp2 });
      setRound((r) => r + 1);
    }, 800);
    return () => clearTimeout(t);
  }, [round, running]);

  return (
    <div>
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-white">Battle</h2>
        <div className="text-white/80">First to 3 wins</div>
      </div>
      <div className="mt-3 grid grid-cols-1 md:grid-cols-2 gap-3">
        {[prepared.p1, prepared.p2].map((p, idx) => (
          <div key={idx} className="rounded-xl p-4 bg-white/5 border border-white/10 text-white">
            <div className="flex items-center justify-between">
              <div className="font-bold">{idx===0?'P1':'P2'} · {p.dominion}</div>
              <div className="text-fuchsia-300 font-bold text-lg">{idx===0?score.p1:score.p2}</div>
            </div>
            <div className="text-xs opacity-80">Summon: {p.summon?.name||'None'}</div>
          </div>
        ))}
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
