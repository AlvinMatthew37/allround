import { Brain, Calculator, Keyboard, Target } from "lucide-vue-next";
import type { Component } from "vue";

export interface Project {
  name: string;
  path: string;
  description: string;
  icon: Component;
}

export const projects: Project[] = [
  {
    name: "Typewright",
    path: "/projects/typewright",
    description: "A typing test to improve your speed and accuracy.",
    icon: Keyboard,
  },
  {
    name: "Aimlab",
    path: "/projects/aimlab",
    description: "A simple aim trainer.",
    icon: Target,
  },
  {
    name: "Quick Maths",
    path: "/projects/quick-maths",
    description: "Solve as many math problems as you can.",
    icon: Calculator,
  },
  {
    name: "Chimp Test",
    path: "/projects/chimp-test",
    description: "Memorize the numbers and click them in order.",
    icon: Brain,
  },
];
