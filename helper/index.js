// export const CORLOR_APP = "#3c169b";
export const CORLOR_APP = "linear-gradient(23deg, rgba(47,110,163,1) 0%, rgba(90,81,160,1) 58%)";
export const CORLOR_WHITE = "#FFF";
export const COLOR_TEXT = "rgba(47,110,163,1)";

export const S3_URL = "https://lailaocf-bucket.s3.amazonaws.com/resized/small/";
export const S3_URL_MEDIUM = "https://lailaocf-bucket.s3.amazonaws.com/resized/medium/";
export const S3_URL_LARGE = "https://lailaocf-bucket.s3.amazonaws.com/resized/large/";
export const image_main = "/assets/images/image_v2.png"

export const emptyImage =
  "https://www.generationsforpeace.org/wp-content/uploads/2018/03/empty.jpg";
export const EMPTY_USER_PROFILE = "assets/images/emptyProfile.jpg";

export const SERVER_IP = "https://sp.bbbb.com.la/";
export const LINK_AFFILIATE = "https://affiliate.bbbb.com.la/";

export const CLIENT_ID = "191329944996-toam9grdvadq5sdbjaicr2t70pqjl4n0.apps.googleusercontent.com";

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

export const COMMISSION_OFFICE = 3;
export const numberFormat = (_number) => {
  return new Intl.NumberFormat("en-US").format(_number);
};

// ======================================= link upoint ================================
// Dev
// export const SERVER_URI = "https://api-dev.bbbb.com.la/";
// export const SOCKET_SERVER_URI = "wss://api-dev.bbbb.com.la/";

// Production
// export const SERVER_URI = "https://api.bbbb.com.la/";
// export const SOCKET_SERVER_URI = "wss://api.bbbb.com.la/";  

// localhost
export const SERVER_URI = "http://localhost:7070/";
export const SOCKET_SERVER_URI = "ws://localhost:7070/" 
