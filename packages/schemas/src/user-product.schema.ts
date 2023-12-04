import { z } from 'zod';

import dbSchema from './db.schema';

export const userProductSchema = dbSchema
  .extend({
    userId: z.string(),
    productId: z.string(),
    quantity: z.number(),
  })
  .strict();
