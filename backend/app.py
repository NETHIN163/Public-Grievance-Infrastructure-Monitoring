import os
import random
import sqlite3
import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from flask import Flask, request, jsonify
from flask_cors import CORS
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

app = Flask(__name__)
# Enable CORS for frontend dev server access
CORS(app, resources={r"/api/*": {"origins": "*"}})

DATABASE_PATH = os.path.join(os.path.dirname(__file__), 'database.db')

def get_db_connection():
    conn = sqlite3.connect(DATABASE_PATH)
    conn.row_factory = sqlite3.Row
    return conn

def init_db():
    conn = get_db_connection()
    cursor = conn.cursor()
    
    # Create users table
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS users (
            id TEXT PRIMARY KEY,
            name TEXT NOT NULL,
            email TEXT NOT NULL UNIQUE,
            password TEXT,
            role TEXT NOT NULL,
            avatar TEXT,
            status TEXT NOT NULL,
            area TEXT,
            date_joined TEXT
        )
    ''')
    
    # Create temporary registrations table for OTP verification
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS temp_registrations (
            email TEXT PRIMARY KEY,
            name TEXT NOT NULL,
            password TEXT NOT NULL,
            otp TEXT NOT NULL,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
    ''')
    
    # Seed default users if they don't exist
    seed_users = [
        ("user-1", "Aarav Sharma", "citizen@gov.in", None, "citizen", "AS", "active", "Zone A - Central Delhi", "2026-01-15"),
        ("user-2", "Nethra Swathi", "nethraswathi17@gmail.com", "nethrasara", "officer", "NS", "active", "Zone A - Central Delhi", "2025-11-20"),
        ("user-3", "Dr. Sunita Rao", "officer2@gov.in", None, "officer", "SR", "active", "Zone B - South Delhi", "2025-12-05"),
        ("user-4", "Deepak Verma", "officer3@gov.in", None, "officer", "DV", "active", "Waste Management", "2026-02-10"),
        ("user-5", "Nethin Admin", "nethin163@gmail.com", "9894506871", "admin", "NA", "active", "National Headquarters", "2025-08-01"),
        ("user-6", "Priya Patel", "priya@example.com", None, "citizen", "PP", "active", "Zone B - South Delhi", "2026-03-22")
    ]
    
    for u_id, name, email, password, role, avatar, status, area, date_joined in seed_users:
        cursor.execute("SELECT id FROM users WHERE email = ?", (email,))
        if not cursor.fetchone():
            cursor.execute('''
                INSERT INTO users (id, name, email, password, role, avatar, status, area, date_joined)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
            ''', (u_id, name, email, password, role, avatar, status, area, date_joined))
            
    conn.commit()
    conn.close()

