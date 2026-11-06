import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useStore } from '../store/useStore';
import { Button } from '../components/ui/Button';
import { userService } from '../services/userService';
import { orderService } from '../services/orderService';

export const Checkout = () => {
  const { cart, user, token, clearCart, deliveryConfig } = useStore();
  const navigate = useNavigate();
  const location = useLocation();
  
  const [addresses, setAddresses] = useState([]);
  const [selectedAddressId, setSelectedAddressId] = useState(null);
  
  const [addressForm, setAddressForm] = useState({
    name: user?.name || '',
    phone: '',
    street: '',
    city: '',
    state: '',
    pincode: ''
  });
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [paymentComplete, setPaymentComplete] = useState(false);

  // 1. Determine active checkout items (Buy Now single item VS Full Cart)
  const checkoutItems = location.state?.buyNowItem ? [location.state.buyNowItem] : cart;

  // 2. Compute calculations based on active checkout items only
  const subtotal = checkoutItems.reduce((total, item) => total + (item.product.price * item.quantity), 0);
  const totalQuantity = checkoutItems.reduce((total, item) => total + item.quantity, 0);
  
  const shipping = subtotal > 0 ? (totalQuantity <= 2 ? Number(deliveryConfig.charge_upto_two) : Number(deliveryConfig.charge_more_than_two)) : 0;
  const totalAmount = subtotal + shipping;

  useEffect(() => {
    // Redirect if there is neither a buy now item nor items in the cart
    if (checkoutItems.length === 0 && !paymentComplete) {
      navigate('/cart');
    }
    
    if (token) {
      userService.getAddresses(token)
        .then(data => {
          if (Array.isArray(data)) {
            setAddresses(data);
            const defaultAddress = data.find(a => a.is_default);
            if (defaultAddress) {
              setSelectedAddressId(defaultAddress.id);
            } else if (data.length > 0) {
              setSelectedAddressId(data[0].id);
            }
          }
        })
        .catch(err => console.error(err));
    }
  }, [token, checkoutItems.length, navigate, paymentComplete]);

  const loadRazorpayScript = () => {
    return new Promise((resolve) => {
      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const handleCheckout = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    let finalAddress = null;

    try {
      if (selectedAddressId && selectedAddressId !== 'new') {
        finalAddress = addresses.find(a => a.id === selectedAddressId);
      } else {
        if (!addressForm.name || !addressForm.phone || !addressForm.street || !addressForm.city || !addressForm.state || !addressForm.pincode) {
          throw new Error('Please fill in all address fields.');
        }
        
        finalAddress = {
          name: addressForm.name,
          phone: addressForm.phone,
          address: addressForm.street,
          city: addressForm.city,
          state: addressForm.state,
          pincode: addressForm.pincode
        };

        if (token) {
          await userService.addAddress(token, {
            ...addressForm,
            is_default: addresses.length === 0
          });
        }
      }

      const items = checkoutItems.map(item => ({
        variant: item.variant.id,
        quantity: item.quantity
      }));

      const orderPayload = {
        name: finalAddress.name,
        phone: finalAddress.phone,
        address: finalAddress.street || finalAddress.address,
        city: finalAddress.city,
        state: finalAddress.state,
        pincode: finalAddress.pincode,
        items: items
      };

      const orderData = await orderService.createOrder(orderPayload, token);

      const res = await loadRazorpayScript();
      if (!res) {
        throw new Error('Razorpay SDK failed to load. Please check your internet connection.');
      }

      const options = {
        key: orderData.key,
        amount: orderData.amount,
        currency: 'INR',
        name: 'Sri Laxmi Venkateshwara Selections',
        description: 'Order Payment',
        order_id: orderData.razorpay_order_id,
        handler: async function (response) {
          try {
            const verifyRes = await orderService.verifyPayment({
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature
            }, token);
            
            setPaymentComplete(true);
            
            // Only clear the cart if it was a normal cart checkout
            if (!location.state?.buyNowItem) {
              clearCart();
            }
            
            navigate('/order-confirmation', { 
              state: { 
                order_number: verifyRes.order_number || response.razorpay_order_id, 
                cart: [...checkoutItems], 
                totalAmount 
              } 
            });
          } catch (err) {
            setError(err.message || 'Payment verification failed');
          }
        },
        prefill: {
          name: finalAddress.name,
          email: user?.email || '',
          contact: finalAddress.phone
        },
        theme: {
          color: '#55236F'
        }
      };

      const paymentObject = new window.Razorpay(options);
      paymentObject.open();

    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FAF7F0] pt-28 pb-24">
      <div className="container mx-auto px-4 max-w-5xl">
        <h1 className="text-3xl sm:text-4xl font-serif text-[#3B144E] mb-8">Checkout</h1>
        
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-xl mb-6 text-sm">
            {error}
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Shipping Address Inputs */}
          <div className="lg:col-span-2">
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-[#E5DACB] mb-6">
              <h3 className="text-xl font-serif font-bold text-[#3B144E] mb-6">Delivery Address</h3>
              
              {addresses.length > 0 && (
                <div className="mb-6 space-y-3">
                  {addresses.map(addr => (
                    <div 
                      key={addr.id} 
                      className={`p-4 border rounded-xl cursor-pointer transition-all ${selectedAddressId === addr.id ? 'border-[#55236F] bg-[#55236F]/5 shadow-sm' : 'border-[#E5DACB] hover:border-[#C6A15B]'}`}
                      onClick={() => setSelectedAddressId(addr.id)}
                    >
                      <div className="flex items-center gap-2">
                        <input type="radio" checked={selectedAddressId === addr.id} readOnly className="text-[#55236F] focus:ring-[#55236F]" />
                        <span className="font-bold text-[#3B144E]">{addr.name}</span>
                        {addr.is_default && <span className="text-[10px] bg-[#55236F] text-white px-2 py-0.5 rounded-full uppercase tracking-wider font-semibold">Default</span>}
                      </div>
                      <p className="text-sm text-[#685A6E] ml-6 mt-1">{addr.street}, {addr.city}, {addr.state} - {addr.pincode}</p>
                    </div>
                  ))}
                  
                  <div 
                    className={`p-4 border rounded-xl cursor-pointer transition-all ${selectedAddressId === 'new' ? 'border-[#55236F] bg-[#55236F]/5' : 'border-[#E5DACB]'}`}
                    onClick={() => setSelectedAddressId('new')}
                  >
                    <div className="flex items-center gap-2">
                      <input type="radio" checked={selectedAddressId === 'new'} readOnly className="text-[#55236F] focus:ring-[#55236F]" />
                      <span className="font-semibold text-[#3B144E]">Use a New Address</span>
                    </div>
                  </div>
                </div>
              )}

              {(!addresses.length || selectedAddressId === 'new') && (
                <form className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-[#3B144E] mb-1">Full Name</label>
                      <input required type="text" value={addressForm.name} onChange={e => setAddressForm({...addressForm, name: e.target.value})} className="w-full px-3.5 py-2.5 border border-[#E5DACB] rounded-xl focus:border-[#55236F] outline-none" placeholder="Recipient Name" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-[#3B144E] mb-1">Phone Number</label>
                      <input required type="tel" value={addressForm.phone} onChange={e => setAddressForm({...addressForm, phone: e.target.value})} className="w-full px-3.5 py-2.5 border border-[#E5DACB] rounded-xl focus:border-[#55236F] outline-none" placeholder="10-digit mobile" />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-[#3B144E] mb-1">Street Address</label>
                    <input required type="text" value={addressForm.street} onChange={e => setAddressForm({...addressForm, street: e.target.value})} className="w-full px-3.5 py-2.5 border border-[#E5DACB] rounded-xl focus:border-[#55236F] outline-none" placeholder="House no., street, locality" />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-[#3B144E] mb-1">City</label>
                      <input required type="text" value={addressForm.city} onChange={e => setAddressForm({...addressForm, city: e.target.value})} className="w-full px-3.5 py-2.5 border border-[#E5DACB] rounded-xl focus:border-[#55236F] outline-none" placeholder="City" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-[#3B144E] mb-1">State</label>
                      <input required type="text" value={addressForm.state} onChange={e => setAddressForm({...addressForm, state: e.target.value})} className="w-full px-3.5 py-2.5 border border-[#E5DACB] rounded-xl focus:border-[#55236F] outline-none" placeholder="State" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-[#3B144E] mb-1">PIN Code</label>
                      <input required type="text" value={addressForm.pincode} onChange={e => setAddressForm({...addressForm, pincode: e.target.value})} className="w-full px-3.5 py-2.5 border border-[#E5DACB] rounded-xl focus:border-[#55236F] outline-none" placeholder="PIN Code" />
                    </div>
                  </div>
                </form>
              )}
            </div>
          </div>

          {/* Detailed Order Summary Box */}
          <div className="lg:col-span-1">
            <div className="bg-white p-6 rounded-2xl border border-[#E5DACB] shadow-sm sticky top-28">
              <h3 className="text-xl font-serif font-bold text-[#3B144E] mb-4 border-b border-[#E5DACB] pb-4">Order Summary</h3>
              
              <div className="max-h-64 overflow-y-auto mb-6 divide-y divide-[#E5DACB]/50 pr-1">
                {checkoutItems.map((item) => (
                  <div key={`${item.product.id}-${item.variant.id}`} className="flex gap-3 py-3 first:pt-0 last:pb-0">
                    <div className="w-16 h-20 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0 border border-[#E5DACB]/60">
                      <img 
                        src={item.variant?.image || item.product.images?.[0]?.image || 'https://via.placeholder.com/100x133'} 
                        alt={item.product.name} 
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex-grow flex flex-col justify-between min-w-0">
                      <div>
                        <h4 className="text-sm font-medium text-[#3B144E] truncate">{item.product.name}</h4>
                        <div className="text-xs text-[#685A6E] mt-0.5 space-y-0.5">
                          {item.variant.color && <p>Color: {item.variant.color.name}</p>}
                          {item.product.has_sizes && item.variant.size && <p>Size: {item.variant.size}</p>}
                        </div>
                      </div>
                      <div className="flex justify-between items-end text-xs">
                        <span className="text-[#685A6E]">Qty: {item.quantity}</span>
                        <span className="font-semibold text-[#3B144E]">₹{item.product.price * item.quantity}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="space-y-3 mb-6 text-[#3B144E] border-t border-[#E5DACB] pt-4">
                <div className="flex justify-between text-sm">
                  <span className="text-[#685A6E]">Subtotal</span>
                  <span className="font-medium">₹{subtotal}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-[#685A6E]">Delivery Charge</span>
                  <span className="font-medium">₹{shipping}</span>
                </div>
                <div className="border-t border-[#E5DACB] pt-3 flex justify-between items-center">
                  <span className="text-base font-bold">Total Payable</span>
                  <span className="text-2xl font-bold text-[#55236F]">₹{totalAmount}</span>
                </div>
              </div>

              <Button 
                variant="primary" 
                className="w-full h-12 text-base font-semibold" 
                onClick={handleCheckout} 
                disabled={loading}
              >
                {loading ? 'Processing...' : `Pay ₹${totalAmount}`}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
