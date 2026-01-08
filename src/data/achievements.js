/**
 * Achievements Database
 * Defines all available achievements in the game
 */

export const ACHIEVEMENT_CATEGORIES = {
  COMBAT: 'combat',
  CLASS: 'class',
  STRATEGIC: 'strategic',
  SPECIAL: 'special',
  PROGRESSION: 'progression',
};

export const ACHIEVEMENTS = [
  // COMBAT ACHIEVEMENTS
  {
    id: 'first_blood',
    name: 'First Blood',
    description: 'Win your first battle',
    icon: '⚔️',
    category: ACHIEVEMENT_CATEGORIES.COMBAT,
    requirement: {
      type: 'wins',
      target: 1,
    },
    reward: { xp: 50 },
  },
  {
    id: 'warrior',
    name: 'Warrior',
    description: 'Win 10 battles',
    icon: '🗡️',
    category: ACHIEVEMENT_CATEGORIES.COMBAT,
    requirement: {
      type: 'wins',
      target: 10,
    },
    reward: { xp: 100 },
  },
  {
    id: 'veteran',
    name: 'Veteran',
    description: 'Win 50 battles',
    icon: '⚔️',
    category: ACHIEVEMENT_CATEGORIES.COMBAT,
    requirement: {
      type: 'wins',
      target: 50,
    },
    reward: { xp: 250 },
  },
  {
    id: 'legend',
    name: 'Legend',
    description: 'Win 100 battles',
    icon: '🏅',
    category: ACHIEVEMENT_CATEGORIES.COMBAT,
    requirement: {
      type: 'wins',
      target: 100,
    },
    reward: { xp: 500 },
  },
  {
    id: 'flawless_victory',
    name: 'Flawless Victory',
    description: 'Win a battle without taking damage',
    icon: '💎',
    category: ACHIEVEMENT_CATEGORIES.COMBAT,
    requirement: {
      type: 'flawless',
      target: 1,
    },
    reward: { xp: 200 },
  },
  {
    id: 'critical_master',
    name: 'Critical Master',
    description: 'Land 50 critical hits',
    icon: '💥',
    category: ACHIEVEMENT_CATEGORIES.COMBAT,
    requirement: {
      type: 'criticalHits',
      target: 50,
    },
    reward: { xp: 150 },
  },
  {
    id: 'finishing_blow',
    name: 'Finishing Blow',
    description: 'Win a battle with a critical hit',
    icon: '⚡',
    category: ACHIEVEMENT_CATEGORIES.COMBAT,
    requirement: {
      type: 'criticalFinish',
      target: 1,
    },
    reward: { xp: 100 },
  },
  {
    id: 'heavy_hitter',
    name: 'Heavy Hitter',
    description: 'Deal 500 damage in a single hit',
    icon: '🔥',
    category: ACHIEVEMENT_CATEGORIES.COMBAT,
    requirement: {
      type: 'singleHit',
      target: 500,
    },
    reward: { xp: 300 },
  },
  {
    id: 'winning_streak',
    name: 'Winning Streak',
    description: 'Win 5 battles in a row',
    icon: '🔥',
    category: ACHIEVEMENT_CATEGORIES.COMBAT,
    requirement: {
      type: 'winStreak',
      target: 5,
    },
    reward: { xp: 200 },
  },
  {
    id: 'unstoppable',
    name: 'Unstoppable',
    description: 'Win 10 battles in a row',
    icon: '⚡',
    category: ACHIEVEMENT_CATEGORIES.COMBAT,
    requirement: {
      type: 'winStreak',
      target: 10,
    },
    reward: { xp: 400 },
  },

  // STRATEGIC ACHIEVEMENTS
  {
    id: 'skill_master',
    name: 'Skill Master',
    description: 'Use skills 50 times',
    icon: '🌟',
    category: ACHIEVEMENT_CATEGORIES.STRATEGIC,
    requirement: {
      type: 'skillsUsed',
      target: 50,
    },
    reward: { xp: 150 },
  },
  {
    id: 'combo_king',
    name: 'Combo King',
    description: 'Build a 5-hit combo',
    icon: '💫',
    category: ACHIEVEMENT_CATEGORIES.STRATEGIC,
    requirement: {
      type: 'maxCombo',
      target: 5,
    },
    reward: { xp: 150 },
  },
  {
    id: 'basic_warrior',
    name: 'Basic Warrior',
    description: 'Win using only basic attacks',
    icon: '✊',
    category: ACHIEVEMENT_CATEGORIES.STRATEGIC,
    requirement: {
      type: 'basicOnly',
      target: 1,
    },
    reward: { xp: 200 },
  },
  {
    id: 'no_items',
    name: 'Purist',
    description: 'Win without using items',
    icon: '🚫',
    category: ACHIEVEMENT_CATEGORIES.STRATEGIC,
    requirement: {
      type: 'noItems',
      target: 1,
    },
    reward: { xp: 150 },
  },

  // SPECIAL ACHIEVEMENTS
  {
    id: 'first_tournament',
    name: 'Tournament Champion',
    description: 'Win your first tournament',
    icon: '🏆',
    category: ACHIEVEMENT_CATEGORIES.SPECIAL,
    requirement: {
      type: 'tournamentsWon',
      target: 1,
    },
    reward: { xp: 300 },
  },
  {
    id: 'hard_mode',
    name: 'Hard Mode Champion',
    description: 'Win a tournament on Hard difficulty',
    icon: '💀',
    category: ACHIEVEMENT_CATEGORIES.SPECIAL,
    requirement: {
      type: 'tournamentHard',
      target: 1,
    },
    reward: { xp: 500 },
  },
  {
    id: 'nightmare_mode',
    name: 'Nightmare Conqueror',
    description: 'Win a tournament on Nightmare difficulty',
    icon: '👹',
    category: ACHIEVEMENT_CATEGORIES.SPECIAL,
    requirement: {
      type: 'tournamentNightmare',
      target: 1,
    },
    reward: { xp: 1000 },
  },
  {
    id: 'serial_champion',
    name: 'Serial Champion',
    description: 'Win 10 tournaments',
    icon: '🏆',
    category: ACHIEVEMENT_CATEGORIES.SPECIAL,
    requirement: {
      type: 'tournamentsWon',
      target: 10,
    },
    reward: { xp: 1000 },
  },
  {
    id: 'equipment_collector',
    name: 'Equipment Collector',
    description: 'Collect 10 equipment pieces',
    icon: '📦',
    category: ACHIEVEMENT_CATEGORIES.SPECIAL,
    requirement: {
      type: 'equipmentCollected',
      target: 10,
    },
    reward: { xp: 200 },
  },
  {
    id: 'legendary_collector',
    name: 'Legendary Collector',
    description: 'Collect a legendary item',
    icon: '🌟',
    category: ACHIEVEMENT_CATEGORIES.SPECIAL,
    requirement: {
      type: 'legendaryCollected',
      target: 1,
    },
    reward: { xp: 500 },
  },

  // PROGRESSION ACHIEVEMENTS
  {
    id: 'level_5',
    name: 'Rising Star',
    description: 'Reach level 5',
    icon: '⬆️',
    category: ACHIEVEMENT_CATEGORIES.PROGRESSION,
    requirement: {
      type: 'level',
      target: 5,
    },
    reward: { xp: 100 },
  },
  {
    id: 'level_10',
    name: 'Expert Fighter',
    description: 'Reach level 10',
    icon: '⬆️',
    category: ACHIEVEMENT_CATEGORIES.PROGRESSION,
    requirement: {
      type: 'level',
      target: 10,
    },
    reward: { xp: 250 },
  },
  {
    id: 'level_20',
    name: 'Master Fighter',
    description: 'Reach maximum level (20)',
    icon: '👑',
    category: ACHIEVEMENT_CATEGORIES.PROGRESSION,
    requirement: {
      type: 'level',
      target: 20,
    },
    reward: { xp: 500 },
  },
  {
    id: 'total_damage',
    name: 'Damage Dealer',
    description: 'Deal 10,000 total damage',
    icon: '💥',
    category: ACHIEVEMENT_CATEGORIES.PROGRESSION,
    requirement: {
      type: 'totalDamageDealt',
      target: 10000,
    },
    reward: { xp: 300 },
  },
];

/**
 * Get achievement by ID
 */
export function getAchievementById(id) {
  return ACHIEVEMENTS.find(a => a.id === id);
}

/**
 * Get achievements by category
 */
export function getAchievementsByCategory(category) {
  return ACHIEVEMENTS.filter(a => a.category === category);
}

/**
 * Get all achievement categories with counts
 */
export function getAchievementCategoriesWithCounts() {
  return Object.values(ACHIEVEMENT_CATEGORIES).map(category => ({
    id: category,
    name: category.charAt(0).toUpperCase() + category.slice(1),
    achievements: getAchievementsByCategory(category),
    count: getAchievementsByCategory(category).length,
  }));
}
