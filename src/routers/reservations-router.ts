import { Router } from 'express';

import { authenticateToken, validateBody } from '@/middlewares';
import { reservationsPost } from '@/controllers';
import { createReservationSchema } from '@/schemas';

const reservationsRouter = Router();

reservationsRouter.post('/', authenticateToken, validateBody(createReservationSchema), reservationsPost);

export { reservationsRouter };
