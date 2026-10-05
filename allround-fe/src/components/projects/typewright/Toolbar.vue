<template>
  <div class="toolbar">
    <div class="mods">
      <button
        @click="$emit('update:mode', 'time')"
        aria-label="time mode"
        title="time"
        :class="{ 'text-[var(--theme-text-done)]': mode === 'time' }"
      >
        <Hourglass class="h-5 w-5" :stroke-width="2" />
      </button>
      <button
        @click="$emit('update:mode', 'words')"
        aria-label="words mode"
        title="words"
        :class="{ 'text-[var(--theme-text-done)]': mode === 'words' }"
      >
        <Type class="h-5 w-5" :stroke-width="2" />
      </button>
    </div>

    <div class="divider"></div>

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
import { Hourglass, Type } from "lucide-vue-next";

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
/* Vertical sidebar rail on lg+; falls back to the original
   horizontal pill below that. */
.toolbar {
  background-color: #00000007;
  padding: 1rem 0.5rem;
  border-radius: 0.75rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.75rem;
  width: fit-content;
  user-select: none;
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
  flex-direction: column;
  align-items: center;
  gap: 0.25rem;
}

.mods button {
  padding: 0 0.5rem;
  min-width: 44px;
  min-height: 44px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.mods button:hover {
  color: var(--theme-text-done);
  border-radius: 0.25rem;
  transition: all 0.3s ease;
}

.divider {
  width: 1.75rem;
  height: 1px;
  border-radius: 9999px;
  background-color: #00000010;
}

@media (min-width: 1024px) {
  .toolbar {
    width: 100%;
  }
}

@media (max-width: 1023px) {
  .toolbar {
    flex-direction: row;
    justify-content: center;
    padding: 0 1rem;
    border-radius: 0.5rem;
    gap: 0.5rem;
    flex-wrap: wrap;
  }

  .mods {
    flex-direction: row;
    gap: 0.25rem;
  }

  @media (min-width: 640px) {
    .toolbar {
      gap: 1rem;
    }

    .mods {
      font-size: medium;
    }

    .mods button {
      min-width: auto;
      min-height: auto;
      padding: 0 0.25rem;
    }
  }

  .divider {
    width: 1px;
    height: 1.5rem;
  }
}
</style>
