export const getColumns = (historyMode: boolean) => [
  {
    title: 'Item',
    minWidth: '519px',
    padding: '12px 0px',
  },
  {
    title: 'Unit Price',
    minWidth: '144px',
    padding: '12px 0px',
  },
  {
    title: 'Quantity',
    minWidth: '144px',
    padding: '12px 0px',
  },
  {
    title: historyMode ? 'Date' : '',
    minWidth: '144px',
    padding: '12px 0px',
  },
];
