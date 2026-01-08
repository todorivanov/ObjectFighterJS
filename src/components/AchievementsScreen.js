import { BaseComponent } from './BaseComponent.js';
import { AchievementManager } from '../game/AchievementManager.js';
import {
  ACHIEVEMENTS,
  ACHIEVEMENT_CATEGORIES,
  getAchievementsByCategory,
} from '../data/achievements.js';

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
    return `
      :host {
        display: block;
        width: 100%;
        height: 100%;
        background: linear-gradient(135deg, #0a0612 0%, #1a0d2e 50%, #0a0612 100%);
        overflow-y: auto;
      }

      .achievements-container {
        max-width: 1400px;
        margin: 0 auto;
        padding: 40px 20px;
        min-height: 100vh;
      }

      .achievements-header {
        text-align: center;
        margin-bottom: 40px;
        animation: fadeInDown 0.6s ease;
      }

      .achievements-title {
        font-family: 'Orbitron', monospace;
        font-size: 48px;
        font-weight: 700;
        background: linear-gradient(135deg, #ffd700 0%, #ff8c00 100%);
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
        background-clip: text;
        margin: 0 0 10px 0;
        text-transform: uppercase;
        letter-spacing: 4px;
      }

      .achievements-subtitle {
        font-size: 18px;
        color: #b39ddb;
        margin-top: 10px;
      }

      .back-btn {
        position: fixed;
        top: 30px;
        left: 30px;
        padding: 12px 24px;
        font-size: 16px;
        font-weight: 600;
        color: white;
        background: rgba(42, 26, 71, 0.7);
        border: 2px solid rgba(255, 255, 255, 0.2);
        border-radius: 8px;
        cursor: pointer;
        transition: all 0.3s ease;
        backdrop-filter: blur(10px);
        z-index: 100;
      }

      .back-btn:hover {
        background: rgba(255, 23, 68, 0.7);
        border-color: #ff1744;
        box-shadow: 0 0 20px rgba(255, 23, 68, 0.5);
      }

      .progress-summary {
        background: linear-gradient(135deg, rgba(255, 215, 0, 0.2), rgba(255, 152, 0, 0.2));
        border: 2px solid gold;
        border-radius: 15px;
        padding: 30px;
        margin-bottom: 40px;
        text-align: center;
        animation: fadeIn 0.8s ease;
      }

      .progress-percentage {
        font-size: 64px;
        font-weight: bold;
        background: linear-gradient(135deg, #ffd700 0%, #ff8c00 100%);
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
        background-clip: text;
        margin-bottom: 10px;
      }

      .progress-text {
        font-size: 18px;
        color: white;
        margin-bottom: 20px;
      }

      .progress-bar-container {
        width: 100%;
        height: 30px;
        background: rgba(0, 0, 0, 0.4);
        border-radius: 15px;
        overflow: hidden;
        border: 2px solid rgba(255, 215, 0, 0.3);
      }

      .progress-bar-fill {
        height: 100%;
        background: linear-gradient(90deg, #ffd700, #ff8c00);
        transition: width 0.5s ease;
        display: flex;
        align-items: center;
        justify-content: center;
        font-weight: bold;
        color: white;
        text-shadow: 0 2px 4px rgba(0, 0, 0, 0.5);
      }

      .category-filters {
        display: flex;
        justify-content: center;
        gap: 15px;
        margin-bottom: 30px;
        flex-wrap: wrap;
      }

      .category-btn {
        padding: 12px 24px;
        background: rgba(0, 0, 0, 0.5);
        border: 2px solid rgba(255, 255, 255, 0.1);
        border-radius: 8px;
        color: white;
        font-weight: 600;
        cursor: pointer;
        transition: all 0.3s ease;
        text-transform: capitalize;
      }

      .category-btn:hover {
        border-color: #ffa726;
        transform: translateY(-2px);
      }

      .category-btn.active {
        background: rgba(255, 167, 38, 0.3);
        border-color: #ffa726;
        box-shadow: 0 0 20px rgba(255, 167, 38, 0.3);
      }

      .achievements-grid {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
        gap: 20px;
        animation: fadeInUp 1s ease;
      }

      .achievement-card {
        background: rgba(26, 13, 46, 0.7);
        backdrop-filter: blur(10px);
        border: 2px solid rgba(255, 255, 255, 0.1);
        border-radius: 15px;
        padding: 25px;
        transition: all 0.3s ease;
        position: relative;
        overflow: hidden;
      }

      .achievement-card:hover {
        transform: translateY(-5px);
        box-shadow: 0 8px 32px rgba(0, 0, 0, 0.5);
      }

      .achievement-card.unlocked {
        border-color: gold;
        background: linear-gradient(135deg, rgba(255, 215, 0, 0.1), rgba(255, 152, 0, 0.1));
        box-shadow: 0 0 20px rgba(255, 215, 0, 0.3);
      }

      .achievement-card.locked {
        opacity: 0.6;
      }

      .achievement-icon {
        font-size: 64px;
        text-align: center;
        margin-bottom: 15px;
      }

      .achievement-icon.locked {
        filter: grayscale(100%);
        opacity: 0.5;
      }

      .achievement-name {
        font-size: 20px;
        font-weight: 700;
        color: white;
        text-align: center;
        margin-bottom: 10px;
      }

      .achievement-description {
        font-size: 14px;
        color: #b39ddb;
        text-align: center;
        margin-bottom: 15px;
        line-height: 1.4;
      }

      .achievement-reward {
        text-align: center;
        font-size: 14px;
        color: #ffa726;
        font-weight: 600;
        margin-bottom: 15px;
      }

      .achievement-progress {
        margin-top: 15px;
      }

      .progress-label {
        display: flex;
        justify-content: space-between;
        font-size: 12px;
        color: #b39ddb;
        margin-bottom: 8px;
      }

      .progress-bar-small {
        width: 100%;
        height: 20px;
        background: rgba(0, 0, 0, 0.4);
        border-radius: 10px;
        overflow: hidden;
        border: 1px solid rgba(255, 255, 255, 0.1);
      }

      .progress-bar-small-fill {
        height: 100%;
        background: linear-gradient(90deg, #3b82f6, #2563eb);
        transition: width 0.3s ease;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 11px;
        font-weight: bold;
        color: white;
        text-shadow: 0 1px 2px rgba(0, 0, 0, 0.5);
      }

      .unlocked-badge {
        position: absolute;
        top: 15px;
        right: 15px;
        background: gold;
        color: #000;
        padding: 5px 12px;
        border-radius: 20px;
        font-size: 12px;
        font-weight: bold;
        text-transform: uppercase;
        box-shadow: 0 2px 8px rgba(255, 215, 0, 0.5);
      }

      .locked-icon {
        position: absolute;
        top: 15px;
        right: 15px;
        font-size: 24px;
        opacity: 0.5;
      }

      @keyframes fadeIn {
        from { opacity: 0; }
        to { opacity: 1; }
      }

      @keyframes fadeInUp {
        from {
          opacity: 0;
          transform: translateY(20px);
        }
        to {
          opacity: 1;
          transform: translateY(0);
        }
      }

      @keyframes fadeInDown {
        from {
          opacity: 0;
          transform: translateY(-20px);
        }
        to {
          opacity: 1;
          transform: translateY(0);
        }
      }
    `;
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
