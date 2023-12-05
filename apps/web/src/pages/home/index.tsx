import { useEffect, useLayoutEffect, useMemo, useState } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { NextPage } from 'next';
import {
  Group,
  Stack,
  Skeleton,
  Text,
  Container,
  UnstyledButton,
  Flex,
  NumberInput,
  Chip,
  Center,
  Pagination,
} from '@mantine/core';
import { useDebouncedValue, useInputState } from '@mantine/hooks';
import cx from 'clsx';
import { productApi } from 'resources/product';
import { userProductApi } from 'resources/user-product';
import { Input, ProductCard } from 'components';
import { ArrowIcon, CloseIcon, OrderIcon, RemoveTagIcon } from 'public/icons';
import { OrderByValues, PER_PAGE } from './constants';

import classes from './index.module.css';

interface QueryParams {
  orderBy?: OrderByValues;
  filter?: ProductsFilter;
  page?: number;
  search?: string;
}

interface ProductsFilter {
  price: {
    from: number;
    to: number;
  };
}

const Home: NextPage = () => {
  const router = useRouter();

  const queryObj = router.query as QueryParams;

  const [search, setSearch] = useInputState('');
  const [filterValue, setFilterValue] = useState<ProductsFilter>({ price: { from: 0, to: 0 } });
  const [orderBy, setOrderBy] = useState<OrderByValues>(OrderByValues.DESC);
  const [page, setPage] = useState(1);
  const [windowSize, setWindowSize] = useState({
    width: typeof window !== 'undefined' ? window.innerWidth : 0,
    height: typeof window !== 'undefined' ? window.innerHeight : 0,
  });
  const [perPage, setPerPage] = useState(PER_PAGE);

  useEffect(() => {
    if (queryObj.search) {
      setSearch(queryObj.search);
    }

    if (queryObj.filter) {
      setFilterValue(JSON.parse(queryObj.filter as unknown as string));
    }

    if (queryObj.page) {
      setPage(Number(queryObj.page));
    }

    if (queryObj.orderBy) {
      setOrderBy(queryObj.orderBy);
    }

    const handleResize = () => {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (windowSize.width > 2100) {
      setPerPage(10);
    } else if (windowSize.width > 1440) {
      setPerPage(8);
    } else {
      setPerPage(PER_PAGE);
    }
  }, [windowSize]);

  const [debouncedSearch] = useDebouncedValue(search, 500);

  useLayoutEffect(() => {
    setPage(1);
  }, [debouncedSearch]);

  useEffect(() => {
    const queryParams = new URLSearchParams();

    queryParams.set('page', String(page));

    queryParams.set('orderBy', orderBy);

    if (filterValue.price.from !== 0 && filterValue.price.to !== 0) {
      queryParams.set('filter', JSON.stringify(filterValue));
    } else {
      queryParams.delete('filter');
    }

    if (debouncedSearch) {
      queryParams.set('search', debouncedSearch);
    } else {
      queryParams.delete('search');
    }

    const queryString = queryParams.toString();

    router.replace(
      {
        pathname: router.pathname,
        query: queryString,
      },
      undefined,
      { scroll: false, shallow: true },
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, orderBy, filterValue, debouncedSearch]);

  const params = useMemo(
    () => ({
      page,
      perPage,
      orderBy,
      filter: filterValue,
      searchValue: debouncedSearch,
    }),
    [page, orderBy, filterValue, debouncedSearch, perPage],
  );

  const { data, isLoading: isListLoading } = productApi.useList(params);
  const { data: userProductsData } = userProductApi.useList({});

  const fromPriceComponent = (
    <Text c="#A3A3A3" fw={500} size="14px" pl="12px" mr="4px">
      From:
    </Text>
  );

  const toPriceComponent = (
    <Text c="#A3A3A3" fw={500} size="14px" mr="4px" pl="12px">
      To:
    </Text>
  );

  const onFromPriceChangeHandler = (value: string | number) => {
    setFilterValue((prev) => ({
      ...prev,
      price: {
        ...prev.price,
        from: Number(value),
      },
    }));
  };

  const onToPriceChangeHandler = (value: string | number) => {
    setFilterValue((prev) => ({
      ...prev,
      price: {
        ...prev.price,
        to: Number(value),
      },
    }));
  };

  const resetPriceFilter = () => {
    setFilterValue((prev) => ({
      ...prev,
      price: {
        from: 0,
        to: 0,
      },
    }));
  };

  const showPriceFilter = useMemo(
    () => filterValue.price.from !== 0 && filterValue.price.to !== 0,
    [filterValue.price],
  );

  const onChangeOrderHanlder = () => {
    setOrderBy((prevState) => {
      if (prevState === OrderByValues.ASC) return OrderByValues.DESC;
      return OrderByValues.ASC;
    });
  };

  const product = data?.items.map((p) => (
    <ProductCard
      width="318px"
      key={p._id}
      product={p}
      isAddable
      addedInCart={userProductsData?.some((userProduct) => userProduct.productData._id === p._id)}
    />
  ));

  const onChangePageHandler = (value: number) => {
    setPage(value);
  };

  const totalPagesCount = useMemo(
    () => (data?.count ? Math.ceil(data.count / PER_PAGE) : 0),
    [data],
  );

  return (
    <>
      <Head>
        <title>Home</title>
      </Head>
      <Flex gap="32px" wrap="nowrap" direction={windowSize.width < 500 ? 'column' : 'row'}>
        <Skeleton height="163px" radius="sm" visible={isListLoading} w="315px">
          <Stack p={20} gap={32} bg="#fff" w="315px" h="163px" className={classes.filterWrapper}>
            <Group justify="space-between">
              <Text c="#201F22" size="20px" fw={700}>
                Filters
              </Text>
              <UnstyledButton className={classes.resetFilterButton} onClick={resetPriceFilter}>
                <Text c="#A3A3A3" size="14px" fw={500}>
                  Reset All
                </Text>
                <CloseIcon />
              </UnstyledButton>
            </Group>
            <Stack gap={12}>
              <Text size="16px" fw={700} c="#201F22">
                Price
              </Text>
              <Group gap={12} wrap="nowrap">
                <NumberInput
                  allowDecimal={false}
                  allowNegative={false}
                  hideControls
                  onChange={onFromPriceChangeHandler}
                  leftSectionWidth="50px"
                  leftSection={fromPriceComponent}
                  value={filterValue.price.from}
                  w="132px"
                  suffix="$"
                />
                <NumberInput
                  allowDecimal={false}
                  allowNegative={false}
                  hideControls
                  w="132px"
                  leftSectionWidth="36px"
                  leftSection={toPriceComponent}
                  value={filterValue.price.to}
                  onChange={onToPriceChangeHandler}
                  suffix="$"
                />
              </Group>
            </Stack>
          </Stack>
        </Skeleton>
        <Stack w="100%" gap="20px">
          <Skeleton
            className={classes.inputSkeleton}
            height="42px"
            radius="sm"
            visible={isListLoading}
            width="auto"
          >
            <Input
              w="100%"
              size="48px"
              value={search}
              onChange={setSearch}
              placeholder="Type to search..."
              type="search"
            />
          </Skeleton>
          <Skeleton
            className={classes.inputSkeleton}
            mih="21px"
            radius="sm"
            visible={isListLoading}
            width="auto"
          >
            <Stack gap="12px">
              <Group justify="space-between">
                <Text size="16px" fw={700}>
                  {data?.count}
                  {' '}
                  results
                </Text>
                <UnstyledButton onClick={onChangeOrderHanlder} className={cx(classes.orderButton)}>
                  <Group gap="6px">
                    <OrderIcon />
                    <Text size="14px" fw={500}>
                      {orderBy === OrderByValues.ASC ? 'Sort by oldest' : 'Sort by newest'}
                    </Text>
                    <Center
                      className={cx(classes.arrowIcon, {
                        [classes.rotate]: orderBy === OrderByValues.ASC,
                      })}
                    >
                      <ArrowIcon />
                    </Center>
                  </Group>
                </UnstyledButton>
              </Group>
              {showPriceFilter && (
                <Group>
                  <Chip checked={false} color="#fff" variant="outlined">
                    <Text c="#201F22" size="14px" fw={500}>
                      $
                      {filterValue.price.from}
                      -$
                      {filterValue.price.to}
                    </Text>
                    <UnstyledButton onClick={resetPriceFilter} className={classes.chipRemoveButton}>
                      <RemoveTagIcon />
                    </UnstyledButton>
                  </Chip>
                </Group>
              )}
            </Stack>
          </Skeleton>
          {isListLoading && (
            <Group gap="20px">
              {[1, 2, 3, 4, 5].map((item) => (
                <Skeleton
                  key={`sklton-${String(item)}`}
                  height="375px"
                  width="320px"
                  radius="12px"
                  mb="sm"
                />
              ))}
            </Group>
          )}
          {data?.items.length ? (
            <Group gap="20px" w="100%" mih="768px" align="flex-start">
              {product}
            </Group>
          ) : (
            <Container p={75}>
              <Text size="xl" c="gray">
                No results found, try to adjust your search.
              </Text>
            </Container>
          )}
        </Stack>
      </Flex>
      {data?.items.length && (
        <Flex justify="center">
          <Pagination
            mt="31px"
            value={page}
            onChange={onChangePageHandler}
            total={totalPagesCount}
          />
        </Flex>
      )}
    </>
  );
};

export default Home;
