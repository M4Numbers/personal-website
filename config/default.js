module.exports = {
  app: {
    http2: {
      enabled: false,
      key: '/path/to/key/file',
      cert: '/path/to/cert/file',
    },
    name: 'j4numbers',
    hostname: 'localhost',
    port: '8080',
  },
  jwt: {
    public_cert: '/path/to/cert/file',
    private_key: '/path/to/key/file',
  },
  cache: {
    type: 'file',
    file: {
      base_path: './sessions/',
    },
    redis: {
      cluster: false,
      host: 'localhost',
      port: 6379,
    },
  },
  nunjucks: {
    options: {
      autoescape: true,
    },
  },
  functionality: {},
  cookies: {
    domain: 'localhost',
    secure_domain: 'localhost',
    path: '/',
    passphrase: 'TO_BE_FILLED_IN_ON_PRODUCTION',
  },
  database: {
    uri: 'mongodb://user@password:mongodb-server:27017/database',
  },
  logger: {
    level: 'info',
  },
  admin: {
    hash: 'TO_BE_FILLED_IN_ON_PRODUCTION',
  },
  protected: {
    question: 'TO_BE_FILLED_IN_ON_PRODUCTION',
    hint: 'TO_BE_FILLED_IN_ON_PRODUCTION',
    hash: 'TO_BE_FILLED_IN_ON_PRODUCTION',
  },
};
