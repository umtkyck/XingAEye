# XingAEye Assets Guide

This document describes the logos, icons, and assets used in the XingAEye project.

## Logo Design

The XingAEye logo features:
- 🚂 A stylized train representing railroad crossings
- ⚠️ A red alert badge symbolizing safety monitoring
- 🔵 Blue primary color (#2563eb) representing trust and technology

## Web Assets

### Favicon
Location: `web/public/favicon.svg`
- Size: 32x32px
- Format: SVG (scalable)
- Used in browser tabs

### Logo
Location: `web/public/logo.svg`
- Size: 512x512px
- Format: SVG
- Used in website header and branding

### Apple Touch Icon
Location: `web/public/apple-touch-icon.svg`
- Size: 180x180px
- Format: SVG
- Used when adding to iOS home screen

### Open Graph Image
Location: `web/public/og-image.svg`
- Size: 1200x630px
- Format: SVG
- Used for social media sharing (Facebook, LinkedIn, etc.)

### Manifest
Location: `web/public/manifest.json`
- PWA manifest file
- Defines app appearance when installed
- Includes icon references and theme colors

## Mobile Assets

### App Icon
Location: `mobile/assets/icon.png.svg`
- Size: 1024x1024px
- Format: SVG (to be converted to PNG)
- Used as main app icon

### Adaptive Icon (Android)
Location: `mobile/assets/adaptive-icon.png.svg`
- Size: 1024x1024px with safe zone
- Format: SVG (to be converted to PNG)
- Used for Android adaptive icons

### Splash Screen
Location: `mobile/assets/splash.png.svg`
- Size: 1284x2778px (iPhone 14 Pro Max)
- Format: SVG (to be converted to PNG)
- Shown when app launches

### Notification Icon
Location: `mobile/assets/notification-icon.png.svg`
- Size: 96x96px
- Format: SVG (to be converted to PNG)
- Used for push notifications (especially Android)

## Converting SVG to PNG

For mobile assets that need PNG format:

```bash
# Install ImageMagick or use online converter
# Example with ImageMagick:

# App icon
convert -background none -resize 1024x1024 mobile/assets/icon.png.svg mobile/assets/icon.png

# Adaptive icon
convert -background none -resize 1024x1024 mobile/assets/adaptive-icon.png.svg mobile/assets/adaptive-icon.png

# Splash screen
convert -background none -resize 1284x2778 mobile/assets/splash.png.svg mobile/assets/splash.png

# Notification icon
convert -background none -resize 96x96 mobile/assets/notification-icon.png.svg mobile/assets/notification-icon.png
```

Alternatively, use online tools:
- https://cloudconvert.com/svg-to-png
- https://svgtopng.com/

## Color Palette

### Primary Colors
- **Primary Blue**: #2563eb (rgb(37, 99, 235))
- **Dark Blue**: #1e40af (rgb(30, 64, 175))
- **Light Blue**: #60a5fa (rgb(96, 165, 250))

### Alert Colors
- **Critical**: #ef4444 (rgb(239, 68, 68))
- **Warning**: #f97316 (rgb(249, 115, 22))
- **Success**: #10b981 (rgb(16, 185, 129))

### Neutral Colors
- **Dark Gray**: #1f2937 (rgb(31, 41, 55))
- **Medium Gray**: #6b7280 (rgb(107, 114, 128))
- **Light Gray**: #f3f4f6 (rgb(243, 244, 246))
- **White**: #ffffff (rgb(255, 255, 255))

## Usage Guidelines

### Logo Usage
- Always maintain aspect ratio
- Minimum size: 32px for favicon, 180px for standard logo
- Use on light backgrounds for best visibility
- Maintain clear space around logo (equal to height of "!")

### Color Usage
- Primary blue for main actions and branding
- Red alert badge for critical notifications only
- Maintain sufficient contrast for accessibility (WCAG AA minimum)

### Icon Sizes

#### Web
- Favicon: 16x16, 32x32, 48x48
- Apple Touch: 180x180
- Android Chrome: 192x192, 512x512
- Open Graph: 1200x630

#### Mobile
- iOS App Icon: 1024x1024
- Android App Icon: 1024x1024
- Splash Screen: Various sizes for different devices
- Notification Icon: 96x96

## Branding

### Typography
- Primary Font: Inter (sans-serif)
- Fallback: System UI fonts

### Voice & Tone
- Professional yet approachable
- Safety-focused
- Technology-forward
- Clear and direct

## Updating Assets

When updating any asset:

1. Edit the SVG source file
2. Test in browser/app
3. Generate PNG versions if needed
4. Update this documentation
5. Commit changes with clear message

Example:
```bash
git add web/public/logo.svg
git commit -m "Update logo with improved contrast"
```

## Accessibility

All assets should:
- Have sufficient color contrast (4.5:1 minimum for normal text)
- Include alt text when used as images
- Be recognizable in both light and dark modes
- Work in monochrome for notifications

## License

All XingAEye assets are proprietary and copyright © XingAEye Team.
Not to be used without permission.
