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
