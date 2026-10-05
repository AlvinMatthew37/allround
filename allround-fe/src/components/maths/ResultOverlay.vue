<template>
  <div class="result-overlay">
    <div class="result-panel">
      <p class="panel-title">session complete</p>

      <div class="hero-grid">
        <div class="stat-card hero-card">
          <span class="stat-label">Solved</span>
          <strong class="stat-value">{{ solved }}</strong>
        </div>

        <div class="stat-card hero-card">
          <span class="stat-label">Accuracy</span>
          <strong class="stat-value">{{ accuracy }}%</strong>
        </div>
      </div>

      <div class="result-grid">
        <div class="stat-card compact-card">
          <span class="stat-label">Wrong</span>
          <strong class="stat-value">{{ misses }}</strong>
        </div>
        <div class="stat-card compact-card">
          <span class="stat-label">Per minute</span>
          <strong class="stat-value">{{ perMinute }}</strong>
        </div>
        <div class="stat-card compact-card">
          <span class="stat-label">Seconds</span>
          <strong class="stat-value">{{ formattedTimeTaken }}</strong>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";

const props = defineProps<{
  solved: number;
  misses: number;
  timeTaken: number;
}>();

const accuracy = computed(() => {
  const attempts = props.solved + props.misses;
  if (attempts === 0) return 0;
  return Math.round((props.solved / attempts) * 100);
});

const perMinute = computed(() => {
  if (props.timeTaken <= 0) return 0;
  return Math.round((props.solved / props.timeTaken) * 60);
});

const formattedTimeTaken = computed(() => `${props.timeTaken.toFixed(1)}s`);
</script>

<style scoped>
.result-overlay {
  position: absolute;
  inset: 0;
  z-index: 10;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1rem;
  background: color-mix(in srgb, var(--theme-bg) 70%, transparent);
  backdrop-filter: blur(4px);
}

.result-panel {
  width: min(100%, 28rem);
  border-radius: 1.25rem;
  background: color-mix(in srgb, var(--theme-bg) 88%, black 12%);
  padding: 1.5rem;
  text-align: center;
  box-shadow: 0 20px 50px rgba(0, 0, 0, 0.25);
}

.stat-card {
  border-radius: 1rem;
  background: rgba(0, 0, 0, 0.08);
  padding: 0.9rem 1rem;
}

.hero-card {
  display: flex;
  flex-direction: column;
  gap: 0.35rem;
}

.hero-grid {
  display: grid;
  gap: 0.75rem;
}

@media (min-width: 640px) {
  .hero-grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}

.panel-title {
  font-size: 0.72rem;
  font-weight: 700;
  letter-spacing: 0.18em;
  line-height: 1.2;
  margin-bottom: 1.1rem;
  text-transform: uppercase;
  color: var(--theme-text-done);
}

.stat-label {
  font-size: 0.72rem;
  font-weight: 700;
  letter-spacing: 0.18em;
  text-transform: uppercase;
  color: var(--theme-text);
}

.stat-value {
  display: block;
  margin-top: 0.35rem;
  font-size: 1.5rem;
  font-weight: 800;
  color: var(--theme-text-done);
}

.result-grid {
  margin-top: 0.75rem;
  display: grid;
  gap: 0.75rem;
}

@media (min-width: 640px) {
  .result-grid {
    grid-template-columns: repeat(3, minmax(0, 1fr));
  }
}

.compact-card {
  min-height: 4.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  gap: 0.2rem;
}

.compact-card .stat-value {
  margin-top: 0;
  font-size: 1.5rem;
}
</style>
