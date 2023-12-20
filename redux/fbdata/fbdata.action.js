import {
  FBDATA_UPDATE,
  FBDATA_REMOVE,
  FBDATA_UPDATE_FEEDLIST,
} from "./fbdata.types";
import { store, persistor } from "../store";

export const updateFbdata = (payload) => {
  store.dispatch({
    type: FBDATA_UPDATE,
    payload: payload,
  });
};

export const removeFbdata = () => {
  store.dispatch({
    type: FBDATA_REMOVE,
  });
};

export const updateFbFeedList = (payload) => {
  store.dispatch({
    type: FBDATA_UPDATE_FEEDLIST,
    payload: payload,
  });
};
