Dominion Clash: Soul Arena

Overview
- A local two‑player (hot‑seat) anime duel for desktop and iPad. Exportable to HTML5.
- Flow: Dominion Wheel → Stat Assignment → Summon Choice → Ready Screen → Battle (first to 3 round wins) → Match Summary.
- Includes a full‑width interactive Spline 3D cover.

Constants
- POINTS_TOTAL = 30
- STAT_MAX = 8
- DOMINION_ADV_MULT = 1.25
- RANDOMNESS_RANGE = ±5%

Dominions
- Titanus (raw might): strong vs Regalus, weak vs Aethera
- Aethera (mystical flow): strong vs Titanus, weak vs Novaris
- Novaris (cosmic explosion): strong vs Aethera, weak vs Obsidion
- Obsidion (forged resilience): strong vs Novaris, weak vs Arcannus
- Regalus (sovereign control): strong vs Arcannus, weak vs Titanus
- Arcannus (secret wildcard): strong vs Obsidion, weak vs Regalus

Stats (9)
- Strength, Endurance, Speed, Stamina, Defense, Dominion Mastery, Battle IQ, Focus, Summoner’s Will
- Range 0–8 (8 = S++). Players allocate exactly 30 points using plus/minus bars.
- Grades: F, D, C, B, A, S, S+, S++.

Summons
- Tier determined by Summoner’s Will (0–8).
- Pools:
  - T1: Shade Imp (+2 Speed), Gloom Pixie (+2 Luck)
  - T2: Stonefang Cub (+3 Defense), Mist Serpent (+3 Speed)
  - T3: Ember Wisp (+4 Strength), Frostling (+4 Endurance), Iron Beetle (+4 Defense)
  - T4: Lunara Hound (+5 Strength), Storm Lynx (+5 Speed), Spirit Treant (+5 Stamina)
  - T5: Drakefang (+6 Strength), Thunder Roc (+6 Luck), Abyssal Horror (+6 Defense)
  - T6: Solar Griffin (+7 Stamina), Void Seraph (+7 Focus), Crystal Golem (+7 Defense)
  - T7: Eclipse Dragon (+8 Strength), Abyss Leviathan (+8 Endurance), Phoenix Ascendant (+8 Speed)
  - T8: Dominion Avatar (choose one stat → set to 8 = S++, plus +5 hidden Luck)

Battle Resolution
- Each round both players receive a randomness modifier in range ±5% and roll a Soul Dice (d20) for a tiny additive bump (for flair only).
- Effective power = sum of 9 stats + summon buff → apply Dominion matchup modifier → apply hidden Luck tilt → apply randomness.
- Strong/Weak matchups: ±25%.
- Hidden Luck: each hidden Luck point tilts outcome by +0.5% (Thunder Roc gives +3% etc.). Luck is not shown to the opponent in‑universe.
- Stat vs Stat counters (if higher ⇒ 1.15x; if lower ⇒ 0.85x):
  - Strength > Defense, Speed > Strength, Defense > Speed, Endurance > Stamina,
  - Dominion Mastery > Defense, Battle IQ > Dominion Mastery, Focus > Strength, Summoner’s Will > Endurance
- First to 3 round wins takes the match.

Commentary (per round)
1. Hype intro
2. Analysis of dominion/strong‑weak and summon influence
3. Dramatic highlight (stat grade callouts)
4. Flavor/taunt and hidden Luck when relevant
5. Score update with Soul Dice values

UI Flow
- Dominion Wheel: pick dominions for both players.
- Stat Assignment: allocate all 30 points per player; confirm disabled until exact.
- Summon Choice: based on Summoner’s Will tier; avatars allow one stat to be set to 8 (S++).
- Ready Screen: final confirmation.
- Battle: autoplayed rounds with animated log.
- Match Summary: winner, final score, and full log.

Touch & Flair
- Large tap areas, high contrast, subtle glow effects on S++ stats, and dramatic copy.
- Camera shake and advanced juice can be layered later with Framer Motion.

Sample Match Log (excerpt)
- Round 1! Titanus vs Aethera — the Soul Arena ignites!
- P2 rides dominance surge. Summons: Mist Serpent; buffs applied.
- Clash peak: P2's Strength grade A overwhelms!
- Luck favored them (+1.0%).
- Score: P1 0 — P2 1. Soul Dice: P1 d20=6 P2 d20=17
- Round 2! Titanus vs Aethera — the Soul Arena roars back!
- P1 rides neutral flow. Summons: Drakefang; buffs applied.
- Clash peak: P1's Speed grade S+ streaks past!
- Fate stayed even.
- Score: P1 1 — P2 1. Soul Dice: P1 d20=19 P2 d20=12

Export
- As a Vite + React site, simply build for HTML5 with `npm run build`.
