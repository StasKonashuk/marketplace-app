import { z } from 'zod';
import { useEffect, useState } from 'react';
import cx from 'clsx';
import Head from 'next/head';
import { NextPage } from 'next';
import { useRouter } from 'next/router';
import {
  Group,
  Stack,
  Skeleton,
  Text,
  UnstyledButton,
  Flex,
  Table,
  Image,
  Divider,
} from '@mantine/core';
import dayjs from 'dayjs';
import { Button, Table as MyTable } from 'components';
import { CloseIcon, GrayPlusIcon, MinusIcon } from 'public/icons';
import { userProductApi } from 'resources/user-product';
import { paymentsApi } from 'resources/payments';
import { RoutePath } from 'routes';
import { Column } from 'components/Table';
import { getColumns } from './constants';

import classes from './index.module.css';

interface QueryParams {
  archived?: boolean;
}

const schema = z.object({
  quantity: z.number().min(1),
});

type UserProductBody = z.infer<typeof schema>;

const MyCart: NextPage = () => {
  const router = useRouter();

  const queryObj = router.query as QueryParams;

  const defaultHistoryModeValue = Boolean(queryObj.archived) || false;

  const [historyMode, setHistoryMode] = useState(defaultHistoryModeValue);
  const [totalPrice, setTotalPrice] = useState(0);

  const { data: userProductsData, isLoading: isUserProductsLoading } = userProductApi.useList<{
    archived: boolean;
  }>({ archived: historyMode });

  const {
    mutate: updateUserProduct,
    isLoading: isUpdateUserProductLoading,
  } = userProductApi.useUpdateUserProduct<UserProductBody>();

  const {
    mutate: removeUserProduct,
    isLoading: isRemoveUserProductLoading,
  } = userProductApi.useRemoveUserProduct();

  const {
    mutate: createPayment,
    isLoading: isCreatePaymentLoading,
  } = paymentsApi.useCreatePayment<{ amount: number }>();

  const updateUserProductHandler = (id: string, quantity: number) => {
    updateUserProduct({ id, data: { quantity } });
  };

  const removeUserProductHandler = (id: string) => {
    removeUserProduct({ id });
  };

  const onMyCartButtonClickHandler = () => {
    setHistoryMode(false);
  };

  const onMyCartHistoryButtonClickHandler = () => {
    setHistoryMode(true);
  };

  useEffect(() => {
    const queryParams = new URLSearchParams();

    if (historyMode) {
      queryParams.set('archived', String(historyMode));
    } else {
      queryParams.delete('archived');
    }

    const queryString = queryParams.toString();

    router.replace(
      {
        pathname: router.pathname,
        query: queryString,
      },
      undefined,
      { scroll: false, shallow: true },
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [historyMode]);

  useEffect(() => {
    if (userProductsData?.length) {
      const sum = userProductsData.reduce(
        (acc, userProduct) => acc + userProduct.productData.price * userProduct.quantity,
        0,
      );

      setTotalPrice(sum);
    }
  }, [userProductsData]);

  const createPaymentHandler = async () => {
    createPayment(
      { amount: totalPrice },
      {
        onSuccess: (data) => {
          router.push(
            {
              pathname: RoutePath.Payment,
              query: { clientSecret: data.clientSecret },
            },
            RoutePath.Payment,
          );
        },
      },
    );
  };

  const columns: Column[] = getColumns(historyMode);

  const rows = userProductsData?.map((userProduct, index) => ({
    _id: userProduct._id,
    component: (
      <>
        <Table.Td pb="16px" pt={index !== 0 ? '16px' : '0px'} px={0}>
          <Group gap="25px">
            <Image
              height="80px"
              miw="80px"
              radius="8px"
              src={userProduct.productData.imgUrl}
              fallbackSrc="https://placehold.co/200x200?text=Placeholder"
            />
            <Text size="16px" c="#201F22" fw={700}>
              {userProduct.productData.name}
            </Text>
          </Group>
        </Table.Td>
        <Table.Td pb="16px" pt={index !== 0 ? '16px' : '0px'} px={0}>
          <Text size="16px" c="#201F22" fw={400} ta="right">
            $
            {userProduct.productData.price}
          </Text>
        </Table.Td>
        <Table.Td pb="16px" pt={index !== 0 ? '16px' : '0px'} px={0} align="right">
          <Group align="center" justify="flex-end">
            {!historyMode && (
              <UnstyledButton
                className={classes.quantityBtn}
                disabled={isUpdateUserProductLoading || userProduct.quantity <= 1}
                onClick={() => updateUserProductHandler(userProduct._id, userProduct.quantity - 1)}
              >
                <MinusIcon />
              </UnstyledButton>
            )}
            <Text c="#201F22" size="16px" fw={400}>
              {userProduct.quantity}
            </Text>
            {!historyMode && (
              <UnstyledButton
                className={classes.quantityBtn}
                disabled={isUpdateUserProductLoading}
                onClick={() => updateUserProductHandler(userProduct._id, userProduct.quantity + 1)}
              >
                <GrayPlusIcon />
              </UnstyledButton>
            )}
          </Group>
        </Table.Td>
        {historyMode ? (
          <Table.Td pb="16px" pt={index !== 0 ? '16px' : '0px'} px={0} align="right">
            <Text size="16px" c="#201F22" fw={400} ta="right">
              {dayjs(userProduct.deletedOn).format('DD.MM.YY')}
            </Text>
          </Table.Td>
        ) : (
          <Table.Td pb="16px" pt={index !== 0 ? '16px' : '0px'} px={0} align="right">
            <UnstyledButton
              onClick={() => removeUserProductHandler(userProduct._id)}
              className={classes.removeBtn}
              disabled={isRemoveUserProductLoading}
            >
              <CloseIcon />
              Remove
            </UnstyledButton>
          </Table.Td>
        )}
      </>
    ),
  }));

  return (
    <>
      <Head>
        <title>My Cart</title>
      </Head>
      <Stack>
        {userProductsData?.length && rows ? (
          <Flex gap="78px" wrap="nowrap" direction="row">
            <Stack>
              <Group gap="32px">
                <UnstyledButton
                  onClick={onMyCartButtonClickHandler}
                  className={cx(classes.cartLink, {
                    [classes.active]: !historyMode,
                  })}
                >
                  My cart
                </UnstyledButton>
                <UnstyledButton
                  component="a"
                  onClick={onMyCartHistoryButtonClickHandler}
                  className={cx(classes.cartLink, {
                    [classes.active]: historyMode,
                  })}
                >
                  History
                </UnstyledButton>
              </Group>

              <MyTable columns={columns} rowsData={rows} headerRowClass={classes.tableHeaderRow} />
            </Stack>
            {!historyMode && (
              <Stack>
                <Skeleton height="220px" radius="12px" visible={isUserProductsLoading} w="315px">
                  <Stack className={classes.summaryWrapper}>
                    <Text size="20px" fw={700} c="#201F22">
                      Summary
                    </Text>
                    <Divider size="xs" bg="#CFCFCF" w="100%" />
                    <Group justify="space-between" w="100%">
                      <Text size="16px" fw={400} c="#767676">
                        Total price
                      </Text>
                      <Text size="16px" fw={700} c="#201F22">
                        $
                        {totalPrice}
                      </Text>
                    </Group>
                    <Button fullWidth onClick={createPaymentHandler}>
                      Proceed to checkout
                    </Button>
                  </Stack>
                </Skeleton>
              </Stack>
            )}
          </Flex>
        ) : (
          !isUserProductsLoading && (
            <Stack gap="40px">
              <Group gap="32px">
                <UnstyledButton
                  onClick={onMyCartButtonClickHandler}
                  className={cx(classes.cartLink, {
                    [classes.active]: !historyMode,
                  })}
                >
                  My cart
                </UnstyledButton>
                <UnstyledButton
                  component="a"
                  onClick={onMyCartHistoryButtonClickHandler}
                  className={cx(classes.cartLink, {
                    [classes.active]: historyMode,
                  })}
                >
                  History
                </UnstyledButton>
              </Group>
              <Flex w="100%" h="100%" align="center" justify="center">
                <Stack gap="20px" w="301px">
                  <Image src="images/balloon.png" />
                  <Text size="20px" fw={700} c="#201F22" ta="center">
                    Oops, there&apos;s nothing here yet!
                  </Text>
                  <Text size="14px" c="#767676" fw={400} ta="center">
                    You haven&apos;t made any purchases yet. Go to the marketplace and make
                    purchases.
                  </Text>
                  <Button
                    buttonType="link"
                    href={RoutePath.Home}
                    disabled={isCreatePaymentLoading}
                    loading={isCreatePaymentLoading}
                  >
                    Go to Marketplace
                  </Button>
                </Stack>
              </Flex>
            </Stack>
          )
        )}
      </Stack>
    </>
  );
};

export default MyCart;
