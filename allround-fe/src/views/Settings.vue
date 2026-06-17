<template>
  <div class="p-4 sm:p-6 max-w-6xl mx-auto text-[var(--theme-text)]">
    <h1 class="text-2xl sm:text-3xl font-bold mb-6 sm:mb-8 text-[var(--theme-title)]">Settings</h1>

    <div class="mb-8">
      <h2 class="text-xl font-semibold mb-4 flex items-center gap-2">
        <span class="text-[var(--theme-title)]">Theme</span>
      </h2>
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        <button
          v-for="theme in themeDefinitions"
          :key="theme.name"
          @click="setCurrTheme(theme.name)"
          class="theme-btn flex items-center justify-between px-4 py-3 rounded-lg transition-all duration-200 outline-none border-2 border-transparent"
          :class="{ 'theme-btn-active': currentTheme === theme.name }"
          :style="{
            backgroundColor: getThemeColorForCssVar(theme, '--theme-bg'),
            color: getThemeColorForCssVar(theme, '--theme-text'),
          }"
        >
          <span class="font-medium">{{ theme.label }}</span>
          <div class="flex gap-2">
            <div
              v-for="(color, index) in [theme.colors.color1, theme.colors.color2, theme.colors.color3]"
              :key="index"
              class="w-4 h-4 rounded-full"
              :style="{ backgroundColor: color }"
            ></div>
          </div>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { setTheme } from "../components/projects/theme";
import {
  getThemeColorForCssVar,
  normalizeThemeName,
  themeDefinitions,
} from "../components/projects/themes";
import { onMounted, ref } from "vue";

const currentTheme = ref("default");

onMounted(() => {
  const theme = document.documentElement.getAttribute("data-theme") || "default";
  currentTheme.value = normalizeThemeName(theme);
});

const setCurrTheme = (theme: string) => {
  setTheme(theme);
  currentTheme.value = normalizeThemeName(theme);
};
</script>

<style scoped>
.theme-btn:hover {
  transform: scale(1.02);
  filter: brightness(1.1);
}

.theme-btn-active {
  border-color: var(--theme-title);
  box-shadow: 0 0 0 2px color-mix(in srgb, var(--theme-title) 20%, transparent);
}
</style>
