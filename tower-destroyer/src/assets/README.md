# Tower Destroyer Assets

This directory should contain the following assets:

## Required Assets

- `icon.png` - App icon (1024x1024)
- `splash.png` - Splash screen (1284x2778)
- `adaptive-icon.png` - Android adaptive icon (1024x1024)
- `favicon.png` - Web favicon (32x32)

## Game Assets (Future)

- `weapons/laser.png` - Laser weapon sprite
- `weapons/bomb.png` - Bomb weapon sprite
- `weapons/gun.png` - Gun weapon sprite
- `weapons/rocket.png` - Rocket weapon sprite
- `towers/player-tower.png` - Player tower sprite
- `towers/enemy-tower.png` - Enemy tower sprite
- `effects/explosion.png` - Explosion effect
- `effects/hit.png` - Hit effect

## Creating Placeholder Assets

For development, you can create simple colored squares as placeholders:

```bash
# Using ImageMagick
convert -size 1024x1024 xc:#6c5ce7 icon.png
convert -size 1284x2778 xc:#1a1a2e splash.png
convert -size 1024x1024 xc:#6c5ce7 adaptive-icon.png
convert -size 32x32 xc:#6c5ce7 favicon.png
```
