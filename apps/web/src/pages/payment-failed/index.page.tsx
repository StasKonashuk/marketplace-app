import Head from 'next/head';
import { NextPage } from 'next';
import { Stack, Text, Flex, Image } from '@mantine/core';
import { Button } from 'components';
import { RoutePath } from 'routes';

import classes from './index.module.css';

const PaymentFailed: NextPage = () => (
  <>
    <Head>
      <title>Payment failed</title>
    </Head>
    <Flex w="100%" h="100%" pt="84px" align="center" justify="center">
      <Stack gap="32px" className={classes.failedWindow} p="20px" align="center">
        <Image w="56px" h="56px" src="images/cross-mark.png" />
        <Stack gap="16px">
          <Text size="24px" fw={600} c="#201F22" ta="center">
            Payment Failed
          </Text>
          <Text w="329px" size="16px" c="#767676" fw={400} ta="center" lh="24px">
            Sorry, your payment failed.
            <br />
            Would you like to try again?
          </Text>
        </Stack>
        <Button buttonType="link" href={RoutePath.MyCart}>
          Back to cart
        </Button>
      </Stack>
    </Flex>
  </>
);

export default PaymentFailed;
