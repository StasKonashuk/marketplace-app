import { FC, memo } from 'react';
import { Product } from 'types';
import { Group, Container, Image, Stack, Text, UnstyledButton, Badge } from '@mantine/core';
import Button from 'components/Button';
import { RemoveIcon } from 'public/icons';

import classes from './ProductCard.module.css';

interface ProductCardProps {
  removeHandler?: (id: string) => void;
  addToCartHandler?: (id: string) => void;
  product: Product;
  width?: string;
  imgHeight?: string;
  addedInCart?: boolean;
  removeLoading?: boolean;
}

const ProductCard: FC<ProductCardProps> = ({
  removeHandler,
  addToCartHandler,
  product,
  width = '320px',
  imgHeight = '218px',
  addedInCart,
  removeLoading = false,
}) => {
  // eslint-disable-next-line @typescript-eslint/naming-convention
  const { _id, price, imgUrl, name, onSale, isSold, currency } = product;
  return (
    <Container
      key={_id}
      pb="16px"
      px={0}
      pt={0}
      w={width}
      className={classes.productCard}
      bg="#fff"
      pos="relative"
      m={0}
    >
      <Image
        src={imgUrl}
        mb="16px"
        h={imgHeight}
        fallbackSrc="https://placehold.co/200x200?text=Placeholder"
      />
      {removeHandler && (
        <UnstyledButton
          disabled={removeLoading}
          className={classes.removeButton}
          onClick={() => removeHandler(_id)}
        >
          <RemoveIcon />
        </UnstyledButton>
      )}
      {(onSale || isSold) && (
        <Badge
          px="12px"
          color={onSale ? '#FEF4E6' : '#E8F7F0'}
          radius="8px"
          className={classes.badge}
        >
          {onSale ? (
            <Text lh={20} c="#F79009" size="14px" fw={500}>
              On sale
            </Text>
          ) : (
            <Text lh={20} c="#17B26A" size="14px" fw={500}>
              Sold
            </Text>
          )}
        </Badge>
      )}
      <Stack gap="22.51" px="16px">
        <Stack gap="13.51px">
          <Text c="#201F22" size="20px" fw={700}>
            {name}
          </Text>
          <Group justify="space-between">
            <Text size="14px" c="#A3A3A3" fw={500}>
              Price:
            </Text>
            <Text c="#201F22" size="20px" fw={700}>
              {currency}
              {price}
            </Text>
          </Group>
        </Stack>
        {addToCartHandler && (
          <Button disabled={addedInCart} onClick={() => addToCartHandler(_id)}>
            {addedInCart ? 'This product in your cart' : 'Add to Cart'}
          </Button>
        )}
      </Stack>
    </Container>
  );
};

export default memo(ProductCard);
