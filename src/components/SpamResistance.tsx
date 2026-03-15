export default function SpamResistance() {
  return (
    <section className="space-y-8">
      <div className="space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">Spam Resistance</h2>
        <p className="text-muted-foreground text-lg">
          Economic friction and social filtering work together
        </p>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        {[
          {
            title: 'Proof of Work',
            desc: 'Every post requires a real bitcoin transaction fee. Spamming 10,000 posts costs 10,000 fees. No free accounts, no disposable identities at zero cost - the economic barrier is enforced by the network itself.',
          },
          {
            title: 'Bots Are Welcome',
            desc: 'Unlike KYC-gated platforms, ORS treats bots as first-class citizens. Bots can optionally self-identify by setting the bot flag in their profile (ORK-02 property 0x04). Clients can surface or filter this - but the choice is theirs, not the protocol\'s. The barrier is economic, not identity.',
          },
          {
            title: 'WoT as Filter',
            desc: 'A single mute from someone you trust can propagate through your web of trust. Spammers remain visible on-chain but become invisible in well-configured clients. The social layer enforces what the protocol cannot.',
          },
        ].map(({ title, desc }) => (
          <div key={title} className="space-y-3 p-6 border-l-2 border-[#f7931a] border border-border bg-card rounded-none">
            <div className="w-4 h-4 bg-[#f7931a] rounded-sm" />
            <h3 className="font-semibold">{title}</h3>
            <p className="text-sm text-muted-foreground">{desc}</p>
          </div>
        ))}
      </div>

      <div className="border-l-4 border-[#f7931a] bg-[#f7931a]/5 p-6">
        <div className="grid md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <h3 className="font-semibold text-sm tracking-wide uppercase text-[#f7931a]">Asymmetric Defence</h3>
            <p className="text-sm text-muted-foreground">
              Spamming 1,000 posts costs 1,000 transaction fees. One person muting the spammer propagates that
              signal to hundreds or thousands of followers through WoT. Attack is expensive and linear;
              defence is cheap and viral. The asymmetry favours defenders.
            </p>
          </div>
          <div className="space-y-2">
            <h3 className="font-semibold text-sm tracking-wide uppercase text-[#f7931a]">Fees, Not KYC</h3>
            <p className="text-sm text-muted-foreground">
              Traditional platforms require phone numbers and identity verification to slow bots. ORS requires
              fees - aligning incentives rather than excluding participants. Anyone can post; the cost of
              posting at scale is simply priced in sats.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
