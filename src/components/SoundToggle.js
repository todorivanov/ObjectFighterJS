/**
 * SoundToggle - Sound on/off toggle button
 */

import { BaseComponent } from './BaseComponent.js';
import { soundManager } from '../utils/soundManager.js';
import styles from '../styles/components/SoundToggle.scss?inline';

export class SoundToggle extends BaseComponent {
  constructor() {
    super();
    this.soundEnabled = localStorage.getItem('soundEnabled') !== 'false';
  }

  connectedCallback() {
    this.render();
    this.attachEventListeners();
  }

  attachEventListeners() {
    const button = this.shadowRoot.querySelector('#sound-toggle-btn');
    button.addEventListener('click', () => this.toggleSound());
  }

  toggleSound() {
    this.soundEnabled = soundManager.toggle();

    // Update button icon
    const button = this.shadowRoot.querySelector('#sound-toggle-btn');
    button.textContent = this.soundEnabled ? '🔊' : '🔇';
    button.title = `Turn Sound ${this.soundEnabled ? 'Off' : 'On'}`;
  }

  styles() {
    return styles;
  }

  render() {
    this.shadowRoot.innerHTML = `
      <button 
        id="sound-toggle-btn" 
        class="sound-toggle-btn"
        title="Turn Sound ${this.soundEnabled ? 'Off' : 'On'}"
      >
        ${this.soundEnabled ? '🔊' : '🔇'}
      </button>
    `;
  }
}

customElements.define('sound-toggle', SoundToggle);
