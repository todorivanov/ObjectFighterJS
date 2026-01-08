# Migration Guide - ObjectFighterJS v2.0

## What Changed?

This guide covers the migration from ObjectFighterJS v1.0 to v2.0, which includes a complete modernization of the tech stack.

## Technology Updates

### Build System
- **Old**: Webpack 3 + Babel 6
- **New**: Vite 5 (10x faster builds, instant HMR)

### Dependencies Removed
- ❌ jQuery 3.2.1
- ❌ Bootstrap 3.3.7
- ❌ Babel presets (es2015, react)

### Dependencies Added
- ✅ Bootstrap 5.3.3 (modern, better mobile support)
- ✅ Vite 5.4.11 (lightning-fast dev server)
- ✅ ESLint 9 + Prettier 3 (code quality)
- ✅ Native ES modules (no transpilation needed)

## File Changes

### New Files Created
- `src/main.js` - New entry point (replaces `src/index.js`)
- `vite.config.js` - Vite configuration
- `eslint.config.js` - ESLint configuration
- `.prettierrc` - Code formatting rules
- `.gitignore` - Git ignore patterns

### Modified Files
- `package.json` - Updated dependencies and scripts
- `index.html` - Simplified, now uses ES modules
- `src/utils/logger.js` - Removed jQuery, uses vanilla JS
- `src/index.css` - Updated for Bootstrap 5, modern styling

### Deleted Files
- `webpack.config.js` - No longer needed (using Vite)
- `src/index.js` - Replaced by `src/main.js`

## Breaking Changes

### jQuery Removal
All jQuery (`$`) usage has been replaced with vanilla JavaScript:

**Before:**
```javascript
$('.container').html('');
$('#log').append(message);
$('.fighter').on('click', handler);
```

**After:**
```javascript
document.querySelector('.container').innerHTML = '';
document.querySelector('#log').insertAdjacentHTML('beforeend', message);
document.querySelector('.fighter').addEventListener('click', handler);
```

### Bootstrap Grid Updates
Bootstrap 3 grid classes have been updated to Bootstrap 5:

**Before:**
```html
<div class="col-xs-6">...</div>
<div class="col-xs-2">...</div>
```

**After:**
```html
<div class="col-6">...</div>
<div class="col-2">...</div>
```

### Module Imports
All JavaScript files now use ES6 module syntax. Imports must include `.js` extension:

**Before:**
```javascript
import Game from './game/game';
```

**After:**
```javascript
import Game from './game/game.js';
```

## New NPM Scripts

### Development
```bash
npm run dev          # Start Vite dev server (http://localhost:3000)
npm run build        # Build for production
npm run preview      # Preview production build
```

### Code Quality
```bash
npm run lint         # Check code for errors
npm run format       # Auto-format code with Prettier
npm run format:check # Check if code is formatted
```

## Migration Steps (If Updating Existing Project)

1. **Backup your project**
   ```bash
   git commit -am "Backup before v2.0 migration"
   ```

2. **Remove old dependencies**
   ```bash
   rm -rf node_modules package-lock.json
   ```

3. **Install new dependencies**
   ```bash
   npm install
   ```

4. **Start dev server**
   ```bash
   npm run dev
   ```

5. **Test all game modes**
   - Single fight mode
   - Team match mode
   - Drag & drop functionality
   - Combat log display

## Improved Features

### Performance
- **Dev server starts in <1s** (was ~10s with Webpack)
- **Hot Module Replacement (HMR)** - instant updates without refresh
- **Smaller bundle size** - tree-shaking removes unused code

### Developer Experience
- **ESLint** catches errors before runtime
- **Prettier** ensures consistent code style
- **Modern JavaScript** - use latest ES2022+ features

### UI/UX Improvements
- **Responsive design** - works on mobile devices
- **Modern gradient background** - purple/blue theme
- **Hover effects** on fighter cards
- **Auto-scrolling combat log** - always see latest action
- **Better typography** - system font stack
- **Smooth transitions** - CSS animations throughout

## Known Issues

### Security Warnings
Running `npm install` may show 2 moderate vulnerabilities. These are in dev dependencies and don't affect production. To fix:
```bash
npm audit fix
```

### Image Loading
The fighter images use external CDN URLs that may be broken. Consider:
- Using local images in `/public/images/`
- Using a placeholder image service
- Implementing fighter avatars

## Next Steps

Now that Phase 1.1 is complete, the codebase is ready for:
- **Phase 1.2**: Architecture refactoring (state management)
- **Phase 2**: Bug fixes and code quality improvements
- **Phase 3**: Gameplay enhancements (player control, skills)
- **Phase 4**: UI/UX overhaul (animations, sound)
- **Phase 5**: Save system and progression

## Getting Help

If you encounter issues:
1. Check that Node.js version is 18+ (`node --version`)
2. Clear browser cache (Ctrl+Shift+Delete)
3. Check browser console for errors (F12)
4. Ensure all files have `.js` extensions in imports

## Rollback Plan

If you need to revert to v1.0:
```bash
git revert HEAD
npm install
npm run webpack
```

---

**Version**: 2.0.0  
**Date**: January 2026  
**Author**: Todor Ivanov
