import {
  FBDATA_UPDATE,
  FBDATA_REMOVE,
  FBDATA_UPDATE_FEEDLIST,
} from "./fbdata.types";

const INITIAL_STATE = {
  fbUserAccessToken: "",
  assignedPageList: [],
};

const reducer = (state = INITIAL_STATE, action) => {
  // console.log("action: ", action);
  switch (action.type) {
    case FBDATA_UPDATE:
      return {
        ...state,
        ...action.payload,
      };
    case FBDATA_REMOVE:
      return {
        ...state,
        fbUserAccessToken: "",
      };
    case FBDATA_UPDATE_FEEDLIST:
      return {
        ...state,
        ...action.payload,
      };

    default:
      return state;
  }
};

export default reducer;
