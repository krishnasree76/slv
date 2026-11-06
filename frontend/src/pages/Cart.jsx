// import React from 'react';
// import { Link } from 'react-router-dom';
// import { motion, AnimatePresence } from 'framer-motion';
// import { Trash2, ShoppingBag, ArrowRight } from 'lucide-react';
// import { useStore } from '../store/useStore';
// import { Button } from '../components/ui/Button';

// export const Cart = () => {
//   const { cart, removeFromCart, updateQuantity, deliveryConfig } = useStore();

//   const subtotal = cart.reduce((total, item) => total + (item.product.price * item.quantity), 0);
//   const totalQuantity = cart.reduce((total, item) => total + item.quantity, 0);
  
//   const shipping = subtotal > 0 ? (totalQuantity <= 2 ? Number(deliveryConfig.charge_upto_two) : Number(deliveryConfig.charge_more_than_two)) : 0;
//   const total = subtotal + shipping;

//   if (cart.length === 0) {
//     return (
//       <div className="min-h-screen bg-white-bg pt-32 pb-24 flex flex-col items-center justify-center text-center">
//         <div className="w-24 h-24 bg-dark-maroon/10 rounded-full flex items-center justify-center mb-6">
//           <ShoppingBag size={48} className="text-maroon-light" />
//         </div>
//         <h2 className="text-3xl font-serif text-dark-maroon mb-4">Your cart is empty</h2>
//         <p className="text-muted-maroon mb-8 max-w-md">Looks like you haven't added anything to your cart yet. Discover our latest fashion collection.</p>
//         <Link to="/shop">
//           <Button variant="accent" size="lg">Start Shopping</Button>
//         </Link>
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen bg-white-bg pt-24 pb-24">
//       <div className="container mx-auto px-4">
//         <h1 className="text-4xl font-serif text-dark-maroon mb-12">Shopping Cart</h1>

//         <div className="flex flex-col lg:flex-row gap-12">
//           {/* Cart Items */}
//           <div className="lg:w-2/3">
//             <div className="hidden md:grid grid-cols-6 gap-4 pb-4 border-b border-cream-beige/50 text-sm font-medium text-muted-maroon">
//               <div className="col-span-3">Product</div>
//               <div className="col-span-1 text-center">Price</div>
//               <div className="col-span-1 text-center">Quantity</div>
//               <div className="col-span-1 text-right">Total</div>
//             </div>

//             <div className="mt-4 space-y-6">
//               <AnimatePresence>
//                 {cart.map((item, index) => (
//                   <motion.div 
//                     key={`${item.product.id}-${item.variant.id}`}
//                     initial={{ opacity: 0, y: 20 }}
//                     animate={{ opacity: 1, y: 0 }}
//                     exit={{ opacity: 0, scale: 0.95 }}
//                     className="flex flex-col md:grid md:grid-cols-6 gap-4 items-center py-6 border-b border-cream-beige/30"
//                   >
//                     {/* Product Info */}
//                     <div className="col-span-3 flex w-full gap-4">
//                       <Link to={`/product/${item.product.id}`} className="w-24 h-32 flex-shrink-0 rounded-lg overflow-hidden bg-gray-100">
//                         <img 
//                           src={item.variant?.image || item.product.images?.[0]?.image || 'https://via.placeholder.com/100x133'} 
//                           alt={item.product.name}
//                           className="w-full h-full object-cover"
//                         />
//                       </Link>
//                       <div className="flex flex-col justify-center flex-grow">
//                         <Link to={`/product/${item.product.id}`} className="text-lg font-medium text-dark-maroon hover:text-maroon-light transition-colors mb-1 line-clamp-2">
//                           {item.product.name}
//                         </Link>
//                         {item.variant.color && (
//                           <p className="text-sm text-muted-maroon mb-1">Color: {item.variant.color.name}</p>
//                         )}
//                         {item.product.has_sizes && item.variant.size && (
//                           <p className="text-sm text-muted-maroon">Size: {item.variant.size}</p>
//                         )}
//                         <button 
//                           onClick={() => removeFromCart(item.product.id, item.variant.id)}
//                           className="text-maroon-light hover:underline text-sm flex items-center mt-3 md:hidden"
//                         >
//                           <Trash2 size={14} className="mr-1" /> Remove
//                         </button>
//                       </div>
//                     </div>

