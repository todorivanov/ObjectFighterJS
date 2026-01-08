// Import Bootstrap 5 CSS and JS
import 'bootstrap/dist/css/bootstrap.min.css';
import * as bootstrap from 'bootstrap';

// Import custom styles
import './index.css';

// Import game modules
import Game from './game/game.js';
import { Logger } from './utils/logger.js';
import { Team } from './entities/team.js';

// Make bootstrap available globally if needed
window.bootstrap = bootstrap;

/**
 * Application State
 * Centralized state management for the UI
 */
const appState = {
  chosenFighters: 0,
  firstFighter: null,
  secondFighter: null,
  fighters: [],
  hasStartButton: false,

  reset() {
    this.chosenFighters = 0;
    this.firstFighter = null;
    this.secondFighter = null;
    this.hasStartButton = false;
  },
};

/**
 * Display game mode selection screen
 */
function chooseGame() {
  const container = document.querySelector('.container');
  container.innerHTML = `
    <div class="choose-game-mode text-center mt-5">
      <h1 class="mb-4">Object Fighter - Battle Arena</h1>
      <button class="btn btn-primary btn-lg me-3" data-action="single-fight">Single Fight</button>
      <button class="btn btn-primary btn-lg" data-action="team-match">Team Match</button>
    </div>
  `;

  // Use event delegation to avoid memory leaks
  container.addEventListener(
    'click',
    (event) => {
      const action = event.target.dataset.action;
      if (action === 'single-fight') {
        container.innerHTML = '';
        initGame(false);
      } else if (action === 'team-match') {
        container.innerHTML = '';
        initGame(true);
      }
    },
    { once: true }
  );
}

function appendHolders(isTeamMatch) {
  const container = document.querySelector('.container');
  container.innerHTML = `
    <div id="choose-fighter" class="text-center">
      <h3><span>Choose fighters</span><button class="btn btn-primary reset-game">Reset Game</button></h3>
    </div>      
  `;

  if (isTeamMatch) {
    container.innerHTML += `
      <div id="selected-fighters" class="text-center">
        <div class="row">
          <div class="col-6">
            <h4>Team One</h4>
            <div class="team-one allowedDrop border border-2 p-3" style="min-height: 200px;">
            </div>
          </div>
          <div class="col-6">
            <h4>Team Two</h4>
            <div class="team-two allowedDrop border border-2 p-3" style="min-height: 200px;">
            </div>
          </div>
        </div>
      </div>
    `;
  } else {
    container.innerHTML += `
      <div id="selected-fighters" class="text-center">
        <h3>Selected fighters</h3>
      </div>
    `;
  }

  container.innerHTML += `
    <div id="log"></div>
  `;
}

/**
 * Attach start button and handle game start
 * @param {boolean} isMatchGame - True if team match, false if single fight
 */
function attachStartButton(isMatchGame) {
  const selectedFighters = document.querySelector('#selected-fighters');
  const startBtn = document.createElement('button');
  startBtn.className = 'btn btn-success start-btn mt-3';
  startBtn.textContent = 'Start Fight';
  startBtn.dataset.action = 'start-fight';

  startBtn.addEventListener(
    'click',
    function () {
      Logger.setLogHolder('#log');

      if (isMatchGame) {
        const teamOne = new Team('Team One', []);
        const teamTwo = new Team('Team Two', []);

        document.querySelectorAll('.team-one .details-holder').forEach((el) => {
          const fighterId = parseInt(el.dataset.id);
          teamOne.fighters.push(appState.fighters.find((f) => f.id === fighterId));
        });

        document.querySelectorAll('.team-two .details-holder').forEach((el) => {
          const fighterId = parseInt(el.dataset.id);
          teamTwo.fighters.push(appState.fighters.find((f) => f.id === fighterId));
        });

        Game.startTeamMatch(teamOne, teamTwo);
      } else {
        Game.startGame(appState.firstFighter, appState.secondFighter);
      }
    },
    { once: true }
  );

  selectedFighters.appendChild(startBtn);
}

/**
 * Attach reset button handler
 */
function attachResetButton() {
  const resetBtn = document.querySelector('.reset-game');
  if (!resetBtn) return;

  resetBtn.addEventListener('click', function () {
    const container = document.querySelector('.container');
    container.innerHTML = '';

    // Reset application state
    appState.reset();

    // Stop any running game
    Game.stopGame();

    // Return to game mode selection
    chooseGame();
  });
}

/**
 * Attach click handlers for fighter selection (single fight mode)
 * Uses event delegation for better performance and no memory leaks
 */
function attachClickEvent() {
  const chooseFighter = document.querySelector('#choose-fighter');
  if (!chooseFighter) return;

  chooseFighter.addEventListener('click', function (event) {
    const holder = event.target.closest('.details-holder');
    if (!holder) return;

    const id = parseInt(holder.dataset.id);

    if (!appState.firstFighter) {
      appState.firstFighter = appState.fighters.find((f) => f.id === id);
      Logger.logFighter(appState.firstFighter, '#selected-fighters');
      appState.chosenFighters++;
    } else if (!appState.secondFighter) {
      appState.secondFighter = appState.fighters.find((f) => f.id === id);
      Logger.logFighter(appState.secondFighter, '#selected-fighters');
      appState.chosenFighters++;
    }

    if (appState.chosenFighters === 2) {
      appState.chosenFighters = 0;
      attachStartButton(false);
    }
  });
}

/**
 * Attach drag and drop handlers for team selection
 * Uses event delegation on container for better performance
 */
function attachDragAndDropHandlers() {
  let draggedElement = null;

  // Make all fighter cards draggable
  document.querySelectorAll('.details-holder').forEach((holder) => {
    holder.draggable = true;
  });

  // Use event delegation on the container
  const container = document.querySelector('.container');

  // Handle dragstart
  container.addEventListener('dragstart', function (event) {
    if (event.target.classList.contains('details-holder')) {
      draggedElement = event.target;
      event.dataTransfer.effectAllowed = 'move';
    }
  });

  // Handle dragover
  container.addEventListener('dragover', function (event) {
    const dropZone = event.target.closest('.team-one, .team-two');
    if (dropZone) {
      event.preventDefault();
      event.dataTransfer.dropEffect = 'move';
    }
  });

  // Handle drop
  container.addEventListener('drop', function (event) {
    const dropZone = event.target.closest('.team-one, .team-two');
    if (dropZone && draggedElement) {
      event.preventDefault();
      dropZone.appendChild(draggedElement);
      draggedElement = null;

      // Check if both teams have fighters and show start button
      const teamOneHas = document.querySelector('.team-one').children.length > 0;
      const teamTwoHas = document.querySelector('.team-two').children.length > 0;

      if (teamOneHas && teamTwoHas && !appState.hasStartButton) {
        appState.hasStartButton = true;
        attachStartButton(true);
      }
    }
  });
}

/**
 * Initialize game with selected mode
 * @param {boolean} isMatchFight - True for team match, false for single fight
 */
function initGame(isMatchFight) {
  appendHolders(isMatchFight);
  attachResetButton();

  Game.logFighters().then((apiFighters) => {
    appState.fighters = apiFighters;

    if (isMatchFight) {
      attachDragAndDropHandlers();
    } else {
      attachClickEvent();
    }
  });
}

// Start the game when DOM is ready
window.addEventListener('load', function () {
  chooseGame();
});
