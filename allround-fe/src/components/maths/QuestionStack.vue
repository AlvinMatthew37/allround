<template>
  <div class="stack-viewport">
    <div
      class="strip"
      :style="{ transform: `translateY(calc(var(--row-h) * ${2 - activeIndex}))` }"
    >
      <div
        v-for="{ q, i } in visible"
        :key="q.id"
        class="row"
        :class="{
          done: i < activeIndex,
          active: i === activeIndex,
        }"
        :style="{ top: `calc(var(--row-h) * ${i})` }"
      >
        <span class="expr">{{ q.a }} {{ q.op }} {{ q.b }} =</span>

        <span v-if="i < activeIndex" class="answer given">{{ q.given }}</span>

        <span
          v-else-if="i === activeIndex"
          class="answer-box"
          :class="{ wrong: wrongFlash, shake: wrongFlash }"
        >
          <span class="buffer">{{ buffer }}</span>
          <span class="caret"></span>
        </span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";

export type MathsQuestion = {
  id: number;
  a: number;
  b: number;
  op: "+" | "-";
  answer: number;
  given: number | null;
};

const props = defineProps<{
  questions: MathsQuestion[];
  activeIndex: number;
  buffer: string;
  wrongFlash: boolean;
}>();

// only render the 5-row window around the active question;
// rows keep their absolute index so the strip position stays stable
const visible = computed(() =>
  props.questions
    .map((q, i) => ({ q, i }))
    .filter(({ i }) => i >= props.activeIndex - 2 && i <= props.activeIndex + 2),
);
</script>

<style scoped>
.stack-viewport {
  --row-h: 3.5rem;
  position: relative;
  height: calc(var(--row-h) * 5);
  width: 100%;
  max-width: 34rem;
  margin: 0 auto;
  overflow: hidden;
  /* fade the top and bottom rows out */
  mask-image: linear-gradient(
    to bottom,
    transparent 0%,
    black 24%,
    black 76%,
    transparent 100%
  );
  -webkit-mask-image: linear-gradient(
    to bottom,
    transparent 0%,
    black 24%,
    black 76%,
    transparent 100%
  );
}

.strip {
  position: absolute;
  inset: 0;
  transition: transform 0.28s cubic-bezier(0.3, 0, 0, 1);
}

.row {
  position: absolute;
  left: 0;
  right: 0;
  height: var(--row-h);
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.4rem;
  font-size: 1.35rem;
  font-weight: 600;
  font-variant-numeric: tabular-nums;
  color: var(--theme-text);
  white-space: nowrap;
  user-select: none;
}

@media (min-width: 1024px) {
  .row {
    font-size: 1.5rem;
  }
}

.row.done {
  color: var(--theme-text-done);
}

.answer {
  font-variant-numeric: tabular-nums;
}

.answer-box {
  display: inline-flex;
  align-items: center;
  min-width: 2.6ch;
  height: 1.7em;
  padding: 0 0.45em;
  border: 2px solid var(--theme-text);
  border-radius: 0.7rem;
  transition: border-color 0.15s ease;
}

.answer-box.wrong {
  border-color: var(--theme-text-error);
  animation: shake 0.35s ease;
}

.buffer {
  font-variant-numeric: tabular-nums;
}

.caret {
  width: 2px;
  height: 60%;
  margin-left: 1px;
  background-color: var(--theme-text);
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

@keyframes shake {
  0%,
  100% {
    transform: translateX(0);
  }
  20% {
    transform: translateX(-6px);
  }
  40% {
    transform: translateX(6px);
  }
  60% {
    transform: translateX(-4px);
  }
  80% {
    transform: translateX(4px);
  }
}
</style>
