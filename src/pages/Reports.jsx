import { useEffect, useState } from 'react';
import { getSales } from '../db';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

export default function Reports() {
  const [sales, setSales] = useState([]);

  useEffect(() => {
    const fetchSales = async () => {
      const allSales = await getSales();
      setSales(allSales);
    };

    fetchSales();
  }, []);

  const chartData = sales.map((sale, index) => ({
    name: `Sale ${index + 1}`,
    total: parseFloat(sale.total),
  }));

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-secondary">Reports Dashboard</h1>

      <div className="bg-white p-6 rounded-2xl shadow-xl w-full max-w-4xl">
        <h2 className="text-lg font-semibold mb-4">Sales Summary</h2>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={chartData}>
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="total" fill="#22C55E" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="bg-white p-6 rounded-2xl shadow-xl w-full max-w-4xl">
        <h2 className="text-lg font-semibold mb-4">Sales Table</h2>
        <table className="w-full text-sm text-left">
          <thead>
            <tr className="border-b">
              <th className="py-2 px-4">Date</th>
              <th className="py-2 px-4">Phone</th>
              <th className="py-2 px-4">Total</th>
            </tr>
          </thead>
          <tbody>
            {sales.map((sale, index) => (
              <tr key={index} className="border-b hover:bg-gray-50">
                <td className="py-2 px-4">{new Date(sale.timestamp).toLocaleString()}</td>
                <td className="py-2 px-4">{sale.phone || 'N/A'}</td>
                <td className="py-2 px-4">${sale.total}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
