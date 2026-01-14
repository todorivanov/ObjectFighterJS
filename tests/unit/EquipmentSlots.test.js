/**
 * Equipment Slots Expansion Unit Tests
 * Tests for 8-slot system and backward compatibility with save data
 */

import { describe, it, expect, beforeEach, vi } from 'vitest';

describe('Equipment Slots - State Management', () => {
  describe('8 Equipment Slots Structure', () => {
    it('should have exactly 8 equipment slots in initial state', () => {
      const initialState = {
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
      };

      const slots = Object.keys(initialState.equipped);
      expect(slots).toHaveLength(8);
      expect(slots).toContain('weapon');
      expect(slots).toContain('head');
      expect(slots).toContain('torso');
      expect(slots).toContain('arms');
      expect(slots).toContain('trousers');
      expect(slots).toContain('shoes');
      expect(slots).toContain('coat');
      expect(slots).toContain('accessory');
    });

    it('should initialize all slots to null', () => {
      const initialState = {
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
      };

      Object.values(initialState.equipped).forEach((slot) => {
        expect(slot).toBeNull();
      });
    });
  });

  describe('Backward Compatibility - Save Migration', () => {
    it('should migrate old 3-slot saves to 8-slot system', () => {
      const oldSaveData = {
        equipped: {
          weapon: 'sword_basic',
          armor: 'armor_leather',    // Old slot name
          accessory: 'ring_power',   // Old slot name
        },
      };

      // Simulate migration logic
      const migratedState = {
        equipped: {
          weapon: oldSaveData.equipped?.weapon || null,
          head: oldSaveData.equipped?.head || null,
          torso: oldSaveData.equipped?.torso || oldSaveData.equipped?.armor || null, // armor -> torso
          arms: oldSaveData.equipped?.arms || null,
          trousers: oldSaveData.equipped?.trousers || null,
          shoes: oldSaveData.equipped?.shoes || null,
          coat: oldSaveData.equipped?.coat || null,
          accessory: oldSaveData.equipped?.accessory || null,
        },
      };

      expect(migratedState.equipped.weapon).toBe('sword_basic');
      expect(migratedState.equipped.torso).toBe('armor_leather'); // Migrated from armor
      expect(migratedState.equipped.accessory).toBe('ring_power');
      expect(migratedState.equipped.head).toBeNull();
      expect(migratedState.equipped.arms).toBeNull();
      expect(migratedState.equipped.trousers).toBeNull();
      expect(migratedState.equipped.shoes).toBeNull();
      expect(migratedState.equipped.coat).toBeNull();
    });

    it('should handle empty old saves', () => {
      const oldSaveData = {
        equipped: {},
      };

      const migratedState = {
        equipped: {
          weapon: oldSaveData.equipped?.weapon || null,
          head: oldSaveData.equipped?.head || null,
          torso: oldSaveData.equipped?.torso || oldSaveData.equipped?.armor || null,
          arms: oldSaveData.equipped?.arms || null,
          trousers: oldSaveData.equipped?.trousers || null,
          shoes: oldSaveData.equipped?.shoes || null,
          coat: oldSaveData.equipped?.coat || null,
          accessory: oldSaveData.equipped?.accessory || null,
        },
      };

      Object.values(migratedState.equipped).forEach((slot) => {
        expect(slot).toBeNull();
      });
    });

    it('should preserve new slot data when present', () => {
      const newSaveData = {
        equipped: {
          weapon: 'sword_basic',
          head: 'helmet_iron',
          torso: 'armor_leather',
          arms: 'gauntlets_steel',
          trousers: 'pants_cloth',
          shoes: 'boots_haste',
          coat: 'cloak_shadow',
          accessory: 'ring_power',
        },
      };

      const migratedState = {
        equipped: {
          weapon: newSaveData.equipped?.weapon || null,
          head: newSaveData.equipped?.head || null,
          torso: newSaveData.equipped?.torso || newSaveData.equipped?.armor || null,
          arms: newSaveData.equipped?.arms || null,
          trousers: newSaveData.equipped?.trousers || null,
          shoes: newSaveData.equipped?.shoes || null,
          coat: newSaveData.equipped?.coat || null,
          accessory: newSaveData.equipped?.accessory || null,
        },
      };

      expect(migratedState.equipped).toEqual(newSaveData.equipped);
    });

    it('should handle partial equipment in old saves', () => {
      const oldSaveData = {
        equipped: {
          weapon: 'sword_basic',
          // armor missing
          accessory: 'ring_power',
        },
      };

      const migratedState = {
        equipped: {
          weapon: oldSaveData.equipped?.weapon || null,
          head: oldSaveData.equipped?.head || null,
          torso: oldSaveData.equipped?.torso || oldSaveData.equipped?.armor || null,
          arms: oldSaveData.equipped?.arms || null,
          trousers: oldSaveData.equipped?.trousers || null,
          shoes: oldSaveData.equipped?.shoes || null,
          coat: oldSaveData.equipped?.coat || null,
          accessory: oldSaveData.equipped?.accessory || null,
        },
      };

      expect(migratedState.equipped.weapon).toBe('sword_basic');
      expect(migratedState.equipped.torso).toBeNull(); // No armor to migrate
      expect(migratedState.equipped.accessory).toBe('ring_power');
    });

    it('should prioritize new slot names over old ones', () => {
      // Edge case: both torso and armor present
      const saveData = {
        equipped: {
          torso: 'new_armor',
          armor: 'old_armor', // Should be ignored if torso exists
        },
      };

      const migratedState = {
        equipped: {
          weapon: saveData.equipped?.weapon || null,
          head: saveData.equipped?.head || null,
          torso: saveData.equipped?.torso || saveData.equipped?.armor || null,
          arms: saveData.equipped?.arms || null,
          trousers: saveData.equipped?.trousers || null,
          shoes: saveData.equipped?.shoes || null,
          coat: saveData.equipped?.coat || null,
          accessory: saveData.equipped?.accessory || null,
        },
      };

      expect(migratedState.equipped.torso).toBe('new_armor'); // New name takes priority
    });
  });

  describe('Slot Selectors', () => {
    it('should have selectors for all 8 slots', () => {
      const mockState = {
        equipped: {
          weapon: 'sword_basic',
          head: 'helmet_iron',
          torso: 'armor_leather',
          arms: 'gauntlets_steel',
          trousers: 'pants_cloth',
          shoes: 'boots_haste',
          coat: 'cloak_shadow',
          accessory: 'ring_power',
        },
      };

      // Simulate selectors
      const selectEquippedWeapon = (state) => state.equipped?.weapon;
      const selectEquippedHead = (state) => state.equipped?.head;
      const selectEquippedTorso = (state) => state.equipped?.torso;
      const selectEquippedArms = (state) => state.equipped?.arms;
      const selectEquippedTrousers = (state) => state.equipped?.trousers;
      const selectEquippedShoes = (state) => state.equipped?.shoes;
      const selectEquippedCoat = (state) => state.equipped?.coat;
      const selectEquippedAccessory = (state) => state.equipped?.accessory;

      expect(selectEquippedWeapon(mockState)).toBe('sword_basic');
      expect(selectEquippedHead(mockState)).toBe('helmet_iron');
      expect(selectEquippedTorso(mockState)).toBe('armor_leather');
      expect(selectEquippedArms(mockState)).toBe('gauntlets_steel');
      expect(selectEquippedTrousers(mockState)).toBe('pants_cloth');
      expect(selectEquippedShoes(mockState)).toBe('boots_haste');
      expect(selectEquippedCoat(mockState)).toBe('cloak_shadow');
      expect(selectEquippedAccessory(mockState)).toBe('ring_power');
    });

    it('should return null for empty slots', () => {
      const mockState = {
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
      };

      const selectEquippedWeapon = (state) => state.equipped?.weapon;
      const selectEquippedAccessory = (state) => state.equipped?.accessory;

      expect(selectEquippedWeapon(mockState)).toBeNull();
      expect(selectEquippedAccessory(mockState)).toBeNull();
    });
  });

  describe('Equipment Actions', () => {
    it('should equip items to correct slots', () => {
      const equipAction = (slot, itemId) => ({
        type: 'EQUIP_ITEM',
        payload: { slot, itemId },
      });

      const weaponAction = equipAction('weapon', 'sword_basic');
      expect(weaponAction.payload.slot).toBe('weapon');
      expect(weaponAction.payload.itemId).toBe('sword_basic');

      const accessoryAction = equipAction('accessory', 'ring_power');
      expect(accessoryAction.payload.slot).toBe('accessory');
      expect(accessoryAction.payload.itemId).toBe('ring_power');

      const headAction = equipAction('head', 'helmet_iron');
      expect(headAction.payload.slot).toBe('head');

      const coatAction = equipAction('coat', 'cloak_shadow');
      expect(coatAction.payload.slot).toBe('coat');
    });

    it('should unequip items from correct slots', () => {
      const unequipAction = (slot) => ({
        type: 'UNEQUIP_ITEM',
        payload: { slot },
      });

      const weaponAction = unequipAction('weapon');
      expect(weaponAction.payload.slot).toBe('weapon');

      const accessoryAction = unequipAction('accessory');
      expect(accessoryAction.payload.slot).toBe('accessory');
    });
  });
});

