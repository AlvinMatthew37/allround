<template>
  <div class="page-shell">
    <h1 class="text-2xl font-bold mb-4 text-[var(--theme-title)]">
      QUICK MATHS
    </h1>

    <div class="body-row">
      <aside class="side-rail">
        <Toolbar
          :mode="mode"
          :time-duration="timeDuration"
          :problem-count="problemCount"
          @update:mode="setMode"
          @update:timeDuration="setTimeDuration"
          @update:problemCount="setProblemCount"
        />
      </aside>

      <div class="game-col">
        <div class="stack-wrap relative w-full">
          <QuestionStack
            :questions="questions"
            :active-index="activeIndex"
            :buffer="buffer"
            :wrong-flash="wrongFlash"
          />

          <ResultOverlay
            v-if="isFinished"
            :solved="solved"
            :misses="misses"
            :time-taken="timeTaken"
          />
        </div>

        <LiveStats
          v-if="startTime && !isFinished"
          :mode="mode"
          :solved="solved"
          :problem-count="problemCount"
          :time-remaining="timeRemaining"
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
import Toolbar from "../components/maths/Toolbar.vue";
import QuestionStack, {
  type MathsQuestion,
} from "../components/maths/QuestionStack.vue";
import LiveStats from "../components/maths/LiveStats.vue";
import ResultOverlay from "../components/maths/ResultOverlay.vue";

const mode = ref<"time" | "problems">("time");
const timeDuration = ref(60);
const problemCount = ref(25);

const questions = ref<MathsQuestion[]>([]);
const activeIndex = ref(0);
const buffer = ref("");
const wrongFlash = ref(false);

const solved = ref(0);
const misses = ref(0);
const startTime = ref<number | null>(null);
const timeRemaining = ref(60);
const timeTaken = ref(0);
const isFinished = ref(false);
const timerInterval = ref<number | null>(null);

let nextQuestionId = 1;
let wrongFlashTimeout: number | null = null;

function generateQuestion(): MathsQuestion {
  const op: "+" | "-" = Math.random() < 0.5 ? "+" : "-";
  let a = 10 + Math.floor(Math.random() * 90);
  let b = 10 + Math.floor(Math.random() * 90);
  if (op === "-" && a < b) {
    [a, b] = [b, a];
  }

  return {
    id: nextQuestionId++,
    a,
    b,
    op,
    answer: op === "+" ? a + b : a - b,
    given: null,
  };
}

function refresh() {
  questions.value = [generateQuestion(), generateQuestion(), generateQuestion()];
  activeIndex.value = 0;
  buffer.value = "";
  solved.value = 0;
  misses.value = 0;
  startTime.value = null;
  timeRemaining.value = timeDuration.value;
  timeTaken.value = 0;
  isFinished.value = false;
  stopTimer();
  clearWrongFlash();
}

function startTimer() {
  if (timerInterval.value) return;
  timerInterval.value = window.setInterval(() => {
    if (mode.value !== "time" || !startTime.value) return;
    timeRemaining.value -= 1;
    if (timeRemaining.value <= 0) {
      timeRemaining.value = 0;
      finish();
    }
  }, 1000);
}

function stopTimer() {
  if (timerInterval.value) {
    clearInterval(timerInterval.value);
    timerInterval.value = null;
  }
}

function finish() {
  if (startTime.value) {
    timeTaken.value = (Date.now() - startTime.value) / 1000;
  }
  isFinished.value = true;
  stopTimer();
}

function clearWrongFlash() {
  if (wrongFlashTimeout) {
    clearTimeout(wrongFlashTimeout);
    wrongFlashTimeout = null;
  }
  wrongFlash.value = false;
}

function submitAnswer() {
  if (buffer.value === "") return;

  const current = questions.value[activeIndex.value];
  if (!current) return;
  const given = Number.parseInt(buffer.value, 10);

  if (given === current.answer) {
    current.given = given;
    solved.value += 1;
    activeIndex.value += 1;
    questions.value.push(generateQuestion());
    buffer.value = "";

    if (mode.value === "problems" && solved.value >= problemCount.value) {
      finish();
    }
  } else {
    misses.value += 1;
    wrongFlash.value = true;
    if (wrongFlashTimeout) clearTimeout(wrongFlashTimeout);
    wrongFlashTimeout = window.setTimeout(() => {
      wrongFlash.value = false;
    }, 400);
    buffer.value = "";
  }
}

function handleKeydown(e: KeyboardEvent) {
  if (e.ctrlKey || e.altKey || e.metaKey) return;
  if (isFinished.value) return;

  if (startTime.value === null && e.key.length === 1) {
    startTime.value = Date.now();
    startTimer();
  }

  if (e.key === "Backspace") {
    buffer.value = buffer.value.slice(0, -1);
    return;
  }

  if (e.key === "Enter" || e.key === " ") {
    e.preventDefault();
    submitAnswer();
    return;
  }

  if (/^[0-9]$/.test(e.key) && buffer.value.length < 3) {
    // no leading zeros
    if (buffer.value === "" && e.key === "0") return;
    buffer.value += e.key;
  }
}

function setMode(newMode: "time" | "problems") {
  mode.value = newMode;
  localStorage.setItem("quickmaths-mode", newMode);
  refresh();
}

function setTimeDuration(duration: number) {
  timeDuration.value = duration;
  timeRemaining.value = duration;
  localStorage.setItem("quickmaths-time-duration", duration.toString());
  refresh();
}

function setProblemCount(count: number) {
  problemCount.value = count;
  localStorage.setItem("quickmaths-problem-count", count.toString());
  refresh();
}

onMounted(() => {
  const savedMode = localStorage.getItem("quickmaths-mode");
  if (savedMode === "time" || savedMode === "problems") {
    mode.value = savedMode;
  }

  const savedDuration = localStorage.getItem("quickmaths-time-duration");
  if (savedDuration) {
    const parsed = Number.parseInt(savedDuration, 10);
    if (!Number.isNaN(parsed)) {
      timeDuration.value = parsed;
      timeRemaining.value = parsed;
    }
  }

  const savedCount = localStorage.getItem("quickmaths-problem-count");
  if (savedCount) {
    const parsed = Number.parseInt(savedCount, 10);
    if (!Number.isNaN(parsed)) {
      problemCount.value = parsed;
    }
  }

  refresh();
  window.addEventListener("keydown", handleKeydown);
});

onUnmounted(() => {
  window.removeEventListener("keydown", handleKeydown);
  stopTimer();
  clearWrongFlash();
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
    /* top-leaning like the Typewright rail */
    margin-top: 3rem;
  }

  .stack-wrap {
    /* keep the stack off the very top of the column */
    margin-top: 2.5rem;
  }

  .game-col > button {
    /* pin the refresh to the bottom of the column */
    margin-top: auto;
  }
}
</style>
