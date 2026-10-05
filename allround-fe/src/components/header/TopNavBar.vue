<template>
  <div class="bar">
    <h1 class="logo-text">
      <span class="text-[var(--theme-text)]">All</span><span class="text-[var(--theme-title)]">round</span>
    </h1>

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
          class="nav-link cursor-pointer outline-none flex items-center gap-1.5 bg-transparent border-none p-0 project-trigger"
          >Projects<ChevronDown class="w-3.5 h-3.5" />
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuItem
            class="group focus:bg-[color-mix(in_srgb,var(--theme-text-focus)_12%,transparent)] focus:text-[var(--theme-text-focus)]"
          >
            <router-link to="/projects/typewright" class="sub-nav-link cursor-pointer outline-none flex items-center gap-2 bg-transparent border-none p-0 project-trigger">
              <Keyboard class="w-4 h-4 text-current transition-colors" :stroke-width="2" />
              Typewright
            </router-link>
          </DropdownMenuItem>
          <DropdownMenuItem
            class="group focus:bg-[color-mix(in_srgb,var(--theme-text-focus)_12%,transparent)] focus:text-[var(--theme-text-focus)]"
          >
            <router-link to="/projects/aimlab" class="sub-nav-link cursor-pointer outline-none flex items-center gap-2 bg-transparent border-none p-0 project-trigger">
              <Target class="w-4 h-4 text-current transition-colors" :stroke-width="2" />
              Aimlab
            </router-link>
          </DropdownMenuItem>
          <DropdownMenuItem
            class="group focus:bg-[color-mix(in_srgb,var(--theme-text-focus)_12%,transparent)] focus:text-[var(--theme-text-focus)]"
          >
            <router-link to="/projects/quick-maths" class="sub-nav-link cursor-pointer outline-none flex items-center gap-2 bg-transparent border-none p-0 project-trigger">
              <Calculator class="w-4 h-4 text-current transition-colors" :stroke-width="2" />
              Quick Maths
            </router-link>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <router-link to="/about" class="nav-link">About</router-link>
    </div>

    <!-- Desktop Right Content -->
    <div class="right-content hidden lg:flex">
      <button class="auth-btn">
        Login
      </button>
      <button class="auth-btn">
        Sign Up
      </button>
      <router-link to="/settings" class="icon-btn" aria-label="Settings" title="Settings">
        <Settings class="h-[18px] w-[18px]" :stroke-width="2" />
      </router-link>
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
                  to="/projects/typewright"
                  class="mobile-nav-link flex items-center gap-2"
                  @click="toggleMobileMenu"
                >
                  <Keyboard class="w-4 h-4 text-current transition-colors" :stroke-width="2" />
                  Typewright
                </router-link>
                <router-link
                  to="/projects/aimlab"
                  class="mobile-nav-link flex items-center gap-2"
                  @click="toggleMobileMenu"
                >
                  <Target class="w-4 h-4 text-current transition-colors" :stroke-width="2" />
                  Aimlab
                </router-link>
                <router-link
                  to="/projects/quick-maths"
                  class="mobile-nav-link flex items-center gap-2"
                  @click="toggleMobileMenu"
                >
                  <Calculator class="w-4 h-4 text-current transition-colors" :stroke-width="2" />
                  Quick Maths
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
            <button class="auth-btn">
              Login
            </button>
            <button class="auth-btn">
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
import { Calculator, ChevronDown, ChevronRight, Keyboard, Menu, Settings, Target, X } from "lucide-vue-next";

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
  /* tight line box so the glyphs sit truly centered in the bar */
  line-height: 1;
}

.auth-btn {
  padding: 0.4rem 1.1rem;
  border: 1px solid color-mix(in srgb, var(--theme-text) 35%, transparent);
  border-radius: 9999px;
  background: transparent;
  color: var(--theme-text);
  white-space: nowrap;
  font-size: 0.8rem;
  font-weight: 500;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  transition: color 0.2s, border-color 0.2s;
}

.auth-btn:hover {
  color: var(--theme-text-focus);
  border-color: var(--theme-text-focus);
}

.bar {
  width: 100%;
  min-height: 3.5rem;
  /* subtle surface tint: mixes toward the text color so it lightens
     on dark themes and darkens on light ones — separation without a line */
  background-color: color-mix(in srgb, var(--theme-bg) 94%, var(--theme-text) 6%);
  border-radius: 0.75rem;
  display: flex;
  align-items: center;
  padding: 10px 24px;
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
  justify-content: left;
  align-items: center;
}

.right-content {
  color: var(--theme-text);
  gap: 0.875rem;
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
  font-size: 0.8rem;
  font-weight: 500;
  letter-spacing: 0.14em;
  text-transform: uppercase;
}

.nav-link:hover {
  color: var(--theme-text-focus);
}

.sub-nav-link {
  color: inherit;
  text-decoration: none;
  transition: color 0.2s;
  padding: 0.5rem 1rem;
  font-size: 0.8rem;
  font-weight: 500;
  letter-spacing: 0.14em;
  text-transform: uppercase;
}

.sub-nav-link:hover {
  color: var(--theme-text-focus);
}

.icon-btn {
  width: 2.25rem;
  height: 2.25rem;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 1px solid color-mix(in srgb, var(--theme-text) 30%, transparent);
  border-radius: 9999px;
  color: var(--theme-text);
  transition: color 0.2s, border-color 0.2s;
}

.icon-btn:hover {
  color: var(--theme-text-focus);
  border-color: var(--theme-text-focus);
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
