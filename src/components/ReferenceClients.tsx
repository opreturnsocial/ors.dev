import { ExternalLink, EyeIcon } from "lucide-react";

export default function ReferenceClients() {
  return (
    <div className="space-y-12">
      <section className="space-y-6">
        <div className="space-y-2">
          <h2 className="text-3xl font-bold tracking-tight">
            Reference Clients
          </h2>
          <p className="text-muted-foreground">
            Apps built on the ORS protocol
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-4">
          <div className="border-t-2 border-t-[#f7931a] border border-border bg-card rounded-none p-6 space-y-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <h3 className="font-semibold text-lg">opreturn.social</h3>
              </div>
              <p className="text-sm text-muted-foreground">
                The first ORS social client with a hybrid (free + paid) UX, a
                caching service and lightning facilitator.
              </p>
            </div>
            <div className="flex flex-wrap gap-2">
              <a
                href="https://opreturn.social"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 px-4 py-2 border border-[#f7931a]/40 hover:border-[#f7931a] hover:bg-[#f7931a]/5 text-sm font-medium transition-colors rounded-none"
              >
                <ExternalLink className="h-3.5 w-3.5 text-[#f7931a]" />
                Visit opreturn.social
              </a>
              <a
                href="https://github.com/opreturnsocial/opreturn.social"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 px-4 py-2 border border-border hover:border-foreground/40 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors rounded-none"
              >
                <ExternalLink className="h-3.5 w-3.5" />
                GitHub
              </a>
            </div>
          </div>

          <div className="border-t-2 border-t-[#f7931a] border border-border bg-card rounded-none p-6 space-y-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <h3 className="font-semibold text-lg">ors.dev</h3>
              </div>
              <p className="text-sm text-muted-foreground">
                Simple ORS encoder/decoder, and explorer. Inspect, build, and
                verify ORS payloads, and browse data from the indexers.
              </p>
            </div>
            <div className="flex flex-wrap gap-2">
              <div className="inline-flex items-center justify-center gap-2 px-4 py-2 border border-[#f7931a]/40 hover:border-[#f7931a] hover:bg-[#f7931a]/5 text-sm font-medium transition-colors rounded-none">
                <EyeIcon className="h-3.5 w-3.5 text-[#f7931a]" />
                Viewing
              </div>
              <a
                href="https://github.com/opreturnsocial/ors.dev"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 px-4 py-2 border border-border hover:border-foreground/40 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors rounded-none"
              >
                <ExternalLink className="h-3.5 w-3.5" />
                GitHub
              </a>
            </div>
          </div>
        </div>
      </section>

      <section className="space-y-6">
        <div className="space-y-2">
          <h2 className="text-3xl font-bold tracking-tight">Agent Skills</h2>
          <p className="text-muted-foreground">
            Teach your AI agent to interact on ORS
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-4">
          <div className="border-t-2 border-t-[#f7931a] border border-border bg-card rounded-none p-6 space-y-4">
            <div className="space-y-1">
              <h3 className="font-semibold text-lg">
                opreturn.social/SKILL.md
              </h3>
              <p className="text-sm text-muted-foreground">
                A skill file that teaches AI agents how to use opreturn.social
                via the CLI. Add it to your agent's context to enable bitcoin
                social interactions.
              </p>
            </div>
            <div className="flex flex-wrap gap-2">
              <a
                href="https://opreturn.social/SKILL.md"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 px-4 py-2 border border-[#f7931a]/40 hover:border-[#f7931a] hover:bg-[#f7931a]/5 text-sm font-medium transition-colors rounded-none"
              >
                <ExternalLink className="h-3.5 w-3.5 text-[#f7931a]" />
                View SKILL.md
              </a>
            </div>
          </div>
        </div>
      </section>

      <section className="space-y-6">
        <div className="space-y-2">
          <h2 className="text-3xl font-bold tracking-tight">
            Developer Packages
          </h2>
          <p className="text-muted-foreground">Libraries for building on ORS</p>
        </div>

        <div className="grid md:grid-cols-2 gap-4">
          <div className="border-t-2 border-t-[#f7931a] border border-border bg-card rounded-none p-6 space-y-4">
            <div className="space-y-1">
              <h3 className="font-semibold text-lg">
                @opreturnsocial/protocol
              </h3>
              <p className="text-sm text-muted-foreground">
                Zero-dependency TypeScript library for encoding and decoding ORS
                payloads. Supports text posts, replies, reposts, profile
                updates, and follows. Dual CJS/ESM exports.
              </p>
            </div>
            <div className="flex flex-wrap gap-2">
              <a
                href="https://github.com/opreturnsocial/opreturn.social/tree/master/packages/protocol"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 px-4 py-2 border border-[#f7931a]/40 hover:border-[#f7931a] hover:bg-[#f7931a]/5 text-sm font-medium transition-colors rounded-none"
              >
                <ExternalLink className="h-3.5 w-3.5 text-[#f7931a]" />
                GitHub
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
