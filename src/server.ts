import 'reflect-metadata';

import express, { Request, Response, NextFunction } from 'express';
import 'express-async-errors';
import routes from './routes';
import uploadConfig from './config/upload';
import AppError from './errors/AppErro';

import './database';

let app = express();

app.use(express.json());
app.use('/files', express.static(uploadConfig.directory));
app.use(routes); // se torna um middleware

app.use((err: Error, request: Request, response: Response, _: NextFunction) => {
  if (err instanceof AppError) {
    return response.status(err.statusCode).json({
      status: 'error',
      message: err.message,
    });
  }

  return response.status(500).json({
    status: 'error',
    message: 'Houve um erro interno no servidor',
  });
});

app.listen(3333, () => {
  console.log('💇‍♀️ 🚀 ✂💇‍♂️ Gobarber started in the port 3333');
});