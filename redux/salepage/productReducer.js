import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  productList: [],
};

const productSlice = createSlice({
  name: "product",
  initialState,
  reducers: {
    addProductList: (state, action) => {
      state.productList = action.payload;
    },
  },
});

export const { addProductList } = productSlice.actions;
export default productSlice.reducer;
