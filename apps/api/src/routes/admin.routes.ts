import mount from 'koa-mount';
import compose from 'koa-compose';

import { AppKoa } from 'types';

import { accountRoutes } from 'resources/account';
import { userRoutes } from 'resources/user';
import { productRoutes } from 'resources/product';
import { userProductRoutes } from 'resources/user-product';
import { paymentRoutes } from 'resources/payment';

import adminAuth from './middlewares/admin-auth.middleware';

export default (app: AppKoa) => {
  app.use(mount('/admin/account', compose([adminAuth, accountRoutes.adminRoutes])));
  app.use(mount('/admin/users', compose([adminAuth, userRoutes.adminRoutes])));
  app.use(mount('/admin/products', compose([adminAuth, productRoutes.adminRoutes])));
  app.use(mount('/admin/user-products', compose([adminAuth, userProductRoutes.adminRoutes])));
  app.use(mount('/admin/payment', compose([adminAuth, paymentRoutes.adminRoutes])));
};
