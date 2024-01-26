import { gql } from "apollo-boost";

export const GET_SHOP = gql`
  query Shop($where: ShopWhereInputOne!) {
    shop(where: $where) {
        id
        name
        phone
        image
        address {
          province
          district
          village
        }
        website
        facebookUrl
        point
        paymentType
        startDate
        endDate
        isBlocked
        isDeleted
        money
        users {
            id
            nickname
            phone
            role
            gender
            maritualStatus
            userSub
            email
            isConfirmed
            username
            createdAt
            updatedAt
        }
        createdAt
        updatedAt
        note
        commissionAffiliate
        commissionService
        commision
    }
}
`;

export const SHOP = gql`
  query Shop($where: ShopWhereInputOne!) {
    shop(where: $where) {
      id
      name
      phone
      website
      facebookUrl
      point
      paymentType
      startDate
      endDate
      isBlocked
      isDeleted
      image
      commision
      address {
        district
        province
        village
      }
      users {
        id
        nickname
        phone
        role
        gender
        maritualStatus
        userSub
        email
        isConfirmed
        username
        createdAt
        updatedAt
      }
      createdAt
      updatedAt
      note
      dob
      commissionService
      commissionAffiliate
      isUseInflu
    }
  }
`;

export const GET_SHOP_COMMISSION_FOR_AFFILIATE_ONE = gql`
  query ShopSettingCommissionInfluencer(
    $where: ShopSettingCommissionInfulancerWhereInputOne!
  ) {
    shopSettingCommissionInfluencer(where: $where) {
      commission
      id
      infulancer_name
      shop_name
      isDeleted
      shop {
        id
        name
        phone
      }
      infulancer {
        id
        first_name
        last_name
        phone
      }
    }
  }
`;