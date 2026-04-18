from flask import Flask, request, jsonify
from flask_cors import CORS
from werkzeug.security import generate_password_hash, check_password_hash
import datetime
import jwt
import os

from config import Config
from models import db, User, Post

app = Flask(__name__)
app.config.from_object(Config)

CORS(app)

db.init_app(app)

# =========================
# INIT DB (AUTO)
# =========================
with app.app_context():
    db.create_all()


# =========================
# JWT
# =========================
def generate_token(email):
    payload = {
        "sub": email,
        "iat": datetime.datetime.utcnow(),
        "exp": datetime.datetime.utcnow() + datetime.timedelta(hours=app.config["TOKEN_EXP_HOURS"])
    }
    return jwt.encode(payload, app.config["SECRET_KEY"], algorithm="HS256")


def verify_token(token):
    try:
        decoded = jwt.decode(token, app.config["SECRET_KEY"], algorithms=["HS256"])
        return decoded["sub"]
    except:
        return None


def get_token():
    return request.headers.get("x-token")


# =========================
# AUTH DECORATOR
# =========================
def require_auth(f):
    def wrapper(*args, **kwargs):
        token = get_token()

        if not token:
            return jsonify({"msg": "Token requerido"}), 401

        user = verify_token(token)

        if not user:
            return jsonify({"msg": "Token inválido o expirado"}), 401

        return f(user, *args, **kwargs)

    wrapper.__name__ = f.__name__
    return wrapper


# =========================
# HEALTH
# =========================
@app.route('/')
def health():
    return jsonify({"status": "ok"}), 200


# =========================
# REGISTER
# =========================
@app.route('/api/auth/register', methods=['POST'])
def register():
    data = request.get_json()

    name = data.get('name')
    email = data.get('email').lower()
    password = data.get('password')

    if User.query.filter_by(email=email).first():
        return jsonify({"msg": "Correo ya existe"}), 409

    user = User(
        name=name,
        email=email,
        password=generate_password_hash(password)
    )

    db.session.add(user)
    db.session.commit()

    return jsonify({
        "token": generate_token(email),
        "user": {"name": name, "email": email}
    }), 201


# =========================
# LOGIN
# =========================
@app.route('/api/auth/login', methods=['POST'])
def login():
    data = request.get_json()

    email = data.get('email').lower()
    password = data.get('password')

    user = User.query.filter_by(email=email).first()

    if user and check_password_hash(user.password, password):
        return jsonify({
            "token": generate_token(email),
            "user": {"name": user.name, "email": user.email}
        }), 200

    return jsonify({"msg": "Credenciales inválidas"}), 401


# =========================
# GET POSTS
# =========================
@app.route('/api/posts', methods=['GET'])
def get_posts():
    posts = Post.query.order_by(Post.created_at.desc()).all()
    return jsonify([p.to_dict() for p in posts]), 200


# =========================
# CREATE POST (PROTEGIDO)
# =========================
@app.route('/api/posts', methods=['POST'])
@require_auth
def create_post(user_email):
    data = request.get_json()

    post = Post(
        user_name=user_email,
        type=data.get('type', 'libre'),
        content=data.get('content'),
        brand=data.get('brand'),
        model=data.get('model'),
        images=data.get('images', [])
    )

    db.session.add(post)
    db.session.commit()

    return jsonify(post.to_dict()), 201


# =========================
# RUN LOCAL
# =========================
if __name__ == '__main__':
    app.run(debug=True)