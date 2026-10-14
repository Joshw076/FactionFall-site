# Game assets used on the website

All paths below identify the source assets. Website copies are isolated from Unity and the backend.

| Website copy | Source |
| --- | --- |
| `assets/brand/crest.png` | CardFall `Assets/Art/UI/Resources/UI/MenuKit/Crest.png`, the current main-menu shield |
| `assets/brand/arena.png` | CardFall `Assets/Art/UI/Resources/UI/MenuKit/BattleArena.png` |
| `assets/brand/backdrop.png` | CardFall `Assets/Art/UI/Resources/UI/MenuKit/Backdrop.png` |
| `assets/brand/CarterOne.ttf` | backend-auth `public/brand/CarterOne.ttf`, the Google sign-in wordmark font |
| `assets/brand/OFL-CarterOne.txt` | The font's accompanying license |
| `assets/characters/skitter.png` | CardFall `Assets/Art/Constructs/Portraits/Skitter Pack.png` |
| `assets/characters/rotball.png` | Approved Rotball `Artifacts/RotballReview/20261013-UndeadPalette/Rotball-UndeadPalette-Quarter.png` |
| `assets/characters/bastion.png` | CardFall `Artifacts/Blender/Review/Bastion/Bastion-Idle-Quarter-00.png` |

Unit descriptions come from the corresponding `Assets/Resources/Cards` definitions. The standalone Google branding banner has not yet been located; the hero uses the verified crest, wordmark font, and game backdrop instead. No unapproved Plague Beast artwork or Study B models are included.

The build copies these assets to `dist/assets`. Images and fonts are served from the same origin, allowed explicitly by the existing restrictive Content Security Policy. No external fonts, image services, tracking, or analytics were added.
