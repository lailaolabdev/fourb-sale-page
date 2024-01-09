import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  orderGroups: [],
};

const ordrGroupstSlice = createSlice({
  name: "ordergroups",
  initialState,
  reducers: {
    setOrderGroups: (state, action) => {
      state.orderGroups = action.payload;
    },
  },
});

export const { setOrderGroups } = ordrGroupstSlice.actions;
export default ordrGroupstSlice.reducer;
