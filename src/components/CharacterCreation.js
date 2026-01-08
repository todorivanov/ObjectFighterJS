import { BaseComponent } from './BaseComponent.js';
import { SaveManager } from '../utils/saveManager.js';

/**
 * CharacterCreation Web Component
 * Character creation screen for first-time players
 * 
 * Events:
 * - character-created: { name, class, appearance }
 */
export class CharacterCreation extends BaseComponent {
  constructor() {
    super();
    this.selectedClass = 'BALANCED';
    this.selectedAppearance = 'avatar1';
    this.characterName = '';
  }

  styles() {
    return `
      @import url('./styles/theme.css');

      :host {
        display: block;
        width: 100%;
        height: 100%;
        background: linear-gradient(135deg, #0a0612 0%, #1a0d2e 50%, #0a0612 100%);
        overflow-y: auto;
      }

      .creation-container {
        max-width: 900px;
        margin: 0 auto;
        padding: 40px 20px;
        min-height: 100vh;
        display: flex;
        flex-direction: column;
        justify-content: center;
      }

      .creation-header {
        text-align: center;
        margin-bottom: 40px;
        animation: fadeInDown 0.6s ease;
      }

      .creation-title {
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

      .creation-subtitle {
        font-size: 18px;
        color: #b39ddb;
        letter-spacing: 2px;
      }

      .creation-form {
        background: rgba(26, 13, 46, 0.7);
        backdrop-filter: blur(10px);
        border: 1px solid rgba(255, 255, 255, 0.1);
        border-radius: 15px;
        padding: 40px;
        box-shadow: 0 8px 32px rgba(0, 0, 0, 0.5);
        animation: fadeInUp 0.8s ease;
      }

      .form-section {
        margin-bottom: 40px;
      }

      .form-section:last-child {
        margin-bottom: 0;
      }

      .section-label {
        font-size: 20px;
        font-weight: 700;
        color: #ffa726;
        margin-bottom: 20px;
        display: flex;
        align-items: center;
        gap: 10px;
      }

      .section-icon {
        font-size: 28px;
      }

      .name-input {
        width: 100%;
        padding: 15px 20px;
        font-size: 18px;
        font-family: 'Orbitron', monospace;
        background: rgba(0, 0, 0, 0.5);
        border: 2px solid rgba(255, 167, 38, 0.3);
        border-radius: 10px;
        color: white;
        outline: none;
        transition: all 0.3s ease;
      }

      .name-input:focus {
        border-color: #ffa726;
        box-shadow: 0 0 20px rgba(255, 167, 38, 0.3);
      }

      .name-input::placeholder {
        color: #7e57c2;
      }

      .class-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
        gap: 15px;
      }

      .class-option {
        background: rgba(0, 0, 0, 0.5);
        border: 2px solid rgba(255, 255, 255, 0.1);
        border-radius: 12px;
        padding: 20px;
        cursor: pointer;
        transition: all 0.3s ease;
        text-align: center;
      }

      .class-option:hover {
        border-color: #ffa726;
        transform: translateY(-5px);
        box-shadow: 0 5px 20px rgba(255, 167, 38, 0.3);
      }

      .class-option.selected {
        border-color: #00e676;
        background: rgba(0, 230, 118, 0.1);
        box-shadow: 0 0 25px rgba(0, 230, 118, 0.4);
      }

      .class-icon {
        font-size: 48px;
        margin-bottom: 10px;
      }

      .class-name {
        font-size: 16px;
        font-weight: 700;
        color: white;
        margin-bottom: 8px;
      }

      .class-stats {
        font-size: 12px;
        color: #b39ddb;
      }

      .appearance-grid {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(100px, 1fr));
        gap: 15px;
      }

      .appearance-option {
        aspect-ratio: 1;
        background: rgba(0, 0, 0, 0.5);
        border: 3px solid rgba(255, 255, 255, 0.1);
        border-radius: 50%;
        overflow: hidden;
        cursor: pointer;
        transition: all 0.3s ease;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 48px;
      }

      .appearance-option:hover {
        border-color: #ffa726;
        transform: scale(1.1);
      }

      .appearance-option.selected {
        border-color: #00e676;
        box-shadow: 0 0 25px rgba(0, 230, 118, 0.4);
      }

      .create-btn {
        width: 100%;
        padding: 20px;
        font-size: 24px;
        font-weight: 700;
        text-transform: uppercase;
        color: white;
        background: linear-gradient(135deg, #00e676 0%, #00c853 100%);
        border: none;
        border-radius: 12px;
        cursor: pointer;
        transition: all 0.3s ease;
        box-shadow: 0 4px 15px rgba(0, 230, 118, 0.4);
        letter-spacing: 2px;
      }

      .create-btn:hover {
        transform: translateY(-3px);
        box-shadow: 0 6px 20px rgba(0, 230, 118, 0.6);
      }

      .create-btn:disabled {
        opacity: 0.5;
        cursor: not-allowed;
        transform: none;
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
    const classes = [
      { id: 'BALANCED', icon: '⚖️', name: 'Balanced', hp: 400, str: 10 },
      { id: 'WARRIOR', icon: '⚔️', name: 'Warrior', hp: 350, str: 13 },
      { id: 'TANK', icon: '🛡️', name: 'Tank', hp: 600, str: 4 },
      { id: 'GLASS_CANNON', icon: '💥', name: 'Glass Cannon', hp: 300, str: 20 },
      { id: 'BRUISER', icon: '👊', name: 'Bruiser', hp: 500, str: 6 },
    ];

    const appearances = ['🧙', '🧑‍🚀', '🧝', '🧛', '🥷', '🤠', '🧙‍♀️', '🦸', '🦹'];

    return `
      <div class="creation-container">
        <div class="creation-header">
          <h1 class="creation-title">⚔️ Create Your Hero ⚔️</h1>
          <p class="creation-subtitle">Forge your legend</p>
        </div>

        <div class="creation-form">
          <!-- Name Section -->
          <div class="form-section">
            <div class="section-label">
              <span class="section-icon">📝</span>
              Character Name
            </div>
            <input 
              type="text" 
              class="name-input" 
              id="name-input"
              placeholder="Enter your hero's name..."
              maxlength="20"
            />
          </div>

          <!-- Class Selection -->
          <div class="form-section">
            <div class="section-label">
              <span class="section-icon">🎭</span>
              Choose Your Class
            </div>
            <div class="class-grid">
              ${classes.map(cls => `
                <div class="class-option ${this.selectedClass === cls.id ? 'selected' : ''}" data-class="${cls.id}">
                  <div class="class-icon">${cls.icon}</div>
                  <div class="class-name">${cls.name}</div>
                  <div class="class-stats">HP: ${cls.hp} | STR: ${cls.str}</div>
                </div>
              `).join('')}
            </div>
          </div>

          <!-- Appearance Selection -->
          <div class="form-section">
            <div class="section-label">
              <span class="section-icon">👤</span>
              Choose Your Avatar
            </div>
            <div class="appearance-grid">
              ${appearances.map((emoji, idx) => `
                <div class="appearance-option ${this.selectedAppearance === `avatar${idx}` ? 'selected' : ''}" data-appearance="avatar${idx}">
                  ${emoji}
                </div>
              `).join('')}
            </div>
          </div>

          <!-- Create Button -->
          <div class="form-section">
            <button class="create-btn" id="create-btn">
              ⚔️ Begin Your Journey ⚔️
            </button>
          </div>
        </div>
      </div>
    `;
  }

  attachEventListeners() {
    const nameInput = this.shadowRoot.getElementById('name-input');
    const createBtn = this.shadowRoot.getElementById('create-btn');
    const classOptions = this.shadowRoot.querySelectorAll('.class-option');
    const appearanceOptions = this.shadowRoot.querySelectorAll('.appearance-option');

    // Name input
    nameInput.addEventListener('input', (e) => {
      this.characterName = e.target.value.trim();
      this.updateCreateButton();
    });

    // Class selection - update without full re-render
    classOptions.forEach(option => {
      option.addEventListener('click', () => {
        // Remove selected class from all options
        classOptions.forEach(opt => opt.classList.remove('selected'));
        // Add selected class to clicked option
        option.classList.add('selected');
        // Update selected class
        this.selectedClass = option.dataset.class;
      });
    });

    // Appearance selection - update without full re-render
    appearanceOptions.forEach(option => {
      option.addEventListener('click', () => {
        // Remove selected class from all options
        appearanceOptions.forEach(opt => opt.classList.remove('selected'));
        // Add selected class to clicked option
        option.classList.add('selected');
        // Update selected appearance
        this.selectedAppearance = option.dataset.appearance;
      });
    });

    // Create button
    createBtn.addEventListener('click', () => {
      if (this.characterName.length >= 2) {
        this.createCharacter();
      }
    });

    // Enter key to create
    nameInput.addEventListener('keypress', (e) => {
      if (e.key === 'Enter' && this.characterName.length >= 2) {
        this.createCharacter();
      }
    });
  }

  updateCreateButton() {
    const createBtn = this.shadowRoot.getElementById('create-btn');
    if (createBtn) {
      createBtn.disabled = this.characterName.length < 2;
    }
  }

  createCharacter() {
    const classStats = {
      'BALANCED': { health: 400, strength: 10 },
      'WARRIOR': { health: 350, strength: 13 },
      'TANK': { health: 600, strength: 4 },
      'GLASS_CANNON': { health: 300, strength: 20 },
      'BRUISER': { health: 500, strength: 6 },
    };

    const stats = classStats[this.selectedClass];
    
    const characterData = {
      name: this.characterName,
      class: this.selectedClass,
      appearance: this.selectedAppearance,
      health: stats.health,
      strength: stats.strength,
      image: `https://api.dicebear.com/7.x/avataaars/svg?seed=${this.characterName.toLowerCase()}&backgroundColor=b6e3f4`,
      description: `A ${this.selectedClass.toLowerCase()} hero forged in the fires of battle.`,
    };

    // Save to profile
    SaveManager.update('profile.name', this.characterName);
    SaveManager.update('profile.character', characterData);
    SaveManager.update('profile.characterCreated', true);

    console.log('✅ Character created:', characterData);

    // Emit event
    this.emit('character-created', characterData);
  }
}

customElements.define('character-creation', CharacterCreation);
