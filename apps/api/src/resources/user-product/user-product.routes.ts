import { routeUtil } from 'utils';

import remove from './actions/remove';
import list from './actions/list';
import create from './actions/create';
import update from './actions/update';
import buyProducts from './actions/buy-products';

const publicRoutes = routeUtil.getRoutes([]);

const privateRoutes = routeUtil.getRoutes([list, create, buyProducts, remove, update]);

const adminRoutes = routeUtil.getRoutes([list, create, buyProducts, remove, update]);

export default {
  publicRoutes,
  privateRoutes,
  adminRoutes,
};
