import { AppKoaContext, AppRouter, Next } from 'types';
import userProductService from '../user-product.service';

type ValidatedData = never;
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
  await userProductService.deleteMany({ _id: ctx.request.params.id });

  ctx.body = {};
}

export default (router: AppRouter) => {
  router.delete('/:id', validator, handler);
};
