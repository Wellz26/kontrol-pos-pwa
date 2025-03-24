import Dexie from 'dexie';

export const db = new Dexie('KontrolPOSDB');

db.version(1).stores({
  sales: '++id, productName, quantity, price, total, timestamp, phone',
});

// Save sale locally
export const addSale = async (sale) => {
  await db.sales.add({
    ...sale,
    timestamp: new Date().toISOString(),
  });
};

// Get all sales (for reports, etc)
export const getSales = async () => {
  return await db.sales.toArray();
};

// Auto-Sync Function
export const syncSales = async () => {
  const unsyncedSales = await db.sales.toArray();

  if (unsyncedSales.length === 0) {
    console.log('No sales to sync!');
    return;
  }

  try {
    const res = await fetch('https://your-server.com/api/sync-sales', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ sales: unsyncedSales }),
    });

    if (res.ok) {
      await db.sales.clear();
      console.log('Sales synced & cleared!');
    } else {
      console.error('Failed to sync sales:', res.statusText);
    }
  } catch (error) {
    console.error('Sync error:', error);
  }
};
