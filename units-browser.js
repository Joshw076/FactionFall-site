import { filterCards } from './card-filter.js';
const grid = document.querySelector('#card-grid');
const search = document.querySelector('#card-search'), faction = document.querySelector('#card-faction'), type = document.querySelector('#card-type'), sort = document.querySelector('#card-sort');
const cards = [...grid.querySelectorAll('.catalog-card')].map(element => ({ element, name: element.dataset.name, search: element.dataset.search, faction: element.dataset.faction, type: element.dataset.type, mana: Number(element.dataset.mana) }));
const params = new URLSearchParams(location.search);
search.value = params.get('q') || '';
if ([...faction.options].some(option=>option.value===params.get('faction'))) faction.value=params.get('faction');
if ([...type.options].some(option=>option.value===params.get('type'))) type.value=params.get('type');
if ([...sort.options].some(option=>option.value===params.get('sort'))) sort.value=params.get('sort');
function update() {
  const visible = filterCards(cards, { search:search.value, faction:faction.value, type:type.value, sort:sort.value });
  const shown = new Set(visible);
  for (const card of cards) card.element.hidden = !shown.has(card);
  for (const card of visible) grid.append(card.element);
  document.querySelector('#card-count').textContent = `Showing ${visible.length} of ${cards.length} cards`;
  document.querySelector('#card-empty').hidden = visible.length > 0;
  const state = new URLSearchParams();
  for (const [key,value] of [['q',search.value.trim()],['faction',faction.value],['type',type.value],['sort',sort.value==='name'?'':sort.value]]) if(value)state.set(key,value);
  history.replaceState(null,'',location.pathname+(state.size?'?'+state:'')+location.hash);
}
for(const field of [search,faction,type,sort])field.addEventListener('input',update);
document.querySelector('#card-reset').addEventListener('click',()=>{search.value='';faction.value='';type.value='';sort.value='name';update();search.focus();});
document.querySelector('#card-filters').hidden=false;
update();
