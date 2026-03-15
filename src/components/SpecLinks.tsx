import { ExternalLink } from 'lucide-react';

interface SpecLink {
  id: string;
  title: string;
  description: string;
  href: string;
  tag?: string;
}

const specs: SpecLink[] = [
  {
    id: 'ORS-01',
    title: 'Base Protocol',
    description: 'Core ORS wire format, signing scheme, and post structure',
    href: 'https://github.com/opreturnsocial/ors/blob/master/ORS-01.md',
    tag: 'ORS',
  },
  {
    id: 'Wire v0',
    title: 'Wire Format v0',
    description: 'Single-transaction OP_RETURN format',
    href: 'https://github.com/opreturnsocial/ors/blob/master/ORS-01.md#wire-format-v0',
    tag: 'ORS',
  },
  {
    id: 'Wire v1',
    title: 'Wire Format v1',
    description: 'Chunked 80-byte multi-transaction format',
    href: 'https://github.com/opreturnsocial/ors/blob/master/ORS-01.md#wire-format-v1',
    tag: 'ORS',
  },
  {
    id: 'ORK-01',
    title: 'TEXT_NOTE',
    description: 'Plain text post (kind 0x01)',
    href: 'https://github.com/opreturnsocial/ork/blob/master/ORK-01.md',
    tag: 'ORK',
  },
  {
    id: 'ORK-02',
    title: 'PROFILE_UPDATE',
    description: 'Profile metadata update (kind 0x02)',
    href: 'https://github.com/opreturnsocial/ork/blob/master/ORK-02.md',
    tag: 'ORK',
  },
  {
    id: 'ORK-03',
    title: 'TEXT_REPLY',
    description: 'Reply to a post by txid (kind 0x03)',
    href: 'https://github.com/opreturnsocial/ork/blob/master/ORK-03.md',
    tag: 'ORK',
  },
  {
    id: 'ORK-04',
    title: 'REPOST',
    description: 'Repost another ORS post (kind 0x04)',
    href: 'https://github.com/opreturnsocial/ork/blob/master/ORK-04.md',
    tag: 'ORK',
  },
  {
    id: 'ORK-05',
    title: 'QUOTE_REPOST',
    description: 'Quote repost with commentary (kind 0x05)',
    href: 'https://github.com/opreturnsocial/ork/blob/master/ORK-05.md',
    tag: 'ORK',
  },
  {
    id: 'ORK-06',
    title: 'FOLLOW',
    description: 'Follow/unfollow a pubkey (kind 0x06)',
    href: 'https://github.com/opreturnsocial/ork/blob/master/ORK-06.md',
    tag: 'ORK',
  },
];

export default function SpecLinks() {
  return (
    <section className="space-y-6">
      <div className="space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">Specification</h2>
        <p className="text-muted-foreground">Protocol specs and kind registry</p>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {specs.map(spec => (
          <a
            key={spec.id}
            href={spec.href}
            target="_blank"
            rel="noopener noreferrer"
            className="group relative flex flex-col gap-2 p-4 border border-border bg-card hover:border-[#f7931a]/60 transition-all overflow-hidden rounded-none"
          >
            {/* Orange left-border slide-in on hover */}
            <div className="absolute left-0 top-0 bottom-0 w-0.5 bg-[#f7931a] scale-y-0 group-hover:scale-y-100 transition-transform origin-top duration-200" />
            <div className="flex items-center justify-between">
              <span
                className={`font-mono text-xs px-1.5 py-0.5 border ${
                  spec.tag === 'ORS'
                    ? 'bg-[#f7931a]/10 border-[#f7931a]/40 text-[#f7931a]'
                    : 'border-border text-muted-foreground'
                }`}
              >
                {spec.id}
              </span>
              <ExternalLink className="h-3.5 w-3.5 text-muted-foreground group-hover:text-[#f7931a] transition-colors" />
            </div>
            <div className="font-medium text-sm">{spec.title}</div>
            <div className="text-xs text-muted-foreground">{spec.description}</div>
          </a>
        ))}
      </div>

      <div className="p-6 border-l-2 border-[#f7931a] border border-border bg-muted/30 rounded-none space-y-4">
        <h3 className="font-semibold text-lg">Pronunciation Guide</h3>
        <div className="flex flex-col gap-3">
          <div className="flex items-center gap-3">
            <span className="font-mono text-sm bg-[#f7931a] text-white px-2 py-0.5 text-center inline-block">ORS</span>
            <span className="text-muted-foreground text-sm">Protocol Specs - pronounced <em>"oars"</em> - like rowing oars</span>
          </div>
          <div className="flex items-center gap-3">
            <span className="font-mono text-sm border border-border px-2 py-0.5 text-center inline-block">ORK</span>
            <span className="text-muted-foreground text-sm">Kind Registry - pronounced <em>"orc"</em> - like the fantasy creature</span>
          </div>
        </div>
      </div>
    </section>
  );
}
