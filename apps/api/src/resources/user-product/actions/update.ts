import { z } from 'zod';
import { AppKoaContext, Next, AppRouter } from 'types';
import { validateMiddleware } from 'middlewares';
import userProductService from '../user-product.service';

const schema = z.object({
  quantity: z.number().min(1),
});

type ValidatedData = z.infer<typeof schema>;
type Request = {
  params: {
    id: string;
  };
};

async function validator(ctx: AppKoaContext<ValidatedData, Request>, next: Next) {
  const isUserProductExists = await userProductService.exists({ _id: ctx.request.params.id });

  ctx.assertError(isUserProductExists, 'User product not found');

  await next();
}

async function handler(ctx: AppKoaContext<ValidatedData, Request>) {
  const { quantity } = ctx.validatedData;

  const updatedUserProduct = await userProductService.updateOne(
    { _id: ctx.request.params?.id },
    () => ({ quantity }),
  );

  ctx.body = updatedUserProduct;
}

export default (router: AppRouter) => {
  router.put('/:id', validator, validateMiddleware(schema), handler);
};
