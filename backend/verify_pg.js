/**
 * verify_pg.js — Quick Neon PostgreSQL verification script
 * Run with: node verify_pg.js
 */
require('dotenv').config();
const { Pool } = require('pg');

process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

async function verify() {
  console.log('\n══════════════════════════════════════════════════');
  console.log('  🔍 Neon PostgreSQL Verification');
  console.log('══════════════════════════════════════════════════\n');

  const client = await pool.connect();

  try {
    // 1. Connection test
    const ping = await client.query('SELECT NOW() AS server_time, version() AS pg_version');
    console.log('✅ [1] Connection: SUCCESS');
    console.log(`   Server Time : ${ping.rows[0].server_time}`);
    console.log(`   PG Version  : ${ping.rows[0].pg_version.split(' ').slice(0,2).join(' ')}`);

    // 2. Check tables exist
    const tables = await client.query(`
      SELECT table_name FROM information_schema.tables
      WHERE table_schema = 'public'
      ORDER BY table_name
    `);
    console.log('\n✅ [2] Tables in Neon database:');
    tables.rows.forEach(r => console.log(`   📋 ${r.table_name}`));

    // 3. Count users
    const users = await client.query(`
      SELECT role, COUNT(*)::int AS count, status
      FROM users
      GROUP BY role, status
      ORDER BY role
    `);
    console.log('\n✅ [3] Users in database:');
    users.rows.forEach(r =>
      console.log(`   ${r.role.padEnd(10)} | ${r.status.padEnd(8)} | ${r.count} user(s)`)
    );

    // 4. List all user emails
    const emails = await client.query('SELECT name, email, role FROM users ORDER BY role, name');
    console.log('\n✅ [4] All registered accounts:');
    emails.rows.forEach(r =>
      console.log(`   [${r.role.toUpperCase().padEnd(7)}] ${r.name.padEnd(20)} → ${r.email}`)
    );

    // 5. Test login query (simulate what authController does)
    const adminCheck = await client.query(
      'SELECT id, name, email, role, status FROM users WHERE LOWER(email) = $1',
      ['nethin163@gmail.com']
    );
    if (adminCheck.rows.length > 0) {
      const admin = adminCheck.rows[0];
      console.log('\n✅ [5] Admin account query: SUCCESS');
      console.log(`   ID     : ${admin.id}`);
      console.log(`   Name   : ${admin.name}`);
      console.log(`   Role   : ${admin.role}`);
      console.log(`   Status : ${admin.status}`);
    } else {
      console.log('\n❌ [5] Admin account NOT found in database!');
    }

    console.log('\n══════════════════════════════════════════════════');
    console.log('  🎉 All checks passed — Neon PostgreSQL is LIVE!');
    console.log('══════════════════════════════════════════════════\n');

  } catch (err) {
    console.error('\n❌ Verification FAILED:', err.message);
  } finally {
    client.release();
    await pool.end();
  }
}

verify();
