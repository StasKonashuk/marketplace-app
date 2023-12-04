import { FC, FormEvent, memo } from 'react';
import { PaymentElement, useElements, useStripe } from '@stripe/react-stripe-js';
import { Flex, Skeleton, Text } from '@mantine/core';
import Button from 'components/Button';
import { Stripe, StripeElements } from '@stripe/stripe-js';

import classes from './PaymentForm.module.css';

interface PaymentFormProps {
  submitHandler: (e: FormEvent, stripe: Stripe | null, elements: StripeElements | null) => void;
  message?: string;
  isProcessing: boolean;
}

const PaymentForm: FC<PaymentFormProps> = ({
  submitHandler,
  message,
  isProcessing,
}: PaymentFormProps) => {
  const stripe = useStripe();
  const elements = useElements();

  return (
    <Flex h="100%" align="center" justify="center" mt="104px">
      <form
        id="payment-form"
        onSubmit={(e) => submitHandler(e, stripe, elements)}
        className={classes.form}
      >
        <Skeleton visible={!elements || !stripe} width="100%" mih="220px">
          <PaymentElement id="payment-element" />
        </Skeleton>
        <Button
          type="submit"
          disabled={isProcessing || !stripe || !elements}
          id="submit"
          loading={isProcessing}
        >
          Pay now
        </Button>
        {message && (
          <Text c="B00020" size="16px" fw={700}>
            {message}
          </Text>
        )}
      </form>
    </Flex>
  );
};

export default memo(PaymentForm);
