export default () => ({
  app: {
    port: +process.env.APP_PORT || 3000,
  },

  database: {
    host: process.env.DATABASE_HOST,
    port: +process.env.DATABASE_PORT || 3306,
    database: process.env.DATABASE_DATABASE,
    user: process.env.DATABASE_USER,
    password: process.env.DATABASE_PASSWORD,
  },

  jwt: {
    secret: process.env.JWT_SECRET,
  },
});
