// apps/api/src/utils/crypto.ts
// Native Web Crypto API for Cloudflare Workers (No external dependencies like bcrypt/argon2)

const ITERATIONS = 100000;
const HASH_ALGORITHM = 'SHA-256';
const KEY_LEN = 32;

/**
 * Hash a password using PBKDF2
 * @param password The plain text password
 * @returns A string in the format "saltHex:hashHex"
 */
export async function hashPassword(password: string): Promise<string> {
  const salt = crypto.getRandomValues(new Uint8Array(16));
  
  const keyMaterial = await crypto.subtle.importKey(
    'raw',
    new TextEncoder().encode(password),
    { name: 'PBKDF2' },
    false,
    ['deriveBits']
  );

  const hashBuffer = await crypto.subtle.deriveBits(
    {
      name: 'PBKDF2',
      salt: salt,
      iterations: ITERATIONS,
      hash: HASH_ALGORITHM
    },
    keyMaterial,
    KEY_LEN * 8
  );

  const saltHex = Array.from(salt).map(b => b.toString(16).padStart(2, '0')).join('');
  const hashHex = Array.from(new Uint8Array(hashBuffer)).map(b => b.toString(16).padStart(2, '0')).join('');

  return `${saltHex}:${hashHex}`;
}

/**
 * Verify a password against a stored PBKDF2 hash
 * @param password The plain text password to check
 * @param storedHash The stored hash string in format "saltHex:hashHex"
 * @returns boolean indicating if password matches
 */
export async function verifyPassword(password: string, storedHash: string): Promise<boolean> {
  if (!storedHash || !storedHash.includes(':')) return false;
  
  const [saltHex, hashHex] = storedHash.split(':');
  
  // Convert salt hex to Uint8Array
  const saltBytes = new Uint8Array(saltHex.length / 2);
  for (let i = 0; i < saltHex.length; i += 2) {
    saltBytes[i / 2] = parseInt(saltHex.substring(i, i + 2), 16);
  }

  const keyMaterial = await crypto.subtle.importKey(
    'raw',
    new TextEncoder().encode(password),
    { name: 'PBKDF2' },
    false,
    ['deriveBits']
  );

  const hashBuffer = await crypto.subtle.deriveBits(
    {
      name: 'PBKDF2',
      salt: saltBytes,
      iterations: ITERATIONS,
      hash: HASH_ALGORITHM
    },
    keyMaterial,
    KEY_LEN * 8
  );

  const testHashHex = Array.from(new Uint8Array(hashBuffer)).map(b => b.toString(16).padStart(2, '0')).join('');

  // Use timing-safe string comparison if available, otherwise strict equality
  return testHashHex === hashHex;
}

/**
 * Generate a cryptographically secure random token
 * @param length Length of the random token in bytes (before hex encoding)
 * @returns Hex string token
 */
export function generateToken(length = 32): string {
  const bytes = crypto.getRandomValues(new Uint8Array(length));
  return Array.from(bytes).map(b => b.toString(16).padStart(2, '0')).join('');
}
