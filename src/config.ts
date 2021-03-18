require('dotenv').config();

export const inProd = process.env.NODE_ENV === 'production';

if (!process.env.PRODUCT_HOST) {
  throw Error('you must set "PRODUCT_HOST" in env var (.env)');
}

if (!process.env.APP_TOKEN) {
  throw Error('you must set "APP_TOKEN" in env var (.env)');
}

if (!process.env.JWT_TOKEN) {
  throw Error('you must set "JWT_TOKEN" in env var (.env)');
}

export const product: { service: { host: string; token: string } } = {
  service: {
    host: process.env.PRODUCT_HOST,
    token: process.env.APP_TOKEN
  }
};

export const jwtToken = process.env.JWT_TOKEN;
