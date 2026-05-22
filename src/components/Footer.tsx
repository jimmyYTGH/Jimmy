import { GitHubIcon, LinkedInIcon, XIcon } from "./Icons";

const socials = [
  { icon: <GitHubIcon size={18} />, label: "GitHub", href: "https://github.com/jimmyYTGH", color: "#00f0ff" },
  { icon: <LinkedInIcon size={18} />, label: "LinkedIn", href: "https://linkedin.com", color: "#a855f7" },
  { icon: <XIcon size={18} />, label: "X", href: "https://twitter.com", color: "#00f0ff" },
];

export default function Footer() {
  return (
    <footer className="border-t border-white/[0.04] px-6 py-10">
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-6 sm:flex-row">
        <p className="text-sm text-[#64748b]">
          &copy; {new Date().getFullYear()} 庞力. All rights reserved.
        </p>

        <div className="flex items-center gap-1">
          {socials.map((s) => (
            <a
              key={s.label}
              href={s.href}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-xl p-2.5 text-[#64748b] transition-all duration-300 hover:bg-white/[0.05]"
              style={{ "--hover-color": s.color } as React.CSSProperties}
              onMouseEnter={(e) => (e.currentTarget.style.color = s.color)}
              onMouseLeave={(e) => (e.currentTarget.style.color = "")}
              aria-label={s.label}
            >
              {s.icon}
            </a>
          ))}
        </div>
      </div>
    </footer>
  );
}
