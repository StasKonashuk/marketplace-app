import { Elements } from '@stripe/react-stripe-js';
import { FormEvent, useEffect, useState } from 'react';
import { Stripe, StripeElements, loadStripe } from '@stripe/stripe-js';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { Stack } from '@mantine/core';
import { NextPage } from 'next';
import config from 'config';
import { PaymentForm } from 'components';
import { RoutePath } from 'routes';

interface QueryParams {
  clientSecret: string;
}

const stripePromise = loadStripe(config.STRIPE_PUBLISHED_KEY);

const MyProducts: NextPage = () => {
  const router = useRouter();

  const queryObj = router.query as unknown as QueryParams;

  const [clientSecret, setClientSecret] = useState('');
  const [message, setMessage] = useState<string | undefined>();
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    if (queryObj.clientSecret) {
      setClientSecret(queryObj.clientSecret);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const options = {
    clientSecret,
  };

  const submitHandler = async (
    e: FormEvent,
    stripe: Stripe | null,
    elements: StripeElements | null,
  ) => {
    e.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    setIsProcessing(true);

    const { error } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url: `${window.location.origin}/${RoutePath.PaymentSuccess}`,
      },
    });

    if (error.type === 'card_error' || error.type === 'validation_error') {
      setMessage(error.message);
      router.push(RoutePath.PaymentFailed);
    } else {
      setMessage('An unexpected error occured.');
    }

    setIsProcessing(false);
  };

  return (
    <>
      <Head>
        <title>My Payment</title>
      </Head>
      <Stack>
        {clientSecret && (
          <Elements stripe={stripePromise} options={options}>
            <PaymentForm
              submitHandler={submitHandler}
              message={message}
              isProcessing={isProcessing}
            />
          </Elements>
        )}
      </Stack>
    </>
  );
};

export default MyProducts;
