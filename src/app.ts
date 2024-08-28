import express from 'express';
import dotenv from 'dotenv';
import meterReadingRoutes from './routes/meterReadingRoutes';
import errorHandler from './utils/errorHandler';

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json({ limit: '10mb' }));

app.use('/api', meterReadingRoutes);

app.use(errorHandler);

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});

export default app;
