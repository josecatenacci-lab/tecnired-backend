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
# Render proporciona DATABASE_URL automáticamente si conectas la DB al servicio
app.config['SQLALCHEMY_DATABASE_URI'] = os.environ.get("DATABASE_URL")
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

db = SQLAlchemy(app)

# 👥 MODELO DE USUARIO
class User(db.Model):
    __tablename__ = 'users'
    id = db.Column(db.Integer, primary_key=True)
    nombre = db.Column(db.String(100), nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False)
    password = db.Column(db.String(255), nullable=False)
    role = db.Column(db.String(20), default="technician")

# 🔄 MODELO DE SESIONES (Opcional: para persistir refresh tokens si deseas)
# Por ahora usaremos un diccionario para no complicar la DB, pero los usuarios ya están seguros.
refresh_store = {}

# 🛠️ CREAR TABLAS
with app.app_context():
    db.create_all()
    # Crear admin por defecto si la DB está vacía
    if not User.query.filter_by(email="admin@gps.com").first():
        admin = User(
            nombre="Administrador Principal",
            email="admin@gps.com",
            password=generate_password_hash("1234"),
            role="admin"
        )
        db.session.add(admin)
        db.session.commit()

# 🛡️ MIDDLEWARE: Verifica JWT
def token_required(f):
    @wraps(f)
    def wrapper(*args, **kwargs):
        auth_header = request.headers.get("Authorization", "")
        token = auth_header.replace("Bearer ", "")
        if not token:
            return jsonify({"message": "Token faltante"}), 401
        try:
            data = jwt.decode(token, SECRET_KEY, algorithms=["HS256"])
            request.user_email = data["user"]
            request.user_role = data["role"]
        except:
            return jsonify({"message": "Token inválido o expirado"}), 401
        return f(*args, **kwargs)
    return wrapper

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

    if User.query.filter_by(email=email).first():
        return jsonify({"message": "El usuario ya existe"}), 400

    new_user = User(
        nombre=username,
        email=email,
        password=generate_password_hash(password),
        role=role
    )
    
    db.session.add(new_user)
    db.session.commit()
    
    return jsonify({"message": "Usuario registrado exitosamente"}), 201

@app.route("/auth/login", methods=["POST"])
def login():
    data = request.get_json() or {}
    email = data.get("email")
    password = data.get("password")

    user = User.query.filter_by(email=email).first()

    if user and check_password_hash(user.password, password):
        access_token = jwt.encode({
            "user": user.email,
            "role": user.role,
            "iat": datetime.datetime.utcnow(),
            "exp": datetime.datetime.utcnow() + datetime.timedelta(minutes=60)
        }, SECRET_KEY, algorithm="HS256")

        refresh_token = str(uuid.uuid4())
        refresh_store[refresh_token] = {
            "email": user.email,
            "exp": datetime.datetime.utcnow() + datetime.timedelta(days=7)
        }

        return jsonify({
            "access_token": access_token,
            "refresh_token": refresh_token
        }), 200

    return jsonify({"message": "Credenciales inválidas"}), 401

@app.route("/auth/refresh", methods=["POST"])
def refresh():
    data = request.get_json() or {}
    rtoken = data.get("refresh_token")
    session = refresh_store.get(rtoken)

    if not session or session["exp"] < datetime.datetime.utcnow():
        return jsonify({"message": "Sesión expirada"}), 401
    
    user = User.query.filter_by(email=session["email"]).first()
    if not user:
        return jsonify({"message": "Usuario no encontrado"}), 404

    new_token = jwt.encode({
        "user": user.email,
        "role": user.role,
        "iat": datetime.datetime.utcnow(),
        "exp": datetime.datetime.utcnow() + datetime.timedelta(minutes=60)
    }, SECRET_KEY, algorithm="HS256")
    
    return jsonify({"access_token": new_token}), 200

@app.route("/auth/me")
@token_required
def me():
    user = User.query.filter_by(email=request.user_email).first()
    return jsonify({
        "user": user.email,
        "nombre": user.nombre,
        "role": user.role
    }), 200

@app.route("/auth/logout", methods=["POST"])
def logout():
    data = request.get_json() or {}
    rtoken = data.get("refresh_token")
    if rtoken in refresh_store:
        del refresh_store[rtoken]
    return jsonify({"message": "Sesión cerrada"}), 200

if __name__ == "__main__":
    port = int(os.environ.get("PORT", 5000))
    app.run(host="0.0.0.0", port=port)