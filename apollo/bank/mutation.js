import { gql } from "@apollo/client";

export const CREATE_BANK = gql`
mutation CreatBank($data: BankInput!) {
    createBank(data: $data) {
      id
    }
  }  
`;

export const UPDATE_BANK = gql`
mutation UpdateBank($data: BankInput!, $where: BankWhereInputOne!) {
  updateBank(data: $data, where: $where) {
    bankAccount
    id
  }
}
`;

export const DELETE_BANK = gql`
mutation DeleteBank($where: BankWhereInputOne!) {
  deleteBank(where: $where) {
    id
  }
}
`;