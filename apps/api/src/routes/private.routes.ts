import mount from 'koa-mount';
import compose from 'koa-compose';

import { AppKoa } from 'types';

import { accountRoutes } from 'resources/account';
import { userRoutes } from 'resources/user';
import { productRoutes } from 'resources/product';
import { userProductRoutes } from 'resources/user-product';
import { paymentRoutes } from 'resources/payment';

import auth from './middlewares/auth.middleware';

export default (app: AppKoa) => {
  app.use(mount('/account', compose([auth, accountRoutes.privateRoutes])));
  app.use(mount('/users', compose([auth, userRoutes.privateRoutes])));
  app.use(mount('/products', compose([auth, productRoutes.privateRoutes])));
  app.use(mount('/user-products', compose([auth, userProductRoutes.privateRoutes])));
  app.use(mount('/payments', compose([auth, paymentRoutes.privateRoutes])));
};
