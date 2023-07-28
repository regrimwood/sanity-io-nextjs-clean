import nodeCrypto from 'crypto';

export default function createRandomUUID() {
  if (typeof crypto !== 'undefined') {
    return crypto.randomUUID();
  }

  return nodeCrypto.randomUUID();
}
