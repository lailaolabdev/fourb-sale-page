import { gql } from "@apollo/client";

export const CREATE_ORDER = gql`
  mutation CreateOrder($data: OrderInput!) {
    createOrder(data: $data) {
      id
    }
  }
`;

export const CREATE_ORDER_FROM_COMMENT = gql`
  mutation CreateOrderFromComment($data: OrderInput!) {
    createOrderFromComment(data: $data) {
      id
    }
  }
`;

export const UPDATE_ORDER = gql`
  mutation UpdateOrderOrder($data: OrderInput!, $where: OrderWhereInputOne!) {
    updateOrder(data: $data, where: $where) {
      id
    }
  }
`;

export const UPDATE_MANY_ORDER = gql`
  mutation UpdateManyOrders(
    $data: OrderInput!
    $where: OrderWhereUpdateManyInput!
  ) {
    updateManyOrders(data: $data, where: $where) {
      status
    }
  }
`;

export const DELETE_ORDER = gql`
  mutation DeleteOrder($where: OrderWhereInputOne!) {
    deleteOrder(where: $where) {
      id
    }
  }
`;

export const CANCEL_ORDER = gql`
  mutation CancelOrder($where: OrderWhereInputOne!) {
    cancelOrder(where: $where) {
      id
    }
  }
`;

export const UPDATE_ORDERGROUP = gql`
  mutation Mutation($data: OrderGroupInput!, $where: OrderGroupWhereInputOne!) {
    updateOrderGroup(data: $data, where: $where) {
      id
      tag
      tagColor
    }
  }
`;

export const CREATE_LIVESTOCKS = gql`
  mutation Mutation($data: LiveStockInput!) {
    createLiveStock(data: $data) {
      id
    }
  }
`;

export const UPDATE_STOCK_AMOUNT = gql`
  mutation Mutation($data: StockInput!, $where: StockWhereInputOne!) {
    updateStock(data: $data, where: $where) {
      id
    }
  }
`;

export const UPDATE_STOCK_HEART = gql`
  mutation Mutation($data: StockInput!, $where: StockWhereInputOne!) {
    updateHeartStock(data: $data, where: $where) {
      id
    }
  }
`;

export const CREATE_ORDER_GROUP = gql`
  mutation Mutation($data: OrderGroupInput!) {
    createOrderGroup(data: $data) {
      id
    }
  }
`;


export const UPDATE_STOCK = gql`
mutation UpdateHeartStock($data: StockInput!, $where: StockWhereInputOne!) {
  updateHeartStock(data: $data, where: $where) {
    id
  }
}
`;

export const DELETE_ORDER_GROUP = gql`
  mutation Mutation($where: OrderGroupWhereInputOne!) {
    deleteOrderGroup(where: $where) {
      id
    }
  }
`;

export const CREATE_ORDER_ON_SALE_PAGE = gql`
  mutation CreateOrderSalePage($data: SalePageInputData) {
    createOrderSalePage(data: $data) {
      id
      paymentType
      code
      totalPrice
      createdAt
    }
  }
`;

export const CRATE_QR_WITH_PAYMENT_GATEWAY = gql`
mutation CreateQrWithPaymentGateway($data: PaymentInput!) {
  createQrWithPaymentGateway(data: $data) {
    qrCode
    appLink
    data {
      id
      code
    }
  }
}
`;
export const CREATE_PAYMENT_LINK_WITH_PHAPAY = gql`
mutation CreatePaymentLinkWithPhapay($data: PaymentInput!) {
  createPaymentLinkWithPhapay(data: $data) {
    appLink
    qrCode
  }
}
`;

export const UPDATE_MANY_ORDERGROUPS = gql`
  mutation UpdateManyOrderGroups(
    $data: OrderGroupInput!
    $where: OrderGroupWhereUpdateManyInput
  ) {
    updateManyOrderGroups(data: $data, where: $where) {
      status
    }
  }
`;
