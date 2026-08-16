<template>
  <div class="p-6 flex flex-col items-center">
    <div class="theme-select hidden"></div>
    <h1 class="text-2xl font-bold mb-4 text-[var(--theme-title)]">
      MONKEYTYPE
    </h1>

    <Toolbar
      :mode="mode"
      :word-count="wordCount"
      :time-duration="timeDuration"
      @update:mode="setMode"
      @update:wordCount="setWordCount"
      @update:timeDuration="setTimeDuration"
    />

    <GameContainer
      ref="gameContainerRef"
      :test-words="testWords"
      :curr-word-index="currWordIndex"
      :curr-letter-index="currLetterIndex"
      :is-finished="isFinished"
      :caret-style="caretStyle"
    >
      <template #overlay>
        <ResultOverlay
          v-if="isFinished"
          :wpm="wpm"
          :accuracy="accuracy"
          :cl="CL"
          :tl="TL"
          :cw="CW"
          :time-taken="timeTaken"
        />
      </template>
    </GameContainer>

    <LiveStats
      v-if="startTime && !isFinished"
      :mode="mode"
      :wpm="wpm"
      :curr-word-index="currWordIndex"
      :word-count="wordCount"
      :time-remaining="timeRemaining"
    />

    <button
      @click="refresh()"
      class="px-4 py-2 text-[var(--theme-text)] hover:text-[var(--theme-text-focus)] hover:bg-[#00000010] focus:outline-none focus:text-[var(--theme-text-focus)] focus:bg-[#00000010] font-semibold rounded-lg transition mt-2"
    >
      <RefreshCcw class="w-8 h-8" />
    </button>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, nextTick } from "vue";
import { RefreshCcw } from "lucide-vue-next";
import Toolbar from "../components/projects/monkeytype/Toolbar.vue";
import GameContainer from "../components/projects/monkeytype/GameContainer.vue";
import LiveStats from "../components/projects/monkeytype/LiveStats.vue";
import ResultOverlay from "../components/projects/monkeytype/ResultOverlay.vue";

type Letter = { char: string; correct: boolean | null };
type WordObject = { word: string; letters: Letter[]; correct: boolean | null };

const wordBank = ref<string[]>([]);
const testWords = ref<WordObject[]>([]);
const currWordIndex = ref(0);
const currLetterIndex = ref(0);
const accuracy = ref(0);
const TL = ref(0);
const CL = ref(0);
const CW = ref(0);
const mode = ref<"time" | "words">("words");
const wordCount = ref(10);
const timeDuration = ref(30);
const timeRemaining = ref(30);
const isFinished = ref(false);
const startTime = ref<number | null>(null);
const wpm = ref(0);
const timerInterval = ref<number | null>(null);
const countdownInterval = ref<number | null>(null);
const timeTaken = ref(0);
const caretStyle = ref<"line" | "block">("block");

const gameContainerRef = ref<InstanceType<typeof GameContainer> | null>(null);

async function fetchWordBank() {
  const res = await fetch("https://raw.githubusercontent.com/monkeytypegame/monkeytype/master/frontend/static/languages/english.json");
  if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
  const data = await res.json();
  wordBank.value = data.words || data;
}

function generateTestWords(count = 10) {
  if (wordBank.value.length === 0) return [];
  const wordsToGenerate = mode.value === "time" ? 500 : count;
  return Array.from({ length: wordsToGenerate }, () => {
    const word =
      wordBank.value[Math.floor(Math.random() * wordBank.value.length)]!;
    return {
      word,
      letters: word.split("").map((char) => ({ char, correct: null })),
      correct: null,
    };
  });
}

function refresh() {
  testWords.value = generateTestWords(wordCount.value);
  CL.value = 0;
  TL.value = 0;
  CW.value = 0;
  accuracy.value = 0;
  currWordIndex.value = 0;
  currLetterIndex.value = 0;
  isFinished.value = false;
  startTime.value = null;
  wpm.value = 0;
  timeRemaining.value = timeDuration.value;
  stopTimer();
  stopCountdown();

  nextTick(() => {
    gameContainerRef.value?.resetView();
  });
}

function setMode(newMode: "time" | "words") {
  mode.value = newMode;
  localStorage.setItem("monkeytype-mode", newMode);
  refresh();
}

function setWordCount(count: number) {
  wordCount.value = count;
  localStorage.setItem("monkeytype-word-count", count.toString());
  refresh();
}

function setTimeDuration(duration: number) {
  timeDuration.value = duration;
  timeRemaining.value = duration;
  localStorage.setItem("monkeytype-time-duration", duration.toString());
  refresh();
}

function startTimer() {
  if (timerInterval.value) return;
  timerInterval.value = window.setInterval(() => {
    if (startTime.value) {
      const durationInMinutes = (Date.now() - startTime.value) / 60000;
      if (durationInMinutes > 0) {
        wpm.value = Math.round(CL.value / 5 / durationInMinutes);
      }
    }
  }, 1000);
}

