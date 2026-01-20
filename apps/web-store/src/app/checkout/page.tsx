'use client';

import { useState } from 'react';
import { useCart } from '@/lib/cart';
import { createOrder } from '@/lib/orders';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';

export default function CheckoutPage() {
  const { items, cartTotal, clearCart } = useCart();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const [address, setAddress] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    street: '',
    city: '',
    state: '',
    postalCode: '',
    country: 'US',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setAddress({ ...address, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      if (items.length === 0) {
        throw new Error('Your cart is empty');
      }

      await createOrder({
        items: items.map(item => ({
          productId: item.id,
          variantId: item.variantId || 'default-variant', // In real app, must be selected
          quantity: item.quantity,
          unitPrice: item.base_price,
          productName: item.name,
          sku: `SKU-${item.id}`, // Mock SKU
        })),
        shippingAddress: address,
      });

      clearCart();
      router.push('/checkout/success');
    } catch (err: any) {
      setError(err.message || 'Failed to place order');
    } finally {
      setIsLoading(false);
    }
  };

  if (items.length === 0) {
     return (
         <div className="min-h-screen flex flex-col items-center justify-center">
             <h1 className="text-2xl font-bold mb-4">Your cart is empty</h1>
             <Button onClick={() => router.push('/')}>Continue Shopping</Button>
         </div>
     )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Checkout</h1>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Form Section */}
          <div>
            <div className="bg-white p-6 rounded-lg shadow-sm mb-6">
              <h2 className="text-xl font-semibold mb-4">Shipping Information</h2>
              <form id="checkout-form" onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <Input name="firstName" placeholder="First Name" value={address.firstName} onChange={handleChange} required />
                  <Input name="lastName" placeholder="Last Name" value={address.lastName} onChange={handleChange} required />
                </div>
                <Input name="email" type="email" placeholder="Email" value={address.email} onChange={handleChange} required />
                <Input name="phone" type="tel" placeholder="Phone" value={address.phone} onChange={handleChange} required />
                <Input name="street" placeholder="Street Address" value={address.street} onChange={handleChange} required />
                <div className="grid grid-cols-2 gap-4">
                  <Input name="city" placeholder="City" value={address.city} onChange={handleChange} required />
                  <Input name="state" placeholder="State/Province" value={address.state} onChange={handleChange} required />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <Input name="postalCode" placeholder="Postal Code" value={address.postalCode} onChange={handleChange} required />
                  <Input name="country" placeholder="Country" value={address.country} onChange={handleChange} required />
                </div>
              </form>
            </div>
            
             {error && (
              <div className="p-4 bg-red-50 text-red-700 rounded-md mb-4">
                {error}
              </div>
            )}
          </div>

          {/* Order Summary */}
          <div>
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <h2 className="text-xl font-semibold mb-4">Order Summary</h2>
              <div className="flow-root">
                <ul className="-my-6 divide-y divide-gray-200">
                  {items.map((item) => (
                    <li key={item.id} className="py-6 flex">
                      <div className="flex-shrink-0 w-24 h-24 border border-gray-200 rounded-md overflow-hidden">
                        <img
                          src={item.image_urls?.[0] || 'https://via.placeholder.com/150'}
                          alt={item.name}
                          className="w-full h-full object-center object-cover"
                        />
                      </div>

                      <div className="ml-4 flex-1 flex flex-col">
                        <div>
                          <div className="flex justify-between text-base font-medium text-gray-900">
                            <h3>{item.name}</h3>
                            <p>${(item.base_price * item.quantity).toFixed(2)}</p>
                          </div>
                        </div>
                        <div className="flex-1 flex items-end justify-between text-sm">
                          <p className="text-gray-500">Qty {item.quantity}</p>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="border-t border-gray-200 mt-6 pt-6 space-y-4">
                <div className="flex justify-between text-base font-medium text-gray-900">
                  <p>Subtotal</p>
                  <p>${cartTotal.toFixed(2)}</p>
                </div>
                <div className="flex justify-between text-base font-medium text-gray-900">
                  <p>Shipping</p>
                  <p>Free</p>
                </div>
                <div className="flex justify-between text-xl font-bold text-gray-900 border-t pt-4">
                  <p>Total</p>
                  <p>${cartTotal.toFixed(2)}</p>
                </div>
              </div>

              <div className="mt-6">
                <Button
                  type="submit"
                  form="checkout-form"
                  className="w-full"
                  disabled={isLoading}
                >
                  {isLoading ? 'Processing...' : 'Place Order'}
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
