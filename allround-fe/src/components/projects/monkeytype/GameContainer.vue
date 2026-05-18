<template>
  <div class="game-container relative">
    <div
      ref="textboxRef"
      tabindex="0"
      class="textbox tracking-tighter transition-all duration-300"
      :class="{ 'blur-xs': isFinished }"
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
          class="p-0.75 relative z-0"
          :class="{
            'text-[var(--theme-text-done)]': letter.correct === true,
            'text-[var(--theme-text-error)]': letter.correct === false,
            'active-letter':
              wIndex === currWordIndex && lIndex === currLetterIndex,
          }
          "
        >
          <span
            v-if="
              wIndex === currWordIndex &&
              lIndex === currLetterIndex &&
              !isFinished
            "
            :class="caretStyle === 'block' ? 'caret-block' : 'caret'"
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
          :class="caretStyle === 'block' ? 'caret-end-block' : 'caret-end'"
        ></span>
      </span>
    </div>

    <slot name="overlay"></slot>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';

type Letter = { char: string; correct: boolean | null };
type WordObject = { word: string; letters: Letter[]; correct: boolean | null };

defineProps<{
  testWords: WordObject[];
  currWordIndex: number;
  currLetterIndex: number;
  isFinished: boolean;
  caretStyle: 'line' | 'block';
}>();

const textboxRef = ref<HTMLElement | null>(null);
const wordRefs = ref<HTMLElement[]>([]);

defineExpose({
  textboxRef,
  wordRefs,
});
</script>

<style scoped>
.game-container {
  min-width: 90%;
  max-width: 95%;
  height: fit-content;
  margin: 1rem auto;
  margin-bottom: 0.5rem;
  display: grid;
  grid-template-areas: "stack";
}

@media (min-width: 640px) {
  .game-container {
    min-width: 70%;
    max-width: 85%;
  }
}

@media (min-width: 1024px) {
  .game-container {
    min-width: 50%;
    max-width: 80%;
  }
}

.textbox {
  grid-area: stack;
  font-size: 1rem;
  line-height: 1.75rem;
  height: 8rem;
  overflow: hidden;
  margin: 2rem 0;
  display: flex;
  flex-wrap: wrap;
  align-content: flex-start;
  column-gap: 0.5rem;
  width: 100%;
  color: var(--theme-text);
  outline: none;
}

@media (min-width: 640px) {
  .textbox {
    font-size: 1.25rem;
    line-height: 2rem;
    height: 10rem;
    margin: 2.5rem 0;
  }
}

@media (min-width: 1024px) {
  .textbox {
    font-size: 1.5rem;
    line-height: 2.5rem;
    height: 12rem;
    margin: 3rem 0;
  }
}

.caret {
  position: absolute;
  left: 0.1rem;
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

.caret-block {
  position: absolute;
  inset: 0;
  background-color: var(--block);
  opacity: 0.5;
  animation: blink 1s infinite;
  z-index: -1;
  border-radius: 2px;
  pointer-events: none;
}

.caret-end-block {
  position: absolute;
  left: 100%;
  top: 0;
  width: 1ch;
  height: 100%;
  background-color: var(--block);
  opacity: 0.5;
  animation: blink 1s infinite;
  border-radius: 2px;
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
