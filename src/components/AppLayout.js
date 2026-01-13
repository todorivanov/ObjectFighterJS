/**
 * AppLayout - Main application layout with navigation
 */

import { BaseComponent } from './BaseComponent.js';
import './NavigationBar.js';
import './SoundToggle.js';
import styles from '../styles/components/AppLayout.scss?inline';

export class AppLayout extends BaseComponent {
  connectedCallback() {
    this.render();
  }

  render() {
    this.shadowRoot.innerHTML = `
      <style>${styles}</style>
      <div class="layout-container">
        <div class="nav-overlay">
          <navigation-bar></navigation-bar>
          <sound-toggle></sound-toggle>
        </div>
        <div class="content-area">
          <slot></slot>
        </div>
      </div>
    `;
  }
}

customElements.define('app-layout', AppLayout);
