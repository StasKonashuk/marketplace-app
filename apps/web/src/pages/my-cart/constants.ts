export const getColumns = (historyMode: boolean) => [
  {
    title: 'Item',
    textAlign: 'left',
    minWidth: '519px',
    padding: '12px 0px',
  },
  {
    title: 'Unit Price',
    textAlign: 'right',
    minWidth: '144px',
    padding: '12px 0px',
  },
  {
    title: 'Quantity',
    textAlign: 'right',
    minWidth: '144px',
    padding: '12px 0px',
  },
  {
    title: historyMode ? 'Date' : '',
    textAlign: 'right',
    minWidth: '144px',
    padding: '12px 0px',
  },
];
