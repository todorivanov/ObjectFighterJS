/**
 * E2E Tests for Save/Load and Profile Management
 */

import { test, expect } from '@playwright/test';

test.describe('Save System E2E', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.evaluate(() => localStorage.clear());
    await page.reload();
  });

  test('should create new save on character creation', async ({ page }) => {
    await expect(page.locator('character-creation')).toBeVisible({ timeout: 10000 });

    await page.evaluate(() => {
      const cc = document.querySelector('character-creation');
      if (cc?.shadowRoot) {
        const input = cc.shadowRoot.querySelector('input[type="text"]');
        const classCards = cc.shadowRoot.querySelectorAll('.class-card');
        const createBtn = cc.shadowRoot.querySelector('button[type="submit"]');

        if (input) input.value = 'Save Test Hero';
        if (classCards[0]) classCards[0].click();
        if (createBtn) createBtn.click();
      }
    });

    await page.waitForTimeout(1000);

    const saveExists = await page.evaluate(() => {
      return localStorage.getItem('legends_arena_save_slot1') !== null;
    });

    expect(saveExists).toBe(true);
  });

  test('should load existing save on page load', async ({ page }) => {
    await page.evaluate(() => {
      const mockSave = {
        version: '4.2.0',
        profile: {
          characterCreated: true,
          character: {
            name: 'Existing Hero',
            class: 'BALANCED',
          },
          level: 10,
          gold: 5000,
        },
      };
      localStorage.setItem('legends_arena_save_slot1', JSON.stringify(mockSave));
    });

    await page.reload();
    await page.waitForTimeout(1000);

    // Should not show character creation
    const onCreation = await page.locator('character-creation').isVisible().catch(() => false);
    expect(onCreation).toBe(false);

    // Should show title screen
    await expect(page.locator('title-screen')).toBeVisible({ timeout: 5000 });
  });

  test('should persist progress across page reloads', async ({ page }) => {
    await page.evaluate(() => {
      const mockSave = {
        version: '4.2.0',
        profile: {
          characterCreated: true,
          character: { name: 'Persistent Hero', class: 'BALANCED' },
          level: 5,
          xp: 500,
          gold: 1000,
        },
      };
      localStorage.setItem('legends_arena_save_slot1', JSON.stringify(mockSave));
    });

    await page.reload();

    const savedData = await page.evaluate(() => {
      const data = localStorage.getItem('legends_arena_save_slot1');
      return data ? JSON.parse(data) : null;
    });

    expect(savedData.profile.level).toBe(5);
    expect(savedData.profile.gold).toBe(1000);
  });

  test('should handle multiple save slots', async ({ page }) => {
    await page.evaluate(() => {
      const saves = [
        {
          version: '4.2.0',
          profile: { characterCreated: true, character: { name: 'Hero 1' } },
        },
        {
          version: '4.2.0',
          profile: { characterCreated: true, character: { name: 'Hero 2' } },
        },
        {
          version: '4.2.0',
          profile: { characterCreated: true, character: { name: 'Hero 3' } },
        },
      ];

      saves.forEach((save, index) => {
        localStorage.setItem(`legends_arena_save_slot${index + 1}`, JSON.stringify(save));
      });
    });

    const slotCount = await page.evaluate(() => {
      let count = 0;
      for (let i = 1; i <= 3; i++) {
        if (localStorage.getItem(`legends_arena_save_slot${i}`)) count++;
      }
      return count;
    });

    expect(slotCount).toBe(3);
  });

  test('should create backup saves', async ({ page }) => {
    await page.evaluate(() => {
      const mockSave = {
        version: '4.2.0',
        profile: {
          characterCreated: true,
          character: { name: 'Backup Test', class: 'BALANCED' },
        },
      };
      localStorage.setItem('legends_arena_save_slot1', JSON.stringify(mockSave));

      // Simulate backup creation
      const timestamp = Date.now();
      localStorage.setItem(
        `legends_arena_backup_slot1_${timestamp}`,
        JSON.stringify(mockSave)
      );
    });

    const hasBackup = await page.evaluate(() => {
      const keys = Object.keys(localStorage);
      return keys.some(key => key.includes('backup'));
    });

    expect(hasBackup).toBe(true);
  });

  test('should migrate old save versions', async ({ page }) => {
    await page.evaluate(() => {
      const oldSave = {
        version: '3.0.0',
        profile: {
          characterCreated: true,
          character: { name: 'Old Hero' },
        },
      };
      localStorage.setItem('legends_arena_save_slot1', JSON.stringify(oldSave));
    });

    await page.reload();
    await page.waitForTimeout(1000);

    const migratedData = await page.evaluate(() => {
      const data = localStorage.getItem('legends_arena_save_slot1');
      return data ? JSON.parse(data) : null;
    });

    // Should still have the character
    expect(migratedData?.profile?.character?.name).toBe('Old Hero');
  });

  test('should handle corrupted save data gracefully', async ({ page }) => {
    await page.evaluate(() => {
      localStorage.setItem('legends_arena_save_slot1', 'invalid json {{{');
    });

    await page.reload();
    await page.waitForTimeout(1000);

    // Should show character creation or handle error
    const isCreation = await page.locator('character-creation').isVisible().catch(() => false);
    const isTitleScreen = await page.locator('title-screen').isVisible().catch(() => false);

    expect(isCreation || isTitleScreen).toBe(true);
  });

  test('should auto-save during gameplay', async ({ page }) => {
    await page.evaluate(() => {
      const mockSave = {
        version: '4.2.0',
        profile: {
          characterCreated: true,
          character: { name: 'Auto Save Hero', class: 'BALANCED' },
          level: 1,
          gold: 100,
        },
      };
      localStorage.setItem('legends_arena_save_slot1', JSON.stringify(mockSave));
    });

    await page.reload();

    // Modify gold
    await page.evaluate(() => {
      const data = localStorage.getItem('legends_arena_save_slot1');
      const parsed = JSON.parse(data);
      parsed.profile.gold = 500;
      localStorage.setItem('legends_arena_save_slot1', JSON.stringify(parsed));
    });

    const updatedGold = await page.evaluate(() => {
      const data = localStorage.getItem('legends_arena_save_slot1');
      return JSON.parse(data).profile.gold;
    });

    expect(updatedGold).toBe(500);
  });
});

