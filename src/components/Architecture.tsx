export default function Architecture() {
  return (
    <section className="space-y-8">
      <div className="space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">Optional Infrastructure</h2>
        <p className="text-muted-foreground text-lg">
          bitcoin is the source of truth. Everything else is optional.
        </p>
      </div>

      <p className="text-sm text-muted-foreground max-w-2xl">
        The ORS protocol works with nothing but a bitcoin node. Two optional layers improve the experience for everyday users - but if either disappears, all data remains intact on-chain.
      </p>

      {/* Tiered diagram */}
      <div className="space-y-0">
        {/* Facilitator - top */}
        <div className="border border-border bg-card p-6 space-y-2">
          <div className="flex items-center gap-3">
            <div className="w-2 h-2 bg-muted-foreground/40 rounded-sm" />
            <span className="text-xs font-mono tracking-widest text-muted-foreground uppercase">Optional - Write Layer</span>
          </div>
          <h3 className="font-semibold">Facilitator</h3>
          <p className="text-sm text-muted-foreground">
            A Lightning-powered relay that accepts Lightning payments and broadcasts bitcoin transactions on the user's behalf - enabling posting without holding on-chain bitcoin. The facilitator never sees your private key and cannot alter content; every post is Schnorr-signed by the author before submission. If the facilitator goes offline, users broadcast directly.
          </p>
        </div>

        {/* Connector */}
        <div className="flex justify-center py-0">
          <div className="w-px h-6 bg-border" />
        </div>

        {/* Cache - middle */}
        <div className="border border-border bg-card p-6 space-y-2">
          <div className="flex items-center gap-3">
            <div className="w-2 h-2 bg-muted-foreground/40 rounded-sm" />
            <span className="text-xs font-mono tracking-widest text-muted-foreground uppercase">Optional - Read Layer</span>
          </div>
          <h3 className="font-semibold">Cache</h3>
          <p className="text-sm text-muted-foreground">
            Indexes OP_RETURN data so clients can fetch feeds without scanning the full chain. Can be self-hosted or used from a third party. If a cache disappears, all data is still retrievable directly from bitcoin - the cache is a performance optimisation, not a store of record.
          </p>
        </div>

        {/* Connector */}
        <div className="flex justify-center py-0">
          <div className="w-px h-6 bg-[#f7931a]" />
        </div>

        {/* Bitcoin - base */}
        <div className="border-l-4 border-[#f7931a] border border-border bg-[#f7931a]/5 p-6 space-y-2">
          <div className="flex items-center gap-3">
            <div className="w-2 h-2 bg-[#f7931a] rounded-sm" />
            <span className="text-xs font-mono tracking-widest text-[#f7931a] uppercase">Foundation - Source of Truth</span>
          </div>
          <h3 className="font-semibold">bitcoin</h3>
          <p className="text-sm text-muted-foreground">
            All ORS posts live as OP_RETURN outputs in bitcoin transactions. The blockchain is the only authoritative record. No server, no cache, no facilitator can alter or delete what's on-chain.
          </p>
        </div>
      </div>
    </section>
  );
}
