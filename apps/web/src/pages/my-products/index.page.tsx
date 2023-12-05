import { useState } from 'react';
import { z } from 'zod';
import Head from 'next/head';
import { NextPage } from 'next';
import {
  Group,
  Stack,
  Skeleton,
  Text,
  UnstyledButton,
  Title,
  Image,
  NumberInput,
} from '@mantine/core';
import { useForm } from 'react-hook-form';
import { Button, Input, ProductCard } from 'components';
import { PlusIcon } from 'public/icons';
import { zodResolver } from '@hookform/resolvers/zod';
import { productApi } from 'resources/product';
import { handleError } from 'utils';
import { userApi } from 'resources/user';
import { accountApi } from 'resources/account';

import classes from './index.module.css';

const schema = z.object({
  title: z.string().min(1, 'Please enter title'),
});

type ProductBody = z.infer<typeof schema>;

const MyProducts: NextPage = () => {
  const [createProductMode, setCreateProductMode] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [price, setPrice] = useState(0);

  const { data: account } = accountApi.useGet();

  const onChangePriceHandler = (value: string | number) => {
    setPrice(Number(value));
  };

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ProductBody>({
    resolver: zodResolver(schema),
    defaultValues: {
      title: '',
    },
  });

  if (!account) return null;

  const {
    mutate: createProduct,
    isLoading: isCreateProductLoading,
  } = productApi.useCreateProduct<FormData>();

  const {
    mutate: removeProduct,
    isLoading: isRemoveProductLoading,
  } = productApi.useRemoveProduct();

  const onSubmit = async (data: ProductBody) => {
    const body = new FormData();

    if (file) {
      body.append('file', file, file.name);
    }

    body.append('name', data.title);
    body.append('price', String(price));

    await createProduct(body, {
      onError: (err) => handleError(err),
      onSuccess: () => {
        setCreateProductMode(false);
        setFile(null);
        setPrice(0);
        reset();
      },
    });
  };

  const { data, isLoading: isProductsLoading } = userApi.useGetProducts(account._id, {});

  const removeProductHandler = (id: string) => {
    removeProduct({ id });
  };

  const myProduct = data?.items.map((p) => (
    <ProductCard
      key={p._id}
      imgHeight="174px"
      width="271px"
      product={p}
      removeLoading={isRemoveProductLoading}
      removeHandler={removeProductHandler}
    />
  ));

  const addNewProductHandler = () => {
    setCreateProductMode(true);
  };

  const goBackHandler = () => {
    setCreateProductMode(false);
    setFile(null);
    setPrice(0);
    reset();
  };

  return (
    <>
      <Head>
        <title>My Products</title>
      </Head>
      <Stack gap="20px">
        <Title size="20px" fw={600} c="#201F22">
          {createProductMode ? 'Create new product' : 'Your products'}
        </Title>
        {createProductMode ? (
          <Stack gap="20px" maw="694px">
            <Group gap="16px">
              <Image
                src={file ? URL.createObjectURL(file) : null}
                fallbackSrc="/images/img-placeholder.svg"
                miw="180px"
                mih="180px"
                w="180px"
                h="180px"
                fit="cover"
                radius="8px"
              />
              <Button accept="image/png,image/jpeg" onChange={setFile} buttonType="file" secondary>
                Upload Photo
              </Button>
            </Group>
            <form onSubmit={handleSubmit(onSubmit)}>
              <Stack gap="20px">
                <Input
                  label="Title of the product"
                  register={register}
                  name="title"
                  error={errors.title?.message}
                  placeholder="Enter title of the product..."
                />
                <NumberInput
                  label="Price"
                  allowDecimal
                  allowNegative={false}
                  hideControls
                  onChange={onChangePriceHandler}
                  value={price}
                  placeholder="Enter price of the product"
                  suffix="$"
                />
              </Stack>
              <Group mt="28px" justify="space-between">
                <Button secondary onClick={goBackHandler}>
                  Go Back
                </Button>
                <Button
                  disabled={isCreateProductLoading}
                  loading={isCreateProductLoading}
                  type="submit"
                >
                  Upload product
                </Button>
              </Group>
            </form>
          </Stack>
        ) : (
          <>
            {isProductsLoading && (
              <Group gap="20px">
                {[1, 2, 3, 4, 5].map((item) => (
                  <Skeleton
                    key={`sklton-${String(item)}`}
                    height="266px"
                    width="271px"
                    radius="12px"
                    mb="sm"
                  />
                ))}
              </Group>
            )}

            {!isProductsLoading && (
              <Group gap="20px" wrap="wrap" align="flex-start">
                <UnstyledButton className={classes.addProductButton} onClick={addNewProductHandler}>
                  <Stack className={classes.plusIcon}>
                    <PlusIcon />
                  </Stack>
                  <Text size="20px" fw={400} c="#2B77EB">
                    New product
                  </Text>
                </UnstyledButton>
                {myProduct}
              </Group>
            )}
          </>
        )}
      </Stack>
    </>
  );
};

export default MyProducts;
