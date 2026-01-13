import { BaseComponent } from './BaseComponent.js';
import comboIndicatorStyles from '../styles/components/ComboIndicator.scss?inline';

/**
 * ComboIndicator Web Component
 * Shows combo counter with animation
 *
 * Attributes:
 * - combo-count: Number to display
 */
export class ComboIndicator extends BaseComponent {
  static get observedAttributes() {
    return ['combo-count'];
  }

  attributeChangedCallback(name, oldValue, newValue) {
    if (oldValue !== newValue) {
      this.render();
    }
  }

  styles() {
    return comboIndicatorStyles;
  }

  template() {
    const comboCount = this.getAttribute('combo-count') || '0';
    return `<div class="combo-indicator">COMBO x${comboCount}!</div>`;
  }

  connectedCallback() {
    super.connectedCallback();

    // Auto-remove after 1.5 seconds
    setTimeout(() => {
      this.remove();
    }, 1500);
  }
}

// Register the component
customElements.define('combo-indicator', ComboIndicator);
