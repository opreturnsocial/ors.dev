import { useState } from 'react';

// v0 example: first mined ORS v0 post (block 940667)
const V0 = {
  magic:     '4f5253',
  version:   '00',
  pubkey:    '15b5cf6cdf4fd1c02f28bcce0f197cafae4c8c7c66a3e2e23af9fe610875315e',
  sig:       '47556a02f986aa3ca36c1b12ca75243ecabf3a2bd226b21e70ca0a8def34f3a1d080022c42aad58a3e73b2f30a61131e0c8178537f6ab23ccabbd5a2f7cb8fee',
  kind:      '01',
  content:   '57686f206973204a6f686e2047616c743f', // "Who is John Galt?"
};

// v1 example: first mined ORS v1 post (block 940000)
const V1_C0 = {
  magic:        '4f5253',
  version:      '01',
  chunkNum:     '00',
  totalChunks:  '02',
  pubkey:       '15b5cf6cdf4fd1c02f28bcce0f197cafae4c8c7c66a3e2e23af9fe610875315e',
  sigPart:      '77fe6d72fff2febdc26a1925e9961a84aba97c5d9b050f3138010757274ab4e75417b9173bfb46cc4f34', // sig[0..42]
};
const V1_C1 = {
  opPrefix:  '6a2f',
  magic:     '4f5253',
  version:   '01',
  chunkNum:  '01',
  sigPart:   '55e66ed721f598f5a958e9829e27105d4239e9f05a7c', // sig[42..64]
  kind:      '01',
  content:   '46726565646f6d206973206e6f742066726565', // "Freedom is not free"
};

function seg(hex: string, label: string, className: string) {
  return (
    <span
      className={`underline decoration-dotted cursor-help ${className}`}
      title={`${label}: ${hex}`}
    >
      {hex}
    </span>
  );
}

function V0Example() {
  return (
    <div className="mt-3 font-mono text-xs bg-background border border-border rounded-none p-3 border-dashed break-all">
      {seg(V0.magic,     "Magic bytes: ASCII 'ORS' (0x4f5253)",               'text-[#f7931a]')}
      {seg(V0.version,   'Version byte: 0x00 = v0 (single transaction)',      'text-blue-400')}
      {seg(V0.pubkey,    '32-byte x-only Schnorr public key (BIP-340)',        'text-green-500')}
      {seg(V0.sig,       '64-byte Schnorr signature over sha256(ORS||version||pubkey||kind||content)', 'text-purple-400')}
      {seg(V0.kind,      '1-byte post kind: 0x01 = TEXT_NOTE',                'text-yellow-500')}
      {seg(V0.content,   'UTF-8 content hex = "Who is John Galt?"',           'text-pink-400')}
    </div>
  );
}

function V1Example() {
  return (
    <div className="mt-3 font-mono text-xs bg-background border border-border rounded-none p-3 border-dashed break-all">
        {seg(V1_C0.magic,       "Magic bytes: ASCII 'ORS' (0x4f5253)",                        'text-[#f7931a]')}
        {seg(V1_C0.version,     'Version byte: 0x01 = v1 (chunked)',                          'text-blue-400')}
        {seg(V1_C0.chunkNum,    'Chunk index: 0x00 = root chunk',                             'text-muted-foreground')}
        {seg(V1_C0.totalChunks, 'Total chunk count for this post: 0x02 = 2 chunks',           'text-red-400')}
        {seg(V1_C0.pubkey,      '32-byte x-only Schnorr public key (BIP-340)',                'text-green-500')}
        {seg(V1_C0.sigPart,     'Bytes 0-41 of the 64-byte Schnorr signature over sha256(pubkey||kind||kind_data)', 'text-purple-400')}
        <span className="font-medium">+</span>
        {seg(V1_C1.magic,    "Magic bytes: ASCII 'ORS' (0x4f5253)",                           'text-[#f7931a]')}
        {seg(V1_C1.version,  'Version byte: 0x01 = v1 (chunked)',                             'text-blue-400')}
        {seg(V1_C1.chunkNum, 'Chunk index: 0x01 = second chunk',                              'text-muted-foreground')}
        {seg(V1_C1.sigPart,  'Bytes 42-63 of the 64-byte Schnorr signature over sha256(pubkey||kind||kind_data)', 'text-purple-400')}
        {seg(V1_C1.kind,     '1-byte post kind: 0x01 = TEXT_NOTE',                            'text-yellow-500')}
        {seg(V1_C1.content,  'UTF-8 content hex = "Freedom is not free"',                    'text-pink-400')}
    </div>
  );
}

