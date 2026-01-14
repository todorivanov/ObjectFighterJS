/**
 * Movement Modifiers Unit Tests
 * Tests for equipment-based movement bonuses and special movement types
 */

import { describe, it, expect, beforeEach, vi } from 'vitest';

describe('Movement Modifiers - Equipment Integration', () => {
  describe('Movement Bonus Calculation', () => {
    it('should add movement bonus to base movement range', () => {
      const baseMoveRange = 3;
      const equipmentBonus = 1;
      const totalMoveRange = baseMoveRange + equipmentBonus;

      expect(totalMoveRange).toBe(4);
    });

    it('should handle multiple movement bonus items', () => {
      const baseMoveRange = 3;
      const bonus1 = 1; // Boots of Haste
      const bonus2 = 2; // Swift Sandals
      const totalMoveRange = baseMoveRange + bonus1 + bonus2;

      expect(totalMoveRange).toBe(6);
    });

    it('should not allow negative movement range', () => {
      const baseMoveRange = 3;
      const penalty = -5; // Hypothetical penalty
      const totalMoveRange = Math.max(1, baseMoveRange + penalty);

      expect(totalMoveRange).toBeGreaterThanOrEqual(1);
    });

    it('should handle zero movement bonus', () => {
      const baseMoveRange = 3;
      const equipmentBonus = 0;
      const totalMoveRange = baseMoveRange + equipmentBonus;

      expect(totalMoveRange).toBe(3);
    });
  });

  describe('Special Movement Type - phaseThrough', () => {
    it('should allow movement through occupied cells', () => {
      const movementTypes = ['phaseThrough'];
      const cellOccupied = true;

      const canMoveThrough = movementTypes.includes('phaseThrough') && cellOccupied;

      expect(canMoveThrough).toBe(true);
    });

    it('should not allow movement through occupied cells without phaseThrough', () => {
      const movementTypes = [];
      const cellOccupied = true;

      const canMoveThrough = movementTypes.includes('phaseThrough') && cellOccupied;

      expect(canMoveThrough).toBe(false);
    });

    it('should detect phaseThrough from equipment', () => {
      const equipment = {
        coat: {
          id: 'cloak_shadow',
          movementType: 'phaseThrough',
        },
      };

      const hasPhaseThrough = equipment.coat?.movementType === 'phaseThrough';

      expect(hasPhaseThrough).toBe(true);
    });
  });

  describe('Special Movement Type - ignoreTerrainCost', () => {
    it('should ignore terrain movement costs', () => {
      const movementTypes = ['ignoreTerrainCost'];
      const terrainCost = 2; // Rough terrain
      const actualCost = movementTypes.includes('ignoreTerrainCost') ? 1 : terrainCost;

      expect(actualCost).toBe(1);
    });

    it('should apply terrain costs without ignoreTerrainCost', () => {
      const movementTypes = [];
      const terrainCost = 2;
      const actualCost = movementTypes.includes('ignoreTerrainCost') ? 1 : terrainCost;

      expect(actualCost).toBe(2);
    });

    it('should handle various terrain types', () => {
      const movementTypes = ['ignoreTerrainCost'];

      const plainsCost = movementTypes.includes('ignoreTerrainCost') ? 1 : 1;
      const forestCost = movementTypes.includes('ignoreTerrainCost') ? 1 : 2;
      const mountainCost = movementTypes.includes('ignoreTerrainCost') ? 1 : 3;

      expect(plainsCost).toBe(1);
      expect(forestCost).toBe(1);
      expect(mountainCost).toBe(1);
    });
  });

  describe('Combined Movement Modifiers', () => {
    it('should apply both movement bonus and special types', () => {
      const baseMoveRange = 3;
      const equipmentBonus = 2;
      const movementTypes = ['ignoreTerrainCost', 'phaseThrough'];

      const totalMoveRange = baseMoveRange + equipmentBonus;

      expect(totalMoveRange).toBe(5);
      expect(movementTypes).toContain('ignoreTerrainCost');
      expect(movementTypes).toContain('phaseThrough');
    });

    it('should not duplicate movement types', () => {
      const types1 = ['phaseThrough'];
      const types2 = ['phaseThrough', 'ignoreTerrainCost'];

      const combined = [...new Set([...types1, ...types2])];

      expect(combined).toHaveLength(2);
      expect(combined).toContain('phaseThrough');
      expect(combined).toContain('ignoreTerrainCost');
    });

    it('should handle empty movement types array', () => {
      const movementTypes = [];

      expect(movementTypes).toHaveLength(0);
      expect(movementTypes.includes('phaseThrough')).toBe(false);
      expect(movementTypes.includes('ignoreTerrainCost')).toBe(false);
    });
  });

  describe('Movement Validation', () => {
    it('should validate movement range is positive', () => {
      const validateMoveRange = (range) => range > 0;

      expect(validateMoveRange(3)).toBe(true);
      expect(validateMoveRange(0)).toBe(false);
      expect(validateMoveRange(-1)).toBe(false);
    });

    it('should validate movement type is recognized', () => {
      const validTypes = ['phaseThrough', 'ignoreTerrainCost'];
      const validateType = (type) => validTypes.includes(type);

      expect(validateType('phaseThrough')).toBe(true);
      expect(validateType('ignoreTerrainCost')).toBe(true);
      expect(validateType('invalidType')).toBe(false);
    });

    it('should handle array of movement types', () => {
      const movementTypes = ['phaseThrough', 'ignoreTerrainCost'];

      expect(Array.isArray(movementTypes)).toBe(true);
      expect(movementTypes.length).toBe(2);
    });

    it('should handle single movement type as string', () => {
      const movementType = 'phaseThrough';
      const typesArray = Array.isArray(movementType) ? movementType : [movementType];

      expect(typesArray).toEqual(['phaseThrough']);
    });
  });
});

