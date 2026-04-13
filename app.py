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

# 🔐 SECRET DESDE ENTORNO (RENDER)
SECRET_KEY = os.environ.get("SECRET_KEY", "dev_key")

users_db = {
    "admin@gps.com": {"nombre": "Admin", "password": generate_password_hash("1234"), "role": "admin"},
    "tech@gps.com": {"nombre": "Tech", "password": generate_password_hash("1234"), "role": "technician"}
}

refresh_store = {}

# 🔐 MIDDLEWARE TOKEN
def token_required(f):
    @wraps(f)
    def wrapper(*args, **kwargs):
        token = request.headers.get("Authorization", "").replace("Bearer ", "")
        if not token:
            return jsonify({"message": "Token faltante"}), 401
        try:
            request.user = jwt.decode(token, SECRET_KEY, algorithms=["HS256"])
        except jwt.ExpiredSignatureError:
            return jsonify({"message": "Token expirado"}), 401
        except:
            return jsonify({"message": "Token inválido"}), 401
        return f(*args, **kwargs)
    return wrapper

# 🔐 LOGIN
@app.route("/auth/login", methods=["POST"])
def login():
    data = request.get_json() or {}

    email = data.get("email")
    password = data.get("password")

    if not email or not password:
        return jsonify({"message": "Datos incompletos"}), 400

    user = users_db.get(email)

    if user and check_password_hash(user["password"], password):
        access_token = jwt.encode({
            "user": email,
            "role": user["role"],
            "exp": datetime.datetime.utcnow() + datetime.timedelta(minutes=15)
        }, SECRET_KEY)

        refresh_token = str(uuid.uuid4())

        refresh_store[refresh_token] = {
            "email": email,
            "exp": datetime.datetime.utcnow() + datetime.timedelta(days=7)
        }

        return jsonify({
            "access_token": access_token,
            "refresh_token": refresh_token
        })

    return jsonify({"message": "Credenciales inválidas"}), 401

# 🔄 REFRESH
@app.route("/auth/refresh", methods=["POST"])
def refresh():
    data = request.get_json() or {}
    rtoken = data.get("refresh_token")

    session = refresh_store.get(rtoken)

    if not session:
        return jsonify({"message": "Refresh inválido"}), 401

    if session["exp"] < datetime.datetime.utcnow():
        del refresh_store[rtoken]
        return jsonify({"message": "Refresh expirado"}), 401

    email = session["email"]
    user = users_db[email]

    new_token = jwt.encode({
        "user": email,
        "role": user["role"],
        "exp": datetime.datetime.utcnow() + datetime.timedelta(minutes=15)
    }, SECRET_KEY)

    return jsonify({"access_token": new_token})

# 👤 PERFIL
@app.route("/auth/me")
@token_required
def me():
    user = users_db.get(request.user["user"])
    return jsonify({
        "user": request.user["user"],
        "nombre": user["nombre"],
        "role": user["role"]
    })

# 🚪 LOGOUT
@app.route("/auth/logout", methods=["POST"])
def logout():
    data = request.get_json() or {}
    rtoken = data.get("refresh_token")

    if rtoken in refresh_store:
        del refresh_store[rtoken]

    return jsonify({"message": "Logout exitoso"})

if __name__ == "__main__":
    app.run()