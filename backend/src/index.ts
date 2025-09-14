import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import routes from './routes/index';
import { getPort } from './utils/env';

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

app.use('/', routes);

const port = getPort();

app.listen(port, () => {
  console.log(`🚀 Figma Frames API running on http://localhost:${port}`);
  console.log('📋 Available endpoints:');
  console.log('  GET /health - Health check');
  console.log('  GET /frames?url=<figma-url> - List frames');
  console.log('  GET /frames/:id?url=<figma-url> - Get frame details');
  console.log('  GET /frames/:id/code?url=<figma-url> - Generate frame HTML');
});