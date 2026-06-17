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
        @click="$emit('update:mode', 'target')"
        :class="{ 'text-[var(--theme-text-done)]': mode === 'target' }"
      >
        target
      </button>
    </div>

    <div class="divider"></div>

    <div class="mods" v-if="mode === 'time'">
      <button
        v-for="duration in [10, 30, 60, 120]"
        :key="duration"
        @click="$emit('update:timeDuration', duration)"
        :class="{ 'text-[var(--theme-text-done)]': timeDuration === duration }"
      >
        {{ duration }}
      </button>
    </div>

    <div class="mods" v-else>
      <button
        v-for="count in [1, 15, 30, 50, 100]"
        :key="count"
        @click="$emit('update:targetCount', count)"
        :class="{ 'text-[var(--theme-text-done)]': targetCount === count }"
      >
        {{ count }}
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  mode: "time" | "target";
  timeDuration: number;
  targetCount: number;
}>();

defineEmits<{
  (e: "update:mode", mode: "time" | "target"): void;
  (e: "update:timeDuration", duration: number): void;
  (e: "update:targetCount", count: number): void;
}>();
</script>

<style scoped>
.toolbar {
  width: fit-content;
  display: flex;
  justify-content: center;
  align-items: center;
  margin: auto;
  gap: 0.75rem;
  flex-wrap: wrap;
  user-select: none;
}

@media (min-width: 640px) {
  .toolbar {
    gap: 1rem;
  }
}

.divider {
  width: 1px;
  height: 1rem;
  border-radius: 9999px;
  background-color: #00000014;
}

.mods {
  color: var(--theme-text);
  font-size: 0.875rem;
  font-weight: 500;
  display: flex;
  gap: 0.5rem;
}

@media (min-width: 640px) {
  .mods {
    font-size: medium;
  }
}

.mods button {
  padding: 0.25rem 0.35rem;
  min-width: 0;
  min-height: 2rem;
  display: flex;
  align-items: center;
  justify-content: center;
  line-height: 1;
  text-transform: lowercase;
  cursor: pointer;
}

@media (min-width: 640px) {
  .mods button {
    padding: 0.2rem 0.35rem;
  }
}

.mods button:hover {
  color: var(--theme-text-done);
  transition: color 0.2s ease;
}
</style>