def send_otp_email(to_email, otp):
    smtp_email = os.getenv('SMTP_EMAIL')
    smtp_password = os.getenv('SMTP_PASSWORD')
    smtp_server = os.getenv('SMTP_SERVER', 'smtp.gmail.com')
    smtp_port = int(os.getenv('SMTP_PORT', '587'))
    
    # Check if SMTP details are loaded, else mock
    if not smtp_email or not smtp_password:
        print(f"\n========================================================")
        print(f"[MOCK EMAIL] OTP for {to_email} is {otp}")
        print(f"========================================================\n")
        return True

    try:
        msg = MIMEMultipart()
        msg['From'] = smtp_email
        msg['To'] = to_email
        msg['Subject'] = "Your Grievance Portal Security Verification Code"
        
        body = f"""
        <html>
            <body style="font-family: Arial, sans-serif; background-color: #f8fafc; padding: 20px; color: #1e293b;">
                <div style="max-width: 500px; margin: 0 auto; background-color: #ffffff; padding: 30px; border-radius: 12px; border: 1px solid #e2e8f0; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.05);">
                    <div style="text-align: center; border-bottom: 2px solid #3b82f6; padding-bottom: 15px;">
                        <h2 style="color: #1e3a8a; margin: 0;">Grievance REDRESSAL CELL</h2>
                        <span style="font-size: 10px; font-weight: bold; color: #64748b; letter-spacing: 1px; text-transform: uppercase;">Ministry of Urban Governance</span>
                    </div>
                    <div style="padding: 20px 0;">
                        <p style="margin: 0 0 10px 0; font-size: 14px;">Greetings,</p>
                        <p style="margin: 0 0 20px 0; font-size: 14px; line-height: 1.5;">You are registering or verifying your account on the Public Grievance & Infrastructure Monitoring Portal. Please use the following 6-digit verification code to complete your secure setup:</p>
                        <div style="background-color: #eff6ff; padding: 15px; border-radius: 8px; text-align: center; font-size: 28px; font-weight: bold; color: #1d4ed8; letter-spacing: 8px; border: 1px dashed #bfdbfe; margin-bottom: 20px;">
                            {otp}
                        </div>
                        <p style="margin: 0 0 10px 0; font-size: 12px; color: #ef4444; font-weight: bold;">Note: This verification code is valid for 10 minutes. Do not share this OTP with anyone.</p>
                    </div>
                    <div style="border-t: 1px solid #e2e8f0; padding-top: 15px; text-align: center; font-size: 11px; color: #94a3b8;">
                        <p>© 2026 National Infrastructure & Grievance Redressal Cell. Secure Gateway.</p>
                    </div>
                </div>
            </body>
        </html>
        """
        
        msg.attach(MIMEText(body, 'html'))
        
        server = smtplib.SMTP(smtp_server, smtp_port)
        server.starttls()
        server.login(smtp_email, smtp_password)
        server.sendmail(smtp_email, to_email, msg.as_string())
        server.quit()
        print(f"SMTP Email successfully dispatched to {to_email}")
        return True
    except Exception as e:
        print(f"SMTP sending failed: {e}. Falling back to terminal log:")
        print(f"\n========================================================")
        print(f"[FALLBACK LOG] OTP for {to_email} is {otp}")
        print(f"========================================================\n")
        return False

# Initialize database on startup
init_db()

@app.route('/api/register', methods=['POST'])
def register():
    data = request.json
    name = data.get('name')
    email = data.get('email')
    password = data.get('password')
    
    if not name or not email or not password:
        return jsonify({"error": "Please provide name, email, and password."}), 400
        
    conn = get_db_connection()
    cursor = conn.cursor()
    
    # Check if user already registered
    cursor.execute("SELECT id FROM users WHERE email = ?", (email.lower().strip(),))
    if cursor.fetchone():
        conn.close()
        return jsonify({"error": "Email address already registered."}), 400
        
    # Generate OTP
    otp = str(random.randint(100000, 999999))
    
    # Save registration info in temp store
    cursor.execute('''
        INSERT OR REPLACE INTO temp_registrations (email, name, password, otp)
        VALUES (?, ?, ?, ?)
    ''', (email.lower().strip(), name, password, otp))
    
    conn.commit()
    conn.close()
    
    # Dispatch OTP email
    send_otp_email(email.lower().strip(), otp)
    
    return jsonify({"message": "Verification code dispatched to your email."}), 200

