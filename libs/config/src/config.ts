import * as dotenv from 'dotenv';

dotenv.config();

export const config = {
  port: {
    auth: parseInt(process.env.PORT_APP_AUTH, 10) || 3128,
    admin: parseInt(process.env.PORT_APP_ADMIN, 10) || 3129,
    api: parseInt(process.env.PORT_APP_API, 10) || 3130,
  },
  mongodb: {
    uri:
      process.env.MONGODB_URI ||
      'mongodb://admin:qjsslftys128@0.0.0.0:27017/iccms3',
  },
  jwt: {
    secret: process.env.JWT_SECRET || 'secret',
    expiresIn: process.env.EXPIRESIN || '1h',
  },
};
