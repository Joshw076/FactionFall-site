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

The `/units` gallery and its 55 detail pages use only released cards from Unity's canonical `Assets/Resources/CardRegistry.asset`. The snapshot is exported by `Assets/Editor/WebsiteCardCatalogExport.cs`; no gameplay definitions or balance values are modified.

Detail notes, section headings, displayed values, attack timing and comparison-bar percentages are produced by the same `CardsPanelView.RenderGameplayStats` method used by both the collection and deck inspector. The website does not reconstruct spell delivery enums or squad formations. This preserves the game's player-facing spell delivery, radius, duration, travel speed, swarm count/per-unit explanation, and Pip/Spark member labels. Descriptions and tags also come from the app definitions. Frame purchases, ownership and account controls are excluded.

Artwork uses the game's current neutral frame shapes, outline-free neutral mana gems, faction backgrounds, art-window polygons and all 146 semantic foreground planes from `UI/CardArtworkDepthCatalog`. The catalog points to generated layers authored from `Tools/CardIllustrations/detail-layer-plan.json`; neither the layer plan nor the artwork is edited by this website import. Hover tilt and differential layer movement use the exported `CardDepthSettings` values. The website applies the same overscan and per-plane parallax, with a CSS perspective presentation. Popout planes have a separate mask above the top edge. This is a browser implementation of the game's visual treatment, not the Unity renderer.

Typography uses the existing Carter One and Bangers copies, plus the game's Nunito SemiBold/Bold files and accompanying OFL license. All assets are served locally with the existing restrictive Content Security Policy; no third-party scripts, sensors, authentication or analytics are required.

Refresh:

1. Run `CRR.EditorTools.WebsiteCardCatalogExport.Export` in Unity (or the existing `websitecardexport` editor command).
2. Run `node scripts/import-game-cards.mjs C:/Users/jjwil/CardFall` here.
3. Run `node --test` and `node build.mjs`.
4. Run `node preview.mjs` to review at `http://127.0.0.1:4173/units`.

The importer requires the current display-row/depth schema, preserves released IDs, checks asset paths stay inside the game checkout, and deduplicates shared textures. Re-export after game detail or artwork changes. This is a build-time snapshot, not a live backend feed.

Without JavaScript, the gallery, artwork, card links and detail stats remain available. Hover movement uses only pointer input, settles on exit, and stops under reduced-motion preferences. Touch scrolling is not intercepted. Filters and sorting remain progressive enhancements.

`Artifacts/CardWebsite/Checks.txt` records local asset parity and browser verification. The gallery and left/right tilt captures, spell and mixed-squad detail captures, and 390px mobile layouts are saved beside it. These checks cover local Edge rendering and responsive layout, not production deployment or a physical phone. Changes remain local until deployed.