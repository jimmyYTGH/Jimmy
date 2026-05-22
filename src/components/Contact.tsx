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
    <section id="contact" className="px-6 py-24">
      <div className="mx-auto max-w-4xl">
        <motion.h2
          className="font-heading text-center text-4xl font-bold sm:text-5xl"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.6 }}
        >
          <span className="bg-gradient-to-r from-[#00f0ff] to-[#a855f7] bg-clip-text text-transparent">
            Get In Touch
          </span>
        </motion.h2>

        <div className="mt-10 grid gap-10 md:grid-cols-2">
          {/* Contact info */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.6 }}
          >
            <p className="text-[#94a3b8]">
              Have a project in mind or just want to say hi? Feel free to reach
              out — I'm always open to new opportunities and collaborations.
            </p>

            <div className="mt-8 space-y-4">
              <a
                href="mailto:your@email.com"
                className="flex items-center gap-3 text-[#94a3b8] transition-colors hover:text-[#00f0ff]"
              >
                <Mail size={20} />
                <span>your@email.com</span>
              </a>
              <a
                href="https://github.com"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 text-[#94a3b8] transition-colors hover:text-[#a855f7]"
              >
                <GitHubIcon />
                <span>github.com/yourusername</span>
              </a>
              <a
                href="https://linkedin.com"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 text-[#94a3b8] transition-colors hover:text-[#00f0ff]"
              >
                <LinkedInIcon />
                <span>linkedin.com/in/yourusername</span>
              </a>
            </div>
          </motion.div>

          {/* Contact form */}
          <motion.form
            onSubmit={handleSubmit}
            className="space-y-4"
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.6 }}
          >
            <input
              type="text"
              placeholder="Your Name"
              required
              className="w-full rounded-lg border border-[#00f0ff]/20 bg-[#0f172a]/50 px-4 py-3 text-white placeholder:text-[#94a3b8]/60 outline-none transition-colors focus:border-[#00f0ff]/50"
            />
            <input
              type="email"
              placeholder="Your Email"
              required
              className="w-full rounded-lg border border-[#00f0ff]/20 bg-[#0f172a]/50 px-4 py-3 text-white placeholder:text-[#94a3b8]/60 outline-none transition-colors focus:border-[#00f0ff]/50"
            />
            <textarea
              placeholder="Your Message"
              required
              rows={4}
              className="w-full resize-none rounded-lg border border-[#00f0ff]/20 bg-[#0f172a]/50 px-4 py-3 text-white placeholder:text-[#94a3b8]/60 outline-none transition-colors focus:border-[#00f0ff]/50"
            />
            <button
              type="submit"
              className="flex items-center gap-2 rounded-lg bg-gradient-to-r from-[#00f0ff] to-[#a855f7] px-6 py-3 font-medium text-[#020617] transition-all hover:shadow-[0_0_30px_rgba(0,240,255,0.3)]"
            >
              <Send size={18} />
              {submitted ? "Message Sent!" : "Send Message"}
            </button>
          </motion.form>
        </div>
      </div>
    </section>
  );
}
