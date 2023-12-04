import { PasswordInput } from '@mantine/core';
import cx from 'clsx';

import classes from './index.module.css';

export default PasswordInput.extend({
  defaultProps: {
    size: 'lg',
  },
  classNames: (_, props) => ({
    input: cx(classes.input, {
      [classes.inputError]: props.error,
    }),
    label: classes.label,
  }),
});
