import { useState, useCallback } from 'react';
import { Copy, Check, AlertCircle, Loader2, ChevronDown } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import {
  parseORSPayload,
  parseV1Chunk,
  assembleV1Body,
  detectVersion,
  buildUnsignedPayload,
  buildORSPayload,
  buildV1Chunks,
  buildV1SigningBody,
  hexToOpReturn,
  bytesToHex,
  KIND_TEXT_NOTE,
  type ParsedPost,
  type ParsedV1Post,
} from '@/lib/ors';
import {
  generateKeypair,
  getPublicKey,
  signPayload,
  hexToPrivkey,
  verifySignature,
} from '@/lib/crypto';
import { sha256 } from '@noble/hashes/sha2.js';

// First mined ORS v0 post txid (block 940667)
const V0_TXID = 'aea0bc2b75151bfcb564279980ae222e76d8a8614c05e9513a9040bacfbbf536';

// First mined ORS v1 post chunk txids
const CHUNK0_TXID = 'f31d17c819eeccf43f9a3a78101bc835e8d9158e3a7476f979effa19e92f6012';
const CHUNK1_TXID = 'bbb060c131fcfcba41123465b3ccfd97dfa6889dcd5870e8d7748a8c2c57eaea';

async function fetchOpReturn(txid: string): Promise<string> {
  const res = await fetch(`https://mempool.space/api/tx/${txid}`);
  if (!res.ok) throw new Error(`mempool.space returned ${res.status}`);
  const tx = await res.json() as { vout: Array<{ scriptpubkey: string }> };
  const out = tx.vout.find((o) => o.scriptpubkey.toLowerCase().startsWith('6a'));
  if (!out) throw new Error('No OP_RETURN output found');
  return out.scriptpubkey;
}

