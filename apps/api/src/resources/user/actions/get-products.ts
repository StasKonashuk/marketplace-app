import { z } from 'zod';
import { AppKoaContext, AppRouter } from 'types';
import { validateMiddleware } from 'middlewares';
import { productService } from 'resources/product';

const schema = z.object({
  page: z.string().transform(Number).default('1'),
  perPage: z.string().transform(Number).default('10'),
  orderBy: z.enum(['asc', 'desc']).default('desc'),
  filter: z
    .object({
      price: z
        .object({
          from: z.string().default('0'),
          to: z.string().optional(),
        })
        .nullable()
        .default(null),
    })
    .nullable()
    .default(null),
  searchValue: z.string().default(''),
});

type ValidatedData = z.infer<typeof schema>;

type Request = {
  params: {
    id: string;
  };
};

async function handler(ctx: AppKoaContext<ValidatedData, Request>) {
  const { perPage, page, searchValue, filter, orderBy } = ctx.validatedData;

  const validatedSearch = searchValue.split('\\').join('\\\\').split('.').join('\\.');

  const regExp = new RegExp(validatedSearch, 'gi');

  const products = await productService.find(
    {
      $and: [
        { authorId: ctx.request.params.id },
        { name: { $regex: regExp } },
        Number(filter?.price?.to) > 0
          ? { price: { $gte: Number(filter?.price?.from), $lte: Number(filter?.price?.to) } }
          : {},
      ],
    },
    { page, perPage },
    {
      sort: {
        createdOn: orderBy,
      },
    },
  );

  ctx.body = {
    items: products.results,
    totalPages: products.pagesCount,
    count: products.count,
  };
}

export default (router: AppRouter) => {
  router.get('/:id/products', validateMiddleware(schema), handler);
};
