// Import Bootstrap 5 CSS and JS
import 'bootstrap/dist/css/bootstrap.min.css';
import * as bootstrap from 'bootstrap';

// Import custom styles
import './styles/theme.css';
import './index.css';

// Import Web Components
import './components/index.js';

// Import game modules
import Game from './game/game.js';
import { Team } from './entities/team.js';
import { soundManager } from './utils/soundManager.js';
import { getFighters } from './api/mockFighters.js';
import { Logger } from './utils/logger.js';

// Make bootstrap available globally if needed
window.bootstrap = bootstrap;

/**
 * Application State
 */
const appState = {
  currentScreen: 'title', // 'title' | 'gallery' | 'combat'
  gameMode: null, // 'single' | 'team'
  fighters: [],
  selectedFighters: [],
  
  reset() {
    this.currentScreen = 'title';
    this.gameMode = null;
    this.selectedFighters = [];
  },
};

/**
 * Initialize the application
 */
function initApp() {
  console.log('🎮 Object Fighter v2.4.0 - Initializing...');
  
  // Load fighters data
  getFighters().then((fighters) => {
    appState.fighters = fighters;
    console.log(`✅ Loaded ${fighters.length} fighters`);
    
    // Show title screen
    showTitleScreen();
  });

  // Initialize dark mode and sound toggles
  initDarkModeToggle();
  initSoundToggle();
}

/**
 * Show title screen
 */
function showTitleScreen() {
  const root = document.getElementById('root');
  root.innerHTML = '';

  const titleScreen = document.createElement('title-screen');
  titleScreen.addEventListener('mode-selected', (e) => {
    soundManager.init();
    appState.gameMode = e.detail.mode;
    appState.currentScreen = 'gallery';
    showFighterGallery();
  });

  root.appendChild(titleScreen);
  appState.currentScreen = 'title';
}

/**
 * Show fighter gallery
 */
function showFighterGallery() {
  const root = document.getElementById('root');
  root.innerHTML = '';

  const gallery = document.createElement('fighter-gallery');
  gallery.fighters = appState.fighters;
  gallery.mode = appState.gameMode;

  gallery.addEventListener('fighter-selected', (e) => {
    console.log('Fighter selected:', e.detail.fighter.name);
    appState.selectedFighters.push(e.detail.fighter);
  });

  gallery.addEventListener('selection-complete', (e) => {
    console.log('Selection complete:', e.detail);
    startBattle(e.detail.fighters);
  });

  gallery.addEventListener('back-to-menu', () => {
    appState.reset();
    showTitleScreen();
  });

  root.appendChild(gallery);
  appState.currentScreen = 'gallery';
}

/**
 * Start the battle
 */
function startBattle(fighters) {
  const root = document.getElementById('root');
  root.innerHTML = '';

  // Create combat arena component
  const arena = document.createElement('combat-arena');
  
  arena.addEventListener('return-to-menu', () => {
    Game.stopGame();
    appState.reset();
    showTitleScreen();
  });

  arena.addEventListener('auto-battle-toggle', (e) => {
    Game.setAutoBattle(e.detail.enabled);
  });

  arena.addEventListener('auto-scroll-toggle', (e) => {
    Logger.setAutoScroll(e.detail.enabled);
  });

  root.appendChild(arena);
  appState.currentScreen = 'combat';

  // Wait for arena to be fully rendered, then start game
  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      // Initialize Logger with the combat arena's log element
      const logElement = arena.shadowRoot?.querySelector('#log');
      if (logElement) {
        Logger.setLogHolder(logElement);
        // Initialize Logger with arena's auto-scroll state
        Logger.setAutoScroll(arena.autoScroll);
        console.log('✅ Logger initialized for combat arena');
        console.log('📜 Auto-scroll:', arena.autoScroll ? 'ENABLED' : 'DISABLED');
        console.log('Log element:', logElement);
      } else {
        console.error('❌ Could not find log element in combat arena');
        console.error('Arena shadowRoot:', arena.shadowRoot);
      }

      // Start game based on mode
      if (appState.gameMode === 'single' && fighters.length >= 2) {
        console.log('🎮 Starting single fight:', fighters[0].name, 'vs', fighters[1].name);
        Game.startGame(fighters[0], fighters[1]);
      } else if (appState.gameMode === 'team') {
        // Team match logic
        const team1 = new Team('Team One', fighters.slice(0, Math.floor(fighters.length / 2)));
        const team2 = new Team('Team Two', fighters.slice(Math.floor(fighters.length / 2)));
        console.log('🎮 Starting team match:', team1.name, 'vs', team2.name);
        console.log('Team 1 fighters:', team1.fighters.map(f => f.name).join(', '));
        console.log('Team 2 fighters:', team2.fighters.map(f => f.name).join(', '));
        Game.startTeamMatch(team1, team2);
      }
    });
  });
}

