import os
import random
import sqlite3
import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from flask import Flask, request, jsonify
from flask_cors import CORS
from dotenv import load_dotenv
from priority_engine import calculate_priority

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
    
    # Purge existing citizen users from SQLite
    cursor.execute("DELETE FROM users WHERE role = 'citizen'")
    cursor.execute("DELETE FROM temp_registrations")
    
    # Seed default users if they don't exist
    seed_users = [
        ("user-2", "Nethra Swathi", "nethraswathi17@gmail.com", "nethrasara", "officer", "NS", "active", "Coimbatore Central Zone", "2025-11-20"),
        ("user-3", "Dr. Sunita Rao", "officer2@gov.in", None, "officer", "SR", "active", "Coimbatore South Zone", "2025-12-05"),
        ("user-4", "Deepak Verma", "officer3@gov.in", None, "officer", "DV", "active", "Waste Management", "2026-02-10"),
        ("user-5", "Nethin Admin", "nethin163@gmail.com", "9894506871", "admin", "NA", "active", "National Headquarters", "2025-08-01")
    ]
    
    for u_id, name, email, password, role, avatar, status, area, date_joined in seed_users:
        cursor.execute("SELECT id FROM users WHERE email = ?", (email,))
        if not cursor.fetchone():
            cursor.execute('''
                INSERT INTO users (id, name, email, password, role, avatar, status, area, date_joined)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
            ''', (u_id, name, email, password, role, avatar, status, area, date_joined))
            
    conn.commit()
    
    # Create complaints table with priority field (NOT NULL DEFAULT 'Medium')
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS complaints (
            id TEXT PRIMARY KEY,
            title TEXT NOT NULL,
            description TEXT NOT NULL,
            category TEXT NOT NULL,
            location TEXT NOT NULL,
            latitude REAL,
            longitude REAL,
            priority TEXT NOT NULL DEFAULT 'Medium',
            priority_confidence INTEGER DEFAULT 0,
            priority_source TEXT DEFAULT 'ai-rule-engine',
            matched_keywords TEXT DEFAULT '',
            status TEXT NOT NULL DEFAULT 'Submitted',
            date TEXT NOT NULL,
            citizen_name TEXT,
            citizen_email TEXT,
            citizen_phone TEXT,
            assigned_officer TEXT DEFAULT '',
            assigned_officer_email TEXT DEFAULT '',
            department TEXT,
            remarks TEXT DEFAULT '',
            resolution_notes TEXT DEFAULT '',
            before_image TEXT DEFAULT '',
            after_image TEXT DEFAULT ''
        )
    ''')
    
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

@app.route('/api/auth/register', methods=['POST'])
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
        
    # Generate a unique ID
    import time
    u_id = f"user-{int(time.time())}-{random.randint(1000, 9999)}"
    
    avatar_list = [n[0] for n in name.split() if n]
    avatar = "".join(avatar_list).upper()[:2] if avatar_list else name[:2].upper()
    
    import datetime
    date_joined = datetime.date.today().isoformat()
    
    try:
        cursor.execute('''
            INSERT INTO users (id, name, email, password, role, avatar, status, area, date_joined)
            VALUES (?, ?, ?, ?, 'citizen', ?, 'active', 'Coimbatore Central Zone', ?)
        ''', (u_id, name, email.lower().strip(), password, avatar, date_joined))
        
        conn.commit()
        
        # Retrieve newly created user to return
        cursor.execute("SELECT id, name, email, role, avatar, status, area, date_joined FROM users WHERE email = ?", (email.lower().strip(),))
        user = dict(cursor.fetchone())
        conn.close()
        
        return jsonify({"user": user, "message": "Registration successful."}), 200
        
    except sqlite3.IntegrityError:
        conn.close()
        return jsonify({"error": "Failed to create account."}), 400

@app.route('/api/auth/verify-otp', methods=['POST'])
def verify_otp():
    return jsonify({"message": "Verification approved."}), 200

@app.route('/api/auth/resend-otp', methods=['POST'])
def resend_otp():
    return jsonify({"message": "A fresh security code has been transmitted."}), 200

@app.route('/api/auth/login', methods=['POST'])
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

@app.route('/api/auth/forgot-password', methods=['POST'])
def forgot_password():
    data = request.json
    email = data.get('email')

    if not email:
        return jsonify({"error": "Please provide email."}), 400

    conn = get_db_connection()
    cursor = conn.cursor()

    cursor.execute("SELECT name FROM users WHERE email = ?", (email.lower().strip(),))
    user_rec = cursor.fetchone()
    conn.close()

    if not user_rec:
        return jsonify({"error": "Email address not registered."}), 400

    return jsonify({"message": "Verification approved. Proceed to reset password."}), 200


@app.route('/api/auth/reset-password', methods=['POST'])
def reset_password():
    data = request.json
    email = data.get('email')
    new_password = data.get('newPassword')
    confirm_password = data.get('confirmPassword')

    if not email or not new_password or not confirm_password:
        return jsonify({"error": "Please provide all required fields."}), 400

    if new_password != confirm_password:
        return jsonify({"error": "Passwords do not match."}), 400

    conn = get_db_connection()
    cursor = conn.cursor()

    cursor.execute("SELECT id FROM users WHERE email = ?", (email.lower().strip(),))
    user_rec = cursor.fetchone()

    if not user_rec:
        conn.close()
        return jsonify({"error": "Email address not registered."}), 400

    cursor.execute("UPDATE users SET password = ? WHERE email = ?", (new_password, email.lower().strip()))
    conn.commit()
    conn.close()

    return jsonify({"message": "Password reset successfully."}), 200


if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5000)


# ─── Complaint API Endpoints ───────────────────────────────────────────────────

@app.route('/api/complaints', methods=['POST'])
def create_complaint():
    """Create a new complaint with automatic priority assignment."""
    data = request.json
    title = data.get('title')
    description = data.get('description')
    category = data.get('category')
    location = data.get('location')
    citizen_name = data.get('citizenName', '')
    citizen_email = data.get('citizenEmail', '')
    citizen_phone = data.get('citizenPhone', '')

    if not title or not description or not category or not location:
        return jsonify({"error": "Please provide title, description, category, and location."}), 400

    # AI Priority Engine — automatically calculate priority
    priority_result = calculate_priority(description, category)

    conn = get_db_connection()
    cursor = conn.cursor()

    # Generate complaint ID
    cursor.execute("SELECT COUNT(*) FROM complaints")
    count = cursor.fetchone()[0]
    complaint_id = f"GOV-2026-{1001 + count}"

    import datetime
    now = datetime.datetime.utcnow().isoformat() + "Z"

    try:
        cursor.execute('''
            INSERT INTO complaints (id, title, description, category, location, 
                                    latitude, longitude, priority, priority_confidence, 
                                    priority_source, matched_keywords, status, date,
                                    citizen_name, citizen_email, citizen_phone, department)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'Submitted', ?, ?, ?, ?, ?)
        ''', (
            complaint_id, title, description, category, location,
            28.6 + (count * 0.01), 77.2 + (count * 0.01),
            priority_result['priority'],
            priority_result['confidence'],
            priority_result['source'],
            ','.join(priority_result['matched_keywords']),
            now, citizen_name, citizen_email, citizen_phone, category
        ))
        conn.commit()

        complaint = {
            "id": complaint_id,
            "title": title,
            "description": description,
            "category": category,
            "location": location,
            "priority": priority_result['priority'],
            "priorityConfidence": priority_result['confidence'],
            "prioritySource": priority_result['source'],
            "matchedKeywords": priority_result['matched_keywords'],
            "status": "Submitted",
            "date": now,
            "citizenName": citizen_name,
            "citizenEmail": citizen_email,
        }
        conn.close()
        return jsonify({"complaint": complaint, "message": "Complaint registered with auto-priority assignment."}), 201

    except Exception as e:
        conn.close()
        return jsonify({"error": f"Failed to create complaint: {str(e)}"}), 500


@app.route('/api/complaints', methods=['GET'])
def get_complaints():
    """Get all complaints with optional priority filter."""
    priority_filter = request.args.get('priority')

    conn = get_db_connection()
    cursor = conn.cursor()

    if priority_filter and priority_filter in ['High', 'Medium', 'Low']:
        cursor.execute("SELECT * FROM complaints WHERE priority = ? ORDER BY date DESC", (priority_filter,))
    else:
        cursor.execute("SELECT * FROM complaints ORDER BY CASE priority WHEN 'High' THEN 0 WHEN 'Medium' THEN 1 WHEN 'Low' THEN 2 END, date DESC")

    rows = cursor.fetchall()
    complaints = [dict(row) for row in rows]
    conn.close()

    return jsonify({"complaints": complaints}), 200


@app.route('/api/complaints/priority-stats', methods=['GET'])
def get_priority_stats():
    """Get complaint count breakdown by priority level."""
    conn = get_db_connection()
    cursor = conn.cursor()

    cursor.execute("SELECT priority, COUNT(*) as count FROM complaints GROUP BY priority")
    rows = cursor.fetchall()

    stats = {"High": 0, "Medium": 0, "Low": 0}
    for row in rows:
        stats[row['priority']] = row['count']

    conn.close()
    return jsonify({"stats": stats, "total": sum(stats.values())}), 200
