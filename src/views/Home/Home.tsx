import {  useEffect, useMemo, useState } from "react"
import { useQuery } from "@tanstack/react-query"
import OrderCommissionTable from "../../components/OrderCommissionTable/OrderCommissionTable"
import { getOrderCommission } from "../../api/requests"
import style from './Home.module.css'
import { Button, ButtonGroup, Card } from "@shopify/polaris"
import OrderCommissionFitler from "../../components/OrderCommissionFilter/OrderCommissionFitler"

const Home = () => {

  const [customerList, SetCustomerList] = useState<{label : string, value : string}[]>([])
  const [selectedCustomers, setSelectedCustomers] = useState<string[] | undefined>();

  const [attributedStaffNameList, setAttributedStaffNameList] = useState<{label : string, value : string}[]>([])
  const [selectedAttributedStaffName, setSelectedAttributedStaffName] = useState<string[] | undefined>()

  const [{month, year}, setDate] = useState({ month: new Date().getMonth(), year: new Date().getFullYear()  });

  const [selectedDates, setSelectedDates] = useState({
    start: new Date(new Date().setDate(new Date().getDate() - 30)), // Default to 30 days ago
    end: new Date(),
  });

  // FETCH ORDER-COMMISSIONS
  const fetchOrderCommissionQuery = useQuery({ 
    queryKey : ['order-commission'],
    queryFn : () => getOrderCommission(),
  })


  useEffect(() => {
    if(fetchOrderCommissionQuery.data){      
      SetCustomerList(() => {
        return fetchOrderCommissionQuery.data.data.map((order) =>({ label : order.customerName, value : order.customerName }))
      })

      setAttributedStaffNameList(() => {
        return fetchOrderCommissionQuery.data.data.map((order) =>({ label : order.attributedStaffName, value : order.attributedStaffName }))
      })
    }
  }, [fetchOrderCommissionQuery.data])

  const orders = useMemo(() => {
    if (!fetchOrderCommissionQuery.data) return [];
  
    let filteredOrders = fetchOrderCommissionQuery.data.data;
  
    if (selectedCustomers && selectedCustomers.length) {
      filteredOrders = filteredOrders.filter(order =>
        selectedCustomers.includes(order.customerName)
      );
    }
  
    if (selectedAttributedStaffName && selectedAttributedStaffName.length) {
      filteredOrders = filteredOrders.filter(order =>
        selectedAttributedStaffName.includes(order.attributedStaffName)
      );
    }
  
    if (selectedDates.start && selectedDates.end) {
      const start = new Date(selectedDates.start).getTime();
      const end = new Date(selectedDates.end).getTime();
  
    
      filteredOrders = filteredOrders.filter(order => {
        const orderDate = new Date(order.orderDate).getTime();
        return orderDate >= start && orderDate <= end;
      });

    }
  
    return filteredOrders;
  }, [selectedCustomers, selectedAttributedStaffName, selectedDates, fetchOrderCommissionQuery.data]);
  
  

  // // get orders 
  // const orders: OrderCommissionType[] = useMemo(() => {
  //   let orders : OrderCommissionType[] = []

  //   if(fetchOrderCommissionQuery.data) {

  //     orders = fetchOrderCommissionQuery.data.data;

  //     if(selectedCustomers && selectedCustomers.length) {
  //       orders = fetchOrderCommissionQuery.data.data.filter((order) => {
  //         return selectedCustomers.includes(order.customerName)
  //       })
  //     }

  //     if(selectedAttributedStaffName && selectedAttributedStaffName.length) {
  //       orders = fetchOrderCommissionQuery.data.data.filter((order) => {
  //         return selectedAttributedStaffName.includes(order.attributedStaffName)
  //       })
  //     }

  //     return orders
  //   }
  //   return orders
  // }, [selectedCustomers, fetchOrderCommissionQuery.data, selectedAttributedStaffName]);

  return (
    <div className={style.container}>
      {/* show error if it is occuring at the time of order commission request  */}
      {fetchOrderCommissionQuery.isError && <span className={style.error}>{fetchOrderCommissionQuery?.error?.message}</span>}
      {/* order commission table  */}
      <Card>
        <ButtonGroup>       
            {/* Refetch the data after clicking the sync button */}
            <Button variant="primary" onClick={fetchOrderCommissionQuery.refetch}>Sync</Button>
        </ButtonGroup>
        {/* order commission filter component  */}
        <OrderCommissionFitler orders={orders} customerList={customerList} selectedCustomers={selectedCustomers} setSelectedCustomers={setSelectedCustomers} attributedStaffNameList={attributedStaffNameList} selectedAttributedStaffName={selectedAttributedStaffName} setSelectedAttributedStaffName={setSelectedAttributedStaffName} orderMonth={month} orderYear={year}  setSelectedDates={setSelectedDates} selectedDates={selectedDates} setDate={setDate} />

        <OrderCommissionTable orders={orders} orderFetching={fetchOrderCommissionQuery.isFetching} />
      </Card>
    </div>
  )
}

export default Home