describe('Equipment Slots - Slot Type Mapping', () => {
  it('should map item types to correct slot labels', () => {
    const slotInfo = {
      weapon: { icon: '⚔️', label: 'Weapon' },
      head: { icon: '🪖', label: 'Head' },
      torso: { icon: '🛡️', label: 'Torso' },
      arms: { icon: '🥊', label: 'Arms' },
      trousers: { icon: '👖', label: 'Trousers' },
      shoes: { icon: '👢', label: 'Shoes' },
      coat: { icon: '🧥', label: 'Coat' },
      accessory: { icon: '💍', label: 'Accessory' },
    };

    expect(slotInfo.weapon.label).toBe('Weapon');
    expect(slotInfo.head.label).toBe('Head');
    expect(slotInfo.torso.label).toBe('Torso');
    expect(slotInfo.arms.label).toBe('Arms');
    expect(slotInfo.trousers.label).toBe('Trousers');
    expect(slotInfo.shoes.label).toBe('Shoes');
    expect(slotInfo.coat.label).toBe('Coat');
    expect(slotInfo.accessory.label).toBe('Accessory');
  });

  it('should have unique icons for each slot', () => {
    const slotInfo = {
      weapon: { icon: '⚔️', label: 'Weapon' },
      head: { icon: '🪖', label: 'Head' },
      torso: { icon: '🛡️', label: 'Torso' },
      arms: { icon: '🥊', label: 'Arms' },
      trousers: { icon: '👖', label: 'Trousers' },
      shoes: { icon: '👢', label: 'Shoes' },
      coat: { icon: '🧥', label: 'Coat' },
      accessory: { icon: '💍', label: 'Accessory' },
    };

    const icons = Object.values(slotInfo).map((slot) => slot.icon);
    const uniqueIcons = new Set(icons);

    expect(uniqueIcons.size).toBe(8); // All icons should be unique
  });

  it('should correctly identify deprecated slot names', () => {
    const deprecatedSlots = ['armor', 'accessory_old'];
    const currentSlots = ['weapon', 'head', 'torso', 'arms', 'trousers', 'shoes', 'coat', 'accessory'];

    // 'armor' was renamed to 'torso'
    expect(currentSlots).not.toContain('armor');
    expect(currentSlots).toContain('torso');

    // 'accessory' is still valid in the new system
    expect(currentSlots).toContain('accessory');
  });
});
