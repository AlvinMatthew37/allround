<template>
  <div class="flex gap-2 text-xl font-bold text-[var(--theme-title)] mt-4 justify-center items-end">
    <div class="liveStat">{{ count }}</div>
    <div class="text-3xl self-start mt-4 sm:mt-0">numbers</div>
    <div class="lives mb-2" :aria-label="`${lives} lives left`">
      <Heart
        v-for="i in livesSetting"
        :key="i"
        class="h-5 w-5"
        :class="i <= lives ? 'filled' : 'lost'"
        :stroke-width="1.5"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { Heart } from "lucide-vue-next";

defineProps<{
  count: number;
  lives: number;
  livesSetting: number;
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

.lives {
  display: flex;
  gap: 0.3rem;
  align-items: center;
}

.lives .filled {
  color: var(--theme-text-focus);
  fill: var(--theme-text-focus);
}

.lives .lost {
  color: var(--theme-text-done);
  opacity: 0.35;
}
</style>
