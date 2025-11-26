<template>
  <div class="p-6 flex flex-col items-center">
    <div class="theme-select hidden"></div>
    <h1 class="text-2xl font-bold mb-4 text-[var(--theme-title)]">
      MONKEYTYPE
    </h1>
    <div class="toolbar">
      <div class="mods">
        <button>time</button>
        <button>words</button>
      </div>
      <div class="h-6 w-1 rounded-lg bg-[#00000010] my-2"></div>

      <div class="mods">
        <button
          @click="setWordCount(10)"
          :class="{ 'text-[var(--theme-text-done)]': wordCount === 10 }"
        >
          10
        </button>
        <button
          @click="setWordCount(25)"
          :class="{ 'text-[var(--theme-text-done)]': wordCount === 25 }"
        >
          25
        </button>
        <button
          @click="setWordCount(50)"
          :class="{ 'text-[var(--theme-text-done)]': wordCount === 50 }"
        >
          50
        </button>
        <button
          @click="setWordCount(100)"
          :class="{ 'text-[var(--theme-text-done)]': wordCount === 100 }"
        >
          100
        </button>
      </div>
    </div>

    <div class="game-container relative">
      <div
        ref="textboxRef"
        tabindex="0"
        class="textbox tracking-tighter transition-all duration-300"
        :class="{ 'blur-md': isFinished }"
      >
        <span
          v-for="(word, wIndex) in testWords"
          :key="wIndex"
          :ref="(el) => { if (el) wordRefs[wIndex] = el as HTMLElement }"
          class="flex mx-1 relative"
        >
          <span
            v-for="(letter, lIndex) in word.letters"
            :key="lIndex"
            class="whitespace-pre relative"
            :class="{
              'text-[var(--theme-text-done)]': letter.correct === true,
              'text-[var(--theme-text-error)]': letter.correct === false,
              'active-letter':
                wIndex === currWordIndex && lIndex === currLetterIndex,
            }"
          >
            <span
              v-if="
                wIndex === currWordIndex &&
                lIndex === currLetterIndex &&
                !isFinished
              "
              class="caret"
            ></span>
            {{ letter.char }}
          </span>
          <!-- Caret at the end of the word -->
          <span
            v-if="
              wIndex === currWordIndex &&
              currLetterIndex === word.letters.length &&
              !isFinished
            "
            class="caret-end"
          ></span>
        </span>
      </div>

      <!-- Result Overlay -->
      <div
        v-if="isFinished"
        class="absolute inset-0 flex flex-col items-center justify-center z-10 rounded-lg"
      >
        <div class="text-[var(--theme-text)] text-4xl font-bold mb-2">WPM</div>
        <div class="text-[var(--theme-title)] text-6xl font-bold mb-4">
          {{ wpm }}
        </div>
        <div class="text-[var(--theme-text)] text-2xl font-bold mb-2">
          Accuracy
        </div>
        <div class="text-[var(--theme-title)] text-4xl font-bold">
          {{ accuracy }}%
        </div>
        <div class="mt-4 text-[var(--theme-text)]">
          {{ CL }}/{{ TL }} letters
        </div>
        <div class="text-[var(--theme-text)]">{{ CW }} words</div>
        <div class="text-[var(--theme-text)]">{{ timeTaken }} seconds</div>
      </div>
    </div>

    <div
      v-if="startTime && !isFinished"
      class="flex gap-8 text-xl font-bold text-[var(--theme-title)] mt-4 justify-center items-end"
    >
      <div class="liveStat">{{ wpm }}</div>
      <div class="text-2xl mb-2">{{ currWordIndex }}/{{ wordCount }}</div>
    </div>

    <button
      @click="refresh(wordCount)"
      class="px-4 py-2 text-[var(--theme-text)] hover:text-[var(--theme-title)] hover:bg-[#00000010] focus:outline-none focus:text-[var(--theme-title)] focus:bg-[#00000010] font-semibold rounded-lg transition mt-2"
    >
      <RefreshCcw class="w-8 h-8" />
    </button>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, nextTick } from "vue";
