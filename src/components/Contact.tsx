import { motion } from "framer-motion";
import { Mail, Send } from "lucide-react";
import { GitHubIcon } from "./Icons";
import { useState, useEffect, type FormEvent } from "react";

interface SavedMessage {
  name: string;
  email: string;
  message: string;
  time: string;
}

const STORAGE_KEY = "portfolio_messages";

export default function Contact() {
  const [submitted, setSubmitted] = useState(false);
  const [messages, setMessages] = useState<SavedMessage[]>([]);
  const [showMessages, setShowMessages] = useState(false);

  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) setMessages(JSON.parse(saved));
    } catch {}
  }, []);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    const form = e.target as HTMLFormElement;
    const name = (form.elements.namedItem("name") as HTMLInputElement).value;
    const email = (form.elements.namedItem("email") as HTMLInputElement).value;
    const message = (form.elements.namedItem("message") as HTMLTextAreaElement).value;

    const newMsg: SavedMessage = {
      name,
      email,
      message,
      time: new Date().toLocaleString("zh-CN"),
    };

    const updated = [newMsg, ...messages];
    setMessages(updated);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    setSubmitted(true);
    form.reset();
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
          联系我
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
            有项目想合作，或者只是想打声招呼？欢迎随时联系我。
          </p>

          <div className="mt-10 space-y-5">
            <a
              href="mailto:3076528493@qq.com"
              className="group flex items-center gap-4 rounded-2xl border border-white/[0.04] bg-white/[0.02] p-4 transition-all duration-300 hover:bg-white/[0.04]"
            >
              <span className="text-[#00f0ff]"><Mail size={18} /></span>
              <span className="text-sm text-[#b0bec5] transition-colors group-hover:text-white">
                3076528493@qq.com
              </span>
            </a>

            <a
              href="https://github.com/jimmyYTGH"
              target="_blank"
              rel="noopener noreferrer"
              className="group flex items-center gap-4 rounded-2xl border border-white/[0.04] bg-white/[0.02] p-4 transition-all duration-300 hover:bg-white/[0.04]"
            >
              <span className="text-[#a855f7]"><GitHubIcon size={18} /></span>
              <span className="text-sm text-[#b0bec5] transition-colors group-hover:text-white">
                github.com/jimmyYTGH
              </span>
            </a>

            <button
              onClick={() => setShowMessages(!showMessages)}
              className="w-full rounded-2xl border border-white/[0.06] bg-white/[0.02] p-4 text-left text-sm text-[#94a3b8] transition-all duration-300 hover:bg-white/[0.04] hover:text-white"
            >
              {showMessages ? "隐藏已收留言" : `查看已收留言 (${messages.length})`}
            </button>
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
              name="name"
              placeholder="你的名字"
              required
              className="rounded-2xl border border-white/[0.06] bg-white/[0.03] px-5 py-3.5 text-sm text-white placeholder:text-[#64748b] outline-none transition-all duration-300 focus:border-[#00f0ff]/30 focus:bg-white/[0.05]"
            />
            <input
              type="email"
              name="email"
              placeholder="你的邮箱"
              required
              className="rounded-2xl border border-white/[0.06] bg-white/[0.03] px-5 py-3.5 text-sm text-white placeholder:text-[#64748b] outline-none transition-all duration-300 focus:border-[#00f0ff]/30 focus:bg-white/[0.05]"
            />
          </div>
          <textarea
            name="message"
            placeholder="你想说的话..."
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
            <span>{submitted ? "已发送！" : "发送消息"}</span>
            <span className="ml-auto text-white/30 transition-transform group-hover:translate-x-1">
              &rarr;
            </span>
          </button>
        </motion.form>
      </div>

      {/* Saved messages panel */}
      {showMessages && (
        <motion.div
          className="mt-10 space-y-3"
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          transition={{ duration: 0.4 }}
        >
          <h3 className="font-heading text-lg font-semibold text-[#e2e8f0]">已收留言</h3>
          {messages.length === 0 ? (
            <p className="text-sm text-[#64748b]">暂无留言</p>
          ) : (
            messages.map((msg, i) => (
              <div
                key={i}
                className="rounded-2xl border border-white/[0.06] bg-white/[0.02] p-5"
              >
                <div className="flex items-center justify-between">
                  <span className="font-medium text-white">{msg.name}</span>
                  <span className="text-xs text-[#64748b]">{msg.time}</span>
                </div>
                <p className="mt-1 text-sm text-[#94a3b8]">{msg.email}</p>
                <p className="mt-2 text-sm leading-relaxed text-[#b0bec5]">{msg.message}</p>
              </div>
            ))
          )}
        </motion.div>
      )}
    </div>
  );
}
