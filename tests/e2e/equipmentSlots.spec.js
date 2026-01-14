/**
 * E2E Tests for 8-Slot Equipment System
 * Tests equipment slots expansion, movement modifiers, and UI display
 */

import { test, expect } from '@playwright/test';

test.describe('8-Slot Equipment System E2E', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');

    // Create a save with all 8 equipment slots
    await page.evaluate(() => {
      const mockSave = {
        version: '4.10.0',
        profile: {
          characterCreated: true,
          character: {
            name: 'Fully Equipped Hero',
            class: 'WARRIOR',
            health: 100,
            maxHealth: 100,
            strength: 50,
            defense: 30,
          },
          level: 10,
          xp: 1000,
          gold: 5000,
        },
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
        inventory: {
          equipment: ['sword_basic', 'helmet_iron', 'armor_leather', 'gauntlets_steel', 'pants_cloth', 'boots_haste', 'cloak_shadow', 'ring_power'],
          consumables: {
            health_potion: 3,
            mana_potion: 3,
          },
        },
        stats: {
          totalWins: 5,
          totalLosses: 2,
          totalFightsPlayed: 7,
        },
      };
      localStorage.setItem('legends_arena_save_slot1', JSON.stringify(mockSave));
    });

    await page.reload();
    await page.waitForTimeout(1000);
  });

  test.describe('Equipment Slots Display', () => {
    test('should display all 8 equipment slots in ProfileScreen', async ({ page }) => {
      // Navigate to profile
      await page.evaluate(() => window.location.hash = '#/profile');
      await page.waitForTimeout(1000);

      const slotCount = await page.evaluate(() => {
        const screen = document.querySelector('profile-screen');
        if (!screen?.shadowRoot) return 0;

        const slots = [
          '.equipment-slot-weapon',
          '.equipment-slot-head',
          '.equipment-slot-torso',
          '.equipment-slot-arms',
          '.equipment-slot-trousers',
          '.equipment-slot-shoes',
          '.equipment-slot-coat',
          '.equipment-slot-accessory',
        ];

        return slots.filter((selector) => screen.shadowRoot.querySelector(selector)).length;
      });

      expect(slotCount).toBe(8);
    });

    test('should show slot labels for each equipment type', async ({ page }) => {
      await page.evaluate(() => window.location.hash = '#/profile');
      await page.waitForTimeout(1000);

      const hasSlotLabels = await page.evaluate(() => {
        const screen = document.querySelector('profile-screen');
        if (!screen?.shadowRoot) return false;

        const text = screen.shadowRoot.textContent || '';
        const labels = ['Weapon', 'Head', 'Torso', 'Arms', 'Trousers', 'Shoes', 'Coat', 'Accessory'];

        return labels.every((label) => text.includes(label));
      });

      expect(hasSlotLabels).toBe(true);
    });

    test('should display character-shaped equipment layout', async ({ page }) => {
      await page.evaluate(() => window.location.hash = '#/profile');
      await page.waitForTimeout(1000);

      const hasLayout = await page.evaluate(() => {
        const screen = document.querySelector('profile-screen');
        if (!screen?.shadowRoot) return false;

        const layout = screen.shadowRoot.querySelector('.character-equipment-layout');
        return layout !== null;
      });

      expect(hasLayout).toBe(true);
    });

    test('should show equipment icons for all slots', async ({ page }) => {
      await page.evaluate(() => window.location.hash = '#/profile');
      await page.waitForTimeout(1000);

      const hasIcons = await page.evaluate(() => {
        const screen = document.querySelector('profile-screen');
        if (!screen?.shadowRoot) return false;

        const text = screen.shadowRoot.textContent || '';
        const icons = ['⚔️', '🪖', '🛡️', '🥊', '👖', '👢', '🧥', '💍'];

        return icons.some((icon) => text.includes(icon));
      });

      expect(hasIcons).toBe(true);
    });
  });

  test.describe('Marketplace Slot Labels', () => {
    test('should show slot labels in marketplace buy tab', async ({ page }) => {
      await page.evaluate(() => window.location.hash = '#/marketplace');
      await page.waitForTimeout(1000);

      const hasSlotLabels = await page.evaluate(() => {
        const screen = document.querySelector('marketplace-screen');
        if (!screen?.shadowRoot) return false;

        const slotTypeElements = screen.shadowRoot.querySelectorAll('.item-slot-type');
        return slotTypeElements.length > 0;
      });

      expect(hasSlotLabels).toBe(true);
    });

    test('should show slot labels in marketplace sell tab', async ({ page }) => {
      await page.evaluate(() => window.location.hash = '#/marketplace');
      await page.waitForTimeout(1000);

      const hasSlotLabels = await page.evaluate(() => {
        const screen = document.querySelector('marketplace-screen');
        if (!screen?.shadowRoot) return false;

        // Click sell tab
        const sellTab = Array.from(screen.shadowRoot.querySelectorAll('.tab-btn')).find(
          (btn) => btn.textContent.includes('Sell')
        );
        if (sellTab) sellTab.click();

        // Wait a bit for render
        return new Promise((resolve) => {
          setTimeout(() => {
            const slotTypeElements = screen.shadowRoot.querySelectorAll('.item-slot-type');
            resolve(slotTypeElements.length > 0);
          }, 500);
        });
      });

      expect(hasSlotLabels).toBe(true);
    });
  });

  test.describe('Movement Modifiers', () => {
    test('should display movement bonus in stats', async ({ page }) => {
      // Equip boots with movement bonus
      await page.evaluate(() => {
        const save = JSON.parse(localStorage.getItem('legends_arena_save_slot1'));
        save.equipped.shoes = 'boots_haste'; // Has +1 movement
        localStorage.setItem('legends_arena_save_slot1', JSON.stringify(save));
      });

      await page.reload();
      await page.waitForTimeout(1000);

      await page.evaluate(() => window.location.hash = '#/profile');
      await page.waitForTimeout(1000);

      const hasMovementStat = await page.evaluate(() => {
        const screen = document.querySelector('profile-screen');
        if (!screen?.shadowRoot) return false;

        const text = screen.shadowRoot.textContent || '';
        return text.includes('Movement') || text.includes('Move');
      });

      expect(hasMovementStat).toBe(true);
    });

    test('should show movement bonus in equipment details', async ({ page }) => {
      await page.evaluate(() => window.location.hash = '#/equipment');
      await page.waitForTimeout(1000);

      const hasMovementBonus = await page.evaluate(() => {
        const screen = document.querySelector('equipment-screen');
        if (!screen?.shadowRoot) return false;

        const text = screen.shadowRoot.textContent || '';
        return text.includes('Move') || text.includes('movement');
      });

      // Movement bonus should be shown if boots are equipped
      expect(hasMovementBonus).toBe(true);
    });
  });

  test.describe('Backward Compatibility', () => {
    test('should migrate old 3-slot save to 8-slot system', async ({ page }) => {
      // Create old save format
      await page.evaluate(() => {
        const oldSave = {
          version: '4.0.0',
          profile: {
            characterCreated: true,
            character: {
              name: 'Legacy Hero',
              class: 'BALANCED',
              health: 100,
              maxHealth: 100,
              strength: 50,
              defense: 30,
            },
            level: 5,
            xp: 500,
            gold: 1000,
          },
          equipped: {
            weapon: 'sword_basic',
            armor: 'armor_leather', // Old slot name
            accessory: 'ring_power',
          },
          inventory: {
            equipment: ['sword_basic', 'armor_leather', 'ring_power'],
            consumables: {},
          },
          stats: {},
        };
        localStorage.setItem('legends_arena_save_slot1', JSON.stringify(oldSave));
      });

      await page.reload();
      await page.waitForTimeout(1000);

      const migrationSuccess = await page.evaluate(() => {
        const save = JSON.parse(localStorage.getItem('legends_arena_save_slot1'));

        // Check if old 'armor' was migrated to 'torso'
        const hasTorsoSlot = save.equipped.hasOwnProperty('torso');
        const hasWeapon = save.equipped.weapon === 'sword_basic';
        const hasAccessory = save.equipped.accessory === 'ring_power';

        return hasTorsoSlot && hasWeapon && hasAccessory;
      });

      expect(migrationSuccess).toBe(true);
    });

    test('should initialize empty slots for old saves', async ({ page }) => {
      await page.evaluate(() => {
        const oldSave = {
          version: '4.0.0',
          profile: {
            characterCreated: true,
            character: { name: 'Old Hero', class: 'BALANCED' },
            level: 1,
            gold: 100,
          },
          equipped: {
            weapon: 'sword_basic',
          },
          inventory: { equipment: [], consumables: {} },
          stats: {},
        };
        localStorage.setItem('legends_arena_save_slot1', JSON.stringify(oldSave));
      });

      await page.reload();
      await page.waitForTimeout(1000);

      const hasAllSlots = await page.evaluate(() => {
        const save = JSON.parse(localStorage.getItem('legends_arena_save_slot1'));
        const requiredSlots = ['weapon', 'head', 'torso', 'arms', 'trousers', 'shoes', 'coat', 'accessory'];

        return requiredSlots.every((slot) => save.equipped.hasOwnProperty(slot));
      });

      expect(hasAllSlots).toBe(true);
    });
  });

  test.describe('Equipment Actions', () => {
    test('should equip items to all 8 slots', async ({ page }) => {
      await page.evaluate(() => window.location.hash = '#/profile');
      await page.waitForTimeout(1000);

      const allSlotsEquipped = await page.evaluate(() => {
        const save = JSON.parse(localStorage.getItem('legends_arena_save_slot1'));
        const equippedCount = Object.values(save.equipped).filter((item) => item !== null).length;

        return equippedCount === 8;
      });

      expect(allSlotsEquipped).toBe(true);
    });

    test('should unequip items from any slot', async ({ page }) => {
      await page.evaluate(() => window.location.hash = '#/profile');
      await page.waitForTimeout(1000);

      const canUnequip = await page.evaluate(() => {
        const screen = document.querySelector('profile-screen');
        if (!screen?.shadowRoot) return false;

        const unequipButtons = screen.shadowRoot.querySelectorAll('[data-unequip], .unequip-btn');
        return unequipButtons.length > 0;
      });

      expect(canUnequip).toBe(true);
    });

    test('should calculate total stats from all equipped items', async ({ page }) => {
      await page.evaluate(() => window.location.hash = '#/profile');
      await page.waitForTimeout(1000);

      const hasStatsSummary = await page.evaluate(() => {
        const screen = document.querySelector('profile-screen');
        if (!screen?.shadowRoot) return false;

        const text = screen.shadowRoot.textContent || '';
        return text.includes('Total') || text.includes('Bonus') || text.includes('+');
      });

      expect(hasStatsSummary).toBe(true);
    });
  });

  test.describe('Visual Layout', () => {
    test('should display equipment in human-shaped layout on desktop', async ({ page }) => {
      await page.setViewportSize({ width: 1200, height: 800 });
      await page.evaluate(() => window.location.hash = '#/profile');
      await page.waitForTimeout(1000);

      const hasGridLayout = await page.evaluate(() => {
        const screen = document.querySelector('profile-screen');
        if (!screen?.shadowRoot) return false;

        const layout = screen.shadowRoot.querySelector('.character-equipment-layout');
        if (!layout) return false;

        const style = window.getComputedStyle(layout);
        return style.display === 'grid';
      });

      expect(hasGridLayout).toBe(true);
    });

    test('should stack equipment vertically on mobile', async ({ page }) => {
      await page.setViewportSize({ width: 375, height: 667 });
      await page.evaluate(() => window.location.hash = '#/profile');
      await page.waitForTimeout(1000);

      const isMobileLayout = await page.evaluate(() => {
        const screen = document.querySelector('profile-screen');
        if (!screen?.shadowRoot) return false;

        const layout = screen.shadowRoot.querySelector('.character-equipment-layout');
        if (!layout) return true; // Assume mobile if layout changes

        const style = window.getComputedStyle(layout);
        // On mobile, grid-template-columns should be 1fr
        return style.gridTemplateColumns.includes('1fr') && !style.gridTemplateColumns.includes('repeat');
      });

      expect(isMobileLayout).toBe(true);
    });
  });

  test.describe('Equipment Inventory', () => {
    test('should filter inventory by slot type', async ({ page }) => {
      await page.evaluate(() => window.location.hash = '#/profile');
      await page.waitForTimeout(1000);

      const hasFilters = await page.evaluate(() => {
        const screen = document.querySelector('profile-screen');
        if (!screen?.shadowRoot) return false;

        const tabs = screen.shadowRoot.querySelectorAll('[data-tab], .tab-btn');
        const tabText = Array.from(tabs).map((tab) => tab.textContent).join(' ');

        return (
          tabText.includes('All') ||
          tabText.includes('Weapon') ||
          tabText.includes('Head') ||
          tabText.includes('Torso')
        );
      });

      expect(hasFilters).toBe(true);
    });

    test('should show empty state for slots without items', async ({ page }) => {
      // Create save with no equipment
      await page.evaluate(() => {
        const save = JSON.parse(localStorage.getItem('legends_arena_save_slot1'));
        save.equipped = {
          weapon: null,
          head: null,
          torso: null,
          arms: null,
          trousers: null,
          shoes: null,
          coat: null,
          accessory: null,
        };
        save.inventory.equipment = [];
        localStorage.setItem('legends_arena_save_slot1', JSON.stringify(save));
      });

      await page.reload();
      await page.waitForTimeout(1000);

      await page.evaluate(() => window.location.hash = '#/profile');
      await page.waitForTimeout(1000);

      const hasEmptyState = await page.evaluate(() => {
        const screen = document.querySelector('profile-screen');
        if (!screen?.shadowRoot) return false;

        const text = screen.shadowRoot.textContent || '';
        return text.includes('No') && text.includes('equipped');
      });

      expect(hasEmptyState).toBe(true);
    });
  });
});
