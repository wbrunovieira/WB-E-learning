export const jwtConstants = {
  privateKey: process.env.JWT_PRIVATE_KEY.replace(/\\n/g, '\n'),
  publicKey: process.env.JWT_PUBLIC_KEY.replace(/\\n/g, '\n'),
  expiresIn: '15m',
  refreshExpiresIn: '7d',
};
