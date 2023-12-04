import { z } from 'zod';
import { AppKoaContext, AppRouter, Product, User, UserProduct } from 'types';
import { productService } from 'resources/product';
import { userProductService } from 'resources/user-product';
import { validateMiddleware } from 'middlewares';

const schema = z.object({
  archived: z.string().optional(),
});

interface ValidatedData extends z.infer<typeof schema> {
  user: User;
}

async function handler(ctx: AppKoaContext<ValidatedData>) {
  const { user } = ctx.state;
  const { archived } = ctx.validatedData;

  const userProducts = await userProductService.find(
    {
      $and: [{ userId: user._id }, archived === 'true' ? { deletedOn: { $ne: null } } : {}],
    },
    {
      skipDeletedOnDocs: archived === 'true' ? false : true,
      sort: {
        createdOn: 'desc',
      },
    },
  );

  const productIds = userProducts.results.map((userProduct: UserProduct) => userProduct.productId);

  const productsData = await productService.find({ _id: { $in: productIds } });

  const userProductsData = userProducts.results.map((userProduct: UserProduct) => ({
    ...userProduct,
    productData: productsData.results.find((p: Product) => p._id === userProduct.productId),
  }));

  ctx.body = userProductsData;
}

export default (router: AppRouter) => {
  router.get('/', validateMiddleware(schema), handler);
};
