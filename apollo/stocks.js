import { gql } from "@apollo/client";

export const GET_STOCKS = gql`
  query Stocks($where: StockWhereInput, $orderBy: OrderByInput, $skip: Int, $limit: Int) {
    stocks(where: $where, orderBy: $orderBy, skip: $skip, limit: $limit) {
      total
      data {
        id
        price
        originPrice
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
      }
    }
}
`;

export const GET_SALE_PAGE_LIVE_STOCKS = gql`
  query salePageLiveStocks($where: LiveStockWhereInput, $orderBy: OrderByInput, $skip: Int, $limit: Int) {
  salePageLiveStocks(where: $where, orderBy: $orderBy, skip: $skip, limit: $limit) {
    total
    data {
      id
      amount
      amountAll
      stock{
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

