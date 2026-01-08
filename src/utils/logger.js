let logElement = null;
let autoScrollEnabled = localStorage.getItem('autoScrollEnabled') !== 'false'; // Default to true

export class Logger {
  /**
   * Set auto-scroll enabled state
   * @param {boolean} enabled
   */
  static setAutoScroll(enabled) {
    autoScrollEnabled = enabled;
    console.log('📜 Logger auto-scroll:', enabled ? 'ENABLED' : 'DISABLED');
  }

  /**
   * Get current auto-scroll state
   * @returns {boolean}
   */
  static isAutoScrollEnabled() {
    return autoScrollEnabled;
  }

  static setLogHolder(el) {
    logElement = typeof el === 'string' ? document.querySelector(el) : el;

    // If not found in main document, check inside combat-arena shadow DOM
    if (!logElement) {
      const arena = document.querySelector('combat-arena');
      if (arena && arena.shadowRoot) {
        logElement = arena.shadowRoot.querySelector('#log');
      }
    }

    console.log('Logger initialized:', logElement ? 'Found log element' : 'Log element not found');
  }

  static log(message) {
    // Try to find log element if not set
    if (!logElement) {
      // Check in combat-arena shadow DOM first
      const arena = document.querySelector('combat-arena');
      if (arena && arena.shadowRoot) {
        logElement = arena.shadowRoot.querySelector('#log');
        console.log('🔍 Found log element in arena shadow DOM');
      }

      // Fallback to regular document query
      if (!logElement) {
        logElement = document.querySelector('#log');
        if (logElement) {
          console.log('🔍 Found log element in main document');
        }
      }
    }

    if (logElement) {
      logElement.insertAdjacentHTML('beforeend', message);

      // Auto-scroll to bottom only if enabled
      if (autoScrollEnabled) {
        // Find container in shadow DOM
        const arena = document.querySelector('combat-arena');
        const container = arena?.shadowRoot?.querySelector('.combat-log-container');

        if (container) {
          // Scroll container to bottom
          requestAnimationFrame(() => {
            container.scrollTop = container.scrollHeight;
          });
        } else {
          // Fallback: try to scroll the log element itself
          requestAnimationFrame(() => {
            logElement.scrollTop = logElement.scrollHeight;
          });
        }
      }
    } else {
      console.warn('❌ Log element not found, message:', message.substring(0, 100));
      console.warn('Arena exists:', !!document.querySelector('combat-arena'));
      console.warn('Arena has shadowRoot:', !!document.querySelector('combat-arena')?.shadowRoot);
    }
  }

  static logFighter(obj, el) {
    const msg = `
      <div class="details-holder" data-id="${obj.id}" draggable="true">
        <div class="row">
          <div class="col-2">
            <div class="img"><img src="${obj.image}" alt="${obj.name}"></div>
          </div>
          <div class="col-9">
            <div class="name"><strong>Name:</strong> ${obj.name}</div>
            <div class="health"><strong>Health:</strong> ${obj.health}</div>
            <div class="strength"><strong>Strength:</strong> ${obj.strength}</div>
            <div class="descr"><strong>Bio:</strong> ${obj.description}</div>
          </div>
        </div>               
      </div>
    `;

    if (el) {
      const element = typeof el === 'string' ? document.querySelector(el) : el;
      if (element) {
        element.insertAdjacentHTML('beforeend', msg);
      }
    } else {
      this.log(msg);
    }
  }

  static logTeam(team, el) {
    const msg = `<div class="team-holder ${team.id}"></div>`;

    if (el) {
      const element = typeof el === 'string' ? document.querySelector(el) : el;
      if (element) {
        element.insertAdjacentHTML('beforeend', msg);
      }
    } else {
      this.log(msg);
    }

    const teamHolder = document.querySelector(`.${team.id}`);
    for (const fighter of team.fighters) {
      this.logFighter(fighter, teamHolder);
    }
  }

  static newLine() {
    if (logElement) {
      logElement.insertAdjacentHTML('beforeend', '<br>');
    }
  }

  static clearLog() {
    if (logElement) {
      logElement.innerHTML = '';
    }
  }
}
