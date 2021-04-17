require('dotenv').config();

export const inProd = process.env.NODE_ENV === 'production';

if (!process.env.PRODUCT_HOST) {
  throw Error('you must set "PRODUCT_HOST" in env var (.env)');
}

if (!process.env.APP_TOKEN) {
  throw Error('you must set "APP_TOKEN" in env var (.env)');
}

if (!process.env.JWT_SECRET) {
  throw Error('you must set "JWT_SECRET" in env var (.env)');
}

export const product: { host: string; token: string } = {
  host: process.env.PRODUCT_HOST,
  token: process.env.APP_TOKEN
};

export const jwtSecret = process.env.JWT_SECRET;
