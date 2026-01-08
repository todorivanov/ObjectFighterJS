import { Fighter } from '../entities/fighter.js';

/**
 * Generate avatar URL using DiceBear API
 * @param {string} seed - Unique identifier for consistent avatar generation
 * @returns {string} Avatar URL
 */
function getAvatarUrl(seed) {
  return `https://api.dicebear.com/7.x/avataaars/svg?seed=${seed}&backgroundColor=b6e3f4`;
}

/**
 * Get all available fighters
 * @returns {Promise<Array<Fighter>>} Promise resolving to fighters array
 */
export function getFighters() {
  return new Promise((resolve) => {
    setTimeout(() => {
      const fighters = [
        new Fighter({
          id: 1,
          name: 'Gosho',
          health: 400,
          strength: 10,
          image: getAvatarUrl('gosho'),
          description:
            'A well-balanced fighter with equal offense and defense. Perfect for beginners.',
          class: 'BALANCED',
        }),
        new Fighter({
          id: 2,
          name: 'Ivan',
          health: 300,
          strength: 20,
          image: getAvatarUrl('ivan'),
          description:
            'Glass cannon with devastating attacks but fragile defense. High risk, high reward.',
          class: 'GLASS_CANNON',
        }),
        new Fighter({
          id: 3,
          name: 'Petar',
          health: 350,
          strength: 11,
          image: getAvatarUrl('petar'),
          description:
            'Slightly offensive-focused warrior. Good balance of power and survivability.',
          class: 'WARRIOR',
        }),
        new Fighter({
          id: 4,
          name: 'Jivko',
          health: 600,
          strength: 4,
          image: getAvatarUrl('jivko'),
          description:
            'Impenetrable tank with massive HP but weak attacks. Perfect for defensive strategies.',
          class: 'TANK',
        }),
        new Fighter({
          id: 5,
          name: 'Bobba',
          health: 500,
          strength: 6,
          image: getAvatarUrl('bobba'),
          description: 'Durable bruiser with high HP and moderate damage. Reliable in long fights.',
          class: 'BRUISER',
        }),
        new Fighter({
          id: 6,
          name: 'Viktor',
          health: 300,
          strength: 18,
          image: getAvatarUrl('viktor'),
          description: 'Aggressive striker who overwhelms enemies with rapid, powerful blows.',
          class: 'GLASS_CANNON',
        }),
        new Fighter({
          id: 7,
          name: 'Marina',
          health: 400,
          strength: 9,
          image: getAvatarUrl('marina'),
          description: 'Tactical fighter with solid defense and consistent damage output.',
          class: 'BALANCED',
        }),
        new Fighter({
          id: 8,
          name: 'Dimitri',
          health: 550,
          strength: 5,
          image: getAvatarUrl('dimitri'),
          description:
            'Defensive specialist who outlasts opponents through superior endurance.',
          class: 'TANK',
        }),
        new Fighter({
          id: 9,
          name: 'Svetlana',
          health: 350,
          strength: 13,
          image: getAvatarUrl('svetlana'),
          description: 'Versatile combatant excelling in both offense and mobility.',
          class: 'WARRIOR',
        }),
        new Fighter({
          id: 10,
          name: 'Nikolai',
          health: 450,
          strength: 8,
          image: getAvatarUrl('nikolai'),
          description: 'Steady brawler who wears down enemies with relentless pressure.',
          class: 'BRUISER',
        }),
      ];

      resolve(fighters);
    }, 800); // Reduced simulated API delay
  });
}
