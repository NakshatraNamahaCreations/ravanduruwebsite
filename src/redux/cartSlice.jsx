import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  cartItems: [],
};
const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    addToCart: (state, action) => {
      const item = action.payload;

      // sanitize & default
      const qty = Number(item.quantity) > 0 ? Number(item.quantity) : 1;
      const weight = item.selectedWeight ?? null;

      // treat same product with different weights as different lines
      const existingItem = state.cartItems.find(
        i => i.id === item.id && (i.selectedWeight ?? null) === weight
      );

      if (existingItem) {
        existingItem.quantity += qty;   
      } else {
        state.cartItems.push({
          ...item,
          selectedWeight: weight,
          quantity: qty,                 
        });
      }
    },

   
    updateQuantity: (state, action) => {
      const { id, selectedWeight, quantity } = action.payload;
      const item = state.cartItems.find(
        i => i.id === id && (i.selectedWeight ?? null) === (selectedWeight ?? null)
      );
      if (item) item.quantity = Math.max(1, Number(quantity) || 1);
    },

    incrementQuantity: (state, { payload: id }) => {
      const it = state.cartItems.find(i => String(i.id) === String(id));
      if (it) it.quantity = Math.max(1, Number(it.quantity || 1) + 1);
    },
    decrementQuantity: (state, { payload: id }) => {
      const it = state.cartItems.find(i => String(i.id) === String(id));
      if (it) it.quantity = Math.max(1, Number(it.quantity || 1) - 1);
    },
    removeFromCart: (state, action) => {
      const { id, selectedWeight } = action.payload;
      state.cartItems = state.cartItems.filter(
        i => !(i.id === id && (i.selectedWeight ?? null) === (selectedWeight ?? null))
      );
    },
    clearCart: (state) => {
      state.cartItems = [];
    }
  }
});


export const { addToCart, updateQuantity, removeFromCart } = cartSlice.actions;
export default cartSlice.reducer;
