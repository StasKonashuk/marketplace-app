import { z } from 'zod';
import { AppKoaContext, AppRouter, User } from 'types';
import { validateMiddleware } from 'middlewares';
import userProductService from '../user-product.service';

const schema = z.object({
  productId: z.string(),
  quantity: z.number(),
});

interface ValidatedData extends z.infer<typeof schema> {
  user: User;
}

async function handler(ctx: AppKoaContext<ValidatedData>) {
  const { user } = ctx.state;
  const { productId, quantity } = ctx.validatedData;

  const addedProduct = await userProductService.insertOne({
    userId: user._id,
    productId,
    quantity,
  });

  ctx.body = addedProduct;
}

export default (router: AppRouter) => {
  router.post('/', validateMiddleware(schema), handler);
};
