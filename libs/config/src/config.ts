import dotenv from 'dotenv';

dotenv.config();

export interface AppInfo {
  path: string;
  type: 'mail' | 'ftp' | 'outftp'; // Customize types as needed
}

export const config = {
  admin: {
    name: 'AdminApp',
    port: parseInt(process.env.PORT_APP_ADMIN, 10) || 3128,
  },
  api: {
    name: 'ApiApp',
    port: parseInt(process.env.PORT_APP_API, 10) || 3129,
  },
  env: {
    intervalTime: 10 * 1000,
    progress: JSON.parse(process.env.PROGRESS) || {},
    watchDirectory: process.env.WATCH_DIRECTORY || '',
    watchSubDirs: (JSON.parse(process.env.WATCH_SUB_DIRS) || []) as AppInfo[],
    initialPassword: process.env.INITIAL_PASSWORD || '12345678',
  },
  incoming: {
    name: 'IncomingApp',
  },
  jwt: {
    expiresIn: process.env.EXPIRESIN || '1h',
    secret: process.env.JWT_SECRET || 'secret',
  },
  mongodb: {
    uri: process.env.MONGODB_URI || 'mongodb://admin:qjsslftys128@0.0.0.0:27017/iccms3',
  },
};
