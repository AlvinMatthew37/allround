<template>
  <div class="bar">
    <h1>Allround</h1>
    <div class="content">
      <router-link to="/" class="nav-link">Home</router-link>

      <DropdownMenu>
        <DropdownMenuTrigger
          class="nav-link cursor-pointer outline-none flex items-center gap-1 bg-transparent border-none p-0 project-trigger"
          >Projects <ChevronDown class="w-4 h-4" />
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuItem>
            <router-link to="/projects/monkeytype" class="w-full sub-nav-link"
              >Monkeytype</router-link
            >
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <router-link to="/about" class="nav-link">About</router-link>
    </div>
    <div class="right-content">
      <router-link to="/settings" class="nav-link mr-4">Settings</router-link>
      <button
        class="auth-btn bg-[var(--theme-text)] text-[var(--theme-bg)] hover:opacity-90 transition-opacity"
      >
        Login
      </button>
      <button
        class="auth-btn bg-[var(--theme-text)] text-[var(--theme-bg)] hover:opacity-90 transition-opacity"
      >
        Sign Up
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ChevronDown } from "lucide-vue-next";
</script>

<style scoped>
h1 {
  font-size: xx-large;
}
.auth-btn {
  padding: 0.5rem 1rem;
  border-radius: 0.5rem;
  white-space: nowrap;
}
.bar {
  width: 100%;
  min-height: 3rem;
  border-bottom: 1px solid var(--theme-title);
  display: flex;
  align-items: center;
  padding: 10px 20px;
  justify-content: space-between;
  gap: 2rem;
}
.content {
  color: var(--theme-text);
  font-weight: 600;
  width: 100%;
  display: flex;
  gap: 2rem;
  justify-content: left;
  align-items: center;
}
.right-content {
  color: var(--theme-text);
  font-weight: 600;
  width: 100%;
  display: flex;
  gap: 0.75rem;
  justify-content: right;
  align-items: center;
}
.nav-link {
  color: inherit;
  text-decoration: none;
  transition: color 0.2s;
}
.nav-link:hover {
  color: var(--theme-text-done);
}

.sub-nav-link {
  color: inherit;
  text-decoration: none;
}
.project-trigger {
  background-color: transparent;
  box-shadow: none;
}
</style>
