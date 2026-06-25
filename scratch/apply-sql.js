require('dotenv').config();
const { Client } = require('pg');
const fs = require('fs');

async function main() {
  const dbUrl = process.env.DATABASE_URL;
  const client = new Client({
    connectionString: dbUrl,
    ssl: { rejectUnauthorized: false }
  });

  try {
    console.log('Connecting to database via Pooler (pgbouncer)...');
    await client.connect();
    console.log('Connected!');

    console.log('Reading apply_indexes.sql...');
    const sql = fs.readFileSync('apply_indexes.sql', 'utf8');
    const statements = sql.split(';').map(s => s.trim()).filter(s => s.length > 0);

    console.log(`Executing ${statements.length} SQL statements sequentially...`);
    
    for (const stmt of statements) {
      if (!stmt.startsWith('--') && !stmt.includes('BEGIN') && !stmt.includes('COMMIT')) {
        await client.query(stmt);
      }
    }

    console.log('Successfully applied all missing indexes to Supabase!');
  } catch (error) {
    console.error('Error executing SQL:', error.message);
  } finally {
    await client.end();
  }
}

main();
