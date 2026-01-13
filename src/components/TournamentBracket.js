import { BaseComponent } from './BaseComponent.js';
import styles from '../styles/components/TournamentBracket.scss?inline';

/**
 * TournamentBracket Web Component
 * Displays tournament bracket and opponent selection
 *
 * Events:
 * - tournament-start: Tournament ready to begin
 * - back-to-menu: User wants to return to main menu
 */
export class TournamentBracket extends BaseComponent {
  constructor() {
    super();
    this._fighters = [];
    this._selectedOpponents = [];
    this._difficulty = 'normal';
  }

  set fighters(value) {
    this._fighters = value;
    this.render();
  }

  get fighters() {
    return this._fighters;
  }

  styles() {
    return styles;
  }

  template() {
    const difficultyInfo = {
      normal: {
        icon: '⚔️',
        name: 'Normal',
        desc: 'Standard difficulty. Balanced challenge for most players.',
        rewards: 'Guaranteed Rare equipment',
      },
      hard: {
        icon: '💀',
        name: 'Hard',
        desc: 'Opponents have +30% HP and +20% Strength. Recommended for experienced players.',
        rewards: 'Guaranteed Epic equipment + Bonus XP',
      },
      nightmare: {
        icon: '👹',
        name: 'Nightmare',
        desc: 'Opponents have +50% HP and +50% Strength. Only for true champions!',
        rewards: 'Guaranteed Legendary equipment + Massive XP',
      },
    };

    const currentDifficulty = difficultyInfo[this._difficulty];

    return `
      <div class="tournament-container">
        <button class="back-btn">← Back to Menu</button>

        <div class="tournament-header">
          <h1 class="tournament-title">🏆 Tournament 🏆</h1>
          <p class="tournament-subtitle">Face 4 opponents in a bracket-style championship!</p>
        </div>

        <!-- Difficulty Selection -->
        <div class="difficulty-section">
          <div class="section-title">Choose Difficulty</div>
          <div class="difficulty-buttons">
            <button class="difficulty-btn normal ${this._difficulty === 'normal' ? 'active' : ''}" data-difficulty="normal">
              ⚔️ Normal
            </button>
            <button class="difficulty-btn hard ${this._difficulty === 'hard' ? 'active' : ''}" data-difficulty="hard">
              💀 Hard
            </button>
            <button class="difficulty-btn nightmare ${this._difficulty === 'nightmare' ? 'active' : ''}" data-difficulty="nightmare">
              👹 Nightmare
            </button>
          </div>
          <div class="difficulty-info">
            <div class="difficulty-desc">
              <strong>${currentDifficulty.icon} ${currentDifficulty.name}:</strong> ${currentDifficulty.desc}<br>
              <span style="color: #ffa726;">🎁 Rewards: ${currentDifficulty.rewards}</span>
            </div>
          </div>
        </div>

        <!-- Opponent Selection -->
        <div class="opponent-selection">
          <div class="section-title">Select 4 Opponents</div>
          <div class="selected-count">
            Selected: ${this._selectedOpponents.length}/4
          </div>
          <div class="opponent-grid">
            ${this._fighters.map((fighter) => this.renderOpponentCard(fighter)).join('')}
          </div>
        </div>

        <!-- Start Button -->
        <button 
          class="start-tournament-btn" 
          ${this._selectedOpponents.length !== 4 ? 'disabled' : ''}
        >
          🏆 Start Tournament 🏆
        </button>

        <!-- Bracket Preview (if 4 selected) -->
        ${this._selectedOpponents.length === 4 ? this.renderBracketPreview() : ''}
      </div>
    `;
  }

  renderOpponentCard(fighter) {
    const isSelected = this._selectedOpponents.some((f) => f.id === fighter.id);

    return `
      <div class="opponent-card ${isSelected ? 'selected' : ''}" data-fighter-id="${fighter.id}">
        <img src="${fighter.image}" alt="${fighter.name}" class="opponent-avatar" />
        <div class="opponent-name">${fighter.name}</div>
        <div class="opponent-class">${fighter.class}</div>
        <div class="opponent-stats">
          <div class="stat-item">
            <div class="stat-value">${fighter.health}</div>
            <div class="stat-label">HP</div>
          </div>
          <div class="stat-item">
            <div class="stat-value">${fighter.strength}</div>
            <div class="stat-label">STR</div>
          </div>
        </div>
      </div>
    `;
  }

