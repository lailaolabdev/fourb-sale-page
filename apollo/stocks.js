import { gql } from "@apollo/client";

export const GET_STOCKS = gql`
  query Stocks(
    $where: StockWhereInput
    $orderBy: OrderByInput
    $skip: Int
    $limit: Int
  ) {
    stocks(where: $where, orderBy: $orderBy, skip: $skip, limit: $limit) {
      total
      data {
        id
        price
        originPrice
        favorite
        amount
        cfMessage
        image
        name
        unit
        sort
        currency
        isDeleted
        currency
        isUsing
        optionValues {
          id
          name
          value
          isDeleted
        }
        isUsingSalePage
        createdAt
        updatedAt
        note
        reduction
        containImages
        descriptions {
          title
          image
        }
        properties {
          title
          detail
        }
      }
    }
  }
`;

export const GET_STOCK = gql`
  query Stock($where: StockWhereInputOne!) {
    stock(where: $where) {
      id
      price
      originPrice
      currency
      amount
      image
      coverImages
      name
      unit
      cfMessage
      isDeleted
      isUsing

      product {
        amount
        id
        price
        unit
        currency
      }
      optionValues {
        id
        name
        value

        isDeleted
        stockOptionValues {
          id
          note
        }
        createdAt
        updatedAt
        note
      }
      createdAt
      updatedAt
      note
      sort
      isUsingSalePage
    }
  }
`;

export const GET_SALE_PAGE_LIVE_STOCKS = gql`
  query salePageLiveStocks(
    $where: LiveStockWhereInput
    $orderBy: OrderByInput
    $skip: Int
    $limit: Int
  ) {
    salePageLiveStocks(
      where: $where
      orderBy: $orderBy
      skip: $skip
      limit: $limit
    ) {
      total
      data {
        id
        amount
        amountAll
        stock {
          id
          name
          amount
          unit
          price
          image
          isDeleted
          currency
          optionValues {
            id
            name
            value
          }
        }
        isPublished
        cfMessage
        createdAt
        updatedAt
        note
      }
    }
  }
`;
