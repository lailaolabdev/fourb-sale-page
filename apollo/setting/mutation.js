import { gql } from "@apollo/client";

export const CREATE_SETTING = gql`
  mutation CreateSetting($data: SettingInput!) {
    createSetting(data: $data) {
      id
    }
  }
`;

export const UPDATE_SETTING = gql`
  mutation UpdateSetting($data: SettingInput!, $where: SettingWhereInputOne!) {
    updateSetting(where: $where, data: $data) {
      id
    }
  }
`;

export const DELETE_SETTING = gql`
  mutation DeleteSetting($where: SettingWhereInputOne!) {
    deleteSetting(where: $where) {
      id
    }
  }
`;


export const CREATE_ADVERTISING = gql`
  mutation CreateAdvertising($data: AdvertisingInput!) {
    createAdvertising(data: $data) {
      id
    }
  }
`;

export const UPDATE_ADVERTISING = gql`
mutation UpdateAdvertising($data: AdvertisingInput!, $where: AdvertisingWhereInputOne!) {
  updateAdvertising(data: $data, where: $where) {
    id
  }
}
`;
export const DELETE_ADVERTISING = gql`
mutation DeleteAdvertising($where: AdvertisingWhereInputOne!) {
  deleteAdvertising(where: $where) {
    id
  }
}
`;

