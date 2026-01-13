import { BaseComponent } from './BaseComponent.js';
import turnIndicatorStyles from '../styles/components/TurnIndicator.scss?inline';

/**
 * TurnIndicator Web Component
 * Shows whose turn it is with animation
 *
 * Attributes:
 * - fighter-name: Name to display
 */
export class TurnIndicator extends BaseComponent {
  static get observedAttributes() {
    return ['fighter-name'];
  }

  attributeChangedCallback(name, oldValue, newValue) {
    if (oldValue !== newValue) {
      this.render();
    }
  }

  styles() {
    return turnIndicatorStyles;
  }

  template() {
    const fighterName = this.getAttribute('fighter-name') || 'Unknown';
    return `<div class="turn-indicator">${fighterName}'s Turn!</div>`;
  }

  connectedCallback() {
    super.connectedCallback();

    // Auto-remove after 1 second
    setTimeout(() => {
      this.remove();
    }, 1000);
  }
}

// Register the component
customElements.define('turn-indicator', TurnIndicator);
