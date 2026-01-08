import { Helpers } from '../utils/helpers.js';
import GameEvent from './GameEvent.js';

/**
 * EventManager - Handles random event generation and application
 */
export class EventManager {
  /**
   * Check if an event should trigger based on probability
   * @param {number} randomNumber - Random number for probability
   * @param {number} min - Minimum threshold
   * @param {number} max - Maximum threshold
   * @returns {boolean}
   */
  static shouldTriggerEvent(randomNumber, min, max) {
    return randomNumber > min && randomNumber < max;
  }

  /**
   * Handle event logic for a round
   * @param {GameStateManager} state - Game state
   * @param {Array} team1Entities - Team 1 fighters
   * @param {Array} team2Entities - Team 2 fighters
   * @param {number} randomNumber - Random number for event triggering
   * @param {Object} eventConfig - Event configuration {min, max}
   */
  static processRoundEvent(state, team1Entities, team2Entities, randomNumber, eventConfig) {
    // Try to trigger new event
    if (
      this.shouldTriggerEvent(randomNumber, eventConfig.min, eventConfig.max) &&
      !state.hasActiveEvent()
    ) {
      const event = GameEvent.generateEvent();
      state.setEvent(event);
      event.logEvent();
      this.applyEventEffect(state, event, team1Entities, team2Entities);
      state.decrementEventRounds();
      return;
    }

    // Continue existing event
    if (state.hasActiveEvent() && state.currentEvent.roundsLeft > 0) {
      this.applyEventEffect(state, state.currentEvent, team1Entities, team2Entities);
      state.decrementEventRounds();
    }
  }

  /**
   * Apply event effect to appropriate entities
   */
  static applyEventEffect(state, event, team1Entities, team2Entities) {
    if (event.isGlobal) {
      // Global events affect everyone
      event.effect(team1Entities);
      event.effect(team2Entities);
    } else if (event.isTeamEvent) {
      // Team events affect one random team
      if (!state.selectedTeam) {
        state.setSelectedTeam(Helpers.getRandomNumber(1, 2));
      }

      if (state.selectedTeam === 1) {
        event.effect(team1Entities);
      } else {
        event.effect(team2Entities);
      }
    }
  }
}
