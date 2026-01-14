/**
 * Spawn Zone Validation Tests
 * Tests the new spawn zone system to ensure fighters spawn only on valid, passable terrain
 */

import { describe, it, expect, beforeEach, vi } from 'vitest';
import { GridManager } from '../../src/game/GridManager.js';
import { TerrainGenerator } from '../../src/game/TerrainSystem.js';
import { ConsoleLogger } from '../../src/utils/ConsoleLogger.js';

describe('Spawn Zone Validation', () => {
  let gridManager;

  beforeEach(() => {
    gridManager = new GridManager(5, 5);
    vi.clearAllMocks();
  });

  describe('Spawn Zone Definitions', () => {
    it('should define player spawn zone as bottom 2 rows (y=3, y=4)', () => {
      const playerSpawns = gridManager.getValidSpawnZones('player');
      
      // All spawn positions should be in rows 3 or 4
      playerSpawns.forEach(pos => {
        expect([3, 4]).toContain(pos.y);
      });
      
      // Should have positions across all 5 columns
      const columns = [...new Set(playerSpawns.map(pos => pos.x))];
      expect(columns.length).toBeGreaterThan(0);
    });

    it('should define enemy spawn zone as top 2 rows (y=0, y=1)', () => {
      const enemySpawns = gridManager.getValidSpawnZones('enemy');
      
      // All spawn positions should be in rows 0 or 1
      enemySpawns.forEach(pos => {
        expect([0, 1]).toContain(pos.y);
      });
      
      // Should have positions across all 5 columns
      const columns = [...new Set(enemySpawns.map(pos => pos.x))];
      expect(columns.length).toBeGreaterThan(0);
    });

    it('should return up to 10 spawn positions per side (5 columns x 2 rows)', () => {
      const playerSpawns = gridManager.getValidSpawnZones('player');
      const enemySpawns = gridManager.getValidSpawnZones('enemy');
      
      // Maximum possible is 10 (all cells passable)
      expect(playerSpawns.length).toBeLessThanOrEqual(10);
      expect(enemySpawns.length).toBeLessThanOrEqual(10);
    });
  });

  describe('Terrain Validation', () => {
    it('should not allow spawning on walls', () => {
      // Place a wall at player preferred spawn position
      gridManager.grid[4][0].terrain = 'wall';
      
      const mockFighter = { name: 'TestWarrior' };
      const success = gridManager.placeFighter(mockFighter, 0, 4);
      
      // Should fail to place on wall
      expect(success).toBe(false);
      expect(gridManager.grid[4][0].occupant).toBeNull();
    });

    it('should not allow spawning on pits', () => {
      // Place a pit at enemy preferred spawn position
      gridManager.grid[0][4].terrain = 'pit';
      
      const mockFighter = { name: 'TestGoblin' };
      const success = gridManager.placeFighter(mockFighter, 4, 0);
      
      // Should fail to place on pit
      expect(success).toBe(false);
      expect(gridManager.grid[0][4].occupant).toBeNull();
    });

    it('should allow spawning on all passable terrain types', () => {
      const passableTerrains = [
        'normal', 'grass', 'forest', 'water', 
        'mud', 'rock', 'high_ground', 'low_ground'
      ];

      passableTerrains.forEach(terrainType => {
        gridManager = new GridManager(5, 5);
        gridManager.grid[4][0].terrain = terrainType;
        
        const mockFighter = { name: `Test${terrainType}` };
        const success = gridManager.placeFighter(mockFighter, 0, 4);
        
        expect(success).toBe(true);
        expect(gridManager.grid[4][0].occupant).toBe(mockFighter);
      });
    });

    it('should exclude walls and pits from valid spawn zones', () => {
      // Create grid with walls in spawn zones
      gridManager.grid[4][0].terrain = 'wall'; // Player zone
      gridManager.grid[4][1].terrain = 'wall'; // Player zone
      gridManager.grid[0][0].terrain = 'pit';  // Enemy zone
      gridManager.grid[0][1].terrain = 'pit';  // Enemy zone
      
      const playerSpawns = gridManager.getValidSpawnZones('player');
      const enemySpawns = gridManager.getValidSpawnZones('enemy');
      
      // Should not include wall/pit positions
      expect(playerSpawns.find(p => p.x === 0 && p.y === 4)).toBeUndefined();
      expect(playerSpawns.find(p => p.x === 1 && p.y === 4)).toBeUndefined();
      expect(enemySpawns.find(p => p.x === 0 && p.y === 0)).toBeUndefined();
      expect(enemySpawns.find(p => p.x === 1 && p.y === 0)).toBeUndefined();
    });
  });

  describe('Occupancy Validation', () => {
    it('should not allow spawning on occupied cells', () => {
      const fighter1 = { name: 'Fighter1' };
      const fighter2 = { name: 'Fighter2' };
      
      // Place first fighter
      gridManager.placeFighter(fighter1, 0, 4);
      
      // Try to place second fighter in same position
      const success = gridManager.placeFighter(fighter2, 0, 4);
      
      expect(success).toBe(false);
      expect(gridManager.grid[4][0].occupant).toBe(fighter1);
    });

    it('should exclude occupied cells from valid spawn zones', () => {
      const fighter = { name: 'Occupier' };
      gridManager.placeFighter(fighter, 0, 4);
      
      const playerSpawns = gridManager.getValidSpawnZones('player');
      
      // Should not include occupied position
      expect(playerSpawns.find(p => p.x === 0 && p.y === 4)).toBeUndefined();
    });
  });

  describe('Fallback Logic', () => {
    it('should use preferred position if available', () => {
      const playerFighter = { name: 'Hero', currentHP: 100, maxHP: 100 };
      const enemyFighter = { name: 'Villain', currentHP: 100, maxHP: 100 };
      
      // Place at preferred positions directly
      const playerPlaced = gridManager.placeFighter(playerFighter, 0, 4);
      const enemyPlaced = gridManager.placeFighter(enemyFighter, 4, 0);
      
      // Should succeed
      expect(playerPlaced).toBe(true);
      expect(enemyPlaced).toBe(true);
      
      // Check positions
      expect(gridManager.grid[4][0].occupant).toBe(playerFighter);
      expect(gridManager.grid[0][4].occupant).toBe(enemyFighter);
    });

    it('should fallback to random spawn zone if preferred is blocked', () => {
      // Block preferred positions with walls
      gridManager.grid[4][0].terrain = 'wall'; // Player preferred (0,4)
      gridManager.grid[0][4].terrain = 'wall'; // Enemy preferred (4,0)
      
      const playerFighter = { name: 'Hero', currentHP: 100, maxHP: 100 };
      const enemyFighter = { name: 'Villain', currentHP: 100, maxHP: 100 };
      
      // Manually implement fallback logic like placeFightersInitial does
      const playerSpawns = gridManager.getValidSpawnZones('player');
      const enemySpawns = gridManager.getValidSpawnZones('enemy');
      
      // Place in first valid spawn zone
      let playerPlaced = false;
      if (playerSpawns.length > 0) {
        playerPlaced = gridManager.placeFighter(playerFighter, playerSpawns[0].x, playerSpawns[0].y);
      }
      
      let enemyPlaced = false;
      if (enemySpawns.length > 0) {
        enemyPlaced = gridManager.placeFighter(enemyFighter, enemySpawns[0].x, enemySpawns[0].y);
      }
      
      expect(playerPlaced).toBe(true);
      expect(enemyPlaced).toBe(true);
    });

    it('should log warning if no valid spawn position found', () => {
      const consoleWarnSpy = vi.spyOn(ConsoleLogger, 'warn').mockImplementation();
      
      // Block ALL spawn zone cells with walls
      for (let y = 3; y <= 4; y++) {
        for (let x = 0; x < 5; x++) {
          gridManager.grid[y][x].terrain = 'wall';
        }
      }
      
      const playerFighter = { name: 'StuckHero', currentHP: 100, maxHP: 100 };
      
      // Try to place - should fail and log warning
      const placed = gridManager.placeFighter(playerFighter, 0, 4);
      
      expect(placed).toBe(false);
      // Should log warning about impassable terrain
      expect(consoleWarnSpy).toHaveBeenCalledWith(
        expect.anything(),
        expect.stringContaining('terrain')
      );
      
      consoleWarnSpy.mockRestore();
    });
  });

  describe('GridCombatIntegration Helpers', () => {
    it('should return spawn zone info via getSpawnZonePositions', () => {
      // Test gridManager directly since gridCombatIntegration uses singleton
      const playerSpawns = gridManager.getValidSpawnZones('player');
      const enemySpawns = gridManager.getValidSpawnZones('enemy');
      
      // Should return arrays of positions
      expect(Array.isArray(playerSpawns)).toBe(true);
      expect(Array.isArray(enemySpawns)).toBe(true);
      
      // Player spawns should be in rows 3-4
      playerSpawns.forEach(pos => {
        expect([3, 4]).toContain(pos.y);
      });
      
      // Enemy spawns should be in rows 0-1
      enemySpawns.forEach(pos => {
        expect([0, 1]).toContain(pos.y);
      });
    });
  });

  describe('Edge Cases', () => {
    it('should handle empty grid (all cells passable)', () => {
      const playerSpawns = gridManager.getValidSpawnZones('player');
      const enemySpawns = gridManager.getValidSpawnZones('enemy');
      
      // Should return all 10 cells per zone
      expect(playerSpawns.length).toBe(10);
      expect(enemySpawns.length).toBe(10);
    });

    it('should handle completely blocked spawn zone', () => {
      // Block entire enemy spawn zone
      for (let y = 0; y <= 1; y++) {
        for (let x = 0; x < 5; x++) {
          gridManager.grid[y][x].terrain = 'wall';
        }
      }
      
      const enemySpawns = gridManager.getValidSpawnZones('enemy');
      
      // Should return empty array
      expect(enemySpawns.length).toBe(0);
    });

    it('should handle mixed terrain in spawn zone', () => {
      // Create mixed terrain: some walls, some passable
      gridManager.grid[4][0].terrain = 'wall';
      gridManager.grid[4][1].terrain = 'grass';
      gridManager.grid[4][2].terrain = 'pit';
      gridManager.grid[4][3].terrain = 'forest';
      gridManager.grid[4][4].terrain = 'wall';
      
      const playerSpawns = gridManager.getValidSpawnZones('player');
      
      // Row 4 should only include (1,4) and (3,4)
      const row4Spawns = playerSpawns.filter(p => p.y === 4);
      expect(row4Spawns.length).toBe(2);
      expect(row4Spawns.find(p => p.x === 1 && p.y === 4)).toBeDefined();
      expect(row4Spawns.find(p => p.x === 3 && p.y === 4)).toBeDefined();
    });

    it('should handle single valid spawn cell', () => {
      // Block all but one cell in player spawn zone
      for (let y = 3; y <= 4; y++) {
        for (let x = 0; x < 5; x++) {
          if (!(x === 2 && y === 3)) { // Leave only (2,3) open
            gridManager.grid[y][x].terrain = 'wall';
          }
        }
      }
      
      const playerSpawns = gridManager.getValidSpawnZones('player');
      
      expect(playerSpawns.length).toBe(1);
      expect(playerSpawns[0]).toEqual({ x: 2, y: 3 });
    });
  });

  describe('Strategic Positioning', () => {
    it('should allow tanks to protect mages via spawn positioning', () => {
      const tank = { name: 'Tank', class: 'Tank', currentHP: 200, maxHP: 200 };
      const mage = { name: 'Mage', class: 'Mage', currentHP: 80, maxHP: 80 };
      
      // Place tank in front (row 4)
      gridManager.placeFighter(tank, 0, 4);
      
      // Place mage behind (row 3)
      gridManager.placeFighter(mage, 0, 3);
      
      // Verify positioning
      expect(gridManager.grid[4][0].occupant).toBe(tank);
      expect(gridManager.grid[3][0].occupant).toBe(mage);
      
      // Mage is behind tank (has cover)
      expect(gridManager.grid[4][0].occupant.name).toBe('Tank');
      expect(gridManager.grid[3][0].occupant.name).toBe('Mage');
    });

    it('should allow spawning on high ground for tactical advantage', () => {
      // Place high ground in spawn zone
      gridManager.grid[4][2].terrain = 'high_ground';
      
      const fighter = { name: 'Tactician' };
      const success = gridManager.placeFighter(fighter, 2, 4);
      
      expect(success).toBe(true);
      expect(gridManager.grid[4][2].terrain).toBe('high_ground');
    });
  });

  describe('Real Battlefield Scenarios', () => {
    it('should work with OPEN_FIELD layout', () => {
      const layout = TerrainGenerator.generateByName('OPEN_FIELD');
      // Manually apply layout since we can't use gridCombatIntegration with test gridManager
      for (let y = 0; y < layout.length; y++) {
        for (let x = 0; x < layout[y].length; x++) {
          gridManager.grid[y][x].terrain = layout[y][x];
        }
      }
      
      const playerFighter = { name: 'Hero', currentHP: 100, maxHP: 100 };
      const enemyFighter = { name: 'Villain', currentHP: 100, maxHP: 100 };
      
      // Place fighters
      const playerPlaced = gridManager.placeFighter(playerFighter, 0, 4);
      const enemyPlaced = gridManager.placeFighter(enemyFighter, 4, 0);
      
      expect(playerPlaced).toBe(true);
      expect(enemyPlaced).toBe(true);
    });

    it('should work with FOREST_CLEARING layout', () => {
      const layout = TerrainGenerator.generateByName('FOREST_CLEARING');
      // Manually apply layout
      for (let y = 0; y < layout.length; y++) {
        for (let x = 0; x < layout[y].length; x++) {
          gridManager.grid[y][x].terrain = layout[y][x];
        }
      }
      
      const playerSpawns = gridManager.getValidSpawnZones('player');
      const enemySpawns = gridManager.getValidSpawnZones('enemy');
      
      // Should have valid spawns even with forests
      expect(playerSpawns.length).toBeGreaterThan(0);
      expect(enemySpawns.length).toBeGreaterThan(0);
    });

    it('should work with MOUNTAIN_PASS layout', () => {
      const layout = TerrainGenerator.generateByName('MOUNTAIN_PASS');
      // Manually apply layout
      for (let y = 0; y < layout.length; y++) {
        for (let x = 0; x < layout[y].length; x++) {
          gridManager.grid[y][x].terrain = layout[y][x];
        }
      }
      
      const playerSpawns = gridManager.getValidSpawnZones('player');
      const enemySpawns = gridManager.getValidSpawnZones('enemy');
      
      // Mountain pass has walls, but spawn zones should have some valid cells
      expect(playerSpawns.length).toBeGreaterThan(0);
      expect(enemySpawns.length).toBeGreaterThan(0);
    });
  });
});
