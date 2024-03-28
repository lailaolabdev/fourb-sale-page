import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  setOrder: [],
};

const productSlice = createSlice({
  name: "setorder",
  initialState,
  reducers: {
    setOrders: (state, action) => {
      state.setOrder = action.payload;
    },
  },
});

export const { setOrders } = productSlice.actions;
export default productSlice.reducer;
