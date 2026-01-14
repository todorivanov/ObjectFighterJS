import { BaseComponent } from './BaseComponent.js';
import { MarketplaceManager } from '../game/MarketplaceManager.js';
import { DurabilityManager } from '../game/DurabilityManager.js';
import { EquipmentManager } from '../game/EquipmentManager.js';
import { EconomyManager } from '../game/EconomyManager.js';
import { SaveManagerV2 as SaveManager } from '../utils/SaveManagerV2.js';
import { RARITY_COLORS, RARITY_NAMES } from '../data/equipment.js';
import { GameConfig } from '../config/gameConfig.js';
import { ConsoleLogger, LogCategory } from '../utils/ConsoleLogger.js';
import marketplaceStyles from '../styles/components/MarketplaceScreen.scss?inline';

/**
 * MarketplaceScreen Web Component
 * Shopping interface for equipment, consumables, repairs, and selling
 *
 * Events:
 * - close: User wants to exit marketplace
 */
export class MarketplaceScreen extends BaseComponent {
  constructor() {
    super();
    this.activeTab = 'equipment'; // equipment, consumables, repair, sell
  }

  styles() {
    return marketplaceStyles;
  }

  template() {
    const gold = EconomyManager.getGold();
    const refreshTime = MarketplaceManager.getRefreshTimeFormatted();
    const refreshCost = GameConfig.marketplace.refreshCost;
    const canAffordRefresh = EconomyManager.canAfford(refreshCost);

    return `
      <div class="overlay"></div>
      <div class="marketplace-container">
        <div class="marketplace-header">
          <div class="header-left">
            <h1 class="marketplace-title">🏪 Marketplace</h1>
            <div class="refresh-info">
              <span>Shop refreshes in: ${refreshTime}</span>
              <button 
                class="refresh-btn" 
                id="refresh-btn" 
                ${!canAffordRefresh ? 'disabled' : ''}
                title="${canAffordRefresh ? 'Force refresh shop inventory' : 'Not enough gold'}"
              >
                🔄 Refresh (${refreshCost} 💰)
              </button>
            </div>
          </div>
          <div class="header-right">
            <div class="gold-display">${gold} 💰</div>
            <button class="close-btn" id="close-btn">✕ Close</button>
          </div>
        </div>

        <div class="tabs-container">
          <button class="tab-btn ${this.activeTab === 'equipment' ? 'active' : ''}" data-tab="equipment">
            ⚔️ Equipment
          </button>
          <button class="tab-btn ${this.activeTab === 'consumables' ? 'active' : ''}" data-tab="consumables">
            🧪 Consumables
          </button>
          <button class="tab-btn ${this.activeTab === 'repair' ? 'active' : ''}" data-tab="repair">
            🔧 Repair
          </button>
          <button class="tab-btn ${this.activeTab === 'sell' ? 'active' : ''}" data-tab="sell">
            💰 Sell
          </button>
        </div>

        <div class="content-area" id="content-area">
          ${this.renderTabContent()}
        </div>
      </div>
    `;
  }

  renderTabContent() {
    switch (this.activeTab) {
      case 'equipment':
        return this.renderEquipmentTab();
      case 'consumables':
        return this.renderConsumablesTab();
      case 'repair':
        return this.renderRepairTab();
      case 'sell':
        return this.renderSellTab();
      default:
        return '';
    }
  }

