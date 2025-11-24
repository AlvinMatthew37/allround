<script setup lang="ts">
import HelloWorld from '../components/HelloWorld.vue'
import Button from '@/components/ui/button/Button.vue';
</script>

<template>
  <h1>Home Page</h1>
  <div class="flex justify-around py-2">
    <a href="https://vite.dev" target="_blank">
      <img src="/vite.svg" class="logo" alt="Vite logo" />
    </a>
    <a href="https://vuejs.org/" target="_blank">
      <img src="../assets/vue.svg" class="logo vue" alt="Vue logo" />
    </a>
  </div>
  <HelloWorld/>
</template>

<style scoped>
    body {
    margin: 0;
    display: flex;
    place-items: center;
    min-width: 320px;
    min-height: 100vh;
    }
</style>

<!-- <style scoped>
    button {
        font-weight: 500;
        color: #646cff;
        background-color: aquamarine;
        text-decoration: inherit;

        transition: 
            color 0.3s ease 0.2s,         /* delay 0.2s for color */
            background-color 0.3s ease 0.2s; /* delay 0.2s for bg */
    }
    button:hover {
        color: #ffffff;
        background-color: aqua;
    }
</style> -->
