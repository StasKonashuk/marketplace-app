import { NumberInput } from '@mantine/core';

import classes from './index.module.css';

export default NumberInput.extend({
  classNames: () => ({
    controls: classes.controls,
    input: classes.input,
    label: classes.label,
    section: classes.section,
  }),
});
