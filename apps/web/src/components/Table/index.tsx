import { FC, ReactNode } from 'react';
import { Table as MantineTable, Text } from '@mantine/core';

export interface Column {
  title?: string;
  className?: string;
  minWidth?: string;
  padding?: string;
}

interface Row {
  _id: string;
  component: ReactNode;
}

interface TableProps {
  headerRowClass?: string;
  columns: Column[];
  rowsData: Row[];
}

const Table: FC<TableProps> = ({ columns, headerRowClass, rowsData }) => {
  const headerColumns = columns.map((c) => (
    <MantineTable.Th miw={c.minWidth} p={c.padding}>
      {c.title && (
        <Text size="16px" c="#767676" fw={400}>
          {c.title}
        </Text>
      )}
    </MantineTable.Th>
  ));

  const rows = rowsData.map((r) => <MantineTable.Tr key={r._id}>{r.component}</MantineTable.Tr>);

  return (
    <MantineTable>
      <MantineTable.Thead>
        <MantineTable.Tr className={headerRowClass}>{headerColumns}</MantineTable.Tr>
      </MantineTable.Thead>
      <MantineTable.Tbody>{rows}</MantineTable.Tbody>
    </MantineTable>
  );
};

export default Table;
