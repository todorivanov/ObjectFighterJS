import { BaseComponent } from './BaseComponent.js';
import styles from '../styles/components/TitleScreen.scss?inline';

/**
 * TitleScreen Web Component
 * Epic game title screen with animated background
 *
 * Events:
 * - mode-selected: { mode: 'single' | 'team' }
 * - tournament-selected: User wants to start tournament
 */
export class TitleScreen extends BaseComponent {
  styles() {
    return styles;
  }

  template() {
    return `
      <div class="title-screen">
        <div class="bg-particles" id="particles"></div>
        
        <div class="content">
          <div class="logo">
            <h1 class="game-title">Legends of the Arena</h1>
            <p class="subtitle">Rise to Glory</p>
          </div>

          <div class="menu-options">
            <button class="menu-btn" id="story-btn">
              <span class="btn-icon">📖</span>
              Story Mode
            </button>
            <button class="menu-btn" data-mode="single">
              <span class="btn-icon">⚔️</span>
              Single Combat
            </button>
            <button class="menu-btn" id="tournament-btn">
              <span class="btn-icon">🏆</span>
              Tournament
            </button>
            <button class="menu-btn" id="marketplace-btn">
              <span class="btn-icon">🏪</span>
              Marketplace
            </button>
            <button class="menu-btn" id="wiki-btn">
              <span class="btn-icon">📚</span>
              Game Wiki
            </button>
          </div>
        </div>

        <div class="version">v4.0.0</div>
      </div>
    `;
  }

  attachEventListeners() {
    const buttons = this.shadowRoot.querySelectorAll('.menu-btn[data-mode]');

    buttons.forEach((btn) => {
      btn.addEventListener('click', () => {
        const mode = btn.dataset.mode;
        this.emit('mode-selected', { mode });
      });
    });

    // Tournament button
    const tournamentBtn = this.shadowRoot.querySelector('#tournament-btn');
    if (tournamentBtn) {
      tournamentBtn.addEventListener('click', () => {
        this.emit('tournament-selected');
      });
    }

    // Story button
    const storyBtn = this.shadowRoot.querySelector('#story-btn');
    if (storyBtn) {
      storyBtn.addEventListener('click', () => {
        this.emit('story-selected');
      });
    }

    // Marketplace button
    const marketplaceBtn = this.shadowRoot.querySelector('#marketplace-btn');
    if (marketplaceBtn) {
      marketplaceBtn.addEventListener('click', () => {
        this.emit('marketplace-selected');
      });
    }

    // Wiki button
    const wikiBtn = this.shadowRoot.querySelector('#wiki-btn');
    if (wikiBtn) {
      wikiBtn.addEventListener('click', () => {
        this.emit('wiki-selected');
      });
    }

    // Create floating particles
    this.createParticles();
  }

  createParticles() {
    const container = this.shadowRoot.querySelector('.bg-particles');
    const particleCount = 50;

    for (let i = 0; i < particleCount; i++) {
      const particle = document.createElement('div');
      particle.className = 'particle';
      particle.style.left = `${Math.random() * 100}%`;
      particle.style.animationDelay = `${Math.random() * 20}s`;
      particle.style.animationDuration = `${15 + Math.random() * 10}s`;
      container.appendChild(particle);
    }
  }
}

// Register the component
customElements.define('title-screen', TitleScreen);
