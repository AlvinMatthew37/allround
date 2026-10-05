<template>
  <div class="flex gap-2 text-xl font-bold text-[var(--theme-title)] mt-4 justify-center items-end">
    <div class="liveStat">{{ wpm }}</div>
    <div class="text-3xl self-start mt-4 sm:mt-0">wpm</div>
    <div class="text-3xl mb-2" v-if="mode === 'time'">{{ timeRemaining }}s</div>
    <div class="text-3xl mb-2" v-else>{{ currWordIndex }}/{{ wordCount }}</div>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  mode: 'time' | 'words';
  wpm: number;
  currWordIndex: number;
  wordCount: number;
  timeRemaining: number;
}>();
</script>

<style scoped>
.liveStat {
  font-size: 4rem;
  font-weight: 500;
  color: var(--theme-text);
  line-height: 1;
}

@media (min-width: 640px) {
  .liveStat {
    font-size: 6rem;
  }
}

@media (min-width: 1024px) {
  .liveStat {
    font-size: 8rem;
  }
}
</style>
