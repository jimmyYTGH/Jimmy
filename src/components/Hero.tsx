import { motion } from "framer-motion";
import { ChevronDown } from "lucide-react";

export default function Hero() {
  return (
    <section
      id="hero"
      className="relative flex min-h-screen flex-col items-center justify-center px-6 text-center"
    >
      {/* Decorative blobs */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <motion.div
          className="absolute -top-20 left-1/4 size-72 rounded-full opacity-30 blur-3xl"
          style={{ background: "radial-gradient(circle, rgba(0,240,255,0.2), transparent)" }}
          animate={{ y: [-20, 20, -20], scale: [1, 1.05, 1] }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute top-1/3 right-1/4 size-96 rounded-full opacity-25 blur-3xl"
          style={{ background: "radial-gradient(circle, rgba(168,85,247,0.25), transparent)" }}
          animate={{ y: [20, -20, 20], scale: [1, 0.95, 1] }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute bottom-1/4 left-1/3 size-64 rounded-full opacity-15 blur-3xl"
          style={{ background: "radial-gradient(circle, rgba(0,240,255,0.3), transparent)" }}
          animate={{ x: [-30, 30, -30], y: [10, -10, 10] }}
          transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
        />
      </div>

      <motion.div
        className="relative z-10"
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
      >
        <motion.p
          className="font-mono text-sm tracking-[0.35em] text-[#00f0ff]/80"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          HELLO, I AM
        </motion.p>

        <h1 className="mt-6 font-heading text-5xl font-bold leading-tight tracking-tight sm:text-6xl lg:text-7xl">
          <span
            className="inline-block"
            style={{
              background: "linear-gradient(135deg, #00f0ff 0%, #a855f7 40%, #00f0ff 100%)",
              backgroundSize: "200% auto",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              animation: "shimmer 4s linear infinite",
            }}
          >
            Your Name
          </span>
        </h1>

        <p className="mx-auto mt-6 max-w-xl text-lg leading-relaxed text-[#94a3b8] sm:text-xl">
          Full-Stack Developer & Creative Coder — building digital experiences
          at the intersection of design and technology.
        </p>

        <div className="mt-10 flex items-center justify-center gap-5">
          <a
            href="#projects"
            className="group relative overflow-hidden rounded-2xl px-8 py-3.5 font-medium text-[#020617] transition-all duration-300 hover:scale-105"
            style={{ background: "linear-gradient(135deg, #00f0ff, #06b6d4)" }}
          >
            <span className="relative z-10">View Projects</span>
            <div className="absolute inset-0 z-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
              style={{ background: "linear-gradient(135deg, #22d3ee, #a855f7)" }} />
          </a>
          <a
            href="#contact"
            className="rounded-2xl border border-[#a855f7]/40 px-8 py-3.5 font-medium text-[#a855f7] transition-all duration-300 hover:border-[#a855f7]/80 hover:bg-[#a855f7]/10 hover:scale-105"
          >
            Contact Me
          </a>
        </div>
      </motion.div>

      <motion.a
        href="#about"
        className="absolute bottom-10 text-[#94a3b8]/60"
        animate={{ y: [0, 8, 0] }}
        transition={{ duration: 2, repeat: Infinity }}
      >
        <ChevronDown size={28} />
      </motion.a>

      {/* Shimmer keyframes */}
      <style>{`
        @keyframes shimmer {
          0%, 100% { background-position: 0% center; }
          50% { background-position: 200% center; }
        }
      `}</style>
    </section>
  );
}
