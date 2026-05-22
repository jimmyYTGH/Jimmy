export interface Project {
  id: string;
  name: string;
  description: string;
  techStack: string[];
  image: string;
  link?: string;
  github?: string;
}

export const projects: Project[] = [
  {
    id: "project-1",
    name: "E-Commerce Platform",
    description:
      "A full-stack e-commerce platform with real-time inventory management, payment processing, and an admin dashboard.",
    techStack: ["React", "Node.js", "PostgreSQL", "Stripe"],
    image: "",
    link: "#",
    github: "#",
  },
  {
    id: "project-2",
    name: "Task Management App",
    description:
      "A collaborative task management tool with drag-and-drop boards, real-time updates, and team workspaces.",
    techStack: ["Next.js", "TypeScript", "Prisma", "WebSocket"],
    image: "",
    link: "#",
    github: "#",
  },
  {
    id: "project-3",
    name: "AI Content Generator",
    description:
      "An AI-powered content generation tool that creates blog posts, social media content, and marketing copy.",
    techStack: ["Python", "FastAPI", "React", "OpenAI"],
    image: "",
    link: "#",
    github: "#",
  },
];
