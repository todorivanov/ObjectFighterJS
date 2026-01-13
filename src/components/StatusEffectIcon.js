import { BaseComponent } from './BaseComponent.js';
import statusEffectStyles from '../styles/components/StatusEffectIcon.scss?inline';

/**
 * StatusEffectIcon Web Component
 * Displays a status effect icon with tooltip
 *
 * Attributes:
 * - effect-name: Name of the effect
 * - effect-icon: Emoji icon
 * - effect-type: 'buff' or 'debuff'
 * - effect-duration: Turns remaining
 */
export class StatusEffectIcon extends BaseComponent {
  static get observedAttributes() {
    return ['effect-name', 'effect-icon', 'effect-type', 'effect-duration'];
  }

  attributeChangedCallback(name, oldValue, newValue) {
    if (oldValue !== newValue) {
      this.render();
    }
  }

  styles() {
    return statusEffectStyles;
  }

  template() {
    const name = this.getAttribute('effect-name') || 'Unknown';
    const icon = this.getAttribute('effect-icon') || '❓';
    const type = this.getAttribute('effect-type') || 'buff';
    const duration = this.getAttribute('effect-duration') || '0';

    const tooltip = `${name} (${duration} turns)`;

    return `
      <span 
        class="status-effect ${type}" 
        data-tooltip="${tooltip}"
      >
        ${icon}
      </span>
    `;
  }
}

// Register the component
customElements.define('status-effect-icon', StatusEffectIcon);
