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

export async function sendContactNotificationEmail(lead: any) {
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

    const textBody = `New contact form submission from ${lead.name}.\n\n` +
      `Email: ${lead.email}\n` +
      `Phone: ${lead.phone || 'Not provided'}\n` +
      `Subject: ${lead.subject}\n\n` +
      `Message:\n${lead.message}`;

    const htmlBody = `
      <div style="font-family: Arial, sans-serif; color: #111827;">
        <h2 style="color:#14532d;">New Contact Form Submission</h2>
        <p><strong>Name:</strong> ${lead.name}</p>
        <p><strong>Email:</strong> ${lead.email}</p>
        <p><strong>Phone:</strong> ${lead.phone || 'Not provided'}</p>
        <p><strong>Subject:</strong> ${lead.subject}</p>
        <h3 style="margin-top:24px;">Message</h3>
        <p style="background:#f9fafb;padding:16px;border-radius:8px;border-left:4px solid #14532d;">${lead.message.replace(/\n/g, '<br>')}</p>
        <p style="margin-top:24px;color:#6b7280;">Submitted at ${new Date(lead.createdAt).toLocaleString()}</p>
      </div>
    `;

    await transporter.sendMail({
      from: ORDER_EMAIL_FROM || user,
      to: ORDER_NOTIFICATIONS_EMAIL,
      subject: `Contact Form: ${lead.subject}`,
      text: textBody,
      html: htmlBody,
    });
  } catch (error) {
    console.error('Failed to send contact notification email:', error);
    throw error;
  }
}

export async function sendSubscriptionConfirmation(email: string) {
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

    const textBody = `Thank you for subscribing to PoshPOULE Farms blog!\n\n` +
      `You will now receive updates about:\n` +
      `• Latest farming tips and techniques\n` +
      `• New product launches\n` +
      `• Sustainability practices\n` +
      `• Farm events and workshops\n\n` +
      `Visit our blog: ${process.env.NEXTAUTH_URL}/blog\n` +
      `Unsubscribe anytime by replying to this email.`;

    const htmlBody = `
      <div style="font-family: Arial, sans-serif; color: #111827; max-width: 600px; margin: 0 auto;">
        <div style="background: linear-gradient(135deg, #14532d, #16a34a); padding: 40px; text-align: center; border-radius: 12px 12px 0 0;">
          <h1 style="color: white; margin: 0; font-size: 28px;">🎉 Welcome to PoshPOULE Farms!</h1>
        </div>
        <div style="background: white; padding: 40px; border-radius: 0 0 12px 12px; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
          <h2 style="color: #14532d; margin-bottom: 24px;">Thank you for subscribing!</h2>
          <p style="font-size: 16px; line-height: 1.6; margin-bottom: 24px;">
            You're now part of our farming community! Here's what you'll receive:
          </p>
          <ul style="text-align: left; padding-left: 20px; margin-bottom: 32px;">
            <li style="margin-bottom: 8px;">📚 Latest farming tips and techniques</li>
            <li style="margin-bottom: 8px;">🥚 New product launches and updates</li>
            <li style="margin-bottom: 8px;">🌱 Sustainability practices and insights</li>
            <li style="margin-bottom: 8px;">🎓 Farm events and workshop announcements</li>
          </ul>
          <div style="text-align: center; margin: 32px 0;">
            <a href="${process.env.NEXTAUTH_URL}/blog"
               style="background: #14532d; color: white; padding: 12px 24px; text-decoration: none; border-radius: 8px; display: inline-block;">
              Visit Our Blog
            </a>
          </div>
          <p style="font-size: 14px; color: #6b7280; text-align: center; margin-top: 24px;">
            Unsubscribe anytime by replying to this email with "unsubscribe" in the subject.
          </p>
        </div>
      </div>
    `;

    await transporter.sendMail({
      from: ORDER_EMAIL_FROM || user,
      to: email,
      subject: '🎉 Welcome to PoshPOULE Farms Blog!',
      text: textBody,
      html: htmlBody,
    });
  } catch (error) {
    console.error('Failed to send subscription confirmation email:', error);
    throw error;
  }
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
