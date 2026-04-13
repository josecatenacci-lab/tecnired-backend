from flask import Flask, request, jsonify
from flask_cors import CORS
import jwt
import datetime
from functools import wraps
from werkzeug.security import generate_password_hash, check_password_hash
import uuid
import os

app = Flask(__name__)
CORS(app)

SECRET_KEY = os.environ.get("SECRET_KEY", "dev_key_super_secreta_123")

# 👥 DB SIMULADA
users_db = {
    "admin@gps.com": {
        "nombre": "Administrador Principal",
        "password": generate_password_hash("1234"),
        "role": "admin"
    },
    "tech@gps.com": {
        "nombre": "Técnico de Campo",
        "password": generate_password_hash("1234"),
        "role": "technician"
    }
}

refresh_store = {}

# --- NUEVA RUTA: REGISTER ---
@app.route("/auth/register", methods=["POST"])
def register():
    data = request.get_json() or {}
    username = data.get("username")
    email = data.get("email")
    password = data.get("password")
    role = data.get("role", "technician") # Por defecto técnico

    if not username or not email or not password:
        return jsonify({"message": "Faltan datos obligatorios"}), 400

    if email in users_db:
        return jsonify({"message": "El usuario ya existe"}), 400

    # Guardamos el nuevo usuario en nuestra "DB"
    users_db[email] = {
        "nombre": username,
        "password": generate_password_hash(password),
        "role": role
    }

    print(f"DEBUG: Nuevo usuario registrado: {email} con rol {role}")
    return jsonify({"message": "Usuario registrado exitosamente"}), 201

# --- RESTO DE TUS RUTAS ---

@app.route("/auth/login", methods=["POST"])
def login():
    data = request.get_json() or {}
    email = data.get("email")
    password = data.get("password")

    if not email or not password:
        return jsonify({"message": "Email y contraseña requeridos"}), 400

    user = users_db.get(email)

    if user and check_password_hash(user["password"], password):
        access_token = jwt.encode({
            "user": email,
            "role": user["role"],
            "iat": datetime.datetime.utcnow(),
            "exp": datetime.datetime.utcnow() + datetime.timedelta(minutes=30)
        }, SECRET_KEY, algorithm="HS256")

        refresh_token = str(uuid.uuid4())
        refresh_store[refresh_token] = {
            "email": email,
            "exp": datetime.datetime.utcnow() + datetime.timedelta(days=7)
        }

        return jsonify({
            "access_token": access_token,
            "refresh_token": refresh_token
        }), 200

    return jsonify({"message": "Credenciales inválidas"}), 401

# (Mantenemos el resto de tus funciones refresh, me, logout igual...)

@app.route("/auth/refresh", methods=["POST"])
def refresh():
    data = request.get_json() or {}
    rtoken = data.get("refresh_token")
    session = refresh_store.get(rtoken)
    if not session or session["exp"] < datetime.datetime.utcnow():
        if rtoken in refresh_store: del refresh_store[rtoken]
        return jsonify({"message": "Sesión expirada"}), 401
    
    user = users_db[session["email"]]
    new_token = jwt.encode({
        "user": session["email"],
        "role": user["role"],
        "iat": datetime.datetime.utcnow(),
        "exp": datetime.datetime.utcnow() + datetime.timedelta(minutes=30)
    }, SECRET_KEY, algorithm="HS256")
    return jsonify({"access_token": new_token}), 200

@app.route("/auth/logout", methods=["POST"])
def logout():
    data = request.get_json() or {}
    rtoken = data.get("refresh_token")
    if rtoken in refresh_store: del refresh_store[rtoken]
    return jsonify({"message": "Sesión cerrada"}), 200

if __name__ == "__main__":
    port = int(os.environ.get("PORT", 5000))
    app.run(host="0.0.0.0", port=port)