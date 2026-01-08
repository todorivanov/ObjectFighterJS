import { Helpers } from '../utils/helpers.js';
import { Logger } from '../utils/logger.js';
import Consumable from './consumables.js';
import { soundManager } from '../utils/soundManager.js';

/**
 * CombatEngine - Handles all combat logic including attacks and consumables
 */
export class CombatEngine {
  /**
   * Process a single fighter vs fighter combat round
   * @param {Object} attacker - The attacking fighter
   * @param {Object} defender - The defending fighter
   * @param {number} randomNumber - Random number for determining actions
   */
  static processSingleCombat(attacker, defender, randomNumber) {
    if (randomNumber > 100) {
      defender.health -= attacker.hit();
      this.tryConsumeItem(attacker, randomNumber, 149, 160);
    } else {
      attacker.health -= defender.hit();
      this.tryConsumeItem(defender, randomNumber, 49, 60);
    }
  }

  /**
   * Process team combat where all fighters attack
   * @param {Array} attackingTeam - Team that is attacking
   * @param {Array} defendingTeam - Team that is defending
   */
  static processTeamCombat(attackingTeam, defendingTeam) {
    for (let i = 0; i < attackingTeam.fighters.length; i++) {
      const fighter = attackingTeam.fighters[i];

      if (defendingTeam.fighters.length === 0) break;

      const randomEnemy =
        defendingTeam.fighters[Helpers.getRandomNumber(0, defendingTeam.fighters.length - 1)];
      
      const damage = fighter.hit();
      const validDamage = isNaN(damage) ? 0 : Math.max(0, damage);
      
      Logger.log(`${fighter.name} attacked ${randomEnemy.name}.`);
      randomEnemy.takeDamage(validDamage);

      if (randomEnemy.health <= 0) {
        this.removeFighter(defendingTeam, randomEnemy);
      }
    }

    // Chance for team to get consumable
    const specialAttack = Helpers.getRandomNumber(0, 100);
    if (specialAttack > 60 && specialAttack < 80 && attackingTeam.fighters.length > 0) {
      const consumable = Consumable.getConsumable();
      const randomFighter =
        attackingTeam.fighters[Helpers.getRandomNumber(0, attackingTeam.fighters.length - 1)];
      
      const healAmount = isNaN(consumable.health) ? 0 : Math.max(0, consumable.health);
      randomFighter.health = Math.min(randomFighter.maxHealth, randomFighter.health + healAmount);

      const msg = `<div class="consumable text-center">${randomFighter.name} consumed ${consumable.name} which gave him ${healAmount} HP.</div>`;
      Logger.log(msg);
    }
  }

  /**
   * Remove a defeated fighter from a team
   */
  static removeFighter(team, fighter) {
    const index = team.fighters.findIndex((f) => f.id === fighter.id);
    if (index !== -1) {
      team.fighters.splice(index, 1);
    }
  }

  /**
   * Try to consume an item based on probability
   * @param {Object} fighter - The fighter to consume item
   * @param {number} randomNumber - Random number for probability
   * @param {number} min - Minimum threshold
   * @param {number} max - Maximum threshold
   */
  static tryConsumeItem(fighter, randomNumber, min, max) {
    if (randomNumber > min && randomNumber < max) {
      const consumable = Consumable.getConsumable();
      fighter.health += consumable.health;
      const msg = `<div class="consumable text-center">${fighter.name} consumed ${consumable.name} which gave him ${consumable.health} HP.</div>`;
      Logger.log(msg);
      soundManager.play('heal');

      // Show floating heal number
      if (fighter.showFloatingDamage) {
        fighter.showFloatingDamage(consumable.health, 'heal');
      }
    }
  }

  /**
   * Check if combat should end (fighter/team defeated)
   * @returns {Object|null} Winner if combat ended, null otherwise
   */
  static checkVictoryCondition(entity1, entity2, isTeamMatch = false) {
    if (isTeamMatch) {
      if (entity1.fighters.length === 0) {
        return { winner: entity2, isTeam: true };
      }
      if (entity2.fighters.length === 0) {
        return { winner: entity1, isTeam: true };
      }
    } else {
      if (entity1.health <= 0) {
        return { winner: entity2, isTeam: false };
      }
      if (entity2.health <= 0) {
        return { winner: entity1, isTeam: false };
      }
    }
    return null;
  }
}
