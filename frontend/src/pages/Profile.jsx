import React, { useState, useEffect } from 'react';
import { useStore } from '../store/useStore';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '../components/ui/Button';
import { userService } from '../services/userService';

// Dummy Wishlist since we removed it from Profile but routing might still expect it
export const Wishlist = () => {
  const navigate = useNavigate();
  useEffect(() => { navigate('/profile'); }, [navigate]);
  return null;
};

export const Profile = () => {
  const { user, token, logout } = useStore();
  const navigate = useNavigate();
  
  const [activeTab, setActiveTab] = useState('orders');
  const [orders, setOrders] = useState([]);
  const [addresses, setAddresses] = useState([]);
  const [loading, setLoading] = useState(true);

  // Address Form State
  const [isEditingAddress, setIsEditingAddress] = useState(false);
  const [currentAddress, setCurrentAddress] = useState(null);
  const [addressForm, setAddressForm] = useState({
    name: '', phone: '', street: '', city: '', state: '', pincode: '', is_default: false
  });

  useEffect(() => {
    if (!token) {
      navigate('/auth');
      return;
    }
    fetchData();
  }, [token]);

  const fetchData = async () => {
    setLoading(true);
    try {
      if (activeTab === 'orders') {
        const data = await userService.getOrders(token);
        setOrders(data);
      } else if (activeTab === 'addresses') {
        const data = await userService.getAddresses(token);
        setAddresses(data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token) fetchData();
  }, [activeTab]);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const handleAddressSubmit = async (e) => {
    e.preventDefault();
    try {
      if (currentAddress) {
        await userService.updateAddress(token, currentAddress.id, addressForm);
      } else {
        await userService.addAddress(token, addressForm);
      }
      setIsEditingAddress(false);
      fetchData();
    } catch (err) {
      console.error(err);
    }
  };

  const editAddress = (address) => {
    setCurrentAddress(address);
    setAddressForm({
      name: address.name, phone: address.phone, street: address.street,
      city: address.city, state: address.state, pincode: address.pincode,
      is_default: address.is_default
    });
    setIsEditingAddress(true);
  };

  const deleteAddress = async (id) => {
    try {
      await userService.deleteAddress(token, id);
      fetchData();
    } catch (err) {
      console.error(err);
    }
  };

  const getStatusColor = (status) => {
    switch(status) {
      case 'processed': return 'bg-blue-100 text-blue-700';
      case 'confirmed': return 'bg-yellow-100 text-yellow-700';
      case 'shipped': return 'bg-purple-100 text-purple-700';
      case 'delivered': return 'bg-green-100 text-green-700';
      case 'cancelled': return 'bg-red-100 text-red-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  if (!user) return null;

  return (
    <div className="min-h-screen bg-white-bg pt-32 pb-24">
      <div className="container mx-auto px-4 max-w-5xl">
        <h1 className="text-4xl font-serif text-dark-maroon mb-12">My Account</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="md:col-span-1 bg-white p-6 rounded-2xl shadow-sm border border-cream-beige/30 h-fit">
            <div className="text-center border-b border-cream-beige/50 pb-6 mb-6">
              <div className="w-20 h-20 bg-dark-maroon/20 rounded-full mx-auto mb-4 flex items-center justify-center text-2xl font-bold text-dark-maroon">
                {user?.name?.charAt(0) || user?.email?.charAt(0)}
              </div>
              <h2 className="text-xl font-bold text-dark-maroon">{user?.name}</h2>
              <p className="text-muted-maroon text-sm break-all">{user?.email}</p>
            </div>
            <ul className="space-y-4">
              <li>
                <button 
                  onClick={() => setActiveTab('orders')} 
                  className={`flex items-center w-full ${activeTab === 'orders' ? 'text-maroon-light font-medium' : 'text-muted-maroon hover:text-maroon-light'}`}
                >
                  📦 My Orders
                </button>
              </li>
              <li>
                <button 
                  onClick={() => setActiveTab('addresses')} 
                  className={`flex items-center w-full ${activeTab === 'addresses' ? 'text-maroon-light font-medium' : 'text-muted-maroon hover:text-maroon-light'}`}
                >
                  📍 Addresses
                </button>
              </li>
              <li>
                <button onClick={handleLogout} className="text-maroon-light hover:underline flex items-center mt-6 w-full">
                  Log out
                </button>
              </li>
            </ul>
          </div>
          
          <div className="md:col-span-3">
            {activeTab === 'orders' && (
              <div>
                <h3 className="text-2xl font-serif text-dark-maroon mb-6">Recent Orders</h3>
                {loading ? (
                  <p>Loading orders...</p>
                ) : orders.length === 0 ? (
                  <p className="text-muted-maroon">You have no orders yet.</p>
                ) : (
                  <div className="bg-white rounded-2xl shadow-sm border border-cream-beige/30 overflow-hidden">
                    {orders.map(order => (
                      <div key={order.id} className="p-6 border-b border-cream-beige/30 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                        <div>
                          <p className="text-sm text-muted-maroon font-mono">Order #{order.order_number}</p>
                          <p className="font-bold text-dark-maroon">
                            ₹{order.total_amount} 
                            <span className={`font-normal text-xs ml-3 px-2 py-1 rounded-full uppercase tracking-wider ${getStatusColor(order.status)}`}>
                              {order.status}
                            </span>
                          </p>
                          <div className="mt-2 space-y-1">
                            {order.items?.map((item, i) => (
                              <p key={i} className="text-sm text-dark-maroon">
                                {item.quantity}x {item.variant_name}
                              </p>
                            ))}
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-sm text-muted-maroon mb-2">{new Date(order.created_at).toLocaleDateString()}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {activeTab === 'addresses' && (
              <div>
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-2xl font-serif text-dark-maroon">My Addresses</h3>
                  {!isEditingAddress && (
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={() => {
                        setCurrentAddress(null);
                        setAddressForm({ name: '', phone: '', street: '', city: '', state: '', pincode: '', is_default: false });
                        setIsEditingAddress(true);
                      }}
                    >
                      + Add New
                    </Button>
                  )}
                </div>

                {isEditingAddress ? (
                  <div className="bg-white p-6 rounded-2xl shadow-sm border border-cream-beige/30">
                    <h4 className="text-lg font-bold text-dark-maroon mb-4">{currentAddress ? 'Edit Address' : 'Add New Address'}</h4>
                    <form onSubmit={handleAddressSubmit} className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm text-dark-maroon mb-1">Name</label>
                          <input required type="text" value={addressForm.name} onChange={(e) => setAddressForm({...addressForm, name: e.target.value})} className="w-full px-3 py-2 border rounded-lg" />
                        </div>
                        <div>
                          <label className="block text-sm text-dark-maroon mb-1">Phone</label>
                          <input required type="text" value={addressForm.phone} onChange={(e) => setAddressForm({...addressForm, phone: e.target.value})} className="w-full px-3 py-2 border rounded-lg" />
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm text-dark-maroon mb-1">Street Address</label>
                        <input required type="text" value={addressForm.street} onChange={(e) => setAddressForm({...addressForm, street: e.target.value})} className="w-full px-3 py-2 border rounded-lg" />
                      </div>
                      <div className="grid grid-cols-3 gap-4">
                        <div>
                          <label className="block text-sm text-dark-maroon mb-1">City</label>
                          <input required type="text" value={addressForm.city} onChange={(e) => setAddressForm({...addressForm, city: e.target.value})} className="w-full px-3 py-2 border rounded-lg" />
                        </div>
                        <div>
                          <label className="block text-sm text-dark-maroon mb-1">State</label>
                          <input required type="text" value={addressForm.state} onChange={(e) => setAddressForm({...addressForm, state: e.target.value})} className="w-full px-3 py-2 border rounded-lg" />
                        </div>
                        <div>
                          <label className="block text-sm text-dark-maroon mb-1">PIN Code</label>
                          <input required type="text" value={addressForm.pincode} onChange={(e) => setAddressForm({...addressForm, pincode: e.target.value})} className="w-full px-3 py-2 border rounded-lg" />
                        </div>
                      </div>
                      <div className="flex items-center mt-2">
                        <input type="checkbox" checked={addressForm.is_default} onChange={(e) => setAddressForm({...addressForm, is_default: e.target.checked})} className="mr-2" id="is_default" />
                        <label htmlFor="is_default" className="text-sm text-dark-maroon">Set as default address</label>
                      </div>
                      <div className="flex gap-4 mt-6">
                        <Button type="submit" variant="accent">Save Address</Button>
                        <Button type="button" variant="outline" onClick={() => setIsEditingAddress(false)}>Cancel</Button>
                      </div>
                    </form>
                  </div>
                ) : loading ? (
                  <p>Loading addresses...</p>
                ) : addresses.length === 0 ? (
                  <p className="text-muted-maroon">You have no saved addresses.</p>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {addresses.map(address => (
                      <div key={address.id} className="bg-white p-6 rounded-2xl shadow-sm border border-cream-beige/30 relative">
                        {address.is_default && <span className="absolute top-4 right-4 bg-maroon-light text-white text-xs px-2 py-1 rounded">Default</span>}
                        <h4 className="font-bold text-dark-maroon mb-1">{address.name}</h4>
                        <p className="text-sm text-muted-maroon mb-1">{address.phone}</p>
                        <p className="text-sm text-muted-maroon">{address.street}</p>
                        <p className="text-sm text-muted-maroon">{address.city}, {address.state} {address.pincode}</p>
                        <div className="mt-4 flex gap-3">
                          <button onClick={() => editAddress(address)} className="text-sm text-maroon-light hover:underline">Edit</button>
                          <button onClick={() => deleteAddress(address.id)} className="text-sm text-red-500 hover:underline">Delete</button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
