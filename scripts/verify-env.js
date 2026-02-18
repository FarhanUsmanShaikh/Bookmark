#!/usr/bin/env node

/**
 * Environment Verification Script
 * Checks that all required environment variables are set correctly
 */

const requiredEnvVars = [
  'NEXT_PUBLIC_SUPABASE_URL',
  'NEXT_PUBLIC_SUPABASE_ANON_KEY'
];

console.log('🔍 Verifying environment configuration...\n');

let hasErrors = false;

requiredEnvVars.forEach(varName => {
  const value = process.env[varName];
  
  if (!value) {
    console.error(`❌ Missing: ${varName}`);
    hasErrors = true;
  } else {
    // Validate format
    if (varName === 'NEXT_PUBLIC_SUPABASE_URL') {
      if (!value.startsWith('https://') || !value.includes('.supabase.co')) {
        console.error(`❌ Invalid format: ${varName}`);
        console.error(`   Expected: https://xxxxx.supabase.co`);
        console.error(`   Got: ${value}`);
        hasErrors = true;
      } else {
        console.log(`✅ ${varName}: ${value}`);
      }
    } else if (varName === 'NEXT_PUBLIC_SUPABASE_ANON_KEY') {
      if (!value.startsWith('eyJ')) {
        console.error(`❌ Invalid format: ${varName}`);
        console.error(`   Expected: JWT token starting with 'eyJ'`);
        console.error(`   Got: ${value.substring(0, 20)}...`);
        hasErrors = true;
      } else {
        console.log(`✅ ${varName}: ${value.substring(0, 20)}...`);
      }
    }
  }
});

console.log('');

if (hasErrors) {
  console.error('❌ Environment configuration has errors!');
  console.error('\nPlease check your .env.local file and ensure all variables are set correctly.');
  console.error('See DEPLOYMENT.md for detailed instructions.\n');
  process.exit(1);
} else {
  console.log('✅ All environment variables are configured correctly!');
  console.log('\nYou can now run: npm run dev\n');
  process.exit(0);
}
