import { BaseComponent } from './BaseComponent.js';
import settingsStyles from '../styles/components/SettingsScreen.scss?inline';
import { DifficultyManager, DIFFICULTY_CONFIG } from '../game/DifficultyManager.js';
import { router } from '../utils/Router.js';
import { RoutePaths } from '../config/routes.js';
import { gameStore } from '../store/gameStore.js';
import { togglePerformanceMonitor } from '../store/actions.js';

/**
 * SettingsScreen Web Component
 * Displays game settings including difficulty selection
 *
 * Events:
 * - back-to-menu: User wants to return to main menu
 */
export class SettingsScreen extends BaseComponent {
  constructor() {
    super();
  }

  styles() {
    return settingsStyles;
  }

  template() {
    const currentDifficulty = DifficultyManager.getCurrentDifficulty();
    const difficulties = DifficultyManager.getAllDifficultiesInfo();
    const state = gameStore.getState();
    const showPerformanceMonitor = state.settings.showPerformanceMonitor;

    return `
      <div class="settings-container">
        <button class="back-btn">← Back to Menu</button>

        <div class="settings-header">
          <h1 class="settings-title">⚙️ Settings</h1>
        </div>

        <!-- Current Settings -->
        <div class="current-settings">
          <div class="current-settings-title">📊 Current Configuration</div>
          <div class="current-setting">
            <span class="setting-label">Difficulty</span>
            <span class="setting-value">${DifficultyManager.formatDifficultyDisplay()}</span>
          </div>
          <div class="current-setting">
            <span class="setting-label">XP Multiplier</span>
            <span class="setting-value">${(DifficultyManager.getXPMultiplier() * 100).toFixed(0)}%</span>
          </div>
          <div class="current-setting">
            <span class="setting-label">Equipment Drop Rate</span>
            <span class="setting-value">${(DifficultyManager.getEquipmentDropRate() * 100).toFixed(0)}%</span>
          </div>
          <button class="save-management-btn">
            💾 Manage Save Files
          </button>
        </div>

        <!-- Toggle Settings -->
        <div class="toggle-settings">
          <div class="toggle-option">
            <div class="toggle-info">
              <div class="toggle-title">⚡ Performance Monitor</div>
              <div class="toggle-desc">Show FPS, frame time, and memory usage</div>
            </div>
            <div class="toggle-switch ${showPerformanceMonitor ? 'active' : ''}" data-toggle="performance-monitor"></div>
          </div>
        </div>

        <!-- Difficulty Selection -->
        <div class="settings-section">
          <div class="section-title">
            <span>🎮</span>
            Difficulty Level
          </div>
          <div class="section-description">
            Choose your challenge level. Higher difficulties provide better rewards but tougher enemies.
            <strong>Changes take effect in the next battle.</strong>
          </div>

          <div class="difficulty-grid">
            ${difficulties.map((diff) => this.renderDifficultyCard(diff, currentDifficulty)).join('')}
          </div>
        </div>
      </div>
    `;
  }

  renderDifficultyCard(difficulty, currentDifficulty) {
    const isSelected = difficulty.id === currentDifficulty;

    return `
      <div 
        class="difficulty-card ${difficulty.id} ${isSelected ? 'selected' : ''}" 
        data-difficulty="${difficulty.id}"
        style="border-color: ${difficulty.color};"
      >
        <div class="difficulty-icon">${difficulty.icon}</div>
        <div class="difficulty-name">${difficulty.name}</div>
        <div class="difficulty-description">${difficulty.description}</div>
        <ul class="difficulty-tips">
          ${difficulty.tips
            .map(
              (tip) => `
            <li class="difficulty-tip" style="color: ${difficulty.color};">${tip}</li>
          `
            )
            .join('')}
        </ul>
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

    // Save management button
    const saveManagementBtn = this.shadowRoot.querySelector('.save-management-btn');
    if (saveManagementBtn) {
      saveManagementBtn.addEventListener('click', () => {
        router.navigate(RoutePaths.SAVE_MANAGEMENT);
      });
    }

    // Performance monitor toggle
    const perfMonitorToggle = this.shadowRoot.querySelector('[data-toggle="performance-monitor"]');
    if (perfMonitorToggle) {
      perfMonitorToggle.addEventListener('click', () => {
        gameStore.dispatch(togglePerformanceMonitor());
        this.render();

        // Update the UI immediately
        const state = gameStore.getState();
        const perfMonitor = document.querySelector('performance-monitor-ui');
        if (state.settings.showPerformanceMonitor) {
          if (!perfMonitor) {
            const newPerfMonitor = document.createElement('performance-monitor-ui');
            document.body.appendChild(newPerfMonitor);
          }
        } else {
          if (perfMonitor) {
            perfMonitor.remove();
          }
        }
      });
    }

    // Difficulty cards
    const difficultyCards = this.shadowRoot.querySelectorAll('.difficulty-card');
    difficultyCards.forEach((card) => {
      card.addEventListener('click', () => {
        const difficulty = card.dataset.difficulty;
        if (DifficultyManager.setDifficulty(difficulty)) {
          this.render();

          // Show confirmation
          const config = DIFFICULTY_CONFIG[difficulty];
          alert(
            `✅ Difficulty set to ${config.icon} ${config.name}\n\nChanges will take effect in your next battle!`
          );
        }
      });
    });
  }
}

customElements.define('settings-screen', SettingsScreen);