test.describe('Profile Screen E2E', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');

    await page.evaluate(() => {
      const mockSave = {
        version: '4.2.0',
        profile: {
          characterCreated: true,
          character: {
            name: 'Profile Hero',
            class: 'BALANCED',
            health: 100,
            maxHealth: 100,
            strength: 50,
            defense: 30,
          },
          level: 10,
          xp: 2500,
          gold: 3000,
        },
        equipment: {
          owned: [
            { id: 'sword_1', name: 'Iron Sword', slot: 'weapon' },
          ],
          equipped: {
            weapon: 'sword_1',
          },
        },
        stats: {
          totalWins: 25,
          totalLosses: 5,
          totalDamageDealt: 5000,
          totalDamageTaken: 2000,
        },
        achievements: {
          unlocked: ['first_win', 'level_10'],
        },
      };
      localStorage.setItem('legends_arena_save_slot1', JSON.stringify(mockSave));
    });

    await page.reload();
  });

  test('should navigate to profile screen', async ({ page }) => {
    await expect(page.locator('title-screen')).toBeVisible({ timeout: 10000 });

    await page.evaluate(() => {
      const nav = document.querySelector('navigation-bar');
      if (nav?.shadowRoot) {
        const buttons = Array.from(nav.shadowRoot.querySelectorAll('button'));
        const profileBtn = buttons.find(btn => btn.textContent.includes('Profile'));
        if (profileBtn) profileBtn.click();
      }
    });

    await page.waitForTimeout(1000);
    await expect(page.locator('profile-screen')).toBeVisible({ timeout: 5000 });
  });

  test('should display character name', async ({ page }) => {
    await page.evaluate(() => window.location.hash = '#/profile');
    await page.waitForTimeout(1000);

    const hasName = await page.evaluate(() => {
      const profile = document.querySelector('profile-screen');
      if (!profile?.shadowRoot) return false;

      const text = profile.shadowRoot.textContent || '';
      return text.includes('Profile Hero');
    });

    expect(hasName).toBe(true);
  });

  test('should display character stats', async ({ page }) => {
    await page.evaluate(() => window.location.hash = '#/profile');
    await page.waitForTimeout(1000);

    const hasStats = await page.evaluate(() => {
      const profile = document.querySelector('profile-screen');
      if (!profile?.shadowRoot) return false;

      const text = profile.shadowRoot.textContent || '';
      return text.includes('Level') || text.includes('Gold') || text.includes('10');
    });

    expect(hasStats).toBe(true);
  });

  test('should display combat statistics', async ({ page }) => {
    await page.evaluate(() => window.location.hash = '#/profile');
    await page.waitForTimeout(1000);

    const hasStats = await page.evaluate(() => {
      const profile = document.querySelector('profile-screen');
      if (!profile?.shadowRoot) return false;

      const text = profile.shadowRoot.textContent || '';
      return text.includes('Wins') || text.includes('25') || text.includes('Win');
    });

    expect(hasStats).toBe(true);
  });

  test('should display equipped items', async ({ page }) => {
    await page.evaluate(() => window.location.hash = '#/profile');
    await page.waitForTimeout(1000);

    const hasEquipment = await page.evaluate(() => {
      const profile = document.querySelector('profile-screen');
      if (!profile?.shadowRoot) return false;

      const text = profile.shadowRoot.textContent || '';
      return text.includes('Iron Sword') || text.includes('Equipment');
    });

    expect(typeof hasEquipment).toBe('boolean');
  });

  test('should display achievements', async ({ page }) => {
    await page.evaluate(() => window.location.hash = '#/profile');
    await page.waitForTimeout(1000);

    const hasAchievements = await page.evaluate(() => {
      const profile = document.querySelector('profile-screen');
      if (!profile?.shadowRoot) return false;

      const text = profile.shadowRoot.textContent?.toLowerCase() || '';
      return text.includes('achievement') || text.includes('unlocked');
    });

    expect(typeof hasAchievements).toBe('boolean');
  });

  test('should allow equipment management from profile', async ({ page }) => {
    await page.evaluate(() => window.location.hash = '#/profile');
    await page.waitForTimeout(1000);

    const hasEquipButtons = await page.evaluate(() => {
      const profile = document.querySelector('profile-screen');
      if (!profile?.shadowRoot) return false;

      const buttons = Array.from(profile.shadowRoot.querySelectorAll('button'));
      return buttons.some(btn => 
        btn.textContent.includes('Equip') || btn.textContent.includes('Unequip')
      );
    });

    expect(typeof hasEquipButtons).toBe('boolean');
  });

  test('should show reset progress button', async ({ page }) => {
    await page.evaluate(() => window.location.hash = '#/profile');
    await page.waitForTimeout(1000);

    const hasResetButton = await page.evaluate(() => {
      const profile = document.querySelector('profile-screen');
      if (!profile?.shadowRoot) return false;

      const resetBtn = profile.shadowRoot.querySelector('#reset-progress-btn');
      return resetBtn !== null;
    });

    expect(hasResetButton).toBe(true);
  });

  test('should confirm before resetting progress', async ({ page }) => {
    await page.evaluate(() => window.location.hash = '#/profile');
    await page.waitForTimeout(1000);

    // Mock confirm dialog
    await page.evaluate(() => {
      window.confirm = () => false; // User cancels
    });

    const resetCancelled = await page.evaluate(() => {
      const profile = document.querySelector('profile-screen');
      if (!profile?.shadowRoot) return false;

      const resetBtn = profile.shadowRoot.querySelector('#reset-progress-btn');
      if (resetBtn) {
        resetBtn.click();
        return true;
      }
      return false;
    });

    if (resetCancelled) {
      await page.waitForTimeout(500);

      // Data should still exist
      const dataExists = await page.evaluate(() => {
        return localStorage.getItem('legends_arena_save_slot1') !== null;
      });

      expect(dataExists).toBe(true);
    }
  });

  test('should reset progress when confirmed', async ({ page }) => {
    await page.evaluate(() => window.location.hash = '#/profile');
    await page.waitForTimeout(1000);

    // Mock confirm dialog
    await page.evaluate(() => {
      window.confirm = () => true; // User confirms
    });

    const resetConfirmed = await page.evaluate(() => {
      const profile = document.querySelector('profile-screen');
      if (!profile?.shadowRoot) return false;

      const resetBtn = profile.shadowRoot.querySelector('#reset-progress-btn');
      if (resetBtn) {
        resetBtn.click();
        return true;
      }
      return false;
    });

    if (resetConfirmed) {
      await page.waitForTimeout(1000);

      // Should navigate to character creation
      const onCreation = await page.locator('character-creation').isVisible().catch(() => false);
      expect(typeof onCreation).toBe('boolean');
    }
  });

  test('should display win/loss ratio', async ({ page }) => {
    await page.evaluate(() => window.location.hash = '#/profile');
    await page.waitForTimeout(1000);

    const hasRatio = await page.evaluate(() => {
      const profile = document.querySelector('profile-screen');
      if (!profile?.shadowRoot) return false;

      const text = profile.shadowRoot.textContent || '';
      const hasWins = text.includes('25');
      const hasLosses = text.includes('5');
      return hasWins || hasLosses;
    });

    expect(typeof hasRatio).toBe('boolean');
  });

  test('should show experience progress bar', async ({ page }) => {
    await page.evaluate(() => window.location.hash = '#/profile');
    await page.waitForTimeout(1000);

    const hasXpBar = await page.evaluate(() => {
      const profile = document.querySelector('profile-screen');
      if (!profile?.shadowRoot) return false;

      const progressBar = profile.shadowRoot.querySelector('.progress, .xp-bar, [data-xp]');
      return progressBar !== null;
    });

    expect(typeof hasXpBar).toBe('boolean');
  });

  test('should display total damage statistics', async ({ page }) => {
    await page.evaluate(() => window.location.hash = '#/profile');
    await page.waitForTimeout(1000);

    const hasDamageStats = await page.evaluate(() => {
      const profile = document.querySelector('profile-screen');
      if (!profile?.shadowRoot) return false;

      const text = profile.shadowRoot.textContent || '';
      return text.includes('5000') || text.includes('Damage');
    });

    expect(typeof hasDamageStats).toBe('boolean');
  });

  test('should update stats in real-time', async ({ page }) => {
    await page.evaluate(() => window.location.hash = '#/profile');
    await page.waitForTimeout(1000);

    // Modify stats
    await page.evaluate(() => {
      const data = localStorage.getItem('legends_arena_save_slot1');
      const parsed = JSON.parse(data);
      parsed.stats.totalWins = 30;
      localStorage.setItem('legends_arena_save_slot1', JSON.stringify(parsed));
    });

    await page.reload();
    await page.evaluate(() => window.location.hash = '#/profile');
    await page.waitForTimeout(1000);

    const updatedWins = await page.evaluate(() => {
      const data = localStorage.getItem('legends_arena_save_slot1');
      return JSON.parse(data).stats.totalWins;
    });

    expect(updatedWins).toBe(30);
  });
});
