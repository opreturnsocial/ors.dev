export default function BringYourOwnClient() {
  return (
    <section className="space-y-6">
      <div className="space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">Bring Your Own Client</h2>
        <p className="text-muted-foreground text-lg">
          The protocol is open - your experience is not locked to any one app
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        <div className="border-t-2 border-t-[#f7931a] border border-border bg-card rounded-none p-6 space-y-3">
          <div className="w-4 h-4 bg-[#f7931a] rounded-sm" />
          <h3 className="font-semibold text-lg">Your Experience, Your Choice</h3>
          <p className="text-sm text-muted-foreground">
            Different clients can offer different experiences on top of the same on-chain data. One client might
            focus on a specific community or topic; another might apply aggressive off-chain spam filters or
            custom ranking algorithms. You choose which lens to view the protocol through.
          </p>
        </div>

        <div className="border-t-2 border-t-[#f7931a] border border-border bg-card rounded-none p-6 space-y-3">
          <div className="w-4 h-4 bg-[#f7931a] rounded-sm" />
          <h3 className="font-semibold text-lg">No Platform Lock-in</h3>
          <p className="text-sm text-muted-foreground">
            Unlike centralised social media, no single client controls your identity, your followers, or your
            posts. If a client changes its policies, shuts down, or simply isn't to your taste - switch. Your
            keys and your on-chain history go with you.
          </p>
        </div>
      </div>
    </section>
  );
}
