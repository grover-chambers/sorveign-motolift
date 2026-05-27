# M-Pesa Integration Setup

## 1. Get Daraja API credentials
Go to https://developer.safaricom.co.ke → Create App → get Consumer Key and Consumer Secret

## 2. Add to api/.env
```
MPESA_CONSUMER_KEY=your_key
MPESA_CONSUMER_SECRET=your_secret
MPESA_SHORTCODE=your_paybill_or_till_number
MPESA_PASSKEY=your_lipa_na_mpesa_passkey
MPESA_ENV=sandbox        # change to 'production' when live
API_URL=https://your-api-domain.com
```

## 3. STK Push flow
The API route `POST /api/mpesa/stkpush` triggers a payment prompt on the rider's phone.
- Body: `{ phone: "2547XXXXXXXX", amount: 350, rider_id: "uuid" }`
- Safaricom calls back to `POST /api/mpesa/callback` with payment confirmation
- Callback records repayment and increments `days_paid`

## 4. Test in sandbox
Use test phone numbers from Safaricom Daraja sandbox docs.
PIN: 0000 for sandbox payments.
