import multer from '@koa/multer';
import { z } from 'zod';
import { AppKoaContext, AppRouter, User } from 'types';
import { productService } from 'resources/product';
import { validateMiddleware } from 'middlewares';
import { cloudStorageService } from 'services';

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

  ctx.body = product;
}

export default (router: AppRouter) => {
  router.post('/', upload.single('file'), validateMiddleware(schema), handler);
};
