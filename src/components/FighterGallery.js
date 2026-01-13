import { BaseComponent } from './BaseComponent.js';
import galleryStyles from '../styles/components/FighterGallery.scss?inline';

/**
 * FighterGallery Web Component
 * Modern fighter selection gallery with filters
 *
 * Properties:
 * - fighters: Array of fighter data
 * - mode: 'single' | 'team'
 *
 * Events:
 * - fighter-selected: { fighter, selectedCount }
 * - selection-complete: { fighter1, fighter2 } or { team1: [], team2: [] }
 */
export class FighterGallery extends BaseComponent {
  constructor() {
    super();
    this._fighters = [];
    this._mode = 'single';
    this._selectedFighters = [];
    this._filter = 'ALL';
  }

  set fighters(data) {
    this._fighters = data;
    this.render();
  }

  set mode(value) {
    this._mode = value;
    this.render();
  }

  styles() {
    return galleryStyles;
  }

  template() {
    const classes = ['ALL', 'TANK', 'BALANCED', 'AGILE', 'MAGE', 'HYBRID', 'ASSASSIN', 'BRAWLER'];

    // Determine mode text based on selection type
    let modeText, needsCount;
    if (this._mode === 'opponent') {
      modeText = '⚔️ Choose Your Opponent ⚔️';
      needsCount = 1;
    } else if (this._mode === 'single') {
      modeText = 'Choose 2 Fighters';
      needsCount = 2;
    } else {
      modeText = 'Build Your Teams';
      needsCount = 4;
    }

    const selectionCount = this._selectedFighters.length;

    return `
      <div class="gallery-container">
        <button class="back-btn">← Back to Menu</button>

        <div class="gallery-header">
          <h2 class="gallery-title">${modeText}</h2>
          <p class="gallery-subtitle">${this._mode === 'opponent' ? 'Who will you face in battle?' : 'Select your warriors'}</p>
        </div>

        <div class="filter-bar">
          ${classes
            .map(
              (cls) => `
            <button 
              class="filter-btn ${this._filter === cls ? 'active' : ''}" 
              data-class="${cls}"
            >
              ${cls}
            </button>
          `
            )
            .join('')}
        </div>

        <div class="fighters-grid" id="fighters-grid"></div>

        ${
          selectionCount >= needsCount
            ? `
          <div class="selection-status">
            <div class="status-text">✓ Selection Complete!</div>
            <button class="start-btn">Start Battle</button>
          </div>
        `
            : ''
        }
      </div>
    `;
  }

  attachEventListeners() {
    // Filter buttons
    const filterButtons = this.shadowRoot.querySelectorAll('.filter-btn');
    filterButtons.forEach((btn) => {
      btn.addEventListener('click', () => {
        this._filter = btn.dataset.class;
        this.render();
        this.renderFighters();
      });
    });

    // Back button
    const backBtn = this.shadowRoot.querySelector('.back-btn');
    if (backBtn) {
      backBtn.addEventListener('click', () => {
        this.emit('back-to-menu');
      });
    }

    // Start button
    const startBtn = this.shadowRoot.querySelector('.start-btn');
    if (startBtn) {
      startBtn.addEventListener('click', () => {
        this.emit('selection-complete', { fighters: this._selectedFighters });
      });
    }

    // Render fighters
    this.renderFighters();
  }

  renderFighters() {
    const grid = this.shadowRoot.querySelector('#fighters-grid');
    if (!grid) return;

    grid.innerHTML = '';

    const filtered =
      this._filter === 'ALL'
        ? this._fighters
        : this._fighters.filter((f) => f.class === this._filter);

    filtered.forEach((fighter, index) => {
      const card = document.createElement('fighter-card');
      card.fighter = fighter;
      card.setAttribute('fighter-id', fighter.id);
      card.setAttribute('selectable', 'true');
      card.style.animationDelay = `${index * 0.05}s`;

      // Check if already selected
      const isSelected = this._selectedFighters.find((f) => f.id === fighter.id);
      if (isSelected) {
        card.classList.add('selected');
      }

      card.addEventListener('fighter-selected', (e) => {
        // Add selected class
        card.classList.add('selected');
        this.handleFighterSelection(e.detail.fighter);
      });

      grid.appendChild(card);
    });
  }

