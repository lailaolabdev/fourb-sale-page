import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  notiOrder: [],
};

const productSlice = createSlice({
  name: "notiOrder",
  initialState,
  reducers: {
    setNotiOrders: (state, action) => {
      state.notiOrder = action.payload;
    },
  },
});

export const { setNotiOrders } = productSlice.actions;
export default productSlice.reducer;
