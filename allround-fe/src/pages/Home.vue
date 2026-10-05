<template>
  <div class="home-shell">
    <h1 class="pt-4 title-container">
      <span class="text-[var(--theme-text)]">[</span>
      <span class="relative top-1">
        <span class="caret-block"></span>
        E
      </span>
      <span class="relative top-1">FFCT</span>
      <span class="text-[var(--theme-text)]">]</span>
    </h1>
    <p class="tagline">pick your game</p>

    <div class="project-grid">
      <router-link
        v-for="project in projects"
        :key="project.path"
        :to="project.path"
        class="project-card"
      >
        <div class="card-head">
          <span class="icon-tile">
            <component :is="project.icon" class="h-5 w-5" :stroke-width="1.5" />
          </span>
          <ArrowUpRight class="arrow h-4 w-4" :stroke-width="1.5" />
        </div>
        <h2 class="card-name">{{ project.name }}</h2>
        <p class="card-desc">{{ project.description }}</p>
      </router-link>
    </div>
  </div>
</template>
<script setup lang="ts">
import { ArrowUpRight } from "lucide-vue-next";
import { projects } from "../components/projects/projectList";
</script>

<style scoped>
.home-shell {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 2.5rem 1rem;
  min-height: 100%;
  width: 100%;
}

.title-container {
  display: flex;
  justify-content: center;
  align-items: center;
}

.caret-block {
  position: absolute;
  inset: 0;
  top: 5%;
  bottom: -5%;
  background-color: color-mix(in srgb, var(--block, var(--theme-title)) 35%, transparent);
  animation: blink 1s infinite;
  z-index: 0;
  border-radius: 2px;
  pointer-events: none;
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

.tagline {
  margin-top: 0.5rem;
  font-size: 0.9rem;
  font-weight: 500;
  letter-spacing: 0.08em;
  color: var(--theme-text-done);
}

.project-grid {
  margin-top: 2.5rem;
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(15rem, 1fr));
  gap: 1rem;
  width: 100%;
  max-width: 62rem;
}

.project-card {
  position: relative;
  border: 1px solid color-mix(in srgb, var(--theme-text) 25%, transparent);
  border-radius: 1rem;
  background-color: color-mix(in srgb, var(--theme-text) 4%, transparent);
  padding: 1.25rem 1.1rem 1.35rem;
  text-decoration: none;
  color: var(--theme-text);
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.35rem;
  transition: border-color 0.2s ease, transform 0.2s ease;
}

.project-card:hover {
  border-color: var(--theme-text-focus);
  transform: translateY(-2px);
}

.card-head {
  display: flex;
  justify-content: center;
  margin-bottom: 0.6rem;
}

.icon-tile {
  width: 2.75rem;
  height: 2.75rem;
  border-radius: 0.8rem;
  background-color: color-mix(in srgb, var(--theme-text) 8%, transparent);
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--theme-text);
  transition: background-color 0.2s ease, color 0.2s ease;
}

.project-card:hover .icon-tile {
  background-color: color-mix(in srgb, var(--theme-text-focus) 16%, transparent);
  color: var(--theme-text-focus);
}

.arrow {
  position: absolute;
  top: 1rem;
  right: 1rem;
  color: var(--theme-text-done);
  opacity: 0;
  transform: translate(-3px, 3px);
  transition: opacity 0.2s ease, transform 0.2s ease, color 0.2s ease;
}

.project-card:hover .arrow {
  opacity: 1;
  transform: translate(0, 0);
  color: var(--theme-text-focus);
}

.card-name {
  font-size: 1.05rem;
  font-weight: 700;
}

.card-desc {
  font-size: 0.85rem;
  line-height: 1.5;
  color: var(--theme-text-done);
}
</style>
