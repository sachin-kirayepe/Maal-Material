export default () => ({
  port: parseInt(process.env.PORT || "3001", 10),
  environment: process.env.NODE_ENV || "development",
  database: {
    url: process.env.DATABASE_URL,
  },
  auth: {
    jwtSecret: process.env.JWT_SECRET,
    jwtExpiresIn: process.env.JWT_EXPIRES_IN || "1d",
    jwtRefreshSecret: process.env.JWT_REFRESH_SECRET,
    jwtRefreshExpiresIn: process.env.JWT_REFRESH_EXPIRES_IN || "7d",
  },
  app: {
    name: process.env.APP_NAME || "Maal-Material",
  },
});