function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);
  const copy = () => {
    void navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
  return (
    <Button variant="ghost" size="icon" className="h-7 w-7" onClick={copy}>
      {copied ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
    </Button>
  );
}

function HexOutput({ label, hex }: { label: string; hex: string }) {
  return (
    <div className="space-y-1">
      <div className="flex items-center justify-between">
        <span className="text-xs font-medium text-muted-foreground">{label}</span>
        <CopyButton text={hex} />
      </div>
      <div className="font-mono text-xs bg-muted rounded p-3 break-all">{hex}</div>
    </div>
  );
}

// ─── Decode Tab ───────────────────────────────────────────────────────────────

function DecodedResult({ post }: { post: ParsedPost | ParsedV1Post }) {
  const [sigValid, setSigValid] = useState<boolean | null>(null);
  const [checking, setChecking] = useState(false);

  const verify = useCallback(async () => {
    setChecking(true);
    try {
      if (post.version === 'v0') {
        const pubkeyBytes = new Uint8Array(32);
        for (let i = 0; i < 64; i += 2) {
          pubkeyBytes[i / 2] = parseInt(post.pubkey.slice(i, i + 2), 16);
        }
        const unsigned = buildUnsignedPayload(post.content, pubkeyBytes);
        setSigValid(verifySignature(post.pubkey, post.sig, sha256(unsigned)));
      } else {
        const pubkeyBytes = new Uint8Array(32);
        for (let i = 0; i < 64; i += 2) {
          pubkeyBytes[i / 2] = parseInt(post.pubkey.slice(i, i + 2), 16);
        }
        const contentBytes = new TextEncoder().encode(post.content);
        const signingBody = buildV1SigningBody(pubkeyBytes, post.kind, contentBytes);
        setSigValid(verifySignature(post.pubkey, post.sig, sha256(signingBody)));
      }
    } catch {
      setSigValid(false);
    }
    setChecking(false);
  }, [post]);

  return (
    <div className="space-y-4 p-4 rounded-lg border bg-card">
      <div className="flex items-center gap-2">
        <Badge className="bg-[#f7931a] text-white">Decoded</Badge>
        <Badge variant="outline" className="font-mono">{post.version}</Badge>
        <Badge variant="secondary">{post.kindName}</Badge>
        {'totalChunks' in post && (
          <Badge variant="outline">{post.totalChunks} chunks</Badge>
        )}
      </div>

      <div className="grid gap-3">
        <div>
          <div className="text-xs text-muted-foreground mb-1">Public Key (32 bytes)</div>
          <div className="font-mono text-xs bg-muted rounded p-2 break-all">{post.pubkey}</div>
        </div>
        <div>
          <div className="text-xs text-muted-foreground mb-1">Signature (64 bytes)</div>
          <div className="font-mono text-xs bg-muted rounded p-2 break-all">{post.sig}</div>
        </div>
        <div>
          <div className="text-xs text-muted-foreground mb-1">Content</div>
          <div className="rounded p-3 border bg-background text-sm whitespace-pre-wrap">{post.content}</div>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <Button variant="outline" size="sm" onClick={() => void verify()} disabled={checking}>
          {checking ? <Loader2 className="h-3.5 w-3.5 animate-spin mr-1" /> : null}
          Verify Signature
        </Button>
        {sigValid === true && <Badge className="bg-green-500 text-white">✓ Valid</Badge>}
        {sigValid === false && <Badge variant="destructive">✗ Invalid</Badge>}
      </div>
    </div>
  );
}

function DecodeTab() {
  const [hex, setHex] = useState('');
  const [hex1, setHex1] = useState('');
  const [result, setResult] = useState<ParsedPost | ParsedV1Post | null>(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showChunk1, setShowChunk1] = useState(false);

  const decode = useCallback(() => {
    setError('');
    setResult(null);
    const h = hex.trim();
    if (!h) { setError('Enter hex data to decode'); return; }

    const ver = detectVersion(h);

    if (ver === 'v0') {
      const r = parseORSPayload(h);
      if (!r.ok) { setError(r.error); return; }
      setResult(r.post);
    } else if (ver === 'v1') {
      const chunk0 = parseV1Chunk(h);
      if (!chunk0) { setError('Failed to parse v1 chunk 0'); return; }

      if (!chunk0.totalChunks || chunk0.totalChunks <= 1) {
        setError('v1 chunk 0 indicates only 1 chunk but single-chunk v1 is not standard');
        return;
      }

      // Multi-chunk
      if (!hex1.trim()) {
        setShowChunk1(true);
        setError('This is a multi-chunk v1 post. Please provide chunk 1 hex below.');
        return;
      }

      const chunk1 = parseV1Chunk(hex1.trim());
      if (!chunk1) { setError('Failed to parse v1 chunk 1'); return; }

      const r = assembleV1Body([chunk0.bodySlice, chunk1.bodySlice]);
      if (!r.ok) { setError(r.error); return; }
      setResult(r.post);
    } else {
      setError('Not a valid ORS payload (check magic bytes ORS = 0x4f5253)');
    }
  }, [hex, hex1]);

  const loadFirstPost = useCallback(async () => {
    setLoading(true);
    setError('');
    setResult(null);
    try {
      const [s0, s1] = await Promise.all([
        fetchOpReturn(CHUNK0_TXID),
        fetchOpReturn(CHUNK1_TXID),
      ]);
      setHex(s0);
      setHex1(s1);
      setShowChunk1(true);

      const chunk0 = parseV1Chunk(s0);
      const chunk1 = parseV1Chunk(s1);
      if (!chunk0 || !chunk1) { setError('Failed to parse fetched chunks'); return; }
      const r = assembleV1Body([chunk0.bodySlice, chunk1.bodySlice]);
      if (!r.ok) { setError(r.error); return; }
      setResult(r.post);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to fetch');
    } finally {
      setLoading(false);
    }
  }, []);

  const loadFirstV0Post = useCallback(async () => {
    setLoading(true);
    setError('');
    setResult(null);
    setShowChunk1(false);
    setHex1('');
    try {
      const s0 = await fetchOpReturn(V0_TXID);
      setHex(s0);
      const r = parseORSPayload(s0);
      if (!r.ok) { setError(r.error); return; }
      setResult(r.post);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to fetch');
    } finally {
      setLoading(false);
    }
  }, []);

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <label className="text-sm font-medium">OP_RETURN hex (chunk 0)</label>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => void loadFirstV0Post()}
              disabled={loading}
            >
              {loading ? <Loader2 className="h-3.5 w-3.5 animate-spin mr-1" /> : null}
              Load first v0 post
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => void loadFirstPost()}
              disabled={loading}
            >
              {loading ? <Loader2 className="h-3.5 w-3.5 animate-spin mr-1" /> : null}
              Load first v1 post
            </Button>
          </div>
        </div>
        <Textarea
          placeholder="Paste OP_RETURN hex here (with or without 6a prefix)..."
          value={hex}
          onChange={e => { setHex(e.target.value); setResult(null); setError(''); }}
          className="font-mono text-xs min-h-[80px]"
        />
      </div>

      {showChunk1 && (
        <div className="space-y-2">
          <label className="text-sm font-medium">Chunk 1 hex (for v1 multi-chunk posts)</label>
          <Textarea
            placeholder="Paste chunk 1 OP_RETURN hex..."
            value={hex1}
            onChange={e => { setHex1(e.target.value); setResult(null); setError(''); }}
            className="font-mono text-xs min-h-[80px]"
          />
        </div>
      )}

      {!showChunk1 && (
        <button
          className="text-xs text-muted-foreground hover:text-foreground flex items-center gap-1"
          onClick={() => setShowChunk1(true)}
        >
          <ChevronDown className="h-3 w-3" /> Add chunk 1 (for v1 posts)
        </button>
      )}

      <Button onClick={decode} className="bg-[#f7931a] hover:bg-[#e8851a] text-white">
        Decode
      </Button>

      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {result && <DecodedResult post={result} />}
    </div>
  );
}

