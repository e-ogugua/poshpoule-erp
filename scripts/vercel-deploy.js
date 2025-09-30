const { execSync } = require('child_process');
const { readFileSync, writeFileSync } = require('fs');
const path = require('path');

// Load environment variables
require('dotenv').config({ path: path.resolve(__dirname, '../.env.production') });

console.log('🚀 Starting Vercel deployment...');

// Function to run shell commands
function runCommand(command) {
  console.log(`Running: ${command}`);
  try {
    const output = execSync(command, { stdio: 'inherit' });
    console.log(output?.toString() || '');
    return true;
  } catch (error) {
    console.error('❌ Command failed:', error.message);
    process.exit(1);
  }
}

// Main deployment function
async function deploy() {
  try {
    // Install dependencies
    console.log('\n📦 Installing dependencies...');
    runCommand('pnpm install --frozen-lockfile');

    // Build the application
    console.log('\n🔨 Building the application...');
    runCommand('pnpm build');

    // Run database migrations
    console.log('\n🔄 Running database migrations...');
    runCommand('pnpm db:migrate');

    // Generate sitemap
    console.log('\n🗺️  Generating sitemap...');
    runCommand('pnpm postbuild');

    console.log('\n✅ Deployment preparation completed successfully!');
    console.log('🚀 Ready to deploy to Vercel!');
  } catch (error) {
    console.error('❌ Deployment failed:', error);
    process.exit(1);
  }
}

// Run the deployment
deploy();
