import { ExternalLink, EyeIcon } from 'lucide-react';

export default function ReferenceClients() {
  return (
    <section className="space-y-6">
      <div className="space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">Reference Clients</h2>
        <p className="text-muted-foreground">Apps built on the ORS protocol</p>
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        <div className="border-t-2 border-t-[#f7931a] border border-border bg-card rounded-none p-6 space-y-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <h3 className="font-semibold text-lg">opreturn.social</h3>
            </div>
            <p className="text-sm text-muted-foreground">
              The first ORS social client with a caching service and lightning facilitator.
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
              Simple ORS encoder/decoder. Inspect, build, and verify ORS payloads in-browser.
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <div
              className="inline-flex items-center justify-center gap-2 px-4 py-2 border border-[#f7931a]/40 hover:border-[#f7931a] hover:bg-[#f7931a]/5 text-sm font-medium transition-colors rounded-none"
            >
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
  );
}
