import 'dotenv/config';
import express from 'express';
import cors from 'cors';

import authRouter from '../src/routes/auth.js';
import progressRouter from '../src/routes/progress.js';
import runsRouter from '../src/routes/runs.js';

const app = express();

app.use(cors());
app.use(express.json());

app.use('/api/auth', authRouter);
app.use('/api/progress', progressRouter);
app.use('/api/runs', runsRouter);

app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok' });
});

export default app;