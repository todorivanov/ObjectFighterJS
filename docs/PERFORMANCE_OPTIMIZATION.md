# Performance Optimization Guide

## Overview

Version 4.6.0 introduces comprehensive performance optimization features:

1. **Lazy Loading** - Load resources on demand
2. **Object Pooling** - Reuse objects to reduce GC pressure
3. **Performance Monitoring** - Real-time FPS, memory, and metrics tracking

---

## Lazy Loading System

### Overview

The `LazyLoader` dynamically loads modules and assets only when needed, reducing initial load time and memory footprint.

### Usage

#### Basic Module Loading

```javascript
import { lazyLoader, loadModule } from '../utils/LazyLoader.js';

// Load a module on demand
const module = await loadModule('../components/HeavyComponent.js');

// Use the loaded module
const component = new module.HeavyComponent();
```

#### Image Loading

```javascript
import { loadImage } from '../utils/LazyLoader.js';

// Load image asset
const image = await loadImage('/assets/character.png');

// Use in canvas or DOM
ctx.drawImage(image, 0, 0);
```

#### Batch Loading

```javascript
import { lazyLoader } from '../utils/LazyLoader.js';

// Load multiple modules in parallel
const modules = await lazyLoader.loadBatch(
  ['./ModuleA.js', './ModuleB.js', './ModuleC.js'],
  'module'
);

// Load multiple images
const images = await lazyLoader.loadBatch(
  ['/img1.png', '/img2.png', '/img3.png'],
  'image'
);
```

#### Preloading

```javascript
import { preloadModules, preloadImages } from '../utils/LazyLoader.js';

// Preload modules for future use
preloadModules(['/heavy-module.js', '/another-module.js'], 10); // priority 10

// Preload images
preloadImages(['/bg1.png', '/bg2.png'], 5); // priority 5
```

#### Lazy Component Loading

```javascript
import { lazyLoader } from '../utils/LazyLoader.js';

// Load and register Web Component lazily
await lazyLoader.loadComponent('heavy-component', './HeavyComponent.js');

// Component is now available
document.body.appendChild(document.createElement('heavy-component'));
```

#### Intersection Observer

```javascript
import { lazyLoader } from '../utils/LazyLoader.js';

// Load when element becomes visible
const element = document.querySelector('.lazy-content');

lazyLoader.observeElement(element, async (el) => {
  const module = await loadModule('./ContentModule.js');
  module.init(el);
});
```

### API Reference

```javascript
class LazyLoader {
  // Load module dynamically
  async loadModule(modulePath: string): Promise<any>
  
  // Load image asset
  async loadImage(imagePath: string): Promise<HTMLImageElement>
  
  // Load multiple resources
  async loadBatch(paths: string[], type: 'module' | 'image'): Promise<Array>
  
  // Preload resources
  preload(paths: string[], type: string, priority: number): void
  
  // Load Web Component
  async loadComponent(tagName: string, modulePath: string): Promise<void>
  
  // Observe element visibility
  observeElement(element: Element, callback: Function, options: object): void
  
  // Clear cache
  clearCache(pattern?: string): void
  
  // Get statistics
  getStats(): { cached, loading, queued, observers }
}
```

---

## Object Pooling System

### Overview

The `ObjectPool` system reuses objects instead of creating and destroying them, significantly reducing garbage collection overhead.

### Usage

#### Basic Pooling

```javascript
import { ObjectPool } from '../utils/ObjectPool.js';

// Create a pool
const particlePool = new ObjectPool(
  // Factory function
  () => ({ x: 0, y: 0, vx: 0, vy: 0, life: 1 }),
  
  // Reset function
  (particle) => {
    particle.life = 1;
    particle.vx = 0;
    particle.vy = 0;
    return particle;
  },
  
  10,  // Initial size
  100  // Max size
);

// Acquire from pool
const particle = particlePool.acquire();
particle.x = 100;
particle.y = 200;

// Use particle...

// Release back to pool
particlePool.release(particle);
```

#### Using Pre-configured Pools

```javascript
import { poolManager, acquireVector, releaseVector } from '../utils/ObjectPool.js';

// Use pre-configured vector pool
const vec = acquireVector();
vec.x = 10;
vec.y = 20;

// ... use vector ...

releaseVector(vec);
```

#### Creating Custom Pools

