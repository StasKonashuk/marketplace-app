import { memo, FC } from 'react';
import { Tabs } from '@mantine/core';
import { useRouter } from 'next/router';
import { accountApi } from 'resources/account';
import { RoutePath } from 'routes';

const UserActions: FC = () => {
  const { data: account } = accountApi.useGet();

  const router = useRouter();

  if (!account) return null;

  return (
    <Tabs value={router.route} onChange={(value) => router.push(`${value}`)}>
      <Tabs.List>
        <Tabs.Tab value={RoutePath.Home}>Marketplace</Tabs.Tab>
        <Tabs.Tab value={RoutePath.MyProducts}>Your products</Tabs.Tab>
      </Tabs.List>
    </Tabs>
  );
};

export default memo(UserActions);
