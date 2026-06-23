const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const bcrypt = require('bcryptjs');

const dbPath = path.join(__dirname, '..', 'database.db');
const db = new sqlite3.Database(dbPath);

// Helper functions to wrap sqlite3 in Promises
const dbQuery = {
  run(sql, params = []) {
    return new Promise((resolve, reject) => {
      db.run(sql, params, function (err) {
        if (err) reject(err);
        else resolve({ lastID: this.lastID, changes: this.changes });
      });
    });
  },
  get(sql, params = []) {
    return new Promise((resolve, reject) => {
      db.get(sql, params, (err, row) => {
        if (err) reject(err);
        else resolve(row);
      });
    });
  },
  all(sql, params = []) {
    return new Promise((resolve, reject) => {
      db.all(sql, params, (err, rows) => {
        if (err) reject(err);
        else resolve(rows);
      });
    });
  }
};

const initDb = async () => {
  try {
    // Create users table
    await dbQuery.run(`
      CREATE TABLE IF NOT EXISTS users (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        email TEXT UNIQUE NOT NULL,
        phone TEXT,
        password TEXT NOT NULL,
        role TEXT NOT NULL,
        avatar TEXT,
        status TEXT NOT NULL,
        area TEXT,
        date_joined TEXT
      )
    `);

    // Create temporary registrations table for OTP verification
    await dbQuery.run(`
      CREATE TABLE IF NOT EXISTS temp_registrations (
        email TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        phone TEXT,
        password TEXT NOT NULL,
        otp TEXT NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Create OTP verifications table for password resets
    await dbQuery.run(`
      CREATE TABLE IF NOT EXISTS otp_verifications (
        email TEXT PRIMARY KEY,
        otp TEXT NOT NULL,
        verified INTEGER DEFAULT 0,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Check if table is empty to seed default users
    const userCountRow = await dbQuery.get('SELECT COUNT(*) as count FROM users');
    if (userCountRow.count === 0) {
      console.log('Seeding database with default users...');

      const defaultUsers = [
        {
          id: "user-1",
          name: "Aarav Sharma",
          email: "citizen@gov.in",
          phone: "+91 98765 43210",
          password: "citizen123",
          role: "citizen",
          avatar: "AS",
          status: "active",
          area: "Zone A - Central Delhi",
          date_joined: "2026-01-15"
        },
        {
          id: "user-2",
          name: "Nethra Swathi",
          email: "nethraswathi17@gmail.com",
          phone: "+91 91234 56789",
          password: "nethrasara",
          role: "officer",
          avatar: "NS",
          status: "active",
          area: "Zone A - Central Delhi",
          date_joined: "2025-11-20"
        },
        {
          id: "user-3",
          name: "Dr. Sunita Rao",
          email: "officer2@gov.in",
          phone: "+91 93456 78901",
          password: "officer123",
          role: "officer",
          avatar: "SR",
          status: "active",
          area: "Zone B - South Delhi",
          date_joined: "2025-12-05"
        },
        {
          id: "user-4",
          name: "Deepak Verma",
          email: "officer3@gov.in",
          phone: "+91 94567 89012",
          password: "officer123",
          role: "officer",
          avatar: "DV",
          status: "active",
          area: "Waste Management",
          date_joined: "2026-02-10"
        },
        {
          id: "user-5",
          name: "Nethin Admin",
          email: "nethin163@gmail.com",
          phone: "+91 99999 99999",
          password: "9894506871",
          role: "admin",
          avatar: "NA",
          status: "active",
          area: "National Headquarters",
          date_joined: "2025-08-01"
        },
        {
          id: "user-6",
          name: "Priya Patel",
          email: "priya@example.com",
          phone: "+91 88776 65544",
          password: "citizen123",
          role: "citizen",
          avatar: "PP",
          status: "active",
          area: "Zone B - South Delhi",
          date_joined: "2026-03-22"
        },
        {
          id: "user-7",
          name: "Karan Johar",
          email: "karan@example.com",
          phone: "+91 77665 54433",
          password: "citizen123",
          role: "citizen",
          avatar: "KJ",
          status: "blocked",
          area: "Zone C - West Delhi",
          date_joined: "2026-04-05"
        }
      ];

      for (const u of defaultUsers) {
        const hashedPassword = await bcrypt.hash(u.password, 10);
        await dbQuery.run(`
          INSERT INTO users (id, name, email, phone, password, role, avatar, status, area, date_joined)
          VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `, [
          u.id,
          u.name,
          u.email.toLowerCase().trim(),
          u.phone,
          hashedPassword,
          u.role,
          u.avatar,
          u.status,
          u.area,
          u.date_joined
        ]);
      }
      console.log('Database seeded successfully.');
    }
  } catch (error) {
    console.error('Database initialization error:', error);
  }
};

module.exports = {
  db,
  dbQuery,
  initDb
};
