import { BaseComponent } from './BaseComponent.js';
import actionStyles from '../styles/components/ActionSelection.scss?inline';

/**
 * ActionSelection Web Component
 * Displays action buttons for turn-based combat
 *
 * Properties:
 * - fighter: Fighter object with skills, mana, health data
 *
 * Events:
 * - action-selected: { action, skillIndex }
 */
export class ActionSelection extends BaseComponent {
  constructor() {
    super();
    this._fighter = null;
  }

  set fighter(data) {
    this._fighter = data;
    this.render();
  }

  get fighter() {
    return this._fighter;
  }

  styles() {
    return actionStyles;
  }

  template() {
    if (!this._fighter) {
      return '<div class="action-selection-ui"><p>Loading...</p></div>';
    }

    const skillButtonsHTML = this._fighter.skills
      .map((skill, index) => {
        const isDisabled = !skill.isReady() || this._fighter.mana < skill.manaCost;
        const cooldownText = !skill.isReady()
          ? `⏱️ ${skill.currentCooldown}`
          : `💧 ${skill.manaCost}`;

        return `
        <button 
          class="action-btn skill-btn" 
          data-action="skill" 
          data-skill-index="${index}"
          ${isDisabled ? 'disabled' : ''}
        >
          <span class="action-icon">💫</span>
          <span class="action-name">${skill.name}</span>
          <span class="action-desc">${cooldownText}</span>
        </button>
      `;
      })
      .join('');

    const canHeal = this._fighter.health < this._fighter.maxHealth;

    return `
      <div class="action-selection-ui">
        <div class="action-prompt">
          <h3>⚔️ ${this._fighter.name}'s Turn!</h3>
          <p>Choose your action</p>
        </div>
        
        <div class="action-buttons">
          <button class="action-btn attack-btn" data-action="attack">
            <span class="action-icon">⚔️</span>
            <span class="action-name">Attack</span>
            <span class="action-desc">Basic attack</span>
          </button>
          
          <button class="action-btn defend-btn" data-action="defend">
            <span class="action-icon">🛡️</span>
            <span class="action-name">Defend</span>
            <span class="action-desc">-50% damage</span>
          </button>
          
          ${skillButtonsHTML}
          
          <button class="action-btn item-btn" data-action="item" ${!canHeal ? 'disabled' : ''}>
            <span class="action-icon">🧪</span>
            <span class="action-name">Heal</span>
            <span class="action-desc">+20 HP</span>
          </button>
        </div>

        <div class="surrender-container">
          <button class="surrender-btn" data-action="surrender">
            <span class="surrender-icon">🏳️</span>
            <span class="surrender-text">Surrender</span>
          </button>
        </div>
      </div>
    `;
  }

  attachEventListeners() {
    const buttons = this.shadowRoot.querySelectorAll('.action-btn');

    // Check if opponent is out of range and update attack button
    const inRange = this.dataset.inRange === 'true';
    const attackBtn = this.shadowRoot.querySelector('.attack-btn');
    if (attackBtn && !inRange) {
      attackBtn.classList.add('out-of-range');
    }

    buttons.forEach((btn) => {
      btn.addEventListener('click', (e) => {
        if (!e.currentTarget.disabled) {
          const action = e.currentTarget.dataset.action;
          const skillIndex = e.currentTarget.dataset.skillIndex;

          e.currentTarget.classList.add('selected');

          setTimeout(() => {
            const actionData =
              action === 'skill' && skillIndex !== undefined
                ? { action: 'skill', skillIndex: parseInt(skillIndex) }
                : { action };

            this.emit('action-selected', actionData);
            this.remove();
          }, 300);
        }
      });
    });

    // Handle surrender button
    const surrenderBtn = this.shadowRoot.querySelector('.surrender-btn');
    if (surrenderBtn) {
      surrenderBtn.addEventListener('click', () => {
        if (confirm('Are you sure you want to surrender? You will lose this battle!')) {
          this.emit('action-selected', { action: 'surrender' });
          this.remove();
        }
      });
    }
  }
}

// Register the component
customElements.define('action-selection', ActionSelection);
