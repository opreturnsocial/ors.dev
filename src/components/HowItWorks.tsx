export default function HowItWorks() {
  return (
    <section id="how-it-works" className="space-y-8">
      <div className="space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">How It Works</h2>
        <p className="text-muted-foreground text-lg">
          Four steps from thought to immutable record
        </p>
      </div>

      {/* Steps */}
      <div className="grid md:grid-cols-4 gap-4">
        {[
          { step: '01', title: 'Write', desc: 'Compose your message (up to 280 bytes)' },
          { step: '02', title: 'Sign', desc: 'Sign the payload with your Schnorr private key (BIP-340)' },
          { step: '03', title: 'Embed', desc: 'Package as OP_RETURN output data in a bitcoin transaction' },
          { step: '04', title: 'Broadcast', desc: 'Mine into a block - immutable on the bitcoin blockchain' },
        ].map(({ step, title, desc }) => (
          <div key={step} className="relative p-5 border border-border bg-card overflow-hidden rounded-none space-y-2">
            <div
              className="absolute -top-3 -right-2 text-7xl font-mono font-bold text-[#f7931a]/10 leading-none select-none pointer-events-none"
              aria-hidden
            >
              {step}
            </div>
            <div className="text-xs font-mono text-[#f7931a] tracking-widest">{step}</div>
            <div className="font-semibold">{title}</div>
            <div className="text-sm text-muted-foreground">{desc}</div>
          </div>
        ))}
      </div>

      {/* Wire formats */}
      <div className="space-y-4">
        <h3 className="text-xl font-semibold">Wire Formats</h3>
        <div className="grid md:grid-cols-2 gap-4">
          {/* v0 */}
          <div className="border border-border bg-card rounded-none overflow-hidden">
            <div className="flex items-center gap-2 px-4 py-2.5 border-b border-border bg-muted/30">
              <span className="font-mono font-bold text-xs text-[#f7931a] border border-[#f7931a]/40 px-1.5 py-0.5">v0</span>
              <span className="font-semibold text-sm">Single Transaction</span>
            </div>
            <div className="p-4 space-y-3">
              <p className="text-sm text-muted-foreground">
                Entire post in one OP_RETURN output.
              </p>
              <div className="font-mono text-xs bg-background border border-border rounded-none p-3 overflow-x-auto">
                <span className="text-[#f7931a]">ORS</span><span className="text-blue-400">0x00</span>{' '}
                <span className="text-green-500">pubkey[32]</span>{' '}
                <span className="text-purple-400">sig[64]</span>{' '}
                <span className="text-yellow-500">kind[1]</span>{' '}
                <span className="text-pink-400">content</span>
              </div>
            </div>
          </div>

          {/* v1 */}
          <div className="border border-border bg-card rounded-none overflow-hidden">
            <div className="flex items-center gap-2 px-4 py-2.5 border-b border-border bg-muted/30">
              <span className="font-mono font-bold text-xs text-[#f7931a] border border-[#f7931a]/40 px-1.5 py-0.5">v1</span>
              <span className="font-semibold text-sm">Chunked</span>
            </div>
            <div className="p-4 space-y-3">
              <p className="text-sm text-muted-foreground">
                Post split across multiple transactions with single 80-byte OP_RETURN outputs.
              </p>
              <div className="font-mono text-xs bg-background border border-border rounded-none p-3 space-y-1 overflow-x-auto">
                <div>
                  <span className="text-[#f7931a]">ORS</span><span className="text-blue-400">0x01</span>{' '}
                  <span className="text-muted-foreground">0x00</span>{' '}
                  <span className="text-red-400">0x02</span>{' '}
                  <span className="text-green-500">pubkey[32]</span>{' '}
                  <span className="text-purple-400">sig[0..42]</span>{' '}
                  <span className="text-muted-foreground/60">(chunk 0)</span>
                </div>
                <div>
                  <span className="text-[#f7931a]">ORS</span><span className="text-blue-400">0x01</span>{' '}
                  <span className="text-muted-foreground">0x01</span>{' '}
                  <span className="text-purple-400">sig[42..64]</span>{' '}
                  <span className="text-yellow-500">kind[1]</span>{' '}
                  <span className="text-pink-400">content[0..52]</span>{' '}
                  <span className="text-muted-foreground/60">(chunk 1)</span>
                </div>
                <div>
                  <span className="text-[#f7931a]">ORS</span><span className="text-blue-400">0x01</span>{' '}
                  <span className="text-muted-foreground">0x02</span>{' '}
                  <span className="text-pink-400">content[52..M]</span>{' '}
                  <span className="text-muted-foreground/60">(chunk 2)</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
