const escape = value => String(value ?? '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
export const cardSlug = id => id.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
export function cardFace(card, lazy=true) {
  const img=(src,css,alt='',attrs='')=>`<img class="${css}" src="${escape(src)}" alt="${escape(alt)}" decoding="async" draggable="false"${lazy?' loading="lazy"':''}${attrs}>`;
  const planes=card.layers?.length?card.layers:[{id:'main',image:card.foregroundImage||card.image,parallax:.018,popout:false}];
  const layer=plane=>img(plane.image,'game-art-layer game-subject','',` data-parallax="${Number(plane.parallax)}"`);
  const art=popout=>`<div class="game-art${popout?' game-popout':''}" aria-hidden="true"><div class="game-art-content">${!popout&&card.backgroundImage?img(card.backgroundImage,'game-art-layer game-background','',` data-parallax="background"`):''}${planes.filter(p=>!popout||p.popout).map(layer).join('')}</div></div>`;
  const cost=card.costLabel||String(card.mana);
  return `<div class="game-card-face face-${cardSlug(card.id)}" role="img" aria-label="${escape(card.name)}, ${escape(cost)} mana"><div class="game-card-stage">${art(false)}${img(card.frameImage,'game-card-frame')}${planes.some(p=>p.popout)?art(true):''}${card.ultimateCrestImage?img(card.ultimateCrestImage,'game-ultimate'):''}<div class="game-cost">${img(card.costIndicatorImage,'game-cost-art')}<span>${escape(cost)}</span></div></div></div>`;
}
export function cardArtStyles(catalog) {
  const d=catalog.depth;
  if(!d)throw Error('Missing game depth configuration');
  return `:root{--card-background-scale:${d.backgroundOverscan};--card-subject-scale:${d.foregroundOverscan};}\n`+catalog.cards.map(card=>{
    const pts=card.artWindow,x=Math.min(...pts.map(p=>p.x)),y=Math.min(...pts.map(p=>p.y));
    const w=Math.max(...pts.map(p=>p.x))-x,h=Math.max(...pts.map(p=>p.y))-y;
    const polygon=pts.map(p=>`${p.x*100}% ${p.y*100}%`).join(',');
    const top=Math.max(0,y-d.popoutHeight), bottom=y+.002;
    return `.face-${cardSlug(card.id)} .game-art{clip-path:polygon(${polygon});}.face-${cardSlug(card.id)} .game-art-content{left:${x*100}%;top:${y*100}%;width:${w*100}%;height:${h*100}%;}.face-${cardSlug(card.id)} .game-popout{clip-path:polygon(${x*100}% ${top*100}%,${(x+w)*100}% ${top*100}%,${(x+w)*100}% ${bottom*100}%,${x*100}% ${bottom*100}%);}`;
  }).join('\n');
}
export function makeUnitsPages(catalog) {
  const cards=[...catalog.cards].sort((a,b)=>a.name.localeCompare(b.name));
  if(new Set(cards.map(c=>c.id)).size!==cards.length||new Set(cards.map(c=>cardSlug(c.id))).size!==cards.length)throw Error('Duplicate card identity or URL');
  for(const card of cards) {
    if(!card.displayRows)throw Error('Missing game detail rows: '+card.id);
    for(const row of card.displayRows)if(row.kind==='stat'&&(!Number.isFinite(row.percent)||row.percent<0||row.percent>100))throw Error('Invalid stat bar: '+card.id);
  }
  const link=card=>`/units/${cardSlug(card.id)}`;
  const tags=card=>[...new Set([card.type,card.faction==='Other'?null:card.faction,...card.tags].filter(Boolean))].map(tag=>`<span>${escape(tag)}</span>`).join('');
  const tile=card=>`<a class="catalog-card" href="${link(card)}" data-name="${escape(card.name)}" data-search="${escape([card.name,card.description,...card.tags].join(' ').toLowerCase())}" data-faction="${escape(card.faction)}" data-type="${escape(card.type)}" data-mana="${card.mana}"><div class="catalog-art">${cardFace(card)}</div><div class="catalog-copy"><h2>${escape(card.name)}</h2><span class="catalog-type">${escape(card.type)}${card.faction!=='Other'?' &middot; '+escape(card.faction):''}</span><span class="catalog-open">View card &amp; stats <span aria-hidden="true">&rarr;</span></span></div></a>`;
  const options=values=>values.map(value=>`<option value="${escape(value)}">${escape(value)}</option>`).join('');
  const main=`<section class="catalog-heading"><p class="eyebrow">THE FACTIONFALL CARD ROSTER</p><h1>Cards.<br><span>The possibilities.</span></h1><p>Explore every card, from your front line to the spells that turn a battle. Choose a card to see its role and base stats.</p><p class="card-motion-hint">Move your pointer over a card to explore its depth.</p></section><section id="units-browser" aria-label="Card browser"><div class="units-controls" id="card-filters" hidden><label class="card-search">Find a card<input id="card-search" type="search" placeholder="Search names, roles, or abilities" autocomplete="off"></label><label>Faction<select id="card-faction"><option value="">All factions</option>${options([...new Set(cards.map(c=>c.faction))].sort())}</select></label><label>Card type<select id="card-type"><option value="">All types</option>${options([...new Set(cards.map(c=>c.type))].sort())}</select></label><label>Sort by<select id="card-sort"><option value="name">Name: A–Z</option><option value="mana">Mana: low to high</option><option value="mana-desc">Mana: high to low</option></select></label><button class="filter-reset" id="card-reset" type="button">Reset</button></div><div class="catalog-summary"><p id="card-count" aria-live="polite">${cards.length} cards</p><span>Base stats</span></div><div class="catalog-grid" id="card-grid">${cards.map(tile).join('')}</div><p id="card-empty" class="catalog-empty" hidden>No cards match those filters. Try another name or reset your filters.</p></section>`;
  const pages=[['units','Cards',main]];
  cards.forEach((card,index)=>{
    const rows=card.displayRows.map(row=>row.kind==='stat'?`<div class="stat-row" title="${escape(row.tooltip)}"><dt>${escape(row.label)}</dt><dd>${escape(row.display)}</dd><div class="stat-track" aria-hidden="true"><span class="stat-fill fill-${Math.round(row.percent)}"></span></div></div>`:row.kind==='heading'?`</dl><h3>${escape(row.label)}</h3><dl>`:`</dl><p class="card-stat-note">${escape(row.label)}</p><dl>`).join('');
    const previous=cards[(index+cards.length-1)%cards.length],next=cards[(index+1)%cards.length];
    const related=cards.filter(other=>other.id!==card.id&&other.faction===card.faction).slice(0,3);
    pages.push([`units/${cardSlug(card.id)}`,`${card.name} · card stats`,`<a class="catalog-back" href="/units">&larr; All cards</a><section class="card-detail"><div class="detail-portrait">${cardFace(card,false)}<p class="card-motion-hint">Move over the card to explore its depth.</p></div><div class="detail-overview"><p class="eyebrow">${escape(card.faction==='Other'?card.type:card.faction)}</p><h1>${escape(card.name)}</h1><div class="card-tags">${tags(card)}</div><p class="card-description">${escape(card.description)}</p><p class="base-stat-note">Base stats</p></div></section><section class="game-detail-stats" aria-label="Card details"><h2>Card details</h2><dl>${rows}</dl>${!card.displayRows.length?'<p>See the description for this card’s battlefield behavior.</p>':''}</section><nav class="card-pagination" aria-label="Browse cards"><a href="${link(previous)}">&larr; ${escape(previous.name)}</a><a href="/units">All cards</a><a href="${link(next)}">${escape(next.name)} &rarr;</a></nav>${related.length?`<section class="related-cards"><h2>More to explore</h2><div class="catalog-grid">${related.map(tile).join('')}</div></section>`:''}`]);
  });
  return pages;
}
