export default function Hero() {
  return (
    <section className="relative text-center space-y-6 -mx-4 px-4 py-20 md:py-28 rounded-xl overflow-hidden bg-dots">
      {/* Subtle gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-background/20 via-transparent to-background/60 pointer-events-none" />

      <div className="relative space-y-6">
        {/* Main heading */}
        <h1 className="font-mono text-3xl md:text-7xl leading-none">
          OP_RETURN{' '}
          <span
            className="text-[#f7931a]"
            style={{ textShadow: '0 0 40px rgba(247,147,26,0.4), 0 0 80px rgba(247,147,26,0.15)' }}
          >
            SOCIAL
          </span>
        </h1>

        <p className="text-lg md:text-xl text-muted-foreground max-w-xl mx-auto">
          A permissionless social protocol built on bitcoin
        </p>

        {/* CTA buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
          <a
            href="https://github.com/opreturnsocial/ors/blob/master/ORS-01.md"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center px-7 py-3 rounded-none bg-[#f7931a] hover:bg-[#e8851a] text-white font-semibold text-sm transition-colors tracking-wide"
          >
            Build on ORS
          </a>
          <a
            href="#how-it-works"
            className="inline-flex items-center justify-center px-7 py-3 rounded-none border border-[#f7931a]/40 bg-transparent hover:bg-[#f7931a]/5 hover:border-[#f7931a]/70 text-sm font-medium transition-colors tracking-wide"
          >
            How It Works
          </a>
        </div>
      </div>
    </section>
  );
}
