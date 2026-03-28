import { useState } from "react";
import { Input } from "@/components/ui/input";

function highlightJson(json: string): string {
  return json
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(
      /("(\\u[a-zA-Z0-9]{4}|\\[^u]|[^\\"])*"(\s*:)?|\b(true|false|null)\b|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?)/g,
      (match) => {
        if (/^"/.test(match)) {
          if (/:$/.test(match)) {
            return `<span class="text-[#f7931a]">${match}</span>`;
          }
          return `<span class="text-green-400">${match}</span>`;
        }
        if (/true|false|null/.test(match)) {
          return `<span class="text-purple-400">${match}</span>`;
        }
        return `<span class="text-blue-400">${match}</span>`;
      },
    );
}

export default function IndexerExplorer() {
  const [network, setNetwork] = useState<"mainnet" | "mutinynet" | "testnet4">(
    "mainnet",
  );
  const [limit, setLimit] = useState("10");
  const [before, setBefore] = useState("");
  const [result, setResult] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function fetchData(endpoint: "transactions" | "records") {
    const base =
      network === "mainnet"
        ? "https://indexer.ors.dev"
        : network === "mutinynet"
          ? "https://mutinynet.indexer.ors.dev"
          : "https://testnet4.indexer.ors.dev";
    const params = new URLSearchParams();
    if (limit) params.set("limit", limit);
    if (before) params.set("before", before);
    setLoading(true);
    setError(null);
    setResult(null);
    try {
      const res = await fetch(`${base}/${endpoint}?${params}`);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      setResult(JSON.stringify(data, null, 2));
    } catch (e) {
      setError(e instanceof Error ? e.message : "Request failed");
    } finally {
      setLoading(false);
    }
  }

  const btnBase =
    "inline-flex items-center justify-center px-3 py-1.5 border text-sm font-medium transition-colors rounded-none cursor-pointer";
  const networkActive = `${btnBase} border-[#f7931a] bg-[#f7931a]/10 text-foreground`;
  const networkInactive = `${btnBase} border-border text-muted-foreground hover:border-foreground/40 hover:text-foreground`;
  const fetchBtn = `${btnBase} border-[#f7931a]/40 hover:border-[#f7931a] hover:bg-[#f7931a]/5 disabled:opacity-50 disabled:cursor-not-allowed`;

  return (
    <section className="space-y-6">
      <div className="space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">Explorer</h2>
        <p className="text-muted-foreground">
          Query the public ORS indexers directly
        </p>
      </div>

      <div className="border-t-2 border-t-[#f7931a] border border-border bg-card rounded-none p-6 space-y-5">
        {/* Controls */}
        <div className="flex flex-wrap items-end gap-4">
          {/* Network toggle */}
          <div className="space-y-1">
            <div className="text-xs font-medium text-muted-foreground">
              Network
            </div>
            <div className="flex">
              <button
                className={`${network === "mainnet" ? networkActive : networkInactive}`}
                onClick={() => setNetwork("mainnet")}
              >
                Mainnet
              </button>
              <button
                className={
                  network === "mutinynet" ? networkActive : networkInactive
                }
                onClick={() => setNetwork("mutinynet")}
              >
                Mutinynet
              </button>
              <button
                className={
                  network === "testnet4" ? networkActive : networkInactive
                }
                onClick={() => setNetwork("testnet4")}
              >
                Testnet4
              </button>
            </div>
          </div>

          {/* Limit */}
          <div className="space-y-1">
            <label className="text-xs font-medium text-muted-foreground">
              Limit
            </label>
            <Input
              type="number"
              value={limit}
              onChange={(e) => setLimit(e.target.value)}
              min={1}
              max={200}
              className="w-20 rounded-none h-8 text-sm font-mono"
            />
          </div>

          {/* Before cursor */}
          <div className="space-y-1 flex-1 min-w-40">
            <label className="text-xs font-medium text-muted-foreground">
              Before (cursor)
            </label>
            <Input
              type="text"
              value={before}
              onChange={(e) => setBefore(e.target.value)}
              placeholder="smallest id from previous page"
              className="rounded-none h-8 text-sm font-mono"
            />
          </div>
        </div>

        {/* Fetch buttons */}
        <div className="flex flex-wrap gap-2">
          <button
            className={fetchBtn}
            onClick={() => fetchData("transactions")}
            disabled={loading}
          >
            {loading ? "Loading..." : "Fetch Transactions"}
          </button>
          <button
            className={fetchBtn}
            onClick={() => fetchData("records")}
            disabled={loading}
          >
            {loading ? "Loading..." : "Fetch Records"}
          </button>
        </div>

        {/* Error */}
        {error && <p className="text-sm text-destructive font-mono">{error}</p>}

        {/* Result */}
        {result && (
          <div className="space-y-1">
            <div className="text-xs font-medium text-muted-foreground">
              Response
            </div>
            <pre
              className="font-mono text-xs bg-background border border-border rounded-none p-4 overflow-auto max-h-[500px] leading-relaxed"
              dangerouslySetInnerHTML={{ __html: highlightJson(result) }}
            />
          </div>
        )}
      </div>
    </section>
  );
}
