import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  dataCompleted: [],
};

const completedSlice = createSlice({
  name: "CommpletedOrder",
  initialState,
  reducers: {
    setDataCompleteds: (state, action) => {
      state.dataCompleted = action.payload;
    },

   
  },
});

export const { setDataCompleteds } = completedSlice.actions;
export default completedSlice.reducer;
