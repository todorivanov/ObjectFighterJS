import { BaseComponent } from './BaseComponent.js';
import campaignStyles from '../styles/components/CampaignMap.scss?inline';
import {
  STORY_REGIONS,
  getRegionsInOrder,
  isRegionUnlocked,
  getRegionCompletion,
} from '../data/storyRegions.js';
import { getMissionsByRegion, getMissionById } from '../data/storyMissions.js';
import { StoryMode } from '../game/StoryMode.js';
import { gameStore } from '../store/gameStore.js';

/**
 * CampaignMap Web Component
 * Displays story regions and missions with progression
 *
 * Events:
 * - mission-selected: { missionId } - User selected a mission
 * - close: User wants to exit campaign map
 */
export class CampaignMap extends BaseComponent {
  constructor() {
    super();
    this.selectedRegion = null;
  }

  styles() {
    return campaignStyles;
  }

  template() {
    const state = gameStore.getState();
    const storyProgress = state.story;
    const regions = getRegionsInOrder();
    const completedMissions = Object.keys(storyProgress.completedMissions || {}).length;
    const totalStars = StoryMode.getTotalStars();

    return `
      <div class="overlay"></div>
      <div class="campaign-container">
        <div class="header">
          <div>
            <h1 class="title">📖 Campaign</h1>
            <div class="progress-info">
              Missions: ${completedMissions}/25 | Stars: ${totalStars.earned}/${totalStars.total}
            </div>
          </div>
          <button class="close-btn" id="close-btn">✕ Close</button>
        </div>

        <div class="content">
          <div class="regions-list">
            ${regions.map((regionId) => this.renderRegion(regionId, storyProgress)).join('')}
          </div>

          <div class="missions-area" id="missions-area">
            ${this.selectedRegion ? this.renderMissions(this.selectedRegion, storyProgress) : this.renderWelcome()}
          </div>
        </div>
      </div>
    `;
  }

  renderRegion(regionId, storyProgress) {
    const region = STORY_REGIONS[regionId];
    const unlocked = isRegionUnlocked(regionId, storyProgress);
    const completion = getRegionCompletion(regionId, storyProgress);
    const isActive = this.selectedRegion === regionId;

    return `
      <div 
        class="region-card ${isActive ? 'active' : ''} ${!unlocked ? 'locked' : ''}" 
        data-region="${regionId}"
        ${!unlocked ? 'style="pointer-events: none;"' : ''}
      >
        <div class="region-icon">${region.icon}${!unlocked ? '🔒' : ''}</div>
        <div class="region-name">${region.name}</div>
        <div class="region-completion">${completion}% Complete</div>
      </div>
    `;
  }

  renderMissions(regionId, storyProgress) {
    const missions = getMissionsByRegion(regionId);

    if (missions.length === 0) {
      return `
        <div class="empty-state">
          <div style="font-size: 48px; margin-bottom: 20px;">✅</div>
          <div style="font-size: 20px;">Region Complete!</div>
        </div>
      `;
    }

    return `
      <div class="missions-grid">
        ${missions.map((missionId) => this.renderMission(missionId, storyProgress)).join('')}
      </div>
    `;
  }

  renderMission(missionId, _storyProgress) {
    const mission = getMissionById(missionId);
    const completed = StoryMode.isMissionCompleted(missionId);
    const stars = StoryMode.getMissionStars(missionId);

    let difficultyClass = 'easy';
    if (mission.difficulty > 7) difficultyClass = 'hard';
    else if (mission.difficulty > 11) difficultyClass = 'extreme';
    else if (mission.difficulty > 3) difficultyClass = 'normal';

    const typeIcons = { standard: '⚔️', survival: '🛡️', boss: '👑' };

    return `
      <div class="mission-card ${completed ? 'completed' : ''}" data-mission="${missionId}">
        <div class="mission-header">
          <div class="mission-type">${typeIcons[mission.type]}</div>
          <div class="mission-stars">
            ${completed ? '⭐'.repeat(stars) + '☆'.repeat(3 - stars) : '☆☆☆'}
          </div>
        </div>
        <div class="mission-name">${mission.name}</div>
        <div class="mission-description">${mission.description}</div>
        <div class="mission-difficulty difficulty-${difficultyClass}">
          Difficulty: ${mission.difficulty}
        </div>
        <div class="mission-rewards">
          💰 ${mission.rewards.gold} Gold | ✨ ${mission.rewards.xp} XP
        </div>
      </div>
    `;
  }

  renderWelcome() {
    return `
      <div class="empty-state">
        <div style="font-size: 64px; margin-bottom: 20px;">🗺️</div>
        <div style="font-size: 24px; margin-bottom: 10px;">Welcome to the Campaign</div>
        <div style="font-size: 16px;">Select a region to view missions</div>
      </div>
    `;
  }

  attachEventListeners() {
    // Close button
    this.shadowRoot.querySelector('#close-btn').addEventListener('click', () => {
      this.emit('close');
    });

    // Region selection
    this.shadowRoot.querySelectorAll('.region-card').forEach((card) => {
      card.addEventListener('click', () => {
        const regionId = card.dataset.region;
        this.selectedRegion = regionId;
        this.render();
      });
    });

    // Mission selection
    this.shadowRoot.querySelectorAll('.mission-card').forEach((card) => {
      card.addEventListener('click', () => {
        const missionId = card.dataset.mission;
        this.emit('mission-selected', { missionId });
      });
    });

    // Close on overlay
    this.shadowRoot.querySelector('.overlay').addEventListener('click', () => {
      this.emit('close');
    });
  }
}

customElements.define('campaign-map', CampaignMap);
