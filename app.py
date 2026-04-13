from flask import Flask, request, jsonify
from flask_cors import CORS
from flask_sqlalchemy import SQLAlchemy
import jwt
import datetime
from functools import wraps
from werkzeug.security import generate_password_hash, check_password_hash
import uuid
import os

app = Flask(__name__)
CORS(app)

# 🔐 CONFIGURACIÓN
SECRET_KEY = os.environ.get("SECRET_KEY", "dev_key_super_secreta_123")
app.config['SQLALCHEMY_DATABASE_URI'] = os.environ.get("DATABASE_URL")
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

db = SQLAlchemy(app)

# 👥 MODELO DE USUARIO
class User(db.Model):
    __tablename__ = 'users'
    id = db.Column(db.Integer, primary_key=True)
    nombre = db.Column(db.String(100), unique=True, nullable=False) # Nombre ahora es Único
    email = db.Column(db.String(120), unique=True, nullable=False)
    password = db.Column(db.String(255), nullable=False)
    role = db.Column(db.String(20), default="technician")

# 🔄 TIENDA TEMPORAL DE REFRESH TOKENS
refresh_store = {}

with app.app_context():
    db.create_all()

# --- RUTAS ---

@app.route("/auth/register", methods=["POST"])
def register():
    data = request.get_json() or {}
    username = data.get("username")
    email = data.get("email")
    password = data.get("password")
    role = data.get("role", "technician")

    if not username or not email or not password:
        return jsonify({"message": "Faltan datos obligatorios"}), 400

    # 1. Validar si el Nombre de Usuario ya existe
    if User.query.filter_by(nombre=username).first():
        return jsonify({"message": "El nombre de usuario no está disponible"}), 409

    # 2. Validar si el Email ya existe
    if User.query.filter_by(email=email).first():
        return jsonify({"message": "El correo ya está registrado"}), 400

    new_user = User(
        nombre=username,
        email=email,
        password=generate_password_hash(password),
        role=role
    )
    
    db.session.add(new_user)
    db.session.commit()
    
    return jsonify({"message": "¡Registro exitoso!"}), 201

@app.route("/auth/login", methods=["POST"])
def login():
    data = request.get_json() or {}
    email = data.get("email")
    password = data.get("password")

    user = User.query.filter_by(email=email).first()

    if user and check_password_hash(user.password, password):
        access_token = jwt.encode({
            "user": user.email, "role": user.role,
            "iat": datetime.datetime.utcnow(),
            "exp": datetime.datetime.utcnow() + datetime.timedelta(minutes=60)
        }, SECRET_KEY, algorithm="HS256")

        refresh_token = str(uuid.uuid4())
        refresh_store[refresh_token] = {
            "email": user.email,
            "exp": datetime.datetime.utcnow() + datetime.timedelta(days=7)
        }

        return jsonify({"access_token": access_token, "refresh_token": refresh_token}), 200

    return jsonify({"message": "Credenciales inválidas"}), 401

if __name__ == "__main__":
    port = int(os.environ.get("PORT", 5000))
    app.run(host="0.0.0.0", port=port)