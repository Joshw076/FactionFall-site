export function filterCards(cards, { search = '', faction = '', type = '', sort = 'name' } = {}) {
  const words = search.trim().toLowerCase().split(/\s+/).filter(Boolean);
  return cards.filter(card => (!faction || card.faction === faction) && (!type || card.type === type) && words.every(word => card.search.includes(word)))
    .sort((a,b) => sort === 'mana' ? a.mana-b.mana || a.name.localeCompare(b.name) : sort === 'mana-desc' ? b.mana-a.mana || a.name.localeCompare(b.name) : a.name.localeCompare(b.name));
}
