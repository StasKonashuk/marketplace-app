import { FC, memo } from 'react';
import { Product } from 'types';
import { Group, Container, Image, Stack, Text, UnstyledButton, Badge } from '@mantine/core';
import Button from 'components/Button';
import { RemoveIcon } from 'public/icons';
import { userProductApi } from 'resources/user-product';
import { productApi } from 'resources/product';

import classes from './ProductCard.module.css';

interface ProductCardProps {
  isAddable?: boolean;
  isRemoveble?: boolean;
  product: Product;
  width?: string;
  imgHeight?: string;
  addedInCart?: boolean;
}

interface UserProductBody {
  productId: string;
  quantity: number;
}

const ProductCard: FC<ProductCardProps> = ({
  isAddable,
  product,
  width = '320px',
  imgHeight = '218px',
  addedInCart,
  isRemoveble,
}) => {
  // eslint-disable-next-line @typescript-eslint/naming-convention
  const { _id, price, imgUrl, name, onSale, isSold, currency } = product;

  const {
    mutate: addProductToCart,
    isLoading: addProductLoading,
  } = userProductApi.useAddUserProduct<UserProductBody>();

  const addProductHandler = (id: string) => {
    addProductToCart({
      productId: id,
      quantity: 1,
    });
  };

  const {
    mutate: removeProduct,
    isLoading: isRemoveProductLoading,
  } = productApi.useRemoveProduct();

  const removeProductHandler = (id: string) => {
    removeProduct({ id });
  };

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
      {isRemoveble && (
        <UnstyledButton
          disabled={isRemoveProductLoading}
          className={classes.removeButton}
          onClick={() => removeProductHandler(_id)}
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
        {isAddable && (
          <Button
            loading={addProductLoading}
            disabled={addedInCart || addProductLoading}
            onClick={() => addProductHandler(_id)}
          >
            {addedInCart ? 'This product in your cart' : 'Add to Cart'}
          </Button>
        )}
      </Stack>
    </Container>
  );
};

export default memo(ProductCard);
