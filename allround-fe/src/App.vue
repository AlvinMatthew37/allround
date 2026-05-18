<script setup lang="ts">
import TopNavBar from "./components/header/TopNavBar.vue";
</script>

<template>
  <!-- <navbar /> -->
  <TopNavBar />
  <!-- <nav>
    <router-link to="/">Home</router-link> |
    <router-link to="/about">About</router-link>
  </nav> -->
  <router-view />
</template>

<style scoped></style>
