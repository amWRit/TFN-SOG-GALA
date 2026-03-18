import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  const { amount = 10, product_identity = 'ticket', product_name = 'Event Ticket', transaction_uuid, return_url } = await request.json();

  // Khalti test merchant credentials
  const khalti_secret_key = process.env.KHALTI_SECRET_KEY || 'testsecret';

  // Initiate Khalti payment
  const response = await fetch('https://dev.khalti.com/api/v2/epayment/initiate/', {
    method: 'POST',
    headers: {
      'Authorization': `Key ${khalti_secret_key}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      amount: amount * 100, // Khalti uses paisa
      return_url,
      website_url: 'https://yourdomain.com',
      purchase_order_id: transaction_uuid,
      purchase_order_name: product_name,
      product_identity,
      product_name,
    })
  });

  const data = await response.json();
  // data.payment_url, data.pidx

  return NextResponse.json({ payment_url: data.payment_url, pidx: data.pidx });
}
