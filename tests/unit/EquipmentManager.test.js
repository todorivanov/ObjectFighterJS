/**
 * EquipmentManager Unit Tests
 * Tests for 8 equipment slots, movement modifiers, and equipment stats
 */

import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest';
import { EquipmentManager } from '../../src/game/EquipmentManager.js';

// Mock gameStore
let mockState = {
  player: { 
    level: 10,
    character: { class: 'WARRIOR' }
  },
  equipped: {
    weapon: null,
    head: null,
    torso: null,
    arms: null,
    trousers: null,
    shoes: null,
    coat: null,
    accessory: null,
  },
  inventory: {
    equipment: [],
  },
  equipmentDurability: {},
};

vi.mock('../../src/store/gameStore.js', () => {
  return {
    gameStore: {
      getState: vi.fn(() => mockState),
      dispatch: vi.fn((action) => {
        if (action.type === 'EQUIP_ITEM') {
          mockState.equipped[action.payload.slot] = action.payload.itemId;
        } else if (action.type === 'UNEQUIP_ITEM') {
          mockState.equipped[action.payload.slot] = null;
        } else if (action.type === 'ADD_ITEM') {
          mockState.inventory.equipment.push(action.payload);
        } else if (action.type === 'REMOVE_ITEM') {
          const index = mockState.inventory.equipment.indexOf(action.payload);
          if (index > -1) {
            mockState.inventory.equipment.splice(index, 1);
          }
        }
      }),
    },
  };
});

// Mock equipment data
const mockEquipmentData = {
  sword_basic: {
    id: 'sword_basic',
    name: 'Basic Sword',
    type: 'weapon',
    icon: '⚔️',
    rarity: 'common',
    stats: { strength: 10, health: 5 },
    requirements: { level: 1, class: null },
    description: 'A basic sword',
  },
  helmet_iron: {
    id: 'helmet_iron',
    name: 'Iron Helmet',
    type: 'head',
    icon: '🪖',
    rarity: 'common',
    stats: { defense: 5, health: 10 },
    requirements: { level: 1, class: null },
    description: 'Iron helmet',
  },
  armor_leather: {
    id: 'armor_leather',
    name: 'Leather Armor',
    type: 'torso',
    icon: '🛡️',
    rarity: 'common',
    stats: { defense: 15, health: 20 },
    requirements: { level: 1, class: null },
    description: 'Leather chest armor',
  },
  gauntlets_steel: {
    id: 'gauntlets_steel',
    name: 'Steel Gauntlets',
    type: 'arms',
    icon: '🥊',
    rarity: 'uncommon',
    stats: { strength: 5, defense: 3 },
    requirements: { level: 1, class: null },
    description: 'Steel gauntlets',
  },
  pants_cloth: {
    id: 'pants_cloth',
    name: 'Cloth Pants',
    type: 'trousers',
    icon: '👖',
    rarity: 'common',
    stats: { defense: 5 },
    requirements: { level: 1, class: null },
    description: 'Basic cloth pants',
  },
  boots_haste: {
    id: 'boots_haste',
    name: 'Boots of Haste',
    type: 'shoes',
    icon: '👢',
    rarity: 'rare',
    stats: { movementBonus: 1, defense: 2 },
    requirements: { level: 5, class: null },
    description: 'Increases movement range',
  },
  cloak_shadow: {
    id: 'cloak_shadow',
    name: 'Shadow Cloak',
    type: 'coat',
    icon: '🧥',
    rarity: 'epic',
    stats: { defense: 10 },
    movementType: 'phaseThrough',
    requirements: { level: 8, class: null },
    description: 'Allows phasing through units',
  },
  ring_power: {
    id: 'ring_power',
    name: 'Ring of Power',
    type: 'accessory',
    icon: '💍',
    rarity: 'rare',
    stats: { strength: 8, critChance: 5 },
    requirements: { level: 5, class: null },
    description: 'Powerful ring',
  },
  boots_swift: {
    id: 'boots_swift',
    name: 'Swift Boots',
    type: 'shoes',
    icon: '👢',
    rarity: 'epic',
    stats: { movementBonus: 2 },
    movementType: ['ignoreTerrainCost'],
    requirements: { level: 10, class: null },
    description: 'Ignores terrain movement costs',
  },
};

vi.mock('../../src/data/equipment.js', () => ({
  getEquipmentById: vi.fn((id) => mockEquipmentData[id] || null),
  RARITY_COLORS: {},
  RARITY_NAMES: {},
}));

// Mock ConsoleLogger
vi.mock('../../src/utils/ConsoleLogger.js', () => ({
  ConsoleLogger: {
    info: vi.fn(),
    warn: vi.fn(),
    error: vi.fn(),
    debug: vi.fn(),
  },
  LogCategory: {
    EQUIPMENT: 'EQUIPMENT',
  },
}));

