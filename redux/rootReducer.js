import { combineReducers } from "redux";

import fbdataReducer from "./fbdata/fbdata.reducer";
import cartReducer from "./salepage/cartReducer";
import orders from "./setOrder/orders";
import patchBack from "./setPatch/patchBack";
import { setNotiOrders } from "./notiorder/getNotiorder";
import getIds from "./predata/getIds";
import dataOrder from "./completedOrder/dataOrder";

const rootReducer = combineReducers({
  fbdata: fbdataReducer,
  salepage: cartReducer,
  setorder: orders,
  notiorder: setNotiOrders,
  setpatch: patchBack,
  predata: getIds,
  completedOrder: dataOrder,
});
 

export default rootReducer;
