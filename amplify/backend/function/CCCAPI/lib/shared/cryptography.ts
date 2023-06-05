import crypto from 'crypto';

// Generate a secret key
export function generateKey(): string {
  return crypto.randomBytes(32).toString('hex');
}

// Encrypt a message
export function encryptMessage(key: string, message: string): string {
  const cipher = crypto.createCipheriv('aes-256-cbc', Buffer.from(key, 'hex'), Buffer.alloc(16, 0));
  let encrypted = cipher.update(message);
  encrypted = Buffer.concat([encrypted, cipher.final()]);
  return encrypted.toString('hex');
}

// Decrypt a message
export function decryptMessage(key: string, encryptedMessage: string): string {
  const decipher = crypto.createDecipheriv('aes-256-cbc', Buffer.from(key, 'hex'), Buffer.alloc(16, 0));
  let decrypted = decipher.update(Buffer.from(encryptedMessage, 'hex'));
  decrypted = Buffer.concat([decrypted, decipher.final()]);
  return decrypted.toString();
}
