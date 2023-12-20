import { gql } from "@apollo/client";

export const GET_BANKS = gql`
query Banks(
  $where: BankWhereInput
  $skip: Int
  $limit: Int
  $orderBy: OrderByInput
) {
  banks(where: $where, skip: $skip, limit: $limit, orderBy: $orderBy) {
    total
    data {
      bankAccount
      bankName
      bankUser
      id
      image
    }
  }
}
`;