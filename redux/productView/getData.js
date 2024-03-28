

import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  getData: [],
};

const productSlice = createSlice({
  name: "getData",
  initialState,
  reducers: {
    setStateView: (state, action) => {
      state.getData = action.payload;
    },
  },
});

export const { setStateView } = productSlice.actions;
export default productSlice.reducer;


