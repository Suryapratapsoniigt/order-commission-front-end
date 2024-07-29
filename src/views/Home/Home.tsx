import { useQuery } from "@tanstack/react-query"
import OrderCommissionTable from "../../components/OrderCommissionTable/OrderCommissionTable"
import { getOrderCommission } from "../../api/requests"
import orders from "../../data/orderCommisson"
import style from './Home.module.css'

const Home = () => {

  // FETCH ORDER-COMMISSIONS
  const fetchOrderCommissionQuery = useQuery({ 
    queryKey : ['order-commission'],
    queryFn : () => getOrderCommission(),
  })

  console.log(fetchOrderCommissionQuery, '>>>')

  return (
    <div className={style.container}>
      {/* show error if it is occuring at the time of order commission request  */}
      {fetchOrderCommissionQuery.isError && <span className={style.error}>{fetchOrderCommissionQuery?.error?.message}</span>}
      {/* order commission table  */}
      <OrderCommissionTable orders={orders} orderFetching={fetchOrderCommissionQuery.isFetching} refetch={fetchOrderCommissionQuery.refetch} />
    </div>
  )
}

export default Home
