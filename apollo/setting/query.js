import { gql } from "@apollo/client";

export const GET_SETTING = gql`
  query Setting($where: SettingWhereInputOne!) {
  setting(where:$where) {
      id
      facebook
      facebookSummary
      facebookPost
      bank  
      live
      post
      logistic
      tags
      bankQr
      isSummaryFirst
    	shop{
        id
      }
  }
}
`;

export const GET_SETTINGS = gql`
  query Settings($where: SettingWhereInput, $orderBy: OrderByInput, $skip: Int, $limit: Int) {
  settings(where: $where, orderBy: $orderBy, skip: $skip, limit: $limit) {
    data {
      id
      facebook
      facebookSummary
      facebookPost
      bank
      live
      post
      logistic
      tags
      isSummaryFirst
      bankQr
    	shop{
        id
      }
    }
  }
}
`;

export const GET_ADVERTISINGS = gql`
query Advertisements($where: AdvertisingWhereInput) {
  advertisements(where: $where) {
    data {
      id
      name
      startDate
      endDate
      link
      status
      note
      image
    }
    total
  }
}
`;