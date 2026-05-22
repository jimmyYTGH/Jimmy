import { motion } from "framer-motion";
import { skills, type Skill } from "../data/skills";

const categoryConfig: Record<
  Skill["category"],
  { label: string; color: string; glow: string }
> = {
  frontend: { label: "Frontend", color: "#00f0ff", glow: "rgba(0,240,255,0.4)" },
  backend: { label: "Backend", color: "#a855f7", glow: "rgba(168,85,247,0.4)" },
  tools: { label: "Tools & Others", color: "#f0abfc", glow: "rgba(240,171,252,0.3)" },
};

export default function Skills() {
  return (
    <div className="mx-auto max-w-5xl px-6 py-28">
      <motion.p
        className="font-mono text-sm tracking-[0.3em] text-[#a855f7]/70"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
      >
        SKILLS
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
            background: "linear-gradient(135deg, #a855f7, #00f0ff)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
          }}
        >
          Skills
        </span>
      </motion.h2>

      <div className="mt-14 space-y-14">
        {Object.entries(categoryConfig).map(([key, cat]) => (
          <div key={key}>
            <h3
              className="font-heading text-lg font-semibold tracking-wide"
              style={{ color: cat.color }}
            >
              {cat.label}
            </h3>

            <div className="mt-5 grid gap-4 sm:grid-cols-2">
              {skills
                .filter((s) => s.category === key)
                .map((skill, i) => (
                  <motion.div
                    key={skill.name}
                    className="group relative overflow-hidden rounded-2xl border border-white/[0.04] bg-white/[0.02] p-4 transition-all duration-300 hover:bg-white/[0.04]"
                    initial={{ opacity: 0, x: -15 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.08, duration: 0.4 }}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-medium text-[#e2e8f0]">
                        {skill.name}
                      </span>
                      <span className="text-xs text-[#94a3b8]">
                        {skill.level}%
                      </span>
                    </div>

                    {/* Progress track */}
                    <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-white/[0.05]">
                      <motion.div
                        className="h-full rounded-full"
                        style={{
                          background: `linear-gradient(90deg, ${cat.color}, ${cat.glow})`,
                          boxShadow: `0 0 12px ${cat.glow}`,
                        }}
                        initial={{ width: 0 }}
                        whileInView={{ width: `${skill.level}%` }}
                        viewport={{ once: true }}
                        transition={{
                          delay: i * 0.08 + 0.3,
                          duration: 0.9,
                          ease: "easeOut",
                        }}
                      />
                    </div>
                  </motion.div>
                ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
