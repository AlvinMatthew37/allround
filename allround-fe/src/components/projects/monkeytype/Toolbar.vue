<template>
  <div class="toolbar">
    <div class="mods">
      <button
        @click="$emit('update:mode', 'time')"
        :class="{ 'text-[var(--theme-text-done)]': mode === 'time' }"
      >
        time
      </button>
      <button
        @click="$emit('update:mode', 'words')"
        :class="{ 'text-[var(--theme-text-done)]': mode === 'words' }"
      >
        words
      </button>
    </div>
    <div class="h-6 w-1 rounded-lg bg-[#00000010] my-2"></div>

    <div class="mods" v-if="mode === 'time'">
      <button
        v-for="duration in [10, 30, 60, 180]"
        :key="duration"
        @click="$emit('update:timeDuration', duration)"
        :class="{ 'text-[var(--theme-text-done)]': timeDuration === duration }"
      >
        {{ duration }}
      </button>
    </div>

    <div class="mods" v-else>
      <button
        v-for="count in [1, 10, 25, 50, 100]"
        :key="count"
        @click="$emit('update:wordCount', count)"
        :class="{ 'text-[var(--theme-text-done)]': wordCount === count }"
      >
        {{ count }}
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  mode: 'time' | 'words';
  wordCount: number;
  timeDuration: number;
}>();

defineEmits<{
  (e: 'update:mode', mode: 'time' | 'words'): void;
  (e: 'update:wordCount', count: number): void;
  (e: 'update:timeDuration', duration: number): void;
}>();
</script>

<style scoped>
.toolbar {
  background-color: #00000007;
  width: fit-content;
  padding: 0 0.75rem;
  border-radius: 0.5rem;
  display: flex;
  justify-content: center;
  align-items: center;
  margin: auto;
  gap: 0.5rem;
  flex-wrap: wrap;
}

@media (min-width: 640px) {
  .toolbar {
    padding: 0 1rem;
    gap: 1rem;
  }
}

.toolbar:hover {
  background-color: #00000010;
  transition: background-color 0.3s ease;
}

.mods {
  color: var(--theme-text);
  font-size: 0.875rem;
  font-weight: 600;
  display: flex;
  gap: 0.25rem;
}

@media (min-width: 640px) {
  .mods {
    font-size: medium;
  }
}

.mods button {
  padding: 0 0.25rem;
  height: fit-content;
  min-width: 44px;
  min-height: 44px;
  display: flex;
  align-items: center;
  justify-content: center;
}

@media (min-width: 640px) {
  .mods button {
    min-width: auto;
    min-height: auto;
  }
}

.mods button:hover {
  color: var(--theme-text-done);
  border-radius: 0.25rem;
  transition: all 0.3s ease;
}
</style>