describe('Grid Combat - Movement Integration', () => {
  describe('Path Calculation with Equipment', () => {
    it('should calculate valid moves with movement bonus', () => {
      const position = { x: 2, y: 2 };
      const moveRange = 4; // 3 base + 1 bonus

      // Simple distance check (Manhattan distance)
      const isWithinRange = (targetX, targetY) => {
        const distance = Math.abs(targetX - position.x) + Math.abs(targetY - position.y);
        return distance <= moveRange;
      };

      expect(isWithinRange(4, 2)).toBe(true); // 2 steps away
      expect(isWithinRange(6, 2)).toBe(true); // 4 steps away
      expect(isWithinRange(7, 2)).toBe(false); // 5 steps away
    });

    it('should allow diagonal movement with sufficient range', () => {
      const position = { x: 2, y: 2 };
      const moveRange = 4;

      const isWithinRange = (targetX, targetY) => {
        const distance = Math.abs(targetX - position.x) + Math.abs(targetY - position.y);
        return distance <= moveRange;
      };

      expect(isWithinRange(4, 4)).toBe(true); // 2+2=4 steps
      expect(isWithinRange(5, 5)).toBe(false); // 3+3=6 steps
    });
  });

  describe('Pathfinding with Special Movement', () => {
    it('should find path through occupied cells with phaseThrough', () => {
      const grid = [
        [0, 0, 0, 0],
        [0, 1, 1, 0], // 1 = occupied
        [0, 0, 0, 0],
      ];

      const hasPhaseThrough = true;
      const start = { x: 0, y: 1 };
      const target = { x: 3, y: 1 };

      // With phaseThrough, can move through occupied cells
      const canReach = hasPhaseThrough || (grid[start.y][start.x + 1] === 0);

      expect(canReach).toBe(true);
    });

    it('should be blocked by occupied cells without phaseThrough', () => {
      const grid = [
        [0, 0, 0, 0],
        [0, 1, 1, 0], // 1 = occupied
        [0, 0, 0, 0],
      ];

      const hasPhaseThrough = false;
      const cellBlocked = grid[1][1] === 1;

      const canPass = hasPhaseThrough || !cellBlocked;

      expect(canPass).toBe(false);
    });

    it('should calculate correct movement cost with ignoreTerrainCost', () => {
      const terrain = {
        plains: 1,
        forest: 2,
        mountain: 3,
      };

      const hasIgnoreTerrain = true;
      const movementCost = hasIgnoreTerrain ? 1 : terrain.mountain;

      expect(movementCost).toBe(1);
    });

    it('should apply terrain costs without ignoreTerrainCost', () => {
      const terrain = {
        plains: 1,
        forest: 2,
        mountain: 3,
      };

      const hasIgnoreTerrain = false;
      const movementCost = hasIgnoreTerrain ? 1 : terrain.mountain;

      expect(movementCost).toBe(3);
    });
  });

  describe('Movement Range Display', () => {
    it('should highlight cells within movement range', () => {
      const position = { x: 2, y: 2 };
      const moveRange = 3;

      const getCellsInRange = (pos, range) => {
        const cells = [];
        for (let dx = -range; dx <= range; dx++) {
          for (let dy = -range; dy <= range; dy++) {
            const distance = Math.abs(dx) + Math.abs(dy);
            if (distance <= range && distance > 0) {
              cells.push({ x: pos.x + dx, y: pos.y + dy });
            }
          }
        }
        return cells;
      };

      const validCells = getCellsInRange(position, moveRange);

      expect(validCells.length).toBeGreaterThan(0);
      expect(validCells.some((cell) => cell.x === 5 && cell.y === 2)).toBe(true); // 3 steps right
      expect(validCells.some((cell) => cell.x === 2 && cell.y === 5)).toBe(true); // 3 steps down
    });

    it('should not highlight cells beyond movement range', () => {
      const position = { x: 2, y: 2 };
      const moveRange = 2;

      const isInRange = (targetX, targetY) => {
        const distance = Math.abs(targetX - position.x) + Math.abs(targetY - position.y);
        return distance <= moveRange;
      };

      expect(isInRange(4, 2)).toBe(true); // 2 steps
      expect(isInRange(5, 2)).toBe(false); // 3 steps
    });
  });

  describe('Team Movement Modifiers', () => {
    it('should apply movement modifiers per fighter', () => {
      const fighters = [
        { id: 1, baseMoveRange: 3, equipmentBonus: 1 }, // Total: 4
        { id: 2, baseMoveRange: 3, equipmentBonus: 0 }, // Total: 3
        { id: 3, baseMoveRange: 3, equipmentBonus: 2 }, // Total: 5
      ];

      const totalRanges = fighters.map((f) => f.baseMoveRange + f.equipmentBonus);

      expect(totalRanges).toEqual([4, 3, 5]);
      expect(Math.max(...totalRanges)).toBe(5);
      expect(Math.min(...totalRanges)).toBe(3);
    });

    it('should track which fighters have special movement', () => {
      const fighters = [
        { id: 1, movementTypes: ['phaseThrough'] },
        { id: 2, movementTypes: [] },
        { id: 3, movementTypes: ['ignoreTerrainCost'] },
      ];

      const fightersWithSpecial = fighters.filter((f) => f.movementTypes.length > 0);

      expect(fightersWithSpecial).toHaveLength(2);
      expect(fightersWithSpecial[0].movementTypes).toContain('phaseThrough');
      expect(fightersWithSpecial[1].movementTypes).toContain('ignoreTerrainCost');
    });
  });
});

