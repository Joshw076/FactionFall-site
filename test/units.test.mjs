import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { makeUnitsPages, cardSlug,cardFace,cardArtStyles } from '../units-pages.mjs';
import { filterCards } from '../card-filter.js';
const catalog=JSON.parse(await readFile(new URL('../assets/data/cards.json',import.meta.url),'utf8'));
const pages=makeUnitsPages(catalog);
const page=id=>pages.find(([route])=>route===`units/${cardSlug(id)}`)[2];

test('every released registry card has a static detail page and complete layered artwork',async()=>{
  assert.equal(pages.length,catalog.cards.length+1);
  for(const card of catalog.cards) {
    assert.ok(pages[0][2].includes(`href="/units/${cardSlug(card.id)}"`));
    for(const path of [card.image,card.frameImage,card.costIndicatorImage,card.backgroundImage,card.foregroundImage,card.ultimateCrestImage,...card.layers.map(p=>p.image)].filter(Boolean))
      await readFile(new URL('..'+path,import.meta.url));
    assert.ok(card.layers.length>=2,card.id);
    assert.equal(new Set(card.layers.map(p=>p.id)).size,card.layers.length);
  }
});
test('combined filters and mana sorting still work',()=>{
  const cards=catalog.cards.map(c=>({...c,search:[c.name,c.description,...c.tags].join(' ').toLowerCase()}));
  assert.deepEqual(filterCards(cards,{search:'corpse wagon',faction:'Undead',type:'Unit'}).map(c=>c.name),['Corpse Wagon']);
  assert.equal(filterCards(cards,{search:'no-such-card'}).length,0);
  const sorted=filterCards(cards,{sort:'mana'});assert.ok(sorted.every((c,i)=>!i||c.mana>=sorted[i-1].mana));
});
test('all exact game display values and notes appear in detail pages; text is escaped',()=>{
  for(const card of catalog.cards) {
    const html=page(card.id);
    for(const row of card.displayRows) {
      const escaped=row.label.replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('>','&gt;').replaceAll('"','&quot;').replaceAll("'",'&#39;');
      assert.ok(html.includes(escaped),`${card.id}: ${row.label}`);
      if(row.kind==='stat')assert.ok(html.includes(`fill-${Math.round(row.percent)}`));
    }
  }
  const sample=structuredClone(catalog);sample.cards[0].name='<script>alert(1)</script>';
  const html=makeUnitsPages(sample).map(p=>p[2]).join('');assert.ok(!html.includes('<script>alert(1)</script>'));assert.ok(html.includes('&lt;script&gt;'));
});
test('squad explanation is concise and mixed members use their real displayed names',()=>{
  const squad=page('Pip and Spark');
  assert.ok(squad.includes('Deploys 2 units'));assert.ok(squad.includes('Stats below are for each unit.'));
  assert.ok(squad.includes('>Spark<'));assert.ok(squad.includes('>Pip<'));
  assert.ok(!squad.includes('Line formation'));assert.ok(!squad.includes('stats per unit'));
  assert.ok(page('Skitter Pack').includes('Stats below are for each unit.'));
});
test('spell delivery and timing mirror game presentation without internal enum names',()=>{
  const fireball=page('Fireball');
  assert.ok(fireball.includes('Launched from Main Base'));
  assert.ok(fireball.includes('8 units / sec'));assert.ok(fireball.includes('2 units'));
  assert.ok(!fireball.includes('LobFromPlayerBase'));assert.ok(!fireball.includes('Movement: Parabolic'));
  assert.ok(!fireball.includes('0 sec'));assert.ok(!fireball.includes('Visual duration'));
  const quake=page('Earthquake');assert.ok(quake.includes('Appears at the selected location'));assert.ok(!quake.includes('Travel speed'));
  assert.match(page('Bastion'),/Every [0-9.]+ sec/);
});
test('depth masks, semantic plane order, variable costs and frame geometry are game sourced',()=>{
  assert.equal(catalog.depth.maximumTiltDegrees,9);
  assert.ok(cardArtStyles(catalog).includes('clip-path:polygon('));
  for(const card of catalog.cards) {
    const html=cardFace(card);
    assert.ok(html.includes('game-card-stage'));
    let index=-1;
    for(const plane of card.layers) {const next=html.indexOf(`src="${plane.image}"`,index+1);assert.ok(next>index);index=next;}
    if(card.layers.some(p=>p.popout))assert.ok(html.includes('game-popout'));
    if(card.variableManaCost)assert.ok(html.includes(`>${card.costLabel}</span>`));
  }
  for(const [,,html]of pages)assert.ok(!/FrameUnlock|FrameEquip|FrameConfirm|Unlock frame/i.test(html));
});