  /**
   * Helper method to generate class requirement badge HTML
   * @param {Object} equipment - Equipment object
   * @param {boolean} checkPlayer - Whether to check player's class compatibility
   * @returns {string} HTML string
   */
  getClassRequirementHTML(equipment, checkPlayer = true) {
    const playerClass =
      SaveManager.get('profile.character.class') || SaveManager.get('profile.class');
    const meetsClassReq =
      !equipment.requirements.class || equipment.requirements.class.includes(playerClass);

    const classIcons = {
      BALANCED: '⚖️',
      WARRIOR: '⚔️',
      TANK: '🛡️',
      GLASS_CANNON: '💥',
      BRUISER: '👊',
      MAGE: '🔮',
      ASSASSIN: '🗡️',
      BERSERKER: '🪓',
      PALADIN: '⚜️',
      NECROMANCER: '💀',
    };

    const classNames = {
      BALANCED: 'Balanced',
      WARRIOR: 'Warrior',
      TANK: 'Tank',
      GLASS_CANNON: 'Glass Cannon',
      BRUISER: 'Bruiser',
      MAGE: 'Mage',
      ASSASSIN: 'Assassin',
      BERSERKER: 'Berserker',
      PALADIN: 'Paladin',
      NECROMANCER: 'Necromancer',
    };

    if (equipment.requirements.class) {
      const classesText = equipment.requirements.class
        .map((c) => `${classIcons[c] || ''} ${classNames[c] || c}`)
        .join(', ');

      let bgColor, borderColor, textColor, icon;

      if (!checkPlayer) {
        // Just showing info, not checking compatibility
        bgColor = 'rgba(106, 66, 194, 0.15)';
        borderColor = 'rgba(106, 66, 194, 0.4)';
        textColor = '#b39ddb';
        icon = '';
      } else if (meetsClassReq) {
        // Player can use this
        bgColor = 'rgba(76, 175, 80, 0.15)';
        borderColor = 'rgba(76, 175, 80, 0.4)';
        textColor = '#66bb6a';
        icon = '✅ ';
      } else {
        // Player cannot use this
        bgColor = 'rgba(244, 67, 54, 0.15)';
        borderColor = 'rgba(244, 67, 54, 0.4)';
        textColor = '#ef5350';
        icon = '❌ ';
      }

      return `
        <div style="
          text-align: center; 
          font-size: 11px; 
          padding: 6px 8px; 
          background: ${bgColor};
          border: 1px solid ${borderColor};
          border-radius: 6px;
          margin: 8px 0;
          color: ${textColor};
        ">
          ${icon}${classesText}
        </div>
      `;
    } else {
      // No class restrictions
      return `
        <div style="
          text-align: center; 
          font-size: 11px; 
          padding: 6px 8px; 
          background: rgba(76, 175, 80, 0.15);
          border: 1px solid rgba(76, 175, 80, 0.4);
          border-radius: 6px;
          margin: 8px 0;
          color: #66bb6a;
        ">
          ✅ All Classes
        </div>
      `;
    }
  }

  renderEquipmentTab() {
    const inventory = MarketplaceManager.getCurrentInventory();

    if (inventory.length === 0) {
      return `
        <div class="empty-state">
          <div class="empty-state-icon">📦</div>
          <div class="empty-state-text">No items available. Check back later!</div>
        </div>
      `;
    }

    return `
      <div class="items-grid">
        ${inventory.map((eq) => this.renderShopItem(eq)).join('')}
      </div>
    `;
  }

  renderShopItem(equipment) {
    const price = MarketplaceManager.getItemPrice(equipment);
    const canAfford = EconomyManager.canAfford(price);
    const playerLevel = SaveManager.get('profile.level');
    const playerClass =
      SaveManager.get('profile.character.class') || SaveManager.get('profile.class');

    const meetsLevelReq = equipment.requirements.level <= playerLevel;
    const meetsClassReq =
      !equipment.requirements.class || equipment.requirements.class.includes(playerClass);
    const canPurchase = canAfford && meetsLevelReq && meetsClassReq;

    const stats = Object.entries(equipment.stats)
      .map(([stat, value]) => `+${value} ${stat}`)
      .join(', ');

    // Get slot label and icon
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
    const slot = slotInfo[equipment.type] || { icon: '📦', label: equipment.type };

    return `
      <div class="item-card" data-equipment-id="${equipment.id}">
        <div class="item-icon">${equipment.icon}</div>
        <div class="item-slot-type" style="color: #90caf9; font-size: 13px; font-weight: 600; margin: 5px 0;">
          ${slot.icon} ${slot.label}
        </div>
        <div class="item-rarity" style="color: ${RARITY_COLORS[equipment.rarity]}">
          ${RARITY_NAMES[equipment.rarity]}
        </div>
        <div class="item-name">${equipment.name}</div>
        <div class="item-description">${equipment.description}</div>
        <div class="item-stats">${stats}</div>
        ${this.getClassRequirementHTML(equipment, true)}
        ${!meetsLevelReq ? `<div style="color: #f44336; text-align: center; font-size: 12px; margin-top: 4px;">❌ Requires Level ${equipment.requirements.level}</div>` : ''}
        <div class="item-price">${price} 💰</div>
        <div class="item-actions">
          <button 
            class="action-btn buy" 
            data-action="buy" 
            data-id="${equipment.id}"
            ${!canPurchase ? 'disabled' : ''}
          >
            Purchase
          </button>
        </div>
      </div>
    `;
  }

