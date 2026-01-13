import { BaseComponent } from './BaseComponent.js';
import styles from '../styles/components/FighterCard.scss?inline';

/**
 * FighterCard Web Component
 * Displays a fighter's information in a card format
 *
 * Attributes:
 * - fighter-id: Unique ID of the fighter
 * - fighter-name: Name of the fighter
 * - fighter-image: URL to fighter image
 * - fighter-health: Current health
 * - fighter-strength: Strength value
 * - fighter-class: Fighter class
 * - fighter-description: Bio/description
 * - draggable: Whether card is draggable
 * - selectable: Whether card is selectable
 */
export class FighterCard extends BaseComponent {
  static get observedAttributes() {
    return [
      'fighter-id',
      'fighter-name',
      'fighter-image',
      'fighter-health',
      'fighter-strength',
      'fighter-class',
      'fighter-description',
      'draggable',
      'selectable',
    ];
  }

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

  attributeChangedCallback(name, oldValue, newValue) {
    if (oldValue !== newValue) {
      this.render();
    }
  }

  styles() {
    return styles;
  }

  template() {
    const id = this.getAttribute('fighter-id') || this._fighter?.id || '';
    const name = this.getAttribute('fighter-name') || this._fighter?.name || 'Unknown Fighter';
    const image = this.getAttribute('fighter-image') || this._fighter?.image || '';
    const health = this.getAttribute('fighter-health') || this._fighter?.health || 0;
    const strength = this.getAttribute('fighter-strength') || this._fighter?.strength || 0;
    const fighterClass = this.getAttribute('fighter-class') || this._fighter?.class || 'BALANCED';
    const isDraggable = this.hasAttribute('draggable');
    const level = Math.floor(strength / 10) + 1; // Calculate level from strength

    return `
      <div class="fighter-card ${isDraggable ? 'draggable' : ''}" data-fighter-id="${id}">
        <div class="fighter-image-container">
          <img class="fighter-image" src="${image}" alt="${name}" />
          <div class="image-overlay"></div>
          <div class="level-indicator">
            ${level}
          </div>
          <div class="class-badge">${fighterClass}</div>
        </div>
        
        <div class="fighter-content">
          <h3 class="fighter-name">${name}</h3>
          <span class="fighter-class">${fighterClass}</span>
          
          <div class="fighter-stats">
            <div class="stat">
              <span class="stat-label">
                <span class="stat-icon">❤️</span>
                Health
              </span>
              <span class="stat-value">${health}</span>
            </div>
            <div class="stat">
              <span class="stat-label">
                <span class="stat-icon">⚔️</span>
                Power
              </span>
              <span class="stat-value">${strength}</span>
            </div>
          </div>
        </div>
      </div>
    `;
  }

  attachEventListeners() {
    const card = this.shadowRoot.querySelector('.fighter-card');

    if (this.hasAttribute('selectable')) {
      card.addEventListener('click', () => {
        this.emit('fighter-selected', {
          fighterId: this.getAttribute('fighter-id'),
          fighter: this._fighter,
        });
      });
    }

    if (this.hasAttribute('draggable')) {
      card.draggable = true;

      card.addEventListener('dragstart', (_e) => {
        this.emit('fighter-dragstart', {
          fighterId: this.getAttribute('fighter-id'),
          fighter: this._fighter,
        });
      });
    }
  }
}

// Register the component
customElements.define('fighter-card', FighterCard);
