<template>
  <div class="bar">
    <h1 class="logo-text">Allround</h1>
    
    <!-- Mobile Menu Button -->
    <button 
      @click="toggleMobileMenu"
      class="mobile-menu-btn md:hidden"
      aria-label="Toggle menu"
    >
      <Menu v-if="!mobileMenuOpen" class="w-6 h-6" />
      <X v-else class="w-6 h-6" />
    </button>

    <!-- Desktop Navigation -->
    <div class="content hidden lg:flex">
      <router-link to="/" class="nav-link">Home</router-link>

      <DropdownMenu>
        <DropdownMenuTrigger
          class="nav-link cursor-pointer outline-none flex items-center gap-1 bg-transparent border-none p-0 project-trigger"
          >Projects<ChevronDown class="w-4 h-4" />
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuItem class="group">
            <router-link to="/projects/monkeytype" class="sub-nav-link cursor-pointer outline-none flex items-center gap-2 bg-transparent border-none p-0 project-trigger">
              <Keyboard class="w-4 h-4 text-current transition-colors" :stroke-width="1.5" />
              Monkeytype
            </router-link>
          </DropdownMenuItem>
          <DropdownMenuItem class="group">
            <router-link to="/projects/aimlab" class="sub-nav-link cursor-pointer outline-none flex items-center gap-2 bg-transparent border-none p-0 project-trigger">
              <Target class="w-4 h-4 text-current transition-colors" :stroke-width="1.5" />
              Aimlab
            </router-link>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <router-link to="/about" class="nav-link">About</router-link>
    </div>

    <!-- Desktop Right Content -->
    <div class="right-content hidden lg:flex">
      <router-link to="/settings" class="nav-link">Settings</router-link>
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

    <!-- Mobile Menu Overlay -->
    <Transition name="fade">
      <div v-if="mobileMenuOpen" class="mobile-menu lg:hidden">
        <nav class="mobile-nav">
          <router-link to="/" class="mobile-nav-link" @click="toggleMobileMenu">
            Home
          </router-link>
          
          <div class="mobile-dropdown">
            <button 
              @click="projectsOpen = !projectsOpen"
              class="mobile-nav-link"
            >
              Projects
              <ChevronRight
                class="w-4 h-4 transition-transform duration-300"
                :class="{ 'rotate-90': projectsOpen }"
              />
            </button>
            <Transition name="expand">
              <div v-if="projectsOpen" class="mobile-submenu px-4 group flex flex-col gap-1">
                <router-link 
                  to="/projects/monkeytype" 
                  class="mobile-nav-link flex items-center gap-2"
                  @click="toggleMobileMenu"
                >
                  <Keyboard class="w-4 h-4 text-current transition-colors" :stroke-width="1.5" />
                  Monkeytype
                </router-link>
                <router-link 
                  to="/projects/aimlab" 
                  class="mobile-nav-link flex items-center gap-2"
                  @click="toggleMobileMenu"
                >
                  <Target class="w-4 h-4 text-current transition-colors" :stroke-width="1.5" />
                  Aimlab
                </router-link>
              </div>
            </Transition>
          </div>

          <router-link to="/about" class="mobile-nav-link" @click="toggleMobileMenu">
            About
          </router-link>
          
          <router-link to="/settings" class="mobile-nav-link" @click="toggleMobileMenu">
            Settings
          </router-link>

          <div class="mobile-auth-buttons">
            <button class="auth-btn bg-[var(--theme-text)] text-[var(--theme-bg)]">
              Login
            </button>
            <button class="auth-btn bg-[var(--theme-text)] text-[var(--theme-bg)]">
              Sign Up
            </button>
          </div>
        </nav>
      </div>
    </Transition>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ChevronDown, ChevronRight, Keyboard, Menu, Target, X } from "lucide-vue-next";

const mobileMenuOpen = ref(false);
const projectsOpen = ref(false);

const toggleMobileMenu = () => {
  mobileMenuOpen.value = !mobileMenuOpen.value;
  projectsOpen.value = false;
};
</script>

<style scoped>
.logo-text {
  font-size: clamp(1.5rem, 4vw, 2rem);
}