export default function HowItWorks() {
  const [showV0Example, setShowV0Example] = useState(false);
  const [showV1Example, setShowV1Example] = useState(false);

  return (
    <section id="how-it-works" className="space-y-8">
      <div className="space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">How It Works</h2>
        <p className="text-muted-foreground text-lg">
          Four steps from thought to immutable record
        </p>
      </div>

      {/* Steps */}
      <div className="grid md:grid-cols-4 gap-4">
        {[
          { step: '01', title: 'Write', desc: 'Compose your message (up to 280 bytes)' },
          { step: '02', title: 'Sign', desc: 'Sign the payload with your Schnorr private key (BIP-340)' },
          { step: '03', title: 'Embed', desc: 'Package as OP_RETURN output data in a bitcoin transaction' },
          { step: '04', title: 'Broadcast', desc: 'Mine into a block - immutable on the bitcoin blockchain' },
        ].map(({ step, title, desc }) => (
          <div key={step} className="relative p-5 border border-border bg-card overflow-hidden rounded-none space-y-2">
            <div
              className="absolute -top-3 -right-2 text-7xl font-mono font-bold text-[#f7931a]/10 leading-none select-none pointer-events-none"
              aria-hidden
            >
              {step}
            </div>
            <div className="text-xs font-mono text-[#f7931a] tracking-widest">{step}</div>
            <div className="font-semibold">{title}</div>
            <div className="text-sm text-muted-foreground">{desc}</div>
          </div>
        ))}
      </div>

      {/* Wire formats */}
      <div className="space-y-2">
        <div className="flex items-center gap-3">
          <h3 className="text-xl font-semibold">Wire Formats</h3>
        </div>
        <p className="text-xs text-muted-foreground mb-4">hover fields to explain</p>
        <div className="grid md:grid-cols-2 gap-4">
          {/* v0 */}
          <div className="border border-border bg-card rounded-none overflow-hidden">
            <div className="flex items-center justify-between gap-2 px-4 py-2.5 border-b border-border bg-muted/30">
              <div className="flex items-center gap-2">
                <span className="font-mono font-bold text-xs text-[#f7931a] border border-[#f7931a]/40 px-1.5 py-0.5">v0</span>
                <span className="font-semibold text-sm">Single Transaction</span>
              </div>
              <button
                className="text-xs text-muted-foreground hover:text-foreground transition-colors"
                onClick={() => setShowV0Example(v => !v)}
              >
                {showV0Example ? 'hide example' : 'view example'}
              </button>
            </div>
            <div className="p-4 space-y-3">
              <p className="text-sm text-muted-foreground">
                Entire post in one OP_RETURN output.
              </p>
              <div className="font-mono text-xs bg-background border border-border rounded-none p-3 flex flex-wrap gap-x-1 gap-y-0.5">
                <span className="text-[#f7931a] underline decoration-dotted cursor-help" title="Magic bytes: ASCII 'ORS' (0x4f5253)">ORS</span>
                <span className="text-blue-400 underline decoration-dotted cursor-help" title="Version byte: 0x00 = v0 (single transaction)">0x00</span>
                <span className="text-green-500 underline decoration-dotted cursor-help" title="32-byte x-only Schnorr public key (BIP-340)">pubkey[32]</span>
                <span className="text-purple-400 underline decoration-dotted cursor-help" title="64-byte Schnorr signature over sha256(ORS||version||pubkey||kind||content)">sig[64]</span>
                <span className="text-yellow-500 underline decoration-dotted cursor-help" title="1-byte post kind (e.g. 0x01 = TEXT_NOTE)">kind[1]</span>
                <span className="text-pink-400 underline decoration-dotted cursor-help" title="UTF-8 encoded post content, up to 280 bytes">content</span>
              </div>
              {showV0Example && <V0Example />}
            </div>
          </div>

          {/* v1 */}
          <div className="border border-border bg-card rounded-none overflow-hidden">
            <div className="flex items-center justify-between gap-2 px-4 py-2.5 border-b border-border bg-muted/30">
              <div className="flex items-center gap-2">
                <span className="font-mono font-bold text-xs text-[#f7931a] border border-[#f7931a]/40 px-1.5 py-0.5">v1</span>
                <span className="font-semibold text-sm">Chunked</span>
              </div>
              <button
                className="text-xs text-muted-foreground hover:text-foreground transition-colors"
                onClick={() => setShowV1Example(v => !v)}
              >
                {showV1Example ? 'hide example' : 'view example'}
              </button>
            </div>
            <div className="p-4 space-y-3">
              <p className="text-sm text-muted-foreground">
                Post split across multiple transactions with single 80-byte OP_RETURN outputs.
              </p>
              <div className="font-mono text-xs bg-background border border-border rounded-none p-3 space-y-1">
                <div className="flex flex-wrap gap-x-1 gap-y-0.5">
                  <span className="text-[#f7931a] underline decoration-dotted cursor-help" title="Magic bytes: ASCII 'ORS' (0x4f5253)">ORS</span>
                  <span className="text-blue-400 underline decoration-dotted cursor-help" title="Version byte: 0x01 = v1 (chunked)">0x01</span>
                  <span className="text-muted-foreground underline decoration-dotted cursor-help" title="Chunk index: 0x00 = root chunk">0x00</span>
                  <span className="text-red-400 underline decoration-dotted cursor-help" title="Total chunk count for this post (e.g. 0x02 = 2 chunks)">0x02</span>
                  <span className="text-green-500 underline decoration-dotted cursor-help" title="32-byte x-only Schnorr public key (BIP-340)">pubkey[32]</span>
                  <span className="text-purple-400 underline decoration-dotted cursor-help" title="Bytes 0-41 of the 64-byte Schnorr signature">sig[0..42]</span>
                  <span className="text-muted-foreground/60">(chunk 0)</span>
                </div>
                <div className="flex flex-wrap gap-x-1 gap-y-0.5">
                  <span className="text-[#f7931a] underline decoration-dotted cursor-help" title="Magic bytes: ASCII 'ORS' (0x4f5253)">ORS</span>
                  <span className="text-blue-400 underline decoration-dotted cursor-help" title="Version byte: 0x01 = v1 (chunked)">0x01</span>
                  <span className="text-muted-foreground underline decoration-dotted cursor-help" title="Chunk index: 0x01 = second chunk">0x01</span>
                  <span className="text-purple-400 underline decoration-dotted cursor-help" title="Bytes 42-63 of the 64-byte Schnorr signature over sha256(pubkey||kind||kind_data)">sig[42..64]</span>
                  <span className="text-yellow-500 underline decoration-dotted cursor-help" title="1-byte post kind (e.g. 0x01 = TEXT_NOTE)">kind[1]</span>
                  <span className="text-pink-400 underline decoration-dotted cursor-help" title="First 52 bytes of UTF-8 content">content[0..52]</span>
                  <span className="text-muted-foreground/60">(chunk 1)</span>
                </div>
                <div className="flex flex-wrap gap-x-1 gap-y-0.5">
                  <span className="text-[#f7931a] underline decoration-dotted cursor-help" title="Magic bytes: ASCII 'ORS' (0x4f5253)">ORS</span>
                  <span className="text-blue-400 underline decoration-dotted cursor-help" title="Version byte: 0x01 = v1 (chunked)">0x01</span>
                  <span className="text-muted-foreground underline decoration-dotted cursor-help" title="Chunk index: 0x02 = third chunk (pattern continues for N chunks)">0x02</span>
                  <span className="text-pink-400 underline decoration-dotted cursor-help" title="Remaining content bytes, up to 75 bytes per chunk">content[52..M]</span>
                  <span className="text-muted-foreground/60">(chunk 2)</span>
                </div>
              </div>
              {showV1Example && <V1Example />}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
