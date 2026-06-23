const { dbQuery } = require('../config/db');

const UserModel = {
  // --- USER METHODS ---
  async findById(id) {
    return await dbQuery.get('SELECT * FROM users WHERE id = ?', [id]);
  },

  async findByEmail(email) {
    return await dbQuery.get('SELECT * FROM users WHERE LOWER(email) = ?', [email.toLowerCase().trim()]);
  },

  async create(user) {
    const { id, name, email, phone, password, role, avatar, status, area, dateJoined } = user;
    await dbQuery.run(`
      INSERT INTO users (id, name, email, phone, password, role, avatar, status, area, date_joined)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `, [
      id,
      name,
      email.toLowerCase().trim(),
      phone || null,
      password,
      role || 'citizen',
      avatar || '',
      status || 'active',
      area || 'Zone A - Central Delhi',
      dateJoined || new Date().toISOString().split('T')[0]
    ]);
    return await this.findById(id);
  },

  async updatePassword(email, newHashedPassword) {
    return await dbQuery.run(
      'UPDATE users SET password = ? WHERE LOWER(email) = ?',
      [newHashedPassword, email.toLowerCase().trim()]
    );
  },

  async countUsers() {
    const result = await dbQuery.get('SELECT COUNT(*) as count FROM users');
    return result.count;
  },

  // --- TEMP REGISTRATIONS METHODS ---
  async findTempByEmail(email) {
    return await dbQuery.get('SELECT * FROM temp_registrations WHERE LOWER(email) = ?', [email.toLowerCase().trim()]);
  },

  async createTemp(tempData) {
    const { email, name, phone, password, otp } = tempData;
    return await dbQuery.run(`
      INSERT OR REPLACE INTO temp_registrations (email, name, phone, password, otp)
      VALUES (?, ?, ?, ?, ?)
    `, [email.toLowerCase().trim(), name, phone || null, password, otp]);
  },

  async deleteTemp(email) {
    return await dbQuery.run('DELETE FROM temp_registrations WHERE LOWER(email) = ?', [email.toLowerCase().trim()]);
  },

  // --- OTP VERIFICATIONS METHODS (For Password Reset) ---
  async findResetOTP(email) {
    return await dbQuery.get('SELECT * FROM otp_verifications WHERE LOWER(email) = ?', [email.toLowerCase().trim()]);
  },

  async createResetOTP(email, otp) {
    return await dbQuery.run(`
      INSERT OR REPLACE INTO otp_verifications (email, otp, verified)
      VALUES (?, ?, 0)
    `, [email.toLowerCase().trim(), otp]);
  },

  async markResetOTPVerified(email) {
    return await dbQuery.run(
      'UPDATE otp_verifications SET verified = 1 WHERE LOWER(email) = ?',
      [email.toLowerCase().trim()]
    );
  },

  async deleteResetOTP(email) {
    return await dbQuery.run('DELETE FROM otp_verifications WHERE LOWER(email) = ?', [email.toLowerCase().trim()]);
  }
};

module.exports = UserModel;
