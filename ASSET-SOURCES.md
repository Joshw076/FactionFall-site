# Game assets used on the website

All paths below identify the source assets. Website copies are isolated from Unity and the backend.

| Website copy | Source |
| --- | --- |
| `assets/brand/crest.png` | CardFall `Assets/Art/UI/Resources/UI/MenuKit/Crest.png`, the current main-menu shield |
| `assets/brand/arena.png` | CardFall `Assets/Art/UI/Resources/UI/MenuKit/BattleArena.png` |
| `assets/brand/backdrop.png` | CardFall `Assets/Art/UI/Resources/UI/MenuKit/Backdrop.png` |
| `assets/brand/CarterOne.ttf` | backend-auth `public/brand/CarterOne.ttf`, the Google sign-in wordmark font |
| `assets/brand/OFL-CarterOne.txt` | The font's accompanying license |
| `assets/characters/skitter.png` | Matched render from `ArtSources/Constructs/Skitter/Skitter.blend` |
| `assets/characters/rotball.png` | Matched render from approved `ArtSources/Constructs/Roster/577315a70bbc1614aa4c1bd69d1f2b39/Rotball.blend` |
| `assets/characters/bastion.png` | Matched render from the newer `ArtSources/Constructs/Roster/202ab13a386683e48a2677fb55d886b3/DesignReview/Bastion.blend` |

The three character portraits are rendered at 768 × 768 with the same three-quarter camera direction, studio-light arrangement, transparent background and normalized subject framing. Skitter is one representative model of the three-unit pack. `CardFall/Tools/Blender/website_character_renders.py` reproduces them, and `CardFall/Artifacts/WebsiteCharacters/RenderManifest.json` records source hashes and camera settings. Source Blender files remain byte-identical; no models, materials, rigs, animations, or game prefabs are changed.

Unit descriptions come from the corresponding `Assets/Resources/Cards` definitions. The standalone Google branding banner has not yet been located; the hero uses the verified crest, wordmark font, and game backdrop instead. No unapproved Plague Beast artwork or Study B models are included.

The build copies these assets to `dist/assets`. Images and fonts are served from the same origin, allowed explicitly by the existing restrictive Content Security Policy. No external fonts, image services, tracking, or analytics were added.

## Website card browser

The `/units` page and its 39 static detail pages use `assets/data/cards.json`, exported read-only from Unity's canonical `Assets/Resources/CardRegistry.asset` by `Assets/Editor/WebsiteCardCatalogExport.cs`. Health, movement, range, intervals, charge, spell stats and damage come from the app definitions and `CardDamageDetails.Read`, without assumed buffs. This is a build-time snapshot, not a live backend feed.

Refresh by running Unity's `CRR.EditorTools.WebsiteCardCatalogExport.Export`, then `node scripts/import-game-cards.mjs C:/Users/jjwil/CardFall` and `node build.mjs` here. The import preserves canonical IDs and numeric values. Most art uses the card's actual app portrait; Skitter Pack, Rotball and Bastion use the already reviewed website renders, including the new DesignReview Bastion. No Study B models are introduced. Cards without faction tribe metadata appear under Other rather than assigning a faction.

Search/filter/sort is progressive enhancement; every card and detail route is usable without JavaScript. No authentication, cookies, owned-card data or account requests are needed for this catalog. Preview changes remain local until deployed.

Card detail export now keeps each squad member's base, attack, contact, death damage and ultimate payload in one panel. The legacy `Pip and Spark` UnitDefinition is presented as Spark only within the Pip and Spark card; the source asset and gameplay names are preserved. Death and ultimate spawn effects are read from the authored SpawnUnitsEffectDefinition, including counts and spawned unit names. Damage still uses CardDamageDetails effect traversal and target multipliers, with projectile counts made explicit; it is not estimated DPS.