  handleFighterSelection(fighter) {
    // Check if already selected
    const alreadySelected = this._selectedFighters.find((f) => f.id === fighter.id);
    if (alreadySelected) {
      return; // Already selected, ignore
    }

    // For opponent mode, only allow one selection
    if (this._mode === 'opponent' && this._selectedFighters.length >= 1) {
      // Remove previous selection
      const previousFighter = this._selectedFighters[0];
      this._selectedFighters = [];

      // Remove highlight from previous card
      const cards = this.shadowRoot.querySelectorAll('fighter-card');
      cards.forEach((card) => {
        if (parseInt(card.getAttribute('fighter-id')) === previousFighter.id) {
          card.classList.remove('selected');
        }
      });
    }

    this._selectedFighters.push(fighter);
    this.emit('fighter-selected', {
      fighter,
      selectedCount: this._selectedFighters.length,
    });

    // Just update the status footer, don't re-render everything
    this.updateSelectionStatus();
  }

  /**
   * Update selection status without re-rendering everything
   */
  updateSelectionStatus() {
    // Determine needed count based on mode
    let needsCount;
    if (this._mode === 'opponent') {
      needsCount = 1;
    } else if (this._mode === 'single') {
      needsCount = 2;
    } else {
      needsCount = 4;
    }

    const selectionCount = this._selectedFighters.length;

    // Update or create selection status
    const statusEl = this.shadowRoot.querySelector('.selection-status');

    if (selectionCount >= needsCount) {
      if (!statusEl) {
        // Create status element
        const statusHTML = `
          <div class="selection-status">
            <div class="status-text">✓ Selection Complete!</div>
            <button class="start-btn">Start Battle</button>
          </div>
        `;
        this.shadowRoot
          .querySelector('.gallery-container')
          .insertAdjacentHTML('beforeend', statusHTML);

        // Attach event listener
        const startBtn = this.shadowRoot.querySelector('.start-btn');
        if (startBtn) {
          startBtn.addEventListener('click', () => {
            this.emit('selection-complete', { fighters: this._selectedFighters });
          });
        }
      }
    } else if (statusEl) {
      statusEl.remove();
    }

    // Update selected fighters display
    this.updateSelectedFightersDisplay();
  }

  /**
   * Update the selected fighters display area
   */
  updateSelectedFightersDisplay() {
    let displayArea = this.shadowRoot.querySelector('.selected-fighters-display');

    if (!displayArea) {
      // Create display area
      const gallery = this.shadowRoot.querySelector('.fighters-grid');
      if (gallery && gallery.parentNode) {
        gallery.parentNode.insertBefore(this.createSelectedDisplay(), gallery);
        displayArea = this.shadowRoot.querySelector('.selected-fighters-display');
      }
    }

    if (displayArea) {
      if (this._selectedFighters.length > 0) {
        // Determine needed count for display
        let maxCount;
        if (this._mode === 'opponent') {
          maxCount = '1';
        } else if (this._mode === 'single') {
          maxCount = '2';
        } else {
          maxCount = '4';
        }

        displayArea.innerHTML = `
          <div class="selected-header">
            <h4>Selected: ${this._selectedFighters.length}/${maxCount}</h4>
          </div>
          <div class="selected-list">
            ${this._selectedFighters
              .map(
                (fighter) => `
              <div class="selected-fighter-chip">
                <img src="${fighter.image}" alt="${fighter.name}" />
                <span>${fighter.name}</span>
                <button class="remove-btn" data-fighter-id="${fighter.id}">✕</button>
              </div>
            `
              )
              .join('')}
          </div>
        `;

        // Attach remove buttons
        displayArea.querySelectorAll('.remove-btn').forEach((btn) => {
          btn.addEventListener('click', (e) => {
            const fighterId = parseInt(e.target.dataset.fighterId);
            this.removeFighter(fighterId);
            e.stopPropagation();
          });
        });

        displayArea.style.display = 'block';
      } else {
        displayArea.style.display = 'none';
      }
    }
  }

  /**
   * Create selected fighters display element
   */
  createSelectedDisplay() {
    const div = document.createElement('div');
    div.className = 'selected-fighters-display';
    div.style.display = 'none';
    return div;
  }

  /**
   * Remove a fighter from selection
   */
  removeFighter(fighterId) {
    this._selectedFighters = this._selectedFighters.filter((f) => f.id !== fighterId);

    // Remove highlight from card
    const cards = this.shadowRoot.querySelectorAll('fighter-card');
    cards.forEach((card) => {
      if (parseInt(card.getAttribute('fighter-id')) === fighterId) {
        card.classList.remove('selected');
      }
    });

    this.updateSelectionStatus();
  }
}

// Register the component
customElements.define('fighter-gallery', FighterGallery);
