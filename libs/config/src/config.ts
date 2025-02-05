import dotenv from 'dotenv';

dotenv.config();

export interface AppInfo {
  path: string;
  type: 'mail' | 'ftp' | 'outftp'; // Customize types as needed
}

export const config = {
  admin: {
    name: 'AdminApp',
    port: parseInt(process.env.PORT_APP_ADMIN, 10) || 3129,
  },
  api: {
    name: 'ApiApp',
    port: parseInt(process.env.PORT_APP_API, 10) || 3130,
  },
  auth: {
    name: 'AuthApp',
    port: parseInt(process.env.PORT_APP_AUTH, 10) || 3128,
  },
  incoming: {
    name: 'IncomingApp',
  },
  env: {
    watchDirectory: process.env.WATCH_DIRECTORY || '',
    watchSubDirs: (JSON.parse(process.env.WATCH_SUB_DIRS) || []) as AppInfo[],
    progress: JSON.parse(process.env.PROGRESS) || {},
    intervalTime: 10 * 1000,
  },
  jwt: {
    secret: process.env.JWT_SECRET || 'secret',
    expiresIn: process.env.EXPIRESIN || '1h',
  },
  mongodb: {
    uri: process.env.MONGODB_URI || 'mongodb://admin:qjsslftys128@0.0.0.0:27017/iccms3',
  },
};