describe('EquipmentManager - 8 Equipment Slots', () => {
  beforeEach(() => {
    // Reset mock state
    mockState = {
      player: { 
        level: 10,
        character: { class: 'WARRIOR' }
      },
      equipped: {
        weapon: null,
        head: null,
        torso: null,
        arms: null,
        trousers: null,
        shoes: null,
        coat: null,
        accessory: null,
      },
      inventory: {
        equipment: [],
      },
      equipmentDurability: {},
    };
  });

  describe('All 8 Slots', () => {
    it('should have exactly 8 equipment slots', () => {
      const slots = Object.keys(mockState.equipped);
      expect(slots).toHaveLength(8);
      expect(slots).toEqual([
        'weapon',
        'head',
        'torso',
        'arms',
        'trousers',
        'shoes',
        'coat',
        'accessory',
      ]);
    });

    it('should allow equipping items to all 8 slots', () => {
      mockState.equipped.weapon = 'sword_basic';
      mockState.equipped.head = 'helmet_iron';
      mockState.equipped.torso = 'armor_leather';
      mockState.equipped.arms = 'gauntlets_steel';
      mockState.equipped.trousers = 'pants_cloth';
      mockState.equipped.shoes = 'boots_haste';
      mockState.equipped.coat = 'cloak_shadow';
      mockState.equipped.accessory = 'ring_power';

      const equippedItems = EquipmentManager.getEquippedItems();

      expect(equippedItems.weapon).toBeDefined();
      expect(equippedItems.weapon.id).toBe('sword_basic');
      expect(equippedItems.head.id).toBe('helmet_iron');
      expect(equippedItems.torso.id).toBe('armor_leather');
      expect(equippedItems.arms.id).toBe('gauntlets_steel');
      expect(equippedItems.trousers.id).toBe('pants_cloth');
      expect(equippedItems.shoes.id).toBe('boots_haste');
      expect(equippedItems.coat.id).toBe('cloak_shadow');
      expect(equippedItems.accessory.id).toBe('ring_power');
    });

    it('should return null for empty slots', () => {
      const equippedItems = EquipmentManager.getEquippedItems();

      expect(equippedItems.weapon).toBeNull();
      expect(equippedItems.head).toBeNull();
      expect(equippedItems.torso).toBeNull();
      expect(equippedItems.arms).toBeNull();
      expect(equippedItems.trousers).toBeNull();
      expect(equippedItems.shoes).toBeNull();
      expect(equippedItems.coat).toBeNull();
      expect(equippedItems.accessory).toBeNull();
    });
  });

  describe('getEquippedStats', () => {
    it('should calculate total stats from all 8 slots', () => {
      mockState.equipped = {
        weapon: 'sword_basic',        // +10 STR, +5 HP
        head: 'helmet_iron',          // +5 DEF, +10 HP
        torso: 'armor_leather',       // +15 DEF, +20 HP
        arms: 'gauntlets_steel',      // +5 STR, +3 DEF
        trousers: 'pants_cloth',      // +5 DEF
        shoes: 'boots_haste',         // +1 Move, +2 DEF
        coat: 'cloak_shadow',         // +10 DEF
        accessory: 'ring_power',      // +8 STR, +5 Crit%
      };

      const stats = EquipmentManager.getEquippedStats();

      expect(stats.strength).toBe(23); // 10 + 5 + 8
      expect(stats.health).toBe(35);   // 5 + 10 + 20
      expect(stats.defense).toBe(40);  // 5 + 15 + 3 + 5 + 2 + 10
      expect(stats.critChance).toBe(5);
      expect(stats.movementBonus).toBe(1);
    });

    it('should return zero stats when no items equipped', () => {
      const stats = EquipmentManager.getEquippedStats();

      expect(stats.strength).toBe(0);
      expect(stats.health).toBe(0);
      expect(stats.defense).toBe(0);
      expect(stats.critChance).toBe(0);
      expect(stats.critDamage).toBe(0);
      expect(stats.manaRegen).toBe(0);
      expect(stats.movementBonus).toBe(0);
    });

    it('should handle partial equipment correctly', () => {
      mockState.equipped = {
        weapon: 'sword_basic',  // +10 STR, +5 HP
        head: null,
        torso: 'armor_leather', // +15 DEF, +20 HP
        arms: null,
        trousers: null,
        shoes: null,
        coat: null,
        accessory: 'ring_power', // +8 STR, +5 Crit%
      };

      const stats = EquipmentManager.getEquippedStats();

      expect(stats.strength).toBe(18); // 10 + 8
      expect(stats.health).toBe(25);   // 5 + 20
      expect(stats.defense).toBe(15);  // 15
      expect(stats.critChance).toBe(5);
    });
  });

  describe('Movement Modifiers', () => {
    it('should calculate movement bonus from equipment', () => {
      mockState.equipped = {
        weapon: null,
        head: null,
        torso: null,
        arms: null,
        trousers: null,
        shoes: 'boots_haste', // +1 Move
        coat: null,
        accessory: null,
      };

      const modifiers = EquipmentManager.getMovementModifiers();

      expect(modifiers.bonus).toBe(1);
      expect(modifiers.specialTypes).toEqual([]);
    });

    it('should detect phaseThrough movement type', () => {
      mockState.equipped = {
        weapon: null,
        head: null,
        torso: null,
        arms: null,
        trousers: null,
        shoes: null,
        coat: 'cloak_shadow', // phaseThrough
        accessory: null,
      };

      const modifiers = EquipmentManager.getMovementModifiers();

      expect(modifiers.bonus).toBe(0);
      expect(modifiers.specialTypes).toContain('phaseThrough');
    });

    it('should detect ignoreTerrainCost movement type', () => {
      mockState.equipped = {
        weapon: null,
        head: null,
        torso: null,
        arms: null,
        trousers: null,
        shoes: 'boots_swift', // +2 Move, ignoreTerrainCost
        coat: null,
        accessory: null,
      };

      const modifiers = EquipmentManager.getMovementModifiers();

      expect(modifiers.bonus).toBe(2);
      expect(modifiers.specialTypes).toContain('ignoreTerrainCost');
    });

    it('should combine movement bonuses from multiple items', () => {
      mockState.equipped = {
        weapon: null,
        head: null,
        torso: null,
        arms: null,
        trousers: null,
        shoes: 'boots_swift',    // +2 Move, ignoreTerrainCost
        coat: 'cloak_shadow',    // phaseThrough
        accessory: null,
      };

      const modifiers = EquipmentManager.getMovementModifiers();

      expect(modifiers.bonus).toBe(2);
      expect(modifiers.specialTypes).toHaveLength(2);
      expect(modifiers.specialTypes).toContain('phaseThrough');
      expect(modifiers.specialTypes).toContain('ignoreTerrainCost');
    });

    it('should not duplicate special movement types', () => {
      // Create a mock item with duplicate movement types
      mockEquipmentData.boots_duplicate = {
        id: 'boots_duplicate',
        name: 'Duplicate Boots',
        type: 'shoes',
        stats: { movementBonus: 1 },
        movementType: ['ignoreTerrainCost', 'ignoreTerrainCost'],
        requirements: { level: 1, class: null },
      };

      mockState.equipped = {
        weapon: null,
        head: null,
        torso: null,
        arms: null,
        trousers: null,
        shoes: 'boots_duplicate',
        coat: null,
        accessory: null,
      };

      const modifiers = EquipmentManager.getMovementModifiers();

      expect(modifiers.specialTypes).toHaveLength(1);
      expect(modifiers.specialTypes[0]).toBe('ignoreTerrainCost');
    });

    it('should return empty modifiers when no movement items equipped', () => {
      mockState.equipped = {
        weapon: 'sword_basic',
        head: 'helmet_iron',
        torso: 'armor_leather',
        arms: null,
        trousers: null,
        shoes: null,
        coat: null,
        accessory: null,
      };

      const modifiers = EquipmentManager.getMovementModifiers();

      expect(modifiers.bonus).toBe(0);
      expect(modifiers.specialTypes).toEqual([]);
    });
  });

  describe('Inventory Management', () => {
    it('should add items to inventory', () => {
      const result = EquipmentManager.addToInventory('sword_basic');

      expect(result).toBe(true);
    });

    it('should not add non-existent items', () => {
      const result = EquipmentManager.addToInventory('fake_item');

      expect(result).toBe(false);
    });

    it('should enforce inventory limit of 20 items', () => {
      mockState.inventory.equipment = new Array(20).fill('sword_basic');

      const result = EquipmentManager.addToInventory('helmet_iron');

      expect(result).toBe(false);
    });
  });
});

