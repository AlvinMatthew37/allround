<template>
  <div class="page-shell">
    <h1 class="text-2xl font-bold mb-4 text-[var(--theme-title)]">
      CHIMP TEST
    </h1>

    <div class="body-row">
      <aside class="side-rail">
        <Toolbar
          :start-count="startCount"
          :lives-setting="livesSetting"
          @update:startCount="setStartCount"
          @update:livesSetting="setLivesSetting"
        />
      </aside>

      <div class="game-col">
        <div class="board-wrap relative w-full">
          <ChimpBoard
            :numbers="numbers"
            :state="state"
            :expected="expected"
            :wrong-cell="wrongCell"
            @pick="onPick"
          />

          <div v-if="state === 'idle'" class="board-overlay">
            <div class="board-panel">
              <p class="panel-title">chimp test</p>
              <p class="panel-text">
                Memorize the numbers, then click them in ascending order.
                Every cleared round adds one more number.
              </p>
              <button type="button" class="start-btn" @click="startGame()">
                Start
              </button>
            </div>
          </div>

          <ResultOverlay
            v-if="state === 'over'"
            :count="count"
            :rounds-completed="roundsCompleted"
            :start-count="startCount"
            :lives-setting="livesSetting"
          />
        </div>

        <LiveStats
          v-if="state === 'memorize' || state === 'recall' || state === 'locked'"
          :count="count"
          :lives="lives"
          :lives-setting="livesSetting"
        />

        <button
          @click="refresh()"
          class="px-4 py-2 text-[var(--theme-text)] hover:text-[var(--theme-text-focus)] hover:bg-[#00000010] focus:outline-none focus:text-[var(--theme-text-focus)] focus:bg-[#00000010] font-semibold rounded-lg transition mt-2"
          aria-label="Restart session"
          title="Restart session"
        >
          <RefreshCcw class="w-8 h-8" />
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from "vue";
import { RefreshCcw } from "lucide-vue-next";
import Toolbar from "../components/chimps/Toolbar.vue";
import ChimpBoard from "../components/chimps/ChimpBoard.vue";
import LiveStats from "../components/chimps/LiveStats.vue";
import ResultOverlay from "../components/chimps/ResultOverlay.vue";

const GRID_CELLS = 40;

type ChimpState = "idle" | "memorize" | "recall" | "locked" | "over";
type ChimpNumber = { cell: number; value: number };

const state = ref<ChimpState>("idle");
const startCount = ref(4);
const livesSetting = ref(3);

const count = ref(4);
const lives = ref(3);
const expected = ref(1);
const numbers = ref<ChimpNumber[]>([]);
const roundsCompleted = ref(0);
const wrongCell = ref<number | null>(null);

let transitionTimeout: number | null = null;
let wrongTimeout: number | null = null;

function placeNumbers() {
  const indices = Array.from({ length: GRID_CELLS }, (_, i) => i);
  for (let i = indices.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [indices[i], indices[j]] = [indices[j]!, indices[i]!];
  }
  const chosen = indices.slice(0, count.value).sort((a, b) => a - b);
  numbers.value = chosen.map((cell, i) => ({ cell, value: i + 1 }));
}

function clearTimers() {
  if (transitionTimeout) {
    clearTimeout(transitionTimeout);
    transitionTimeout = null;
  }
  if (wrongTimeout) {
    clearTimeout(wrongTimeout);
    wrongTimeout = null;
  }
  wrongCell.value = null;
}

function startGame() {
  clearTimers();
  count.value = startCount.value;
  lives.value = livesSetting.value;
  roundsCompleted.value = 0;
  expected.value = 1;
  placeNumbers();
  state.value = "memorize";
}

function refresh() {
  clearTimers();
  state.value = "idle";
}

function miss(cell: number) {
  lives.value -= 1;
  wrongCell.value = cell;
  if (wrongTimeout) clearTimeout(wrongTimeout);
  wrongTimeout = window.setTimeout(() => {
    wrongCell.value = null;
  }, 450);

  if (lives.value <= 0) {
    state.value = "over";
    return;
  }

  // restart the round at the same count with new positions
  state.value = "locked";
  if (transitionTimeout) clearTimeout(transitionTimeout);
  transitionTimeout = window.setTimeout(() => {
    expected.value = 1;
    placeNumbers();
    state.value = "memorize";
  }, 700);
}

