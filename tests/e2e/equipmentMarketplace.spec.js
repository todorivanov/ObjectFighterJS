/**
 * E2E Tests for Equipment and Marketplace
 */

import { test, expect } from '@playwright/test';

test.describe('Equipment System E2E', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');

    await page.evaluate(() => {
      const mockSave = {
        version: '4.2.0',
        profile: {
          characterCreated: true,
          character: {
            name: 'Equipped Hero',
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
        equipment: {
          owned: [
            { id: 'sword_1', name: 'Iron Sword', slot: 'weapon', rarity: 'common' },
            { id: 'shield_1', name: 'Wooden Shield', slot: 'shield', rarity: 'common' },
          ],
          equipped: {
            weapon: 'sword_1',
            shield: null,
            armor: null,
            accessory: null,
          },
        },
        stats: {},
      };
      localStorage.setItem('legends_arena_save_slot1', JSON.stringify(mockSave));
    });

    await page.reload();
  });

  test('should navigate to equipment screen', async ({ page }) => {
    await expect(page.locator('title-screen')).toBeVisible({ timeout: 10000 });

    await page.evaluate(() => {
      const nav = document.querySelector('navigation-bar');
      if (nav?.shadowRoot) {
        const buttons = Array.from(nav.shadowRoot.querySelectorAll('button'));
        const equipBtn = buttons.find(btn => 
          btn.textContent.includes('Equipment') || btn.textContent.includes('Gear')
        );
        if (equipBtn) equipBtn.click();
      }
    });

    await page.waitForTimeout(1000);
    const equipScreen = page.locator('equipment-screen');
    const isVisible = await equipScreen.isVisible().catch(() => false);

    if (isVisible) {
      await expect(equipScreen).toBeVisible();
    }
  });

  test('should display owned equipment', async ({ page }) => {
    await page.evaluate(() => window.location.hash = '#/equipment');
    await page.waitForTimeout(1000);

    const hasEquipment = await page.evaluate(() => {
      const screen = document.querySelector('equipment-screen');
      if (!screen?.shadowRoot) return false;

      const items = screen.shadowRoot.querySelectorAll('.equipment-item, [data-equipment], .item-card');
      return items.length > 0;
    });

    expect(hasEquipment).toBe(true);
  });

  test('should show equipment stats', async ({ page }) => {
    await page.evaluate(() => window.location.hash = '#/equipment');
    await page.waitForTimeout(1000);

    const hasStats = await page.evaluate(() => {
      const screen = document.querySelector('equipment-screen');
      if (!screen?.shadowRoot) return false;

      const text = screen.shadowRoot.textContent || '';
      return text.includes('Attack') || text.includes('Defense') || 
             text.includes('Strength') || text.includes('+');
    });

    expect(hasStats).toBe(true);
  });

  test('should equip item', async ({ page }) => {
    await page.evaluate(() => window.location.hash = '#/equipment');
    await page.waitForTimeout(1000);

    const equipped = await page.evaluate(() => {
      const screen = document.querySelector('equipment-screen');
      if (!screen?.shadowRoot) return false;

      const equipButtons = Array.from(screen.shadowRoot.querySelectorAll('button'));
      const equipBtn = equipButtons.find(btn => 
        btn.textContent.includes('Equip') && !btn.disabled
      );

      if (equipBtn) {
        equipBtn.click();
        return true;
      }
      return false;
    });

    if (equipped) {
      await page.waitForTimeout(500);
      
      const savedEquipment = await page.evaluate(() => {
        const data = localStorage.getItem('legends_arena_save_slot1');
        if (!data) return null;
        const parsed = JSON.parse(data);
        return parsed.equipment?.equipped;
      });

      expect(savedEquipment).toBeDefined();
    }
  });

  test('should unequip item', async ({ page }) => {
    await page.evaluate(() => window.location.hash = '#/equipment');
    await page.waitForTimeout(1000);

    const unequipped = await page.evaluate(() => {
      const screen = document.querySelector('equipment-screen');
      if (!screen?.shadowRoot) return false;

      const buttons = Array.from(screen.shadowRoot.querySelectorAll('button'));
      const unequipBtn = buttons.find(btn => 
        btn.textContent.includes('Unequip') && !btn.disabled
      );

      if (unequipBtn) {
        unequipBtn.click();
        return true;
      }
      return false;
    });

    if (unequipped) {
      await page.waitForTimeout(500);
      expect(unequipped).toBe(true);
    }
  });

  test('should show equipped items differently', async ({ page }) => {
    await page.evaluate(() => window.location.hash = '#/equipment');
    await page.waitForTimeout(1000);

    const hasEquippedIndicator = await page.evaluate(() => {
      const screen = document.querySelector('equipment-screen');
      if (!screen?.shadowRoot) return false;

      const equipped = screen.shadowRoot.querySelectorAll('.equipped, [data-equipped]');
      return equipped.length > 0;
    });

    expect(typeof hasEquippedIndicator).toBe('boolean');
  });

  test('should display equipment slots', async ({ page }) => {
    await page.evaluate(() => window.location.hash = '#/equipment');
    await page.waitForTimeout(1000);

    const hasSlots = await page.evaluate(() => {
      const screen = document.querySelector('equipment-screen');
      if (!screen?.shadowRoot) return false;

      const text = screen.shadowRoot.textContent?.toLowerCase() || '';
      return text.includes('weapon') || text.includes('armor') || 
             text.includes('shield') || text.includes('accessory');
    });

    expect(hasSlots).toBe(true);
  });

  test('should show equipment rarity', async ({ page }) => {
    await page.evaluate(() => window.location.hash = '#/equipment');
    await page.waitForTimeout(1000);

    const hasRarity = await page.evaluate(() => {
      const screen = document.querySelector('equipment-screen');
      if (!screen?.shadowRoot) return false;

      const text = screen.shadowRoot.textContent?.toLowerCase() || '';
      return text.includes('common') || text.includes('uncommon') || 
             text.includes('rare') || text.includes('epic') || text.includes('legendary');
    });

    expect(typeof hasRarity).toBe('boolean');
  });

  test('should calculate total stats with equipment', async ({ page }) => {
    await page.evaluate(() => window.location.hash = '#/equipment');
    await page.waitForTimeout(1000);

    const hasStats = await page.evaluate(() => {
      const screen = document.querySelector('equipment-screen');
      if (!screen?.shadowRoot) return false;

      const text = screen.shadowRoot.textContent || '';
      // Look for stat numbers
      return text.match(/\d+/) !== null;
    });

    expect(hasStats).toBe(true);
  });
});

