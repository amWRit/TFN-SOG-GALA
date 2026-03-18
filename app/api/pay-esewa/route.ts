import { NextResponse } from 'next/server';
import crypto from 'crypto';

export async function POST(request: Request) {
  const {
    amount = 10,
    transaction_uuid,
    product_code = 'EPAYTEST',
    success_url,
    failure_url,
    tax_amount = 0,
    product_service_charge = 0,
    product_delivery_charge = 0
  } = await request.json();
  // eSewa test merchant credentials
  const esewa_merchant_id = process.env.ESEWA_MERCHANT_ID || 'EPAYTEST';
  const esewa_secret_key = process.env.ESEWA_SECRET_KEY || '8gBm/:&EnhH.1/q('; // UAT key from docs

  // Calculate total_amount
  const total_amount = Number(amount) + Number(tax_amount) + Number(product_service_charge) + Number(product_delivery_charge);

  // Compose fields for signing
  const signFields = `${total_amount},${transaction_uuid},${product_code}`;
  const signature = crypto.createHmac('sha256', esewa_secret_key).update(signFields).digest('base64');

  // eSewa test endpoint
  const esewaUrl = 'https://rc-epay.esewa.com.np/api/epay/main/v2/form';

      // Debug log values used for signature and form
    console.log('eSewa payload:', {
      amount,
      tax_amount,
      product_service_charge,
      product_delivery_charge,
      total_amount,
      transaction_uuid,
      product_code,
      merchant_id: esewa_merchant_id,
      success_url,
      failure_url,
      signed_field_names: 'total_amount,transaction_uuid,product_code',
      signature,
      signFields,
      esewa_secret_key
    });
    
  // Return form fields for client-side form
  return NextResponse.json({
    esewaUrl,
    amount,
    tax_amount,
    product_service_charge,
    product_delivery_charge,
    total_amount,
    transaction_uuid,
    product_code,
    merchant_id: esewa_merchant_id,
    success_url,
    failure_url,
    signed_field_names: 'total_amount,transaction_uuid,product_code',
    signature
  });
}
