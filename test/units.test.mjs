import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { makeUnitsPages, cardSlug } from '../units-pages.mjs';
import { filterCards } from '../card-filter.js';
const catalog = JSON.parse(await readFile(new URL('../assets/data/cards.json',import.meta.url),'utf8'));
const pages = makeUnitsPages(catalog);
test('every registry card has a static detail page and usable artwork', async()=>{
  assert.equal(pages.length,catalog.cards.length+1);
  for(const card of catalog.cards){
    assert.ok(pages.some(([route])=>route===`units/${cardSlug(card.id)}`));
    assert.ok(pages[0][2].includes(`href="/units/${cardSlug(card.id)}"`));
    await readFile(new URL('..'+card.image,import.meta.url));
  }
});
test('combined filters find contact detonation and return an empty state for no match',()=>{
  const cards=catalog.cards.map(c=>({...c,search:[c.name,c.description,...c.tags].join(' ').toLowerCase()}));
  assert.deepEqual(filterCards(cards,{search:'contact detonation',faction:'Undead'}).map(c=>c.name),['Corpse Wagon','Rotball']);
  assert.equal(filterCards(cards,{search:'no-such-card'}).length,0);
  const sorted=filterCards(cards,{sort:'mana'});
  assert.ok(sorted.every((c,i)=>!i||c.mana>=sorted[i-1].mana));
});
test('squad stats remain per member and hostile text is escaped',()=>{
  const squad=pages.find(([route])=>route==='units/skitter-pack');
  assert.ok(squad[2].includes('per unit'));
  const sample=structuredClone(catalog); sample.cards[0].name='<script>alert(1)</script>';
  const markup=makeUnitsPages(sample).map(p=>p[2]).join('');
  assert.ok(!markup.includes('<script>alert(1)</script>'));
  assert.ok(markup.includes('&lt;script&gt;'));
});
test('Pip and Spark have two member panels with their own damage and ultimate',()=>{
  const card=catalog.cards.find(c=>c.name==='Pip and Spark');
  assert.deepEqual([...new Set(card.stats.map(s=>s.group))],['Pip · per unit','Spark · per unit']);
  assert.equal(card.stats.find(s=>s.group.startsWith('Spark')&&s.label==='Attack: Damage per hit').value,70);
  assert.equal(card.stats.find(s=>s.group.startsWith('Spark')&&s.label==='Ultimate: Damage per hit').value,85);
  assert.equal(card.stats.find(s=>s.group.startsWith('Pip')&&s.label.includes('2 projectiles')).value,35);
  const html=pages.find(([route])=>route==='units/pip-and-spark')[2];
  assert.ok(!html.includes('<h2>Pip and Spark'));
  assert.equal((html.match(/class="stat-group"/g)||[]).length,2);
});
test('Corpse Wagon displays its authored two-Husk death trigger and contact damage',()=>{
  const card=catalog.cards.find(c=>c.name==='Corpse Wagon');
  assert.ok(card.behaviors.some(note=>note.includes('on death: spawns 2 × Plague Husk')));
  assert.equal(card.stats.find(s=>s.label==='Contact: Damage per hit').value,450);
  const html=pages.find(([route])=>route==='units/corpse-wagon')[2];
  assert.ok(html.includes('spawns 2 × Plague Husk'));
});
test('website includes app targeting, squad and spell details without frame controls',()=>{
  const miner=pages.find(([route])=>route==='units/robot-miner')[2];
  assert.ok(miner.includes('Targets: Ground, Structures, Bases, Mana mines'));
  const squad=pages.find(([route])=>route==='units/pip-and-spark')[2];
  assert.ok(squad.includes('Ultimate-bearing'));
  assert.ok(squad.includes('1 × Spark · stats per unit'));
  assert.ok(squad.includes('1 × Pip · stats per unit'));
  assert.ok(squad.includes('Line formation'));
  const fireball=pages.find(([route])=>route==='units/fireball')[2];
  assert.ok(fireball.includes('Movement: Parabolic · Origin: LobFromPlayerBase'));
  for(const [, ,html] of pages) assert.ok(!/FrameUnlock|FrameEquip|FrameConfirm|Unlock frame/i.test(html));
});
