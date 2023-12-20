import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  patchBack: [],
};

const productSlice = createSlice({
  name: "patchback",
  initialState,
  reducers: {
    getPatchSalePage: (state, action) => {
      state.patchBack = action.payload;
    },
  },
});

export const { getPatchSalePage } = productSlice.actions;
export default productSlice.reducer;
