export default function WhatIsORS() {
  return (
    <section className="space-y-8">
      <div className="space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">What is ORS?</h2>
        <p className="text-muted-foreground text-lg">
          Social posts embedded directly in the bitcoin blockchain
        </p>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        {[
          {
            title: 'Permissionless',
            desc: 'No accounts, no servers, no tokens. Post by broadcasting a bitcoin transaction with an OP_RETURN output.',
          },
          {
            title: 'Cryptographically Signed',
            desc: 'Every post is signed with a Schnorr key (BIP-340) - the same signature scheme used by bitcoin taproot.',
          },
          {
            title: 'On-Chain Forever',
            desc: 'Posts are stored in OP_RETURN outputs on the bitcoin blockchain. Immutable and censorship-resistant.',
          },
        ].map(({ title, desc }) => (
          <div key={title} className="space-y-3 p-6 border-l-2 border-[#f7931a] border border-border bg-card rounded-none">
            <div className="w-4 h-4 bg-[#f7931a] rounded-sm" />
            <h3 className="font-semibold">{title}</h3>
            <p className="text-sm text-muted-foreground">{desc}</p>
          </div>
        ))}
      </div>

      <div className="p-6 border-l-2 border-[#f7931a] border border-border bg-muted/30 rounded-none space-y-4">
        <h3 className="font-semibold text-lg">Pronunciation Guide</h3>
        <div className="flex flex-col gap-3">
          <div className="flex items-center gap-3">
            <span className="font-mono text-sm bg-[#f7931a] text-white px-2 py-0.5 w-48 text-center inline-block">ORS Protocol Specs</span>
            <span className="text-muted-foreground text-sm">pronounced <em>"oars"</em> - like rowing oars</span>
          </div>
          <div className="flex items-center gap-3">
            <span className="font-mono text-sm border border-border px-2 py-0.5 w-48 text-center inline-block">ORK Kind Registry</span>
            <span className="text-muted-foreground text-sm">pronounced <em>"orc"</em> - like the fantasy creature</span>
          </div>
        </div>
      </div>
    </section>
  );
}