/**
 * Show victory screen
 */
export function showVictoryScreen(winner) {
  const victoryScreen = document.createElement('victory-screen');
  victoryScreen.setAttribute('winner-name', winner.name);
  victoryScreen.setAttribute('winner-image', winner.image);
  victoryScreen.setAttribute('winner-class', winner.class);

  victoryScreen.addEventListener('play-again', () => {
    victoryScreen.remove();
    appState.selectedFighters = [];
    showFighterGallery();
  });

  victoryScreen.addEventListener('main-menu', () => {
    victoryScreen.remove();
    Game.stopGame();
    appState.reset();
    showTitleScreen();
  });

  document.body.appendChild(victoryScreen);
}

/**
 * Initialize dark mode toggle
 */
function initDarkModeToggle() {
  const darkMode = localStorage.getItem('darkMode') === 'true';
  if (darkMode) {
    document.body.classList.add('dark-mode');
  }

  const toggle = document.createElement('button');
  toggle.className = 'toggle-btn theme-toggle';
  toggle.innerHTML = darkMode ? '☀️' : '🌙';
  toggle.style.cssText = `
    position: fixed;
    top: 20px;
    right: 80px;
    width: 50px;
    height: 50px;
    border-radius: 50%;
    border: 2px solid rgba(255, 255, 255, 0.2);
    background: rgba(26, 13, 46, 0.8);
    color: white;
    font-size: 24px;
    cursor: pointer;
    z-index: 10000;
    backdrop-filter: blur(10px);
    transition: all 0.3s ease;
  `;

  toggle.addEventListener('click', () => {
    document.body.classList.toggle('dark-mode');
    const isDark = document.body.classList.contains('dark-mode');
    localStorage.setItem('darkMode', isDark);
    toggle.innerHTML = isDark ? '☀️' : '🌙';
  });

  document.body.appendChild(toggle);
}

/**
 * Initialize sound toggle
 */
function initSoundToggle() {
  const soundEnabled = localStorage.getItem('soundEnabled') !== 'false';

  const toggle = document.createElement('button');
  toggle.className = 'toggle-btn sound-toggle';
  toggle.innerHTML = soundEnabled ? '🔊' : '🔇';
  toggle.style.cssText = `
    position: fixed;
    top: 20px;
    right: 20px;
    width: 50px;
    height: 50px;
    border-radius: 50%;
    border: 2px solid rgba(255, 255, 255, 0.2);
    background: rgba(26, 13, 46, 0.8);
    color: white;
    font-size: 24px;
    cursor: pointer;
    z-index: 10000;
    backdrop-filter: blur(10px);
    transition: all 0.3s ease;
  `;

  toggle.addEventListener('click', () => {
    const enabled = soundManager.toggle();
    toggle.innerHTML = enabled ? '🔊' : '🔇';
  });

  document.body.appendChild(toggle);
}

// Start the app when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initApp);
} else {
  initApp();
}

// Export for game to show victory screen
window.showVictoryScreen = showVictoryScreen;
