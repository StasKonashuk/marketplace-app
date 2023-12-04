import Head from 'next/head';
import { NextPage } from 'next';
import { useEffect } from 'react';
import { Stack, Text, Flex, Image } from '@mantine/core';
import { Button } from 'components';
import { RoutePath } from 'routes';
import { useBuyUserProducts } from 'resources/user-product/user-product.api';

import classes from './index.module.css';

const PaymentSuccess: NextPage = () => {
  const { mutate: buyProducts } = useBuyUserProducts();

  useEffect(() => {
    buyProducts();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      <Head>
        <title>Payment success</title>
      </Head>
      <Flex w="100%" h="100%" pt="84px" align="center" justify="center">
        <Stack gap="32px" className={classes.successWindow} p="20px" align="center">
          <Image w="56px" h="56px" src="images/party-popper.png" />
          <Stack gap="16px">
            <Text size="24px" fw={600} c="#201F22" ta="center">
              Payment Successfull
            </Text>
            <Text w="329px" size="16px" c="#767676" fw={400} ta="center" lh="24px">
              Hooray, you have completed your payment!
            </Text>
          </Stack>
          <Button buttonType="link" href={RoutePath.MyCart}>
            Back to cart
          </Button>
        </Stack>
      </Flex>
    </>
  );
};

export default PaymentSuccess;
