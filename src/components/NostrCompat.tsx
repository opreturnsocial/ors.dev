export default function NostrCompat() {
  return (
    <section className="space-y-6">
      <div className="space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">Built for Nostr Users</h2>
        <p className="text-muted-foreground text-lg">
          ORS is inspired by Nostr and shares its key model - the two protocols are complementary
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        <div className="border-t-2 border-t-[#f7931a] border border-border bg-card rounded-none p-6 space-y-3">
          <div className="w-4 h-4 bg-[#f7931a] rounded-sm" />
          <h3 className="font-semibold text-lg">Same Key, Same Identity</h3>
          <p className="text-sm text-muted-foreground">
            ORS uses the same Schnorr key scheme as Nostr (BIP-340). Your existing nsec/npub is a valid ORS identity.
            No new key to generate or back up.
          </p>
        </div>

        <div className="border-t-2 border-t-[#f7931a] border border-border bg-card rounded-none p-6 space-y-3">
          <div className="w-4 h-4 bg-[#f7931a] rounded-sm" />
          <h3 className="font-semibold text-lg">Find People by npub</h3>
          <p className="text-sm text-muted-foreground">
            Your Nostr social graph carries over. ORS clients can look up anyone by their npub/pubkey -
            the same identifier works on both protocols.
          </p>
        </div>

        <div className="border-t-2 border-t-[#f7931a] border border-border bg-card rounded-none p-6 space-y-3">
          <div className="w-4 h-4 bg-[#f7931a] rounded-sm" />
          <h3 className="font-semibold text-lg">Fast Reads, Everywhere</h3>
          <p className="text-sm text-muted-foreground">
            Because all ORS data lives on a single canonical chain, caching servers can index it once and
            serve it globally at low latency. Nostr's outbox model requires clients to hunt across many
            relays to find a user's posts - ORS clients skip that entirely.
          </p>
        </div>
      </div>

      <div className="border-l-4 border-[#f7931a] bg-[#f7931a]/5 p-6">
        <div className="grid md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <h3 className="font-semibold text-sm tracking-wide uppercase text-[#f7931a]">Different Trade-offs</h3>
            <p className="text-sm text-muted-foreground">
              Nostr is fast, flexible, and cheap to post to. ORS trades that flexibility for permanence: posts are on the bitcoin blockchain
              and can never be deleted or censored, but posting costs a fee. Nostr and ORS solve different problems.
            </p>
          </div>
          <div className="space-y-2">
            <h3 className="font-semibold text-sm tracking-wide uppercase text-[#f7931a]">Complementary, Not Competing</h3>
            <p className="text-sm text-muted-foreground">
              ORS is explicitly inspired by Nostr and shares its identity model. Shared keys mean your identity is portable across both
              networks without any extra setup.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