//                     {/* Price */}
//                     <div className="col-span-1 text-center font-medium w-full md:w-auto flex justify-between md:block">
//                       <span className="md:hidden text-muted-maroon">Price:</span>
//                       ₹{item.product.price}
//                     </div>

//                     {/* Quantity */}
//                     <div className="col-span-1 flex justify-center w-full md:w-auto">
//                       <div className="flex items-center border border-cream-beige rounded-full h-10">
//                         <button 
//                           onClick={() => updateQuantity(item.product.id, item.variant.id, Math.max(1, item.quantity - 1))} 
//                           className="w-8 h-full flex items-center justify-center text-dark-maroon hover:text-maroon-light"
//                         >-</button>
//                         <span className="w-8 text-center text-sm font-medium">{item.quantity}</span>
//                         <button 
//                           onClick={() => updateQuantity(item.product.id, item.variant.id, item.quantity + 1)} 
//                           className="w-8 h-full flex items-center justify-center text-dark-maroon hover:text-maroon-light"
//                         >+</button>
//                       </div>
//                     </div>

//                     {/* Total & Remove */}
//                     <div className="col-span-1 flex justify-between md:justify-end items-center w-full md:w-auto">
//                       <span className="md:hidden text-muted-maroon">Subtotal:</span>
//                       <span className="font-bold text-dark-maroon text-lg">₹{item.product.price * item.quantity}</span>
//                       <button 
//                         onClick={() => removeFromCart(item.product.id, item.variant.id)}
//                         className="text-muted-maroon hover:text-maroon-light transition-colors hidden md:block ml-4"
//                       >
//                         <Trash2 size={18} />
//                       </button>
//                     </div>
//                   </motion.div>
//                 ))}
//               </AnimatePresence>
//             </div>
//           </div>

//           {/* Order Summary */}
//           <div className="lg:w-1/3">
//             <div className="bg-white p-8 rounded-2xl border border-cream-beige/50 shadow-sm sticky top-24">
//               <h3 className="text-xl font-serif font-bold text-dark-maroon mb-6 border-b border-cream-beige/50 pb-4">Order Summary</h3>
              
//               <div className="space-y-4 mb-6 text-dark-maroon">
//                 <div className="flex justify-between">
//                   <span className="text-muted-maroon">Subtotal</span>
//                   <span className="font-medium">₹{subtotal}</span>
//                 </div>
//                 <div className="flex justify-between">
//                   <span className="text-muted-maroon">Shipping Estimate</span>
//                   <span className="font-medium">₹{shipping}</span>
//                 </div>
//                 <div className="border-t border-cream-beige/50 pt-4 flex justify-between items-center">
//                   <span className="text-lg font-bold">Total</span>
//                   <span className="text-2xl font-bold text-maroon-light">₹{total}</span>
//                 </div>
//               </div>

//               <Link to="/checkout" className="w-full">
//                 <Button variant="accent" className="w-full h-14 text-lg">
//                   Buy Now <ArrowRight size={20} className="ml-2" />
//                 </Button>
//               </Link>

//               <div className="mt-6 flex items-center justify-center space-x-4 opacity-50">
//                 <div className="h-8 w-12 bg-gray-200 rounded"></div>
//                 <div className="h-8 w-12 bg-gray-200 rounded"></div>
//                 <div className="h-8 w-12 bg-gray-200 rounded"></div>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };
// import React from 'react';
// import { Link } from 'react-router-dom';
// import { motion, AnimatePresence } from 'framer-motion';
// import { Trash2, ShoppingBag, ArrowRight } from 'lucide-react';
// import { useStore } from '../store/useStore';
// import { Button } from '../components/ui/Button';

