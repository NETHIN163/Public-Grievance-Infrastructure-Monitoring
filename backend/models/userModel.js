const { dbQuery } = require('../config/db');

const UserModel = {
  // ── USER METHODS ─────────────────────────────────────────

  async findById(id) {
    return await dbQuery.get('SELECT * FROM users WHERE id = $1', [id]);
  },

  async findByEmail(email) {
    return await dbQuery.get(
      'SELECT * FROM users WHERE LOWER(email) = $1',
      [email.toLowerCase().trim()]
    );
  },

  async create(user) {
    const { id, name, email, phone, password, role, avatar, status, area, dateJoined } = user;
    await dbQuery.run(
      `INSERT INTO users (id, name, email, phone, password, role, avatar, status, area, date_joined)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)`,
      [
        id,
        name,
        email.toLowerCase().trim(),
        phone || null,
        password,
        role || 'citizen',
        avatar || '',
        status || 'active',
        area || 'Zone A - Central Delhi',
        dateJoined || new Date().toISOString().split('T')[0],
      ]
    );
    return await this.findById(id);
  },

  async updatePassword(email, newHashedPassword) {
    return await dbQuery.run(
      'UPDATE users SET password = $1 WHERE LOWER(email) = $2',
      [newHashedPassword, email.toLowerCase().trim()]
    );
  },

  async countUsers() {
    const result = await dbQuery.get('SELECT COUNT(*)::int AS count FROM users');
    return parseInt(result?.count || '0', 10);
  },

  // ── TEMP REGISTRATIONS ───────────────────────────────────

  async findTempByEmail(email) {
    return await dbQuery.get(
      'SELECT * FROM temp_registrations WHERE LOWER(email) = $1',
      [email.toLowerCase().trim()]
    );
  },

  async createTemp(tempData) {
    const { email, name, phone, password, otp } = tempData;
    return await dbQuery.run(
      `INSERT INTO temp_registrations (email, name, phone, password, otp)
       VALUES ($1, $2, $3, $4, $5)
       ON CONFLICT (email) DO UPDATE
         SET name = EXCLUDED.name,
             phone = EXCLUDED.phone,
             password = EXCLUDED.password,
             otp = EXCLUDED.otp,
             created_at = NOW()`,
      [email.toLowerCase().trim(), name, phone || null, password, otp]
    );
  },

  async deleteTemp(email) {
    return await dbQuery.run(
      'DELETE FROM temp_registrations WHERE LOWER(email) = $1',
      [email.toLowerCase().trim()]
    );
  },

  // ── OTP VERIFICATIONS (Password Reset) ──────────────────

  async findResetOTP(email) {
    return await dbQuery.get(
      'SELECT * FROM otp_verifications WHERE LOWER(email) = $1',
      [email.toLowerCase().trim()]
    );
  },

  async createResetOTP(email, otp) {
    return await dbQuery.run(
      `INSERT INTO otp_verifications (email, otp, verified)
       VALUES ($1, $2, 0)
       ON CONFLICT (email) DO UPDATE
         SET otp = EXCLUDED.otp,
             verified = 0,
             created_at = NOW()`,
      [email.toLowerCase().trim(), otp]
    );
  },

  async markResetOTPVerified(email) {
    return await dbQuery.run(
      'UPDATE otp_verifications SET verified = 1 WHERE LOWER(email) = $1',
      [email.toLowerCase().trim()]
    );
  },

  async deleteResetOTP(email) {
    return await dbQuery.run(
      'DELETE FROM otp_verifications WHERE LOWER(email) = $1',
      [email.toLowerCase().trim()]
    );
  },
};

module.exports = UserModel;