.auth-btn {
  padding: 0.5rem 1rem;
  border-radius: 0.5rem;
  white-space: nowrap;
  font-size: 0.875rem;
}

@media (min-width: 768px) {
  .auth-btn {
    font-size: 1rem;
  }
}

.bar {
  width: 100%;
  min-height: 3rem;
  border-bottom: 1px solid var(--theme-title);
  display: flex;
  align-items: center;
  padding: 10px 20px;
  justify-content: space-between;
  gap: 1rem;
  position: relative;
}

@media (min-width: 768px) {
  .bar {
    gap: 2rem;
  }
}

.content {
  color: var(--theme-text);
  font-weight: 600;
  justify-content: left;
  align-items: center;
}

.right-content {
  color: var(--theme-text);
  font-weight: 600;
  gap: 1rem;
  justify-content: right;
  align-items: center;
}

@media (min-width: 768px) {
  .right-content {
    width: 100%;
    display: flex;
  }
}

.nav-link {
  color: inherit;
  text-decoration: none;
  transition: color 0.2s;
  padding: 0.5rem 1rem;
  font-size: 0.875rem;
}

@media (min-width: 1024px) {
  .nav-link {
    font-size: 1rem;
  }
}

.nav-link:hover {
  color: var(--theme-text-focus);
  background-color: color-mix(in srgb, var(--theme-text-focus) 12%, transparent);
  border-radius: 0.5rem;
  transition: all 0.5s;
}

.sub-nav-link {
  color: inherit;
  text-decoration: none;
  transition: color 0.2s;
  padding: 0.5rem 1rem;
  font-size: 0.875rem;
  font-weight: 500;
}

.project-trigger {
  background-color: transparent;
  box-shadow: none;
}

/* Mobile Menu Button */
.mobile-menu-btn {
  color: var(--theme-text);
  background: transparent;
  border: none;
  cursor: pointer;
  padding: 0.5rem;
  align-items: center;
  justify-content: center;
  transition: color 0.2s;
}

.mobile-menu-btn:hover {
  color: var(--theme-text-focus);
}

/* Mobile Menu */
.mobile-menu {
  position: fixed;
  top: 6rem;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: color-mix(in srgb, var(--theme-bg) 85%, transparent);

  backdrop-filter: blur(8px);   /* <-- Blur background */
  -webkit-backdrop-filter: blur(8px);

  z-index: 50;
  overflow-y: auto;
}


.mobile-nav {
  display: flex;
  flex-direction: column;
  padding: 1rem;
  gap: 0.5rem;
}

.mobile-nav-link {
  color: var(--theme-text);
  text-decoration: none;
  padding: 0.75rem 1rem;
  border-radius: 0.5rem;
  transition: all 0.2s;
  font-weight: 600;
  display: flex;
  align-items: center;
  background: transparent;
  border: none;
  text-align: left;
  font-size: 1rem;
}

.mobile-nav-link:hover {
  background-color: color-mix(in srgb, var(--theme-text-focus) 14%, transparent);
  color: var(--theme-text-focus);
}

.mobile-dropdown {
  display: flex;
  flex-direction: column;
}

.mobile-submenu {
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.mobile-auth-buttons {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  margin-top: 1rem;
  padding-top: 1rem;
  border-top: 1px solid var(--theme-title);
}

.mobile-auth-buttons .auth-btn {
  width: 100%;
  padding: 0.75rem 1rem;
}

/* Transitions */
/* .slide-enter-active,
.slide-leave-active {
  transition: transform 0.3s ease;
}

.slide-enter-from {
  transform: translateX(-100%);
}

.slide-leave-to {
  transform: translateX(-100%);
} */

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.fade-enter-to,
.fade-leave-from {
  opacity: 1;
}

.expand-enter-active,
.expand-leave-active {
  transition: all 0.3s ease;
}

.expand-enter-from,
.expand-leave-to {
  opacity: 0;
  max-height: 0;
}

.expand-enter-to,
.expand-leave-from {
  opacity: 1;
  max-height: 200px;
}

</style>
