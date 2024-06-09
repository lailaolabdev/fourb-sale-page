import { combineReducers } from "redux";

import fbdataReducer from "./fbdata/fbdata.reducer";
import cartReducer from "./salepage/cartReducer";
import orders from "./setOrder/orders";
import patchBack, { getKeyPatch } from "./setPatch/patchBack";
import { getSearchs, setNotiOrders } from "./notiorder/getNotiorder";
import getIds from "./predata/getIds";
import dataOrder from "./completedOrder/dataOrder";
import trackOrder from "./setOrder/trackOrder";
import getqrcode from "./qrcode/getqrcode";
import getData from "./productView/getData";

const rootReducer = combineReducers({
  fbdata: fbdataReducer,
  salepage: cartReducer,
  setorder: orders,
  notiorder: setNotiOrders,
  notiorder: getSearchs,
  setpatch: patchBack,
  predata: getIds,
  completedOrder: dataOrder,
  setorder: trackOrder,
  qrcode: getqrcode,
  productView: getData,
  getKeyPatch: getKeyPatch,
});
 

export default rootReducer;
