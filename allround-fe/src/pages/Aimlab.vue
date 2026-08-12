<template>
  <div class="h-full min-h-0 overflow-hidden bg-[var(--theme-bg)] px-4 text-[var(--theme-text)] sm:px-6 lg:px-8">
    <div class="mx-auto flex h-full min-h-0 max-w-7xl flex-col items-center gap-4">
      <div class="mt-1 flex flex-col items-center gap-2 sm:mt-3 sm:gap-3">
        <h1 class="text-2xl font-extrabold uppercase text-[var(--theme-title)] sm:text-4xl">
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

      <div class="relative flex min-h-0 flex-1 items-center justify-center">
        <AimArena
          class="aim-square"
          :targets="targets"
          :disabled="isFinished"
          @arena-miss="handleMiss"
          @hit="handleHit"
        />

        <div
          v-if="isFinished"
          class="finish-overlay absolute inset-0 flex flex-col items-center justify-start px-4 py-6"
        >
          <div class="finish-panel">
            <p class="text-sm font-semibold uppercase tracking-[0.35em] text-[var(--theme-text-done)]">
              session complete
            </p>

            <div class="mt-5 grid gap-3 text-left sm:grid-cols-2">
              <div class="finish-stat">
                <span>Accuracy</span>
                <strong>{{ finishAccuracy }}%</strong>
              </div>
              <div class="finish-stat">
                <span>Target hits</span>
                <strong>{{ hits }}</strong>
              </div>
              <div class="finish-stat">
                <span>Misses</span>
                <strong>{{ misses }}</strong>
              </div>
              <div class="finish-stat">
                <span>Time taken</span>
                <strong>{{ formattedElapsedTime }}</strong>
              </div>
            </div>
          </div>

          <button
            type="button"
            @click="resetGame"
            class="mt-6 inline-flex items-center justify-center rounded-lg px-4 py-2 text-[var(--theme-text)] transition hover:bg-[#00000010] hover:text-[var(--theme-text-focus)] focus:bg-[#00000010] focus:text-[var(--theme-text-focus)] focus:outline-none"
            aria-label="Restart session"
            title="Restart session"
          >
            <RefreshCcw class="h-8 w-8" />
          </button>
        </div>
      </div>

      <div v-if="!isFinished" class="mb-1 flex items-center justify-center gap-3">
        <div class="rounded-full bg-black/10 px-4 py-2 text-sm font-semibold text-[var(--theme-text)]">
          {{ statusLabel }}
        </div>

        <button
          type="button"
          @click="resetGame"
          class="rounded-lg px-3 py-2 text-[var(--theme-text)] transition hover:bg-[#00000010] hover:text-[var(--theme-text-focus)] focus:bg-[#00000010] focus:text-[var(--theme-text-focus)] focus:outline-none"
          aria-label="Restart session"
          title="Restart session"
        >
          <RefreshCcw class="h-8 w-8" />
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref } from "vue";
import { RefreshCcw } from "lucide-vue-next";
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
const misses = ref(0);
const isRunning = ref(false);
const isFinished = ref(false);
const timerId = ref<number | null>(null);
const sessionStartTime = ref<number | null>(null);
const elapsedTime = ref(0);

let nextTargetId = 1;

const statusLabel = computed(() => {
  if (mode.value === "time") {
    return isRunning.value ? `Time ${timeRemaining.value}s` : `Time ${timeDuration.value}s`;
  }

  return `Targets ${hits.value} / ${targetCount.value}`;
});

const finishAccuracy = computed(() => {
  const attempts = hits.value + misses.value;
  if (attempts === 0) {
    return 0;
  }

  return Math.round((hits.value / attempts) * 100);
});

const formattedElapsedTime = computed(() => `${elapsedTime.value.toFixed(1)}s`);

function getCellKey(row: number, col: number) {
  return `${row}-${col}`;
}

function randomCell(avoidTargets: GridTarget[]) {
  const occupiedCells = new Set(
    avoidTargets.map((target) => getCellKey(target.row, target.col)),
  );
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

function createTarget(avoidTargets: GridTarget[]): GridTarget {
  const cell = randomCell(avoidTargets);

  return {
    id: nextTargetId++,
    row: cell.row,
    col: cell.col,
  };
}

function spawnTargets() {
  const createdTargets: GridTarget[] = [];

  while (createdTargets.length < boardTargetCount) {
    createdTargets.push(createTarget(createdTargets));
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
  sessionStartTime.value = performance.now();

  if (mode.value === "time") {
    startTimer();
  }
}

function finishGame() {
  if (sessionStartTime.value !== null) {
    const rawElapsed = (performance.now() - sessionStartTime.value) / 1000;
    elapsedTime.value = mode.value === "time" ? timeDuration.value : rawElapsed;
  } else {
    elapsedTime.value = mode.value === "time" ? timeDuration.value : 0;
  }

  isRunning.value = false;
  isFinished.value = true;
  stopTimer();
}

function resetGame() {
  stopTimer();
  hits.value = 0;
  misses.value = 0;
  nextTargetId = 1;
  isRunning.value = false;
  isFinished.value = false;
  timeRemaining.value = timeDuration.value;
  sessionStartTime.value = null;
  elapsedTime.value = 0;
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
  const newTarget = createTarget(targets.value);
  targets.value = targets.value.map((target) =>
    target.id === id ? newTarget : target,
  );

  if (mode.value === "target" && hits.value >= targetCount.value) {
    finishGame();
  }
}

function handleMiss() {
  if (isFinished.value) {
    return;
  }

  misses.value += 1;
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

.finish-panel {
  width: min(100%, 28rem);
  border-radius: 1.25rem;
  background: color-mix(in srgb, var(--theme-bg) 88%, black 12%);
  padding: 1.5rem;
  text-align: center;
  box-shadow: 0 20px 50px rgba(0, 0, 0, 0.25);
}

.finish-overlay {
  justify-content: flex-start;
  padding-top: 5.25rem;
  background: color-mix(in srgb, var(--theme-bg) 70%, transparent);
  backdrop-filter: blur(4px);
}

.finish-stat {
  display: flex;
  flex-direction: column;
  gap: 0.35rem;
  border-radius: 1rem;
  background: rgba(0, 0, 0, 0.08);
  padding: 0.9rem 1rem;
}

.finish-stat span {
  font-size: 0.72rem;
  font-weight: 700;
  letter-spacing: 0.18em;
  text-transform: uppercase;
  opacity: 0.8;
}

.finish-stat strong {
  font-size: 1.5rem;
  font-weight: 800;
  color: var(--theme-text-done);
}
</style>
