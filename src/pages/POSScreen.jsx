import { useState, useRef } from 'react';
import { addSale } from '../db'; // Your Dexie local DB function
import Receipt from '../components/Receipt'; // Reusable receipt component
import { useReactToPrint } from 'react-to-print';

const products = [
  { id: 1, name: 'Rose Plant', price: 5.0 },
  { id: 2, name: 'Fertilizer Pack', price: 15.0 },
  { id: 3, name: 'Wedding Bouquet', price: 30.0 },
];

const POSScreen = () => {
  const [cart, setCart] = useState([]);
  const [showPayment, setShowPayment] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState('');
  const [email, setEmail] = useState('');
  const [paymentStatus, setPaymentStatus] = useState(null);
  const [recentSale, setRecentSale] = useState(null);

  const receiptRef = useRef();

  const handlePrint = useReactToPrint({
    content: () => receiptRef.current,
  });

  // ✅ Add product to cart
  const addToCart = (product) => {
    const existing = cart.find((item) => item.id === product.id);
    if (existing) {
      setCart(
        cart.map((item) =>
          item.id === product.id ? { ...item, qty: item.qty + 1 } : item
        )
      );
    } else {
      setCart([...cart, { ...product, qty: 1 }]);
    }
  };

  // ✅ Remove product from cart
  const removeFromCart = (productId) => {
    setCart(cart.filter((item) => item.id !== productId));
  };

  // ✅ Calculate cart total
  const getTotal = () => {
    return cart
      .reduce((total, item) => total + item.price * item.qty, 0)
      .toFixed(2);
  };

  // ✅ Handle payment via backend (EcoCash + Visa)
  const handleEcoCashPayment = async () => {
    if (!phoneNumber || getTotal() === 0) {
      alert('Phone number and cart items are required!');
      return;
    }

    setPaymentStatus('Processing payment...');

    try {
      const response = await fetch(
        'http://localhost:5000/api/paynow/initiate',
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            amount: getTotal(),
            phone: phoneNumber,
            email: email || 'customer@example.com',
          }),
        }
      );

      const data = await response.json();

      if (data.redirecturl) {
        setPaymentStatus('Redirecting to EcoCash/Visa...');
        window.location.href = data.redirecturl;

        // You could listen for a callback or manually confirm payment later.
        // For now, simulate sale completion after 5 seconds:
        setTimeout(() => {
          finalizeSale();
        }, 5000);
      } else {
        setPaymentStatus('Failed to initiate payment.');
      }
    } catch (error) {
      console.error('Payment error:', error);
      setPaymentStatus('Payment failed! Try again.');
    }
  };

  // ✅ Finalize sale: Save, print receipt, reset cart
  const finalizeSale = () => {
    const sale = {
      items: cart,
      total: getTotal(),
      phone: phoneNumber,
      timestamp: new Date().toISOString(),
    };

    addSale(sale); // Save sale locally (Dexie.js)
    setRecentSale(sale); // Set for receipt
    handlePrint(); // Trigger receipt print
    setPaymentStatus('Payment Successful ✅');

    // Reset POS after printing
    setTimeout(() => {
      setShowPayment(false);
      setCart([]);
      setPhoneNumber('');
      setEmail('');
      setPaymentStatus(null);
    }, 3000);
  };

  return (
    <div className="flex flex-col space-y-6 min-h-screen p-6 bg-gray-50">
      <h1 className="text-4xl font-bold text-secondary mb-4">
        Point of Sale
      </h1>

      <div className="flex gap-6">
        {/* ✅ Products List */}
        <div className="flex-1 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {products.map((product) => (
            <button
              key={product.id}
              onClick={() => addToCart(product)}
              className="p-6 bg-white rounded-2xl shadow hover:shadow-lg transition-all border border-gray-100 flex flex-col justify-between hover:scale-[1.02]"
            >
              <h2 className="text-lg font-semibold text-secondary">
                {product.name}
              </h2>
              <div className="flex justify-between items-center mt-4">
                <span className="text-xl text-primary font-bold">
                  ${product.price.toFixed(2)}
                </span>
                <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded">
                  Tap to add
                </span>
              </div>
            </button>
          ))}
        </div>

        {/* ✅ Cart Summary */}
        <div className="w-80 bg-white rounded-2xl shadow p-6 flex flex-col justify-between border border-gray-100">
          <div>
            <h2 className="text-lg font-bold text-secondary mb-4">Cart</h2>
            {cart.length === 0 ? (
              <p className="text-sm text-gray-400">Your cart is empty.</p>
            ) : (
              <ul className="divide-y">
                {cart.map((item) => (
                  <li
                    key={item.id}
                    className="flex justify-between py-2 text-sm"
                  >
                    <span>
                      {item.name} x{item.qty}
                    </span>
                    <span className="font-medium">
                      ${(+item.price * item.qty).toFixed(2)}
                    </span>
                  </li>
                ))}
              </ul>
            )}
          </div>

          <div className="pt-4 mt-4 border-t">
            <div className="flex justify-between font-semibold text-secondary">
              <span>Total</span>
              <span>${getTotal()}</span>
            </div>
            <button
              onClick={() => setShowPayment(true)}
              disabled={cart.length === 0}
              className={`mt-4 w-full py-3 rounded-xl text-white font-medium transition-all ${
                cart.length === 0
                  ? 'bg-gray-300 cursor-not-allowed'
                  : 'bg-primary hover:bg-green-600'
              }`}
            >
              Pay with EcoCash / Visa
            </button>
          </div>
        </div>
      </div>

      {/* ✅ EcoCash Payment Modal */}
      {showPayment && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white rounded-2xl p-6 w-96 space-y-4 shadow-xl">
            <h2 className="text-xl font-bold text-secondary">
              EcoCash / Visa Payment
            </h2>
            <p className="text-sm text-gray-500">Enter customer details:</p>

            <input
              type="tel"
              placeholder="07XXXXXXXX"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              className="w-full p-3 border rounded-lg focus:outline-none focus:ring focus:border-primary"
            />

            <input
              type="email"
              placeholder="Customer Email (optional)"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-3 border rounded-lg focus:outline-none focus:ring focus:border-primary"
            />

            {paymentStatus && (
              <div className="text-center text-sm font-medium text-primary">
                {paymentStatus}
              </div>
            )}

            <div className="flex justify-between">
              <button
                onClick={() => {
                  setShowPayment(false);
                  setPaymentStatus(null);
                }}
                className="px-4 py-2 rounded-lg bg-gray-300 hover:bg-gray-400 transition-all"
              >
                Cancel
              </button>
              <button
                onClick={handleEcoCashPayment}
                disabled={!phoneNumber}
                className={`px-4 py-2 rounded-lg text-white ${
                  phoneNumber
                    ? 'bg-primary hover:bg-green-600'
                    : 'bg-gray-300 cursor-not-allowed'
                }`}
              >
                Pay Now
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ✅ Receipt Component (Hidden) */}
      {recentSale && <Receipt ref={receiptRef} sale={recentSale} />}
    </div>
  );
};

export default POSScreen;


