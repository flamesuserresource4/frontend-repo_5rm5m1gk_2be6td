import React, { useState } from 'react';
import DominionSpinner from './components/DominionSpinner';
import StatAllocator, { STATS, STAT_MAX } from './components/StatAllocator';
import SummonSelect from './components/SummonSelect';
import BattleArena, { POINTS_TOTAL, DOMINION_ADV_MULT, RANDOMNESS_RANGE } from './components/BattleArena';

const initialStats = Object.fromEntries(STATS.map((k)=>[k,0]));

export default function App(){
  const [step, setStep] = useState('dominions');
  const [p1Dom, setP1Dom] = useState(null);
  const [p2Dom, setP2Dom] = useState(null);
  const [p1Stats, setP1Stats] = useState({ ...initialStats });
  const [p2Stats, setP2Stats] = useState({ ...initialStats });
  const [p1Summon, setP1Summon] = useState(null);
  const [p2Summon, setP2Summon] = useState(null);
  const [result, setResult] = useState(null);

  const remainingP1 = POINTS_TOTAL - Object.values(p1Stats).reduce((a,b)=>a+b,0);
  const remainingP2 = POINTS_TOTAL - Object.values(p2Stats).reduce((a,b)=>a+b,0);

  const readyDisabled = !p1Summon || !p2Summon;

  const onBattleComplete = (r) => {
    setResult(r);
    setStep('summary');
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0a0c13] via-[#0b0f16] to-[#0b0f16] text-white">
      <div className="absolute inset-0 pointer-events-none" aria-hidden>
        <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-[800px] h-[800px] rounded-full bg-fuchsia-500/10 blur-3xl" />
        <div className="absolute -bottom-24 right-1/2 translate-x-1/2 w-[700px] h-[700px] rounded-full bg-indigo-500/10 blur-3xl" />
      </div>
      <div className="relative max-w-6xl mx-auto p-4 md:p-6 space-y-6">
        <div className="rounded-2xl p-6 bg-gradient-to-br from-fuchsia-500/10 to-indigo-500/10 border border-white/10">
          <h1 className="text-2xl md:text-4xl font-extrabold tracking-tight">Dominion Clash: <span className="text-fuchsia-300">Soul Arena</span></h1>
          <p className="mt-2 text-sm md:text-base text-white/80">Spin your fate. Build your legend. Roll your soul. First to 3 claims the arena.</p>
        </div>

        <div className="flex flex-wrap items-center gap-2 text-xs uppercase tracking-wide text-white/70">
          {['Dominion','Stats','Summon','Ready','Battle','Summary'].map((label, idx) => (
            <div key={label} className={`px-3 py-1 rounded-full border ${idx===0 && step==='dominions'?'bg-fuchsia-500/20 border-fuchsia-400/40':''}
              ${idx===1 && (step==='statsP1'||step==='statsP2')?'bg-fuchsia-500/20 border-fuchsia-400/40':''}
              ${idx===2 && (step==='summonP1'||step==='summonP2')?'bg-fuchsia-500/20 border-fuchsia-400/40':''}
              ${idx===3 && step==='ready'?'bg-fuchsia-500/20 border-fuchsia-400/40':''}
              ${idx===4 && step==='battle'?'bg-fuchsia-500/20 border-fuchsia-400/40':''}
              ${idx===5 && step==='summary'?'bg-fuchsia-500/20 border-fuchsia-400/40':''}
              border-white/10`}>{label}</div>
          ))}
        </div>

        {step === 'dominions' && (
          <div className="space-y-4">
            <DominionSpinner onReveal={(d1,d2)=>{ setP1Dom(d1); setP2Dom(d2); setStep('statsP1'); }} />
          </div>
        )}

        {step === 'statsP1' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold">P1: Allocate Stats</h2>
              <div className="text-white/70">Dominion: {p1Dom}</div>
            </div>
            <StatAllocator values={p1Stats} onChange={setP1Stats} pointsTotal={POINTS_TOTAL} />
            <div className="flex justify-between">
              <button onClick={()=>setStep('dominions')} className="px-3 py-2 rounded bg-white/10">Back</button>
              <button disabled={remainingP1!==0} onClick={()=>setStep('statsP2')} className="px-4 py-2 rounded-lg bg-fuchsia-600 hover:bg-fuchsia-500 font-bold disabled:opacity-50 disabled:cursor-not-allowed">Confirm P1</button>
            </div>
          </div>
        )}

        {step === 'statsP2' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold">P2: Allocate Stats</h2>
              <div className="text-white/70">Dominion: {p2Dom}</div>
            </div>
            <StatAllocator values={p2Stats} onChange={setP2Stats} pointsTotal={POINTS_TOTAL} />
            <div className="flex justify-between">
              <button onClick={()=>setStep('statsP1')} className="px-3 py-2 rounded bg-white/10">Back</button>
              <button disabled={remainingP2!==0} onClick={()=>setStep('summonP1')} className="px-4 py-2 rounded-lg bg-fuchsia-600 hover:bg-fuchsia-500 font-bold disabled:opacity-50 disabled:cursor-not-allowed">Confirm P2</button>
            </div>
          </div>
        )}

        {step === 'summonP1' && (
          <div className="space-y-4">
            <h2 className="text-xl font-bold">P1: Summon Choice</h2>
            <SummonSelect stats={p1Stats} summon={p1Summon} onChoose={(s, newStats)=>{ if (newStats) setP1Stats(newStats); setP1Summon(s); }} />
            <div className="flex justify-between">
              <button onClick={()=>setStep('statsP2')} className="px-3 py-2 rounded bg-white/10">Back</button>
              <button disabled={!p1Summon} onClick={()=>setStep('summonP2')} className="px-4 py-2 rounded-lg bg-fuchsia-600 hover:bg-fuchsia-500 font-bold disabled:opacity-50 disabled:cursor-not-allowed">Confirm P1 Summon</button>
            </div>
          </div>
        )}

        {step === 'summonP2' && (
          <div className="space-y-4">
            <h2 className="text-xl font-bold">P2: Summon Choice</h2>
            <SummonSelect stats={p2Stats} summon={p2Summon} onChoose={(s, newStats)=>{ if (newStats) setP2Stats(newStats); setP2Summon(s); }} />
            <div className="flex justify-between">
              <button onClick={()=>setStep('summonP1')} className="px-3 py-2 rounded bg-white/10">Back</button>
              <button disabled={!p2Summon} onClick={()=>setStep('ready')} className="px-4 py-2 rounded-lg bg-fuchsia-600 hover:bg-fuchsia-500 font-bold disabled:opacity-50 disabled:cursor-not-allowed">Ready</button>
            </div>
          </div>
        )}

        {step === 'ready' && (
          <div className="space-y-4">
            <div className="rounded-2xl p-6 bg-white/5 border border-white/10">
              <div className="text-2xl font-extrabold mb-3">Soul Arena Ready</div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="rounded-xl p-4 bg-black/30 border border-white/10">
                  <div className="font-bold">P1 · {p1Dom}</div>
                  <div className="text-sm opacity-80">Summon: {p1Summon?.name}</div>
                </div>
                <div className="rounded-xl p-4 bg-black/30 border border-white/10">
                  <div className="font-bold">P2 · {p2Dom}</div>
                  <div className="text-sm opacity-80">Summon: {p2Summon?.name}</div>
                </div>
              </div>
              <div className="flex justify-end mt-4">
                <button disabled={readyDisabled} onClick={()=>setStep('battle')} className="px-5 py-3 rounded-xl bg-fuchsia-600 hover:bg-fuchsia-500 font-extrabold text-white disabled:opacity-50">Begin Clash</button>
              </div>
            </div>
          </div>
        )}

        {step === 'battle' && (
          <BattleArena
            p1={{ label: 'P1', dominion: p1Dom, stats: p1Stats, summon: p1Summon }}
            p2={{ label: 'P2', dominion: p2Dom, stats: p2Stats, summon: p2Summon }}
            onComplete={onBattleComplete}
          />
        )}

        {step === 'summary' && (
          <div className="space-y-4">
            <h2 className="text-2xl font-extrabold">Match Summary</h2>
            <div className="rounded-xl p-4 bg-white/5 border border-white/10">
              <div className="font-bold mb-2">Winner: {result?.winner}</div>
              <div className="text-sm opacity-80">Final Score — P1 {result?.score.p1} : P2 {result?.score.p2}</div>
            </div>
            <div className="rounded-xl p-4 bg-black/40 border border-white/10 text-fuchsia-100 text-sm max-h-72 overflow-y-auto">
              {result?.log.map((l,i)=>(<div key={i} className="mb-2">{l}</div>))}
            </div>
            <div className="flex justify-between">
              <button onClick={()=>{ setStep('dominions'); setP1Stats({...initialStats}); setP2Stats({...initialStats}); setP1Summon(null); setP2Summon(null); setResult(null); setP1Dom(null); setP2Dom(null); }} className="px-3 py-2 rounded bg-white/10">Play Again</button>
              <div className="px-3 py-2 rounded bg-white/10 text-white/70 text-sm">POINTS_TOTAL={POINTS_TOTAL} · STAT_MAX={STAT_MAX} · DOMINION_ADV_MULT={DOMINION_ADV_MULT} · RANDOMNESS_RANGE=±{RANDOMNESS_RANGE*100}%</div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
