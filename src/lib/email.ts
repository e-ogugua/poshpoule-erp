import nodemailer from 'nodemailer';
import { Order } from '@/lib/database';

const ORDER_EMAIL_FROM = process.env.ORDER_EMAIL_FROM || process.env.SMTP_USER;
const ORDER_NOTIFICATIONS_EMAIL = process.env.ORDER_NOTIFICATIONS_EMAIL || process.env.SMTP_USER;

function ensureEmailConfig() {
  const { SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS } = process.env;

  if (!SMTP_HOST || !SMTP_PORT || !SMTP_USER || !SMTP_PASS || !ORDER_NOTIFICATIONS_EMAIL) {
    throw new Error('Email configuration is incomplete. Please set SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS, and ORDER_NOTIFICATIONS_EMAIL environment variables.');
  }

  return {
    host: SMTP_HOST,
    port: Number(SMTP_PORT),
    user: SMTP_USER,
    pass: SMTP_PASS,
  };
}

export async function sendOrderNotificationEmail(order: Order) {
  try {
    const { host, port, user, pass } = ensureEmailConfig();

    const transporter = nodemailer.createTransport({
      host,
      port,
      secure: port === 465,
      auth: {
        user,
        pass,
      },
    });

    const productLines = order.products
      .map((product) => `- ${product.name} x${product.quantity} (₦${product.priceNaira.toLocaleString()})`)
      .join('\n');

    const textBody = `New preorder received from ${order.customerName} (Phone: ${order.customerPhone}).\n\n` +
      `Order Type: ${order.orderType}\n` +
      (order.deliveryAddress ? `Delivery Address: ${order.deliveryAddress}\n` : '') +
      `Preferred Date: ${order.scheduledDate}\n` +
      (order.scheduledTime ? `Preferred Time: ${order.scheduledTime}\n` : '') +
      (order.notes ? `Notes: ${order.notes}\n` : '') +
      `\nProducts:\n${productLines}\n\n` +
      `Total Amount: ₦${order.totalAmount.toLocaleString()}\n` +
      `Submitted at: ${new Date(order.createdAt).toLocaleString()}`;

    const htmlProducts = order.products
      .map(
        (product) =>
          `<li><strong>${product.name}</strong> &times; ${product.quantity}<br /><span style="color:#14532d;">₦${product.priceNaira.toLocaleString()}</span></li>`
      )
      .join('');

    const htmlBody = `
      <div style="font-family: Arial, sans-serif; color: #111827;">
        <h2 style="color:#14532d;">New Pre-Order from ${order.customerName}</h2>
        <p><strong>Phone:</strong> ${order.customerPhone}</p>
        <p><strong>Email:</strong> ${order.customerEmail}</p>
        <p><strong>Order Type:</strong> ${order.orderType}</p>
        ${order.deliveryAddress ? `<p><strong>Delivery Address:</strong> ${order.deliveryAddress}</p>` : ''}
        <p><strong>Preferred Date:</strong> ${order.scheduledDate}</p>
        ${order.scheduledTime ? `<p><strong>Preferred Time:</strong> ${order.scheduledTime}</p>` : ''}
        ${order.notes ? `<p><strong>Notes:</strong> ${order.notes}</p>` : ''}
        <h3 style="margin-top:24px;">Products</h3>
        <ul style="padding-left:18px;">${htmlProducts}</ul>
        <p style="font-size:16px;margin-top:16px;"><strong>Total:</strong> ₦${order.totalAmount.toLocaleString()}</p>
        <p style="margin-top:24px;color:#6b7280;">Submitted at ${new Date(order.createdAt).toLocaleString()}</p>
      </div>
    `;

    await transporter.sendMail({
      from: ORDER_EMAIL_FROM || user,
      to: ORDER_NOTIFICATIONS_EMAIL,
      subject: `New Pre-Order from ${order.customerName}`,
      text: textBody,
      html: htmlBody,
    });
  } catch (error) {
    console.error('Failed to send order notification email:', error);
    throw error;
  }
}
