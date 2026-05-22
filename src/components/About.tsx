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
          关于我
        </span>
      </motion.h2>

      <motion.div
        className="mt-14 max-w-3xl"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={fadeInUp}
        custom={1}
      >
        <p className="text-lg leading-relaxed text-[#b0bec5] [text-wrap:balance]">
          游戏狂热爱好者 &nbsp; 轻度影迷 &nbsp; 长期间隙性努力受害者 &nbsp; INFP
        </p>
        <p className="mt-6 text-lg leading-relaxed text-[#b0bec5] [text-wrap:balance]">
          Vibe Coding 糕手 &nbsp; 没钱买 token 版电子游戏赤石大王 &nbsp; 靠电影音乐小猫续命 &nbsp; 妄图培养心性
        </p>
      </motion.div>
    </div>
  );
}
