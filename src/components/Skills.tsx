import { motion } from "framer-motion";
import { skills } from "../data/skills";

const colors = ["#00f0ff", "#a855f7", "#f0abfc", "#22d3ee", "#c084fc", "#67e8f9", "#e879f9"];

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
          技能
        </span>
      </motion.h2>

      <div className="mt-14 grid gap-4 sm:grid-cols-2">
        {skills.map((skill, i) => (
          <motion.div
            key={skill.name}
            className="group relative overflow-hidden rounded-2xl border border-white/[0.04] bg-white/[0.02] p-5 transition-all duration-300 hover:bg-white/[0.04]"
            initial={{ opacity: 0, x: -15 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.08, duration: 0.4 }}
          >
            <div className="flex items-center justify-between">
              <span className="font-medium text-[#e2e8f0]">{skill.name}</span>
              <span className="text-xs text-[#94a3b8]">{skill.level}%</span>
            </div>
            <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-white/[0.05]">
              <motion.div
                className="h-full rounded-full"
                style={{
                  background: `linear-gradient(90deg, ${colors[i % colors.length]}, ${colors[(i + 1) % colors.length]})`,
                  boxShadow: `0 0 12px ${colors[i % colors.length]}40`,
                }}
                initial={{ width: 0 }}
                whileInView={{ width: `${skill.level}%` }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 + 0.3, duration: 0.9, ease: "easeOut" }}
              />
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
