<script setup lang="ts">
import {
  NavigationMenu,
  NavigationMenuList,
  NavigationMenuItem,
  NavigationMenuTrigger,
  NavigationMenuContent,
  NavigationMenuLink,
} from "@/components/ui/navigation-menu";
import { Button } from "@/components/ui/button";
</script>

<template>
  <header
    class="w-full border-b"
    style="background-color: var(--theme-bg); color: var(--theme-text)"
  >
    <div class="container mx-auto flex h-16 items-center px-4">
      <!-- Left: Brand -->
      <div class="flex-0 flex justify-start text-xl font-bold">MyApp</div>

      <!-- Center: Navigation -->
      <NavigationMenu class="flex-1 w-full mx-4">
        <NavigationMenuList>
          <NavigationMenuItem>
            <NavigationMenuLink href="/" class="navitem"
              >Home</NavigationMenuLink
            >
          </NavigationMenuItem>
          <NavigationMenuItem>
            <NavigationMenuTrigger class="navitem"
              >Projects</NavigationMenuTrigger
            >
            <NavigationMenuContent>
              <ul class="grid gap-3 p-4 w-[200px]">
                <li>
                  <NavigationMenuLink href="/projects/monkeytype"
                    >Monkeytype</NavigationMenuLink
                  >
                </li>
                <li>
                  <NavigationMenuLink href="/products/2"
                    >Product 2</NavigationMenuLink
                  >
                </li>
              </ul>
            </NavigationMenuContent>
          </NavigationMenuItem>
          <NavigationMenuItem>
            <NavigationMenuLink href="/about" class="navitem"
              >About</NavigationMenuLink
            >
          </NavigationMenuItem>
        </NavigationMenuList>
      </NavigationMenu>

      <!-- Right: Actions -->
      <div class="flex-1 flex justify-end gap-2">
        <Button variant="outline">Login</Button>
        <Button>Sign Up</Button>
      </div>
    </div>
  </header>
</template>

<style scoped>
@reference "tailwindcss";
.navitem {
  @apply font-medium text-base;
}
</style>
