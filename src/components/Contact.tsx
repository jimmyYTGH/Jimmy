import { motion } from "framer-motion";
import { Mail, Send } from "lucide-react";
import { GitHubIcon, LinkedInIcon } from "./Icons";
import { useState, type FormEvent } from "react";

export default function Contact() {
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="mx-auto max-w-5xl px-6 py-28">
      <motion.p
        className="font-mono text-sm tracking-[0.3em] text-[#a855f7]/70"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
      >
        CONTACT
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
          Get In Touch
        </span>
      </motion.h2>

      <div className="mt-14 grid gap-12 md:grid-cols-5">
        {/* Left: contact info */}
        <motion.div
          className="md:col-span-2"
          initial={{ opacity: 0, x: -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <p className="text-lg leading-relaxed text-[#b0bec5]">
            Have a project in mind or just want to say hi? I'm always open to
            new opportunities and collaborations.
          </p>

          <div className="mt-10 space-y-5">
            {[
              {
                icon: <Mail size={18} />,
                label: "your@email.com",
                href: "mailto:your@email.com",
                color: "#00f0ff",
              },
              {
                icon: <GitHubIcon size={18} />,
                label: "github.com/jimmyYTGH",
                href: "https://github.com/jimmyYTGH",
                color: "#a855f7",
              },
              {
                icon: <LinkedInIcon size={18} />,
                label: "linkedin.com/in/yourusername",
                href: "https://linkedin.com",
                color: "#00f0ff",
              },
            ].map((item, i) => (
              <a
                key={i}
                href={item.href}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex items-center gap-4 rounded-2xl border border-white/[0.04] bg-white/[0.02] p-4 transition-all duration-300 hover:bg-white/[0.04]"
              >
                <span
                  className="transition-colors duration-300"
                  style={{ color: item.color }}
                >
                  {item.icon}
                </span>
                <span className="text-sm text-[#b0bec5] transition-colors group-hover:text-white">
                  {item.label}
                </span>
              </a>
            ))}
          </div>
        </motion.div>

        {/* Right: form */}
        <motion.form
          onSubmit={handleSubmit}
          className="space-y-5 md:col-span-3"
          initial={{ opacity: 0, x: 20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <div className="grid gap-5 sm:grid-cols-2">
            <input
              type="text"
              placeholder="Your Name"
              required
              className="rounded-2xl border border-white/[0.06] bg-white/[0.03] px-5 py-3.5 text-sm text-white placeholder:text-[#64748b] outline-none transition-all duration-300 focus:border-[#00f0ff]/30 focus:bg-white/[0.05]"
            />
            <input
              type="email"
              placeholder="Your Email"
              required
              className="rounded-2xl border border-white/[0.06] bg-white/[0.03] px-5 py-3.5 text-sm text-white placeholder:text-[#64748b] outline-none transition-all duration-300 focus:border-[#00f0ff]/30 focus:bg-white/[0.05]"
            />
          </div>
          <textarea
            placeholder="Your Message"
            required
            rows={5}
            className="w-full resize-none rounded-2xl border border-white/[0.06] bg-white/[0.03] px-5 py-3.5 text-sm text-white placeholder:text-[#64748b] outline-none transition-all duration-300 focus:border-[#00f0ff]/30 focus:bg-white/[0.05]"
          />
          <button
            type="submit"
            className="group flex items-center gap-3 rounded-2xl px-8 py-4 font-medium text-[#020617] transition-all duration-300 hover:scale-[1.02] active:scale-[0.98]"
            style={{ background: "linear-gradient(135deg, #00f0ff, #a855f7)" }}
          >
            <Send size={17} />
            <span>{submitted ? "Message Sent!" : "Send Message"}</span>
            <span className="ml-auto text-white/30 transition-transform group-hover:translate-x-1">
              &rarr;
            </span>
          </button>
        </motion.form>
      </div>
    </div>
  );
}
