import { routeUtil } from 'utils';

import create from './actions/create';

const publicRoutes = routeUtil.getRoutes([]);

const privateRoutes = routeUtil.getRoutes([create]);

const adminRoutes = routeUtil.getRoutes([create]);

export default {
  publicRoutes,
  privateRoutes,
  adminRoutes,
};
