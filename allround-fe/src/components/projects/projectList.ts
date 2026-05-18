export interface Project {
  name: string;
  path: string;
  description: string;
}

export const projects: Project[] = [
  {
    name: "Monkeytype",
    path: "/projects/monkeytype",
    description: "A typing test to improve your speed and accuracy.",
  },
  {
    name: "Aimlab",
    path: "/projects/aimlab",
    description: "A simple aim trainer.",
  },
];
