import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  setId: [],
};

const idSlice = createSlice({
  name: "setId",
  initialState,
  reducers: {
    setIds: (state, action) => {
      state.setId = action.payload;
    },
  },
});

export const { setIds } = idSlice.actions;
export default idSlice.reducer;
