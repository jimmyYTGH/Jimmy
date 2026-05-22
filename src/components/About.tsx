import { motion } from "framer-motion";

const fadeInUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.15, duration: 0.6 },
  }),
};

export default function About() {
  return (
    <div className="mx-auto max-w-5xl px-6 py-28">
      <motion.p
        className="font-mono text-sm tracking-[0.3em] text-[#00f0ff]/70"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={fadeInUp}
        custom={0}
      >
        ABOUT
      </motion.p>

      <motion.h2
        className="mt-3 font-heading text-4xl font-bold sm:text-5xl lg:text-6xl"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={fadeInUp}
        custom={0}
      >
        <span
          style={{
            background: "linear-gradient(135deg, #00f0ff, #a855f7)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
          }}
        >
          About Me
        </span>
      </motion.h2>

      <div className="mt-14 grid gap-10 md:grid-cols-5">
        {/* Main text - spans 3 cols */}
        <motion.div
          className="md:col-span-3"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeInUp}
          custom={1}
        >
          <p className="text-lg leading-relaxed text-[#b0bec5]">
            I'm a passionate full-stack developer who thrives at the
            intersection of engineering and design. I build performant,
            accessible, and beautiful digital experiences that users love.
          </p>
          <p className="mt-5 text-lg leading-relaxed text-[#b0bec5]">
            With deep experience across the modern web stack, I bring ideas
            from concept to production — always with clean code, thoughtful
            architecture, and pixel-perfect execution.
          </p>
        </motion.div>

        {/* Timeline cards - spans 2 cols */}
        <motion.div
          className="space-y-4 md:col-span-2"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeInUp}
          custom={2}
        >
          {[
            {
              year: "2024 - Present",
              title: "Full-Stack Developer",
              org: "Company Name",
              color: "#00f0ff",
            },
            {
              year: "Summer 2023",
              title: "Frontend Intern",
              org: "Company Name",
              color: "#a855f7",
            },
            {
              year: "2020 - 2024",
              title: "B.S. Computer Science",
              org: "University Name",
              color: "#00f0ff",
            },
          ].map((item, i) => (
            <div
              key={i}
              className="group relative overflow-hidden rounded-2xl border border-white/[0.06] bg-white/[0.03] p-5 transition-all duration-300 hover:bg-white/[0.06]"
              style={{ borderLeft: `2px solid ${item.color}40` }}
            >
              <span
                className="font-mono text-xs tracking-wider"
                style={{ color: item.color }}
              >
                {item.year}
              </span>
              <p className="mt-1 font-heading font-semibold text-white">
                {item.title}
              </p>
              <p className="text-sm text-[#94a3b8]">{item.org}</p>

              {/* Decorative dot */}
              <div
                className="absolute top-5 right-5 size-2 rounded-full opacity-40 transition-opacity group-hover:opacity-80"
                style={{ background: item.color }}
              />
            </div>
          ))}
        </motion.div>
      </div>
    </div>
  );
}