  renderConsumablesTab() {
    const prices = MarketplaceManager.getConsumablePrices();

    return `
      <div class="consumables-list">
        <div class="consumable-item">
          <div class="consumable-info">
            <div class="consumable-icon">💚</div>
            <div class="consumable-details">
              <h3>Health Potion</h3>
              <p>Restores 20 HP during battle</p>
            </div>
          </div>
          <div class="consumable-purchase">
            <div style="color: #ffc107; font-size: 20px; font-weight: 700;">${prices.health_potion} 💰</div>
            <div class="quantity-selector">
              <button class="quantity-btn" data-action="buy-consumable" data-type="health_potion" data-qty="1">+1</button>
              <button class="quantity-btn" data-action="buy-consumable" data-type="health_potion" data-qty="5">+5</button>
              <button class="quantity-btn" data-action="buy-consumable" data-type="health_potion" data-qty="10">+10</button>
            </div>
          </div>
        </div>

        <div class="consumable-item">
          <div class="consumable-info">
            <div class="consumable-icon">💙</div>
            <div class="consumable-details">
              <h3>Mana Potion</h3>
              <p>Restores 30 Mana during battle</p>
            </div>
          </div>
          <div class="consumable-purchase">
            <div style="color: #ffc107; font-size: 20px; font-weight: 700;">${prices.mana_potion} 💰</div>
            <div class="quantity-selector">
              <button class="quantity-btn" data-action="buy-consumable" data-type="mana_potion" data-qty="1">+1</button>
              <button class="quantity-btn" data-action="buy-consumable" data-type="mana_potion" data-qty="5">+5</button>
              <button class="quantity-btn" data-action="buy-consumable" data-type="mana_potion" data-qty="10">+10</button>
            </div>
          </div>
        </div>
      </div>
    `;
  }

  renderRepairTab() {
    const inventory = EquipmentManager.getInventoryItems();
    const durabilityInfo = DurabilityManager.getAllDurability();

    const repairableItems = inventory.filter((eq) => {
      const info = durabilityInfo[eq.id];
      return info && info.current < info.max;
    });

    if (repairableItems.length === 0) {
      return `
        <div class="empty-state">
          <div class="empty-state-icon">✅</div>
          <div class="empty-state-text">All your equipment is in perfect condition!</div>
        </div>
      `;
    }

    return `
      <div class="items-grid">
        ${repairableItems.map((eq) => this.renderRepairItem(eq, durabilityInfo[eq.id])).join('')}
      </div>
    `;
  }

  renderRepairItem(equipment, durabilityInfo) {
    const repairCost = durabilityInfo.repairCost;
    const canAfford = EconomyManager.canAfford(repairCost);

    const stats = Object.entries(equipment.stats)
      .map(([stat, value]) => `+${value} ${stat}`)
      .join(', ');

    // Get slot label and icon
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
    const slot = slotInfo[equipment.type] || { icon: '📦', label: equipment.type };

    return `
      <div class="item-card" data-equipment-id="${equipment.id}">
        <div class="item-icon">${equipment.icon}</div>
        <div class="item-slot-type" style="color: #90caf9; font-size: 13px; font-weight: 600; margin: 5px 0;">
          ${slot.icon} ${slot.label}
        </div>
        <div class="item-rarity" style="color: ${RARITY_COLORS[equipment.rarity]}; font-size: 12px; text-transform: uppercase; text-align: center; margin: 4px 0;">
          ${RARITY_NAMES[equipment.rarity]}
        </div>
        <div class="item-name">${equipment.name}</div>
        <div class="item-stats" style="font-size: 12px; color: #b39ddb; margin: 8px 0; text-align: center;">${stats}</div>
        ${this.getClassRequirementHTML(equipment, false)}
        <div class="item-durability">
          <div class="durability-bar">
            <div class="durability-fill" style="width: ${durabilityInfo.percentage}%; background: ${durabilityInfo.color}"></div>
          </div>
          <div class="durability-text" style="color: ${durabilityInfo.color}">
            ${durabilityInfo.current}/${durabilityInfo.max} (${durabilityInfo.status})
          </div>
        </div>
        <div class="item-price">${repairCost} 💰</div>
        <div class="item-actions">
          <button 
            class="action-btn repair" 
            data-action="repair" 
            data-id="${equipment.id}"
            ${!canAfford ? 'disabled' : ''}
          >
            Repair
          </button>
        </div>
      </div>
    `;
  }

