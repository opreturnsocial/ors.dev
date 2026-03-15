export default function WebOfTrust() {
  return (
    <section className="space-y-6">
      <div className="space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">Web of Trust</h2>
        <p className="text-muted-foreground text-lg">
          No central authority - trust flows through your social graph
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        <div className="border-t-2 border-t-[#f7931a] border border-border bg-card rounded-none p-6 space-y-3">
          <div className="w-4 h-4 bg-[#f7931a] rounded-sm" />
          <h3 className="font-semibold text-lg">Your Graph, Your Rules</h3>
          <p className="text-sm text-muted-foreground">
            You control your follow and mute list. It lives on bitcoin - no platform can override it, revoke it, or
            shadow-ban you from it. Your social graph is as permanent and portable as your keys.
          </p>
        </div>

        <div className="border-t-2 border-t-[#f7931a] border border-border bg-card rounded-none p-6 space-y-3">
          <div className="w-4 h-4 bg-[#f7931a] rounded-sm" />
          <h3 className="font-semibold text-lg">Propagating Trust</h3>
          <p className="text-sm text-muted-foreground">
            When you mute a spammer, clients that respect WoT can propagate that signal to people who trust you (through your followers).
            A single mute ripples outward through the social graph - reducing a bad actor's reach without any
            central ban or moderation team.
          </p>
        </div>
      </div>
    </section>
  );
}