```javascript
import { poolManager } from '../utils/ObjectPool.js';

// Create custom pool
poolManager.createPool(
  'enemy',
  () => new Enemy(),
  (enemy) => {
    enemy.reset();
    return enemy;
  },
  5,  // Initial
  20  // Max
);

// Use the pool
const enemy = poolManager.acquire('enemy');
// ...
poolManager.release('enemy', enemy);
```

#### Batch Operations

```javascript
// Acquire multiple objects
const particles = [];
for (let i = 0; i < 50; i++) {
  particles.push(particlePool.acquire());
}

// Release all at once
particlePool.releaseAll(particles);
```

### Pre-configured Pools

The system includes these pools out of the box:

- **vector2d** - 2D vectors
- **damageNumber** - Floating damage text
- **particle** - Visual effect particles
- **event** - Event objects

### API Reference

```javascript
class ObjectPool {
  constructor(factory, reset, initialSize, maxSize)
  
  // Get object from pool
  acquire(): any
  
  // Return object to pool
  release(obj: any): void
  
  // Release multiple objects
  releaseAll(objects: Array): void
  
  // Get statistics
  getStats(): { created, reused, released, destroyed, pooled, active, utilization }
  
  // Resize pool
  resize(targetSize: number): void
  
  // Clear pool
  clear(): void
}

class PoolManager {
  // Create named pool
  createPool(name, factory, reset, initialSize, maxSize): ObjectPool
  
  // Get pool
  getPool(name): ObjectPool
  
  // Acquire from named pool
  acquire(poolName): any
  
  // Release to named pool
  release(poolName, obj): void
  
  // Get all pool stats
  getAllStats(): object
}
```

---

## Performance Monitoring

### Overview

The `PerformanceMonitor` tracks FPS, frame time, memory usage, and custom metrics in real-time.

### UI Component

A visual performance monitor is always visible in the top-left corner:

```
⚡ Performance [+]
FPS: 60
Frame: 16.7ms
Memory: 45MB
```

Click to expand for detailed stats:
- Object pool utilization
- Lazy loader statistics
- Average FPS/frame time
- Memory usage breakdown

### Programmatic Usage

#### Basic Metrics

```javascript
import { performanceMonitor, getMetrics } from '../utils/PerformanceMonitor.js';

// Get current metrics
const metrics = getMetrics();
console.log(`FPS: ${metrics.fps}`);
console.log(`Frame Time: ${metrics.frameTime}ms`);
console.log(`Memory: ${metrics.memory.used}MB`);
```

#### Timing Functions

```javascript
import { startTimer, endTimer } from '../utils/PerformanceMonitor.js';

// Time a block of code
startTimer('render');
renderScene();
const duration = endTimer('render');
console.log(`Render took ${duration}ms`);
```

#### Profiling

```javascript
import { profile, profileAsync } from '../utils/PerformanceMonitor.js';

// Profile synchronous function
const result = profile('heavyComputation', () => {
  return doHeavyWork();
});

// Profile async function
const data = await profileAsync('loadData', async () => {
  return await fetchData();
});
```

#### Performance Marks & Measures

```javascript
import { performanceMonitor } from '../utils/PerformanceMonitor.js';

// Mark points in time
performanceMonitor.mark('startLoad');
await loadResources();
performanceMonitor.mark('endLoad');

// Measure between marks
const duration = performanceMonitor.measure('loadTime', 'startLoad', 'endLoad');
console.log(`Loading took ${duration}ms`);
```

#### Status Monitoring

```javascript
import { performanceMonitor } from '../utils/PerformanceMonitor.js';

// Get performance status
const status = performanceMonitor.getStatus();

if (status.overall === 'critical') {
  console.warn('Performance is critical!');
  // Reduce quality settings
}

if (status.memory === 'warning') {
  console.warn('High memory usage');
  // Clear caches
}
```

#### Performance Summary

```javascript
import { logPerformance } from '../utils/PerformanceMonitor.js';

// Log detailed performance summary
logPerformance();

// Output:
// 📊 Performance Summary
// FPS: 60 (avg: 58, min: 45, max: 60)
// Frame Time: 16.7ms
// Memory: 45MB / 2048MB (2.2%)
// ⏱️ Measures:
//   render: 12.50ms
//   update: 3.25ms
```

### API Reference