import { RefreshCcw } from "lucide-vue-next";

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
const wordCount = ref(10);
const isFinished = ref(false);
const startTime = ref<number | null>(null);
const wpm = ref(0);
const timerInterval = ref<number | null>(null);
const wordRefs = ref<HTMLElement[]>([]);
const textboxRef = ref<HTMLElement | null>(null);
const timeTaken = ref(0);

// ✅ Fetch word bank
async function fetchWordBank() {
  const res = await fetch("/monkeytype/languages/english.json");
  if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
  const data = await res.json();
  wordBank.value = data.words || data;
}

// Generate word list
function generateTestWords(count = 10) {
  if (wordBank.value.length === 0) return [];
  return Array.from({ length: count }, () => {
    const word =
      wordBank.value[Math.floor(Math.random() * wordBank.value.length)];
    return {
      word,
      letters: word.split("").map((char) => ({ char, correct: null })),
    };
  });
}

// Refresh handler
function refresh(count = 10) {
  testWords.value = generateTestWords(count);
  CL.value = 0;
  TL.value = 0;
  CW.value = 0;
  accuracy.value = 0;
  currWordIndex.value = 0;
  currLetterIndex.value = 0;
  isFinished.value = false;
  startTime.value = null;
  wpm.value = 0;
  wordRefs.value = [];
  stopTimer();
  if (textboxRef.value) {
    textboxRef.value.scrollTop = 0;
    nextTick(() => {
      textboxRef.value?.focus();
    });
  }
  console.log("New test words:", testWords.value);
}

