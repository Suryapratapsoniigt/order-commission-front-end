
import {  IndexTable, useIndexResourceState, Text, useBreakpoints } from '@shopify/polaris';
import { OrderCommissionType } from '../../types/orderCommion';


// props type
interface PropType {
    orders : OrderCommissionType[];
    orderFetching : boolean
}

function OrderCommissionTable({ orders, orderFetching  } : PropType) {

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

  return (
    <>
      <IndexTable
        loading={orderFetching}
        condensed={useBreakpoints().smDown}
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
    </>
  );
}

export default OrderCommissionTable
