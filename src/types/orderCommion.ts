import { SuccessResponseType } from "./apiResponse";


// order commission type
export interface OrderCommissionType {
    id: string;
    orderDate: string;
    customerName: string;
    attributedStaffName: string;
    total: number;
    commissionInDollars: number;
}

// order commission api response
export interface OrderCommissionApiResponse extends SuccessResponseType {
    data : {
        orders : OrderCommissionType[],
    },
}

