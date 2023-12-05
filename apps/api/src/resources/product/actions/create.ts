import Stripe from 'stripe';
import multer from '@koa/multer';
import { z } from 'zod';
import { AppKoaContext, AppRouter, User } from 'types';
import { productService } from 'resources/product';
import { validateMiddleware } from 'middlewares';
import { cloudStorageService } from 'services';
import config from 'config';

const stripe = new Stripe(config.STRIPE_SECRET_KEY);

const upload = multer();

const schema = z.object({
  name: z.string().min(1, 'Title is required'),
  price: z.string(),
});

interface ValidatedData extends z.infer<typeof schema> {
  user: User;
}

async function handler(ctx: AppKoaContext<ValidatedData>) {
  const { user } = ctx.state;
  const { file } = ctx.request;
  const { name, price } = ctx.validatedData;

  let imgUrl = null;

  if (file) {
    const fileName = `product-${Date.now()}-${file.originalname}`;

    imgUrl = await cloudStorageService.upload(`products/${fileName}`, file);
  }

  const product = await productService.insertOne({
    authorId: user._id,
    name,
    price: Number(price),
    imgUrl,
  });

  const stripeProduct = await stripe.products.create({
    name,
    images: imgUrl ? [imgUrl] : undefined,
  });

  const stripePrice = await stripe.prices.create({
    product: stripeProduct.id,
    unit_amount: Number(price),
    currency: 'usd',
  });

  await productService.updateOne({ _id: product._id }, () => ({ priceId: stripePrice.id }));

  ctx.body = product;
}

export default (router: AppRouter) => {
  router.post('/', upload.single('file'), validateMiddleware(schema), handler);
};
