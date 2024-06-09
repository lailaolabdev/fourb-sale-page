import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  notiOrder: [],
  filterData: []
};

const productSlice = createSlice({
  name: "notiOrder",
  initialState,
  reducers: {
    setNotiOrders: (state, action) => {
      state.notiOrder = action.payload;
    },
    getSearchs: (state, action) => {
      state.notiOrder = action.payload;
    },
  },
});

export const { setNotiOrders, getSearchs } = productSlice.actions;
export default productSlice.reducer;
