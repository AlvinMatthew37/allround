<template>
  <div class="result-overlay">
    <div class="wpm-title">WPM</div>
    <div class="wpm-value">{{ wpm }}</div>
    <div class="acc-title">Accuracy</div>
    <div class="acc-value">{{ accuracy }}%</div>
    <div class="stats">
      <div>{{ cl }}/{{ tl }} letters</div>
      <div>{{ cw }} words</div>
      <div>{{ timeTaken }} seconds</div>
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  wpm: number;
  accuracy: number;
  cl: number;
  tl: number;
  cw: number;
  timeTaken: number;
}>();
</script>

<style scoped>
.result-overlay {
  grid-area: stack;
  z-index: 10;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  border-radius: 0.5rem;
}

.wpm-title {
  color: var(--theme-text);
  font-size: 2.25rem;
  font-weight: 700;
  margin-bottom: -1rem;
}

.wpm-value {
  color: var(--theme-title);
  font-size: 3.75rem;
  font-weight: 700;
  margin-bottom: 1rem;
}

.acc-title {
  color: var(--theme-text);
  font-size: 1.5rem;
  font-weight: 700;
}

.acc-value {
  color: var(--theme-title);
  font-size: 2.25rem;
  font-weight: 700;
}

.stats {
  margin-top: 1rem;
  color: var(--theme-text);
  text-align: center;
}
</style>
