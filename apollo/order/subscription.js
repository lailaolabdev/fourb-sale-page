import { gql } from "@apollo/client"

export const SUBSCRIPTION_ORDER = gql`
subscription Subscription($liveId: ID!) {
  onOrderCreated(liveId: $liveId) {
    id
    amount
    message
    phone
    option
    productName
    fbMessage
    cfMessage
    price
    totalPrice
    cfName
    live {
        id
        page
        pageName
        detail
        description
        fbLiveId
        title
    }
    code
    liveStock {
        id
        amount
        cfMessage
    }
    shop {
        id
    }
    status
    payment
    isDeleted
    createdAt
    updatedAt
    note
  }
}
`;

export const SUBSCRIPTION_UNSEND_MESSAGE = gql`
subscription Subscription($liveId: ID!) {
  onUnsendMessageCreated(liveId: $liveId) {
    id
    amount
    message
    productName
    cfMessage
    cfName
    createdAt
  }
}
`