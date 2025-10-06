# Ionicons Not Loading - Fix Guide

## Problem
Console shows: `[Ionicons Warning]: Could not load icon with name "home-outline"`

## Root Cause
The app is using Ionicons from `@ionic/angular/standalone` but the icons aren't being loaded properly because the SVG path configuration is missing.

## Solution Options

### Option 1: Quick Fix - Use CDN (Recommended for Development)
Add this to `src/index.html` inside the `<head>` section:

```html
<head>
  ...
  <!-- Ionicons CDN -->
  <script type="module" src="https://unpkg.com/ionicons@7.1.0/dist/ionicons/ionicons.esm.js"></script>
  <script nomodule src="https://unpkg.com/ionicons@7.1.0/dist/ionicons/ionicons.js"></script>
</head>
```

### Option 2: Configure Asset Path (Production)
Add this to `src/main.ts` before bootstrapping:

```typescript
import { bootstrapApplication } from '@angular/platform-browser';
import { provideIonicAngular } from '@ionic/angular/standalone';

bootstrapApplication(AppComponent, {
  providers: [
    provideIonicAngular({
      mode: 'md',
      animated: true
    }),
    // ... other providers
  ]
});
```

Then ensure `node_modules/ionicons/dist/` is copied to assets during build in `angular.json`:

```json
"assets": [
  "src/assets",
  {
    "glob": "**/*",
    "input": "node_modules/ionicons/dist/ionicons/svg",
    "output": "./svg"
  }
]
```

### Option 3: Import Individual Icons (Most Control)
Install and configure icon registry:

```bash
npm install ionicons
```

Create `src/app/core/icons/icon-registry.ts`:

```typescript
import { addIcons } from 'ionicons';
import {
  homeOutline,
  peopleOutline,
  documentTextOutline,
  medicalOutline,
  flaskOutline,
  arrowBackOutline,
  // ... add all icons you use
} from 'ionicons/icons';

export function registerIcons() {
  addIcons({
    'home-outline': homeOutline,
    'people-outline': peopleOutline,
    'document-text-outline': documentTextOutline,
    'medical-outline': medicalOutline,
    'flask-outline': flaskOutline,
    'arrow-back-outline': arrowBackOutline,
    // ... register all icons
  });
}
```

Call in `src/main.ts`:
```typescript
import { registerIcons } from './app/core/icons/icon-registry';
registerIcons();
```

## Recommended: Quick Fix (Option 1)
For now, use the CDN method - it's the fastest way to get icons working.

## Current Status
- Icons are referenced correctly in HTML with `<ion-icon name="...">`
- The SVG loading path is not configured
- This doesn't affect functionality, just icon display
