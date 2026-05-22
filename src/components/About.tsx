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
    <section id="about" className="relative px-6 py-24">
      <div className="mx-auto max-w-4xl">
        <motion.h2
          className="font-heading text-4xl font-bold sm:text-5xl"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-80px" }}
          variants={fadeInUp}
          custom={0}
        >
          <span className="bg-gradient-to-r from-[#00f0ff] to-[#a855f7] bg-clip-text text-transparent">
            About Me
          </span>
        </motion.h2>

        <motion.div
          className="mt-10 grid gap-8 md:grid-cols-2"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-80px" }}
        >
          <motion.div variants={fadeInUp} custom={1}>
            <h3 className="font-heading text-xl font-semibold text-[#00f0ff]">
              Who I Am
            </h3>
            <p className="mt-4 leading-relaxed text-[#94a3b8]">
              I'm a passionate full-stack developer with a keen eye for design
              and user experience. I love building products that make a
              difference, combining clean code with beautiful interfaces.
            </p>
            <p className="mt-4 leading-relaxed text-[#94a3b8]">
              With experience across the entire development stack, I bridge the
              gap between design and engineering to create seamless digital
              experiences.
            </p>
          </motion.div>

          <motion.div variants={fadeInUp} custom={2}>
            <h3 className="font-heading text-xl font-semibold text-[#a855f7]">
              Education & Experience
            </h3>
            <ul className="mt-4 space-y-4">
              <li className="rounded-lg border border-[#00f0ff]/10 bg-[#0f172a]/50 p-4">
                <p className="font-medium text-white">B.S. Computer Science</p>
                <p className="text-sm text-[#94a3b8]">
                  University Name • 2020 - 2024
                </p>
              </li>
              <li className="rounded-lg border border-[#a855f7]/10 bg-[#0f172a]/50 p-4">
                <p className="font-medium text-white">Full-Stack Developer</p>
                <p className="text-sm text-[#94a3b8]">
                  Company Name • 2024 - Present
                </p>
              </li>
              <li className="rounded-lg border border-[#00f0ff]/10 bg-[#0f172a]/50 p-4">
                <p className="font-medium text-white">Frontend Intern</p>
                <p className="text-sm text-[#94a3b8]">
                  Company Name • Summer 2023
                </p>
              </li>
            </ul>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
