import { Helpers } from '../utils/helpers.js';
import { Logger } from '../utils/logger.js';

/**
 * BaseEntity - Base class for all combat entities
 */
export class BaseEntity {
  constructor(baseEntity) {
    this.id = baseEntity.id;
    this.name = baseEntity.name;
    this.health = baseEntity.health;
    this.image = baseEntity.image;
    this.strength = baseEntity.strength;
    this.description = baseEntity.description;
    this.class = baseEntity.class || 'BALANCED';
  }

  /**
   * Perform an attack (normal or special based on chance)
   * @returns {number} Damage dealt
   */
  hit() {
    const num = Helpers.getRandomNumber(0, 101);
    if (num < 80) {
      return this.normalAttack();
    } else {
      return this.specialAttack();
    }
  }

  /**
   * Perform a normal attack
   * @returns {number} Damage dealt
   */
  normalAttack() {
    const shouldHit = Helpers.getRandomNumber(0, 101);
    if (shouldHit < 10) {
      const msg = `<div class="attack-div missed-attack text-center">💨 <strong>${this.name}</strong> swung but missed completely! <span class="text-muted">(0 damage)</span></div>`;
      Logger.log(msg);
      return 0;
    } else {
      const dmg = Math.ceil(this.strength * 0.4 + Helpers.getRandomNumber(0, 40));
      const msg = `<div class="attack-div normal-attack text-center">⚔️ <strong>${this.name}</strong> landed a solid hit! <span class="badge bg-warning">${dmg} damage</span></div>`;
      Logger.log(msg);
      return dmg;
    }
  }

  /**
   * Perform a special attack
   * @returns {number} Damage dealt
   */
  specialAttack() {
    const shouldHit = Helpers.getRandomNumber(0, 101);
    if (shouldHit < 10) {
      const msg = `<div class="attack-div missed-attack text-center">💥 <strong>${this.name}</strong> attempted a special attack but it failed! <span class="text-muted">(0 damage)</span></div>`;
      Logger.log(msg);
      return 0;
    } else {
      const dmg = Math.ceil(this.strength * 0.8 + Helpers.getRandomNumber(20, 80));
      const msg = `<div class="attack-div special-attack text-center">🔥 <strong>${this.name}</strong> unleashed a devastating special attack! <span class="badge bg-danger">${dmg} damage</span></div>`;
      Logger.log(msg);
      return dmg;
    }
  }
}
