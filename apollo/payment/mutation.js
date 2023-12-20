import { gql } from "@apollo/client";

export const CREATE_QR_AND_SUBSCRIPE_FOR_PAYMENT = gql`
  mutation CreateQrAndSubscripeForPayment($data: PaymentInput!) {
    createQrAndSubscripeForPayment(data: $data) {
      qrCode
    }
  }
`;

export const ON_ORDER_UPDATE = gql`
  subscription OnOrderUpdated($orderId: ID!) {
    onOrderUpdated(orderId: $orderId) {
      id
      transactionId
    }
  }
`;
