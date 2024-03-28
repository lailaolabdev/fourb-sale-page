import { createSlice } from "@reduxjs/toolkit";
import { message } from "antd";
import { toast } from "react-toastify";

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
        if (product?.amount <= existingItem?.qty) {
          
          message.warning('ຈຳນວນສິນຄ້າໝົດແລ້ວ!')
          return
        }

        existingItem.qty += 1;
        message.success('ເພິ່ມເຂົ້າກະຕ່າສຳເລັດແລ້ວ')
        
      } else {
        state.cartList.push({ ...product, qty: 1, modelType: action.payload.modelType || "LIVE" });
         
        message.success('ເພິ່ມເຂົ້າກະຕ່າສຳເລັດແລ້ວ')
      }
    },

    // ລືບຈຳນວນສິນຄ້າທັງໝົດບາດດຽວ
    removeCartItem: (state, action) => {
      state.cartList.splice(action.payload);
    },

    // ລືບເທື່ອລະລາຍການ
    removeSingleItem: (state, action) => {
      state.cartList.splice(action.payload, 1);
    },

    // ບວກຈຳນວນເທື່ອລະໜຶ່ງ
    incrementCartItem: (state, action) => {
      state.cartList[action.payload].qty += 1 || 0;
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
