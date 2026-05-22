import { useState, useEffect } from "react";
import { Menu, X } from "lucide-react";

const navLinks = [
  { label: "关于", href: "#about" },
  { label: "技能", href: "#skills" },
  { label: "项目", href: "#projects" },
  { label: "联系", href: "#contact" },
];

export default function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled
          ? "bg-[#0a1628]/70 backdrop-blur-2xl shadow-[0_4px_40px_rgba(0,240,255,0.06)]"
          : "bg-transparent"
      }`}
    >
      <nav className="mx-auto flex max-w-6xl items-center justify-between px-8 py-4">
        <a
          href="#hero"
          className="font-heading text-2xl font-bold tracking-tight"
          style={{
            background: "linear-gradient(135deg, #00f0ff 0%, #a855f7 50%, #00f0ff 100%)",
            backgroundSize: "200% 200%",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            filter: "drop-shadow(0 0 12px rgba(0,240,255,0.5))",
          }}
        >
          PANG LI
        </a>

        <ul className="hidden items-center gap-8 md:flex">
          {navLinks.map((link) => (
            <li key={link.href}>
              <a
                href={link.href}
                className="font-body text-sm font-medium tracking-wide text-[#b0bec5] transition-all duration-300 hover:text-[#00f0ff] hover:[text-shadow:0_0_20px_rgba(0,240,255,0.4)]"
              >
                {link.label}
              </a>
            </li>
          ))}
        </ul>

        <button
          className="text-[#b0bec5] transition-colors hover:text-[#00f0ff] md:hidden"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle menu"
        >
          {menuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </nav>

      {menuOpen && (
        <div className="bg-[#0a1628]/95 backdrop-blur-2xl md:hidden">
          <ul className="flex flex-col items-center gap-6 py-8">
            {navLinks.map((link) => (
              <li key={link.href}>
                <a
                  href={link.href}
                  className="font-body text-lg font-medium text-[#b0bec5] transition-colors hover:text-[#00f0ff]"
                  onClick={() => setMenuOpen(false)}
                >
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
        </div>
      )}
    </header>
  );
}
