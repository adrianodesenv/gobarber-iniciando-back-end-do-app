import 'reflect-metadata';

import express from 'express';
import routes from './routes';

import './database';

let app = express();

app.use(express.json());

app.use(routes); // se torna um middleware

app.listen(3333, () => {
  console.log('✂️ Gobarber started in the port 3333');
});