// export const Cart = () => {
//   const { cart, removeFromCart, updateQuantity, deliveryConfig } = useStore();

//   const subtotal = cart.reduce((total, item) => total + (item.product.price * item.quantity), 0);
//   const totalQuantity = cart.reduce((total, item) => total + item.quantity, 0);
  
//   const shipping = subtotal > 0 ? (totalQuantity <= 2 ? Number(deliveryConfig.charge_upto_two) : Number(deliveryConfig.charge_more_than_two)) : 0;
//   const total = subtotal + shipping;

//   const getProductImageSrc = (imgObj) => {
//     if (!imgObj) return 'https://via.placeholder.com/100x133';
//     if (typeof imgObj === 'string') return imgObj;
//     return imgObj.image || imgObj.url || imgObj.imageUrl || imgObj.src || 'https://via.placeholder.com/100x133';
//   };

//   if (cart.length === 0) {
//     return (
//       <div className="min-h-screen bg-white-bg pt-32 pb-24 flex flex-col items-center justify-center text-center">
//         <div className="w-24 h-24 bg-dark-maroon/10 rounded-full flex items-center justify-center mb-6">
//           <ShoppingBag size={48} className="text-maroon-light" />
//         </div>
//         <h2 className="text-3xl font-serif text-dark-maroon mb-4">Your cart is empty</h2>
//         <p className="text-muted-maroon mb-8 max-w-md">Looks like you haven't added anything to your cart yet. Discover our latest fashion collection.</p>
//         <Link to="/shop">
//           <Button variant="accent" size="lg">Start Shopping</Button>
//         </Link>
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen bg-white-bg pt-24 pb-24">
//       <div className="container mx-auto px-4">
//         <h1 className="text-4xl font-serif text-dark-maroon mb-12">Shopping Cart</h1>

//         <div className="flex flex-col lg:flex-row gap-12">
//           {/* Cart Items */}
//           <div className="lg:w-2/3">
//             <div className="hidden md:grid grid-cols-6 gap-4 pb-4 border-b border-cream-beige/50 text-sm font-medium text-muted-maroon">
//               <div className="col-span-3">Product</div>
//               <div className="col-span-1 text-center">Price</div>
//               <div className="col-span-1 text-center">Quantity</div>
//               <div className="col-span-1 text-right">Total</div>
//             </div>

//             <div className="mt-4 space-y-6">
//               <AnimatePresence>
//                 {cart.map((item, index) => {
//                   const maxStock = item.variant?.stock !== undefined ? item.variant.stock : (item.product?.stock || 10);
                  
//                   // Extract specific color identity parameters
//                   const itemColorId = item.variant?.color?.id !== undefined ? item.variant.color.id : item.variant?.color;

//                   return (
//                     <motion.div 
//                       key={`${item.product.id}-${item.variant.id}-${itemColorId || 'default'}`}
//                       initial={{ opacity: 0, y: 20 }}
//                       animate={{ opacity: 1, y: 0 }}
//                       exit={{ opacity: 0, scale: 0.95 }}
//                       className="flex flex-col md:grid md:grid-cols-6 gap-4 items-center py-6 border-b border-cream-beige/30"
//                     >
//                       {/* Product Info */}
//                       <div className="col-span-3 flex w-full gap-4">
//                         <Link to={`/product/${item.product.id}`} className="w-24 h-32 flex-shrink-0 rounded-lg overflow-hidden bg-gray-100">
//                           <img 
//                             src={getProductImageSrc(item.variant?.image || item.product.images?.[0])} 
//                             alt={item.product.name}
//                             className="w-full h-full object-cover"
//                           />
//                         </Link>
//                         <div className="flex flex-col justify-center flex-grow">
//                           <Link to={`/product/${item.product.id}`} className="text-lg font-medium text-dark-maroon hover:text-maroon-light transition-colors mb-1 line-clamp-2">
//                             {item.product.name}
//                           </Link>
//                           {item.variant.color && (
//                             <p className="text-sm text-muted-maroon mb-1">Color: {item.variant.color.name}</p>
//                           )}
//                           {item.product.has_sizes && item.variant.size && (
//                             <p className="text-sm text-muted-maroon">Size: {item.variant.size}</p>
//                           )}
//                           <button 
//                             onClick={() => removeFromCart(item.product.id, item.variant.id, item.variant)}
//                             className="text-maroon-light hover:underline text-sm flex items-center mt-3 md:hidden"
//                           >
//                             <Trash2 size={14} className="mr-1" /> Remove
//                           </button>
//                         </div>
//                       </div>

