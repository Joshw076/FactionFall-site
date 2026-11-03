import { readFile, writeFile, mkdir, copyFile } from 'node:fs/promises';
import { resolve, dirname, extname, relative, isAbsolute } from 'node:path';
import { fileURLToPath } from 'node:url';
import { cardSlug } from '../units-pages.mjs';
const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const game = resolve(process.argv[2] || '../../../CardFall');
const catalog = JSON.parse(await readFile(resolve(game,'Library/WebsiteCards.json'),'utf8'));
if (!catalog.depth || catalog.cards.some(card=>!card.displayRows || !card.layers)) throw new Error('Refresh the Unity website export first: current detail rows and depth layers are required.');
await mkdir(resolve(root,'assets/cards'),{recursive:true});
await mkdir(resolve(root,'assets/data'),{recursive:true});
const files = new Map();
async function asset(path, name) {
  const source = resolve(game,path), rel=relative(game,source);
  if (rel.startsWith('..') || isAbsolute(rel)) throw new Error('Asset outside game: '+path);
  if(files.has(source))return files.get(source);
  const file=name+extname(source).toLowerCase();
  const url='/assets/cards/'+file;
  await copyFile(source,resolve(root,'assets/cards',file));
  files.set(source,url); return url;
}
for (const card of catalog.cards) {
  const slug=cardSlug(card.id);
  card.image=card.portrait ? await asset(card.portrait,slug) : '/assets/brand/crest.png';
  for(const key of ['foreground','background','frame','costIndicator','ultimateCrest'])
    if(card[key])card[key+'Image']=await asset(card[key],slug+'-'+key);
  for(const plane of card.layers) {
    if(!plane.path)throw new Error('Missing depth plane: '+card.id+'/'+plane.id);
    plane.image=await asset(plane.path,slug+'-depth-'+cardSlug(plane.id));
  }
}
for(const file of ['Nunito-SemiBold.ttf','Nunito-Bold.ttf','OFL.txt']) await copyFile(resolve(game,'Assets/Art/UI/Resources/Fonts/Nunito',file),resolve(root,'assets/brand',file==='OFL.txt'?'OFL-Nunito.txt':file));
await writeFile(resolve(root,'assets/data/cards.json'),JSON.stringify(catalog,null,2)+'\n');
console.log(`Imported ${catalog.cards.length} released cards, ${catalog.cards.reduce((sum,c)=>sum+c.layers.length,0)} depth planes and exact game detail rows.`);
