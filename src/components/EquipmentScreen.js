import { BaseComponent } from './BaseComponent.js';
import equipmentStyles from '../styles/components/EquipmentScreen.scss?inline';
import { SaveManagerV2 as SaveManager } from '../utils/SaveManagerV2.js';
import { EquipmentManager } from '../game/EquipmentManager.js';
import { RARITY_COLORS, RARITY_NAMES } from '../data/equipment.js';

/**
 * EquipmentScreen Web Component
 * Displays equipped items and inventory management
 *
 * Events:
 * - back-to-menu: User wants to return to main menu
 */
export class EquipmentScreen extends BaseComponent {
  constructor() {
    super();
    this.selectedTab = 'all'; // all, weapon, armor, accessory
  }

  styles() {
    return equipmentStyles;
  }

  template() {
    const equipped = EquipmentManager.getEquippedItems();
    const inventory = EquipmentManager.getInventoryItems();
    const totalStats = EquipmentManager.getEquippedStats();

    // Filter inventory by selected tab
    let filteredInventory = inventory;
    if (this.selectedTab !== 'all') {
      filteredInventory = inventory.filter((item) => item.type === this.selectedTab);
    }

    return `
      <div class="equipment-container">
        <button class="back-btn">← Back to Menu</button>

        <div class="equipment-header">
          <h1 class="equipment-title">⚔️ Equipment ⚔️</h1>
        </div>

        <!-- Total Stats Summary -->
        ${
          Object.values(totalStats).some((v) => v > 0)
            ? `
          <div class="stats-summary">
            <div class="stats-summary-title">💪 Total Equipment Bonuses</div>
            <div class="stats-grid">
              ${
                totalStats.strength > 0
                  ? `
                <div class="stat-display">
                  <div class="stat-value">+${totalStats.strength}</div>
                  <div class="stat-label">Strength</div>
                </div>
              `
                  : ''
              }
              ${
                totalStats.health > 0
                  ? `
                <div class="stat-display">
                  <div class="stat-value">+${totalStats.health}</div>
                  <div class="stat-label">Health</div>
                </div>
              `
                  : ''
              }
              ${
                totalStats.defense > 0
                  ? `
                <div class="stat-display">
                  <div class="stat-value">+${totalStats.defense}</div>
                  <div class="stat-label">Defense</div>
                </div>
              `
                  : ''
              }
              ${
                totalStats.critChance > 0
                  ? `
                <div class="stat-display">
                  <div class="stat-value">+${totalStats.critChance}%</div>
                  <div class="stat-label">Crit Chance</div>
                </div>
              `
                  : ''
              }
              ${
                totalStats.critDamage > 0
                  ? `
                <div class="stat-display">
                  <div class="stat-value">+${totalStats.critDamage}%</div>
                  <div class="stat-label">Crit Damage</div>
                </div>
              `
                  : ''
              }
              ${
                totalStats.manaRegen > 0
                  ? `
                <div class="stat-display">
                  <div class="stat-value">+${totalStats.manaRegen}</div>
                  <div class="stat-label">Mana Regen</div>
                </div>
              `
                  : ''
              }
            </div>
          </div>
        `
            : ''
        }

        <!-- Equipped Items -->
        <div class="equipped-section">
          <div class="section-title">
            <span>⚡</span>
            Currently Equipped
          </div>
          <div class="equipped-grid">
            ${this.renderEquippedSlot('weapon', '⚔️', equipped.weapon)}
            ${this.renderEquippedSlot('armor', '🛡️', equipped.armor)}
            ${this.renderEquippedSlot('accessory', '💍', equipped.accessory)}
          </div>
        </div>

        <!-- Inventory -->
        <div class="inventory-section">
          <div class="section-title">
            <span>📦</span>
            Inventory (${inventory.length}/20)
          </div>

          <div class="tab-filters">
            <button class="tab-btn ${this.selectedTab === 'all' ? 'active' : ''}" data-tab="all">
              All Items
            </button>
            <button class="tab-btn ${this.selectedTab === 'weapon' ? 'active' : ''}" data-tab="weapon">
              ⚔️ Weapons
            </button>
            <button class="tab-btn ${this.selectedTab === 'armor' ? 'active' : ''}" data-tab="armor">
              🛡️ Armor
            </button>
            <button class="tab-btn ${this.selectedTab === 'accessory' ? 'active' : ''}" data-tab="accessory">
              💍 Accessories
            </button>
          </div>

          ${
            filteredInventory.length > 0
              ? `
            <div class="inventory-grid">
              ${filteredInventory.map((item) => this.renderInventoryItem(item)).join('')}
            </div>
          `
              : `
            <div class="empty-inventory">
              <div class="empty-inventory-icon">📦</div>
              <div>No ${this.selectedTab === 'all' ? '' : this.selectedTab} items in inventory</div>
              <div style="margin-top: 10px; font-size: 14px;">Win battles to earn equipment!</div>
            </div>
          `
          }
        </div>
      </div>
    `;
  }

