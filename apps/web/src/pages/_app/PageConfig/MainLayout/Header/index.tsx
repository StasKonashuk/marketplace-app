import { memo, FC } from 'react';
import { AppShellHeader as LayoutHeader, Container } from '@mantine/core';
import { accountApi } from 'resources/account';
import { userProductApi } from 'resources/user-product';
import { Link } from 'components';
import { RoutePath } from 'routes';
import { LogoImage } from 'public/images';
import ShadowLoginBanner from './components/ShadowLoginBanner';
import UserActions from './components/UserActions';
import RouteTabs from './components/RouteTabs';

import classes from './index.module.css';

const Header: FC = () => {
  const { data: account } = accountApi.useGet();

  if (!account) return null;

  const { data: userProductsData } = userProductApi.useList({});

  return (
    <LayoutHeader withBorder={false}>
      {account.isShadow && <ShadowLoginBanner email={account.email} />}
      <Container className={classes.header} mih={104} px={48} py={32} display="flex" fluid>
        <Link type="router" href={RoutePath.Home}>
          <LogoImage />
        </Link>
        <RouteTabs />
        <UserActions cartLength={userProductsData?.length} />
      </Container>
    </LayoutHeader>
  );
};

export default memo(Header);
