import { z } from 'zod';

import { userProductSchema } from 'schemas';

export type UserProduct = z.infer<typeof userProductSchema>;