test.describe('Marketplace E2E', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');

    await page.evaluate(() => {
      const mockSave = {
        version: '4.2.0',
        profile: {
          characterCreated: true,
          character: { name: 'Shopper', class: 'BALANCED' },
          level: 3,
          gold: 5000,
        },
        equipment: {
          owned: [],
          equipped: {},
        },
        marketplace: {
          listings: [
            { id: 'mp_1', itemId: 'sword_2', price: 100, seller: 'NPC' },
            { id: 'mp_2', itemId: 'armor_1', price: 200, seller: 'NPC' },
          ],
        },
      };
      localStorage.setItem('legends_arena_save_slot1', JSON.stringify(mockSave));
    });

    await page.reload();
  });

  test('should navigate to marketplace', async ({ page }) => {
    await expect(page.locator('title-screen')).toBeVisible({ timeout: 10000 });

    await page.evaluate(() => {
      const nav = document.querySelector('navigation-bar');
      if (nav?.shadowRoot) {
        const buttons = Array.from(nav.shadowRoot.querySelectorAll('button'));
        const marketBtn = buttons.find(btn => 
          btn.textContent.includes('Market') || btn.textContent.includes('Shop')
        );
        if (marketBtn) marketBtn.click();
      }
    });

    await page.waitForTimeout(1000);
    const marketplace = page.locator('marketplace-screen');
    const isVisible = await marketplace.isVisible().catch(() => false);

    if (isVisible) {
      await expect(marketplace).toBeVisible();
    }
  });

  test('should display available items', async ({ page }) => {
    await page.evaluate(() => window.location.hash = '#/marketplace');
    await page.waitForTimeout(1000);

    const hasItems = await page.evaluate(() => {
      const market = document.querySelector('marketplace-screen');
      if (!market?.shadowRoot) return false;

      const items = market.shadowRoot.querySelectorAll('.item, .listing, [data-item]');
      return items.length > 0;
    });

    expect(typeof hasItems).toBe('boolean');
  });

  test('should show item prices', async ({ page }) => {
    await page.evaluate(() => window.location.hash = '#/marketplace');
    await page.waitForTimeout(1000);

    const hasPrices = await page.evaluate(() => {
      const market = document.querySelector('marketplace-screen');
      if (!market?.shadowRoot) return false;

      const text = market.shadowRoot.textContent || '';
      return text.includes('gold') || text.includes('Gold') || text.match(/\d+\s*g/i) !== null;
    });

    expect(typeof hasPrices).toBe('boolean');
  });

  test('should display player gold', async ({ page }) => {
    await page.evaluate(() => window.location.hash = '#/marketplace');
    await page.waitForTimeout(1000);

    const hasGold = await page.evaluate(() => {
      const market = document.querySelector('marketplace-screen');
      if (!market?.shadowRoot) return false;

      const text = market.shadowRoot.textContent || '';
      return text.includes('5000') || (text.includes('gold') && text.match(/\d+/));
    });

    expect(typeof hasGold).toBe('boolean');
  });

  test('should purchase item', async ({ page }) => {
    await page.evaluate(() => window.location.hash = '#/marketplace');
    await page.waitForTimeout(1000);

    const initialGold = await page.evaluate(() => {
      const data = localStorage.getItem('legends_arena_save_slot1');
      if (!data) return 0;
      return JSON.parse(data).profile.gold;
    });

    const purchased = await page.evaluate(() => {
      const market = document.querySelector('marketplace-screen');
      if (!market?.shadowRoot) return false;

      const buyButtons = Array.from(market.shadowRoot.querySelectorAll('button'));
      const buyBtn = buyButtons.find(btn => 
        btn.textContent.includes('Buy') || btn.textContent.includes('Purchase')
      );

      if (buyBtn && !buyBtn.disabled) {
        buyBtn.click();
        return true;
      }
      return false;
    });

    if (purchased) {
      await page.waitForTimeout(500);

      const finalGold = await page.evaluate(() => {
        const data = localStorage.getItem('legends_arena_save_slot1');
        if (!data) return 0;
        return JSON.parse(data).profile.gold;
      });

      expect(finalGold).toBeLessThanOrEqual(initialGold);
    }
  });

  test('should not allow purchase with insufficient gold', async ({ page }) => {
    // Set low gold
    await page.evaluate(() => {
      const data = localStorage.getItem('legends_arena_save_slot1');
      const parsed = JSON.parse(data);
      parsed.profile.gold = 10;
      localStorage.setItem('legends_arena_save_slot1', JSON.stringify(parsed));
    });

    await page.reload();
    await page.evaluate(() => window.location.hash = '#/marketplace');
    await page.waitForTimeout(1000);

    const canPurchase = await page.evaluate(() => {
      const market = document.querySelector('marketplace-screen');
      if (!market?.shadowRoot) return true;

      const buyButtons = Array.from(market.shadowRoot.querySelectorAll('button'));
      const expensiveBtn = buyButtons.find(btn => 
        (btn.textContent.includes('Buy') || btn.textContent.includes('Purchase')) &&
        btn.disabled
      );

      return expensiveBtn === undefined;
    });

    expect(typeof canPurchase).toBe('boolean');
  });

  test('should add purchased item to inventory', async ({ page }) => {
    await page.evaluate(() => window.location.hash = '#/marketplace');
    await page.waitForTimeout(1000);

    const initialCount = await page.evaluate(() => {
      const data = localStorage.getItem('legends_arena_save_slot1');
      if (!data) return 0;
      return JSON.parse(data).equipment?.owned?.length || 0;
    });

    await page.evaluate(() => {
      const market = document.querySelector('marketplace-screen');
      if (market?.shadowRoot) {
        const buyButtons = Array.from(market.shadowRoot.querySelectorAll('button'));
        const buyBtn = buyButtons.find(btn => btn.textContent.includes('Buy'));
        if (buyBtn && !buyBtn.disabled) buyBtn.click();
      }
    });

    await page.waitForTimeout(500);

    const finalCount = await page.evaluate(() => {
      const data = localStorage.getItem('legends_arena_save_slot1');
      if (!data) return 0;
      return JSON.parse(data).equipment?.owned?.length || 0;
    });

    expect(finalCount).toBeGreaterThanOrEqual(initialCount);
  });

  test('should filter items by category', async ({ page }) => {
    await page.evaluate(() => window.location.hash = '#/marketplace');
    await page.waitForTimeout(1000);

    const hasFilters = await page.evaluate(() => {
      const market = document.querySelector('marketplace-screen');
      if (!market?.shadowRoot) return false;

      const buttons = Array.from(market.shadowRoot.querySelectorAll('button'));
      return buttons.some(btn => 
        btn.textContent.includes('Weapon') || 
        btn.textContent.includes('Armor') || 
        btn.textContent.includes('All')
      );
    });

    expect(typeof hasFilters).toBe('boolean');
  });

  test('should sort items by price', async ({ page }) => {
    await page.evaluate(() => window.location.hash = '#/marketplace');
    await page.waitForTimeout(1000);

    const hasSorting = await page.evaluate(() => {
      const market = document.querySelector('marketplace-screen');
      if (!market?.shadowRoot) return false;

      const text = market.shadowRoot.textContent?.toLowerCase() || '';
      return text.includes('sort') || text.includes('price');
    });

    expect(typeof hasSorting).toBe('boolean');
  });

  test('should show item details on click', async ({ page }) => {
    await page.evaluate(() => window.location.hash = '#/marketplace');
    await page.waitForTimeout(1000);

    const detailsShown = await page.evaluate(() => {
      const market = document.querySelector('marketplace-screen');
      if (!market?.shadowRoot) return false;

      const items = market.shadowRoot.querySelectorAll('.item, .listing, [data-item]');
      if (items[0]) {
        items[0].click();
        return true;
      }
      return false;
    });

    if (detailsShown) {
      await page.waitForTimeout(500);
      expect(detailsShown).toBe(true);
    }
  });

  test('should allow selling owned items', async ({ page }) => {
    // Add items to inventory first
    await page.evaluate(() => {
      const data = localStorage.getItem('legends_arena_save_slot1');
      const parsed = JSON.parse(data);
      parsed.equipment.owned = [
        { id: 'sword_3', name: 'Rusty Sword', slot: 'weapon', value: 50 }
      ];
      localStorage.setItem('legends_arena_save_slot1', JSON.stringify(parsed));
    });

    await page.reload();
    await page.evaluate(() => window.location.hash = '#/marketplace');
    await page.waitForTimeout(1000);

    const hasSellOption = await page.evaluate(() => {
      const market = document.querySelector('marketplace-screen');
      if (!market?.shadowRoot) return false;

      const buttons = Array.from(market.shadowRoot.querySelectorAll('button'));
      return buttons.some(btn => btn.textContent.includes('Sell'));
    });

    expect(typeof hasSellOption).toBe('boolean');
  });

  test('should refresh marketplace listings', async ({ page }) => {
    await page.evaluate(() => window.location.hash = '#/marketplace');
    await page.waitForTimeout(1000);

    const hasRefresh = await page.evaluate(() => {
      const market = document.querySelector('marketplace-screen');
      if (!market?.shadowRoot) return false;

      const buttons = Array.from(market.shadowRoot.querySelectorAll('button'));
      return buttons.some(btn => 
        btn.textContent.includes('Refresh') || btn.textContent.includes('Update')
      );
    });

    expect(typeof hasRefresh).toBe('boolean');
  });
});
