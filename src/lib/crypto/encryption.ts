import crypto from 'crypto';

const ALGORITHM = 'aes-256-gcm';
const KEY = process.env.ENCRYPTION_KEY || 'default-key-please-change-in-production';

if (KEY.length !== 32) {
  throw new Error('ENCRYPTION_KEY must be exactly 32 characters long');
}

export function encrypt(text: string): string {
  const iv = crypto.randomBytes(16);
  const cipher = crypto.createCipher(ALGORITHM, KEY);
  cipher.setAAD(iv);
  
  let encrypted = cipher.update(text, 'utf8', 'hex');
  encrypted += cipher.final('hex');
  
  const authTag = cipher.getAuthTag();
  
  return `${iv.toString('hex')}:${authTag.toString('hex')}:${encrypted}`;
}

export function decrypt(encryptedText: string): string {
  const parts = encryptedText.split(':');
  if (parts.length !== 3) {
    throw new Error('Invalid encrypted text format');
  }
  
  const [ivHex, authTagHex, encrypted] = parts;
  const iv = Buffer.from(ivHex, 'hex');
  const authTag = Buffer.from(authTagHex, 'hex');
  
  const decipher = crypto.createDecipher(ALGORITHM, KEY);
  decipher.setAAD(iv);
  decipher.setAuthTag(authTag);
  
  let decrypted = decipher.update(encrypted, 'hex', 'utf8');
  decrypted += decipher.final('utf8');
  
  return decrypted;
}