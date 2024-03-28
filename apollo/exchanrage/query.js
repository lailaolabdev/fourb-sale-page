import { gql } from "apollo-boost";

export const GET_EXCHANGRATE = gql`
query ExchangeRate($where: ExchangeRateWhereInput) {
  exchangeRate(where: $where) {
    kip
    baht
    usd
    id
    updatedAt
    createdAt
  }
}
`