function roundComplete() {
  state.value = "locked";
  if (transitionTimeout) clearTimeout(transitionTimeout);
  transitionTimeout = window.setTimeout(() => {
    count.value += 1;
    roundsCompleted.value += 1;
    expected.value = 1;
    placeNumbers();
    state.value = "memorize";
  }, 700);
}

function onPick(cell: number) {
  if (state.value !== "memorize" && state.value !== "recall") return;

  const hit = numbers.value.find((n) => n.cell === cell);

  if (state.value === "memorize") {
    // the first click must be number 1; clicking it hides the rest
    if (hit && hit.value === 1) {
      expected.value = 2;
      state.value = "recall";
    } else {
      miss(cell);
    }
    return;
  }

  if (hit && hit.value === expected.value) {
    expected.value += 1;
    if (expected.value > count.value) {
      roundComplete();
    }
  } else {
    miss(cell);
  }
}

function setStartCount(value: number) {
  startCount.value = value;
  localStorage.setItem("chimps-start-count", value.toString());
  refresh();
}

function setLivesSetting(value: number) {
  livesSetting.value = value;
  localStorage.setItem("chimps-lives", value.toString());
  refresh();
}

onMounted(() => {
  const savedStart = localStorage.getItem("chimps-start-count");
  if (savedStart) {
    const parsed = Number.parseInt(savedStart, 10);
    if (!Number.isNaN(parsed)) startCount.value = parsed;
  }

  const savedLives = localStorage.getItem("chimps-lives");
  if (savedLives) {
    const parsed = Number.parseInt(savedLives, 10);
    if (!Number.isNaN(parsed)) livesSetting.value = parsed;
  }
});

onUnmounted(() => {
  clearTimers();
});
</script>

<style scoped>
.page-shell {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 1.5rem 1rem;
  min-height: 100%;
  width: 100%;
  /* same centered content width as the other game pages so the sidebar
     rail sits at the same x on all of them */
  max-width: calc(80rem + 2rem);
  margin: 0 auto;
}

@media (min-width: 640px) {
  .page-shell {
    padding-left: 1.5rem;
    padding-right: 1.5rem;
    max-width: calc(80rem + 3rem);
  }
}

.body-row {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
  width: 100%;
}

.game-col {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  min-width: 0;
}

@media (min-width: 1024px) {
  /* sidebar | content | equal spacer — the empty right column
     counterweights the rail so the content centers on the page axis;
     flex: 1 fills the height below the title so the game block
     sits vertically centered in the remaining space */
  .page-shell {
    padding-left: 2rem;
    padding-right: 2rem;
    max-width: calc(80rem + 4rem);
  }

  .body-row {
    flex: 1;
    display: grid;
    grid-template-columns: 4rem minmax(0, 1fr) 4rem;
    gap: 2rem;
    align-items: stretch;
  }

  .side-rail {
    width: 4rem;
    /* top-leaning like the other games' rails */
    margin-top: 3rem;
  }

  .board-wrap {
    /* keep the board off the very top of the column */
    margin-top: 2.5rem;
  }

  .game-col > button {
    /* pin the refresh to the bottom of the column */
    margin-top: auto;
  }
}

.board-overlay {
  position: absolute;
  inset: 0;
  z-index: 10;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1rem;
  background: color-mix(in srgb, var(--theme-bg) 70%, transparent);
  backdrop-filter: blur(4px);
  border-radius: 0.5rem;
}

.board-panel {
  width: min(100%, 26rem);
  border-radius: 1.25rem;
  background: color-mix(in srgb, var(--theme-bg) 88%, black 12%);
  padding: 1.75rem 1.5rem;
  text-align: center;
  box-shadow: 0 20px 50px rgba(0, 0, 0, 0.25);
}

.panel-title {
  font-size: 0.72rem;
  font-weight: 700;
  letter-spacing: 0.18em;
  line-height: 1.2;
  margin-bottom: 0.9rem;
  text-transform: uppercase;
  color: var(--theme-text-done);
}

.panel-text {
  font-size: 0.95rem;
  line-height: 1.55;
  color: var(--theme-text);
  margin-bottom: 1.25rem;
}

.start-btn {
  padding: 0.5rem 2.25rem;
  border: 1px solid color-mix(in srgb, var(--theme-text) 35%, transparent);
  border-radius: 9999px;
  background: transparent;
  color: var(--theme-text);
  font-weight: 600;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  transition: color 0.2s, border-color 0.2s;
}

.start-btn:hover {
  color: var(--theme-text-focus);
  border-color: var(--theme-text-focus);
}
</style>