function stopTimer() {
  if (timerInterval.value) {
    clearInterval(timerInterval.value);
    timerInterval.value = null;
  }
}

function startCountdown() {
  if (countdownInterval.value) return;
  countdownInterval.value = window.setInterval(() => {
    timeRemaining.value--;
    if (timeRemaining.value <= 0) {
      finishTest();
    }
  }, 1000);
}

function stopCountdown() {
  if (countdownInterval.value) {
    clearInterval(countdownInterval.value);
    countdownInterval.value = null;
  }
}

function finishTest() {
  accuracy.value = Math.floor((CL.value / TL.value) * 100);
  if (startTime.value) {
    timeTaken.value = (Date.now() - startTime.value) / 1000;
    const durationInMinutes = (Date.now() - startTime.value) / 60000;
    if (durationInMinutes > 0) {
      wpm.value = Math.round(CL.value / 5 / durationInMinutes);
    }
  }
  isFinished.value = true;
  stopTimer();
  stopCountdown();
}

function handleKeydown(e: KeyboardEvent) {
  if (e.ctrlKey || e.altKey || e.metaKey) return;
  if (isFinished.value) return;

  const currentWord = testWords.value[currWordIndex.value];
  if (!currentWord) return;

  if (
    startTime.value === null &&
    e.key.length === 1 &&
    !e.ctrlKey &&
    !e.altKey &&
    !e.metaKey
  ) {
    startTime.value = Date.now();
    startTimer();
    if (mode.value === "time") {
      startCountdown();
    }
  }

  if (e.key === "Backspace") {
    if (currLetterIndex.value > 0) {
      currLetterIndex.value--;
      const letter = currentWord.letters[currLetterIndex.value];
      if (letter) {
        if (letter.correct) {
          CL.value--;
        }
        letter.correct = null;
      }
    } else if (currWordIndex.value > 0) {
      currWordIndex.value--;
      const prevWord = testWords.value[currWordIndex.value];
      if (prevWord) {
        if (prevWord.correct) {
          CW.value--;
        }
        const finishedWord = prevWord.letters.findIndex((l) => l.correct === null);
        if (finishedWord == -1) {
          currLetterIndex.value = prevWord.letters.length;
        } else {
          currLetterIndex.value = finishedWord;
        }
      }

      nextTick(() => {
        gameContainerRef.value?.scrollToWord(currWordIndex.value, "backspace");
      });
    }

    return;
  }

  if (e.key === " ") {
    e.preventDefault();
    if (currWordIndex.value < testWords.value.length - 1) {
      currentWord.correct = currentWord.letters.every((l) => l.correct);
      if (currentWord.correct) {
        CW.value++;
      }
      CL.value++;
      TL.value++;
      currWordIndex.value++;
      currLetterIndex.value = 0;

      nextTick(() => {
        gameContainerRef.value?.scrollToWord(currWordIndex.value, "advance");
      });
    }
    return;
  }

  if (e.key.length === 1) {
    if (currLetterIndex.value < currentWord.letters.length) {
      TL.value++;
      const currentLetter = currentWord.letters[currLetterIndex.value];
      if (currentLetter) {
        currentLetter.correct = e.key === currentLetter.char;
        if (currentLetter.correct) {
          CL.value++;
        } else {
          currentWord.correct = false;
        }
      }
      currLetterIndex.value++;
      if (
        mode.value === "words" &&
        currLetterIndex.value == currentWord.letters.length &&
        currWordIndex.value == testWords.value.length - 1
      ) {
        currentWord.correct = currentWord.letters.every((l) => l.correct);
        if (currentWord.correct) {
          CW.value++;
        }
        finishTest();
      }
    }
  }
}

onMounted(async () => {
  await fetchWordBank();

  const savedMode = localStorage.getItem("monkeytype-mode");
  if (savedMode === "time" || savedMode === "words") {
    mode.value = savedMode;
  }

  const savedCount = localStorage.getItem("monkeytype-word-count");
  if (savedCount) {
    const count = parseInt(savedCount, 10);
    if (!isNaN(count)) {
      wordCount.value = count;
    }
  }

  const savedDuration = localStorage.getItem("monkeytype-time-duration");
  if (savedDuration) {
    const duration = parseInt(savedDuration, 10);
    if (!isNaN(duration)) {
      timeDuration.value = duration;
      timeRemaining.value = duration;
    }
  }

  refresh();
  window.addEventListener("keydown", handleKeydown);
});

onUnmounted(() => {
  window.removeEventListener("keydown", handleKeydown);
  stopTimer();
  stopCountdown();
});
</script>

<style scoped>
p {
  word-wrap: break-word;
  user-select: none;
  color: var(--theme-text);
}

.theme-select button {
  padding: 0 0.5rem;
  margin: 0 0.5rem;
  border-radius: 0.25rem;
}
</style>
