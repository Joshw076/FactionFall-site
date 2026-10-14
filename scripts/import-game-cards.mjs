import { readFile, writeFile, mkdir, copyFile } from 'node:fs/promises';
import { resolve, dirname, extname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { cardSlug } from '../units-pages.mjs';
const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const game = resolve(process.argv[2] || '../../../CardFall');
const catalog = JSON.parse(await readFile(resolve(game,'Library/WebsiteCards.json'),'utf8'));
await mkdir(resolve(root,'assets/cards'),{recursive:true});
await mkdir(resolve(root,'assets/data'),{recursive:true});
for (const card of catalog.cards) {
  if (card.portrait) {
    const source = resolve(game,card.portrait);
    if (!source.startsWith(game + '\\') && !source.startsWith(game + '/')) throw new Error('Portrait outside game: '+card.id);
    const file = cardSlug(card.id)+extname(source).toLowerCase();
    await copyFile(source,resolve(root,'assets/cards',file));
    card.image = '/assets/cards/'+file;
  } else card.image = '/assets/brand/crest.png';
  for (const key of ['foreground','background','frame','costIndicator','ultimateCrest']) {
    if (!card[key]) continue;
    const file = cardSlug(card.id)+'-'+key+extname(card[key]).toLowerCase();
    await copyFile(resolve(game,card[key]),resolve(root,'assets/cards',file));
    card[key+'Image'] = '/assets/cards/'+file;
  }
}
await writeFile(resolve(root,'assets/data/cards.json'),JSON.stringify(catalog,null,2)+'\n');
console.log(`Imported ${catalog.cards.length} cards from the game registry.`);
