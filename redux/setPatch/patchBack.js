import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  patchBack: [],
};

const productSlice = createSlice({
  name: "patchback",
  initialState,
  reducers: {
    getKeyPatch: (state, action) => {
      state.patchBack = action.payload;
    },
  },
});

export const { getKeyPatch } = productSlice.actions;
export default productSlice.reducer;