  renderEquippedSlot(slotType, icon, item) {
    if (!item) {
      return `
        <div class="equipment-slot">
          <div class="slot-header">
            <div class="slot-name">${slotType}</div>
            <div class="slot-icon">${icon}</div>
          </div>
          <div class="empty-slot">
            No ${slotType} equipped
          </div>
        </div>
      `;
    }

    const statsHtml = Object.entries(item.stats)
      .map(([stat, value]) => {
        const statNames = {
          strength: 'STR',
          health: 'HP',
          defense: 'DEF',
          critChance: 'Crit%',
          critDamage: 'Crit Dmg',
          manaRegen: 'Mana+',
        };
        return `<span class="stat-badge">+${value} ${statNames[stat]}</span>`;
      })
      .join('');

    return `
      <div class="equipment-slot">
        <div class="slot-header">
          <div class="slot-name">${slotType}</div>
          <div class="slot-icon">${item.icon}</div>
        </div>
        <div class="equipped-item ${item.rarity}">
          <div class="item-name">${item.name}</div>
          <div class="item-rarity" style="color: ${RARITY_COLORS[item.rarity]}">
            ${RARITY_NAMES[item.rarity]}
          </div>
          <div class="item-stats">${statsHtml}</div>
          <button class="unequip-btn" data-slot="${slotType}">Unequip</button>
        </div>
      </div>
    `;
  }

  renderInventoryItem(item) {
    const playerLevel = SaveManager.get('profile.level');
    const playerClass = SaveManager.get('profile.character.class');

    const meetsLevel = item.requirements.level <= playerLevel;
    const meetsClass = !item.requirements.class || item.requirements.class.includes(playerClass);
    const canEquip = meetsLevel && meetsClass;

    const statsHtml = Object.entries(item.stats)
      .map(([stat, value]) => {
        const statNames = {
          strength: 'STR',
          health: 'HP',
          defense: 'DEF',
          critChance: 'Crit%',
          critDamage: 'Crit Dmg',
          manaRegen: 'Mana+',
        };
        return `<span class="stat-badge">+${value} ${statNames[stat]}</span>`;
      })
      .join('');

    return `
      <div class="inventory-item ${item.rarity}" data-item-id="${item.id}">
        <div class="item-header">
          <div>
            <div class="item-name">${item.name}</div>
            <div class="item-rarity" style="color: ${RARITY_COLORS[item.rarity]}">
              ${RARITY_NAMES[item.rarity]}
            </div>
          </div>
          <div class="item-icon-large">${item.icon}</div>
        </div>
        <div class="item-description">${item.description}</div>
        <div class="item-stats">${statsHtml}</div>
        <div class="item-requirements">
          <div class="${meetsLevel ? 'requirement-met' : 'requirement-not-met'}">
            Level ${item.requirements.level} ${meetsLevel ? '✓' : '✗'}
          </div>
          ${
            item.requirements.class
              ? `
            <div class="${meetsClass ? 'requirement-met' : 'requirement-not-met'}">
              ${item.requirements.class.join(', ')} ${meetsClass ? '✓' : '✗'}
            </div>
          `
              : ''
          }
        </div>
        <button class="equip-btn" data-equip-id="${item.id}" ${!canEquip ? 'disabled' : ''}>
          Equip
        </button>
      </div>
    `;
  }

  attachEventListeners() {
    // Back button
    const backBtn = this.shadowRoot.querySelector('.back-btn');
    if (backBtn) {
      backBtn.addEventListener('click', () => {
        this.emit('back-to-menu');
      });
    }

    // Tab filters
    const tabBtns = this.shadowRoot.querySelectorAll('.tab-btn');
    tabBtns.forEach((btn) => {
      btn.addEventListener('click', () => {
        this.selectedTab = btn.dataset.tab;
        this.render();
      });
    });

    // Unequip buttons
    const unequipBtns = this.shadowRoot.querySelectorAll('.unequip-btn');
    unequipBtns.forEach((btn) => {
      btn.addEventListener('click', () => {
        const slot = btn.dataset.slot;
        EquipmentManager.unequipItem(slot);
        this.render();
      });
    });

    // Equip buttons
    const equipBtns = this.shadowRoot.querySelectorAll('.equip-btn');
    equipBtns.forEach((btn) => {
      btn.addEventListener('click', () => {
        const equipmentId = btn.dataset.equipId;
        if (EquipmentManager.equipItem(equipmentId)) {
          this.render();
        }
      });
    });
  }
}

customElements.define('equipment-screen', EquipmentScreen);
