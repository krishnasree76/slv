import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const useStore = create(
  persist(
    (set) => ({
      cart: [],
      wishlist: [],
      user: null,
      token: null,
      deliveryConfig: { charge_upto_two: 50, charge_more_than_two: 100 },

      setDeliveryConfig: (config) => set({ deliveryConfig: config }),
      setAuth: (user, token) => set({ user, token }),
      logout: () => set({ user: null, token: null }),
      
      addToCart: (product, variant, quantity = 1) => set((state) => {
        // Extract color identifiers cleanly to prevent primitive vs deep key lookup crashes
        const incomingColorId = variant?.color?.id !== undefined ? variant.color.id : variant?.color;

        // Match items using BOTH variant ID and color ID so different colors are treated as separate items
        const existingItemIndex = state.cart.findIndex(item => {
          const itemColorId = item.variant?.color?.id !== undefined ? item.variant.color.id : item.variant?.color;
          return item.product.id === product.id && 
                 item.variant.id === variant.id && 
                 Number(itemColorId) === Number(incomingColorId);
        });

        const maxStock = variant?.stock !== undefined ? variant.stock : (product?.stock || 10);

        if (existingItemIndex >= 0) {
          const newCart = [...state.cart];
          const currentQty = newCart[existingItemIndex].quantity;
          
          // Cap quantity at max stock limits
          const combinedQty = currentQty + quantity;
          newCart[existingItemIndex].quantity = combinedQty > maxStock ? maxStock : combinedQty;
          
          if (variant?.image) {
            newCart[existingItemIndex].variant.image = variant.image;
          }

          return { cart: newCart };
        }

        const safeInitialQty = quantity > maxStock ? maxStock : quantity;
        return {
          cart: [...state.cart, { product, variant, quantity: safeInitialQty }]
        };
      }),

      removeFromCart: (productId, variantId) => set((state) => ({
        cart: state.cart.filter(item => {
          return !(item.product.id === productId && item.variant.id === variantId);
        })
      })),

      updateQuantity: (productId, variantId, quantity) => set((state) => ({
        cart: state.cart.map(item => 
          item.product.id === productId && item.variant.id === variantId
            ? { ...item, quantity }
            : item
        )
      })),

      clearCart: () => set({ cart: [] }),

      toggleWishlist: (product) => set((state) => {
        const exists = state.wishlist.some(item => item.id === product.id);
        if (exists) {
          return { wishlist: state.wishlist.filter(item => item.id !== product.id) };
        }
        return { wishlist: [...state.wishlist, product] };
      }),
      
      isInWishlist: () => {
        return false; 
      }
    }),
    {
      name: 'slv-selections-storage',
    }
  )
);
