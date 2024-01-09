import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  setqr: [],
};

const qrSlice = createSlice({
  name: "setqr",
  initialState,
  reducers: {
    setqrcode: (state, action) => {
      state.setqr = action.payload;
    },
  },
});

export const { setqrcode } = qrSlice.actions;
export default qrSlice.reducer;