@app.route('/api/verify-otp', methods=['POST'])
def verify_otp():
    data = request.json
    email = data.get('email')
    otp = data.get('otp')
    
    if not email or not otp:
        return jsonify({"error": "Please provide email and verification code."}), 400
        
    conn = get_db_connection()
    cursor = conn.cursor()
    
    # Find temp registration
    cursor.execute("SELECT name, password, otp FROM temp_registrations WHERE email = ?", (email.lower().strip(),))
    record = cursor.fetchone()
    
    if not record:
        conn.close()
        return jsonify({"error": "Verification context expired or not found. Please register again."}), 400
        
    if record['otp'] != otp:
        conn.close()
        return jsonify({"error": "Invalid verification code. Please check and try again."}), 400
        
    # Check if user already exists (e.g. login or password reset flow)
    cursor.execute("SELECT id, name, email, role, avatar, status, area, date_joined FROM users WHERE email = ?", (email.lower().strip(),))
    existing_user_row = cursor.fetchone()
    if existing_user_row:
        cursor.execute("DELETE FROM temp_registrations WHERE email = ?", (email.lower().strip(),))
        conn.commit()
        user_data = dict(existing_user_row)
        conn.close()
        return jsonify({"user": user_data, "message": "Verification approved."}), 200

    # New citizen registration flow
    name = record['name']
    password = record['password']
    
    # Get total count to create next id
    cursor.execute("SELECT COUNT(*) FROM users")
    count = cursor.fetchone()[0]
    u_id = f"user-{count + 1}"
    
    avatar_list = [n[0] for n in name.split() if n]
    avatar = "".join(avatar_list).upper()[:2] if avatar_list else name[:2].upper()
    
    import datetime
    date_joined = datetime.date.today().isoformat()
    
    try:
        cursor.execute('''
            INSERT INTO users (id, name, email, password, role, avatar, status, area, date_joined)
            VALUES (?, ?, ?, ?, 'citizen', ?, 'active', 'Zone A - Central Delhi', ?)
        ''', (u_id, name, email.lower().strip(), password, avatar, date_joined))
        
        # Remove from temp storage
        cursor.execute("DELETE FROM temp_registrations WHERE email = ?", (email.lower().strip(),))
        conn.commit()
        
        # Retrieve newly created user to log in
        cursor.execute("SELECT id, name, email, role, avatar, status, area, date_joined FROM users WHERE email = ?", (email.lower().strip(),))
        user = dict(cursor.fetchone())
        conn.close()
        
        return jsonify({"user": user, "message": "Verification approved. Account activated successfully."}), 200
        
    except sqlite3.IntegrityError:
        conn.close()
        return jsonify({"error": "Failed to create account. Email may have been registered during verification."}), 400

@app.route('/api/resend-otp', methods=['POST'])
def resend_otp():
    data = request.json
    email = data.get('email')
    
    if not email:
        return jsonify({"error": "Please provide email."}), 400
        
    conn = get_db_connection()
    cursor = conn.cursor()
    
    cursor.execute("SELECT name, password FROM temp_registrations WHERE email = ?", (email.lower().strip(),))
    record = cursor.fetchone()
    
    otp = str(random.randint(100000, 999999))
    
    if record:
        cursor.execute("UPDATE temp_registrations SET otp = ? WHERE email = ?", (otp, email.lower().strip()))
    else:
        # Check if the user is an existing user requesting reset
        cursor.execute("SELECT name FROM users WHERE email = ?", (email.lower().strip(),))
        user_rec = cursor.fetchone()
        if not user_rec:
            conn.close()
            return jsonify({"error": "Email address not registered."}), 400
            
        cursor.execute('''
            INSERT OR REPLACE INTO temp_registrations (email, name, password, otp)
            VALUES (?, ?, 'reset_pending', ?)
        ''', (email.lower().strip(), user_rec['name'], otp))
        
    conn.commit()
    conn.close()
    
    send_otp_email(email.lower().strip(), otp)
    return jsonify({"message": "A fresh 6-digit security code has been transmitted to your inbox."}), 200

@app.route('/api/login', methods=['POST'])
def login():
    data = request.json
    email = data.get('email')
    password = data.get('password')
    
    if not email or not password:
        return jsonify({"error": "Please provide email and password."}), 400
        
    conn = get_db_connection()
    cursor = conn.cursor()
    
    cursor.execute("SELECT id, name, email, password, role, avatar, status, area, date_joined FROM users WHERE email = ?", (email.lower().strip(),))
    user_row = cursor.fetchone()
    conn.close()
    
    if not user_row:
        return jsonify({"error": "Invalid credentials. Please verify and try again."}), 401
        
    user = dict(user_row)
    
    if user['status'] == 'blocked':
        return jsonify({"error": "This account has been suspended due to security violations."}), 403
        
    # Check passwords
    is_correct = False
    db_password = user['password']
    
    # Custom admin and officer password validation
    if user['role'] in ['admin', 'officer']:
        if user['email'] == 'nethin163@gmail.com' and password == '9894506871':
            is_correct = True
        elif user['email'] == 'nethraswathi17@gmail.com' and password == 'nethrasara':
            is_correct = True
    else:
        # Citizens
        if db_password:
            is_correct = db_password == password
        else:
            is_correct = True # Seed mock citizen allows any password
            
    if not is_correct:
        return jsonify({"error": "Invalid credentials. Please verify and try again."}), 401
        
    # Remove password from response for security
    user.pop('password', None)
    return jsonify({"user": user, "message": "Authentication successful."}), 200

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5000)
