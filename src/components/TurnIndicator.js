import { BaseComponent } from './BaseComponent.js';

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
    return `
      :host {
        position: fixed;
        top: 30%;
        left: 50%;
        transform: translate(-50%, -50%);
        z-index: 10000;
        pointer-events: none;
      }

      .turn-indicator {
        background: linear-gradient(135deg, rgba(106, 66, 194, 0.95), rgba(255, 167, 38, 0.95));
        color: white;
        padding: 20px 50px;
        border-radius: 16px;
        font-size: 28px;
        font-weight: bold;
        text-align: center;
        box-shadow: 0 10px 40px rgba(0, 0, 0, 0.7);
        animation: turnIndicatorPulse 0.6s ease;
        border: 2px solid rgba(255, 255, 255, 0.3);
        backdrop-filter: blur(10px);
      }

      @keyframes turnIndicatorPulse {
        0% {
          transform: scale(0);
          opacity: 0;
        }
        50% {
          transform: scale(1.1);
        }
        100% {
          transform: scale(1);
          opacity: 1;
        }
      }
    `;
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