// ─── Encode Tab ───────────────────────────────────────────────────────────────

type KeyMethod = 'generate' | 'extension';

function EncodeTab() {
  const [version, setVersion] = useState<'v0' | 'v1'>('v1');
  const [content, setContent] = useState('');
  const [keyMethod, setKeyMethod] = useState<KeyMethod>('generate');
  const [generatedPriv, setGeneratedPriv] = useState('');
  const [generatedPub, setGeneratedPub] = useState('');
  const [error, setError] = useState('');
  const [output, setOutput] = useState<{
    dataHex: string;
    scriptHex: string;
    chunks?: string[];
  } | null>(null);
  const [signing, setSigning] = useState(false);

  const generateKey = useCallback(() => {
    const { privkey, pubkey } = generateKeypair();
    setGeneratedPriv(bytesToHex(privkey));
    setGeneratedPub(bytesToHex(pubkey));
  }, []);

  const encode = useCallback(async () => {
    setError('');
    setOutput(null);
    setSigning(true);

    try {
      let pubkey: Uint8Array;

      if (keyMethod === 'generate') {
        if (!generatedPriv) { setError('Generate a key first'); setSigning(false); return; }
        const p = hexToPrivkey(generatedPriv);
        pubkey = getPublicKey(p);

        const contentBytes = new TextEncoder().encode(content);

        if (version === 'v0') {
          const unsigned = buildUnsignedPayload(content, pubkey);
          const sig = signPayload(p, unsigned);
          const payload = buildORSPayload(content, pubkey, sig);
          const dataHex = bytesToHex(payload);
          setOutput({ dataHex, scriptHex: hexToOpReturn(dataHex) });
        } else {
          const signingBody = buildV1SigningBody(pubkey, KIND_TEXT_NOTE, contentBytes);
          const sig = signPayload(p, signingBody);
          const chunks = buildV1Chunks(pubkey, sig, KIND_TEXT_NOTE, contentBytes);
          const chunkHexes = chunks.map(bytesToHex);
          setOutput({
            dataHex: chunkHexes[0],
            scriptHex: hexToOpReturn(chunkHexes[0]),
            chunks: chunkHexes,
          });
        }
      } else {
        // Extension signing
        const w = window as unknown as { nostr?: { getPublicKey: () => Promise<string>; signSchnorr?: (hex: string) => Promise<string> } };
        if (!w.nostr) {
          setError('No Nostr extension found - install Alby Extension');
          setSigning(false);
          return;
        }
        if (!w.nostr.signSchnorr) {
          setError('Your extension does not support signSchnorr - try Alby Extension');
          setSigning(false);
          return;
        }

        const pubHex = await w.nostr.getPublicKey();
        const pubBytes = new Uint8Array(32);
        for (let i = 0; i < 64; i += 2) {
          pubBytes[i / 2] = parseInt(pubHex.slice(i, i + 2), 16);
        }
        pubkey = pubBytes;

        const contentBytes = new TextEncoder().encode(content);

        if (version === 'v0') {
          const unsigned = buildUnsignedPayload(content, pubkey);
          const msgHash = sha256(unsigned);
          const sigHex = await w.nostr.signSchnorr(bytesToHex(msgHash));
          const sigBytes = new Uint8Array(64);
          for (let i = 0; i < 128; i += 2) {
            sigBytes[i / 2] = parseInt(sigHex.slice(i, i + 2), 16);
          }
          const payload = buildORSPayload(content, pubkey, sigBytes);
          const dataHex = bytesToHex(payload);
          setOutput({ dataHex, scriptHex: hexToOpReturn(dataHex) });
        } else {
          const signingBody = buildV1SigningBody(pubkey, KIND_TEXT_NOTE, contentBytes);
          const msgHash = sha256(signingBody);
          const sigHex = await w.nostr.signSchnorr(bytesToHex(msgHash));
          const sigBytes = new Uint8Array(64);
          for (let i = 0; i < 128; i += 2) {
            sigBytes[i / 2] = parseInt(sigHex.slice(i, i + 2), 16);
          }
          const chunks = buildV1Chunks(pubkey, sigBytes, KIND_TEXT_NOTE, contentBytes);
          const chunkHexes = chunks.map(bytesToHex);
          setOutput({
            dataHex: chunkHexes[0],
            scriptHex: hexToOpReturn(chunkHexes[0]),
            chunks: chunkHexes,
          });
        }
      }
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Encoding failed');
    }
    setSigning(false);
  }, [keyMethod, generatedPriv, content, version]);

  const contentBytes = new TextEncoder().encode(content).length;

  return (
    <div className="space-y-6">
      {/* Version selector */}
      <div className="space-y-2">
        <label className="text-sm font-medium">Format</label>
        <div className="flex gap-2">
          {(['v0', 'v1'] as const).map(v => (
            <Button
              key={v}
              variant={version === v ? 'default' : 'outline'}
              size="sm"
              onClick={() => setVersion(v)}
              className={version === v ? 'bg-[#f7931a] hover:bg-[#e8851a] text-white' : ''}
            >
              {v} {v === 'v1' ? '(chunked)' : ''}
            </Button>
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <label className="text-sm font-medium">Content (TEXT_NOTE)</label>
          <span className={`text-xs ${contentBytes > 280 ? 'text-red-500' : 'text-muted-foreground'}`}>
            {contentBytes} / 280 bytes
          </span>
        </div>
        <Textarea
          placeholder="What's on your mind?"
          value={content}
          onChange={e => setContent(e.target.value)}
          className="min-h-[100px]"
        />
      </div>

      {/* Key section */}
      <div className="space-y-3 p-4 rounded-lg border bg-muted/30">
        <label className="text-sm font-medium">Signing Key</label>
        <div className="flex flex-wrap gap-2">
          {([
            { id: 'generate' as KeyMethod, label: 'Generate random key' },
            { id: 'extension' as KeyMethod, label: 'Nostr extension (Alby)' },
          ] as const).map(({ id, label }) => (
            <Button
              key={id}
              variant={keyMethod === id ? 'default' : 'outline'}
              size="sm"
              onClick={() => setKeyMethod(id)}
              className={keyMethod === id ? 'bg-[#f7931a] hover:bg-[#e8851a] text-white' : ''}
            >
              {label}
            </Button>
          ))}
        </div>

        {keyMethod === 'generate' && (
          <div className="space-y-2">
            <Button variant="outline" size="sm" onClick={generateKey}>
              Generate ephemeral keypair
            </Button>
            {generatedPub && (
              <div className="space-y-1">
                <div className="text-xs text-muted-foreground">Public key (x-only, 32 bytes)</div>
                <div className="font-mono text-xs bg-background rounded p-2 break-all">{generatedPub}</div>
                <div className="text-xs text-muted-foreground">Private key (keep secret)</div>
                <div className="font-mono text-xs bg-background rounded p-2 break-all text-muted-foreground">{generatedPriv}</div>
              </div>
            )}
          </div>
        )}

        {keyMethod === 'extension' && (
          <p className="text-xs text-muted-foreground">
            Uses <code>window.nostr.signSchnorr()</code> from the Alby browser extension to sign the message hash. The private key never leaves your extension.
          </p>
        )}
      </div>

      <Button
        onClick={() => void encode()}
        disabled={signing || !content.trim() || contentBytes > 280}
        className="bg-[#f7931a] hover:bg-[#e8851a] text-white font-semibold"
      >
        {signing ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
        Sign & Encode
      </Button>

      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {output && (
        <div className="space-y-4 p-4 rounded-lg border bg-card">
          <div className="flex items-center gap-2">
            <Badge className="bg-[#f7931a] text-white">Encoded</Badge>
            <Badge variant="outline">{version}</Badge>
          </div>

          {output.chunks ? (
            <div className="space-y-3">
              <p className="text-sm text-muted-foreground">
                Post split into {output.chunks.length} chunks. Broadcast each transaction separately and ensure both are confirmed within 6 blocks.
              </p>
              {output.chunks.map((chunkHex, i) => (
                <div key={i} className="space-y-2">
                  <HexOutput label={`Chunk ${i} - OP_RETURN data`} hex={chunkHex} />
                </div>
              ))}
            </div>
          ) : (
            <div className="space-y-2">
              <HexOutput label="OP_RETURN data" hex={output.dataHex} />
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

export default function EncoderDecoder() {
  return (
    <section id="tools" className="space-y-6">
      <div className="space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">Encode / Decode</h2>
        <p className="text-muted-foreground text-lg">
          Interactive tools for exploring ORS payloads in-browser
        </p>
      </div>

      <Tabs defaultValue="decode" className="space-y-4">
        <TabsList>
          <TabsTrigger value="decode">Decode</TabsTrigger>
          <TabsTrigger value="encode">Encode</TabsTrigger>
        </TabsList>

        <TabsContent value="decode" className="mt-4">
          <DecodeTab />
        </TabsContent>

        <TabsContent value="encode" className="mt-4">
          <EncodeTab />
        </TabsContent>
      </Tabs>
    </section>
  );
}
