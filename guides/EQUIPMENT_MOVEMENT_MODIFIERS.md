# ⚡ Equipment Movement Modifiers - Guide

## 🎮 **Overview**

Equipment can now modify movement capabilities! Boots, accessories, and special items can increase your movement range or grant unique movement abilities like phasing through enemies or ignoring terrain costs.

---

## 🚀 **Movement Modifier Types**

### **1. Movement Bonus** (`movementBonus`)
Increases your base movement range by a fixed amount.

**Examples:**
- **Boots of Haste** (Rare): `+1 Movement`
- **Winged Sandals** (Legendary): `+2 Movement`

**How it works:**
```
Base Movement: 2
Class Bonus: +1 (Assassin)
Equipment Bonus: +1 (Boots of Haste)
Total: 4 cells per turn!
```

### **2. Phase Through** (`phaseThrough`)
Allows you to move through cells occupied by enemies (but you cannot end your movement on an occupied cell).

**Examples:**
- **Ghost Walker** (Epic): Phase through enemies
- Useful for: Escaping, repositioning, flanking

**Tactical Uses:**
- **Escape routes**: Move through enemies to reach safety
- **Flanking**: Phase behind enemy lines for better positioning
- **Kiting**: Move through melee fighters while maintaining range

### **3. Ignore Terrain Cost** (`ignoreTerrainCost`)
All terrain types cost only 1 movement point (normally forests cost 2, water costs 3).

**Examples:**
- **Strider's Greaves** (Epic): Ignore terrain costs
- **Winged Sandals** (Legendary): Ignore terrain costs + bonus movement

**Tactical Uses:**
- **Cross water instantly**: Normally 3 cost → 1 cost
- **Forest traversal**: Normally 2 cost → 1 cost
- **Unpredictable movement**: Access normally slow paths quickly

---

## 🛠️ **Movement Equipment Database**

### **Rare Equipment**

#### 👢 **Boots of Haste**
- **Type:** Accessory
- **Rarity:** Rare
- **Level:** 5
- **Stats:** `+1 Movement`
- **Description:** Swift as the wind. Perfect for mobile classes.
- **Best for:** Assassins, Rangers, mobile builds

### **Epic Equipment**

#### 👻 **Ghost Walker**
- **Type:** Accessory
- **Rarity:** Epic
- **Level:** 10
- **Stats:** `+1 Movement`
- **Special:** Phase Through enemies
- **Description:** Phase like a ghost. Unstoppable mobility.
- **Best for:** Assassins, Agile classes, hit-and-run tactics
- **Restrictions:** Assassin, Agile, Balanced classes only

#### 🥾 **Strider's Greaves**
- **Type:** Accessory
- **Rarity:** Epic
- **Level:** 12
- **Stats:** `+1 Movement`, `+5 Defense`
- **Special:** Ignore terrain costs
- **Description:** Traverse any battlefield with ease.
- **Best for:** All classes, especially when terrain is difficult

### **Legendary Equipment**

#### 🪽 **Winged Sandals**
- **Type:** Accessory
- **Rarity:** Legendary
- **Level:** 15
- **Stats:** `+2 Movement`, `+10 Strength`
- **Special:** Ignore terrain costs
- **Description:** Blessed by Hermes himself. Ultimate mobility.
- **Best for:** All classes, endgame mobile builds

---

## 📊 **Movement Range Calculations**

### **Base System**
```
Base Movement: 2 cells
```

### **Class Modifiers**
| Class | Modifier | Total (Base) |
|-------|----------|-------------|
| Tank | -1 | 1 cell |
| Balanced | 0 | 2 cells |
| Agile | +1 | 3 cells |
| Assassin | +1 | 3 cells |
| Mage | 0 | 2 cells |
| Brawler | 0 | 2 cells |

### **With Equipment**
#### Example 1: Assassin + Boots of Haste
```
Base: 2
Class (Assassin): +1
Equipment (Boots): +1
Total: 4 cells per turn!
```

#### Example 2: Tank + Winged Sandals
```
Base: 2
Class (Tank): -1
Equipment (Sandals): +2
Total: 3 cells per turn (mobile tank!)
```

#### Example 3: Balanced + Ghost Walker
```
Base: 2
Class: 0
Equipment (Ghost): +1 + Phase Through
Total: 3 cells per turn + pass through enemies
```

---

## 🎯 **Tactical Strategies**

### **Strategy 1: Hit-and-Run with Ghost Walker**
```
1. Move through enemy lines (Phase Through)
2. Attack from behind (+25% flanking bonus)
3. Move back through enemy lines to safety
4. Repeat next turn
```

### **Strategy 2: Terrain Mastery with Strider's Greaves**
```
1. Equip Strider's Greaves
2. Use water/forest as tactical positions (no movement penalty!)
3. Surprise enemies with unexpected paths
4. Control high ground faster than opponents
```

