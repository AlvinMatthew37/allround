export interface Project {
  name: string;
  path: string;
  description: string;
}

export const projects: Project[] = [
  {
    name: "Typewright",
    path: "/projects/typewright",
    description: "A typing test to improve your speed and accuracy.",
  },
  {
    name: "Aimlab",
    path: "/projects/aimlab",
    description: "A simple aim trainer.",
  },
  {
    name: "Quick Maths",
    path: "/projects/quick-maths",
    description: "Solve as many math problems as you can.",
  },
];
