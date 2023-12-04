import { Product } from 'types';
import { userProductSchema } from 'schemas';
import { DATABASE_DOCUMENTS } from 'app-constants';

import db from 'db';

const service = db.createService<Product>(DATABASE_DOCUMENTS.USER_PRODUCTS, {
  schemaValidator: (obj) => userProductSchema.parseAsync(obj),
});

export default Object.assign(service);
