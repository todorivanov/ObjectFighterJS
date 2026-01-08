/**
 * Game Configuration
 * Centralized settings for game balance and mechanics
 */

export const GameConfig = {
  // Combat Settings
  combat: {
    roundInterval: 1500, // milliseconds between rounds
    normalAttackChance: 80, // % chance for normal attack (vs special)
    missChance: 10, // % chance to miss any attack
    normalAttackMultiplier: 0.4, // damage = strength * multiplier + random
    normalAttackRandomMin: 0,
    normalAttackRandomMax: 40,
    specialAttackMultiplier: 0.8,
    specialAttackRandomMin: 20,
    specialAttackRandomMax: 80,
  },

  // Event System
  events: {
    singleFight: {
      min: 90,
      max: 110,
    },
    teamMatch: {
      min: 470,
      max: 530,
    },
  },

  // Consumable System
  consumables: {
    singleFight: {
      player1: { min: 149, max: 160 },
      player2: { min: 49, max: 60 },
    },
    teamMatch: {
      chance: { min: 60, max: 80 },
    },
  },

  // Fighter Classes for balancing
  fighterClasses: {
    BALANCED: { healthMultiplier: 1.0, strengthMultiplier: 1.0 },
    GLASS_CANNON: { healthMultiplier: 0.8, strengthMultiplier: 2.0 },
    TANK: { healthMultiplier: 2.0, strengthMultiplier: 0.4 },
    BRUISER: { healthMultiplier: 1.5, strengthMultiplier: 0.6 },
    WARRIOR: { healthMultiplier: 0.9, strengthMultiplier: 1.1 },
  },

  // Image fallback
  images: {
    usePlaceholders: true,
    placeholderAPI: 'https://api.dicebear.com/7.x',
    style: 'avataaars', // avatar style
  },
};
