<template>
  <div
    class="aim-arena"
    :class="{ 'is-disabled': disabled }"
    @click.self="$emit('arena-miss')"
  >
    <button
      v-for="target in targets"
      :key="target.id"
      type="button"
      class="aim-target"
      :disabled="disabled"
      :style="targetStyle(target)"
      :aria-label="`Target ${target.id}`"
      @click.stop="$emit('hit', target.id)"
    />
  </div>
</template>

<script setup lang="ts">
type ArenaTarget = {
  id: number;
  row: number;
  col: number;
};

defineProps<{
  targets: ArenaTarget[];
  disabled?: boolean;
}>();

defineEmits<{
  (e: "arena-miss"): void;
  (e: "hit", id: number): void;
}>();

function targetStyle(target: ArenaTarget) {
  return {
    gridRowStart: target.row,
    gridColumnStart: target.col,
    backgroundColor: "var(--theme-title)",
    borderColor: "var(--theme-text)",
  };
}
</script>

<style scoped>
.aim-arena {
  width: 100%;
  aspect-ratio: 1 / 1;
  display: grid;
  grid-template-columns: repeat(7, minmax(0, 1fr));
  grid-template-rows: repeat(7, minmax(0, 1fr));
  gap: 0;
  background: var(--theme-bg);
  cursor: crosshair;
}

.aim-arena.is-disabled {
  cursor: default;
}

.aim-target {
  align-self: stretch;
  justify-self: stretch;
  width: 96%;
  height: 96%;
  border-radius: 50%;
  border: 0;
  box-shadow: 0 0 18px rgba(0, 0, 0, 0.18);
  outline: none;
  transition: transform 100ms ease-out, opacity 100ms ease-out;
}

.aim-target:active {
  transform: scale(0.96);
}

.aim-target:disabled {
  opacity: 0.65;
  cursor: default;
}
</style>
