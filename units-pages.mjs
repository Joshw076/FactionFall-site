const escape = value => String(value ?? '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
export const cardSlug = id => id.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
const number = value => new Intl.NumberFormat('en', { maximumFractionDigits: 2 }).format(value);
export function cardFace(card, lazy=true) {
  const img = (src, css, alt='') => `<img class="${css}" src="${escape(src)}" alt="${escape(alt)}"${lazy ? ' loading="lazy"' : ''}>`;
  return `<div class="game-card-face face-${cardSlug(card.id)}">${card.foregroundImage && card.backgroundImage ? `<div class="game-art">${img(card.backgroundImage,'game-art-layer')}${img(card.foregroundImage,'game-art-layer',card.name)}</div>` : `<div class="game-art">${img(card.image,'game-art-layer',card.name)}</div>`}${img(card.frameImage,'game-card-frame')}${card.ultimateCrestImage ? img(card.ultimateCrestImage,'game-ultimate') : ''}<div class="game-cost">${img(card.costIndicatorImage,'game-cost-art')}<span aria-label="${card.mana} mana">${card.mana}</span></div></div>`;
}
export function cardArtStyles(catalog) {
  return catalog.cards.map(card=>{
    const pts=card.artWindow, xs=pts.map(p=>p.x), ys=pts.map(p=>p.y);
    const x=Math.min(...xs), y=Math.min(...ys), w=Math.max(...xs)-x, h=Math.max(...ys)-y;
    const polygon=pts.map(p=>`${(p.x-x)/w*100}% ${(p.y-y)/h*100}%`).join(',');
    return `.face-${cardSlug(card.id)} .game-art { left:${x*100}%; top:${y*88}%; width:${w*100}%; height:${h*88}%; clip-path:polygon(${polygon}); }`;
  }).join('\n');
}
export function makeUnitsPages(catalog) {
  const cards = [...catalog.cards].sort((a,b) => a.name.localeCompare(b.name));
  if (new Set(cards.map(c => c.id)).size !== cards.length || new Set(cards.map(c => cardSlug(c.id))).size !== cards.length) throw new Error('Duplicate card identity or URL');
  for (const card of cards) for (const stat of card.stats) if (!Number.isFinite(stat.value)) throw new Error('Invalid stat: ' + card.id);
  const cardLink = card => `/units/${cardSlug(card.id)}`;
  const image = cardFace;
  const tags = card => [...new Set([card.type, card.faction === 'Other' ? null : card.faction, ...card.tags].filter(Boolean))].map(tag => `<span>${escape(tag)}</span>`).join('');
  const tile = card => `<a class="catalog-card" href="${cardLink(card)}" data-name="${escape(card.name)}" data-search="${escape([card.name, card.description, ...card.tags].join(' ').toLowerCase())}" data-faction="${escape(card.faction)}" data-type="${escape(card.type)}" data-mana="${card.mana}"><div class="catalog-art">${image(card)}</div><div class="catalog-copy"><span class="catalog-type">${escape(card.type)}${card.faction !== 'Other' ? ' · ' + escape(card.faction) : ''}</span><h2>${escape(card.name)}</h2><span class="catalog-open">View card &amp; stats <span aria-hidden="true">&rarr;</span></span></div></a>`;
  const options = values => values.map(value => `<option value="${escape(value)}">${escape(value)}</option>`).join('');
  const intro = `<section class="catalog-heading"><p class="eyebrow">THE FACTIONFALL CARD ROSTER</p><h1>The units.<br><span>The possibilities.</span></h1><p>Explore every card, from your front line to the spells that turn a battle. Choose a card to see its role and base stats.</p></section>`;
  const main = `${intro}<section id="units-browser" aria-label="Card browser"><div class="units-controls" id="card-filters" hidden><label class="card-search">Find a card<input id="card-search" type="search" placeholder="Search names, roles, or abilities" autocomplete="off"></label><label>Faction<select id="card-faction"><option value="">All factions</option>${options([...new Set(cards.map(c=>c.faction))].sort())}</select></label><label>Card type<select id="card-type"><option value="">All types</option>${options([...new Set(cards.map(c=>c.type))].sort())}</select></label><label>Sort by<select id="card-sort"><option value="name">Name: A–Z</option><option value="mana">Mana: low to high</option><option value="mana-desc">Mana: high to low</option></select></label><button class="filter-reset" id="card-reset" type="button">Reset</button></div><div class="catalog-summary"><p id="card-count" aria-live="polite">${cards.length} cards</p><span>Base stats</span></div><div class="catalog-grid" id="card-grid">${cards.map(tile).join('')}</div><p id="card-empty" class="catalog-empty" hidden>No cards match those filters. Try another name or reset your filters.</p></section>`;
  const pages = [['units', 'The units & card catalog', main]];
  const maxima = {};
  for (const card of cards) for (const stat of card.stats) maxima[stat.metric] = Math.max(maxima[stat.metric] || 0, stat.value);
  cards.forEach((card, index) => {
    const groups = Map.groupBy(card.stats, stat => stat.group);
    const statSections = [...groups].map(([group, rows]) => `<section class="stat-group"><h2>${escape(group.startsWith('Ability:') ? 'Ability charge' : group.startsWith('Ultimate:') ? 'Ultimate charge' : group.replaceAll('_',' '))}</h2><dl>${rows.map(stat => {
      const display = `${number(stat.value)}${stat.suffix || ''}`;
      const bar = ['health','movementSpeed','attackRange','damage','damagePerHit'].includes(stat.metric) && maxima[stat.metric] > 0;
      const pct = Math.max(0, Math.min(100, Math.round(stat.value / maxima[stat.metric] * 100)));
      return `<div class="stat-row"><dt>${escape(stat.label)}</dt><dd>${escape(display)}</dd>${bar ? `<div class="stat-track" aria-hidden="true"><span class="stat-fill fill-${pct}"></span></div>` : ''}</div>`;
    }).join('')}</dl></section>`).join('');
    const special = !card.stats.length ? `<p class="card-behavior-note">This card's behavior is described above; it has no unit or damage stats to display.</p>` : '';
    const behaviorNotes = card.behaviors?.length ? `<section class="card-behaviors"><h2>Triggers &amp; summons</h2><ul>${card.behaviors.map(note=>`<li>${escape(note)}</li>`).join('')}</ul></section>` : '';
    const gameplayNotes = card.notes?.length ? `<section class="card-behaviors"><h2>Card details</h2><ul>${card.notes.map(note=>`<li>${escape(note)}</li>`).join('')}</ul></section>` : '';
    const related = cards.filter(other => other.id !== card.id && other.faction === card.faction).slice(0,3);
    const previous = cards[(index+cards.length-1)%cards.length], next = cards[(index+1)%cards.length];
    pages.push([`units/${cardSlug(card.id)}`, `${card.name} · card stats`, `<a class="catalog-back" href="/units">&larr; All cards</a><section class="card-detail"><div class="detail-portrait">${image(card,false)}</div><div class="detail-overview"><p class="eyebrow">${escape(card.faction === 'Other' ? card.type : card.faction)}</p><h1>${escape(card.name)}</h1><div class="card-tags">${tags(card)}</div><p class="card-description">${escape(card.description)}</p><p class="base-stat-note">Base stats${card.tags.some(t=>t.endsWith(' units')) ? ' · squad members shown per unit' : ''}</p></div></section>${gameplayNotes}${behaviorNotes}<div class="detail-stats">${statSections}${special}</div><nav class="card-pagination" aria-label="Browse cards"><a href="${cardLink(previous)}">&larr; ${escape(previous.name)}</a><a href="/units">All cards</a><a href="${cardLink(next)}">${escape(next.name)} &rarr;</a></nav>${related.length ? `<section class="related-cards"><h2>More to explore</h2><div class="catalog-grid">${related.map(tile).join('')}</div></section>` : ''}`]);
  });
  return pages;
}
