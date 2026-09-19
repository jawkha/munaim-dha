# House walkthroughs · 1084-A and Sahn House

An interactive design study built from the supplied architectural PDF plans and elevation renders.

- [Sahn House: new west-facing courtyard concept](https://jawkha.github.io/munaim-dha/concept/)
- [Furnished walkthrough](https://jawkha.github.io/munaim-dha/realistic/)
- [Original spatial model](https://jawkha.github.io/munaim-dha/original.html)

The furnished version adds pale stone, oak, textured fabrics, detailed seating, curtains, rugs, plants and daylight/evening moods. These are provisional visual choices to help inform design decisions.

## Explore

Choose a room to enter it at eye level. Drag to look; use WASD or arrow keys to walk. Switch floors with the sidebar. Dollhouse, Exterior and Plan views offer other ways to review the design. Furniture can be hidden. The distance tool gives approximate measurements from the PDF-traced model.

## Run locally

No build step or dependency installation is needed. From this repository:

```sh
python3 -m http.server 8765 --directory site
```

Open http://localhost:8765/ in a WebGL-capable browser. All runtime assets are served locally from this repository.

## Validation

`node scripts/validate-model.mjs` checks all 33 room entry points, 800 stair support/collision samples in both directions, and basic movement. It uses the shipped geometry with a stubbed browser renderer. The same check runs before deployment.

## Deployment

GitHub Actions publishes `site/` to GitHub Pages on pushes to `main`. In repository Settings → Pages, the source is GitHub Actions. Relative URLs support the `/munaim-dha/` project path.

## Files

- `site/realistic/`: furnished experience, materials, lights and furniture integration.
- `site/original.html`, `site/app.js`, `site/model.js`: original spatial study.
- `site/assets/`: local Three.js modules, source-plan image extracts, reference renders and visual assets.
- `.github/workflows/pages.yml`: Pages deployment.

## Model basis and limits

The model is scaled from PDF sheets; it is not a CAD/BIM model. The 50 × 90 ft plot, room boundaries and levels are based on the supplied drawings. Openings, façade details and stair geometry are approximate. The external spiral stair is schematic. Furniture is visual only and does not block navigation. Sunlight and lamps illustrate mood, not a daylight or photometric analysis. Services, beam drops, reinforcement and structural adequacy are not evaluated. The structural drawing set was marked NOT FOR CONSTRUCTION.

The original drawings govern dimensions. Review any proposed changes and stair headroom with the architect before construction.

## Credits

See [asset credits](site/assets/realism/CREDITS.md) and [Three.js MIT license](site/assets/THREE-LICENSE.txt). Sofa attribution and material changes are also included in the walkthrough's Drawings & assumptions panel. The furnished model contains CC0 and CC BY 4.0 assets; those licenses do not apply to the user's architectural design or source drawings.

## Sahn House: original design concept

`site/concept/` is an independent 50 × 90 ft design, not a revision traced from the previous blueprint. It accommodates seven family members and three staff: grandparents downstairs; parents, three children and a guest bedroom upstairs; two staff rooms beside an open basement lightwell. It includes a pool court, an independent basement escape stair, a step-free entrance ramp, and a working solar roof.

The west-facing orientation and DHA Peshawar jurisdiction are assumptions pending confirmation. Design choices and primary research links are in its Design notes panel. The energy panel includes adjustable cooling scenarios and stored PVGIS estimates. **Full off-grid operation is not established:** the default load exceeds annual generation after assumed storage losses. No structural, seismic, MEP or approval claim is made.

Run `node --loader ./scripts/three-loader.mjs scripts/validate-concept.mjs` to check the actual concept geometry: room spawns, room reachability, stairs in both directions, setbacks, pool exclusion and PV module count. No npm installation is required. Furnishings are visual and do not block walking; walls, glazing, railings and pool boundaries do. Lighting illustrates mood and is not a sun/shadow or daylight simulation.

### Sahn House interiors

The concept includes room-specific wall, flooring, joinery and textile palettes, complete furnishings for family and staff spaces, task and bedside lighting, curtains, rugs, artwork, ceiling fans, kitchen and laundry fittings, and outdoor furniture. Open **Interiors** to review each space's colour swatches and furnishings, then enter that room directly. The Furnished switch hides movable furniture and dressings while retaining architectural finishes.

The finish schedule is in `site/concept/interior-design.js`; procedural furniture and placement are in `interiors.js`. Static furniture is batched by material for rendering, with transparent objects kept separate. Colours are illustrative and require physical samples before specification.

`node --loader ./scripts/three-loader.mjs scripts/validate-interiors.mjs` checks finish coverage, room boundaries, furniture overlap, door openings and entry viewpoints. It also verifies that render batching preserves geometry. These are model checks, not building-code, accessibility or furniture-procurement certification.