```javascript
class PerformanceMonitor {
  // Enable/disable monitoring
  enabled: boolean
  
  // Start/stop monitoring loop
  startMonitoring(): void
  stopMonitoring(): void
  
  // Timing
  mark(name: string): void
  measure(name: string, startMark: string, endMark?: string): number
  startTimer(name: string): void
  endTimer(name: string): number
  
  // Profiling
  profile(name: string, fn: Function): any
  profileAsync(name: string, fn: Function): Promise<any>
  
  // Metrics
  getMetrics(): object
  getHistory(metric: string): Array
  getAverage(metric: string): number
  getMinMax(metric: string): { min, max }
  
  // Status
  getStatus(): { fps, frameTime, memory, overall }
  
  // Logging
  logSummary(): void
}
```

---

## Best Practices

### Lazy Loading

✅ **DO**:
- Lazy load heavy, rarely-used components
- Preload assets for next screen during transitions
- Use intersection observer for off-screen content
- Cache loaded modules

❌ **DON'T**:
- Lazy load critical path components
- Over-preload (defeats the purpose)
- Load same module multiple times

### Object Pooling

✅ **DO**:
- Pool frequently created/destroyed objects
- Pool visual effects (particles, damage numbers)
- Pool temporary calculation objects
- Monitor pool utilization

❌ **DON'T**:
- Pool large, rarely-used objects
- Create pools larger than needed
- Forget to release objects back to pool

### Performance Monitoring

✅ **DO**:
- Monitor FPS in production
- Profile performance-critical code
- Log performance metrics
- React to performance warnings

❌ **DON'T**:
- Profile everything (overhead)
- Ignore critical performance warnings
- Ship debug monitoring UI to production

---

## Integration Examples

### Lazy Load Heavy Screen

```javascript
// In router or navigation handler
async function showHeavyScreen() {
  // Show loading indicator
  showLoader();
  
  // Lazy load the heavy component
  await lazyLoader.loadComponent('heavy-screen', './HeavyScreen.js');
  
  // Create and show
  const screen = document.createElement('heavy-screen');
  document.body.appendChild(screen);
  
  hideLoader();
}
```

### Pool Combat Effects

```javascript
import { poolManager } from '../utils/ObjectPool.js';

// Create effect pool
poolManager.createPool(
  'combatEffect',
  () => new CombatEffect(),
  (effect) => effect.reset(),
  10,
  50
);

// In combat system
function showDamageEffect(x, y, damage) {
  const effect = poolManager.acquire('combatEffect');
  effect.init(x, y, damage);
  
  // After animation
  setTimeout(() => {
    poolManager.release('combatEffect', effect);
  }, 1000);
}
```

### Monitor Game Loop

```javascript
import { performanceMonitor } from '../utils/PerformanceMonitor.js';

function gameLoop() {
  performanceMonitor.startTimer('frame');
  
  // Update
  performanceMonitor.startTimer('update');
  update();
  performanceMonitor.endTimer('update');
  
  // Render
  performanceMonitor.startTimer('render');
  render();
  performanceMonitor.endTimer('render');
  
  performanceMonitor.endTimer('frame');
  
  requestAnimationFrame(gameLoop);
}
```

---

## Performance Targets

### FPS Thresholds

- **Good**: ≥55 FPS
- **Warning**: 40-54 FPS
- **Critical**: <40 FPS

### Frame Time Thresholds

- **Good**: ≤16ms (60 FPS)
- **Warning**: 17-25ms (40-59 FPS)
- **Critical**: >25ms (<40 FPS)

### Memory Thresholds

- **Warning**: >80% of heap limit
- **Critical**: >95% of heap limit

---

## Troubleshooting

### High Memory Usage

1. Check object pool stats - are objects being released?
2. Clear lazy loader cache periodically
3. Profile memory-intensive operations
4. Look for memory leaks in event listeners

### Low FPS

1. Profile frame time - what's taking long?
2. Reduce particle/effect count
3. Increase object pool sizes
4. Optimize render loop

### Slow Loading

1. Preload critical assets
2. Batch load related modules
3. Use lazy loading for non-critical content
4. Check network tab for slow assets

---

## Version

- **Version**: 4.6.0
- **Date**: 2026-01-09
- **Status**: ✅ Complete

---

**Next**: See [Testing Guide](./TESTING.md) for performance testing strategies.
