import { z } from 'zod';

import dbSchema from './db.schema';

export const productSchema = dbSchema
  .extend({
    authorId: z.string(),
    name: z.string(),
    imgUrl: z.string().nullable().default(null),
    price: z.number(),
    priceId: z.string().nullable().default(null),
    currency: z.string().optional().default('$'),
    onSale: z.boolean().optional().default(false),
    isSold: z.boolean().optional().default(false),
  })
  .strict();
