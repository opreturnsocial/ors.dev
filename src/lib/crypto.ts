import { schnorr } from '@noble/curves/secp256k1.js';
import { sha256 } from '@noble/hashes/sha2.js';
import { bytesToHex, hexToBytes } from './ors';

export { sha256 };

export function generateKeypair(): { privkey: Uint8Array; pubkey: Uint8Array } {
  const privkey = schnorr.utils.randomSecretKey();
  const pubkey = schnorr.getPublicKey(privkey);
  return { privkey, pubkey };
}

export function getPublicKey(privkey: Uint8Array): Uint8Array {
  return schnorr.getPublicKey(privkey);
}

export function signPayload(privkey: Uint8Array, unsignedPayload: Uint8Array): Uint8Array {
  const hash = sha256(unsignedPayload);
  return schnorr.sign(hash, privkey);
}

export function verifySignature(pubkeyHex: string, sigHex: string, messageHash: Uint8Array): boolean {
  try {
    return schnorr.verify(hexToBytes(sigHex), messageHash, hexToBytes(pubkeyHex));
  } catch {
    return false;
  }
}

export function privkeyToHex(privkey: Uint8Array): string {
  return bytesToHex(privkey);
}

export function hexToPrivkey(hex: string): Uint8Array {
  if (hex.length !== 64) throw new Error('Private key must be 64 hex chars (32 bytes)');
  return hexToBytes(hex);
}