  renderBracketPreview() {
    const [op1, op2, op3, op4] = this._selectedOpponents;

    return `
      <div class="bracket-preview">
        <div class="bracket-title">Tournament Bracket</div>
        <div class="bracket-rounds">
          <!-- Quarter Finals -->
          <div class="bracket-round">
            <div class="round-name">Quarter Finals</div>
            <div class="round-match">
              <div class="match-fighter">YOU</div>
              <div style="color: #7e57c2;">vs</div>
              <div class="match-fighter">${op1.name}</div>
            </div>
          </div>

          <div class="bracket-arrow">→</div>

          <!-- Semi Final -->
          <div class="bracket-round">
            <div class="round-name">Semi Final</div>
            <div class="round-match">
              <div class="match-fighter">Winner</div>
              <div style="color: #7e57c2;">vs</div>
              <div class="match-fighter">${op2.name}</div>
            </div>
          </div>

          <div class="bracket-arrow">→</div>

          <!-- Final -->
          <div class="bracket-round">
            <div class="round-name">Grand Final</div>
            <div class="round-match">
              <div class="match-fighter">Champion</div>
              <div style="color: #7e57c2;">vs</div>
              <div class="match-fighter">${op3.name}</div>
            </div>
          </div>

          <div class="bracket-arrow">→</div>

          <!-- Trophy -->
          <div class="bracket-round">
            <div class="round-name">Victory</div>
            <div style="font-size: 64px; margin-top: 10px;">🏆</div>
          </div>
        </div>
        <div style="text-align: center; color: #b39ddb; font-size: 14px; margin-top: 20px;">
          Note: You'll face ${op4.name} as a bonus if you reach the championship!
        </div>
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

    // Difficulty buttons
    const difficultyBtns = this.shadowRoot.querySelectorAll('.difficulty-btn');
    difficultyBtns.forEach((btn) => {
      btn.addEventListener('click', () => {
        this._difficulty = btn.dataset.difficulty;
        this.updateDifficultyUI();
      });
    });

    // Opponent cards
    const opponentCards = this.shadowRoot.querySelectorAll('.opponent-card');
    opponentCards.forEach((card) => {
      card.addEventListener('click', () => {
        const fighterId = parseInt(card.dataset.fighterId);
        this.toggleOpponent(fighterId);
      });
    });

    // Start button
    const startBtn = this.shadowRoot.querySelector('.start-tournament-btn');
    if (startBtn) {
      startBtn.addEventListener('click', () => {
        if (this._selectedOpponents.length === 4) {
          this.emit('tournament-start', {
            opponents: this._selectedOpponents,
            difficulty: this._difficulty,
          });
        }
      });
    }
  }

  toggleOpponent(fighterId) {
    const fighter = this._fighters.find((f) => f.id === fighterId);
    if (!fighter) return;

    const index = this._selectedOpponents.findIndex((f) => f.id === fighterId);

    if (index !== -1) {
      // Deselect
      this._selectedOpponents.splice(index, 1);
    } else {
      // Select (if not at limit)
      if (this._selectedOpponents.length < 4) {
        this._selectedOpponents.push(fighter);
      } else {
        return; // Can't select more
      }
    }

    // Update UI without full re-render
    this.updateSelectionUI(fighterId);
  }

  updateDifficultyUI() {
    // Update active state on difficulty buttons
    const difficultyBtns = this.shadowRoot.querySelectorAll('.difficulty-btn');
    difficultyBtns.forEach((btn) => {
      if (btn.dataset.difficulty === this._difficulty) {
        btn.classList.add('active');
      } else {
        btn.classList.remove('active');
      }
    });

    // Update difficulty info text
    const difficultyInfo = {
      normal: {
        icon: '⚔️',
        name: 'Normal',
        desc: 'Standard difficulty. Balanced challenge for most players.',
        rewards: 'Guaranteed Rare equipment',
      },
      hard: {
        icon: '💀',
        name: 'Hard',
        desc: 'Opponents have +30% HP and +20% Strength. Recommended for experienced players.',
        rewards: 'Guaranteed Epic equipment + Bonus XP',
      },
      nightmare: {
        icon: '👹',
        name: 'Nightmare',
        desc: 'Opponents have +50% HP and +50% Strength. Only for true champions!',
        rewards: 'Guaranteed Legendary equipment + Massive XP',
      },
    };

    const currentDifficulty = difficultyInfo[this._difficulty];
    const difficultyDesc = this.shadowRoot.querySelector('.difficulty-desc');
    if (difficultyDesc) {
      difficultyDesc.innerHTML = `
        <strong>${currentDifficulty.icon} ${currentDifficulty.name}:</strong> ${currentDifficulty.desc}<br>
        <span style="color: #ffa726;">🎁 Rewards: ${currentDifficulty.rewards}</span>
      `;
    }
  }

  updateSelectionUI(toggledFighterId) {
    // Update the card's selected state
    const card = this.shadowRoot.querySelector(
      `.opponent-card[data-fighter-id="${toggledFighterId}"]`
    );
    if (card) {
      const isSelected = this._selectedOpponents.some((f) => f.id === toggledFighterId);
      if (isSelected) {
        card.classList.add('selected');
      } else {
        card.classList.remove('selected');
      }
    }

    // Update selected count
    const countDisplay = this.shadowRoot.querySelector('.selected-count');
    if (countDisplay) {
      countDisplay.textContent = `Selected: ${this._selectedOpponents.length}/4`;
    }

    // Update start button disabled state
    const startBtn = this.shadowRoot.querySelector('.start-tournament-btn');
    if (startBtn) {
      if (this._selectedOpponents.length === 4) {
        startBtn.disabled = false;
      } else {
        startBtn.disabled = true;
      }
    }

    // Update bracket preview
    const bracketPreview = this.shadowRoot.querySelector('.bracket-preview');
    if (this._selectedOpponents.length === 4) {
      // Show bracket preview if we have 4 selected
      if (!bracketPreview) {
        const container = this.shadowRoot.querySelector('.tournament-container');
        if (container) {
          const previewHTML = this.renderBracketPreview();
          const tempDiv = document.createElement('div');
          tempDiv.innerHTML = previewHTML;
          container.appendChild(tempDiv.firstElementChild);
        }
      } else {
        // Update existing bracket preview
        bracketPreview.innerHTML = this.getBracketPreviewContent();
      }
    } else {
      // Remove bracket preview if less than 4 selected
      if (bracketPreview) {
        bracketPreview.remove();
      }
    }
  }

  getBracketPreviewContent() {
    const [op1, op2, op3, op4] = this._selectedOpponents;

    return `
      <div class="bracket-title">Tournament Bracket</div>
      <div class="bracket-rounds">
        <!-- Quarter Finals -->
        <div class="bracket-round">
          <div class="round-name">Quarter Finals</div>
          <div class="round-match">
            <div class="match-fighter">YOU</div>
            <div style="color: #7e57c2;">vs</div>
            <div class="match-fighter">${op1.name}</div>
          </div>
        </div>

        <div class="bracket-arrow">→</div>

        <!-- Semi Final -->
        <div class="bracket-round">
          <div class="round-name">Semi Final</div>
          <div class="round-match">
            <div class="match-fighter">Winner</div>
            <div style="color: #7e57c2;">vs</div>
            <div class="match-fighter">${op2.name}</div>
          </div>
        </div>

        <div class="bracket-arrow">→</div>

        <!-- Final -->
        <div class="bracket-round">
          <div class="round-name">Grand Final</div>
          <div class="round-match">
            <div class="match-fighter">Champion</div>
            <div style="color: #7e57c2;">vs</div>
            <div class="match-fighter">${op3.name}</div>
          </div>
        </div>

        <div class="bracket-arrow">→</div>

        <!-- Trophy -->
        <div class="bracket-round">
          <div class="round-name">Victory</div>
          <div style="font-size: 64px; margin-top: 10px;">🏆</div>
        </div>
      </div>
      <div style="text-align: center; color: #b39ddb; font-size: 14px; margin-top: 20px;">
        Note: You'll face ${op4.name} as a bonus if you reach the championship!
      </div>
    `;
  }
}

customElements.define('tournament-bracket', TournamentBracket);
