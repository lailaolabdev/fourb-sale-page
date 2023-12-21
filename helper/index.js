export const CORLOR_APP = "#3c169b";
export const CORLOR_WHITE = "#FFF";

export const S3_URL = "https://lailaocf-bucket.s3.amazonaws.com/files/";

export const emptyImage =
  "https://www.generationsforpeace.org/wp-content/uploads/2018/03/empty.jpg";
export const EMPTY_USER_PROFILE = "assets/images/emptyProfile.jpg";

export const SERVER_IP = "http://18.141.228.151/";

// convert price
export const calculateRoundedValue = (price) => {
  // console.log("calculateRoundedValue------->", price)
  let integerPart = Math.floor(price);
  let decimalPart = price - integerPart;

  if (decimalPart < 0.5 && decimalPart != 0) {
    return integerPart + 0.5;
  } else if (decimalPart === 0.5 || decimalPart == 0) {
    return price;
  } else {
    return integerPart + 1;
  }
};
export const COMMISSION_OFFICE = 0.03;
export const numberFormat = (_number) => {
  return new Intl.NumberFormat("en-US").format(_number);
};

// ======================================= link upoint ================================
// Dev
// export const SERVER_URI = "https://cf-dev-api.lailaolab.com/";
// export const SOCKET_SERVER_URI = "wss://cf-dev-api.lailaolab.com/";

// Production
export const SERVER_URI = "https://cf-api-dev.lailaolab.com/";
export const SOCKET_SERVER_URI = "wss://cf-api-dev.lailaolab.com/";

// localhost
// export const SERVER_URI = "http://localhost:7070/";
// export const SOCKET_SERVER_URI = "ws://localhost:7070/"
