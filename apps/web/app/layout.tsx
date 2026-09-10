import type { Metadata } from "next";
import Link from "next/link";
import "./globals.css";

export const metadata: Metadata = {
  title: "InterviewForge AI",
  description: "Fresh company interview intelligence and adaptive practice.",
};

const nav = [
  ["Questions", "/questions"],
  ["Companies", "/companies/openai"],
  ["Practice", "/practice/rate-limiter-design"],
  ["Forum", "/forum"],
] as const;

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>
        <header className="nav-shell">
          <nav className="nav container">
            <Link href="/" className="brand"><span className="brand-mark">IF</span><span>InterviewForge</span></Link>
            <div className="nav-links">{nav.map(([label, href]) => <Link key={href} href={href}>{label}</Link>)}</div>
            <Link className="button ghost small" href="/questions">Start preparing</Link>
          </nav>
        </header>
        {children}
        <footer className="footer container">
          <div><strong>InterviewForge AI</strong><p>Clean-room interview intelligence built around evidence, freshness and candidate outcomes.</p></div>
          <div className="footer-links"><Link href="/questions">Question bank</Link><Link href="/forum">Community</Link><a href="https://github.com/rrahul0904/interviewforge-ai">GitHub</a></div>
        </footer>
      </body>
    </html>
  );
}
