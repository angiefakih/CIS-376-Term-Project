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
    first_name = data.get("first_name")
    last_name = data.get("last_name")
    gender = data.get("gender")

    if not all([email, password, first_name, last_name, gender]):
        return jsonify({"error": "Missing required fields"}), 400

    if email in users:
        return jsonify({"error": "Email already registered"}), 409

    hashed_pw = generate_password_hash(password)
    users[email] = {
        "password": hashed_pw,
        "first_name": first_name,
        "last_name": last_name,
        "gender": gender
    }

    return jsonify({"message": f"Signup successful. Welcome {first_name}!"}), 201

# --- POST route for logging in a user ---
@app.route("/login", methods=["POST"])
def login():
    data = request.get_json()
    email = data.get("email")
    password = data.get("password")

    if not email or not password:
        return jsonify({"error": "Missing email or password"}), 400

    user = users.get(email)
    if user and check_password_hash(user["password"], password):
        return jsonify({"message": "Login successful"}), 200
    else:
        return jsonify({"error": "Invalid email or password"}), 401

# --- Run the app ---
if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000, debug=True)
   

