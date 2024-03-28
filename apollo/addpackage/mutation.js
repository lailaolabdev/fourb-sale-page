import { gql } from "@apollo/client";

export const ADD_PACKAGE_SYSTEM = gql`
mutation AddSystemPackages($data: UserInput!, $where: LoginUserInput!) {
  addSystemPackages(data: $data, where: $where) {
    data {
      id
      nickname
      username
      shop {
        id
        image
        name
        phone
        transactionId
      }
    }
  }
}
`;
