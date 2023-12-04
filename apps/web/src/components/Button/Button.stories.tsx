import { ComponentStory, ComponentMeta } from '@storybook/react';

import Button from './index';

export default {
  title: 'Components/Button',
  component: Button,
  argTypes: {
    children: { name: 'Text', control: 'text', defaultValue: 'Text' },
    disabled: {
      name: 'Disabled',
      options: [true, false],
      control: { type: 'boolean' },
      defaultValue: false,
    },
    fullWidth: {
      name: 'Full width',
      options: [true, false],
      control: { type: 'boolean' },
      defaultValue: false,
    },
    size: {
      name: 'Size',
      options: ['xs', 'sm', 'md', 'lg', 'xl'],
      control: {
        type: 'inline-radio',
        labels: {
          xs: 'Extra small',
          sm: 'Small',
          md: 'Medium',
          lg: 'Large',
          xl: 'Extra large',
        },
      },
      defaultValue: 'md',
    },
  },
} as ComponentMeta<typeof Button>;

const Template: ComponentStory<typeof Button> = ({ ...args }) => (
  <Button {...args}>
    {args.children}
  </Button>
);

export const ButtonTemplate = Template.bind({});
