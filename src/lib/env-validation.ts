/**
 * Environment Variable Validation
 * Validates all required environment variables for the application
 * Throws descriptive errors if any are missing during server startup
 */

interface RequiredEnvVars {
  DATABASE_URL: string;
  SMTP_HOST: string;
  SMTP_PORT: string;
  SMTP_USER: string;
  SMTP_PASS: string;
  NEXTAUTH_URL: string;
  ORDER_NOTIFICATIONS_EMAIL: string;
}

function getMissingEnvVars(): string[] {
  const requiredVars: (keyof RequiredEnvVars)[] = [
    'DATABASE_URL',
    'SMTP_HOST',
    'SMTP_PORT',
    'SMTP_USER',
    'SMTP_PASS',
    'NEXTAUTH_URL',
    'ORDER_NOTIFICATIONS_EMAIL'
  ];

  return requiredVars.filter(varName => !process.env[varName]);
}

export function validateEnvironment(): void {
  const missingVars = getMissingEnvVars();

  if (missingVars.length > 0) {
    const errorMessage = `
❌ Environment Validation Failed

Missing required environment variables:
${missingVars.map(varName => `  • ${varName}`).join('\n')}

Please set these variables in your .env file or Vercel environment settings:

DATABASE_URL=postgresql://username:password@host:port/database
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password
NEXTAUTH_URL=https://your-domain.vercel.app
ORDER_NOTIFICATIONS_EMAIL=your-notifications-email@gmail.com

For Gmail SMTP:
1. Enable 2-factor authentication on your Gmail account
2. Generate an App Password: https://myaccount.google.com/apppasswords
3. Use the App Password as SMTP_PASS (not your regular password)
`;

    throw new Error(errorMessage);
  }

  // Additional validation for specific formats
  const { SMTP_PORT, NEXTAUTH_URL } = process.env;

  if (isNaN(Number(SMTP_PORT))) {
    throw new Error('SMTP_PORT must be a valid number (usually 587 or 465)');
  }

  try {
    new URL(NEXTAUTH_URL!);
  } catch {
    throw new Error('NEXTAUTH_URL must be a valid URL (e.g., https://your-domain.vercel.app)');
  }

  console.log('✅ Environment validation passed - all required variables are set');
}
