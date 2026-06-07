<script setup lang="ts">
import TopNavBar from "./components/header/TopNavBar.vue";
</script>

<template>
  <div class="app-shell">
    <TopNavBar />

    <main class="app-main">
      <router-view />
    </main>
  </div>
</template>

<style scoped>
.app-shell {
  display: flex;
  height: 100%;
  min-height: 0;
  flex-direction: column;
}

.app-main {
  flex: 1;
  min-height: 0;
}
</style>
