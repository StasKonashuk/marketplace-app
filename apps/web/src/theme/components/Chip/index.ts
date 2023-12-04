import { Chip } from '@mantine/core';

import classes from './index.module.css';

export default Chip.extend({
  classNames: () => ({
    root: classes.root,
    label: classes.label,
  }),
});
