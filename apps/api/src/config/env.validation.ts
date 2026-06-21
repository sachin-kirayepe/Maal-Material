import * as Joi from "joi";

export const envValidationSchema = Joi.object({
  NODE_ENV: Joi.string()
    .valid("development", "production", "test", "provision")
    .default("development"),
  PORT: Joi.number().default(3001),
  DATABASE_URL: Joi.string().required().description("PostgreSQL connection string"),
  JWT_SECRET: Joi.string().required().description("JWT signing secret key"),
  JWT_EXPIRES_IN: Joi.string().default("1d"),
  JWT_REFRESH_SECRET: Joi.string().required().description("JWT refresh secret key"),
  JWT_REFRESH_EXPIRES_IN: Joi.string().default("7d"),
});
