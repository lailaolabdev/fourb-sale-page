import { createSlice } from "@reduxjs/toolkit";
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
          toast.warning("ຈຳນວນສິນຄ້າໝົດແລ້ວ!", {
            autoClose: 700,
          });
          return
        }

        existingItem.qty += 1;
        toast.success("ເພິ່ມເຂົ້າກະຕ່າສຳເລັດແລ້ວ", {
          autoClose: 700,
        });
      } else {
        state.cartList.push({ ...product, qty: 1, modelType: action.payload.modelType || "LIVE" });
        toast.success("ເພິ່ມເຂົ້າກະຕ່າສຳເລັດແລ້ວ", {
          autoClose: 700,
        });
      }
    },

    // ລືບຈຳນວນສິນຄ້າທັງໝົດບາດດຽວ
    removeCartItem: (state, action) => {
      state.cartList.splice(action.payload);
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
} = cartSlice.actions;
export default cartSlice.reducer;
