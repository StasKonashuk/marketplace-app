import { z } from 'zod';
import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import Head from 'next/head';
import { NextPage } from 'next';
import { Stack, Group, Title, Text, SimpleGrid } from '@mantine/core';
import { accountApi } from 'resources/account';
import { Input, Link, Button } from 'components';
import { handleError } from 'utils';
import { RoutePath } from 'routes';
import { EMAIL_REGEX, PASSWORD_REGEX } from 'app-constants';
import { CheckIcon } from 'public/icons';

const schema = z.object({
  email: z.string().regex(EMAIL_REGEX, 'Email format is incorrect.'),
  password: z
    .string()
    .regex(
      PASSWORD_REGEX,
      'The password must contain 8 or more characters with at least one lover case letter (a-z), one capital letter (A-Z) and one number (0-9).',
    ),
});

type SignUpParams = z.infer<typeof schema>;

const passwordRules = [
  {
    title: 'Must be at least 8 characters',
    done: false,
  },
  {
    title: 'Must contain at least 1 number',
    done: false,
  },
  {
    title: 'Must contain lover case and capital letters',
    done: false,
  },
];

const SignUp: NextPage = () => {
  const [registered, setRegistered] = useState(false);

  const [passwordRulesData, setPasswordRulesData] = useState(passwordRules);

  const {
    register,
    handleSubmit,
    setError,
    watch,
    formState: { errors },
  } = useForm<SignUpParams>({
    resolver: zodResolver(schema),
  });

  const passwordValue = watch('password', '');

  useEffect(() => {
    const updatedPasswordRulesData = [...passwordRules];

    updatedPasswordRulesData[0].done = passwordValue.length >= 8;
    updatedPasswordRulesData[1].done = /\d/.test(passwordValue);
    updatedPasswordRulesData[2].done = /[a-zA-Z]/.test(passwordValue);

    setPasswordRulesData(updatedPasswordRulesData);
  }, [passwordValue]);

  const { mutate: signUp, isLoading: isSignUpLoading } = accountApi.useSignUp<SignUpParams>();

  const onSubmit = (data: SignUpParams) => signUp(data, {
    onSuccess: (response: any) => {
      if (response.signupToken) setRegistered(true);
    },
    onError: (e) => handleError(e, setError),
  });

  const registrationRules = (
    <SimpleGrid cols={1} spacing="xs" p={4}>
      {passwordRulesData.map((ruleData) => (
        <Group gap={12} key={ruleData.title}>
          <CheckIcon />
          <Text c="#A3A3A3">{ruleData.title}</Text>
        </Group>
      ))}
    </SimpleGrid>
  );

  if (registered) {
    return (
      <>
        <Head>
          <title>Sign up</title>
        </Head>
        <Stack w={450}>
          <Title order={2}>Thanks!</Title>
          <Text size="md" c="gray.6">
            You have been registered successfully, follow the links below to sign in
          </Text>
          <Link size="sm" href={RoutePath.SignIn}>
            Sign In
          </Link>
        </Stack>
      </>
    );
  }

  return (
    <>
      <Head>
        <title>Sign up</title>
      </Head>
      <Stack w={408} gap={32}>
        <Stack gap={32}>
          <Title order={1}>Sign Up</Title>
          <form onSubmit={handleSubmit(onSubmit)}>
            <Stack gap={32}>
              <Stack gap={20}>
                <Input
                  register={register}
                  name="email"
                  label="Email Address"
                  placeholder="Email Address"
                  error={errors.email?.message}
                />
                <Input
                  register={register}
                  name="password"
                  label="Password"
                  placeholder="Enter password"
                  type="password"
                  error={errors.password?.message}
                />
                {registrationRules}
              </Stack>
              <Button type="submit" disabled={isSignUpLoading} loading={isSignUpLoading} fullWidth>
                Create Account
              </Button>
            </Stack>
          </form>
        </Stack>
        <Stack gap={32}>
          <Group fz={16} justify="center" gap={12}>
            Have an account?
            <Link type="router" href={RoutePath.SignIn} inherit underline={false}>
              Sign In
            </Link>
          </Group>
        </Stack>
      </Stack>
    </>
  );
};

export default SignUp;
