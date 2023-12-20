import { gql } from "@apollo/client";

export const GET_PRESIGN_URL = gql`
  query PreSignedUrl($name: String!) {
    preSignedUrl(name: $name) {
      url
    }
}
`;