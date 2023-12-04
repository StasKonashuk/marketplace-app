import { ComponentStory, ComponentMeta } from '@storybook/react';

import Input from './index';

export default {
  title: 'Components/Input',
  component: Input,
  argTypes: {
    value: { name: 'Value', control: 'text', defaultValue: 'Text' },
    disabled: {
      name: 'Disabled',
      options: [true, false],
      control: { type: 'boolean' },
      defaultValue: false,
    },
    onChange: { name: 'Value', control: 'text', defaultValue: 'Text' },
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
    label: { name: 'Label', control: 'text', defaultValue: 'Label' },
    placeholder: { name: 'Placeholder', control: 'text', defaultValue: 'Placeholder' },
    error: { name: 'Error', control: 'text', defaultValue: 'Error' },
  },
} as ComponentMeta<typeof Input>;

const Template: ComponentStory<typeof Input> = ({ ...args }) => (
  <Input {...args} />
);

export const ButtonTemplate = Template.bind({});
