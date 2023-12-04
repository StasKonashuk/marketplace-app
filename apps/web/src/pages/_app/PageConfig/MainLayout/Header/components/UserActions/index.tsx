import { memo, FC } from 'react';
import { Group, Indicator, UnstyledButton } from '@mantine/core';
import { accountApi } from 'resources/account';
import { CartIcon, LogoutIcon } from 'public/icons';
import { RoutePath } from 'routes';

interface UserActionsProps {
  cartLength?: number;
}

const UserActions: FC<UserActionsProps> = (props) => {
  const { cartLength } = props;

  const { data: account } = accountApi.useGet();
  const { mutate: signOut } = accountApi.useSignOut();

  if (!account) return null;

  return (
    <Group gap="32px">
      {cartLength ? (
        <Indicator color="#2B77EB" label={cartLength} offset={5}>
          <UnstyledButton component="a" href={RoutePath.MyCart}>
            <CartIcon />
          </UnstyledButton>
        </Indicator>
      ) : (
        <UnstyledButton component="a" href={RoutePath.MyCart}>
          <CartIcon />
        </UnstyledButton>
      )}
      <UnstyledButton onClick={() => signOut()}>
        <LogoutIcon />
      </UnstyledButton>
    </Group>
  );
};

export default memo(UserActions);
