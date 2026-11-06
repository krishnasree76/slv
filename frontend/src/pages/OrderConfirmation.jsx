// import React from 'react';
// import { useLocation, Link, Navigate } from 'react-router-dom';
// import { CheckCircle2 } from 'lucide-react';
// import { Button } from '../components/ui/Button';

// export const OrderConfirmation = () => {
//   const location = useLocation();
//   const state = location.state;

//   if (!state || !state.order_number) {
//     return <Navigate to="/" replace />;
//   }

//   const { order_number, cart, totalAmount } = state;

//   return (
//     <div className="min-h-screen bg-white-bg pt-32 pb-24 flex items-center justify-center px-4">
//       <div className="bg-white p-8 md:p-12 rounded-2xl shadow-lg border border-cream-beige/30 w-full max-w-2xl text-center">
//         <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
//           <CheckCircle2 size={40} className="text-green-600" />
//         </div>
        
//         <h1 className="text-4xl font-serif text-dark-maroon mb-2">Order Confirmed!</h1>
//         <p className="text-muted-maroon mb-8">
//           Thank you for your purchase. Your payment was successful and your order has been confirmed.
//         </p>

//         <div className="bg-light-beige/50 p-6 rounded-xl border border-cream-beige/50 text-left mb-8">
//           <div className="flex justify-between items-center border-b border-cream-beige pb-4 mb-4">
//             <div>
//               <p className="text-sm text-muted-maroon font-medium uppercase tracking-wider">Order Number</p>
//               <p className="text-lg font-bold text-dark-maroon font-mono">#{order_number}</p>
//             </div>
//             <div className="text-right">
//               <span className="bg-green-100 text-green-800 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wide">
//                 Confirmed
//               </span>
//             </div>
//           </div>

//           <h3 className="font-bold text-dark-maroon mb-4">Order Summary</h3>
//           <div className="space-y-4 mb-6">
//             {cart.map((item, index) => (
//               <div key={index} className="flex justify-between items-center">
//                 <div className="flex items-center gap-4">
//                   <div className="w-12 h-16 bg-white rounded-md overflow-hidden flex-shrink-0 border border-cream-beige/50">
//                     <img 
//                       src={item.product.images?.[0]?.image || 'https://via.placeholder.com/100x133'} 
//                       alt={item.product.name}
//                       className="w-full h-full object-cover"
//                     />
//                   </div>
//                   <div>
//                     <p className="font-medium text-dark-maroon line-clamp-1">{item.product.name}</p>
//                     <p className="text-sm text-muted-maroon">
//                       Qty: {item.quantity} 
//                       {item.variant.size && ` | Size: ${item.variant.size}`}
//                       {item.variant.color && ` | Color: ${item.variant.color.name}`}
//                     </p>
//                   </div>
//                 </div>
//                 <div className="font-medium text-dark-maroon">
//                   ₹{item.product.price * item.quantity}
//                 </div>
//               </div>
//             ))}
//           </div>

//           <div className="border-t border-cream-beige pt-4 flex justify-between items-center">
//             <span className="font-bold text-dark-maroon">Total Paid</span>
//             <span className="text-xl font-bold text-maroon-light">₹{totalAmount}</span>
//           </div>
//         </div>

//         <div className="flex flex-col sm:flex-row gap-4 justify-center">
//           <Link to="/profile">
//             <Button variant="outline" className="w-full sm:w-auto">View Order History</Button>
//           </Link>
//           <Link to="/shop">
//             <Button variant="accent" className="w-full sm:w-auto">Continue Shopping</Button>
//           </Link>
//         </div>
//       </div>
//     </div>
//   );
// };
import React from 'react';
import { useLocation, Link, Navigate } from 'react-router-dom';
import { CheckCircle2 } from 'lucide-react';
import { Button } from '../components/ui/Button';

export const OrderConfirmation = () => {
  const location = useLocation();
  const state = location.state;

  if (!state || !state.order_number) {
    return <Navigate to="/" replace />;
  }

  const { order_number, cart, totalAmount } = state;

  // Safe normalized fallback sequence matching deep variants vs root arrays
  const getProductImageSrc = (imgObj) => {
    if (!imgObj) return 'https://via.placeholder.com/100x133';
    if (typeof imgObj === 'string') return imgObj;
    return imgObj.image || imgObj.url || imgObj.imageUrl || imgObj.src || 'https://via.placeholder.com/100x133';
  };

  return (
    <div className="min-h-screen bg-white-bg pt-32 pb-24 flex items-center justify-center px-4">
      <div className="bg-white p-8 md:p-12 rounded-2xl shadow-lg border border-cream-beige/30 w-full max-w-2xl text-center">
        <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <CheckCircle2 size={40} className="text-green-600" />
        </div>
        
        <h1 className="text-4xl font-serif text-dark-maroon mb-2">Order Confirmed!</h1>
        <p className="text-muted-maroon mb-8">
          Thank you for your purchase. Your payment was successful and your order has been confirmed.
        </p>

        <div className="bg-light-beige/50 p-6 rounded-xl border border-cream-beige/50 text-left mb-8">
          <div className="flex justify-between items-center border-b border-cream-beige pb-4 mb-4">
            <div>
              <p className="text-sm text-muted-maroon font-medium uppercase tracking-wider">Order Number</p>
              <p className="text-lg font-bold text-dark-maroon font-mono">#{order_number}</p>
            </div>
            <div className="text-right">
              <span className="bg-green-100 text-green-800 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wide">
                Confirmed
              </span>
            </div>
          </div>

          <h3 className="font-bold text-dark-maroon mb-4">Order Summary</h3>
          <div className="space-y-4 mb-6">
            {cart.map((item, index) => (
              <div key={index} className="flex justify-between items-center">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-16 bg-white rounded-md overflow-hidden flex-shrink-0 border border-cream-beige/50">
                    <img 
                      // FIX: Prioritize the specific variant image passed over the generic product images array
                      src={getProductImageSrc(item.variant?.image || item.product.images?.[0])} 
                      alt={item.product.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div>
                    <p className="font-medium text-dark-maroon line-clamp-1">{item.product.name}</p>
                    <p className="text-sm text-muted-maroon">
                      Qty: {item.quantity} 
                      {item.variant?.size && ` | Size: ${item.variant.size}`}
                      {item.variant?.color?.name && ` | Color: ${item.variant.color.name}`}
                    </p>
                  </div>
                </div>
                <div className="font-medium text-dark-maroon">
                  ₹{item.product.price * item.quantity}
                </div>
              </div>
            ))}
          </div>

          <div className="border-t border-cream-beige pt-4 flex justify-between items-center">
            <span className="font-bold text-dark-maroon">Total Paid</span>
            <span className="text-xl font-bold text-maroon-light">₹{totalAmount}</span>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link to="/profile">
            <Button variant="outline" className="w-full sm:w-auto">View Order History</Button>
          </Link>
          <Link to="/shop">
            <Button variant="accent" className="w-full sm:w-auto">Continue Shopping</Button>
          </Link>
        </div>
      </div>
    </div>
  );
};
