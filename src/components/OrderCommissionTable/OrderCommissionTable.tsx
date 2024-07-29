import { useState, useCallback } from 'react';
import { TextField, IndexTable, Card, IndexFilters, useSetIndexFiltersMode, useIndexResourceState, Text, DatePicker, ButtonGroup, Button } from '@shopify/polaris';
import type { IndexFiltersProps, TabProps } from '@shopify/polaris';
import { OrderCommissionType } from '../../types/orderCommion';
  
// props type
interface PropType {
    orders : OrderCommissionType [];
    orderFetching : boolean
    refetch : () => void
}

function OrderCommissionTable({ orders, orderFetching, refetch  } : PropType) {
  
    const tabs: TabProps[] = []
    const [selected, setSelected] = useState(0);
    const [queryValue, setQueryValue] = useState('');
    const [customerName, setCustomerName] = useState('');
    const [attributedStaffName, setAttributedStaffName] = useState('');
    const [{ start, end }, setSelectedDates] = useState({ start: new Date(), end: new Date() });

    const { mode, setMode } = useSetIndexFiltersMode();
    
    const onHandleCancel = () => {};

    const handleCustomerNameChange = useCallback((value: string) => setCustomerName(value), []);
    const handleAttributedStaffNameChange = useCallback((value: string) => setAttributedStaffName(value), []);
    const handleDateChange = useCallback((value: { start: Date, end: Date }) => setSelectedDates(value), []);
    const handleCustomerNameRemove = useCallback(() => setCustomerName(''), []);
    const handleFiltersQueryChange = useCallback((value: string) => setQueryValue(value),[]);
    const handleQueryValueRemove = useCallback(() => setQueryValue(''), []);

    const handleFiltersClearAll = useCallback(() => {
      handleQueryValueRemove();
    }, [
      handleQueryValueRemove,
    ]);

    // apply filters
    const filters = [
        {
          key: 'customerName',
          label: 'Customer Name',
          filter: (
            <TextField
              label="Customer Name"
              value={customerName}
              onChange={handleCustomerNameChange}
              autoComplete="off"
              labelHidden
            />
          ),
          shortcut: true,
        },
        {
          key: 'attributedStaffName',
          label: 'Attributed Staff',
          filter: (
            <TextField
              label="Attributed Staff"
              value={attributedStaffName}
              onChange={handleAttributedStaffNameChange}
              autoComplete="off"
              labelHidden
            />
          ),
          shortcut: true,
        },
        {
          key: 'dates',
          label: 'Order Date',
          filter: (
            <DatePicker
              month={start.getMonth()}
              year={start.getFullYear()}
              onChange={handleDateChange}
              onMonthChange={(month, year) => setSelectedDates({start: new Date(year, month, start.getDate()), end})}
              selected={start}
              allowRange
            />
          ),
        },
      ];
    ;
  
    // applier filter array
    const appliedFilters: IndexFiltersProps['appliedFilters'] = [];

    if (customerName) {
        appliedFilters.push({
          key: 'customerName',
          label: `Customer Name: ${customerName}`,
          onRemove: handleCustomerNameRemove,
        });
    }
  

    const resourceName = {
      singular: 'order',
      plural: 'orders',
    };
  
    // transform commission order with order key for shorting
    const transformOrders = (orders: OrderCommissionType[]): { [key: string]: unknown }[] => {
      return orders.map(order => ({ ...order }));
    };
  
    const transformedOrders = transformOrders(orders);

    // sorting
    const { selectedResources, allResourcesSelected, handleSelectionChange } = useIndexResourceState(transformedOrders);
  
    // table data rows
    const rowMarkup = orders.map(({id,  orderDate, customerName, attributedStaffName,total, commissionInDollars},index) => (
        <IndexTable.Row
          id={id}
          key={id}
          selected={selectedResources.includes(id)}
          position={index}
        >
          <IndexTable.Cell>
            <Text variant="bodyMd" fontWeight="bold" as="span">
              {id}
            </Text>
          </IndexTable.Cell>
          <IndexTable.Cell>{orderDate}</IndexTable.Cell>
          <IndexTable.Cell>{customerName}</IndexTable.Cell>
          <IndexTable.Cell>{attributedStaffName}</IndexTable.Cell>
          <IndexTable.Cell>
            <Text as="span" numeric>
              {total}
            </Text>
          </IndexTable.Cell>
          <IndexTable.Cell>
            <Text as="span" numeric>
             {commissionInDollars}
            </Text>
          </IndexTable.Cell>
        </IndexTable.Row>
      ),
    );

    // main content of component
    return (
      <Card>
        <ButtonGroup>
          <Button variant="primary" onClick={refetch}>Sync</Button>
        </ButtonGroup>
        <IndexFilters
          queryValue={queryValue}
          queryPlaceholder="Searching in all"
          onQueryChange={handleFiltersQueryChange}
          onQueryClear={() => setQueryValue('')}
          cancelAction={{
            onAction: onHandleCancel,
            disabled: false,
            loading: false,
          }}
          tabs={tabs}
          selected={selected}
          onSelect={setSelected}
          canCreateNewView
          filters={filters}
          appliedFilters={appliedFilters}
          onClearAll={handleFiltersClearAll}
          mode={mode}
          setMode={setMode}
        />
        <IndexTable
          loading={orderFetching}
          resourceName={resourceName}
          itemCount={orders.length}
          selectedItemsCount={
            allResourcesSelected ? 'All' : selectedResources.length
          }
          onSelectionChange={handleSelectionChange}
          headings={[
            {title: 'id'},
            {title: 'Order Data'},
            {title: 'Customer Name'},
            {title: 'Attributed staff'},
            {title: 'Total'},
            {title: 'Commission in Dollars '},
          ]}
        >
          {rowMarkup}
        </IndexTable>
      </Card>
    );
  }


export default OrderCommissionTable