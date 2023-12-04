import { z } from 'zod';
import { AppKoaContext, AppRouter, Next } from 'types';
import { productService } from 'resources/product';
import { validateMiddleware } from 'middlewares';

const schema = z.object({
  customerId: z.string(),
}).strict();

type ValidatedData = z.infer<typeof schema>;
type Request = {
  params: {
    id: string;
  }
};

async function validator(ctx: AppKoaContext<ValidatedData, Request>, next: Next) {
  const isProductExists = await productService.exists({ _id: ctx.request.params.id });

  ctx.assertError(isProductExists, 'Product not found');

  await next();
}

async function handler(ctx: AppKoaContext<ValidatedData, Request>) {
  const { customerId } = ctx.validatedData;

  const updatedProduct = await productService.updateOne(
    { _id: ctx.request.params?.id  },
    () => ({ customerId }),
  );

  ctx.body = updatedProduct;
}

export default (router: AppRouter) => {
  router.put('/:id',  validateMiddleware(schema), validator, handler);
};
