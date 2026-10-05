<template>
  <div class="about-shell">
    <h1 class="text-2xl font-bold mb-6 text-[var(--theme-title)]">ABOUT</h1>

    <section class="intro">
      <p>
        A growing collection of small browser minigames, built as a playground
        for practicing modern web development — Vue on the front end.
      </p>
      <span class="mt-2 text-2xl text-[var(--theme-text-done)] font-bold ">(Planning to make a daily scoreboard)</span>
    </section>

    <section class="section">
      <h2 class="section-title">The games</h2>
      <div class="games-list">
        <router-link
          v-for="project in projects"
          :key="project.path"
          :to="project.path"
          class="game-row"
        >
          <span class="icon-tile">
            <component :is="project.icon" class="h-4 w-4" :stroke-width="1.5" />
          </span>
          <span class="game-name">{{ project.name }}</span>
          <span class="game-desc">{{ project.description }}</span>
          <ArrowUpRight class="arrow h-4 w-4" :stroke-width="1.5" />
        </router-link>
      </div>
    </section>

    <section class="section">
      <h2 class="section-title">Built with</h2>
      <div class="chips">
        <span v-for="tech in techStack" :key="tech" class="chip">{{ tech }}</span>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import { ArrowUpRight } from "lucide-vue-next";
import { projects } from "../components/projects/projectList";

const techStack = ["Vue 3", "TypeScript", "Vite", "Tailwind CSS", "Lucide"];
</script>

<style scoped>
.about-shell {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 2.5rem 1rem;
  min-height: 100%;
  width: 100%;
}

.intro {
  max-width: 34rem;
  text-align: center;
}

.intro p {
  font-size: 1.05rem;
  line-height: 1.7;
  color: var(--theme-text);
}

.section {
  margin-top: 2.5rem;
  width: 100%;
  max-width: 34rem;
}

.section-title {
  font-size: 0.75rem;
  font-weight: 700;
  letter-spacing: 0.18em;
  text-transform: uppercase;
  color: var(--theme-text-done);
  margin-bottom: 0.9rem;
}

.games-list {
  display: flex;
  flex-direction: column;
  gap: 0.6rem;
}

.game-row {
  display: flex;
  align-items: center;
  gap: 0.85rem;
  border: 1px solid color-mix(in srgb, var(--theme-text) 25%, transparent);
  border-radius: 0.9rem;
  background-color: color-mix(in srgb, var(--theme-text) 4%, transparent);
  padding: 0.8rem 1rem;
  text-decoration: none;
  color: var(--theme-text);
  text-align: left;
  transition: border-color 0.2s ease, transform 0.2s ease;
}

.game-row:hover {
  border-color: var(--theme-text-focus);
  transform: translateX(3px);
}

.game-row:hover .icon-tile {
  background-color: color-mix(in srgb, var(--theme-text-focus) 16%, transparent);
  color: var(--theme-text-focus);
}

.game-row:hover .arrow {
  opacity: 1;
  transform: translate(0, 0);
  color: var(--theme-text-focus);
}

.icon-tile {
  flex-shrink: 0;
  width: 2.2rem;
  height: 2.2rem;
  border-radius: 0.6rem;
  background-color: color-mix(in srgb, var(--theme-text) 8%, transparent);
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--theme-text);
  transition: background-color 0.2s ease, color 0.2s ease;
}

.game-name {
  font-weight: 700;
  font-size: 0.95rem;
  white-space: nowrap;
}

.game-desc {
  font-size: 0.85rem;
  color: var(--theme-text-done);
  flex: 1;
  min-width: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.arrow {
  flex-shrink: 0;
  color: var(--theme-text-done);
  opacity: 0;
  transform: translate(-3px, 0);
  transition: opacity 0.2s ease, transform 0.2s ease, color 0.2s ease;
}

.chips {
  display: flex;
  flex-wrap: wrap;
  gap: 0.6rem;
}

.chip {
  border: 1px solid color-mix(in srgb, var(--theme-text) 25%, transparent);
  border-radius: 9999px;
  background-color: color-mix(in srgb, var(--theme-text) 4%, transparent);
  padding: 0.3rem 0.9rem;
  font-size: 0.8rem;
  font-weight: 600;
  color: var(--theme-text);
}
</style>
