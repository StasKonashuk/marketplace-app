import { Tabs } from '@mantine/core';

import classes from './index.module.css';

export default Tabs.extend({
  classNames: () => ({
    tab: classes.tab,
    list: classes.list,
  }),
});
