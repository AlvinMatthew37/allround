<template>
  <div class="p-6 max-w-6xl mx-auto text-[var(--theme-text)]">
    <h1 class="text-3xl font-bold mb-8 text-[var(--theme-title)]">Settings</h1>
    
    <div class="mb-8">
      <h2 class="text-xl font-semibold mb-4 flex items-center gap-2">
        <span class="text-[var(--theme-title)]">Theme</span>
      </h2>
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
        <button 
          v-for="theme in themes" 
          :key="theme.name"
          @click="setCurrTheme(theme.name)" 
          class="theme-btn flex items-center justify-between px-4 py-3 rounded-lg transition-all duration-200 outline-none"
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

const themes = [
  { 
    name: 'carbon', 
    label: 'carbon', 
    bgColor: '#3d3d3d', 
    textColor: '#000000',
    palette: ['#000000', '#808080', '#707070'] 
  },
  { 
    name: 'blue', 
    label: 'blue', 
    bgColor: '#e0f2fe', 
    textColor: '#1e3a8a',
    palette: ['#1e3a8a', '#00113f', '#4d91f7'] 
  },
  { 
    name: 'dark', 
    label: 'dark', 
    bgColor: '#0f172a', 
    textColor: '#f8fafc',
    palette: ['#f8fafc', '#535bf2', '#c96b6b'] 
  },
  { 
    name: 'botanical', 
    label: 'botanical', 
    bgColor: '#6b9e92', 
    textColor: '#385f56',
    palette: ['#385f56', '#ffffff', '#c96b6b'] 
  },
  { 
    name: 'taro', 
    label: 'taro', 
    bgColor: '#b3baff', 
    textColor: '#6d6c8f',
    palette: ['#6d6c8f', '#ffffff', '#0c0e23'] 
  }
];

const setCurrTheme = (theme: string) => {
  setTheme(theme);
};
</script>

<style scoped>
.theme-btn:hover {
  transform: scale(1.02);
  filter: brightness(1.1);
}
</style>
