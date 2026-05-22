import { motion } from "framer-motion";
import { ChevronDown } from "lucide-react";

export default function Hero() {
  return (
    <section
      id="hero"
      className="relative flex min-h-screen flex-col items-center justify-center px-6 text-center"
    >
      {/* Holographic 3D decoration */}
      <motion.div
        className="absolute top-1/4 left-1/2 -translate-x-1/2"
        animate={{ rotateX: [0, 360], rotateY: [0, 360] }}
        transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
      >
        <div className="size-64 rounded-full border border-[#00f0ff]/20 bg-gradient-to-br from-[#00f0ff]/10 to-[#a855f7]/10 blur-xl" />
      </motion.div>

      <motion.div
        className="relative z-10"
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
      >
        <p className="font-mono text-sm tracking-[0.3em] text-[#00f0ff]">
          HELLO, I AM
        </p>

        <h1 className="mt-4 font-heading text-5xl font-bold leading-tight tracking-tight sm:text-6xl lg:text-7xl">
          <span className="bg-gradient-to-r from-[#00f0ff] to-[#a855f7] bg-clip-text text-transparent">
            Your Name
          </span>
        </h1>

        <p className="mt-6 max-w-xl text-lg text-[#94a3b8] sm:text-xl">
          Full-Stack Developer & Creative Coder — building digital experiences
          at the intersection of design and technology.
        </p>

        <div className="mt-8 flex items-center justify-center gap-4">
          <a
            href="#projects"
            className="rounded-lg border border-[#00f0ff]/50 bg-[#00f0ff]/10 px-6 py-3 font-medium text-[#00f0ff] transition-all hover:bg-[#00f0ff]/20 hover:shadow-[0_0_30px_rgba(0,240,255,0.3)]"
          >
            View Projects
          </a>
          <a
            href="#contact"
            className="rounded-lg border border-[#a855f7]/50 bg-[#a855f7]/10 px-6 py-3 font-medium text-[#a855f7] transition-all hover:bg-[#a855f7]/20 hover:shadow-[0_0_30px_rgba(168,85,247,0.3)]"
          >
            Contact Me
          </a>
        </div>
      </motion.div>

      {/* Scroll indicator */}
      <motion.a
        href="#about"
        className="absolute bottom-8 text-[#94a3b8]"
        animate={{ y: [0, 8, 0] }}
        transition={{ duration: 2, repeat: Infinity }}
      >
        <ChevronDown size={32} />
      </motion.a>
    </section>
  );
}
