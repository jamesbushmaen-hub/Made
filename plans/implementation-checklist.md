# FPS Game Implementation Checklist

Use this checklist to track implementation progress. Mark items with [x] when complete.

## Phase 1: Core Foundation
- [ ] Initialize project with Vite + TypeScript
- [ ] Install Babylon.js and dependencies
- [ ] Create index.html with canvas element
- [ ] Set up Engine.ts with Babylon.js initialization
- [ ] Create basic scene with skybox and ground
- [ ] Implement first-person camera
- [ ] Add WASD movement with velocity
- [ ] Add mouse look with configurable sensitivity
- [ ] Implement jump mechanics with gravity
- [ ] Implement crouch with camera height change
- [ ] Add collision detection with map geometry
- [ ] Create InputSystem.ts for keyboard/mouse abstraction

## Phase 2: Combat System
- [ ] Create Weapon base class with stats interface
- [ ] Implement shooting with raycasting
- [ ] Add recoil pattern (vertical + horizontal)
- [ ] Add weapon spread (hipfire vs ADS)
- [ ] Implement reload with timer
- [ ] Create ADS camera transition
- [ ] Add hit detection with damage calculation
- [ ] Implement damage falloff by distance
- [ ] Create weapon switching system
- [ ] Define 4 classes with weapon loadouts
- [ ] Add class selection UI

## Phase 3: Enemy AI
- [ ] Install Babylon.js navigation plugin
- [ ] Create navigation mesh for test map
- [ ] Create Enemy base class
- [ ] Implement pathfinding to player position
- [ ] Add enemy attack behavior (melee)
- [ ] Create BasicEnemy with rush behavior
- [ ] Create FastEnemy with speed boost
- [ ] Create TankEnemy with high health
- [ ] Create RangedEnemy with shooting
- [ ] Implement enemy spawn points
- [ ] Add enemy death and cleanup
- [ ] Prevent enemies walking through walls

## Phase 4: Wave Mode
- [ ] Create WaveSystem.ts
- [ ] Define wave progression configuration
- [ ] Implement wave spawning logic
- [ ] Add enemy count tracking
- [ ] Create wave complete detection
- [ ] Add between-wave timer
- [ ] Implement score system
- [ ] Create wave HUD display
- [ ] Add game over on player death
- [ ] Implement high score storage
- [ ] Create restart functionality

## Phase 5: Map and Environment
- [ ] Define map JSON format
- [ ] Create MapLoader.ts
- [ ] Build first map: warehouse
- [ ] Add lighting (directional + ambient)
- [ ] Place cover objects (crates, barrels)
- [ ] Configure spawn points for enemies
- [ ] Bake navigation mesh for map
- [ ] Add invisible boundaries
- [ ] Create simple map selection

## Phase 6: UI/HUD
- [ ] Create HUD container overlay
- [ ] Add health bar display
- [ ] Add armor bar display
- [ ] Create ammo counter
- [ ] Implement crosshair (customizable)
- [ ] Create main menu screen
- [ ] Add settings menu
- [ ] Implement sensitivity slider
- [ ] Add graphics quality options
- [ ] Create pause menu
- [ ] Build touch controls for mobile
- [ ] Add touch control customization
- [ ] Create class selection screen

## Phase 7: Polish
- [ ] Add weapon fire sounds
- [ ] Add reload sounds
- [ ] Add footstep sounds
- [ ] Add enemy sounds
- [ ] Create muzzle flash particles
- [ ] Add bullet impact particles
- [ ] Implement screen damage effect
- [ ] Add low health warning
- [ ] Implement view bobbing
- [ ] Add weapon sway
- [ ] Optimize for mobile
- [ ] Add loading screen

## Phase 8: Multiplayer
- [ ] Create NetworkSystem.ts
- [ ] Implement WebRTC peer connection
- [ ] Create GistSignaling.ts
- [ ] Implement room creation (gist creation)
- [ ] Implement room joining (gist reading)
- [ ] Add room code display/input UI
- [ ] Create lobby screen
- [ ] Sync player positions
- [ ] Sync player rotations
- [ ] Sync shooting events
- [ ] Sync hit/damage events
- [ ] Sync enemy spawns (host authority)
- [ ] Sync enemy positions
- [ ] Add player disconnect handling
- [ ] Implement host migration

## Phase 9: Deployment
- [ ] Configure Vite build for production
- [ ] Optimize asset loading
- [ ] Create PWA manifest.json
- [ ] Implement service worker
- [ ] Deploy to GitHub Pages
- [ ] Test on Android Chrome
- [ ] Test on Windows Chrome
- [ ] Test on Windows Firefox
- [ ] Performance profiling
- [ ] Final polish and bug fixes

---

## Quick Reference

### Key Files to Create
```
src/main.ts
src/core/Engine.ts
src/core/SceneManager.ts
src/core/AssetLoader.ts
src/entities/Player.ts
src/entities/Weapon.ts
src/entities/Enemy.ts
src/systems/InputSystem.ts
src/systems/PhysicsSystem.ts
src/systems/AISystem.ts
src/systems/WaveSystem.ts
src/systems/NetworkSystem.ts
src/ui/HUD.ts
src/ui/TouchControls.ts
```

### npm Dependencies
```json
{
  "@babylonjs/core": "^6.x",
  "@babylonjs/loaders": "^6.x",
  "@babylonjs/materials": "^6.x",
  "recast-detour": "latest"
}
```

### Dev Dependencies
```json
{
  "typescript": "^5.x",
  "vite": "^5.x",
  "@types/node": "^20.x"
}
```

### Run Commands
```bash
npm install        # Install dependencies
npm run dev        # Start dev server
npm run build      # Production build
npm run preview    # Preview production build
```
