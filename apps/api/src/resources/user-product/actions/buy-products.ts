import { AppKoaContext, AppRouter, User } from 'types';
import userProductService from '../user-product.service';

interface ValidatedData {
  user: User;
}

async function handler(ctx: AppKoaContext<ValidatedData>) {
  const { user } = ctx.state;

  await userProductService.deleteSoft({ userId: user._id });

  ctx.body = {};
}

export default (router: AppRouter) => {
  router.put('/buy-products', handler);
};
