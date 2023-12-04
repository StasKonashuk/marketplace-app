import { Indicator } from '@mantine/core';

import classes from './index.module.css';

export default Indicator.extend({
  classNames: () => ({
    indicator: classes.indicator,
  }),
});
