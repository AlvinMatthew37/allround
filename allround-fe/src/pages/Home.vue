<script setup lang="ts">
import { projects } from '../components/projects/projectList';

</script>

<template>
  <h1 class="pt-4 white title-container">
    <span class="text-[var(--theme-text)]">[</span>
    <span class="relative top-1">
      <span class="caret-block"></span>
      E
    </span>
    <span class="relative top-1">FFCT</span>
    <span class="text-[var(--theme-text)]">]</span>
  </h1>
  
  <div class="main-content p-4">
    <div class="projects-flex">
      <div 
        v-for="project in projects" 
        :key="project.name" 
        class="project-card"
      >
        <router-link 
          :to="project.path" 
          class="project-link block p-4 border-2 border-[var(--theme-text)] hover:bg-[var(--theme-text)] text-[var(--theme-text)] hover:text-[var(--theme-bg)] transition-colors duration-200 h-full"
        >
          <h2 class="text-xl font-bold mb-2">{{ project.name }}</h2>
          <p class="opacity-80">{{ project.description }}</p>
        </router-link>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* -------------------------------- */
/*   TITLE STYLING                  */
/* -------------------------------- */
.caret-block {
  position: absolute;
  inset: 0;
  top: 5%;
  bottom: -5%;
  background-color: var(--block);
  opacity: 0.5;
  animation: blink 1s infinite;
  z-index: 0;
  border-radius: 2px;
  pointer-events: none;
}

@keyframes blink {
  0%, 100% { opacity: 1; }
  50% { opacity: 0; }
}

.title-container {
  display: flex;
  justify-content: center;
  align-items: center;
}

/* -------------------------------- */
/*   MAIN CONTENT WRAPPER          */
/* -------------------------------- */
.main-content {
  margin: auto;
  margin-top: 1rem;
  min-width: 50%;
  max-width: 70%;
  border: 2px solid var(--theme-text);
  background-color: rgba(255, 255, 255, 0.1);
}

/* -------------------------------- */
/*   FLEXBOX GRID (DYNAMIC LAST ROW)
/* -------------------------------- */
.projects-flex {
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
}

/* 3 columns max (large screens) */
.project-card {
  flex: 1 1 calc(33.333% - 1rem);
  display: flex;
  min-height: 150px;
  max-height: 200px;
}

/* 2 columns on tablets */
@media (max-width: 900px) {
  .project-card {
    flex: 1 1 calc(50% - 1rem);
  }
}

/* 1 column on mobile */
@media (max-width: 600px) {
  .project-card {
    flex: 1 1 100%;
  }
}

/* Keep project link full-height */
.project-link {
  display: flex;
  flex-direction: column;
  width: 100%;
}
</style>