  renderSellTab() {
    const inventory = EquipmentManager.getInventoryItems();
    const equipped = SaveManager.get('equipped');

    if (inventory.length === 0) {
      return `
        <div class="empty-state">
          <div class="empty-state-icon">📦</div>
          <div class="empty-state-text">Your inventory is empty!</div>
        </div>
      `;
    }

    // Track which equipped items we've already marked
    // This handles the case where you have multiple copies of the same item
    const equippedItemsMarked = new Set();

    return `
      <div class="items-grid">
        ${inventory
          .map((eq) => {
            // Check if this specific item is equipped
            const isThisItemEquipped =
              Object.values(equipped).includes(eq.id) && !equippedItemsMarked.has(eq.id);

            // If this item is equipped, mark it so we don't mark duplicates
            if (isThisItemEquipped) {
              equippedItemsMarked.add(eq.id);
            }

            return this.renderSellItem(eq, isThisItemEquipped);
          })
          .join('')}
      </div>
    `;
  }

  renderSellItem(equipment, isEquipped) {
    const sellPrice = MarketplaceManager.getSellPrice(equipment);

    const stats = Object.entries(equipment.stats)
      .map(([stat, value]) => `+${value} ${stat}`)
      .join(', ');

    // Get slot label and icon
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
    const slot = slotInfo[equipment.type] || { icon: '📦', label: equipment.type };

    return `
      <div class="item-card" data-equipment-id="${equipment.id}">
        <div class="item-icon">${equipment.icon}</div>
        <div class="item-slot-type" style="color: #90caf9; font-size: 13px; font-weight: 600; margin: 5px 0;">
          ${slot.icon} ${slot.label}
        </div>
        <div class="item-rarity" style="color: ${RARITY_COLORS[equipment.rarity]}">
          ${RARITY_NAMES[equipment.rarity]}
        </div>
        <div class="item-name">${equipment.name}</div>
        <div class="item-stats" style="font-size: 12px; color: #b39ddb; margin: 8px 0;">${stats}</div>
        ${this.getClassRequirementHTML(equipment, true)}
        ${isEquipped ? '<div style="color: #ffc107; text-align: center; font-size: 13px; margin-top: 4px;">⚠️ Currently Equipped</div>' : ''}
        <div class="item-price">${sellPrice} 💰</div>
        <div class="item-actions">
          <button 
            class="action-btn sell" 
            data-action="sell" 
            data-id="${equipment.id}"
            ${isEquipped ? 'disabled' : ''}
          >
            Sell
          </button>
        </div>
      </div>
    `;
  }

  attachEventListeners() {
    // Close button
    this.shadowRoot.querySelector('#close-btn').addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      this.emit('close');
    });

    // Refresh button
    const refreshBtn = this.shadowRoot.querySelector('#refresh-btn');
    if (refreshBtn) {
      refreshBtn.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();

        const refreshCost = GameConfig.marketplace.refreshCost;

        // Confirm with user
        const confirmed = confirm(
          `Refresh shop inventory for ${refreshCost} gold?\n\n` +
            `This will generate new items immediately instead of waiting for the automatic refresh.`
        );

        if (confirmed) {
          const success = MarketplaceManager.forceRefreshWithCost(refreshCost);
          if (success) {
            // Re-render to show new inventory
            this.render();
          }
        }
      });
    }

    // Tab buttons
    this.shadowRoot.querySelectorAll('.tab-btn').forEach((btn) => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        this.activeTab = btn.dataset.tab;
        this.render();
      });
    });

    // Action buttons
    this.shadowRoot.querySelectorAll('[data-action]').forEach((btn) => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();

        const action = btn.dataset.action;
        const id = btn.dataset.id;
        const type = btn.dataset.type;
        const qty = parseInt(btn.dataset.qty);

        ConsoleLogger.debug(LogCategory.MARKETPLACE, `Action clicked: ${action}, ID: ${id}`);

        switch (action) {
          case 'buy':
            ConsoleLogger.info(LogCategory.MARKETPLACE, `Attempting to purchase item: ${id}`);
            if (MarketplaceManager.purchaseItem(id)) {
              ConsoleLogger.info(LogCategory.MARKETPLACE, `Purchase successful, re-rendering...`);
              this.render(); // Refresh
            } else {
              ConsoleLogger.warn(LogCategory.MARKETPLACE, `Purchase failed for item: ${id}`);
            }
            break;
          case 'sell':
            if (MarketplaceManager.sellItem(id)) {
              this.render(); // Refresh
            }
            break;
          case 'repair':
            if (DurabilityManager.repairItem(id)) {
              this.render(); // Refresh
            }
            break;
          case 'buy-consumable':
            if (MarketplaceManager.purchaseConsumable(type, qty)) {
              this.render(); // Refresh
            }
            break;
        }
      });
    });

    // Close on overlay click
    this.shadowRoot.querySelector('.overlay').addEventListener('click', () => {
      this.emit('close');
    });
  }
}

customElements.define('marketplace-screen', MarketplaceScreen);
