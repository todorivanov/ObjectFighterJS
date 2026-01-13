import { BaseComponent } from './BaseComponent.js';
import styles from '../styles/components/VictoryScreen.scss?inline';

/**
 * VictoryScreen Web Component
 * Epic victory/defeat celebration screen
 *
 * Attributes:
 * - winner-name: Name of the winner
 * - winner-image: Image URL
 * - winner-class: Fighter class
 *
 * Events:
 * - play-again: User wants to play again
 * - main-menu: User wants to return to main menu
 * - close: User wants to close overlay and view logs
 */
export class VictoryScreen extends BaseComponent {
  static get observedAttributes() {
    return ['winner-name', 'winner-image', 'winner-class'];
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
    const winnerName = this.getAttribute('winner-name') || 'Champion';
    const winnerImage = this.getAttribute('winner-image') || '';
    const winnerClass = this.getAttribute('winner-class') || 'Warrior';

    return `
      <div class="victory-overlay">
        <div class="sparkles" id="sparkles"></div>
        
        <div class="victory-content">
          <div class="content-inner">
            <div class="victory-badge">
              <span class="trophy">🏆</span>
            </div>

            <h1 class="victory-title">Victory!</h1>

            <div class="winner-card">
              <img class="winner-avatar" src="${winnerImage}" alt="${winnerName}" />
              <div class="winner-info">
                <div class="winner-label">Champion</div>
                <div class="winner-name">${winnerName}</div>
                <div class="winner-class">${winnerClass}</div>
              </div>
            </div>

            <div class="victory-buttons">
              <button class="victory-btn btn-primary" data-action="play-again">
                ⚔️ Play Again
              </button>
              <button class="victory-btn btn-secondary" data-action="main-menu">
                🏠 Main Menu
              </button>
            </div>
            
            <button class="victory-btn btn-close" data-action="close">
              👁️ Close & View Logs
            </button>
            <div class="close-hint">
              Close this screen to review combat logs and final stats
            </div>
          </div>
        </div>
      </div>
    `;
  }

  attachEventListeners() {
    const buttons = this.shadowRoot.querySelectorAll('.victory-btn');

    buttons.forEach((btn) => {
      btn.addEventListener('click', () => {
        const action = btn.dataset.action;
        this.emit(action);
      });
    });

    // Create falling sparkles
    this.createSparkles();
  }

  createSparkles() {
    const container = this.shadowRoot.querySelector('#sparkles');
    const sparkleCount = 30;

    for (let i = 0; i < sparkleCount; i++) {
      const sparkle = document.createElement('div');
      sparkle.className = 'sparkle';
      sparkle.style.left = `${Math.random() * 100}%`;
      sparkle.style.animationDelay = `${Math.random() * 3}s`;
      sparkle.style.animationDuration = `${2 + Math.random() * 2}s`;
      container.appendChild(sparkle);
    }
  }
}

// Register the component
customElements.define('victory-screen', VictoryScreen);
