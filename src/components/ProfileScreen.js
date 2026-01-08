import { BaseComponent } from './BaseComponent.js';
import { SaveManager } from '../utils/saveManager.js';
import { LevelingSystem } from '../game/LevelingSystem.js';

/**
 * ProfileScreen Web Component
 * Displays player profile, stats, level, and progress
 * 
 * Events:
 * - back-to-menu: User wants to return to main menu
 */
export class ProfileScreen extends BaseComponent {
  constructor() {
    super();
    this.profileData = SaveManager.load();
  }

  styles() {
    return `
      @import url('./styles/theme.css'); /* Import global theme */

      :host {
        display: block;
        width: 100%;
        height: 100%;
        background: linear-gradient(135deg, #0a0612 0%, #1a0d2e 50%, #0a0612 100%);
        overflow-y: auto;
      }

      .profile-container {
        max-width: 1200px;
        margin: 0 auto;
        padding: 40px 20px;
      }

      .profile-header {
        text-align: center;
        margin-bottom: 40px;
        animation: fadeInDown 0.6s ease;
      }

      .profile-title {
        font-family: 'Orbitron', monospace;
        font-size: 48px;
        font-weight: 700;
        background: linear-gradient(135deg, #ffa726 0%, #ff6f00 100%);
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
        background-clip: text;
        margin: 0 0 10px 0;
        text-transform: uppercase;
        letter-spacing: 4px;
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

      .profile-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
        gap: 30px;
        animation: fadeInUp 0.8s ease;
      }

      .profile-card {
        background: rgba(26, 13, 46, 0.7);
        backdrop-filter: blur(10px);
        border: 1px solid rgba(255, 255, 255, 0.1);
        border-radius: 15px;
        padding: 25px;
        box-shadow: 0 8px 32px rgba(0, 0, 0, 0.5);
        transition: transform 0.3s ease;
      }

      .profile-card:hover {
        transform: translateY(-5px);
        box-shadow: 0 12px 40px rgba(0, 0, 0, 0.6);
      }

      .card-title {
        font-size: 24px;
        font-weight: 700;
        color: #ffa726;
        margin: 0 0 20px 0;
        display: flex;
        align-items: center;
        gap: 10px;
      }

      .card-icon {
        font-size: 32px;
      }

      .level-section {
        text-align: center;
        padding: 20px;
        background: linear-gradient(135deg, rgba(106, 66, 194, 0.3), rgba(255, 167, 38, 0.3));
        border-radius: 12px;
        margin-bottom: 20px;
      }

      .level-number {
        font-size: 64px;
        font-weight: 900;
        color: gold;
        text-shadow: 0 0 20px rgba(255, 215, 0, 0.8);
        line-height: 1;
        margin-bottom: 10px;
      }

      .level-label {
        font-size: 18px;
        color: #b39ddb;
        text-transform: uppercase;
        letter-spacing: 2px;
      }

      .xp-bar-container {
        margin-top: 15px;
      }

      .xp-bar-label {
        display: flex;
        justify-content: space-between;
        font-size: 14px;
        color: #b39ddb;
        margin-bottom: 8px;
      }

      .xp-bar {
        width: 100%;
        height: 30px;
        background: rgba(0, 0, 0, 0.5);
        border-radius: 15px;
        overflow: hidden;
        border: 2px solid rgba(255, 215, 0, 0.3);
      }

      .xp-bar-fill {
        height: 100%;
        background: linear-gradient(90deg, #ffa726, #ffd600);
        border-radius: 15px;
        transition: width 0.5s ease;
        display: flex;
        align-items: center;
        justify-content: center;
        font-weight: bold;
        color: #1a0d2e;
        font-size: 14px;
        box-shadow: 0 0 10px rgba(255, 215, 0, 0.5);
      }

      .stat-row {
        display: flex;
        justify-content: space-between;
        padding: 12px 0;
        border-bottom: 1px solid rgba(255, 255, 255, 0.1);
        color: white;
      }

      .stat-row:last-child {
        border-bottom: none;
      }

      .stat-label {
        font-weight: 600;
        color: #b39ddb;
      }

      .stat-value {
        font-weight: 700;
        color: #ffa726;
      }

      .stat-value.highlight {
        color: #00e676;
      }

      .reset-section {
        margin-top: 30px;
        padding-top: 20px;
        border-top: 1px solid rgba(255, 255, 255, 0.1);
        text-align: center;
      }

      .reset-btn {
        padding: 12px 24px;
        font-size: 14px;
        font-weight: 600;
        color: white;
        background: rgba(255, 23, 68, 0.3);
        border: 2px solid rgba(255, 23, 68, 0.5);
        border-radius: 8px;
        cursor: pointer;
        transition: all 0.3s ease;
      }

      .reset-btn:hover {
        background: rgba(255, 23, 68, 0.5);
        box-shadow: 0 0 15px rgba(255, 23, 68, 0.6);
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
    const { profile, stats } = this.profileData;
    const xpProgress = LevelingSystem.getXPProgress();
    const xpForNext = LevelingSystem.getXPForNextLevel();
    const winRate = stats.totalFightsPlayed > 0
      ? ((stats.totalWins / stats.totalFightsPlayed) * 100).toFixed(1)
      : 0;

    return `
      <div class="profile-container">
        <button class="back-btn">← Back to Menu</button>

        <div class="profile-header">
          <h1 class="profile-title">👤 Player Profile</h1>
        </div>

        <div class="profile-grid">
          <!-- Level & XP Card -->
          <div class="profile-card">
            <h2 class="card-title">
              <span class="card-icon">⬆️</span>
              Level & Experience
            </h2>
            <div class="level-section">
              <div class="level-number">${profile.level}</div>
              <div class="level-label">Level</div>
              <div class="xp-bar-container">
                <div class="xp-bar-label">
                  <span>${profile.xp.toLocaleString()} XP</span>
                  <span>${xpForNext.toLocaleString()} XP to next level</span>
                </div>
                <div class="xp-bar">
                  <div class="xp-bar-fill" style="width: ${xpProgress}%">
                    ${xpProgress.toFixed(0)}%
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Combat Stats Card -->
          <div class="profile-card">
            <h2 class="card-title">
              <span class="card-icon">⚔️</span>
              Combat Statistics
            </h2>
            <div class="stat-row">
              <span class="stat-label">Total Fights</span>
              <span class="stat-value highlight">${stats.totalFightsPlayed}</span>
            </div>
            <div class="stat-row">
              <span class="stat-label">Wins</span>
              <span class="stat-value highlight">${stats.totalWins}</span>
            </div>
            <div class="stat-row">
              <span class="stat-label">Losses</span>
              <span class="stat-value">${stats.totalLosses}</span>
            </div>
            <div class="stat-row">
              <span class="stat-label">Win Rate</span>
              <span class="stat-value highlight">${winRate}%</span>
            </div>
            <div class="stat-row">
              <span class="stat-label">Current Streak</span>
              <span class="stat-value">${stats.winStreak}</span>
            </div>
            <div class="stat-row">
              <span class="stat-label">Best Streak</span>
              <span class="stat-value">${stats.bestStreak}</span>
            </div>
          </div>

          <!-- Damage Stats Card -->
          <div class="profile-card">
            <h2 class="card-title">
              <span class="card-icon">💥</span>
              Battle Performance
            </h2>
            <div class="stat-row">
              <span class="stat-label">Total Damage Dealt</span>
              <span class="stat-value highlight">${stats.totalDamageDealt.toLocaleString()}</span>
            </div>
            <div class="stat-row">
              <span class="stat-label">Total Damage Taken</span>
              <span class="stat-value">${stats.totalDamageTaken.toLocaleString()}</span>
            </div>
            <div class="stat-row">
              <span class="stat-label">Critical Hits</span>
              <span class="stat-value highlight">${stats.criticalHits}</span>
            </div>
            <div class="stat-row">
              <span class="stat-label">Skills Used</span>
              <span class="stat-value">${stats.skillsUsed}</span>
            </div>
            <div class="stat-row">
              <span class="stat-label">Items Used</span>
              <span class="stat-value">${stats.itemsUsed}</span>
            </div>
          </div>

          <!-- Tournament Stats Card -->
          <div class="profile-card">
            <h2 class="card-title">
              <span class="card-icon">🏆</span>
              Tournament Record
            </h2>
            <div class="stat-row">
              <span class="stat-label">Tournaments Played</span>
              <span class="stat-value">${stats.tournamentsPlayed}</span>
            </div>
            <div class="stat-row">
              <span class="stat-label">Tournaments Won</span>
              <span class="stat-value highlight">${stats.tournamentsWon}</span>
            </div>
            <div class="stat-row">
              <span class="stat-label">Win Rate</span>
              <span class="stat-value highlight">
                ${stats.tournamentsPlayed > 0 ? ((stats.tournamentsWon / stats.tournamentsPlayed) * 100).toFixed(1) : 0}%
              </span>
            </div>
            
            <div class="reset-section">
              <button class="reset-btn">🗑️ Reset Progress</button>
            </div>
          </div>
        </div>
      </div>
    `;
  }

  attachEventListeners() {
    const backBtn = this.shadowRoot.querySelector('.back-btn');
    if (backBtn) {
      backBtn.addEventListener('click', () => {
        this.emit('back-to-menu');
      });
    }

    const resetBtn = this.shadowRoot.querySelector('.reset-btn');
    if (resetBtn) {
      resetBtn.addEventListener('click', () => {
        if (confirm('⚠️ Are you sure you want to reset ALL progress? This cannot be undone!')) {
          if (confirm('This will delete your level, XP, stats, and equipment. Are you ABSOLUTELY sure?')) {
            SaveManager.deleteSave();
            alert('✅ Progress reset! Reloading page...');
            window.location.reload();
          }
        }
      });
    }
  }
}

customElements.define('profile-screen', ProfileScreen);
