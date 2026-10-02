import { createClient } from 'npm:@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
};

type DeliveryStatus = 'pending' | 'sending' | 'failed' | 'sent';

function jsonResponse(status: number, body: Record<string, unknown>) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
  });
}

function escapeHtml(value: unknown) {
  return String(value ?? '').replace(/[&<>"']/g, (character) => {
    const entities: Record<string, string> = {
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      '"': '&quot;',
      "'": '&#39;',
    };
    return entities[character];
  });
}

function formatNaira(value: unknown) {
  return new Intl.NumberFormat('en-NG', {
    style: 'currency',
    currency: 'NGN',
    maximumFractionDigits: 2,
  }).format(Number(value));
}

async function updateDelivery(
  admin: ReturnType<typeof createClient>,
  orderId: string,
  confirmationToken: string,
  update: {
    status: DeliveryStatus;
    last_error_code: string | null;
    sent_at?: string | null;
  },
) {
  const { error } = await admin
    .from('order_confirmation_emails')
    .update(update)
    .eq('order_id', orderId)
    .eq('delivery_token', confirmationToken)
    .eq('status', 'sending');

  if (error) {
    console.error('Could not update order confirmation delivery state.');
    return false;
  }

  return true;
}

function buildEmail(order: any) {
  const items = Array.isArray(order.order_items) ? order.order_items : [];
  const orderRows = items.map((item: any) => {
    const relation = item.product;
    const product = Array.isArray(relation) ? relation[0] : relation;
    const name = product?.name || `Product #${item.product_id}`;
    const quantity = Number(item.quantity);
    const lineTotal = Number(item.price) * quantity;
    return {
      name: String(name),
      quantity,
      price: Number(item.price),
      lineTotal,
    };
  });

  const name = String(order.customer_name || 'Customer');
  const orderId = String(order.id);
  const date = new Date(order.created_at).toLocaleString('en-NG', {
    dateStyle: 'medium',
    timeStyle: 'short',
    timeZone: 'Africa/Lagos',
  });
  const textItems = orderRows
    .map((item: any) => `${item.name} — Quantity: ${item.quantity} — Unit price: ${formatNaira(item.price)} — Subtotal: ${formatNaira(item.lineTotal)}`)
    .join('\n');
  const htmlRows = orderRows
    .map((item: any) => `
      <tr>
        <td style="padding:12px 8px;border-bottom:1px solid #e5e7eb">${escapeHtml(item.name)}</td>
        <td style="padding:12px 8px;border-bottom:1px solid #e5e7eb;text-align:center">${item.quantity}</td>
        <td style="padding:12px 8px;border-bottom:1px solid #e5e7eb;text-align:right">${escapeHtml(formatNaira(item.price))}</td>
        <td style="padding:12px 8px;border-bottom:1px solid #e5e7eb;text-align:right">${escapeHtml(formatNaira(item.lineTotal))}</td>
      </tr>`)
    .join('');

  return {
    text: [
      `Hello ${name},`,
      '',
      'Thank you for your order from Nuvora Store.',
      `Order ID: #${orderId}`,
      `Order date: ${date}`,
      '',
      textItems,
      '',
      `Total: ${formatNaira(order.total)}`,
      '',
      'We have received your order and will process it shortly.',
      'Thank you for shopping with Nuvora Store.',
    ].join('\n'),
    html: `<!doctype html>
<html lang="en">
  <body style="margin:0;padding:24px;background:#f8fafc;font-family:Arial,sans-serif;color:#1e293b">
    <main style="max-width:640px;margin:0 auto;padding:28px;background:#fff;border:1px solid #e2e8f0;border-radius:12px">
      <p style="margin:0 0 8px;color:#4f46e5;font-weight:700">NUVORA STORE</p>
      <h1 style="margin:0 0 18px;font-size:24px">Order confirmation</h1>
      <p>Hello ${escapeHtml(name)},</p>
      <p>Thank you for your order from Nuvora Store. We have received it and will process it shortly.</p>
      <p><strong>Order ID:</strong> #${escapeHtml(orderId)}<br><strong>Order date:</strong> ${escapeHtml(date)}</p>
      <div style="overflow-x:auto">
        <table style="width:100%;border-collapse:collapse;text-align:left;font-size:14px">
          <thead><tr>
            <th style="padding:10px 8px;border-bottom:2px solid #cbd5e1">Product</th>
            <th style="padding:10px 8px;border-bottom:2px solid #cbd5e1;text-align:center">Qty</th>
            <th style="padding:10px 8px;border-bottom:2px solid #cbd5e1;text-align:right">Unit price</th>
            <th style="padding:10px 8px;border-bottom:2px solid #cbd5e1;text-align:right">Subtotal</th>
          </tr></thead>
          <tbody>${htmlRows}</tbody>
        </table>
      </div>
      <p style="margin:20px 0 0;text-align:right;font-size:18px"><strong>Total: ${escapeHtml(formatNaira(order.total))}</strong></p>
      <p style="margin:24px 0 0">Thank you for shopping with Nuvora Store.</p>
    </main>
  </body>
</html>`,
  };
}

