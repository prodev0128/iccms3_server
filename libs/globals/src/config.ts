import dotenv from 'dotenv';

import { DataTypes } from '@app/globals/constants';

dotenv.config();

export interface AppInfo {
  path: string;
  type: DataTypes.EMAIL | DataTypes.FTP;
}

export const config = {
  env: {
    intervalTime: 10 * 1000,
    progress: JSON.parse(process.env.PROGRESS) || {},
    watchDirectory: process.env.WATCH_DIRECTORY || '',
    watchSubDirs: (JSON.parse(process.env.WATCH_SUB_DIRS) || []) as AppInfo[],
    initialPassword: process.env.INITIAL_PASSWORD || '12345678',
  },
  auth: {
    name: 'AuthApp',
    port: parseInt(process.env.PORT_APP_AUTH) || 3130,
  },
  admin: {
    name: 'AdminApp',
    port: parseInt(process.env.PORT_APP_ADMIN) || 3131,
  },
  censor: {
    name: 'CensorApp',
    port: parseInt(process.env.PORT_APP_CENSOR) || 3132,
  },
  stat: {
    name: 'StatApp',
    port: parseInt(process.env.PORT_APP_STAT) || 3133,
  },
  media: {
    name: 'MediaApp',
    port: parseInt(process.env.PORT_APP_MEDIA) || 3134,
  },
  incoming: {
    name: 'IncomingApp',
  },
  outgoing: {
    name: 'OutgoingApp',
  },
  globals: {
    name: 'GlobalsLib',
  },
  jwt: {
    name: 'JwtLib',
    expiresIn: process.env.EXPIRESIN || '1h',
    secret: process.env.JWT_SECRET || 'secret',
  },
  mongodb: {
    name: 'MongoLib',
    uri: process.env.MONGODB_URI || 'mongodb://admin:qjsslftys128@0.0.0.0:27017/iccms3',
  },
};
