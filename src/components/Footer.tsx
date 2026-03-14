export default function Footer() {
  return (
    <footer className="border-t border-border/50 mt-24">
      <div className="max-w-6xl mx-auto px-4 py-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-muted-foreground">
        <div className="flex items-center gap-3">
          <span className="font-mono font-bold text-[#f7931a] text-sm">ORS</span>
          <span className="text-border/60">|</span>
          <span className="text-muted-foreground">Freedom is not free</span>
        </div>
        <a
          href="https://github.com/opreturnsocial/ors/blob/master/ORS-01.md"
          target="_blank"
          rel="noopener noreferrer"
          className="font-mono tracking-wide hover:text-[#f7931a] transition-colors"
        >
          Build on ORS →
        </a>
      </div>
    </footer>
  );
}
