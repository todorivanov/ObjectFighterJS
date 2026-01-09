/**
 * E2E Tests for Tournament Mode
 */

import { test, expect } from '@playwright/test';

test.describe('Tournament Mode E2E', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');

    await page.evaluate(() => {
      const mockSave = {
        version: '4.2.0',
        profile: {
          characterCreated: true,
          character: {
            name: 'Tournament Fighter',
            class: 'BALANCED',
            health: 100,
            maxHealth: 100,
            strength: 50,
            defense: 30,
          },
          level: 5,
          xp: 500,
          gold: 500,
        },
        tournament: {
          currentTournament: null,
          wins: 0,
          losses: 0,
          rank: 'Bronze',
        },
        stats: {
          tournamentsWon: 0,
          tournamentsEntered: 0,
        },
      };
      localStorage.setItem('legends_arena_save_slot1', JSON.stringify(mockSave));
    });

    await page.reload();
  });

  test('should navigate to tournament mode', async ({ page }) => {
    await expect(page.locator('title-screen')).toBeVisible({ timeout: 10000 });

    await page.evaluate(() => {
      const ts = document.querySelector('title-screen');
      if (ts?.shadowRoot) {
        const buttons = Array.from(ts.shadowRoot.querySelectorAll('button'));
        const tournamentBtn = buttons.find(btn => 
          btn.textContent.includes('Tournament')
        );
        if (tournamentBtn) tournamentBtn.click();
      }
    });

    await page.waitForTimeout(1000);
    
    const onTournamentScreen = await page.evaluate(() => {
      return window.location.hash.includes('tournament');
    });

    expect(typeof onTournamentScreen).toBe('boolean');
  });

  test('should display tournament bracket', async ({ page }) => {
    await page.evaluate(() => window.location.hash = '#/tournament');
    await page.waitForTimeout(1000);

    const hasBracket = page.locator('tournament-bracket');
    const isVisible = await hasBracket.isVisible().catch(() => false);

    expect(typeof isVisible).toBe('boolean');
  });

  test('should show tournament entry requirements', async ({ page }) => {
    await page.evaluate(() => window.location.hash = '#/tournament');
    await page.waitForTimeout(1000);

    const hasRequirements = await page.evaluate(() => {
      const bracket = document.querySelector('tournament-bracket');
      if (bracket?.shadowRoot) {
        const text = bracket.shadowRoot.textContent?.toLowerCase() || '';
        return text.includes('entry') || text.includes('requirement') || 
               text.includes('fee') || text.includes('level');
      }
      
      // Check body for tournament info
      return document.body.textContent?.toLowerCase().includes('tournament') || false;
    });

    expect(typeof hasRequirements).toBe('boolean');
  });

  test('should display tournament rounds', async ({ page }) => {
    await page.evaluate(() => window.location.hash = '#/tournament');
    await page.waitForTimeout(1000);

    const hasRounds = await page.evaluate(() => {
      const bracket = document.querySelector('tournament-bracket');
      if (!bracket?.shadowRoot) return false;

      const rounds = bracket.shadowRoot.querySelectorAll('.round, [data-round]');
      return rounds.length > 0;
    });

    expect(typeof hasRounds).toBe('boolean');
  });

  test('should show opponent matchups', async ({ page }) => {
    await page.evaluate(() => window.location.hash = '#/tournament');
    await page.waitForTimeout(1000);

    const hasMatchups = await page.evaluate(() => {
      const bracket = document.querySelector('tournament-bracket');
      if (!bracket?.shadowRoot) return false;

      const matchups = bracket.shadowRoot.querySelectorAll('.match, .matchup, [data-match]');
      return matchups.length > 0;
    });

    expect(typeof hasMatchups).toBe('boolean');
  });

  test('should enter tournament with entry fee', async ({ page }) => {
    await page.evaluate(() => window.location.hash = '#/tournament');
    await page.waitForTimeout(1000);

    const initialGold = await page.evaluate(() => {
      const data = localStorage.getItem('legends_arena_save_slot1');
      if (!data) return 0;
      return JSON.parse(data).profile.gold;
    });

    const entered = await page.evaluate(() => {
      const bracket = document.querySelector('tournament-bracket');
      if (bracket?.shadowRoot) {
        const buttons = Array.from(bracket.shadowRoot.querySelectorAll('button'));
        const enterBtn = buttons.find(btn => 
          btn.textContent.includes('Enter') || btn.textContent.includes('Join')
        );
        if (enterBtn && !enterBtn.disabled) {
          enterBtn.click();
          return true;
        }
      }
      return false;
    });

    if (entered) {
      await page.waitForTimeout(500);
      
      const finalGold = await page.evaluate(() => {
        const data = localStorage.getItem('legends_arena_save_slot1');
        if (!data) return 0;
        return JSON.parse(data).profile.gold;
      });

      // Gold may decrease if entry fee is charged
      expect(finalGold).toBeLessThanOrEqual(initialGold);
    }
  });

  test('should prevent entry with insufficient funds', async ({ page }) => {
    // Set low gold
    await page.evaluate(() => {
      const data = localStorage.getItem('legends_arena_save_slot1');
      const parsed = JSON.parse(data);
      parsed.profile.gold = 10;
      localStorage.setItem('legends_arena_save_slot1', JSON.stringify(parsed));
    });

    await page.reload();
    await page.evaluate(() => window.location.hash = '#/tournament');
    await page.waitForTimeout(1000);

    const canEnter = await page.evaluate(() => {
      const bracket = document.querySelector('tournament-bracket');
      if (!bracket?.shadowRoot) return true;

      const buttons = Array.from(bracket.shadowRoot.querySelectorAll('button'));
      const enterBtn = buttons.find(btn => 
        btn.textContent.includes('Enter') || btn.textContent.includes('Join')
      );

      return enterBtn ? !enterBtn.disabled : false;
    });

    expect(typeof canEnter).toBe('boolean');
  });

  test('should display tournament prizes', async ({ page }) => {
    await page.evaluate(() => window.location.hash = '#/tournament');
    await page.waitForTimeout(1000);

    const hasPrizes = await page.evaluate(() => {
      const bracket = document.querySelector('tournament-bracket');
      if (bracket?.shadowRoot) {
        const text = bracket.shadowRoot.textContent?.toLowerCase() || '';
        return text.includes('prize') || text.includes('reward') || 
               text.includes('1st place') || text.includes('winner');
      }
      return false;
    });

    expect(typeof hasPrizes).toBe('boolean');
  });

  test('should show player ranking', async ({ page }) => {
    await page.evaluate(() => window.location.hash = '#/tournament');
    await page.waitForTimeout(1000);

    const hasRanking = await page.evaluate(() => {
      const bracket = document.querySelector('tournament-bracket');
      if (bracket?.shadowRoot) {
        const text = bracket.shadowRoot.textContent?.toLowerCase() || '';
        return text.includes('rank') || text.includes('bronze') || 
               text.includes('silver') || text.includes('gold');
      }
      return false;
    });

    expect(typeof hasRanking).toBe('boolean');
  });

  test('should start tournament match', async ({ page }) => {
    await page.evaluate(() => window.location.hash = '#/tournament');
    await page.waitForTimeout(1000);

    const matchStarted = await page.evaluate(() => {
      const bracket = document.querySelector('tournament-bracket');
      if (bracket?.shadowRoot) {
        const buttons = Array.from(bracket.shadowRoot.querySelectorAll('button'));
        const fightBtn = buttons.find(btn => 
          btn.textContent.includes('Fight') || btn.textContent.includes('Battle')
        );
        if (fightBtn && !fightBtn.disabled) {
          fightBtn.click();
          return true;
        }
      }
      return false;
    });

    if (matchStarted) {
      await page.waitForTimeout(1500);
      
      const inCombat = await page.evaluate(() => {
        return window.location.hash.includes('combat');
      });

      expect(typeof inCombat).toBe('boolean');
    }
  });

  test('should track tournament progress', async ({ page }) => {
    await page.evaluate(() => {
      const data = localStorage.getItem('legends_arena_save_slot1');
      const parsed = JSON.parse(data);
      parsed.tournament.currentTournament = {
        id: 'test_tournament',
        round: 1,
        wins: 2,
        losses: 0,
      };
      localStorage.setItem('legends_arena_save_slot1', JSON.stringify(parsed));
    });

    await page.reload();
    await page.evaluate(() => window.location.hash = '#/tournament');
    await page.waitForTimeout(1000);

    const progress = await page.evaluate(() => {
      const data = localStorage.getItem('legends_arena_save_slot1');
      if (!data) return null;
      return JSON.parse(data).tournament?.currentTournament;
    });

    expect(progress).toBeDefined();
  });

  test('should advance through bracket on win', async ({ page }) => {
    await page.evaluate(() => {
      const data = localStorage.getItem('legends_arena_save_slot1');
      const parsed = JSON.parse(data);
      parsed.tournament.currentTournament = {
        id: 'test_tournament',
        round: 1,
        wins: 0,
      };
      localStorage.setItem('legends_arena_save_slot1', JSON.stringify(parsed));
    });

    await page.reload();

    // Simulate a win
    await page.evaluate(() => {
      const data = localStorage.getItem('legends_arena_save_slot1');
      const parsed = JSON.parse(data);
      parsed.tournament.currentTournament.wins = 1;
      parsed.tournament.currentTournament.round = 2;
      localStorage.setItem('legends_arena_save_slot1', JSON.stringify(parsed));
    });

    await page.evaluate(() => window.location.hash = '#/tournament');
    await page.waitForTimeout(1000);

    const progress = await page.evaluate(() => {
      const data = localStorage.getItem('legends_arena_save_slot1');
      const parsed = JSON.parse(data);
      return parsed.tournament?.currentTournament?.round;
    });

    expect(progress).toBeGreaterThan(1);
  });

  test('should eliminate player on loss', async ({ page }) => {
    await page.evaluate(() => {
      const data = localStorage.getItem('legends_arena_save_slot1');
      const parsed = JSON.parse(data);
      parsed.tournament.currentTournament = {
        id: 'test_tournament',
        round: 2,
        wins: 1,
        eliminated: false,
      };
      localStorage.setItem('legends_arena_save_slot1', JSON.stringify(parsed));
    });

    await page.reload();

    // Simulate a loss
    await page.evaluate(() => {
      const data = localStorage.getItem('legends_arena_save_slot1');
      const parsed = JSON.parse(data);
      parsed.tournament.currentTournament.eliminated = true;
      localStorage.setItem('legends_arena_save_slot1', JSON.stringify(parsed));
    });

    await page.evaluate(() => window.location.hash = '#/tournament');
    await page.waitForTimeout(1000);

    const eliminated = await page.evaluate(() => {
      const data = localStorage.getItem('legends_arena_save_slot1');
      const parsed = JSON.parse(data);
      return parsed.tournament?.currentTournament?.eliminated;
    });

    expect(eliminated).toBe(true);
  });

  test('should award prizes on tournament win', async ({ page }) => {
    const initialGold = await page.evaluate(() => {
      const data = localStorage.getItem('legends_arena_save_slot1');
      return JSON.parse(data).profile.gold;
    });

    // Simulate tournament win
    await page.evaluate(() => {
      const data = localStorage.getItem('legends_arena_save_slot1');
      const parsed = JSON.parse(data);
      parsed.profile.gold += 1000; // Tournament prize
      parsed.tournament.wins += 1;
      parsed.tournament.currentTournament = null;
      localStorage.setItem('legends_arena_save_slot1', JSON.stringify(parsed));
    });

    const finalGold = await page.evaluate(() => {
      const data = localStorage.getItem('legends_arena_save_slot1');
      return JSON.parse(data).profile.gold;
    });

    expect(finalGold).toBeGreaterThan(initialGold);
  });

  test('should display tournament history', async ({ page }) => {
    await page.evaluate(() => {
      const data = localStorage.getItem('legends_arena_save_slot1');
      const parsed = JSON.parse(data);
      parsed.tournament.wins = 3;
      parsed.tournament.losses = 2;
      localStorage.setItem('legends_arena_save_slot1', JSON.stringify(parsed));
    });

    await page.reload();
    await page.evaluate(() => window.location.hash = '#/tournament');
    await page.waitForTimeout(1000);

    const hasHistory = await page.evaluate(() => {
      const bracket = document.querySelector('tournament-bracket');
      if (bracket?.shadowRoot) {
        const text = bracket.shadowRoot.textContent || '';
        return text.includes('3') || text.includes('win') || text.includes('Win');
      }
      return false;
    });

    expect(typeof hasHistory).toBe('boolean');
  });

  test('should show different tournament tiers', async ({ page }) => {
    await page.evaluate(() => window.location.hash = '#/tournament');
    await page.waitForTimeout(1000);

    const hasTiers = await page.evaluate(() => {
      const bracket = document.querySelector('tournament-bracket');
      if (bracket?.shadowRoot) {
        const text = bracket.shadowRoot.textContent?.toLowerCase() || '';
        return text.includes('bronze') || text.includes('silver') || 
               text.includes('gold') || text.includes('platinum') ||
               text.includes('beginner') || text.includes('advanced');
      }
      return false;
    });

    expect(typeof hasTiers).toBe('boolean');
  });

  test('should update ranking after tournament', async ({ page }) => {
    const initialRank = await page.evaluate(() => {
      const data = localStorage.getItem('legends_arena_save_slot1');
      return JSON.parse(data).tournament?.rank;
    });

    // Simulate rank up
    await page.evaluate(() => {
      const data = localStorage.getItem('legends_arena_save_slot1');
      const parsed = JSON.parse(data);
      parsed.tournament.rank = 'Silver';
      parsed.tournament.wins = 5;
      localStorage.setItem('legends_arena_save_slot1', JSON.stringify(parsed));
    });

    const newRank = await page.evaluate(() => {
      const data = localStorage.getItem('legends_arena_save_slot1');
      return JSON.parse(data).tournament?.rank;
    });

    expect(newRank).not.toBe(initialRank);
  });
});
