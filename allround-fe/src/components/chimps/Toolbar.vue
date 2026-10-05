<template>
  <div class="toolbar">
    <div class="mods">
      <Square class="h-5 w-5" :stroke-width="2" />
      <button
        v-for="count in [4, 6, 8, 10]"
        :key="count"
        @click="$emit('update:startCount', count)"
        :class="{ 'text-[var(--theme-text-done)]': startCount === count }"
      >
        {{ count }}
      </button>
    </div>

    <div class="divider"></div>

    <div class="mods">
      <Heart class="h-5 w-5" :stroke-width="2" />
      <button
        v-for="lifeCount in [1, 3, 5]"
        :key="lifeCount"
        @click="$emit('update:livesSetting', lifeCount)"
        :class="{ 'text-[var(--theme-text-done)]': livesSetting === lifeCount }"
      >
        {{ lifeCount }}
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Square, Heart } from "lucide-vue-next";
defineProps<{
  startCount: number;
  livesSetting: number;
}>();

defineEmits<{
  (e: "update:startCount", count: number): void;
  (e: "update:livesSetting", lives: number): void;
}>();
</script>

<style scoped>
/* Vertical sidebar rail on lg+; falls back to the original
   horizontal pill below that. Left group: starting number count.
   Right group: lives. */
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