//                       {/* Price */}
//                       <div className="col-span-1 text-center font-medium w-full md:w-auto flex justify-between md:block">
//                         <span className="md:hidden text-muted-maroon">Price:</span>
//                         ₹{item.product.price}
//                       </div>

//                       {/* Quantity */}
//                       <div className="col-span-1 flex justify-center w-full md:w-auto">
//                         <div className="flex items-center border border-cream-beige rounded-full h-10 bg-white">
//                           <button 
//                             onClick={() => updateQuantity(item.product.id, item.variant.id, Math.max(1, item.quantity - 1), item.variant)} 
//                             className="w-8 h-full flex items-center justify-center text-dark-maroon hover:text-maroon-light select-none"
//                           >
//                             -
//                           </button>
//                           <span className="w-8 text-center text-sm font-medium select-none">{item.quantity}</span>
//                           <button 
//                             onClick={() => {
//                               if (item.quantity < maxStock) {
//                                 updateQuantity(item.product.id, item.variant.id, item.quantity + 1, item.variant);
//                               }
//                             }} 
//                             className={`w-8 h-full flex items-center justify-center text-dark-maroon select-none
//                               ${item.quantity >= maxStock ? 'text-gray-300 cursor-not-allowed' : 'hover:text-maroon-light'}`}
//                             disabled={item.quantity >= maxStock}
//                           >
//                             +
//                           </button>
//                         </div>
//                       </div>

//                       {/* Total & Remove */}
//                       <div className="col-span-1 flex justify-between md:justify-end items-center w-full md:w-auto">
//                         <span className="md:hidden text-muted-maroon">Subtotal:</span>
//                         <span className="font-bold text-dark-maroon text-lg">₹{item.product.price * item.quantity}</span>
//                         <button 
//                           onClick={() => removeFromCart(item.product.id, item.variant.id, item.variant)}
//                           className="text-muted-maroon hover:text-maroon-light transition-colors hidden md:block ml-4"
//                         >
//                           <Trash2 size={18} />
//                         </button>
//                       </div>
//                     </motion.div>
//                   );
//                 })}
//               </AnimatePresence>
//             </div>
//           </div>

//           {/* Order Summary */}
//           <div className="lg:w-1/3">
//             <div className="bg-white p-8 rounded-2xl border border-cream-beige/50 shadow-sm sticky top-24">
//               <h3 className="text-xl font-serif font-bold text-dark-maroon mb-6 border-b border-cream-beige/50 pb-4">Order Summary</h3>
              
//               <div className="space-y-4 mb-6 text-dark-maroon">
//                 <div className="flex justify-between">
//                   <span className="text-muted-maroon">Subtotal</span>
//                   <span className="font-medium">₹{subtotal}</span>
//                 </div>
//                 <div className="flex justify-between">
//                   <span className="text-muted-maroon">Shipping Estimate</span>
//                   <span className="font-medium">₹{shipping}</span>
//                 </div>
//                 <div className="border-t border-cream-beige/50 pt-4 flex justify-between items-center">
//                   <span className="text-lg font-bold">Total</span>
//                   <span className="text-2xl font-bold text-maroon-light">₹{total}</span>
//                 </div>
//               </div>

//               <Link to="/checkout" className="w-full">
//                 <Button variant="accent" className="w-full h-14 text-lg">
//                   Buy Now <ArrowRight size={20} className="ml-2" />
//                 </Button>
//               </Link>