Deno.serve(async (request) => {
  if (request.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }
  if (request.method !== 'POST') {
    return jsonResponse(405, { status: 'failed', code: 'method_not_allowed' });
  }

  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return jsonResponse(400, { status: 'failed', code: 'invalid_request' });
  }

  const rawOrderId = body.orderId;
  const orderId = typeof rawOrderId === 'number' && Number.isSafeInteger(rawOrderId)
    ? String(rawOrderId)
    : typeof rawOrderId === 'string'
      ? rawOrderId
      : '';
  const confirmationToken = typeof body.confirmationToken === 'string' ? body.confirmationToken : '';

  if (!/^\d+$/.test(orderId) || !/^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(confirmationToken)) {
    return jsonResponse(400, { status: 'failed', code: 'invalid_request' });
  }

  const supabaseUrl = Deno.env.get('SUPABASE_URL');
  const serviceRoleKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');
  const mailgunApiKey = Deno.env.get('MAILGUN_API_KEY');
  const mailgunDomain = Deno.env.get('MAILGUN_DOMAIN');
  const mailgunFrom = Deno.env.get('MAILGUN_FROM_EMAIL');
  const mailgunApiBase = Deno.env.get('MAILGUN_API_BASE_URL') || 'https://api.mailgun.net';

  if (!supabaseUrl || !serviceRoleKey) {
    console.error('Supabase server-side function configuration is incomplete.');
    return jsonResponse(503, { status: 'failed', code: 'service_not_configured' });
  }

  const admin = createClient(supabaseUrl, serviceRoleKey, {
    auth: { autoRefreshToken: false, persistSession: false },
  });

  const { data: notification, error: lookupError } = await admin
    .from('order_confirmation_emails')
    .select('status, expires_at')
    .eq('order_id', orderId)
    .eq('delivery_token', confirmationToken)
    .maybeSingle();

  if (lookupError) {
    console.error('Could not verify an order confirmation request.');
    return jsonResponse(500, { status: 'failed', code: 'request_verification_failed' });
  }
  if (!notification) {
    return jsonResponse(404, { status: 'failed', code: 'confirmation_not_found' });
  }
  if (notification.status === 'sent') {
    return jsonResponse(200, { status: 'sent', alreadySent: true });
  }
  if (new Date(notification.expires_at).getTime() <= Date.now()) {
    return jsonResponse(410, { status: 'failed', code: 'confirmation_expired' });
  }

  if (!mailgunApiKey || !mailgunDomain || !mailgunFrom) {
    return jsonResponse(503, { status: 'failed', code: 'email_not_configured' });
  }
  if (!['https://api.mailgun.net', 'https://api.eu.mailgun.net'].includes(mailgunApiBase)) {
    console.error('Mailgun API region configuration is invalid.');
    return jsonResponse(503, { status: 'failed', code: 'email_not_configured' });
  }

  const { data: claim, error: claimError } = await admin.rpc('claim_order_confirmation_email', {
    p_order_id: orderId,
    p_delivery_token: confirmationToken,
  });
  if (claimError) {
    console.error('Could not claim the order confirmation email.');
    return jsonResponse(500, { status: 'failed', code: 'delivery_claim_failed' });
  }
  if (claim === 'sent') {
    return jsonResponse(200, { status: 'sent', alreadySent: true });
  }
  if (claim === 'sending') {
    return jsonResponse(202, { status: 'sending' });
  }
  if (claim === 'expired') {
    return jsonResponse(410, { status: 'failed', code: 'confirmation_expired' });
  }
  if (claim !== 'claimed') {
    return jsonResponse(404, { status: 'failed', code: 'confirmation_not_found' });
  }

  const { data: order, error: orderError } = await admin
    .from('orders')
    .select('id, customer_name, email, total, created_at, order_items(quantity, price, product_id, product:products(name))')
    .eq('id', orderId)
    .maybeSingle();

  if (orderError || !order || !Array.isArray(order.order_items) || order.order_items.length === 0) {
    await updateDelivery(admin, orderId, confirmationToken, {
      status: 'failed',
      last_error_code: 'order_data_unavailable',
    });
    console.error('Order confirmation data could not be loaded.');
    return jsonResponse(500, { status: 'failed', code: 'order_data_unavailable' });
  }

  const message = buildEmail(order);
  const form = new FormData();
  form.set('from', mailgunFrom);
  form.set('to', String(order.email));
  form.set('subject', 'Order Confirmation - Nuvora Store');
  form.set('text', message.text);
  form.set('html', message.html);

  try {
    const mailgunUrl = `${mailgunApiBase}/v3/${encodeURIComponent(mailgunDomain)}/messages`;
    const response = await fetch(mailgunUrl, {
      method: 'POST',
      headers: { Authorization: `Basic ${btoa(`api:${mailgunApiKey}`)}` },
      body: form,
    });

    if (!response.ok) {
      await updateDelivery(admin, orderId, confirmationToken, {
        status: 'failed',
        last_error_code: `mailgun_http_${response.status}`,
      });
      console.error('Mailgun rejected an order confirmation email.', response.status);
      return jsonResponse(502, { status: 'failed', code: 'email_delivery_failed' });
    }

    await updateDelivery(admin, orderId, confirmationToken, {
      status: 'sent',
      last_error_code: null,
      sent_at: new Date().toISOString(),
    });

    return jsonResponse(200, { status: 'sent' });
  } catch (error) {
    await updateDelivery(admin, orderId, confirmationToken, {
      status: 'failed',
      last_error_code: 'mailgun_network_error',
    });
    console.error(
      'Mailgun order confirmation request failed.',
      error instanceof Error ? error.name : 'UnknownError',
    );
    return jsonResponse(502, { status: 'failed', code: 'email_delivery_failed' });
  }
});