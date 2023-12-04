import { FC, ReactElement } from 'react';
import { SimpleGrid, Image, Center } from '@mantine/core';

interface UnauthorizedLayoutProps {
  children: ReactElement;
}

const UnauthorizedLayout: FC<UnauthorizedLayoutProps> = ({ children }) => (
  <SimpleGrid
    cols={{ base: 1, sm: 2 }}
    spacing="0px"
  >
    <Center w="100%" h="100vh" component="main">
      {children}
    </Center>
    <Image
      visibleFrom="sm"
      alt="App Info"
      src="/images/shopy.svg"
      h="100vh"
      w="auto"
      fit="contain"
      p="32px"
    />
  </SimpleGrid>
);

export default UnauthorizedLayout;
