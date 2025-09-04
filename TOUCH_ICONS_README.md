# MinistryBag Touch Icons

This directory contains the touch icon files for MinistryBag mobile apps.

## Icon Files Needed

The following PNG files need to be generated from `ministrybag-icon.svg`:

### Apple Touch Icons
- `apple-touch-icon.png` (180x180)
- `apple-touch-icon-152x152.png`
- `apple-touch-icon-144x144.png`
- `apple-touch-icon-120x120.png`
- `apple-touch-icon-114x114.png`
- `apple-touch-icon-76x76.png`
- `apple-touch-icon-72x72.png`
- `apple-touch-icon-60x60.png`
- `apple-touch-icon-57x57.png`

### Android Icons
- `android-chrome-192x192.png`
- `android-chrome-512x512.png`

### Windows Tile Icons
- `mstile-144x144.png`

## How to Generate PNG Files

You can use online tools or command-line tools to convert the SVG to PNG:

### Online Tools
1. Go to https://convertio.co/svg-png/ or similar
2. Upload `ministrybag-icon.svg`
3. Set the output size to 180x180
4. Download and rename to `apple-touch-icon.png`
5. Repeat for other sizes

### Command Line (if you have ImageMagick)
```bash
convert ministrybag-icon.svg -resize 180x180 apple-touch-icon.png
convert ministrybag-icon.svg -resize 152x152 apple-touch-icon-152x152.png
convert ministrybag-icon.svg -resize 144x144 apple-touch-icon-144x144.png
convert ministrybag-icon.svg -resize 120x120 apple-touch-icon-120x120.png
convert ministrybag-icon.svg -resize 114x114 apple-touch-icon-114x114.png
convert ministrybag-icon.svg -resize 76x76 apple-touch-icon-76x76.png
convert ministrybag-icon.svg -resize 72x72 apple-touch-icon-72x72.png
convert ministrybag-icon.svg -resize 60x60 apple-touch-icon-60x60.png
convert ministrybag-icon.svg -resize 57x57 apple-touch-icon-57x57.png
convert ministrybag-icon.svg -resize 192x192 android-chrome-192x192.png
convert ministrybag-icon.svg -resize 512x512 android-chrome-512x512.png
convert ministrybag-icon.svg -resize 144x144 mstile-144x144.png
```

## What These Icons Do

- **Apple Touch Icons**: Appear when users add your website to their iPhone/iPad home screen
- **Android Icons**: Appear when users add your website to their Android home screen
- **Windows Tile Icons**: Appear when users pin your website to their Windows start menu

The icons feature the MinistryBag satchel logo with a cross symbol, representing the ministry focus of the tools.
