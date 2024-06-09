import { calculateRoundedValue } from "@/helper";

export const URL_PACKAGE_SYSTEM = "https://sp.bbbb.com.la/pricing";

export const checkInviceStatus = (status) => {
  let title = "-";
  switch (status) {
    case "WAITING":
      title = "ກຳລັງກວດສອບ";
      break;
    case "REQUEST":
      title = "ກຳລັງຂໍການຖອນ";
      break;
    case "REJECT":
      title = "ຍົກເລິກການຖອນ";
      break;
    case "APPROVED":
      title = "ສຳເລັດການຖອນ";
      break;
    default:
      title = "ອໍເດີ້ເຂົ້າ";
      break;
  }
  return title;
};

 

export const formatNumberFavorite = (num) => {
  if (num >= 1000000) {
    return (num / 1000000).toFixed(1) + "M";
  } else if (num >= 1000) {
    return (num / 1000).toFixed(1) + "K";
  }
  return num;
};

