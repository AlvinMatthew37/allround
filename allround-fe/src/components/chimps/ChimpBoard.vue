<template>
  <div class="board">
    <button
      v-for="n in numbers"
      :key="n.value"
      type="button"
      class="cell"
      :class="{
        revealed: isRevealed(n),
        wrong: wrongCell === n.cell,
      }"
      :style="{
        gridColumn: (n.cell % COLS) + 1,
        gridRow: Math.floor(n.cell / COLS) + 1,
      }"
      :aria-label="`square ${n.value}`"
      @click="$emit('pick', n.cell)"
    >
      <span v-if="isRevealed(n)" class="value">{{ n.value }}</span>
    </button>
  </div>
</template>

<script setup lang="ts">
const props = defineProps<{
  numbers: { cell: number; value: number }[];
  state: "idle" | "memorize" | "recall" | "locked" | "over";
  expected: number;
  wrongCell: number | null;
}>();

defineEmits<{
  (e: "pick", cell: number): void;
}>();

const COLS = 8;

function isRevealed(n: { cell: number; value: number }) {
  if (props.state === "memorize") return true;
  // already-clicked numbers stay revealed during recall
  return props.state !== "idle" && n.value < props.expected;
}
</script>

<style scoped>
.board {
  display: grid;
  grid-template-columns: repeat(8, minmax(0, 1fr));
  grid-template-rows: repeat(5, minmax(0, 1fr));
  gap: 0.5rem;
  width: 100%;
  max-width: 40rem;
  aspect-ratio: 8 / 5;
  margin: 0 auto;
  user-select: none;
}

.cell {
  border: none;
  border-radius: 0.5rem;
  background-color: color-mix(in srgb, var(--theme-text) 8%, transparent);
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0;
  font-weight: 700;
  font-size: clamp(0.9rem, 2vw, 1.5rem);
  color: var(--theme-text);
  transition: background-color 0.15s ease;
}

.cell:hover {
  background-color: color-mix(in srgb, var(--theme-text) 14%, transparent);
}

.cell.revealed {
  background-color: color-mix(in srgb, var(--theme-text-focus) 16%, transparent);
}

.cell.wrong {
  background-color: color-mix(in srgb, var(--theme-text-error) 45%, transparent);
  animation: shake 0.35s ease;
}

.value {
  font-variant-numeric: tabular-nums;
}

@keyframes shake {
  0%,
  100% {
    transform: translateX(0);
  }
  20% {
    transform: translateX(-5px);
  }
  40% {
    transform: translateX(5px);
  }
  60% {
    transform: translateX(-3px);
  }
  80% {
    transform: translateX(3px);
  }
}
</style>
