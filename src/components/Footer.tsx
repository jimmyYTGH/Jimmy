import { GitHubIcon, LinkedInIcon, XIcon } from "./Icons";

export default function Footer() {
  return (
    <footer className="border-t border-[#00f0ff]/10 px-6 py-8">
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 sm:flex-row">
        <p className="text-sm text-[#94a3b8]">
          &copy; {new Date().getFullYear()} Your Name. All rights reserved.
        </p>

        <div className="flex items-center gap-4">
          <a
            href="https://github.com"
            target="_blank"
            rel="noopener noreferrer"
            className="text-[#94a3b8] transition-colors hover:text-[#00f0ff]"
            aria-label="GitHub"
          >
            <GitHubIcon />
          </a>
          <a
            href="https://linkedin.com"
            target="_blank"
            rel="noopener noreferrer"
            className="text-[#94a3b8] transition-colors hover:text-[#a855f7]"
            aria-label="LinkedIn"
          >
            <LinkedInIcon />
          </a>
          <a
            href="https://twitter.com"
            target="_blank"
            rel="noopener noreferrer"
            className="text-[#94a3b8] transition-colors hover:text-[#00f0ff]"
            aria-label="Twitter"
          >
            <XIcon />
          </a>
        </div>
      </div>
    </footer>
  );
}
