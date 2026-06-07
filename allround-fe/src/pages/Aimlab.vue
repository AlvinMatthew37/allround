<template>
  <div class="h-full min-h-0 overflow-hidden bg-[var(--theme-bg)] px-4 text-[var(--theme-text)] sm:px-6 lg:px-8">
    <div class="mx-auto flex h-full min-h-0 max-w-7xl flex-col items-center gap-4">
      <div class="mt-1 flex flex-col items-center gap-2 sm:mt-3 sm:gap-3">
        <h1 class="text-2xl font-extrabold uppercase tracking-[0.18em] text-[var(--theme-title)] sm:text-4xl">
          AIM TRAINER
        </h1>

        <Toolbar
          :mode="mode"
          :time-duration="timeDuration"
          :target-count="targetCount"
          @update:mode="setMode"
          @update:timeDuration="setTimeDuration"
          @update:targetCount="setTargetCount"
        />
      </div>

      <div class="flex min-h-0 flex-1 items-center justify-center">
        <AimArena
          class="aim-square"
          :targets="targets"
          :disabled="isFinished"
          @arena-miss="handleMiss"
          @hit="handleHit"
        />
      </div>

      <div class="mb-1 flex items-center justify-center gap-3">
        <div class="rounded-full bg-black/10 px-4 py-2 text-sm font-semibold text-[var(--theme-text)]">
          {{ statusLabel }}
        </div>

        <button
          type="button"
          @click="resetGame"
          class="rounded-full bg-black/10 px-4 py-2 text-sm font-semibold text-[var(--theme-text)] transition hover:bg-black/20"
        >
          Restart
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref } from "vue";
import AimArena from "../components/aimlab/AimArena.vue";
import Toolbar from "../components/aimlab/Toolbar.vue";

type GridTarget = {
  id: number;
  row: number;
  col: number;
};

const gridSize = 7;
const boardTargetCount = 3;

const mode = ref<"time" | "target">("time");
const timeDuration = ref(30);
const targetCount = ref(30);
const timeRemaining = ref(timeDuration.value);
const targets = ref<GridTarget[]>([]);
const hits = ref(0);
const isRunning = ref(false);
const isFinished = ref(false);
const timerId = ref<number | null>(null);

let nextTargetId = 1;

const statusLabel = computed(() => {
  if (mode.value === "time") {
    return isRunning.value ? `Time ${timeRemaining.value}s` : `Time ${timeDuration.value}s`;
  }

  return `Targets ${hits.value} / ${targetCount.value}`;
});

function getCellKey(row: number, col: number) {
  return `${row}-${col}`;
}

function getOccupiedCells(excludeId?: number) {
  return new Set(
    targets.value
      .filter((target) => target.id !== excludeId)
      .map((target) => getCellKey(target.row, target.col)),
  );
}

function randomCell(excludeId?: number) {
  const occupiedCells = getOccupiedCells(excludeId);
  const availableCells: Array<{ row: number; col: number }> = [];

  for (let row = 1; row <= gridSize; row += 1) {
    for (let col = 1; col <= gridSize; col += 1) {
      const key = getCellKey(row, col);
      if (!occupiedCells.has(key)) {
        availableCells.push({ row, col });
      }
    }
  }

  const selection = availableCells[Math.floor(Math.random() * availableCells.length)];

  return selection ?? { row: 1, col: 1 };
}

function createTarget(excludeId?: number): GridTarget {
  const cell = randomCell(excludeId);

  return {
    id: nextTargetId++,
    row: cell.row,
    col: cell.col,
  };
}

function spawnTargets() {
  const createdTargets: GridTarget[] = [];

  while (createdTargets.length < boardTargetCount) {
    createdTargets.push(createTarget());
  }

  targets.value = createdTargets;
}

function stopTimer() {
  if (timerId.value !== null) {
    clearInterval(timerId.value);
    timerId.value = null;
  }
}

function startTimer() {
  stopTimer();
  timerId.value = window.setInterval(() => {
    if (!isRunning.value || mode.value !== "time") {
      return;
    }

    timeRemaining.value -= 1;

    if (timeRemaining.value <= 0) {
      timeRemaining.value = 0;
      finishGame();
    }
  }, 1000);
}

function beginSession() {
  if (isFinished.value || isRunning.value) {
    return;
  }

  isRunning.value = true;

  if (mode.value === "time") {
    startTimer();
  }
}

function finishGame() {
  isRunning.value = false;
  isFinished.value = true;
  stopTimer();
}

function resetGame() {
  stopTimer();
  hits.value = 0;
  nextTargetId = 1;
  isRunning.value = false;
  isFinished.value = false;
  timeRemaining.value = timeDuration.value;
  spawnTargets();
}

function setMode(newMode: "time" | "target") {
  mode.value = newMode;
  localStorage.setItem("aimlab-mode", newMode);
  resetGame();
}

function setTimeDuration(duration: number) {
  timeDuration.value = duration;
  timeRemaining.value = duration;
  localStorage.setItem("aimlab-time-duration", duration.toString());
  resetGame();
}

function setTargetCount(count: number) {
  targetCount.value = count;
  localStorage.setItem("aimlab-target-count", count.toString());
  resetGame();
}

function handleHit(id: number) {
  if (isFinished.value) {
    return;
  }

  beginSession();
  hits.value += 1;
  targets.value = targets.value.map((target) =>
    target.id === id ? createTarget(id) : target,
  );

  if (mode.value === "target" && hits.value >= targetCount.value) {
    finishGame();
  }
}

function handleMiss() {
  if (isFinished.value) {
    return;
  }

  beginSession();
}

onMounted(() => {
  const savedMode = localStorage.getItem("aimlab-mode");
  if (savedMode === "time" || savedMode === "target") {
    mode.value = savedMode;
  }

  const savedTimeDuration = localStorage.getItem("aimlab-time-duration");
  if (savedTimeDuration) {
    const parsedDuration = Number.parseInt(savedTimeDuration, 10);
    if (!Number.isNaN(parsedDuration)) {
      timeDuration.value = parsedDuration;
      timeRemaining.value = parsedDuration;
    }
  }

  const savedTargetCount = localStorage.getItem("aimlab-target-count");
  if (savedTargetCount) {
    const parsedTargetCount = Number.parseInt(savedTargetCount, 10);
    if (!Number.isNaN(parsedTargetCount)) {
      targetCount.value = parsedTargetCount;
    }
  }

  resetGame();
});

onUnmounted(() => {
  stopTimer();
});
</script>

<style scoped>
.aim-square {
  width: auto;
  height: min(100%, 48rem);
  max-width: 100%;
}
</style>
