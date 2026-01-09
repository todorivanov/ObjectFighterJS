# Changelog

All notable changes to Legends of the Arena will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [4.1.0] - 2026-01-09

### Added - Save System V2
- **Multiple Save Slots**: Manage up to 3 different character saves
- **Import/Export**: Download save files as JSON and import them back
- **Auto-Backup System**: Automatic backups (up to 5 per slot) before each save
- **Backup Restore**: Restore from any previous backup with timestamp selection
- **Data Compression**: LZ-String compression reduces save file size by ~60%
- **Version Migration**: Automatic migration of old save formats to new versions
- **Save Management Screen**: Dedicated UI for managing all save operations
- **Storage Info**: View localStorage usage and available space
- **Save Validation**: Integrity checks to prevent corrupted saves

### Added - Architecture Improvements
- **Router System**: Client-side routing with History API and route guards
- **State Management**: Centralized store with actions, reducers, and selectors
- **Enhanced AI System**: Behavior trees with personality-based decision making
- **Component Refactoring**: Extracted navigation, theme, and sound controls into reusable Web Components
- **SaveManagerAdapter**: Backward compatibility layer for gradual migration

### Added - New Components
- `NavigationBar`: Persistent navigation with Profile, Achievements, and Settings
- `ThemeToggle`: Dark/light mode toggle component
- `SoundToggle`: Sound on/off toggle component
- `SaveManagementScreen`: Full-featured save management interface

### Technical
- Added `lz-string` dependency for data compression
- Created `SaveManagerV2` with advanced features
- Implemented `Router` class for client-side navigation
- Added `Store` class with middleware and time-travel debugging
- Created `AIManager` with behavior tree support
- Added comprehensive documentation in `/docs` folder

### Changed
- Refactored `main-new.js` to use Router instead of imperative navigation
- Updated all navigation to use `router.navigate()` instead of direct function calls
- Settings screen now includes link to Save Management
- All 19 modules migrated from old `SaveManager` to `SaveManagerV2`
- Version bumped from 4.0.0 to 4.1.0

### Removed
- `src/utils/saveManager.js` - Replaced by SaveManagerV2
- `src/utils/SaveManagerAdapter.js` - No longer needed after direct migration

### Documentation
- Added `ROUTER_SYSTEM.md` - Router architecture and usage
- Added `STATE_MANAGEMENT.md` - Store pattern documentation
- Added `SAVE_SYSTEM_V2.md` - Save system features and API
- Added `AI_SYSTEM.md` - AI behavior tree documentation
- Added `COMPONENT_REFACTORING.md` - Component architecture guide
- Added `STORE_EXAMPLES.md` - Integration examples

## [4.0.0] - 2026-01-09

### Added - Major Features
- **10 Character Classes**: Balanced, Warrior, Tank, Glass Cannon, Bruiser, Mage, Assassin, Berserker, Paladin, Necromancer
- **Story Mode**: 25-mission campaign across 5 unique regions with star rating system
- **Gold Economy**: Currency system for buying, selling, and upgrading equipment
- **Marketplace System**: 
  - Equipment shop with rotating inventory (refreshes every 24 hours)
  - Force refresh option for 100 gold
  - Consumables shop for health and mana potions
  - Repair shop for damaged equipment
  - Sell tab for unwanted items
- **Equipment Durability**: Items degrade with use and require repairs
- **22 New Achievements**: For story mode completion and marketplace activities
- **Class-Specific Equipment**: Items with class requirements and compatibility indicators
- **Enhanced Profile Stats**: Comprehensive statistics tracking across all game modes

### Added - UI/UX Improvements
- Victory screen now has "Close & View Logs" button to review combat details
- Marketplace shows class compatibility indicators (✅/❌) for all items
- Story mode mission results with manual navigation button
- Class requirement badges with icons and color coding
- Duplicate item handling in sell tab
- Force refresh button in marketplace header

### Fixed
- Duplicate equipped items now show correctly in sell tab
- Selling items no longer refreshes the entire page
- Mission completion properly tracks player state
- Fighter class flags now persist correctly
- Curly quote syntax errors in data files
- Equipment durability calculations

### Changed
- Game rebranded from "ObjectFighterJS" to "Legends of the Arena"
- Version bumped from 3.x to 4.0.0
- Main menu buttons made smaller for better mobile display
- Equipment Manager renamed to use consistent naming
- Improved event handling with preventDefault/stopPropagation

### Technical
- Centralized game configuration in `GameConfig`
- Created comprehensive character class system with passive abilities
- Integrated achievement tracking across all systems
- Enhanced save system with new stats fields
- Improved Web Component architecture

## [3.0.0] - Previous Version

### Added
- Tournament Mode with bracket system
- Achievement System (22 achievements)
- Equipment System with rarity tiers
- Character progression and leveling
- Skill system with cooldowns
- Status effects and buffs/debuffs

### Changed
- Refactored combat system
- Improved UI design
- Enhanced save management

## [2.0.0] - Earlier Version

### Added
- Team battle mode
- Equipment drops
- Profile screen
- Settings system

## [1.0.0] - Initial Release

### Added
- Basic single combat system
- Character creation
- Turn-based combat
- Basic stats tracking

---

## Version History

- **4.0.0** - Story Mode, Marketplace, Classes Update
- **3.0.0** - Tournament & Achievement Update
- **2.0.0** - Team Battle & Equipment Update  
- **1.0.0** - Initial Release

[4.0.0]: https://github.com/todorivanov/ObjectFighterJS/releases/tag/v4.0.0
[3.0.0]: https://github.com/todorivanov/ObjectFighterJS/releases/tag/v3.0.0
[2.0.0]: https://github.com/todorivanov/ObjectFighterJS/releases/tag/v2.0.0
[1.0.0]: https://github.com/todorivanov/ObjectFighterJS/releases/tag/v1.0.0
