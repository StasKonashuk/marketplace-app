import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import Head from 'next/head';
import { NextPage } from 'next';
import { Group, Stack, Title, Alert, Text } from '@mantine/core';
import { IconAlertCircle } from '@tabler/icons-react';
import { accountApi } from 'resources/account';
import { handleError } from 'utils';
import { RoutePath } from 'routes';
import { Button, Link, Input } from 'components';
import { EMAIL_REGEX } from 'app-constants';

const schema = z.object({
  email: z.string().regex(EMAIL_REGEX, 'Email format is incorrect.'),
  password: z.string().min(1, 'Please enter password'),
});

type SignInParams = z.infer<typeof schema> & { credentials?: string };

const SignIn: NextPage = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
  } = useForm<SignInParams>({ resolver: zodResolver(schema) });

  const { mutate: signIn, isLoading: isSignInLoading } = accountApi.useSignIn<SignInParams>();

  const onSubmit = (data: SignInParams) => signIn(data, {
    onError: (e) => handleError(e, setError),
  });

  return (
    <>
      <Head>
        <title>Sign in</title>
      </Head>
      <Stack w={408} gap={32}>
        <Stack gap={32}>
          <Title order={1}>Sign In</Title>
          <form onSubmit={handleSubmit(onSubmit)}>
            <Stack gap={32}>
              <Stack gap={20}>
                <Input
                  register={register}
                  name="email"
                  label="Email Address"
                  placeholder="Email address"
                  error={errors.email?.message}
                />
                <Input
                  register={register}
                  name="password"
                  label="Password"
                  placeholder="Enter password"
                  error={errors.password?.message}
                  type="password"
                />

                {errors!.credentials && (
                  <Alert icon={<IconAlertCircle size={16} />} color="red">
                    {errors.credentials.message}
                  </Alert>
                )}
              </Stack>
              <Button type="submit" fullWidth loading={isSignInLoading} disabled={isSignInLoading}>
                Sign in
              </Button>
            </Stack>
          </form>
        </Stack>
        <Stack gap={32}>
          <Group fz={16} justify="center" gap={12}>
            <Text c="#201F22">Don’t have an account?</Text>
            <Link type="router" href={RoutePath.SignUp} underline={false} inherit>
              Sign up
            </Link>
          </Group>
        </Stack>
      </Stack>
    </>
  );
};

export default SignIn;
