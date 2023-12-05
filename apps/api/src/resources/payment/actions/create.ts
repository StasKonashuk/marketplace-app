import Stripe from 'stripe';
import { z } from 'zod';
import { AppKoaContext, AppRouter, User } from 'types';
import { validateMiddleware } from 'middlewares';
import config from 'config';

const stripe = new Stripe(config.STRIPE_SECRET_KEY);

const schema = z.object({
  userProducts: z.array(z.object({
    price: z.string(),
    quantity: z.number(),
  })),
});

interface ValidatedData extends z.infer<typeof schema> {
  user: User;
}

async function handler(ctx: AppKoaContext<ValidatedData>) {
  const { userProducts } = ctx.validatedData;

  const session = await stripe.checkout.sessions.create({
    line_items: userProducts,
    mode: 'payment',
    success_url: `${config.WEB_URL}/payment-success`,
    cancel_url: `${config.WEB_URL}/payment-failed`,
  });

  ctx.body = { sessionUrl: session.url };
}

export default (router: AppRouter) => {
  router.post('/', validateMiddleware(schema), handler);
};
