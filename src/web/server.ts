import 'reflect-metadata';
import cors from 'cors';
import express, { type Express } from 'express';
import helmet from 'helmet';
import dotenv from 'dotenv';
import { measureRouter } from './controllers/measure.controller';
import { customerRouter } from './controllers/customer.controller';
import { errorHandlerMiddleware } from 'src/application/middlewares/error-handler-middleware';

const app: Express = express();
dotenv.config();

export const environment = {
  PORT: process.env.PORT,
  NODE_ENV: process.env.NODE_ENV,
  HOST: process.env.HOST,
  CORS_ORIGIN: process.env.CORS_ORIGIN,
  DATABASE_URL: process.env.DATABASE_URL,
  GEMINI_API_KEY: process.env.GEMINI_API_KEY,
};

app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true }));
app.use(cors({ origin: environment.CORS_ORIGIN, credentials: true }));

// Routers
app.use('/', measureRouter);
app.use('/', customerRouter);

// Middlewares
app.use(errorHandlerMiddleware);

const port = environment.PORT;
app.listen(port, () => console.log('Porta usada:', port));