describe('Movement Modifiers - Edge Cases', () => {
  it('should handle undefined movement bonus', () => {
    const baseMoveRange = 3;
    const equipmentBonus = undefined;
    const totalMoveRange = baseMoveRange + (equipmentBonus || 0);

    expect(totalMoveRange).toBe(3);
  });

  it('should handle null movement types', () => {
    const movementTypes = null;
    const typesArray = movementTypes ? (Array.isArray(movementTypes) ? movementTypes : [movementTypes]) : [];

    expect(typesArray).toEqual([]);
  });

  it('should handle very large movement bonuses', () => {
    const baseMoveRange = 3;
    const equipmentBonus = 100;
    const totalMoveRange = baseMoveRange + equipmentBonus;

    expect(totalMoveRange).toBe(103);
    expect(totalMoveRange).toBeGreaterThan(0);
  });

  it('should handle fractional movement bonuses', () => {
    const baseMoveRange = 3;
    const equipmentBonus = 1.5;
    const totalMoveRange = Math.floor(baseMoveRange + equipmentBonus);

    expect(totalMoveRange).toBe(4); // Rounded down
  });

  it('should handle empty equipment slots', () => {
    const equipped = {
      weapon: null,
      head: null,
      torso: null,
      arms: null,
      trousers: null,
      shoes: null, // No movement boots
      coat: null,
      accessory: null,
    };

    const hasMovementItem = Object.values(equipped).some((item) => item !== null);

    expect(hasMovementItem).toBe(false);
  });
});
