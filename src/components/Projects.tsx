import { motion } from "framer-motion";
import { ExternalLink } from "lucide-react";
import { GitHubIcon } from "./Icons";
import { projects } from "../data/projects";

const gradients = [
  "from-[#00f0ff]/10 via-[#00f0ff]/5 to-transparent",
  "from-[#a855f7]/10 via-[#a855f7]/5 to-transparent",
  "from-[#00f0ff]/10 via-[#a855f7]/5 to-transparent",
];

export default function Projects() {
  return (
    <div className="mx-auto max-w-6xl px-6 py-28">
      <motion.p
        className="font-mono text-sm tracking-[0.3em] text-[#00f0ff]/70"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
      >
        PROJECTS
      </motion.p>

      <motion.h2
        className="mt-3 font-heading text-4xl font-bold sm:text-5xl lg:text-6xl"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5, delay: 0.1 }}
      >
        <span
          style={{
            background: "linear-gradient(135deg, #00f0ff, #a855f7)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
          }}
        >
          Projects
        </span>
      </motion.h2>

      <div className="mt-14 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
        {projects.map((project, i) => (
          <motion.div
            key={project.id}
            className="group relative overflow-hidden rounded-3xl border border-white/[0.06] bg-white/[0.02] p-6 transition-all duration-500 hover:-translate-y-3 hover:border-[#00f0ff]/20 hover:shadow-[0_20px_60px_rgba(0,240,255,0.08)]"
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.12, duration: 0.5 }}
          >
            {/* Decorative gradient blob */}
            <div
              className={`absolute -top-10 -right-10 size-40 rounded-full bg-gradient-to-br ${gradients[i % gradients.length]} opacity-0 blur-2xl transition-opacity duration-500 group-hover:opacity-100`}
            />

            {/* Image placeholder */}
            <div className="relative mb-5 aspect-video overflow-hidden rounded-2xl border border-white/[0.05] bg-gradient-to-br from-white/[0.03] to-transparent">
              <div className="flex h-full items-center justify-center">
                <span className="font-mono text-4xl font-bold text-white/[0.06]">
                  {"</>"}
                </span>
              </div>
            </div>

            <h3 className="relative font-heading text-xl font-semibold text-white transition-colors group-hover:text-[#00f0ff]">
              {project.name}
            </h3>

            <p className="relative mt-2 text-sm leading-relaxed text-[#94a3b8]">
              {project.description}
            </p>

            {/* Tech tags */}
            <div className="relative mt-5 flex flex-wrap gap-2">
              {project.techStack.map((tech) => (
                <span
                  key={tech}
                  className="rounded-full border border-white/[0.06] bg-white/[0.03] px-3 py-1.5 text-xs font-medium text-[#b0bec5]"
                >
                  {tech}
                </span>
              ))}
            </div>

            {/* Links */}
            <div className="relative mt-6 flex gap-5 border-t border-white/[0.04] pt-4">
              {project.link && (
                <a
                  href={project.link}
                  className="flex items-center gap-1.5 text-sm text-[#94a3b8] transition-colors hover:text-[#00f0ff]"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <ExternalLink size={15} /> Demo
                </a>
              )}
              {project.github && (
                <a
                  href={project.github}
                  className="flex items-center gap-1.5 text-sm text-[#94a3b8] transition-colors hover:text-[#a855f7]"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <GitHubIcon size={15} /> Code
                </a>
              )}
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
