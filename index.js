const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const axios = require('axios');

const app = express();
const PORT = 5000;

app.use(cors());
app.use(bodyParser.json());

// PayNow Sandbox Credentials (replace with your real ones)
const paynow = {
  integration_id: 'YOUR-INTEGRATION-ID',
  integration_key: 'YOUR-INTEGRATION-KEY'
};

// ✅ Endpoint: Initiate Payment
app.post('/api/paynow/initiate', async (req, res) => {
  const { amount, email, phone } = req.body;

  const payload = {
    id: paynow.integration_id,
    reference: 'POS-' + Date.now(),
    amount: amount,
    additionalinfo: 'Kontrol POS Payment',
    returnurl: 'https://yourdomain.com/payment-success',
    resulturl: 'https://yourdomain.com/payment-callback',
    authemail: email || 'customer@example.com',
    status: 'Message',
    phone: phone,
    method: 'ecocash' // or visa / mastercard
  };

  try {
    const response = await axios.post(
      'https://www.paynow.co.zw/interface/initiatetransaction',
      payload,
      {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Basic ${Buffer.from(`${paynow.integration_id}:${paynow.integration_key}`).toString('base64')}`
        }
      }
    );

    const { redirecturl } = response.data;
    res.json({ redirecturl }); // Frontend can redirect to this URL or open payment modal
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Payment initiation failed' });
  }
});

// ✅ Callback URL Handler (Server processes payment notifications)
app.post('/api/paynow/callback', (req, res) => {
  const paymentNotification = req.body;
  console.log('Payment Callback Received:', paymentNotification);
  // Save to DB, mark sale as paid...
  res.sendStatus(200);
});

// ✅ Test API Server
app.listen(PORT, () => {
  console.log(`✅ Payment API server running on http://localhost:${PORT}`);
});
