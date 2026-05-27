import 'dotenv/config';
import express   from 'express';
import cors      from 'cors';
import helmet    from 'helmet';
import morgan    from 'morgan';

process.on('unhandledRejection', (reason) => {
  console.error('UNHANDLED REJECTION:', reason);
});

import authRouter          from './routes/auth.js';
import ridersRouter      from './routes/riders.js';
import applicationsRouter from './routes/applications.js';
import repaymentsRouter  from './routes/repayments.js';
import bikesRouter       from './routes/bikes.js';
import mpesaRouter       from './routes/mpesa.js';

const app  = express();
const PORT = process.env.PORT || 3000;

// ── Middleware ────────────────────────────────────────────────
app.use(helmet());
app.use(cors({ origin: (process.env.ALLOWED_ORIGINS || '').split(',') }));
app.use(morgan('dev'));
app.use(express.json());

// ── Routes ────────────────────────────────────────────────────
app.get('/health', (_req, res) => res.json({ status: 'ok', service: 'MotoLift API' }));
app.use('/api/auth',          authRouter);
app.use('/api/riders',       ridersRouter);
app.use('/api/applications', applicationsRouter);
app.use('/api/repayments',   repaymentsRouter);
app.use('/api/bikes',        bikesRouter);
app.use('/api/mpesa',        mpesaRouter);

// ── 404 + Error handlers ──────────────────────────────────────
app.use((_req, res) => res.status(404).json({ error: 'Route not found' }));
app.use((err, _req, res, _next) => {
  console.error(err);
  res.status(500).json({ error: 'Internal server error' });
});

app.listen(PORT, () => console.log(`🏍  MotoLift API running on http://localhost:${PORT}`));
