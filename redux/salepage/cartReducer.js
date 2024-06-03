import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  cartList: [],
};

const cartSlice = createSlice({
  name: "carts",
  initialState,
  reducers: {
    addCartItem: (state, action) => {
      const product = action.payload;
      const existingItem = state.cartList.find(
        (data) => data.id === product.id
      );
    
      if (existingItem) {
        // Check if newQuantity exists and add it to qty, else add 1
        existingItem.qty += product.newQuantity ? product.newQuantity : 1;
      } else {
        // If newQuantity exists, use it; otherwise, set qty to 1
        state.cartList.push({ ...product, qty: product.newQuantity ? product.newQuantity : 1, modelType: action.payload.modelType || "LIVE" });
      }
      // Uncomment the following line if you want to show a success message
      // message.success('ເພິ່ມເຂົ້າກະຕ່າສຳເລັດແລ້ວ');
    },
    

    // ລືບຈຳນວນສິນຄ້າທັງໝົດບາດດຽວ
    removeCartItem: (state, action) => {
      state.cartList.splice(action.payload);
    },

    // ລືບເທື່ອລະລາຍການ
    removeSingleItem: (state, action) => {
      state.cartList.splice(action.payload, 1);
    },

    incrementCartItem: (state, action) => {
      const index = action.payload;
      if (state.cartList[index] && state.cartList[index].qty < state.cartList[index].amount) {
        state.cartList[index].qty += 1;
      }
    },
    updateCartItemQuantity: (state, action) => {
      const { index, newQuantity } = action.payload;
      if (state.cartList[index]) {
        state.cartList[index].qty = newQuantity;
      }
    },

    // ລົບຈຳນວນເທື່ອລະໜຶ່ງ
    decrementCartItem: (state, action) => {
      if (state.cartList[action.payload].qty === 1) {
        state.cartList.splice(action.payload, 1 || 0);
      } else {
        state.cartList[action.payload].qty -= 1 || 0;
      }
    },
  },
});

export const {
  addCartItem,
  removeCartItem,
  updateCartItemQuantity,
  incrementCartItem,
  decrementCartItem,
  removeSingleItem
} = cartSlice.actions;
export default cartSlice.reducer;