describe('EquipmentManager - Slot Types', () => {
  beforeEach(() => {
    mockState = {
      player: { 
        level: 10,
        character: { class: 'WARRIOR' }
      },
      equipped: {
        weapon: null,
        head: null,
        torso: null,
        arms: null,
        trousers: null,
        shoes: null,
        coat: null,
        accessory: null,
      },
      inventory: {
        equipment: [],
      },
      equipmentDurability: {},
    };
  });

  it('should correctly identify weapon slot items', () => {
    const item = mockEquipmentData.sword_basic;
    expect(item.type).toBe('weapon');
  });

  it('should correctly identify head slot items', () => {
    const item = mockEquipmentData.helmet_iron;
    expect(item.type).toBe('head');
  });

  it('should correctly identify torso slot items', () => {
    const item = mockEquipmentData.armor_leather;
    expect(item.type).toBe('torso');
  });

  it('should correctly identify arms slot items', () => {
    const item = mockEquipmentData.gauntlets_steel;
    expect(item.type).toBe('arms');
  });

  it('should correctly identify trousers slot items', () => {
    const item = mockEquipmentData.pants_cloth;
    expect(item.type).toBe('trousers');
  });

  it('should correctly identify shoes slot items', () => {
    const item = mockEquipmentData.boots_haste;
    expect(item.type).toBe('shoes');
  });

  it('should correctly identify coat slot items', () => {
    const item = mockEquipmentData.cloak_shadow;
    expect(item.type).toBe('coat');
  });

  it('should correctly identify accessory slot items', () => {
    const item = mockEquipmentData.ring_power;
    expect(item.type).toBe('accessory');
  });
});
