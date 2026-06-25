require('dotenv').config();
const { Pool } = require('pg');
const bcrypt = require('bcryptjs');

// Neon requires SSL — allow self-signed certs from their proxy
process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

// ─────────────────────────────────────────────────────────
// PostgreSQL Connection Pool (Neon Cloud)
// ─────────────────────────────────────────────────────────
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  max: 10,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 10000,
});

pool.on('error', (err) => {
  console.error('[DB] Unexpected pool error:', err.message);
});


// ─────────────────────────────────────────────────────────
// Helper wrappers (mimics old sqlite3 API shape)
// ─────────────────────────────────────────────────────────
const dbQuery = {
  // Run an INSERT / UPDATE / DELETE — returns { rowCount }
  async run(sql, params = []) {
    const client = await pool.connect();
    try {
      const result = await client.query(sql, params);
      return { rowCount: result.rowCount };
    } finally {
      client.release();
    }
  },

  // Fetch a single row — returns the row object or undefined
  async get(sql, params = []) {
    const client = await pool.connect();
    try {
      const result = await client.query(sql, params);
      return result.rows[0] || undefined;
    } finally {
      client.release();
    }
  },

  // Fetch all matching rows — returns array
  async all(sql, params = []) {
    const client = await pool.connect();
    try {
      const result = await client.query(sql, params);
      return result.rows;
    } finally {
      client.release();
    }
  },
};

// ─────────────────────────────────────────────────────────
// Initialize database tables and seed default users
// ─────────────────────────────────────────────────────────
const initDb = async () => {
  try {
    console.log('[DB] Connecting to Neon PostgreSQL...');

    // ── Create tables ────────────────────────────────────
    await dbQuery.run(`
      CREATE TABLE IF NOT EXISTS users (
        id          TEXT PRIMARY KEY,
        name        TEXT NOT NULL,
        email       TEXT UNIQUE NOT NULL,
        phone       TEXT,
        password    TEXT NOT NULL,
        role        TEXT NOT NULL DEFAULT 'citizen',
        avatar      TEXT,
        status      TEXT NOT NULL DEFAULT 'active',
        area        TEXT,
        date_joined TEXT
      )
    `);

    await dbQuery.run(`
      CREATE TABLE IF NOT EXISTS temp_registrations (
        email      TEXT PRIMARY KEY,
        name       TEXT NOT NULL,
        phone      TEXT,
        password   TEXT NOT NULL,
        otp        TEXT NOT NULL,
        created_at TIMESTAMPTZ DEFAULT NOW()
      )
    `);

    await dbQuery.run(`
      CREATE TABLE IF NOT EXISTS otp_verifications (
        email      TEXT PRIMARY KEY,
        otp        TEXT NOT NULL,
        verified   INTEGER DEFAULT 0,
        created_at TIMESTAMPTZ DEFAULT NOW()
      )
    `);

    console.log('[DB] Tables verified / created.');

    // ── Seed default users if empty ──────────────────────
    const countRow = await dbQuery.get('SELECT COUNT(*)::int AS count FROM users');
    const userCount = parseInt(countRow?.count || '0', 10);

    if (userCount === 0) {
      console.log('[DB] Seeding default users...');

      const defaultUsers = [
        {
          id: 'user-1',
          name: 'Aarav Sharma',
          email: 'citizen@gov.in',
          phone: '+91 98765 43210',
          password: 'citizen123',
          role: 'citizen',
          avatar: 'AS',
          status: 'active',
          area: 'Coimbatore Central Zone',
          date_joined: '2026-01-15',
        },
        {
          id: 'user-2',
          name: 'Nethra Swathi',
          email: 'nethraswathi17@gmail.com',
          phone: '+91 91234 56789',
          password: 'nethrasara',
          role: 'officer',
          avatar: 'NS',
          status: 'active',
          area: 'Coimbatore Central Zone',
          date_joined: '2025-11-20',
        },
        {
          id: 'user-3',
          name: 'Dr. Sunita Rao',
          email: 'officer2@gov.in',
          phone: '+91 93456 78901',
          password: 'officer123',
          role: 'officer',
          avatar: 'SR',
          status: 'active',
          area: 'Coimbatore South Zone',
          date_joined: '2025-12-05',
        },
        {
          id: 'user-4',
          name: 'Deepak Verma',
          email: 'officer3@gov.in',
          phone: '+91 94567 89012',
          password: 'officer123',
          role: 'officer',
          avatar: 'DV',
          status: 'active',
          area: 'Coimbatore West Zone',
          date_joined: '2026-02-10',
        },
        {
          id: 'user-5',
          name: 'Nethin Admin',
          email: 'nethin163@gmail.com',
          phone: '+91 99999 99999',
          password: '9894506871',
          role: 'admin',
          avatar: 'NA',
          status: 'active',
          area: 'National Headquarters',
          date_joined: '2025-08-01',
        },
        {
          id: 'user-6',
          name: 'Priya Patel',
          email: 'priya@example.com',
          phone: '+91 88776 65544',
          password: 'citizen123',
          role: 'citizen',
          avatar: 'PP',
          status: 'active',
          area: 'Coimbatore South Zone',
          date_joined: '2026-03-22',
        },
        {
          id: 'user-7',
          name: 'Karan Johar',
          email: 'karan@example.com',
          phone: '+91 77665 54433',
          password: 'citizen123',
          role: 'citizen',
          avatar: 'KJ',
          status: 'blocked',
          area: 'Coimbatore West Zone',
          date_joined: '2026-04-05',
        },
      ];

      for (const u of defaultUsers) {
        const hashed = await bcrypt.hash(u.password, 10);
        await dbQuery.run(
          `INSERT INTO users (id, name, email, phone, password, role, avatar, status, area, date_joined)
           VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
           ON CONFLICT (email) DO NOTHING`,
          [u.id, u.name, u.email.toLowerCase().trim(), u.phone, hashed, u.role, u.avatar, u.status, u.area, u.date_joined]
        );
      }

      console.log('[DB] Default users seeded successfully.');
    } else {
      console.log(`[DB] Database already has ${userCount} user(s) — skipping seed.`);
    }

    console.log('[DB] ✅ PostgreSQL (Neon) ready.');
  } catch (error) {
    console.error('[DB] ❌ Initialization error:', error.message);
    throw error;
  }
};

module.exports = { pool, dbQuery, initDb };
