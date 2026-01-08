/**
 * GameStateManager - Centralized state management for game instances
 * Eliminates global state bugs and provides clean state encapsulation
 */
export class GameStateManager {
  constructor() {
    this.intervalId = null;
    this.currentEvent = null;
    this.selectedTeam = null;
    this.isRunning = false;
    this.roundNumber = 0;
  }

  startRound() {
    this.roundNumber++;
  }

  setEvent(event) {
    this.currentEvent = event;
  }

  clearEvent() {
    this.currentEvent = null;
    this.selectedTeam = null;
  }

  setSelectedTeam(teamNumber) {
    this.selectedTeam = teamNumber;
  }

  setIntervalId(id) {
    this.intervalId = id;
    this.isRunning = true;
  }

  stop() {
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }
    this.isRunning = false;
    this.currentEvent = null;
    this.selectedTeam = null;
    this.roundNumber = 0;
  }

  hasActiveEvent() {
    return this.currentEvent !== null;
  }

  decrementEventRounds() {
    if (this.currentEvent) {
      this.currentEvent.roundsLeft -= 1;
      if (this.currentEvent.roundsLeft === 0) {
        this.clearEvent();
      }
    }
  }
}
