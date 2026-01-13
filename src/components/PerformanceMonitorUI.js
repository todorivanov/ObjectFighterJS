/**
 * PerformanceMonitorUI - Visual display of performance metrics
 */

import { BaseComponent } from './BaseComponent.js';
import perfMonitorStyles from '../styles/components/PerformanceMonitorUI.scss?inline';
import { performanceMonitor } from '../utils/PerformanceMonitor.js';
import { poolManager } from '../utils/ObjectPool.js';
import { lazyLoader } from '../utils/LazyLoader.js';

export class PerformanceMonitorUI extends BaseComponent {
  constructor() {
    super();
    this.updateInterval = null;
    this.expanded = false;
  }

  connectedCallback() {
    super.connectedCallback();
    this.startUpdating();
  }

  disconnectedCallback() {
    this.stopUpdating();
  }

  startUpdating() {
    this.updateInterval = setInterval(() => {
      this.render();
    }, 1000); // Update every second
  }

  stopUpdating() {
    if (this.updateInterval) {
      clearInterval(this.updateInterval);
      this.updateInterval = null;
    }
  }

  toggleExpanded() {
    this.expanded = !this.expanded;
    this.render();
  }

  template() {
    const metrics = performanceMonitor.getMetrics();
    const status = performanceMonitor.getStatus();
    const poolStats = poolManager.getAllStats();
    const lazyStats = lazyLoader.getStats();

    const fpsColor = this.getStatusColor(status.fps);
    const frameTimeColor = this.getStatusColor(status.frameTime);
    const memoryColor = this.getStatusColor(status.memory);

    return `
      <div class="perf-monitor ${this.expanded ? 'expanded' : 'collapsed'}">
        <div class="perf-header" data-action="toggle">
          <span class="perf-title">⚡ Performance</span>
          <span class="perf-toggle">${this.expanded ? '−' : '+'}</span>
        </div>
        
        <div class="perf-content">
          <!-- FPS -->
          <div class="perf-metric">
            <span class="perf-label">FPS:</span>
            <span class="perf-value" style="color: ${fpsColor}">
              ${metrics.fps}
            </span>
          </div>

          <!-- Frame Time -->
          <div class="perf-metric">
            <span class="perf-label">Frame:</span>
            <span class="perf-value" style="color: ${frameTimeColor}">
              ${metrics.frameTime}ms
            </span>
          </div>

          <!-- Memory -->
          ${
            metrics.memory.limit > 0
              ? `
            <div class="perf-metric">
              <span class="perf-label">Memory:</span>
              <span class="perf-value" style="color: ${memoryColor}">
                ${metrics.memory.used}MB
              </span>
            </div>
          `
              : ''
          }

          ${
            this.expanded
              ? `
            <div class="perf-divider"></div>
            
            <!-- Object Pools -->
            <div class="perf-section">
              <div class="perf-section-title">Object Pools</div>
              ${Object.entries(poolStats)
                .map(
                  ([name, stats]) => `
                <div class="perf-pool">
                  <span class="pool-name">${name}:</span>
                  <span class="pool-stats">
                    ${stats.active}/${stats.total}
                    (${Math.round(stats.utilization * 100)}%)
                  </span>
                </div>
              `
                )
                .join('')}
            </div>

            <!-- Lazy Loader -->
            <div class="perf-section">
              <div class="perf-section-title">Lazy Loader</div>
              <div class="perf-metric">
                <span class="perf-label">Cached:</span>
                <span class="perf-value">${lazyStats.cached}</span>
              </div>
              <div class="perf-metric">
                <span class="perf-label">Loading:</span>
                <span class="perf-value">${lazyStats.loading}</span>
              </div>
              <div class="perf-metric">
                <span class="perf-label">Queued:</span>
                <span class="perf-value">${lazyStats.queued}</span>
              </div>
            </div>

            <!-- Average Stats -->
            <div class="perf-section">
              <div class="perf-section-title">Averages (60s)</div>
              <div class="perf-metric">
                <span class="perf-label">Avg FPS:</span>
                <span class="perf-value">
                  ${Math.round(performanceMonitor.getAverage('fps'))}
                </span>
              </div>
              <div class="perf-metric">
                <span class="perf-label">Avg Frame:</span>
                <span class="perf-value">
                  ${performanceMonitor.getAverage('frameTime').toFixed(1)}ms
                </span>
              </div>
            </div>
          `
              : ''
          }
        </div>
      </div>
    `;
  }

  getStatusColor(status) {
    switch (status) {
      case 'good':
        return '#4ade80';
      case 'warning':
        return '#fbbf24';
      case 'critical':
        return '#ef4444';
      default:
        return '#9ca3af';
    }
  }

  styles() {
    return perfMonitorStyles;
  }

  attachEventListeners() {
    this.shadowRoot.querySelector('[data-action="toggle"]')?.addEventListener('click', () => {
      this.toggleExpanded();
    });
  }
}

customElements.define('performance-monitor-ui', PerformanceMonitorUI);
