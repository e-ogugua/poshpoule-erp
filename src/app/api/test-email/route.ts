import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';
import { setCORSHeaders } from '@/lib/headers';

export async function GET() {
  const debugInfo = {
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV,
    emailConfig: {
      smtp_host: process.env.SMTP_HOST ? '[SET]' : '[MISSING]',
      smtp_port: process.env.SMTP_PORT ? '[SET]' : '[MISSING]',
      smtp_user: process.env.SMTP_USER ? '[SET]' : '[MISSING]',
      smtp_pass: process.env.SMTP_PASS ? '[SET]' : '[MISSING]',
      order_notifications_email: process.env.ORDER_NOTIFICATIONS_EMAIL ? '[SET]' : '[MISSING]',
      order_email_from: process.env.ORDER_EMAIL_FROM ? '[SET]' : '[MISSING]',
    },
    vercelSpecific: {
      vercel_env: process.env.VERCEL_ENV || 'development',
      vercel_region: process.env.VERCEL_REGION || 'unknown',
      vercel_url: process.env.VERCEL_URL || 'unknown',
      nextauth_url: process.env.NEXTAUTH_URL || 'unknown',
    },
    database: {
      database_url: process.env.DATABASE_URL ? '[SET]' : '[MISSING]',
    },
    testResults: {
      emailTest: null as any,
      connectivityTest: null as any,
    },
  };

  try {
    if (!process.env.SMTP_HOST || !process.env.SMTP_PORT || !process.env.SMTP_USER || !process.env.SMTP_PASS) {
      debugInfo.testResults.connectivityTest = {
        success: false,
        error: 'Missing required SMTP environment variables',
      };
      return setCORSHeaders(NextResponse.json(debugInfo, { status: 400 }));
    }

    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT),
      secure: Number(process.env.SMTP_PORT) === 465,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });

    // Test 2: Verify connection
    await transporter.verify();

    debugInfo.testResults.connectivityTest = {
      success: true,
      message: 'SMTP connection verified successfully',
    };

    // Test 3: Send test email
    const testEmail = {
      from: process.env.ORDER_EMAIL_FROM || process.env.SMTP_USER,
      to: process.env.ORDER_NOTIFICATIONS_EMAIL || process.env.SMTP_USER,
      subject: 'PoshPOULE Farms - Email Test',
      text: `Email test successful at ${new Date().toISOString()}\nEnvironment: ${process.env.NODE_ENV}\nVercel URL: ${process.env.VERCEL_URL || 'local'}\nThis confirms SMTP is working properly.`,
      html: `
        <div style="font-family: Arial, sans-serif; color: #111827; padding: 20px;">
          <h2 style="color: #14532d;">✅ PoshPOULE Farms Email Test</h2>
          <p><strong>Test Time:</strong> ${new Date().toISOString()}</p>
          <p><strong>Environment:</strong> ${process.env.NODE_ENV}</p>
          <p><strong>Deployment:</strong> ${process.env.VERCEL_ENV || 'development'}</p>
          <p><strong>Status:</strong> <span style="color: #10b981;">Email delivery working correctly</span></p>
          <p>If you received this email, your SMTP configuration is working properly!</p>
        </div>
      `,
    };

    await transporter.sendMail(testEmail);

    debugInfo.testResults.emailTest = {
      success: true,
      message: 'Test email sent successfully',
      recipient: process.env.ORDER_NOTIFICATIONS_EMAIL,
    };

    return setCORSHeaders(NextResponse.json(debugInfo, { status: 200 }));

  } catch (error) {
    console.error('Test email error:', error);

    debugInfo.testResults.emailTest = {
      success: false,
      error: error instanceof Error ? error.message : String(error),
      stack: error instanceof Error ? error.stack : undefined,
    };

    return setCORSHeaders(NextResponse.json(debugInfo, { status: 500 }));
  }
}
