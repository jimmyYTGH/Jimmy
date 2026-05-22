import { motion } from "framer-motion";
import { ExternalLink } from "lucide-react";
import { GitHubIcon } from "./Icons";
import { projects } from "../data/projects";

export default function Projects() {
  return (
    <section id="projects" className="px-6 py-24">
      <div className="mx-auto max-w-6xl">
        <motion.h2
          className="font-heading text-4xl font-bold sm:text-5xl"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.6 }}
        >
          <span className="bg-gradient-to-r from-[#00f0ff] to-[#a855f7] bg-clip-text text-transparent">
            Projects
          </span>
        </motion.h2>

        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {projects.map((project, i) => (
            <motion.div
              key={project.id}
              className="group rounded-xl border border-[#00f0ff]/10 bg-[#0f172a]/50 p-6 transition-all hover:-translate-y-2 hover:border-[#00f0ff]/30 hover:shadow-[0_0_40px_rgba(0,240,255,0.1)]"
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ delay: i * 0.15, duration: 0.5 }}
            >
              {/* Project image placeholder */}
              <div className="mb-4 aspect-video overflow-hidden rounded-lg bg-gradient-to-br from-[#00f0ff]/10 to-[#a855f7]/10">
                <div className="flex h-full items-center justify-center text-2xl text-[#00f0ff]/30">
                  {"< />"}
                </div>
              </div>

              <h3 className="font-heading text-xl font-semibold text-white group-hover:text-[#00f0ff] transition-colors">
                {project.name}
              </h3>

              <p className="mt-2 text-sm leading-relaxed text-[#94a3b8]">
                {project.description}
              </p>

              <div className="mt-4 flex flex-wrap gap-2">
                {project.techStack.map((tech) => (
                  <span
                    key={tech}
                    className="rounded-full border border-[#00f0ff]/20 bg-[#00f0ff]/5 px-3 py-1 text-xs text-[#00f0ff]"
                  >
                    {tech}
                  </span>
                ))}
              </div>

              <div className="mt-5 flex gap-4">
                {project.link && (
                  <a
                    href={project.link}
                    className="flex items-center gap-1 text-sm text-[#94a3b8] transition-colors hover:text-[#00f0ff]"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <ExternalLink size={16} /> Demo
                  </a>
                )}
                {project.github && (
                  <a
                    href={project.github}
                    className="flex items-center gap-1 text-sm text-[#94a3b8] transition-colors hover:text-[#a855f7]"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <GitHubIcon /> Code
                  </a>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
