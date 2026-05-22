export interface Skill {
  name: string;
  level: number; // 0-100
  category: "frontend" | "backend" | "tools";
}

export const skills: Skill[] = [
  { name: "React", level: 90, category: "frontend" },
  { name: "TypeScript", level: 85, category: "frontend" },
  { name: "Tailwind CSS", level: 90, category: "frontend" },
  { name: "Next.js", level: 80, category: "frontend" },
  { name: "Vue.js", level: 70, category: "frontend" },
  { name: "Node.js", level: 80, category: "backend" },
  { name: "Python", level: 75, category: "backend" },
  { name: "PostgreSQL", level: 70, category: "backend" },
  { name: "Docker", level: 65, category: "tools" },
  { name: "Git", level: 85, category: "tools" },
  { name: "Figma", level: 70, category: "tools" },
  { name: "AWS", level: 60, category: "tools" },
];
