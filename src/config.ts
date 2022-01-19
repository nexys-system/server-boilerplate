import dotenv from 'dotenv';
import JWT from 'jsonwebtoken';

import { get } from '@nexys/core/dist/context';
import { printAppToken } from '@nexys/core/dist/context/utils';
import { AppTokenDecoded } from '@nexys/core/dist/context/type';

import * as FetchR from '@nexys/fetchr';

dotenv.config();

// init fetchr
export const database: FetchR.Database.Type.Database = {
  username: process.env.DATABASE_USERNAME || '',
  host: process.env.DATABASE_HOST || '',
  password: process.env.DATABASE_PASSWORD || '',
  database: process.env.DATABASE_NAME || '',
  port: 3306
};

export const instance = {
  name: process.env.INSTANCE_NAME || '',
  uuid: process.env.INSTANCE_UUID || ''
};

const errorPrefix = '[CONFIGURATION] ';

if (process.env.SECRET === undefined) {
  throw Error(errorPrefix + 'SECRET is undefined');
}

export const secretKey = process.env.SECRET; //

if (secretKey.length !== 32) {
  throw Error(errorPrefix + 'key must be 32 bytes for aes256');
}

if (process.env.APP_TOKEN === undefined) {
  throw Error(errorPrefix + 'APP TOKEN is undefined');
}

export const appToken = process.env.APP_TOKEN;

//try {
export const decodedAppToken: AppTokenDecoded = JWT.decode(
  appToken
) as AppTokenDecoded;

console.log(printAppToken(decodedAppToken));

// get context
export const context = get(
  { uuid: decodedAppToken.instance },
  { id: decodedAppToken.product },
  decodedAppToken.env,
  appToken
);
