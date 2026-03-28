export default function HybridModel() {
  return (
    <section className="space-y-8">
      <div className="space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">Hybrid Model</h2>
        <p className="text-muted-foreground text-lg">
          Not all data needs to go on mainnet.
        </p>
      </div>

      <p className="text-sm text-muted-foreground max-w-2xl">
        ORS works on both bitcoin mainnet and Mutinynet. Each network has
        different trade-offs - apps and users choose where to anchor their data
        based on what matters most to them.
      </p>

      <div className="space-y-0">
        {/* Two-column comparison */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-0">
          {/* Mainnet */}
          <div className="border border-border bg-card p-6 space-y-3">
            <div className="flex items-center gap-3">
              <div className="w-2 h-2 bg-[#f7931a] rounded-sm" />
              <span className="text-xs font-mono tracking-widest text-[#f7931a] uppercase">
                Mainnet
              </span>
            </div>
            <h3 className="font-semibold">Bitcoin Mainnet</h3>
            <ul className="space-y-1.5 text-sm text-muted-foreground">
              <li className="flex items-start gap-2">
                <span className="text-green-500 mt-0.5">+</span>
                <span>Permissionless and censorship-resistant</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-500 mt-0.5">+</span>
                <span>Globally recognised, highest security</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-red-500 mt-0.5">-</span>
                <span>Paid - requires real sats per transaction</span>
              </li>
            </ul>
          </div>

          {/* Mutinynet */}
          <div className="border border-border bg-card p-6 space-y-3 md:border-l-0">
            <div className="flex items-center gap-3">
              <div className="w-2 h-2 bg-[#f61d5b] rounded-sm" />
              <span className="text-xs font-mono tracking-widest text-[#f61d5b] uppercase">
                Mutinynet
              </span>
            </div>
            <h3 className="font-semibold">Mutinynet</h3>
            <ul className="space-y-1.5 text-sm text-muted-foreground">
              <li className="flex items-start gap-2">
                <span className="text-green-500 mt-0.5">+</span>
                <span>Free - no transaction fees</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-500 mt-0.5">+</span>
                <span>Fast - rapid block times</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-red-500 mt-0.5">-</span>
                <span>Federated signet network</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Connector */}
        <div className="flex justify-center py-0">
          <div className="w-px h-6 bg-border" />
        </div>

        {/* Hybrid strategy */}
        <div className="border border-border bg-card p-6 space-y-2">
          <div className="flex items-center gap-3">
            <div className="w-2 h-2 bg-muted-foreground/40 rounded-sm" />
            <span className="text-xs font-mono tracking-widest text-muted-foreground uppercase">
              Hybrid Strategy
            </span>
          </div>
          <h3 className="font-semibold">Use both networks together</h3>
          <p className="text-sm text-muted-foreground max-w-2xl">
            The app or user decides what to anchor where. Not all data needs the
            guarantees of mainnet. High-frequency or low-stakes activity can
            flow freely on Mutinynet, while trust-critical data gets the
            permanence and censorship-resistance of mainnet.
          </p>
        </div>
      </div>
    </section>
  );
}
