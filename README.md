# ObjectFighterJS v2.0 ⚔️

A browser-based fighting game where objects battle each other in epic turn-based combat.

## 🎮 Game Modes

### Single Match
Select two fighters and watch them battle in a 1v1 arena.

### Team Match
Drag & drop multiple fighters into two teams and witness an epic team battle.

## ✨ Features

### Combat System
- **Normal Attacks**: Standard damage with 90% hit chance
- **Special Attacks**: High damage critical strikes with 20% chance
- **Consumables**: Potions and food that randomly appear during battle
- **Miss Chance**: 10% chance to miss any attack

### Dynamic Events
Random events can occur during battles:
- **Earthquake**: Damages all fighters (-100 HP)
- **Full Moon**: Wild animals attack one team (-50% HP)
- **Poisoned Food**: Continuous damage over 5 rounds (-20 HP/round)

### Fighters
Choose from 5 unique fighters with different stats:
- **Gosho**: Well-balanced fighter (1000 HP, 10 STR)
- **Ivan**: High damage, low health (800 HP, 20 STR)
- **Petar**: Balanced with slight offense (900 HP, 11 STR)
- **Jivko**: Tank with massive HP (2000 HP, 4 STR)
- **Bobba**: Durable with decent stats (1500 HP, 6 STR)

## 🚀 Quick Start

### Installation
```bash
npm install
```

### Development
```bash
npm run dev
# Opens at http://localhost:3000
```

### Production Build
```bash
npm run build
npm run preview
```

## 🛠️ Technology Stack

- **Build Tool**: Vite 5 (⚡ lightning fast)
- **UI Framework**: Bootstrap 5
- **Language**: Modern JavaScript (ES2022+)
- **Code Quality**: ESLint + Prettier

## 📝 NPM Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Build for production |
| `npm run preview` | Preview production build |
| `npm run lint` | Check code quality |
| `npm run format` | Auto-format code |

## 🎯 How to Play

1. **Choose Game Mode**: Select Single Fight or Team Match
2. **Select Fighters**: 
   - Single: Click two fighters to battle
   - Team: Drag & drop fighters into Team One and Team Two
3. **Start Fight**: Click "Start Fight" button
4. **Watch the Battle**: Combat is automatic with real-time log
5. **Victory**: Last fighter/team standing wins!

## 📚 Documentation

- **[Migration Guide](MIGRATION_GUIDE.md)**: Upgrading from v1.0 to v2.0
- **[Phase 1.1 Complete](PHASE_1.1_COMPLETE.md)**: Modernization details

## 🔄 Recent Updates (v2.0)

### Performance
- **17x faster** dev server startup (10s → 0.57s)
- **10x faster** production builds
- Instant hot module replacement

### Code Quality
- Migrated from jQuery to vanilla JavaScript
- Updated from Webpack 3 to Vite 5
- Added ESLint and Prettier
- Zero build warnings or errors

### UI/UX
- Modern gradient design
- Responsive layout (mobile-friendly)
- Smooth animations and transitions
- Auto-scrolling combat log

## 📦 Project Structure

```
ObjectFighterJS/
├── src/
│   ├── api/
│   │   └── mockFighters.js      # Fighter data
│   ├── entities/
│   │   ├── baseEntity.js        # Base combat entity
│   │   ├── fighter.js           # Fighter class
│   │   ├── referee.js           # Game referee
│   │   └── team.js              # Team class
│   ├── game/
│   │   ├── consumables.js       # Healing items
│   │   ├── game.js              # Game engine
│   │   └── GameEvent.js         # Random events
│   ├── utils/
│   │   ├── helpers.js           # Utility functions
│   │   └── logger.js            # Combat logger
│   ├── index.css                # Styles
│   └── main.js                  # Entry point
├── index.html                   # HTML template
├── package.json                 # Dependencies
└── vite.config.js              # Vite configuration
```

## 🤝 Contributing

This is a learning project demonstrating OOP principles in JavaScript.

## 📄 License

MIT License - See LICENSE file

## 👤 Author

Todor Ivanov

---

**Version**: 2.0.0  
**Status**: Active Development  
**Next Phase**: Architecture Refactoring + Gameplay Enhancements
