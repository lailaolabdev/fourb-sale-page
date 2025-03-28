import { gql } from "@apollo/client";

export const GET_ORDER = gql`
  query Order($where: OrderWhereInputOne!) {
    order(where: $where) {
      id
      amount
      message
      phone
      addressCf
      address {
        id
        country
        province
        district
        village
        detail
        lat
        long
      }
      option
      productName
      fbMessage
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
      post {
        id
        page
        pageName
        fbFeedId
        detail
        description
        title
      }
      code
      liveStock {
        id
        amount
        cfMessage
        stock {
          id
          name
          amount
          optionValues {
            id
            name
            value
          }
        }
      }
      postStock {
        id
        amount
        cfMessage
        stock {
          id
          name
          amount
          optionValues {
            id
            name
            value
          }
        }
      }
      shop {
        id
      }
      status
      payment
      isPaymented
      user {
        id
        nickname
      }
      isDeleted
      createdAt
      updatedAt
      note
    }
  }
`;
export const GET_ORDERGROUPS_WITH_SALEPAGE = gql`
query GetOrderGroupWithSalePage($where: OrderGroupWhereInputOne!) {
  getOrderGroupWithSalePage(where: $where) {
    id
    amount
    phone
    address
    totalPrice
    sumPriceBaht
    sumPriceUsd
    sumPrice
    orders {
      id
      amount
      code
      note
      isDeleted
      stock {
        id
        name
        amount
        price
        image
        unit
        currency
      }
    }
    cfName
    customerName
    customerImage
    userFbId
    unsendMessage
    sendMessage
    tag
    tagColor
    shop {
      id
      name
      phone
      image
      address {
        district
        village
        province
      }
    }
    code
    shipmentNumber
    shipPrice
    paymentType
    userConfirm {
      id
      name
      phone
    }
    status
    invoiceStatus
    infulancerInvoiceStatus
    shopStatus
    payment
    isPaymented
    paySlip
    paySlips
    logistic
    originalLogistic
    destinationLogistic
    addressCf
    type
    isReply
    isDeleted
    createdAt
    updatedAt
    note
    transactionId
    infulancer_percent
    commissionAffiliate
    typeForAffiliate
    totalServiceCharge
    commissionService
    commissionInfluencer
    totalAffiliate
    isPaymentSupport
    isClaimBalance
    confirmBalance
    servicePaymentSupport
    jointOrder
    dataConfirmCod
    paymentMethod
  }
}
`;

export const GET_ORDERS = gql`
  query Orders(
    $where: OrderWhereInput
    $orderBy: OrderByInput
    $skip: Int
    $limit: Int
  ) {
    orders(where: $where, orderBy: $orderBy, skip: $skip, limit: $limit) {
      total
      data {
        id
        amount
        message
        unsendMessage
        phone
        addressCf
        address {
          id
          country
          province
          district
          village
          detail
          lat
          long
        }
        option
        productName
        currency
        fbMessage
        price
        totalPrice
        cfName
        cfMessage
        tag
        tagColor
        live {
          id
          page
          pageName
          detail
          description
          fbLiveId
          title
        }
        post {
          id
          page
          pageName
          fbFeedId
          detail
          description
          title
        }
        code
        type
        liveStock {
          id
          amount
          cfMessage
          stock {
            id
            name
            amount
            currency
            image
            optionValues {
              id
              name
              value
            }
          }
        }
        postStock {
          id
          amount
          cfMessage
          stock {
            id
            name
            amount
            optionValues {
              id
              name
              value
            }
          }
        }
        stocks {
          id
          name
          amount
          price
          currency
          optionValues {
            id
            name
            value
          }
        }
        stock {
          id
          name
          amount
          price
          currency
          image
        }
        shop {
          id
          name
          phone
        }
        userConfirm {
          id
          code
          name
        }
        status
        payment
        isPaymented
        isDeleted
        createdAt
        updatedAt
        note
      }
    }
  }
`;

export const GET_ORDERGROUPS = gql`
  query OrderGroups(
    $where: OrderGroupWhereInput
    $orderBy: OrderByInput
    $skip: Int
    $limit: Int
  ) {
    orderGroups(where: $where, orderBy: $orderBy, skip: $skip, limit: $limit) {
      data {
        id
        amount
        totalPrice
        sumPriceBaht
        sumPriceUsd
        sumPrice
        cfName
        customerName
        customerImage
        userFbId
        code
        shipmentNumber
        invoiceStatus
        addressCf
        phone
        paySlip
        paymentType
        payment
        logistic
        isReply
        unsendMessage
        live {
          id
          description
          pageName
        }
        post {
          id
          description
          pageName
        }
        shop {
          id
          name
          image
          note
        }
        status
        isPaymented
        type
        createdAt
        tag
        tagColor
        orders {
          id
          productName
          cfMessage
          cfName
          amount
          totalPrice
          price
          currency
        }
        exchangeRate {
          id
          baht
          usd
        }
        isDeleted
      }
      total
    }
  }
`;

export const GET_ORDERGROUPS_DETAIL = gql`
  query Query($where: OrderGroupWhereInputOne!) {
    orderGroup(where: $where) {
      id
      code
      amount
      cfName
      customerName
      userFbId
      status
      createdAt
      note
      phone
      addressCf
      shipPrice
      totalPrice
      sumPriceBaht
      sumPriceUsd
      sumPrice
      exchangeRate {
        usd
        baht
      }
      type
      isReply
      paymentType
      payment
      logistic
      destinationLogistic
      paySlip
      orders {
        id
        productName
        amount
        price
        totalPrice
        currency
        cfMessage
        cfName
        message
        createdAt
        liveStock {
          id
          stock {
            id
            currency
            image
            optionValues {
              id
              name
              value
            }
          }
        }
        postStock {
          id
          stock {
            id
            currency
            image
            optionValues {
              id
              name
              value
            }
          }
        }
        stock {
          image
          cfMessage
          amount
        }
      }

      live {
        id
        pageName
        page
      }
      post {
        id
        pageName
        page
      }

      shop {
        id
        name
        phone
        image
        address {
          village
          district
          province
        }
      }
      tag
      tagColor
      isPaymented
      userConfirm {
        name
        id
      }
    }
  }
`;

export const GET_ORDER_STOCK_AMOUNT = gql`
  query Query($where: OrderWhereInputOne!) {
    order(where: $where) {
      id
      amount
      liveStock {
        id
        stock {
          id
          amount
        }
      }
      stock {
        id
        amount
      }
    }
  }
`;

