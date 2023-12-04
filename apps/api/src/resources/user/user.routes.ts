import { routeUtil } from 'utils';

import list from './actions/list';
import update from './actions/update';
import remove from './actions/remove';
import getProducts from './actions/get-products';

const publicRoutes = routeUtil.getRoutes([]);

const privateRoutes = routeUtil.getRoutes([list, getProducts]);

const adminRoutes = routeUtil.getRoutes([list, update, remove, getProducts]);

export default {
  publicRoutes,
  privateRoutes,
  adminRoutes,
  getProducts,
};
