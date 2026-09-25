# 3rd World — a cinematic space adventure (three.js)

*Helping others gives us the strength to save the people we love.*

Mother depends on an oxygen machine. Three black holes lead to three worlds. Help the
people in each world to earn an Oxygen Core, then fly home and save her.

## Run

```bash
npm install
npm run dev          # game:  http://localhost:5191/astra/
                     # admin: http://localhost:5191/astra/admin.html
npm run build        # outputs dist/astra/
```

Dev shortcut: `/astra/?dev=home|space|farm|knowledge|hunger` jumps straight into a world as a test player.

## Controls

| | |
|---|---|
| WASD / arrows | walk · drive · fly |
| Mouse (click to capture) or drag | look / steer |
| Shift | run / boost |
| E | interact, advance dialogue |
| Space / C | lift off · rise / sink in space |
| 1–4 | dialogue choices |
| Tab · Esc · M | inventory · pause · mute |
| VR | an **Enter VR** button appears on WebXR headsets (left stick moves, right stick turns, trigger interacts) |

## The journey

Home (Mother, the machine, the mission) → walk out → car → drive and lift off → Space Hub →
**Black Hole 01: Farm World** (Harvest Day) · **02: Knowledge World** (Share Knowledge — teach
four children) · **03: Hunger World** (Feed the World — gather fallen branches, driftwood and stones (no tree cutting), repair the dock, fish, cook,
deliver) → 3 / 3 cores → Home is calling → land → insert the cores → dinner with Mother → final wide shot.

## Look

The hand-painted style is procedural, with no image assets. It uses toon ramps, sun-banded
"paint" shading on foliage, soft billboard cumulus, wind-blown instanced grass and wheat,
snow-capped mountains and a Kuwahara brush-stroke post filter (you can toggle it in the
pause menu). A cinematic pass adds gravitational lensing, warp streaks, vignette and grain.

## Architecture (`astra/src`)

| Folder | Contents |
|---|---|
| `core/` | Engine (renderer, post passes, WebXR), Input, AudioSys (procedural music and SFX), SaveSystem, noise |
| `systems/` | CharacterController + NPCs, VehicleController, Dialogue, Missions (inventory and rewards), Interactions and markers, Cinematic camera, physics |
| `world/` | Environment kit (sky, clouds, grass, trees, mountains, water, mirror lake), cosmic kit (black holes, nebula, planets, rings), architecture helpers |
| `scenes/` | `base.js` (WorldManager base), `home`, `space`, `farm`, `knowledge`, `hunger`, `common` (arrival, core reward, leaving). Each world is lazily imported and disposed |
| `ui/` | HUD, overlays (fades, letterbox, title cards, warp streaks), entry screen, in-headset XR panel |
| `data/content.js` | All editable content: worlds, missions, NPCs, characters, rewards |
| `admin/` | A separate admin console for players, progression, content and import/export |

Progress and admin overrides persist in `localStorage` (`astra.players.v1`, `astra.config.v1`).