function setWordCount(count: number) {
  wordCount.value = count;
  localStorage.setItem("monkeytype-word-count", count.toString());
  refresh(count);
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

// Typing Handler
function handleKeydown(e: KeyboardEvent) {
  // Ignore modifiers
  if (e.ctrlKey || e.altKey || e.metaKey) return;
  if (isFinished.value) return;

  const currentWord = testWords.value[currWordIndex.value];
  if (!currentWord) return;

  // Start timer on first valid keypress
  if (
    startTime.value === null &&
    e.key.length === 1 &&
    !e.ctrlKey &&
    !e.altKey &&
    !e.metaKey
  ) {
    startTime.value = Date.now();
    startTimer();
  }

  // Backspace
  if (e.key === "Backspace") {
    if (currLetterIndex.value > 0) {
      currLetterIndex.value--;
      if (currentWord.letters[currLetterIndex.value].correct) {
        CL.value--;
      }
      currentWord.letters[currLetterIndex.value].correct = null;
    } else if (currWordIndex.value > 0) {
      // Go back to previous word
      currWordIndex.value--;
      const prevWord = testWords.value[currWordIndex.value];
      if (prevWord.correct) {
        CW.value--;
      }
      const finishedWord = prevWord.letters.findIndex(
        (l) => l.correct === null
      );
      console.log(finishedWord);
      if (finishedWord == -1) {
        currLetterIndex.value =
          testWords.value[currWordIndex.value].letters.length;
      } else {
        currLetterIndex.value = finishedWord;
      }

      // Check for scrolling back up (optional, but good for UX)
      nextTick(() => {
        const wordEl = wordRefs.value[currWordIndex.value];
        const box = textboxRef.value;
        if (wordEl && box) {
          const wordTop = wordEl.offsetTop - box.offsetTop;
          if (wordTop < box.scrollTop) {
            wordEl.scrollIntoView({ block: "center", behavior: "smooth" });
          }
        }
      });
    }

    return;
  }

  // Space (Next Word)
  if (e.key === " ") {
    e.preventDefault(); // Prevent scrolling
    if (currWordIndex.value < testWords.value.length - 1) {
      currentWord.correct = currentWord.letters.every((l) => l.correct);
      if (currentWord.correct) {
        CW.value++;
      }
      CL.value++;
      TL.value++;
      currWordIndex.value++;
      currLetterIndex.value = 0;

      // Scroll Logic
      nextTick(() => {
        const wordEl = wordRefs.value[currWordIndex.value];
        const box = textboxRef.value;
        if (wordEl && box) {
          const wordTop = wordEl.offsetTop - box.offsetTop;
          const style = window.getComputedStyle(box);
          const lineHeight = parseFloat(style.lineHeight);

          // Scroll if we are on the 3rd line (>= 2 * lineHeight)
          if (wordTop - box.scrollTop >= 2 * lineHeight) {
            box.scrollTop += lineHeight;
          }
        }
      });
    }
    return;
  }

  // Character input
  if (e.key.length === 1) {
    if (currLetterIndex.value < currentWord.letters.length) {
      TL.value++;
      const currentLetter = currentWord.letters[currLetterIndex.value];
      currentLetter.correct = e.key === currentLetter.char;
      if (currentLetter?.correct) {
        CL.value++;
      } else {
        currentWord.correct = false;
      }
      currLetterIndex.value++;
      console.log(currentWord.letters[currLetterIndex.value]);
      if (
        currLetterIndex.value == currentWord.letters.length &&
        currWordIndex.value == testWords.value.length - 1
      ) {
        currentWord.correct = currentWord.letters.every((l) => l.correct);
        if (currentWord.correct) {
          CW.value++;
        }
        accuracy.value = Math.floor((CL.value / TL.value) * 100);
        timeTaken.value = (Date.now() - startTime.value) / 1000;
        // Calculate WPM one last time
        if (startTime.value) {
          const durationInMinutes = (Date.now() - startTime.value) / 60000;

          if (durationInMinutes > 0) {
            wpm.value = Math.round(CL.value / 5 / durationInMinutes);
          }
        }

        isFinished.value = true;

        stopTimer();
        console.log("finish");
      }
    } else {
      // Extra characters (optional: handle overtyping)
    }
  }
}

// ✅ Lifecycle
onMounted(async () => {
  await fetchWordBank();

  const savedCount = localStorage.getItem("monkeytype-word-count");
  if (savedCount) {
    const count = parseInt(savedCount, 10);
    if (!isNaN(count)) {
      wordCount.value = count;
    }
  }

  refresh(wordCount.value);
  window.addEventListener("keydown", handleKeydown);
});

onUnmounted(() => {
  window.removeEventListener("keydown", handleKeydown);
  stopTimer();
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

.toolbar {
  background-color: #00000007;
  width: fit-content;
  padding: 0 1rem;
  border-radius: 0.5rem;
  display: flex;
  justify-content: center;
  align-items: center;
  margin: auto;
  gap: 1rem; /* equivalent to gap-4 */
}

.toolbar:hover {
  background-color: #00000010;
  transition: background-color 0.3s ease;
}

.mods {
  color: var(--theme-text);
  font-size: medium;
  font-weight: 600;
  display: flex;
  gap: 0.25rem;
}

.mods button {
  padding: 0 0.25rem;
  height: fit-content;
}

.mods button:hover {
  color: var(--theme-text-done);
  border-radius: 0.25rem;
  display: flex;
  align-items: center;
  transition: all 0.3s ease;
}

.game-container {
  min-width: 50%;
  max-width: 80%;
  height: fit-content;
  margin: 1rem auto;
  margin-bottom: 0.5rem;
}

.textbox {
  font-size: 1.5rem;
  line-height: 2.5rem; /* ✅ Explicit line height */
  height: 10rem; /* ✅ 4 lines * 3rem */
  overflow: hidden; /* ✅ Hide overflow */
  margin: 3rem 0;
  display: flex;
  flex-wrap: wrap;
  align-content: flex-start; /* ✅ critical */
  column-gap: 0.5rem;
  width: 100%;
  color: var(--theme-text);
  outline: none; /* Remove focus outline if any */
}

.liveStat {
  font-size: 8rem;
  font-weight: 500;
  color: var(--theme-text);
  line-height: 1;
}

.caret {
  position: absolute;
  left: 5px;
  top: 5%;
  width: 2px;
  height: 90%;
  background-color: var(--theme-text-done);
  animation: blink 1s infinite;
}

.caret-end {
  position: absolute;
  right: -5px;
  top: 5%;
  width: 2px;
  height: 90%;
  background-color: var(--theme-text-done);
  animation: blink 1s infinite;
}

@keyframes blink {
  0%,
  100% {
    opacity: 1;
  }
  50% {
    opacity: 0;
  }
}
</style>
