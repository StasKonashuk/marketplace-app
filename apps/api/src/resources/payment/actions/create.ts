/* eslint-disable import/no-extraneous-dependencies */
import Stripe from 'stripe';
import { z } from 'zod';
import { AppKoaContext, AppRouter, User } from 'types';
import { validateMiddleware } from 'middlewares';
import config from 'config';

const stripe = new Stripe(config.STRIPE_SECRET_KEY);

const schema = z.object({
  amount: z.number(),
});

interface ValidatedData extends z.infer<typeof schema> {
  user: User;
}

async function handler(ctx: AppKoaContext<ValidatedData>) {
  const { amount } = ctx.validatedData;

  const paymentIntent = await stripe.paymentIntents.create({
    currency: 'usd',
    amount,
    automatic_payment_methods: {
      enabled: true,
    },
  });

  ctx.body = { clientSecret: paymentIntent.client_secret };
}

export default (router: AppRouter) => {
  router.post('/', validateMiddleware(schema), handler);
};
