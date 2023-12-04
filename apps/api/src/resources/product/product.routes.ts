import { routeUtil } from 'utils';

import update from './actions/update';
import list from './actions/list';
import create from './actions/create';
import remove from './actions/remove';

const publicRoutes = routeUtil.getRoutes([]);

const privateRoutes = routeUtil.getRoutes([list, create, update, remove]);

const adminRoutes = routeUtil.getRoutes([list, create, update, remove]);

export default {
  publicRoutes,
  privateRoutes,
  adminRoutes,
};
