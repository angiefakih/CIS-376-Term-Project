from flask import Flask, request, jsonify, send_from_directory
from flask_cors import CORS
import sqlite3
import os
import base64
import json
from datetime import datetime


UPLOAD_FOLDER = os.path.join(os.path.dirname(__file__), 'uploads')
os.makedirs(UPLOAD_FOLDER, exist_ok=True)

app = Flask(__name__)
DB_PATH = os.path.join(os.path.dirname(__file__), '../database/wardrobe.db')

def init_db():
    os.makedirs(os.path.dirname(DB_PATH), exist_ok=True)
    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            first_name TEXT,
            last_name TEXT,
            gender TEXT,
            email TEXT UNIQUE,
            password TEXT
        );
    ''')
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS clothing (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            user_id INTEGER,
            image TEXT,
            category TEXT,
            color TEXT,
            brand TEXT,
            season TEXT
        );
    ''')
    cursor.execute('''
    CREATE TABLE IF NOT EXISTS planned_outfits (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER NOT NULL,
        top TEXT,
        bottom TEXT,
        shoes TEXT,
        occasion TEXT NOT NULL,
        date TEXT,
        FOREIGN KEY (user_id) REFERENCES users(id)
    );
''')

    conn.commit()
    conn.close()

init_db()
CORS(app)

def get_db_connection():
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    return conn

@app.route("/register", methods=["POST"])
def register():
    data = request.json
    name = data.get("name")
    email = data.get("email")
    password = data.get("password")

    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM users WHERE email = ?", (email,))
    if cursor.fetchone():
        return jsonify({"error": "Email already in use"}), 400

    cursor.execute("INSERT INTO users (name, email, password) VALUES (?, ?, ?)", (name, email, password))
    conn.commit()
    conn.close()
    return jsonify({"message": "User registered successfully"}), 201

@app.route("/login", methods=["POST"])
def login():
    data = request.json
    email = data.get("email")
    password = data.get("password")

    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM users WHERE email = ? AND password = ?", (email, password))
    user = cursor.fetchone()
    conn.close()

    if user:
        return jsonify({"message": "Login successful", "user_id": user["id"]})
    else:
        return jsonify({"error": "Invalid email or password"}), 401

@app.route('/signup', methods=['POST'])
def signup():
    data = request.get_json()
    print("🔐 Signup data:", data)

    conn = get_db_connection()
    cursor = conn.cursor()

    try:
        cursor.execute("""
            INSERT INTO users (email, password, first_name, last_name, gender)
            VALUES (?, ?, ?, ?, ?)
        """, (
            data['email'],
            data['password'],
            data['first_name'],
            data['last_name'],
            data['gender']
        ))
        conn.commit()
        return jsonify({"message": "Account created successfully"}), 201

    except sqlite3.IntegrityError:
        return jsonify({"error": "Email is already in use"}), 400

    except Exception as e:
        print("Signup error:", e)
        return jsonify({"error": "Internal server error"}), 500

    finally:
        conn.close()

@app.route('/upload', methods=['POST'])
def upload_clothing():
    data = request.get_json()
    user_id = data.get('user_id')
    image_data = data.get('image_data')
    category = data.get('category')
    color = data.get('color')
    brand = data.get('brand')
    season = data.get('season')

    print("📦 Uploading clothing data...")
    print("Received fields:", data)

    if not all([user_id, image_data, category, color, brand, season]):
        print("⚠️ Missing required fields")
        return jsonify({'error': 'Missing required fields'}), 400

    try:
        # Save image
        filename = f"{user_id}_{datetime.utcnow().timestamp()}.jpg"
        filepath = os.path.join(UPLOAD_FOLDER, filename)

        with open(filepath, "wb") as f:
            f.write(base64.b64decode(image_data))

        image_path = f"/uploads/{filename}"

        # Insert into DB
        conn = get_db_connection()
        cursor = conn.cursor()
        cursor.execute("""
            INSERT INTO clothing (user_id, image, category, color, brand, season)
            VALUES (?, ?, ?, ?, ?, ?)
        """, (user_id, image_path, category, color, brand, season))
        conn.commit()
        conn.close()

        print("✅ Upload success. Returning:", image_path)
        return jsonify({'message': 'Item uploaded successfully', 'image_path': image_path}), 200

    except Exception as e:
        print("❌ Upload error:", e)
        return jsonify({'error': 'Server error'}), 500

@app.route("/wardrobe/<int:user_id>", methods=["GET"])
def get_wardrobe(user_id):
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM clothing WHERE user_id = ?", (user_id,))
    items = [dict(row) for row in cursor.fetchall()]
    conn.close()
    return jsonify(items)

@app.route('/uploads/<filename>')
def uploaded_file(filename):
    return send_from_directory(UPLOAD_FOLDER, filename)


@app.route('/get_user_clothing/<int:user_id>/<category>', methods=['GET'])
def get_user_clothing(user_id, category):
    try:
        conn = get_db_connection()
        items = conn.execute(
            'SELECT * FROM clothing WHERE user_id = ? AND LOWER(category) = LOWER(?)',
            (user_id, category)
        ).fetchall()
        conn.close()

        clothing_list = [dict(item) for item in items]
        return jsonify(clothing_list)
    except Exception as e:
        print("Error in get_user_clothing:", e)
        return jsonify({'error': 'Something went wrong'}), 500



@app.route("/wardrobe/<int:item_id>", methods=["DELETE"])
def delete_clothing_item(item_id):
    try:
        conn = get_db_connection()
        cursor = conn.cursor()
        cursor.execute("DELETE FROM clothing WHERE id = ?", (item_id,))
        conn.commit()
        conn.close()
        return jsonify({'message': 'Item deleted successfully'})
    except Exception as e:
        print("Delete error:", e)
        return jsonify({'error': 'Failed to delete item'}), 500
    

@app.route('/plan-outfit', methods=['POST'])
def plan_outfit():
    data = request.get_json()

    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute('''
        INSERT INTO planned_outfits (user_id, top, bottom, shoes, occasion, date)
        VALUES (?, ?, ?, ?, ?, ?)
    ''', (
        data['user_id'],
        data.get('top'),
        data.get('bottom'),
        data.get('shoes'),
        data['occasion'],
        data.get('date')
    ))
    conn.commit()
    conn.close()

    return jsonify({"message": "Outfit saved successfully"}), 201


    
# Add to your backend (app.py)
@app.route('/planned-outfits/<int:user_id>', methods=['GET'])
def get_planned_outfits(user_id):
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM planned_outfits WHERE user_id = ?", (user_id,))
    outfits = [dict(row) for row in cursor.fetchall()]
    conn.close()
    return jsonify(outfits)


if __name__ == "__main__":
    app.run(host='0.0.0.0', port=5000)
