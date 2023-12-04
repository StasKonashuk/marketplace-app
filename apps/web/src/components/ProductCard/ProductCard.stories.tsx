import { ComponentStory, ComponentMeta } from '@storybook/react';

import ProductCard from './index';

export default {
  title: 'Components/ProductCard',
  component: ProductCard,
  argTypes: {},
} as ComponentMeta<typeof ProductCard>;

const Template: ComponentStory<typeof ProductCard> = ({ ...args }) => (
  <ProductCard {...args} />
);

export const Icon = Template.bind({});
