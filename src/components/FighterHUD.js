import { BaseComponent } from './BaseComponent.js';
import './StatusEffectIcon.js';
import styles from '../styles/components/FighterHUD.scss?inline';

/**
 * FighterHUD Web Component
 * Displays fighter stats during combat
 *
 * Properties:
 * - fighter1: First fighter data
 * - fighter2: Second fighter data
 * - round: Current round number
 */
export class FighterHUD extends BaseComponent {
  constructor() {
    super();
    this._fighter1 = null;
    this._fighter2 = null;
    this._fighter1MaxHealth = 0;
    this._fighter2MaxHealth = 0;
    this._round = 0;
  }

  set fighter1(data) {
    this._fighter1 = data;
    if (data && !this._fighter1MaxHealth) {
      this._fighter1MaxHealth = data.maxHealth || data.health;
    }
    this.render();
  }

  set fighter2(data) {
    this._fighter2 = data;
    if (data && !this._fighter2MaxHealth) {
      this._fighter2MaxHealth = data.maxHealth || data.health;
    }
    this.render();
  }

  set round(num) {
    this._round = num;
    this.render();
  }

  styles() {
    return styles;
  }

  template() {
    if (!this._fighter1 || !this._fighter2) {
      return '<div class="fighter-stats-hud"><p>Loading...</p></div>';
    }

    return `
      <div class="fighter-stats-hud">
        ${this.renderFighterCard(this._fighter1, this._fighter1MaxHealth, 'left')}
        
        <div class="round-indicator" id="round-indicator">
          ${this._round > 0 ? `⚔️ ROUND ${this._round} ⚔️` : '⚔️ BATTLE ARENA ⚔️'}
        </div>
        
        ${this.renderFighterCard(this._fighter2, this._fighter2MaxHealth, 'right')}
      </div>
    `;
  }

  renderFighterCard(fighter, maxHealth, side) {
    const currentHealth = Math.max(0, fighter.health);
    const healthPercent = Math.max(0, Math.min(100, (currentHealth / maxHealth) * 100));
    const currentMana = Math.max(0, fighter.mana || 0);
    const maxMana = fighter.maxMana || 100;
    const manaPercent = Math.max(0, Math.min(100, (currentMana / maxMana) * 100));

    let healthClass = '';
    if (healthPercent < 30) healthClass = 'low';
    else if (healthPercent < 60) healthClass = 'medium';

    const statusEffects = fighter.statusEffects || [];
    const statusEffectsHTML = statusEffects
      .map(
        (effect) =>
          `<status-effect-icon
        effect-name="${effect.name}"
        effect-icon="${effect.icon}"
        effect-type="${effect.type}"
        effect-duration="${effect.duration}"
      ></status-effect-icon>`
      )
      .join('');

    return `
      <div class="fighter-stat-card ${side}">
        <img class="fighter-stat-avatar" src="${fighter.image}" alt="${fighter.name}" />
        <div class="fighter-stat-info">
          <div class="fighter-stat-name">${fighter.name}</div>
          <div class="fighter-stat-class">${fighter.class || 'Fighter'}</div>
          <div class="status-effects-container">${statusEffectsHTML}</div>
          <div class="fighter-stat-bars">
            <div class="stat-bar">
              <span class="stat-bar-label">❤️ HP</span>
              <div class="stat-bar-container">
                <div class="stat-bar-fill health ${healthClass}" style="width: ${healthPercent}%">
                  <span>${Math.round(healthPercent)}%</span>
                </div>
              </div>
              <span class="stat-value">${currentHealth} / ${maxHealth}</span>
            </div>
            <div class="stat-bar">
              <span class="stat-bar-label">💧 MP</span>
              <div class="stat-bar-container">
                <div class="stat-bar-fill mana" style="width: ${manaPercent}%">
                  <span>${Math.round(manaPercent)}%</span>
                </div>
              </div>
              <span class="stat-value">${currentMana} / ${maxMana}</span>
            </div>
            <div class="stat-bar">
              <span class="stat-bar-label">⚔️ STR</span>
              <div class="stat-bar-container">
                <div class="stat-bar-fill strength" style="width: 100%"></div>
              </div>
              <span class="stat-value">${fighter.strength}</span>
            </div>
          </div>
        </div>
      </div>
    `;
  }

  showWinner(winner) {
    const roundIndicator = this.shadowRoot.querySelector('#round-indicator');
    if (roundIndicator) {
      roundIndicator.textContent = `🏆 ${winner.name.toUpperCase()} WINS! 🏆`;
      roundIndicator.classList.add('victory');
    }
  }
}

// Register the component
customElements.define('fighter-hud', FighterHUD);
