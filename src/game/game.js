import { Referee } from '../entities/referee.js';
import { Helpers } from '../utils/helpers.js';
import { Logger } from '../utils/logger.js';
import { getFighters } from '../api/mockFighters.js';
import { GameStateManager } from './GameStateManager.js';
import { EventManager } from './EventManager.js';
import { CombatEngine } from './CombatEngine.js';

const ROUND_INTERVAL = 1500;

// Game instance state manager
let gameState = null;

export default class Game {
  /**
   * Start a 1v1 fighter match
   * @param {Object} firstFighter - First fighter
   * @param {Object} secondFighter - Second fighter
   */
  static startGame(firstFighter, secondFighter) {
    // Initialize clean state
    this.stopGame();
    gameState = new GameStateManager();

    Logger.clearLog();
    Referee.introduceFighters(firstFighter, secondFighter);

    const intervalId = setInterval(() => {
      Referee.showRoundNumber();
      const randomNumber = Helpers.getRandomNumber(0, 201);

      // Process random events
      EventManager.processRoundEvent(
        gameState,
        [firstFighter],
        [secondFighter],
        randomNumber,
        { min: 90, max: 110 }
      );

      // Process combat
      CombatEngine.processSingleCombat(firstFighter, secondFighter, randomNumber);

      // Display round summary
      Referee.roundSummary(firstFighter, secondFighter);

      // Check victory condition
      const result = CombatEngine.checkVictoryCondition(firstFighter, secondFighter, false);
      if (result) {
        Referee.declareWinner(result.winner);
        gameState.stop();
      }
    }, ROUND_INTERVAL);

    gameState.setIntervalId(intervalId);
  }

  /**
   * Start a team vs team match
   * @param {Team} teamOne - First team
   * @param {Team} teamTwo - Second team
   */
  static startTeamMatch(teamOne, teamTwo) {
    // Initialize clean state
    this.stopGame();
    gameState = new GameStateManager();

    Logger.clearLog();
    Referee.introduceTeams(teamOne, teamTwo);

    const intervalId = setInterval(() => {
      Referee.showRoundNumber();
      const randomNumber = Helpers.getRandomNumber(0, 1001);

      // Process random events (higher threshold for team matches)
      EventManager.processRoundEvent(
        gameState,
        teamOne.fighters,
        teamTwo.fighters,
        randomNumber,
        { min: 470, max: 530 }
      );

      // Process team combat
      if (randomNumber < 500) {
        CombatEngine.processTeamCombat(teamOne, teamTwo);
      } else {
        CombatEngine.processTeamCombat(teamTwo, teamOne);
      }

      // Display round summary
      Referee.matchRoundSummary(teamOne, teamTwo);

      // Check victory condition
      const result = CombatEngine.checkVictoryCondition(teamOne, teamTwo, true);
      if (result) {
        Referee.declareWinningTeam(result.winner);
        gameState.stop();
      }
    }, ROUND_INTERVAL);

    gameState.setIntervalId(intervalId);
  }

  /**
   * Stop the current game and clean up resources
   */
  static stopGame() {
    if (gameState) {
      gameState.stop();
    }
    Referee.clearRoundNumber();
  }

  /**
   * Load and display all available fighters
   * @returns {Promise<Array>} Promise resolving to fighters array
   */
  static logFighters() {
    return new Promise((resolve) => {
      getFighters().then((fighters) => {
        fighters.forEach((fighter) => {
          Logger.logFighter(fighter, '#choose-fighter');
        });

        resolve(fighters);
      });
    });
  }
}
