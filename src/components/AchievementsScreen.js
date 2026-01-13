import { BaseComponent } from './BaseComponent.js';
import { AchievementManager } from '../game/AchievementManager.js';
import {
  ACHIEVEMENTS,
  ACHIEVEMENT_CATEGORIES,
  getAchievementsByCategory,
} from '../data/achievements.js';
import styles from '../styles/components/AchievementsScreen.scss?inline';

/**
 * AchievementsScreen Web Component
 * Displays all achievements with progress tracking
 *
 * Events:
 * - back-to-menu: User wants to return to main menu
 */
export class AchievementsScreen extends BaseComponent {
  constructor() {
    super();
    this.selectedCategory = 'all';
  }

  styles() {
    return styles;
  }

  template() {
    const stats = AchievementManager.getStatistics();

    // Filter achievements by category
    let filteredAchievements = ACHIEVEMENTS;
    if (this.selectedCategory !== 'all') {
      filteredAchievements = getAchievementsByCategory(this.selectedCategory);
    }

    return `
      <div class="achievements-container">
        <button class="back-btn">← Back to Menu</button>

        <div class="achievements-header">
          <h1 class="achievements-title">🏅 Achievements 🏅</h1>
          <p class="achievements-subtitle">Track your progress and unlock rewards!</p>
        </div>

        <!-- Progress Summary -->
        <div class="progress-summary">
          <div class="progress-percentage">${stats.percentage}%</div>
          <div class="progress-text">
            <strong>${stats.unlocked} of ${stats.total}</strong> achievements unlocked
          </div>
          <div class="progress-bar-container">
            <div class="progress-bar-fill" style="width: ${stats.percentage}%">
              ${stats.unlocked}/${stats.total}
            </div>
          </div>
        </div>

        <!-- Category Filters -->
        <div class="category-filters">
          <button class="category-btn ${this.selectedCategory === 'all' ? 'active' : ''}" data-category="all">
            All (${ACHIEVEMENTS.length})
          </button>
          <button class="category-btn ${this.selectedCategory === ACHIEVEMENT_CATEGORIES.COMBAT ? 'active' : ''}" data-category="${ACHIEVEMENT_CATEGORIES.COMBAT}">
            ⚔️ Combat (${getAchievementsByCategory(ACHIEVEMENT_CATEGORIES.COMBAT).length})
          </button>
          <button class="category-btn ${this.selectedCategory === ACHIEVEMENT_CATEGORIES.STRATEGIC ? 'active' : ''}" data-category="${ACHIEVEMENT_CATEGORIES.STRATEGIC}">
            🎯 Strategic (${getAchievementsByCategory(ACHIEVEMENT_CATEGORIES.STRATEGIC).length})
          </button>
          <button class="category-btn ${this.selectedCategory === ACHIEVEMENT_CATEGORIES.SPECIAL ? 'active' : ''}" data-category="${ACHIEVEMENT_CATEGORIES.SPECIAL}">
            ⭐ Special (${getAchievementsByCategory(ACHIEVEMENT_CATEGORIES.SPECIAL).length})
          </button>
          <button class="category-btn ${this.selectedCategory === ACHIEVEMENT_CATEGORIES.PROGRESSION ? 'active' : ''}" data-category="${ACHIEVEMENT_CATEGORIES.PROGRESSION}">
            📈 Progression (${getAchievementsByCategory(ACHIEVEMENT_CATEGORIES.PROGRESSION).length})
          </button>
        </div>

        <!-- Achievements Grid -->
        <div class="achievements-grid">
          ${filteredAchievements.map((achievement) => this.renderAchievementCard(achievement)).join('')}
        </div>
      </div>
    `;
  }

  renderAchievementCard(achievement) {
    const isUnlocked = AchievementManager.isUnlocked(achievement.id);
    const progress = AchievementManager.getAchievementProgress(achievement.id);

    return `
      <div class="achievement-card ${isUnlocked ? 'unlocked' : 'locked'}">
        ${isUnlocked ? '<div class="unlocked-badge">✓ Unlocked</div>' : '<div class="locked-icon">🔒</div>'}
        
        <div class="achievement-icon ${isUnlocked ? '' : 'locked'}">
          ${achievement.icon}
        </div>
        
        <div class="achievement-name">${achievement.name}</div>
        <div class="achievement-description">${achievement.description}</div>
        <div class="achievement-reward">🎁 Reward: ${achievement.reward.xp} XP</div>

        ${
          !isUnlocked && progress && progress.target > 1
            ? `
          <div class="achievement-progress">
            <div class="progress-label">
              <span>Progress</span>
              <span>${progress.current}/${progress.target}</span>
            </div>
            <div class="progress-bar-small">
              <div class="progress-bar-small-fill" style="width: ${progress.percentage}%">
                ${progress.percentage}%
              </div>
            </div>
          </div>
        `
            : ''
        }
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

    // Category buttons
    const categoryBtns = this.shadowRoot.querySelectorAll('.category-btn');
    categoryBtns.forEach((btn) => {
      btn.addEventListener('click', () => {
        this.selectedCategory = btn.dataset.category;
        this.render();
      });
    });
  }
}

customElements.define('achievements-screen', AchievementsScreen);
