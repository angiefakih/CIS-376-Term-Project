from flask import Flask, request, jsonify
from werkzeug.security import generate_password_hash, check_password_hash

app = Flask(__name__)

# In-memory user storage for testing
users = {}

# --- GET routes (for testing in browser) ---
@app.route("/")
def home():
    return "✅ Flask is running!"

@app.route("/signup", methods=["GET"])
def signup_get():
    return "❗ Use POST method to sign up."

@app.route("/login", methods=["GET"])
def login_get():
    return "❗ Use POST method to log in."

# --- POST route for signing up a user ---
@app.route("/signup", methods=["POST"])
def signup():
    data = request.get_json()
    email = data.get("email")
    password = data.get("password")

    if not email or not password:
        return jsonify({"error": "Missing email or password"}), 400

    if email in users:
        return jsonify({"error": "Email already registered"}), 409

    hashed_pw = generate_password_hash(password)
    users[email] = hashed_pw

    return jsonify({"message": "Signup successful"}), 201

# --- POST route for logging in a user ---
@app.route("/login", methods=["POST"])
def login():
    data = request.get_json()
    email = data.get("email")
    password = data.get("password")

    if not email or not password:
        return jsonify({"error": "Missing email or password"}), 400

    hashed_pw = users.get(email)
    if hashed_pw and check_password_hash(hashed_pw, password):
        return jsonify({"message": "Login successful"}), 200
    else:
        return jsonify({"error": "Invalid email or password"}), 401

# --- Run the app ---
if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000, debug=True)

