// In a real app, use 'ethers' or 'crypto-js'. 
// For this standalone demo, we implement simple hashing using Web Crypto API.

export async function sha256(message: string): Promise<string> {
  const msgBuffer = new TextEncoder().encode(message);
  const hashBuffer = await crypto.subtle.digest('SHA-256', msgBuffer);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}

export async function generateCertHash(cert: any): Promise<string> {
  // Create a canonical string representation (simplified)
  // In prod, use a dedicated JSON canonicalization library
  const canonical = JSON.stringify(cert, Object.keys(cert).sort());
  return sha256(canonical);
}

// Mock verification of an ECDSA signature
export function verifySignature(message: string, signature: string, publicKey: string): boolean {
  // In a real implementation, use ethers.utils.verifyMessage
  // For demo: assume signature is valid if it exists and isn't "INVALID"
  return signature.length > 10 && signature !== "INVALID";
}
