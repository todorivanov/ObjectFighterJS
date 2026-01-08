import { BaseComponent } from './BaseComponent.js';
import { MarketplaceManager } from '../game/MarketplaceManager.js';
import { DurabilityManager } from '../game/DurabilityManager.js';
import { EquipmentManager } from '../game/EquipmentManager.js';
import { EconomyManager } from '../game/EconomyManager.js';
import { SaveManager } from '../utils/saveManager.js';
import { RARITY_COLORS, RARITY_NAMES } from '../data/equipment.js';

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
    return `
      :host {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        z-index: 2000;
        display: flex;
        align-items: center;
        justify-content: center;
      }

      .overlay {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.85);
        backdrop-filter: blur(8px);
        animation: fadeIn 0.3s ease;
      }

      .marketplace-container {
        position: relative;
        width: 90%;
        max-width: 1200px;
        height: 85vh;
        max-height: 800px;
        background: linear-gradient(135deg, #1a0d2e 0%, #2d1b69 50%, #1a0d2e 100%);
        border-radius: 20px;
        border: 2px solid rgba(106, 66, 194, 0.5);
        box-shadow: 0 20px 60px rgba(0, 0, 0, 0.8);
        display: flex;
        flex-direction: column;
        animation: slideUp 0.4s ease;
        overflow: hidden;
      }

      .marketplace-header {
        padding: 25px 30px;
        background: linear-gradient(135deg, rgba(106, 66, 194, 0.3), rgba(42, 26, 71, 0.5));
        border-bottom: 2px solid rgba(106, 66, 194, 0.5);
        display: flex;
        justify-content: space-between;
        align-items: center;
      }

      .header-left {
        flex: 1;
      }

      .marketplace-title {
        font-size: 32px;
        font-weight: 900;
        color: #ffa726;
        margin: 0 0 5px 0;
        text-transform: uppercase;
        letter-spacing: 2px;
      }

      .refresh-info {
        font-size: 14px;
        color: #b39ddb;
      }

      .header-right {
        display: flex;
        align-items: center;
        gap: 20px;
      }

      .gold-display {
        font-size: 24px;
        font-weight: 700;
        color: #ffc107;
        padding: 10px 20px;
        background: rgba(255, 193, 7, 0.1);
        border: 2px solid rgba(255, 193, 7, 0.3);
        border-radius: 12px;
      }

      .close-btn {
        padding: 12px 24px;
        font-size: 18px;
        font-weight: 700;
        color: white;
        background: rgba(244, 67, 54, 0.3);
        border: 2px solid rgba(244, 67, 54, 0.5);
        border-radius: 10px;
        cursor: pointer;
        transition: all 0.3s ease;
      }

      .close-btn:hover {
        background: rgba(244, 67, 54, 0.5);
        transform: scale(1.05);
      }

      .tabs-container {
        display: flex;
        gap: 10px;
        padding: 20px 30px 0;
        background: rgba(0, 0, 0, 0.2);
      }

      .tab-btn {
        padding: 15px 30px;
        font-size: 16px;
        font-weight: 700;
        color: rgba(255, 255, 255, 0.6);
        background: rgba(106, 66, 194, 0.2);
        border: 2px solid transparent;
        border-radius: 12px 12px 0 0;
        cursor: pointer;
        transition: all 0.3s ease;
        text-transform: uppercase;
        letter-spacing: 1px;
      }

      .tab-btn:hover {
        color: white;
        background: rgba(106, 66, 194, 0.3);
      }

      .tab-btn.active {
        color: #ffa726;
        background: rgba(106, 66, 194, 0.4);
        border-color: #6a42c2;
      }

      .content-area {
        flex: 1;
        padding: 30px;
        overflow-y: auto;
      }

      .items-grid {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
        gap: 20px;
      }

      .item-card {
        background: linear-gradient(135deg, rgba(106, 66, 194, 0.2), rgba(42, 26, 71, 0.3));
        border: 2px solid rgba(106, 66, 194, 0.3);
        border-radius: 12px;
        padding: 20px;
        transition: all 0.3s ease;
        cursor: pointer;
      }

      .item-card:hover {
        transform: translateY(-5px);
        border-color: #ffa726;
        box-shadow: 0 8px 20px rgba(255, 167, 38, 0.3);
      }

      .item-icon {
        font-size: 48px;
        text-align: center;
        margin-bottom: 10px;
      }

      .item-rarity {
        text-align: center;
        font-size: 12px;
        font-weight: 700;
        text-transform: uppercase;
        letter-spacing: 1px;
        margin-bottom: 5px;
      }

      .item-name {
        font-size: 18px;
        font-weight: 700;
        color: white;
        text-align: center;
        margin-bottom: 8px;
      }

      .item-description {
        font-size: 13px;
        color: #b39ddb;
        text-align: center;
        margin-bottom: 10px;
        min-height: 40px;
      }

      .item-stats {
        font-size: 12px;
        color: #4caf50;
        margin-bottom: 10px;
      }

      .item-durability {
        margin-bottom: 10px;
      }

      .durability-bar {
        height: 6px;
        background: rgba(0, 0, 0, 0.3);
        border-radius: 3px;
        overflow: hidden;
        margin-bottom: 5px;
      }

      .durability-fill {
        height: 100%;
        transition: width 0.3s ease;
      }

      .durability-text {
        font-size: 11px;
        text-align: center;
      }

      .item-price {
        font-size: 20px;
        font-weight: 700;
        color: #ffc107;
        text-align: center;
        margin-bottom: 10px;
      }

      .item-actions {
        display: flex;
        gap: 8px;
      }

      .action-btn {
        flex: 1;
        padding: 10px;
        font-size: 14px;
        font-weight: 700;
        color: white;
        background: linear-gradient(135deg, rgba(106, 66, 194, 0.4), rgba(42, 26, 71, 0.6));
        border: 2px solid rgba(106, 66, 194, 0.5);
        border-radius: 8px;
        cursor: pointer;
        transition: all 0.3s ease;
        text-transform: uppercase;
      }

      .action-btn:hover {
        background: linear-gradient(135deg, #6a42c2, #9c27b0);
        transform: scale(1.05);
      }

      .action-btn:disabled {
        opacity: 0.5;
        cursor: not-allowed;
      }

      .action-btn.buy {
        background: linear-gradient(135deg, rgba(76, 175, 80, 0.4), rgba(56, 142, 60, 0.6));
        border-color: rgba(76, 175, 80, 0.5);
      }

      .action-btn.buy:hover {
        background: linear-gradient(135deg, #4caf50, #388e3c);
      }

      .action-btn.sell {
        background: linear-gradient(135deg, rgba(255, 152, 0, 0.4), rgba(245, 124, 0, 0.6));
        border-color: rgba(255, 152, 0, 0.5);
      }

      .action-btn.sell:hover {
        background: linear-gradient(135deg, #ff9800, #f57c00);
      }

      .action-btn.repair {
        background: linear-gradient(135deg, rgba(33, 150, 243, 0.4), rgba(21, 101, 192, 0.6));
        border-color: rgba(33, 150, 243, 0.5);
      }

      .action-btn.repair:hover {
        background: linear-gradient(135deg, #2196f3, #1565c0);
      }

      .empty-state {
        text-align: center;
        padding: 60px 20px;
        color: #b39ddb;
      }

      .empty-state-icon {
        font-size: 64px;
        margin-bottom: 20px;
      }

      .empty-state-text {
        font-size: 18px;
      }

      .consumable-item {
        display: flex;
        justify-content: space-between;
        align-items: center;
        background: linear-gradient(135deg, rgba(106, 66, 194, 0.2), rgba(42, 26, 71, 0.3));
        border: 2px solid rgba(106, 66, 194, 0.3);
        border-radius: 12px;
        padding: 20px;
        margin-bottom: 15px;
      }

      .consumable-info {
        display: flex;
        align-items: center;
        gap: 20px;
      }

      .consumable-icon {
        font-size: 48px;
      }

      .consumable-details h3 {
        font-size: 20px;
        color: white;
        margin: 0 0 5px 0;
      }

      .consumable-details p {
        font-size: 14px;
        color: #b39ddb;
        margin: 0;
      }

      .consumable-purchase {
        display: flex;
        align-items: center;
        gap: 15px;
      }

      .quantity-selector {
        display: flex;
        align-items: center;
        gap: 10px;
      }

      .quantity-btn {
        width: 36px;
        height: 36px;
        font-size: 20px;
        font-weight: 700;
        color: white;
        background: rgba(106, 66, 194, 0.4);
        border: 2px solid rgba(106, 66, 194, 0.5);
        border-radius: 8px;
        cursor: pointer;
        transition: all 0.2s ease;
      }

      .quantity-btn:hover {
        background: rgba(106, 66, 194, 0.6);
      }

      .quantity-display {
        font-size: 18px;
        font-weight: 700;
        color: white;
        min-width: 30px;
        text-align: center;
      }

      @keyframes fadeIn {
        from { opacity: 0; }
        to { opacity: 1; }
      }

      @keyframes slideUp {
        from {
          opacity: 0;
          transform: translateY(30px);
        }
        to {
          opacity: 1;
          transform: translateY(0);
        }
      }

      @media (max-width: 768px) {
        .items-grid {
          grid-template-columns: 1fr;
        }
      }
    `;
  }

  template() {
    const gold = EconomyManager.getGold();
    const refreshTime = MarketplaceManager.getRefreshTimeFormatted();

    return `
      <div class="overlay"></div>
      <div class="marketplace-container">
        <div class="marketplace-header">
          <div class="header-left">
            <h1 class="marketplace-title">🏪 Marketplace</h1>
            <div class="refresh-info">Shop refreshes in: ${refreshTime}</div>
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
        ${inventory.map(eq => this.renderShopItem(eq)).join('')}
      </div>
    `;
  }

  renderShopItem(equipment) {
    const price = MarketplaceManager.getItemPrice(equipment);
    const canAfford = EconomyManager.canAfford(price);
    const playerLevel = SaveManager.get('profile.level');
    const meetsRequirements = equipment.requirements.level <= playerLevel;

    const stats = Object.entries(equipment.stats)
      .map(([stat, value]) => `+${value} ${stat}`)
      .join(', ');

    return `
      <div class="item-card" data-equipment-id="${equipment.id}">
        <div class="item-icon">${equipment.icon}</div>
        <div class="item-rarity" style="color: ${RARITY_COLORS[equipment.rarity]}">
          ${RARITY_NAMES[equipment.rarity]}
        </div>
        <div class="item-name">${equipment.name}</div>
        <div class="item-description">${equipment.description}</div>
        <div class="item-stats">${stats}</div>
        ${!meetsRequirements ? `<div style="color: #f44336; text-align: center; font-size: 12px;">Requires Level ${equipment.requirements.level}</div>` : ''}
        <div class="item-price">${price} 💰</div>
        <div class="item-actions">
          <button 
            class="action-btn buy" 
            data-action="buy" 
            data-id="${equipment.id}"
            ${!canAfford || !meetsRequirements ? 'disabled' : ''}
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
    
    const repairableItems = inventory.filter(eq => {
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
        ${repairableItems.map(eq => this.renderRepairItem(eq, durabilityInfo[eq.id])).join('')}
      </div>
    `;
  }

  renderRepairItem(equipment, durabilityInfo) {
    const repairCost = durabilityInfo.repairCost;
    const canAfford = EconomyManager.canAfford(repairCost);

    return `
      <div class="item-card" data-equipment-id="${equipment.id}">
        <div class="item-icon">${equipment.icon}</div>
        <div class="item-name">${equipment.name}</div>
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

    return `
      <div class="items-grid">
        ${inventory.map(eq => this.renderSellItem(eq, equipped)).join('')}
      </div>
    `;
  }

  renderSellItem(equipment, equipped) {
    const sellPrice = MarketplaceManager.getSellPrice(equipment);
    const isEquipped = Object.values(equipped).includes(equipment.id);

    return `
      <div class="item-card" data-equipment-id="${equipment.id}">
        <div class="item-icon">${equipment.icon}</div>
        <div class="item-rarity" style="color: ${RARITY_COLORS[equipment.rarity]}">
          ${RARITY_NAMES[equipment.rarity]}
        </div>
        <div class="item-name">${equipment.name}</div>
        ${isEquipped ? '<div style="color: #ffc107; text-align: center; font-size: 13px;">⚠️ Currently Equipped</div>' : ''}
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
    this.shadowRoot.querySelector('#close-btn').addEventListener('click', () => {
      this.emit('close');
    });

    // Tab buttons
    this.shadowRoot.querySelectorAll('.tab-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        this.activeTab = btn.dataset.tab;
        this.render();
      });
    });

    // Action buttons
    this.shadowRoot.querySelectorAll('[data-action]').forEach(btn => {
      btn.addEventListener('click', () => {
        const action = btn.dataset.action;
        const id = btn.dataset.id;
        const type = btn.dataset.type;
        const qty = parseInt(btn.dataset.qty);

        switch (action) {
          case 'buy':
            if (MarketplaceManager.purchaseItem(id)) {
              this.render(); // Refresh
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
