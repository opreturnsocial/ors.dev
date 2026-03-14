// ORS protocol encode/decode - browser-compatible (no Node.js Buffer)
// Ported from packages/protocol/src/

const ORS_MAGIC = new Uint8Array([0x4f, 0x52, 0x53]); // "ORS"
const ORS_VERSION = 0x00;
const ORS_VERSION_V1 = 0x01;

const PUBKEY_BYTES = 32;
const SIG_BYTES = 64;
const SIG_OFFSET = 36;   // magic(3) + version(1) + pubkey(32)
const KIND_OFFSET = 100; // SIG_OFFSET(36) + sig(64)
const DATA_OFFSET = 101; // KIND_OFFSET(100) + kind(1)

const V1_CHUNK0_DATA = 74;
const V1_CHUNKN_DATA = 75;

export const KIND_TEXT_NOTE = 0x01;
export const KIND_PROFILE_UPDATE = 0x02;
export const KIND_TEXT_REPLY = 0x03;
export const KIND_REPOST = 0x04;
export const KIND_QUOTE_REPOST = 0x05;
export const KIND_FOLLOW = 0x06;

export function kindName(kind: number): string {
  const names: Record<number, string> = {
    [KIND_TEXT_NOTE]: 'TEXT_NOTE',
    [KIND_PROFILE_UPDATE]: 'PROFILE_UPDATE',
    [KIND_TEXT_REPLY]: 'TEXT_REPLY',
    [KIND_REPOST]: 'REPOST',
    [KIND_QUOTE_REPOST]: 'QUOTE_REPOST',
    [KIND_FOLLOW]: 'FOLLOW',
  };
  return names[kind] ?? `UNKNOWN(0x${kind.toString(16)})`;
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

export function hexToBytes(hex: string): Uint8Array {
  const bytes = new Uint8Array(hex.length / 2);
  for (let i = 0; i < hex.length; i += 2) {
    bytes[i / 2] = parseInt(hex.slice(i, i + 2), 16);
  }
  return bytes;
}

export function bytesToHex(bytes: Uint8Array): string {
  return Array.from(bytes).map(b => b.toString(16).padStart(2, '0')).join('');
}

export function hexToOpReturn(dataHex: string): string {
  const len = dataHex.length / 2;
  const lenByte = len.toString(16).padStart(2, '0');
  return `6a${lenByte}${dataHex}`;
}

export function stripOpReturnPrefix(hex: string): string {
  // Strip OP_RETURN opcode (6a) + push byte(s) if present
  const h = hex.toLowerCase();
  if (h.startsWith('6a')) {
    // OP_PUSHDATA1 (4c): 6a 4c <len> <data> - skip 3 bytes = 6 hex chars
    if (h.slice(2, 4) === '4c') return h.slice(6);
    // Standard: 6a <len> <data> - skip 2 bytes = 4 hex chars
    return h.slice(4);
  }
  return h;
}

const encoder = new TextEncoder();
const decoder = new TextDecoder();

function concat(...arrays: Uint8Array[]): Uint8Array {
  const total = arrays.reduce((sum, a) => sum + a.length, 0);
  const out = new Uint8Array(total);
  let pos = 0;
  for (const a of arrays) {
    out.set(a, pos);
    pos += a.length;
  }
  return out;
}

function equal(a: Uint8Array, b: Uint8Array): boolean {
  if (a.length !== b.length) return false;
  return a.every((v, i) => v === b[i]);
}

// ─── Unsigned payload builders ─────────────────────────────────────────────────

export function buildUnsignedPayload(content: string, pubkey: Uint8Array): Uint8Array {
  if (pubkey.length !== PUBKEY_BYTES) throw new Error('pubkey must be 32 bytes');
  const contentBytes = encoder.encode(content);

  const buf = new Uint8Array(SIG_OFFSET + 1 + contentBytes.length);
  let pos = 0;
  buf.set(ORS_MAGIC, pos); pos += 3;
  buf[pos++] = ORS_VERSION;
  buf.set(pubkey, pos); pos += PUBKEY_BYTES;
  buf[pos++] = KIND_TEXT_NOTE;
  buf.set(contentBytes, pos);
  return buf;
}

// V1 signing body: pubkey(32) + kind(1) + kindData
export function buildV1SigningBody(pubkey: Uint8Array, kind: number, kindData: Uint8Array): Uint8Array {
  const buf = new Uint8Array(PUBKEY_BYTES + 1 + kindData.length);
  buf.set(pubkey, 0);
  buf[PUBKEY_BYTES] = kind;
  buf.set(kindData, PUBKEY_BYTES + 1);
  return buf;
}

// ─── v0 payload builder ──────────────────────────────────────────────────────

export function buildORSPayload(content: string, pubkey: Uint8Array, sig: Uint8Array): Uint8Array {
  if (sig.length !== SIG_BYTES) throw new Error('sig must be 64 bytes');
  const unsigned = buildUnsignedPayload(content, pubkey);

  const buf = new Uint8Array(unsigned.length + SIG_BYTES);
  buf.set(unsigned.subarray(0, SIG_OFFSET), 0);
  buf.set(sig, SIG_OFFSET);
  buf.set(unsigned.subarray(SIG_OFFSET), KIND_OFFSET);
  return buf;
}

// ─── v1 chunk builder ────────────────────────────────────────────────────────

export function buildV1Chunks(pubkey: Uint8Array, sig: Uint8Array, kind: number, kindData: Uint8Array): Uint8Array[] {
  if (pubkey.length !== PUBKEY_BYTES) throw new Error('pubkey must be 32 bytes');
  if (sig.length !== SIG_BYTES) throw new Error('sig must be 64 bytes');

  const body = concat(pubkey, sig, new Uint8Array([kind]), kindData);

  const numNonRootChunks = Math.ceil(Math.max(0, body.length - V1_CHUNK0_DATA) / V1_CHUNKN_DATA);
  const totalChunks = 1 + numNonRootChunks;

  const chunks: Uint8Array[] = [];

  // Chunk 0
  const chunk0Body = body.subarray(0, V1_CHUNK0_DATA);
  const chunk0 = new Uint8Array(6 + chunk0Body.length);
  chunk0.set(ORS_MAGIC, 0);
  chunk0[3] = ORS_VERSION_V1;
  chunk0[4] = 0x00;
  chunk0[5] = totalChunks;
  chunk0.set(chunk0Body, 6);
  chunks.push(chunk0);

  // Chunks 1..N
  for (let n = 1; n < totalChunks; n++) {
    const start = V1_CHUNK0_DATA + (n - 1) * V1_CHUNKN_DATA;
    const end = Math.min(start + V1_CHUNKN_DATA, body.length);
    const slice = body.subarray(start, end);
    const chunk = new Uint8Array(5 + slice.length);
    chunk.set(ORS_MAGIC, 0);
    chunk[3] = ORS_VERSION_V1;
    chunk[4] = n;
    chunk.set(slice, 5);
    chunks.push(chunk);
  }

  return chunks;
}

// ─── v0 parser ───────────────────────────────────────────────────────────────

export interface ParsedPost {
  version: 'v0';
  pubkey: string;
  sig: string;
  kind: number;
  kindName: string;
  content: string;
}

export interface ParsedV1Post {
  version: 'v1';
  pubkey: string;
  sig: string;
  kind: number;
  kindName: string;
  content: string;
  totalChunks: number;
}

export type ParseResult =
  | { ok: true; post: ParsedPost | ParsedV1Post }
  | { ok: false; error: string };

export function parseORSPayload(dataHex: string): ParseResult {
  const hex = stripOpReturnPrefix(dataHex);
  const data = hexToBytes(hex);

  if (data.length < DATA_OFFSET + 1) return { ok: false, error: 'Too short' };
  if (!equal(data.subarray(0, 3), ORS_MAGIC)) return { ok: false, error: 'Wrong magic bytes (not ORS)' };

  const version = data[3];
  if (version !== ORS_VERSION) {
    if (version === ORS_VERSION_V1) return { ok: false, error: 'This is a v1 chunk - use v1 parser' };
    return { ok: false, error: `Unsupported version: ${version}` };
  }

  const pubkey = bytesToHex(data.subarray(4, SIG_OFFSET));
  const sig = bytesToHex(data.subarray(SIG_OFFSET, KIND_OFFSET));
  const kind = data[KIND_OFFSET];
  const content = decoder.decode(data.subarray(DATA_OFFSET));

  return {
    ok: true,
    post: { version: 'v0', pubkey, sig, kind, kindName: kindName(kind), content },
  };
}

// ─── v1 parser ───────────────────────────────────────────────────────────────

export interface V1ChunkInfo {
  chunkNum: number;
  totalChunks?: number;
  bodySlice: Uint8Array;
}

export function parseV1Chunk(dataHex: string): V1ChunkInfo | null {
  const hex = stripOpReturnPrefix(dataHex);
  const data = hexToBytes(hex);

  if (data.length < 5) return null;
  if (!equal(data.subarray(0, 3), ORS_MAGIC)) return null;
  if (data[3] !== ORS_VERSION_V1) return null;

  const chunkNum = data[4];

  if (chunkNum === 0) {
    if (data.length < 7) return null;
    const totalChunks = data[5];
    if (totalChunks < 1) return null;
    return { chunkNum: 0, totalChunks, bodySlice: data.subarray(6) };
  }

  if (data.length < 6) return null;
  return { chunkNum, bodySlice: data.subarray(5) };
}

export function assembleV1Body(slices: Uint8Array[]): ParseResult {
  const body = concat(...slices);
  if (body.length < PUBKEY_BYTES + SIG_BYTES + 1) {
    return { ok: false, error: 'Assembled body too short' };
  }

  const pubkey = bytesToHex(body.subarray(0, PUBKEY_BYTES));
  const sig = bytesToHex(body.subarray(PUBKEY_BYTES, PUBKEY_BYTES + SIG_BYTES));
  const kind = body[PUBKEY_BYTES + SIG_BYTES];
  const kindData = body.subarray(PUBKEY_BYTES + SIG_BYTES + 1);
  const content = decoder.decode(kindData);

  return {
    ok: true,
    post: {
      version: 'v1',
      pubkey,
      sig,
      kind,
      kindName: kindName(kind),
      content,
      totalChunks: slices.length,
    },
  };
}

export function detectVersion(hex: string): 'v0' | 'v1' | 'unknown' {
  const h = stripOpReturnPrefix(hex);
  if (h.length < 8) return 'unknown';
  const magic = h.slice(0, 6);
  if (magic !== '4f5253') return 'unknown';
  const ver = parseInt(h.slice(6, 8), 16);
  if (ver === ORS_VERSION) return 'v0';
  if (ver === ORS_VERSION_V1) return 'v1';
  return 'unknown';
}
