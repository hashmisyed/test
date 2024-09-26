import { generateKeyPairSync } from 'node:crypto';

const {
    publicKey,
    privateKey,
  } = generateKeyPairSync('rsa', {
    modulusLength: 2048,
  });
  console.log('Public Key:', publicKey.export({ format: 'pem', type: 'pkcs1' }));
  console.log('Private Key:', privateKey.export({ format: 'pem', type: 'pkcs1' }));
  