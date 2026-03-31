import {
  buildUnsignedPayload,
  buildORSPayload,
  buildV1Chunks,
  buildV1SigningBody,
  hexToBytes,
  bytesToHex,
  KIND_TEXT_NOTE,
  KIND_PROFILE_UPDATE,
  KIND_TEXT_REPLY,
  KIND_REPOST,
  KIND_QUOTE_REPOST,
  KIND_FOLLOW,
  ORS_VERSION_V0,
  ORS_VERSION_V1,
  parseORSPayload as _parseORSPayload,
  parseV1Chunk as _parseV1Chunk,
  assembleV1Body as _assembleV1Body,
  type V1ChunkInfo,
} from "@opreturnsocial/protocol";

// ─── Section A: direct re-exports ────────────────────────────────────────────

export {
  buildUnsignedPayload,
  buildORSPayload,
  buildV1Chunks,
  buildV1SigningBody,
  hexToBytes,
  bytesToHex,
  KIND_TEXT_NOTE,
  KIND_PROFILE_UPDATE,
  KIND_TEXT_REPLY,
  KIND_REPOST,
  KIND_QUOTE_REPOST,
  KIND_FOLLOW,
};

export type { V1ChunkInfo };

// ─── Section B: local-only UI utilities (not in protocol) ────────────────────

function stripOpReturnPrefix(hex: string): string {
  const h = hex.toLowerCase();
  if (h.startsWith("6a")) {
    if (h.slice(2, 4) === "4c") return h.slice(6);
    return h.slice(4);
  }
  return h;
}

export function kindName(kind: number): string {
  const names: Record<number, string> = {
    [KIND_TEXT_NOTE]: "TEXT_NOTE",
    [KIND_PROFILE_UPDATE]: "PROFILE_UPDATE",
    [KIND_TEXT_REPLY]: "TEXT_REPLY",
    [KIND_REPOST]: "REPOST",
    [KIND_QUOTE_REPOST]: "QUOTE_REPOST",
    [KIND_FOLLOW]: "FOLLOW",
  };
  return names[kind] ?? `UNKNOWN(0x${kind.toString(16)})`;
}

export function detectVersion(hex: string): "v0" | "v1" | "unknown" {
  const h = stripOpReturnPrefix(hex);
  if (h.length < 8) return "unknown";
  if (h.slice(0, 6) !== "4f5253") return "unknown";
  const ver = parseInt(h.slice(6, 8), 16);
  if (ver === ORS_VERSION_V0) return "v0";
  if (ver === ORS_VERSION_V1) return "v1";
  return "unknown";
}

// ─── Section C: adapter types and wrapper functions ───────────────────────────

export interface ParsedPost {
  version: "v0";
  pubkey: string;
  sig: string;
  kind: number;
  kindName: string;
  content: string;
}

export interface ParsedV1Post {
  version: "v1";
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
  const data = hexToBytes(stripOpReturnPrefix(dataHex));
  const result = _parseORSPayload(data);
  if (!result.supported) {
    return { ok: false, error: result.reason };
  }
  const post = result.post;
  const content = "content" in post ? post.content : "";
  return {
    ok: true,
    post: {
      version: "v0",
      pubkey: post.pubkey,
      sig: post.sig,
      kind: post.kind,
      kindName: kindName(post.kind),
      content,
    },
  };
}

export function parseV1Chunk(dataHex: string): V1ChunkInfo | null {
  return _parseV1Chunk(hexToBytes(stripOpReturnPrefix(dataHex)));
}

export function assembleV1Body(slices: Uint8Array[]): ParseResult {
  const assembled = _assembleV1Body(slices);
  if (!assembled) return { ok: false, error: "Assembled body too short" };
  const { pubkey, sig, kind, kindData } = assembled;
  return {
    ok: true,
    post: {
      version: "v1",
      pubkey: bytesToHex(pubkey),
      sig: bytesToHex(sig),
      kind,
      kindName: kindName(kind),
      content: new TextDecoder().decode(kindData),
      totalChunks: slices.length,
    },
  };
}
