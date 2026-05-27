/**
 * M-Pesa Integration
 * POST /api/mpesa/stkpush    — initiate STK push to rider's phone
 * POST /api/mpesa/callback   — Safaricom callback (webhook)
 */
import { Router } from 'express';
const router = Router();

async function getMpesaToken() {
  const { MPESA_CONSUMER_KEY: key, MPESA_CONSUMER_SECRET: secret, MPESA_ENV } = process.env;
  const base = MPESA_ENV === 'production'
    ? 'https://api.safaricom.co.ke'
    : 'https://sandbox.safaricom.co.ke';
  const creds = Buffer.from(`${key}:${secret}`).toString('base64');
  const res = await fetch(`${base}/oauth/v1/generate?grant_type=client_credentials`, {
    headers: { Authorization: `Basic ${creds}` }
  });
  const json = await res.json();
  return { token: json.access_token, base };
}

router.post('/stkpush', async (req, res) => {
  try {
    const { phone, amount, rider_id } = req.body;
    const { token, base } = await getMpesaToken();
    const timestamp = new Date().toISOString().replace(/[^0-9]/g, '').slice(0, 14);
    const password  = Buffer.from(
      `${process.env.MPESA_SHORTCODE}${process.env.MPESA_PASSKEY}${timestamp}`
    ).toString('base64');

    const payload = {
      BusinessShortCode: process.env.MPESA_SHORTCODE,
      Password:          password,
      Timestamp:         timestamp,
      TransactionType:   'CustomerPayBillOnline',
      Amount:            amount,
      PartyA:            phone,
      PartyB:            process.env.MPESA_SHORTCODE,
      PhoneNumber:       phone,
      CallBackURL:       `${process.env.API_URL || 'https://your-api.com'}/api/mpesa/callback`,
      AccountReference:  `ML-${rider_id}`,
      TransactionDesc:   'MotoLift Repayment',
    };

    const mpesaRes = await fetch(`${base}/mpesa/stkpush/v1/processrequest`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    const data = await mpesaRes.json();
    res.json(data);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'M-Pesa STK push failed' });
  }
});

router.post('/callback', (req, res) => {
  // TODO: parse Safaricom callback, record repayment, notify rider
  console.log('M-Pesa callback received:', JSON.stringify(req.body, null, 2));
  res.json({ ResultCode: 0, ResultDesc: 'Accepted' });
});

export default router;
