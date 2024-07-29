import apiInstance from "."
import { OrderCommissionApiResponse } from "../types/orderCommion"


// GET ORDER COMMISSIONS
export const getOrderCommission = () : Promise<OrderCommissionApiResponse> => {
    return apiInstance.get(`/order-commissions`)
}