### **Strategy 3: Ultimate Mobility with Winged Sandals**
```
Assassin + Winged Sandals:
- Base: 2
- Assassin: +1
- Sandals: +2
- Total: 5 CELLS PER TURN!
- Ignore terrain + Phase? No, but still insanely mobile!
```

### **Strategy 4: Melee Tank Mobility**
```
Tank + Winged Sandals:
- Compensates for Tank's -1 penalty
- Results in 3 movement (same as Assassin!)
- Keeps you in melee range with +10 STR bonus
```

---

## 🎮 **How to Use**

### **Equipping Movement Items**
1. **Go to Equipment Screen** (⚔️ Equipment button on title screen)
2. **Find movement items** in your inventory
   - Look for `⚡ Move` stat badges
   - Look for special badges: `👻 Phase` or `🥾 Swift`
3. **Equip the item** (click "EQUIP" button)
4. **Check stats summary** to see total movement bonus

### **In Combat**
1. **During your turn**, use your movement skill
2. **Valid moves are highlighted in blue**
   - More cells highlighted if you have movement bonuses!
3. **With Phase Through:**
   - Blue cells will appear THROUGH enemy positions
   - You can traverse through them but not end on them
4. **With Ignore Terrain:**
   - Water/forest cells use only 1 movement point
   - Reach distant positions faster

### **Visual Indicators**
- **Equipment Screen:**
  - `+1 ⚡ Move` = Movement bonus
  - `👻 Phase` = Phase Through ability
  - `🥾 Swift` = Ignore terrain costs
- **Stats Summary:**
  - Shows total `+X Movement` from all equipped items

---

## 💡 **Pro Tips**

### **Earning Movement Equipment**
1. **Battle Drops:** Movement items can drop from any victory
2. **Level Requirements:** Higher level = better movement items
3. **Marketplace:** Purchase from shop (check periodically)
4. **Rarity:** Higher rarity = better bonuses/abilities

### **Best Class Combinations**
| Class | Best Equipment | Why |
|-------|---------------|-----|
| **Assassin** | Ghost Walker | Phase + natural mobility = unstoppable |
| **Tank** | Winged Sandals | Compensates for slow movement |
| **Mage** | Strider's Greaves | Ignore terrain for positioning |
| **Agile** | Boots of Haste | Maximize natural mobility |
| **Balanced** | Any movement item | Become more specialized |

### **Combat Tactics**
1. **Kiting:** Movement > Attack Range allows hit-and-run
   - Assassin (3) + Boots (1) = 4 movement
   - Perfect for ranged attacks + retreat
2. **Aggressive Gap Closing:**
   - Melee characters benefit most from movement
   - Close distance faster, attack, retreat
3. **Terrain Control:**
   - Ignore terrain items let you control high ground first
   - Beat enemies to tactical positions

---

## 🔧 **Technical Details**

### **Movement Calculation Order**
```javascript
1. Start with base: 2
2. Apply class modifier: (Assassin: +1, Tank: -1)
3. Add equipment bonuses: +1 or +2
4. Minimum movement: 1 (never goes below 1)
```

### **Special Movement Types**
```javascript
movementType: 'phaseThrough'
- Allows moving through occupied cells
- Cannot END movement on occupied cell
- Still cannot move through walls/pits

movementType: 'ignoreTerrainCost'
- All terrain costs 1 movement point
- Still respects impassable terrain (walls, pits)
```

### **Files Modified**
- `src/game/EquipmentManager.js`: Added `getMovementModifiers()`
- `src/game/GridCombatIntegration.js`: Updated `getMovementRange()`
- `src/game/GridManager.js`: Updated `getValidMoves()` for special movement
- `src/data/equipment.js`: Added 4 new movement items
- `src/components/EquipmentScreen.js`: UI displays movement stats

---

## 🚀 **What's Next?**

### **Future Enhancements**
- **More movement types:**
  - `leap`: Jump over obstacles
  - `teleport`: Short-range teleportation
  - `sprint`: Double movement but skip attack
- **Movement skills:**
  - Equipment that grants movement skills
- **Combo effects:**
  - Multiple movement types on one item

---

## 🎨 **Visual Features**

### **Equipment Screen**
- ⚡ **Movement stat** displayed alongside STR, HP, DEF
- 👻 **Phase badge** for phase-through items
- 🥾 **Swift badge** for terrain-ignoring items
- **Color-coded** by rarity (Rare, Epic, Legendary)

### **In Combat**
- **Blue highlighted cells** show valid moves
- **More cells highlighted** with movement bonuses
- **Phase-through paths** visible through enemy positions
- **Combat log** shows equipment modifiers:
  ```
  ⚡ Equipment movement bonus: +1 (total: 4)
  ```

---

## 🎉 **Get Moving!**

Dynamic movement is now a reality! Build mobile assassins with 5+ movement range, create gap-closing tanks, or master terrain with ignore-cost abilities.

**Your mobility is only limited by your equipment!** 🏃‍♂️💨

Happy hunting for those legendary Winged Sandals! 🪽✨
