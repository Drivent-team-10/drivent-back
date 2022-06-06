import { Router } from 'express';

import { authenticateToken, validateBody } from '@/middlewares';
import { paymentsPost } from '@/controllers';
import { createPaymentSchema } from '@/schemas';

const paymentsRouter = Router();

paymentsRouter.post('/', authenticateToken, validateBody(createPaymentSchema), paymentsPost);

export { paymentsRouter };
