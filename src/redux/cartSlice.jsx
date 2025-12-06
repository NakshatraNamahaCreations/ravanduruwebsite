import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  cartItems: [],
};

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    addToCart: (state, action) => {
      const item = action.payload || {};

      // quantity buyer intends to purchase (number of packs)
      const qty = Number(item.quantity) > 0 ? Number(item.quantity) : 1;

      // Accept either selectedWeight (frontend naming) or weight (legacy)
      const selectedWeight = item.selectedWeight ?? item.weight ?? null;
      const selectedUnit = item.selectedUnit ?? item.unit ?? null;

      // treat same product with different weights as different lines
      const existingItem = state.cartItems.find(
        i => i.id === item.id && (i.selectedWeight ?? null) === (selectedWeight ?? null)
      );

      if (existingItem) {
        existingItem.quantity = Number(existingItem.quantity || 0) + qty;
      } else {
        state.cartItems.push({
          ...item,
          // normalize stored fields
          selectedWeight: selectedWeight,   // e.g. "200"
          selectedUnit: selectedUnit,       // e.g. "gm" or "pcs"
          // keep legacy 'weight' field if you want (optional)
          weight: selectedWeight && selectedUnit ? `${selectedWeight}${selectedUnit}` : (item.weight ?? null),
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

    incrementQuantity: (state, { payload }) => {
      // payload may be { id } or { id, selectedWeight }
      const id = payload?.id ?? payload;
      const selW = payload?.selectedWeight;
      const it = state.cartItems.find(i =>
        String(i.id) === String(id) && (selW ? (i.selectedWeight ?? null) === (selW ?? null) : true)
      );
      if (it) it.quantity = Math.max(1, Number(it.quantity || 1) + 1);
    },

    decrementQuantity: (state, { payload }) => {
      const id = payload?.id ?? payload;
      const selW = payload?.selectedWeight;
      const it = state.cartItems.find(i =>
        String(i.id) === String(id) && (selW ? (i.selectedWeight ?? null) === (selW ?? null) : true)
      );
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

// Export all actions you defined
export const {
  addToCart,
  updateQuantity,
  incrementQuantity,
  decrementQuantity,
  removeFromCart,
  clearCart
} = cartSlice.actions;

export default cartSlice.reducer;
