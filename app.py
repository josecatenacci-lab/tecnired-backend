from flask import Flask, request, jsonify
from flask_cors import CORS
import jwt
import datetime
from functools import wraps
from werkzeug.security import generate_password_hash, check_password_hash
import uuid

app = Flask(__name__)
CORS(app)

SECRET_KEY = "enterprise_super_key_2026"

users_db = {
    "admin@gps.com": {"nombre": "Admin", "password": generate_password_hash("1234"), "role": "admin"},
    "tech@gps.com": {"nombre": "Tech", "password": generate_password_hash("1234"), "role": "technician"}
}

refresh_store = {}

def token_required(f):
    @wraps(f)
    def wrapper(*args, **kwargs):
        token = request.headers.get("Authorization", "").replace("Bearer ", "")
        if not token: return jsonify({"message": "Token faltante"}), 401
        try:
            request.user = jwt.decode(token, SECRET_KEY, algorithms=["HS256"])
        except jwt.ExpiredSignatureError: return jsonify({"message": "Token expirado"}), 401
        except: return jsonify({"message": "Token inválido"}), 401
        return f(*args, **kwargs)
    return wrapper

@app.route("/auth/login", methods=["POST"])
def login():
    data = request.get_json()
    user = users_db.get(data["email"])
    if user and check_password_hash(user["password"], data["password"]):
        access_token = jwt.encode({
            "user": data["email"], "role": user["role"],
            "exp": datetime.datetime.utcnow() + datetime.timedelta(minutes=15)
        }, SECRET_KEY)
        refresh_token = str(uuid.uuid4())
        refresh_store[refresh_token] = data["email"]
        return jsonify({"access_token": access_token, "refresh_token": refresh_token})
    return jsonify({"message": "Credenciales inválidas"}), 401

@app.route("/auth/refresh", methods=["POST"])
def refresh():
    rtoken = request.get_json().get("refresh_token")
    email = refresh_store.get(rtoken)
    if not email: return jsonify({"message": "Refresh inválido"}), 401
    user = users_db[email]
    new_token = jwt.encode({
        "user": email, "role": user["role"],
        "exp": datetime.datetime.utcnow() + datetime.timedelta(minutes=15)
    }, SECRET_KEY)
    return jsonify({"access_token": new_token})

@app.route("/auth/me")
@token_required
def me():
    user = users_db[request.user["user"]]
    return jsonify({"user": request.user["user"], "nombre": user["nombre"], "role": user["role"]})

if __name__ == "__main__":
    app.run(debug=True, host="0.0.0.0", port=5000)