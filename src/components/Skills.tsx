import { motion } from "framer-motion";
import { skills, type Skill } from "../data/skills";

const categories: { key: Skill["category"]; label: string; color: string }[] = [
  { key: "frontend", label: "Frontend", color: "#00f0ff" },
  { key: "backend", label: "Backend", color: "#a855f7" },
  { key: "tools", label: "Tools", color: "#f0abfc" },
];

export default function Skills() {
  return (
    <section id="skills" className="px-6 py-24">
      <div className="mx-auto max-w-4xl">
        <motion.h2
          className="font-heading text-4xl font-bold sm:text-5xl"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.6 }}
        >
          <span className="bg-gradient-to-r from-[#00f0ff] to-[#a855f7] bg-clip-text text-transparent">
            Skills
          </span>
        </motion.h2>

        <div className="mt-10 space-y-10">
          {categories.map((cat) => (
            <div key={cat.key}>
              <h3
                className="font-heading text-lg font-semibold"
                style={{ color: cat.color }}
              >
                {cat.label}
              </h3>
              <div className="mt-4 grid gap-4 sm:grid-cols-2">
                {skills
                  .filter((s) => s.category === cat.key)
                  .map((skill, i) => (
                    <motion.div
                      key={skill.name}
                      className="rounded-lg border border-[#00f0ff]/10 bg-[#0f172a]/50 p-4"
                      initial={{ opacity: 0, x: -20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true, margin: "-40px" }}
                      transition={{ delay: i * 0.1, duration: 0.4 }}
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-medium text-white">
                          {skill.name}
                        </span>
                        <span className="text-sm text-[#94a3b8]">
                          {skill.level}%
                        </span>
                      </div>
                      <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-white/5">
                        <motion.div
                          className="h-full rounded-full"
                          style={{
                            backgroundColor: cat.color,
                            boxShadow: `0 0 10px ${cat.color}`,
                          }}
                          initial={{ width: 0 }}
                          whileInView={{ width: `${skill.level}%` }}
                          viewport={{ once: true, margin: "-40px" }}
                          transition={{ delay: i * 0.1 + 0.2, duration: 0.8 }}
                        />
                      </div>
                    </motion.div>
                  ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
