const http = require('http');

const request = (path, method, data) => {
  return new Promise((resolve, reject) => {
    const postData = JSON.stringify(data);
    const options = {
      hostname: 'localhost',
      port: 5000,
      path: path,
      method: method,
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': postData ? Buffer.byteLength(postData) : 0
      }
    };

    const req = http.request(options, (res) => {
      let body = '';
      res.on('data', (chunk) => body += chunk);
      res.on('end', () => {
        try {
          resolve({
            statusCode: res.statusCode,
            data: body ? JSON.parse(body) : null
          });
        } catch (e) {
          resolve({
            statusCode: res.statusCode,
            data: body
          });
        }
      });
    });

    req.on('error', (e) => reject(e));
    if (postData) {
      req.write(postData);
    }
    req.end();
  });
};

const runTests = async () => {
  console.log('--- STARTING AUTH API VERIFICATION TESTS ---');

  try {
    // 1. Health check
    console.log('\n1. Verifying API health check...');
    const health = await request('/api/health', 'GET');
    console.log(`Status: ${health.statusCode}, Response:`, health.data);
    if (health.statusCode !== 200) throw new Error('Health check failed');

    // 2. Login as Pre-seeded Admin
    console.log('\n2. Testing login with pre-seeded Admin account (nethin163@gmail.com)...');
    const adminLogin = await request('/api/auth/login', 'POST', {
      email: 'nethin163@gmail.com',
      password: '9894506871'
    });
    console.log(`Status: ${adminLogin.statusCode}`);
    console.log('User Role:', adminLogin.data?.user?.role);
    console.log('Has Token:', !!adminLogin.data?.token);
    if (adminLogin.statusCode !== 200 || !adminLogin.data?.token) {
      throw new Error('Admin login failed');
    }

    // 3. Register a new user
    console.log('\n3. Testing new user registration (test_citizen@gov.in)...');
    const regRes = await request('/api/auth/register', 'POST', {
      name: 'Test Citizen',
      email: 'test_citizen@gov.in',
      phone: '9988776655',
      password: 'testpassword123',
      confirmPassword: 'testpassword123'
    });
    console.log(`Status: ${regRes.statusCode}, Response:`, regRes.data);
    if (regRes.statusCode !== 200) throw new Error('User registration initiation failed');

    // For testing verification, we'll read database.db using sqlite3 directly or use a mock test
    // Wait, the db seeder generates a random OTP and writes it to temp_registrations.
    // Let's connect to the SQLite DB directly in this node test script to extract the verification code!
    console.log('\n4. Fetching verification code from SQLite temp_registrations...');
    const sqlite3 = require('sqlite3').verbose();
    const path = require('path');
    const dbPath = path.join(__dirname, 'database.db');
    const db = new sqlite3.Database(dbPath);
    
    const getOTP = () => new Promise((res) => {
      db.get('SELECT otp FROM temp_registrations WHERE email = ?', ['test_citizen@gov.in'], (err, row) => {
        res(row ? row.otp : null);
      });
    });

    const otp = await getOTP();
    console.log(`Fetched OTP code: ${otp}`);
    if (!otp) throw new Error('OTP was not saved in temp_registrations');

    // 5. Verify OTP
    console.log('\n5. Submitting OTP verification...');
    const verifyRes = await request('/api/auth/verify-otp', 'POST', {
      email: 'test_citizen@gov.in',
      otp: otp
    });
    console.log(`Status: ${verifyRes.statusCode}`);
    console.log('Response User:', verifyRes.data?.user);
    console.log('Response Token:', !!verifyRes.data?.token);
    if (verifyRes.statusCode !== 200 || !verifyRes.data?.token) {
      throw new Error('OTP Verification failed');
    }

    // 6. Login as new Citizen
    console.log('\n6. Testing login with new Citizen account...');
    const citizenLogin = await request('/api/auth/login', 'POST', {
      email: 'test_citizen@gov.in',
      password: 'testpassword123'
    });
    console.log(`Status: ${citizenLogin.statusCode}`);
    console.log('User Details:', citizenLogin.data?.user);
    if (citizenLogin.statusCode !== 200) throw new Error('Citizen login failed');

    // 7. Forgot Password Flow
    console.log('\n7. Initiating password reset...');
    const forgotRes = await request('/api/auth/forgot-password', 'POST', {
      email: 'test_citizen@gov.in'
    });
    console.log(`Status: ${forgotRes.statusCode}, Response:`, forgotRes.data);
    if (forgotRes.statusCode !== 200) throw new Error('Forgot password initiation failed');

    // Fetch reset OTP from database
    const getResetOTP = () => new Promise((res) => {
      db.get('SELECT otp FROM otp_verifications WHERE email = ?', ['test_citizen@gov.in'], (err, row) => {
        res(row ? row.otp : null);
      });
    });
    const resetOtp = await getResetOTP();
    console.log(`Fetched Reset OTP: ${resetOtp}`);

    // Verify Reset OTP
    console.log('\n8. Verifying reset OTP...');
    const verifyResetRes = await request('/api/auth/verify-otp', 'POST', {
      email: 'test_citizen@gov.in',
      otp: resetOtp
    });
    console.log(`Status: ${verifyResetRes.statusCode}, Response:`, verifyResetRes.data);
    if (verifyResetRes.statusCode !== 200) throw new Error('Reset OTP verification failed');

    // Reset password
    console.log('\n9. Resetting password to new credentials (newsecurepassword456)...');
    const resetRes = await request('/api/auth/reset-password', 'POST', {
      email: 'test_citizen@gov.in',
      otp: resetOtp,
      newPassword: 'newsecurepassword456',
      confirmPassword: 'newsecurepassword456'
    });
    console.log(`Status: ${resetRes.statusCode}, Response:`, resetRes.data);
    if (resetRes.statusCode !== 200) throw new Error('Password reset failed');

    // Try logging in with the old password (should fail)
    console.log('\n10. Testing login with outdated password (should fail)...');
    const oldCitizenLogin = await request('/api/auth/login', 'POST', {
      email: 'test_citizen@gov.in',
      password: 'testpassword123'
    });
    console.log(`Status: ${oldCitizenLogin.statusCode} (Expected: 401), Response:`, oldCitizenLogin.data);
    if (oldCitizenLogin.statusCode === 200) throw new Error('Login succeeded with old password, update failed');

    // Try logging in with the new password (should succeed)
    console.log('\n11. Testing login with new password (should succeed)...');
    const newCitizenLogin = await request('/api/auth/login', 'POST', {
      email: 'test_citizen@gov.in',
      password: 'newsecurepassword456'
    });
    console.log(`Status: ${newCitizenLogin.statusCode} (Expected: 200)`);
    if (newCitizenLogin.statusCode !== 200) throw new Error('Login failed with new password');

    console.log('\n--- ALL AUTH API ENDPOINT TESTS COMPLETED SUCCESSFULLY ---');
    db.close();
  } catch (error) {
    console.error('\n--- TEST FLOW FAILED ---');
    console.error(error);
  }
};

runTests();
