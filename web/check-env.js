const fs = require('fs');
const path = require('path');
const dotenv = require('dotenv');

// Load .env.local
const envPath = path.resolve(process.cwd(), '.env.local');
const envConfig = dotenv.parse(fs.readFileSync(envPath));

console.log('Checking .env.local at:', envPath);
console.log('NEXT_PUBLIC_SUPABASE_URL exists:', !!envConfig.NEXT_PUBLIC_SUPABASE_URL);
console.log('NEXT_PUBLIC_SUPABASE_ANON_KEY exists:', !!envConfig.NEXT_PUBLIC_SUPABASE_ANON_KEY);
