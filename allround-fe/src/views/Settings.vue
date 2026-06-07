<template>
  <div class="p-4 sm:p-6 max-w-6xl mx-auto text-[var(--theme-text)]">
    <h1 class="text-2xl sm:text-3xl font-bold mb-6 sm:mb-8 text-[var(--theme-title)]">Settings</h1>

    <div class="mb-8">
      <h2 class="text-xl font-semibold mb-4 flex items-center gap-2">
        <span class="text-[var(--theme-title)]">Theme</span>
      </h2>
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        <button
          v-for="theme in themes"
          :key="theme.name"
          @click="setCurrTheme(theme.name)"
          class="theme-btn flex items-center justify-between px-4 py-3 rounded-lg transition-all duration-200 outline-none border-2 border-transparent"
          :class="{ 'theme-btn-active': currentTheme === theme.name }"
          :style="{ backgroundColor: theme.bgColor, color: theme.textColor }"
        >
          <span class="font-medium">{{ theme.label }}</span>
          <div class="flex gap-2">
            <div
              v-for="(color, index) in theme.palette"
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
import { onMounted, ref } from "vue";

const currentTheme = ref("default");

onMounted(() => {
  const theme = document.documentElement.getAttribute("data-theme") || "default";
  currentTheme.value = theme === "dark" ? "deep-space" : theme;
});

const themes = [
  {
    name: "carbon",
    label: "carbon",
    bgColor: "#3d3d3d",
    textColor: "#f5f5f5",
    palette: ["#000000", "#808080", "#c96b6b"],
  },
  {
    name: "blue",
    label: "blue",
    bgColor: "#e0f2fe",
    textColor: "#1e3a8a",
    palette: ["#00113f", "#1e3a8a", "#4d91f7"],
  },
  {
    name: "deep-space",
    label: "deep space",
    bgColor: "#0f172a",
    textColor: "#f8fafc",
    palette: ["#535bf2", "#f8fafc", "#c96b6b"],
  },
  {
    name: "8088",
    label: "8088",
    bgColor: "#2e3642",
    textColor: "#ff4f8b",
    palette: ["#ff4f8b", "#c7d0dd", "#f3f7fb"],
  },
  {
    name: "mizu",
    label: "mizu",
    bgColor: "#a8c5d9",
    textColor: "#f7f6ef",
    palette: ["#f7f6ef", "#8fa9c2", "#1f2a39"],
  },
  {
    name: "strawberry",
    label: "strawberry",
    bgColor: "#f36f77",
    textColor: "#fff7f7",
    palette: ["#fff7f7", "#ffe0e3", "#ffd0d5"],
  },
  {
    name: "vscode",
    label: "vscode",
    bgColor: "#1e1e1e",
    textColor: "#007acc",
    palette: ["#007acc", "#3c3c3c", "#d4d4d4"],
  },
  {
    name: "bushido",
    label: "bushido",
    bgColor: "#2b2d31",
    textColor: "#ff4d67",
    palette: ["#ff4d67", "#f7f0e9", "#ff8ea0"],
  },
  {
    name: "botanical",
    label: "botanical",
    bgColor: "#6b9e92",
    textColor: "#385f56",
    palette: ["#31534b", "#385f56", "#ffffff"],
  },
  {
    name: "taro",
    label: "taro",
    bgColor: "#b3baff",
    textColor: "#6d6c8f",
    palette: ["#0c0e23", "#6d6c8f", "#ffffff"],
  },
  {
    name: "peachy",
    label: "peachy",
    bgColor: "#ffcdb2",
    textColor: "#e5989b",
    palette: ["#b5838d", "#e5989b", "#ffb4a2"],
  },
  {
    name: "forest",
    label: "forest",
    bgColor: "#354f52",
    textColor: "#cad2c5",
    palette: ["#cad2c5", "#84a98c", "#52796f"],
  },
  {
    name: "bubblegum",
    label: "bubblegum",
    bgColor: "white",
    textColor: "#92e8d3",
    palette: ["#f4b0ca", "#92e8d3", "#31b79b"],
  },
  {
    name: "sandstone",
    label: "sandstone",
    bgColor: "#272727",
    textColor: "#f1d1aa",
    palette: ["#f1d1aa", "#d4aa7d", "#b58360"],
  },
  {
    name: "monochrome-light",
    label: "monochrome-light",
    bgColor: "#fff",
    textColor: "#333",
    palette: ["#333333", "#555555", "#666666"],
  },
];

const setCurrTheme = (theme: string) => {
  setTheme(theme);
  currentTheme.value = theme;
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