//               <div className="mt-6 flex items-center justify-center space-x-4 opacity-50">
//                 <div className="h-8 w-12 bg-gray-200 rounded"></div>
//                 <div className="h-8 w-12 bg-gray-200 rounded"></div>
//                 <div className="h-8 w-12 bg-gray-200 rounded"></div>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };
import React from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Trash2, ShoppingBag, ArrowRight } from 'lucide-react';
import { useStore } from '../store/useStore';
import { Button } from '../components/ui/Button';

export const Cart = () => {
  const { cart, removeFromCart, updateQuantity, deliveryConfig } = useStore();

  const subtotal = cart.reduce((total, item) => total + (item.product.price * item.quantity), 0);
  const totalQuantity = cart.reduce((total, item) => total + item.quantity, 0);
  
  const shipping = subtotal > 0 ? (totalQuantity <= 2 ? Number(deliveryConfig.charge_upto_two) : Number(deliveryConfig.charge_more_than_two)) : 0;
  const total = subtotal + shipping;

  const getProductImageSrc = (imgObj) => {
    if (!imgObj) return 'https://via.placeholder.com/100x133';
    if (typeof imgObj === 'string') return imgObj;
    return imgObj.image || imgObj.url || imgObj.imageUrl || imgObj.src || 'https://via.placeholder.com/100x133';
  };

  if (cart.length === 0) {
    return (
      <div className="min-h-screen bg-white-bg pt-32 pb-24 flex flex-col items-center justify-center text-center">
        <div className="w-24 h-24 bg-dark-maroon/10 rounded-full flex items-center justify-center mb-6">
          <ShoppingBag size={48} className="text-maroon-light" />
        </div>
        <h2 className="text-3xl font-serif text-dark-maroon mb-4">Your cart is empty</h2>
        <p className="text-muted-maroon mb-8 max-w-md">Looks like you haven't added anything to your cart yet. Discover our latest fashion collection.</p>
        <Link to="/shop">
          <Button variant="accent" size="lg">Start Shopping</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white-bg pt-24 pb-24">
      <div className="container mx-auto px-4">
        <h1 className="text-4xl font-serif text-dark-maroon mb-12">Shopping Cart</h1>

        <div className="flex flex-col lg:flex-row gap-12">
          {/* Cart Items */}
          <div className="lg:w-2/3">
            <div className="hidden md:grid grid-cols-6 gap-4 pb-4 border-b border-cream-beige/50 text-sm font-medium text-muted-maroon">
              <div className="col-span-3">Product</div>
              <div className="col-span-1 text-center">Price</div>
              <div className="col-span-1 text-center">Quantity</div>
              <div className="col-span-1 text-right">Total</div>
            </div>

            <div className="mt-4 space-y-6">
              <AnimatePresence>
                {cart.map((item, index) => {
                  const maxStock = item.variant?.stock !== undefined ? item.variant.stock : (item.product?.stock || 10);
                  
                  // Extract specific color identity parameters
                  const itemColorId = item.variant?.color?.id !== undefined ? item.variant.color.id : item.variant?.color;

                  return (
                    <motion.div 
                      key={`${item.product.id}-${item.variant.id}-${itemColorId || 'default'}`}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      className="flex flex-col md:grid md:grid-cols-6 gap-4 items-center py-6 border-b border-cream-beige/30"
                    >
                      {/* Product Info */}
                      <div className="col-span-3 flex w-full gap-4">
                        <Link to={`/product/${item.product.id}`} className="w-24 h-32 flex-shrink-0 rounded-lg overflow-hidden bg-gray-100">
                          <img 
                            src={getProductImageSrc(item.variant?.image || item.product.images?.[0])} 
                            alt={item.product.name}
                            className="w-full h-full object-cover"
                          />
                        </Link>
                        <div className="flex flex-col justify-center flex-grow">
                          <Link to={`/product/${item.product.id}`} className="text-lg font-medium text-dark-maroon hover:text-maroon-light transition-colors mb-1 line-clamp-2">
                            {item.product.name}
                          </Link>
                          {item.variant.color && (
                            <p className="text-sm text-muted-maroon mb-1">Color: {item.variant.color.name}</p>
                          )}
                          {item.product.has_sizes && item.variant.size && (
                            <p className="text-sm text-muted-maroon">Size: {item.variant.size}</p>
                          )}
                          <button 
                            onClick={() => removeFromCart(item.product.id, item.variant.id, item.variant)}
                            className="text-maroon-light hover:underline text-sm flex items-center mt-3 md:hidden"
                          >
                            <Trash2 size={14} className="mr-1" /> Remove
                          </button>
                        </div>
                      </div>

                      {/* Price */}
                      <div className="col-span-1 text-center font-medium w-full md:w-auto flex justify-between md:block">
                        <span className="md:hidden text-muted-maroon">Price:</span>
                        ₹{item.product.price}
                      </div>

                      {/* Quantity */}
                      <div className="col-span-1 flex justify-center w-full md:w-auto">
                        <div className="flex items-center border border-cream-beige rounded-full h-10 bg-white">
                          <button 
                            onClick={() => updateQuantity(item.product.id, item.variant.id, Math.max(1, item.quantity - 1), item.variant)} 
                            className="w-8 h-full flex items-center justify-center text-dark-maroon hover:text-maroon-light select-none"
                          >
                            -
                          </button>
                          <span className="w-8 text-center text-sm font-medium select-none">{item.quantity}</span>
                          <button 
                            onClick={() => {
                              if (item.quantity < maxStock) {
                                updateQuantity(item.product.id, item.variant.id, item.quantity + 1, item.variant);
                              }
                            }} 
                            className={`w-8 h-full flex items-center justify-center text-dark-maroon select-none
                              ${item.quantity >= maxStock ? 'text-gray-300 cursor-not-allowed' : 'hover:text-maroon-light'}`}
                            disabled={item.quantity >= maxStock}
                          >
                            +
                          </button>
                        </div>
                      </div>

                      {/* Total & Remove */}
                      <div className="col-span-1 flex justify-between md:justify-end items-center w-full md:w-auto">
                        <span className="md:hidden text-muted-maroon">Subtotal:</span>
                        <span className="font-bold text-dark-maroon text-lg">₹{item.product.price * item.quantity}</span>
                        <button 
                          onClick={() => removeFromCart(item.product.id, item.variant.id, item.variant)}
                          className="text-muted-maroon hover:text-maroon-light transition-colors hidden md:block ml-4"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </motion.div>
                  );
                })}
              </AnimatePresence>
            </div>
          </div>

          {/* Order Summary */}
          <div className="lg:w-1/3">
            <div className="bg-white p-8 rounded-2xl border border-cream-beige/50 shadow-sm sticky top-24">
              <h3 className="text-xl font-serif font-bold text-dark-maroon mb-6 border-b border-cream-beige/50 pb-4">Order Summary</h3>
              
              <div className="space-y-4 mb-6 text-dark-maroon">
                <div className="flex justify-between">
                  <span className="text-muted-maroon">Subtotal</span>
                  <span className="font-medium">₹{subtotal}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-maroon">Shipping Estimate</span>
                  <span className="font-medium">₹{shipping}</span>
                </div>
                <div className="border-t border-cream-beige/50 pt-4 flex justify-between items-center">
                  <span className="text-lg font-bold">Total</span>
                  <span className="text-2xl font-bold text-maroon-light">₹{total}</span>
                </div>
              </div>

              <Link to="/checkout" className="w-full">
                <Button variant="accent" className="w-full h-14 text-lg">
                  Buy Now <ArrowRight size={20} className="ml-2" />
                </Button>
              </Link>

              <div className="mt-6 flex items-center justify-center space-x-4 opacity-50">
                <div className="h-8 w-12 bg-gray-200 rounded"></div>
                <div className="h-8 w-12 bg-gray-200 rounded"></div>
                <div className="h-8 w-12 bg-gray-200 rounded"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
