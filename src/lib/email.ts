import nodemailer from 'nodemailer';
import { Order } from '@/lib/database';

const ORDER_EMAIL_FROM = process.env.ORDER_EMAIL_FROM || process.env.SMTP_USER;
const ORDER_NOTIFICATIONS_EMAIL = process.env.ORDER_NOTIFICATIONS_EMAIL || process.env.SMTP_USER;

function ensureEmailConfig() {
  const { SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS } = process.env;

  // In development/testing, allow orders without email config
  if (process.env.NODE_ENV === 'development' || process.env.NODE_ENV === 'test') {
    console.log('⚠️ Email configuration incomplete - skipping email notifications');
    return null;
  }


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


export async function sendOrderNotificationEmail(order: Order | any) {
  try {
    const emailConfig = ensureEmailConfig();

    if (!emailConfig) {
      console.log('📧 Email configuration not available - skipping order notification');
      return;
    }


    const transporter = nodemailer.createTransport({
      host: emailConfig.host,
      port: emailConfig.port,
      secure: emailConfig.port === 465,
      auth: {
        user: emailConfig.user,
        pass: emailConfig.pass,
      },
    });

    // Handle both old Order type and new Prisma Order type
    const products = order.products || [];
    const productLines = products
      .map((product: any) => `- ${product.name} x${product.quantity} (₦${product.priceNaira?.toLocaleString() || '0'})`)
      .join('\n');

    const textBody = `New preorder received from ${order.customerName}.\n\n` +
      `Email: ${order.customerEmail}\n` +
      `Phone: ${order.customerPhone}\n` +
      `Order Type: ${order.orderType}\n` +
      (order.deliveryAddress ? `Delivery Address: ${order.deliveryAddress}\n` : '') +
      `Preferred Date: ${order.scheduledDate}\n` +
      (order.scheduledTime ? `Preferred Time: ${order.scheduledTime}\n` : '') +
      (order.notes ? `Notes: ${order.notes}\n` : '') +
      `\nProducts:\n${productLines}\n\n` +
      `Total Amount: ₦${order.totalAmount?.toLocaleString() || '0'}\n` +
      `Submitted at: ${new Date(order.createdAt).toLocaleString()}`;

    const htmlBody = `
      <div style="font-family: Arial, sans-serif; color: #111827; max-width: 600px; margin: 0 auto;">
        <h2 style="color:#14532d;">🎉 New Preorder Received!</h2>
        <div style="background:#f9fafb;padding:20px;border-radius:8px;margin:20px 0;">
          <h3 style="margin-top:0;color:#14532d;">Customer Information</h3>
          <p><strong>Name:</strong> ${order.customerName}</p>
          <p><strong>Email:</strong> ${order.customerEmail}</p>
          <p><strong>Phone:</strong> ${order.customerPhone}</p>
          <p><strong>Order Type:</strong> ${order.orderType}</p>
          ${order.deliveryAddress ? `<p><strong>Delivery Address:</strong> ${order.deliveryAddress}</p>` : ''}

          <p><strong>Preferred Date:</strong> ${order.scheduledDate}</p>
          ${order.scheduledTime ? `<p><strong>Preferred Time:</strong> ${order.scheduledTime}</p>` : ''}

          ${order.notes ? `<p><strong>Notes:</strong> ${order.notes}</p>` : ''}

        </div>

        <h3 style="color:#14532d;">Order Details</h3>
        <div style="background:#f9fafb;padding:20px;border-radius:8px;margin:20px 0;">
          ${products.map((product: any) => `
            <div style="margin-bottom:12px;padding:12px;border-bottom:1px solid #e5e7eb;">
              <strong>${product.name}</strong><br>
              Quantity: ${product.quantity}<br>
              Price: ₦${product.priceNaira?.toLocaleString() || '0'}

            </div>
          `).join('')}

          <div style="border-top:2px solid #14532d;padding-top:12px;margin-top:12px;">
            <strong>Total: ₦${order.totalAmount?.toLocaleString() || '0'}</strong>
          </div>
        </div>

        <p style="color:#6b7280;">
          Submitted at: ${new Date(order.createdAt).toLocaleString()}

        </p>
      </div>
    `;

    await transporter.sendMail({
      from: ORDER_EMAIL_FROM || emailConfig.user,
      to: ORDER_NOTIFICATIONS_EMAIL,
      subject: `🎉 New Preorder from ${order.customerName} - ₦${order.totalAmount?.toLocaleString() || '0'}`,
      text: textBody,
      html: htmlBody,
    });

    console.log('✅ Order notification email sent successfully');
  } catch (error) {
    console.error('❌ Failed to send order notification email:', error);
    // Don't throw - allow order to be saved even if email fails
  }

}


export async function sendContactNotificationEmail(lead: any) {
  try {
    const emailConfig = ensureEmailConfig();

    if (!emailConfig) {
      console.log('📧 Email configuration not available - skipping contact notification');
      return;
    }


    const transporter = nodemailer.createTransport({
      host: emailConfig.host,
      port: emailConfig.port,
      secure: emailConfig.port === 465,
      auth: {
        user: emailConfig.user,
        pass: emailConfig.pass,
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
      </div>
    `;

    await transporter.sendMail({
      from: ORDER_EMAIL_FROM || emailConfig.user,
      to: ORDER_NOTIFICATIONS_EMAIL,
      subject: `📧 New Contact: ${lead.subject}`,
      text: textBody,
      html: htmlBody,
    });

  } catch (error) {
    console.error('❌ Failed to send contact notification email:', error);
    // Don't throw - allow contact to be saved even if email fails
  }
}

export async function sendSubscriptionConfirmationEmail(email: string) {
  try {
    const emailConfig = ensureEmailConfig();
    if (!emailConfig) {
      console.log('📧 Email configuration not available - skipping subscription confirmation');
      return;
    }

    const transporter = nodemailer.createTransport({
      host: emailConfig.host,
      port: emailConfig.port,
      secure: emailConfig.port === 465,
      auth: {
        user: emailConfig.user,
        pass: emailConfig.pass,
      },
    });

    // Generate confirmation token (in production, this would be stored in DB)
    const token = Buffer.from(email).toString('base64');
    const confirmUrl = `${process.env.NEXTAUTH_URL || 'http://localhost:3000'}/api/blog/subscribers/${token}/confirm`;

    const textBody = `Thank you for subscribing to PoshPOULE Farms blog!\n\n` +
                      `Please confirm your subscription by clicking this link:\n${confirmUrl}\n\n` +
                      `You'll now receive updates about our latest blog posts, farm news, and organic farming tips.\n\n` +
                      `Best regards,\nThe PoshPOULE Farms Team`;

    const htmlBody = `
      <div style="font-family: Arial, sans-serif; color: #111827; max-width: 600px; margin: 0 auto;">
        <h2 style="color:#14532d;">🎉 Welcome to PoshPOULE Farms Blog!</h2>
        <p>Thank you for subscribing! You'll now receive updates about:</p>
        <ul>
          <li>Latest blog posts</li>
          <li>Farm news and updates</li>
          <li>Organic farming tips</li>
          <li>Special offers and promotions</li>
        </ul>

        <div style="background:#f9fafb;padding:20px;border-radius:8px;margin:20px 0;text-align:center;">
          <h3 style="margin-top:0;color:#14532d;">Confirm Your Subscription</h3>
          <p>Please click the button below to confirm your email address:</p>
          <a href="${confirmUrl}" style="display:inline-block;background:#14532d;color:white;padding:12px 24px;text-decoration:none;border-radius:6px;font-weight:600;">Confirm Subscription</a>
          <p style="margin-top:15px;font-size:14px;color:#6b7280;">
            Or copy and paste this link in your browser:<br>
            <span style="word-break:break-all;">${confirmUrl}</span>
          </p>
        </div>

        <p>Best regards,<br>The PoshPOULE Farms Team</p>
      </div>
    `;

    await transporter.sendMail({
      from: ORDER_EMAIL_FROM || emailConfig.user,
      to: email,
      subject: '🎉 Confirm Your PoshPOULE Farms Blog Subscription!',
      text: textBody,
      html: htmlBody,
    });

    console.log('✅ Subscription confirmation email sent successfully');
  } catch (error) {
    console.error('❌ Failed to send subscription confirmation email:', error);
    // Don't throw - allow subscription to be saved even if email fails
  }
}
