import React, { forwardRef } from 'react';

const Receipt = forwardRef(({ sale }, ref) => {
  return (
    <div ref={ref} className="w-[300px] p-4 text-sm font-mono text-black">
      <h2 className="text-center text-lg font-bold mb-2">Kontrol POS</h2>
      <p className="text-center mb-4">Sales Receipt</p>
      <div className="flex justify-between mb-2">
        <span>Date:</span>
        <span>{new Date().toLocaleString()}</span>
      </div>
      <div className="border-t border-b py-2 mb-2">
        {sale.items.map((item, index) => (
          <div key={index} className="flex justify-between">
            <span>{item.name} x{item.qty}</span>
            <span>${(item.price * item.qty).toFixed(2)}</span>
          </div>
        ))}
      </div>
      <div className="flex justify-between font-bold mb-4">
        <span>Total</span>
        <span>${sale.total}</span>
      </div>
      <p className="text-center">Thank you for your purchase!</p>
    </div>
  );
});

export default Receipt;
