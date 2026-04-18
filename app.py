from flask import Flask, request, jsonify, make_response
from flask_cors import CORS
import datetime
import os
import jwt
import bcrypt

app = Flask(__name__)

# 🔑 CONFIGURACIÓN DE SEGURIDAD
app.config['SECRET_KEY'] = os.environ.get("JWT_SECRET", "tecnired_key_2026_secure_access")

# 🛡️ BLINDAJE CORS TOTAL (Configuración agresiva para evitar bloqueos)
CORS(app, resources={r"/*": {
    "origins": "*",
    "methods": ["GET", "POST", "OPTIONS"],
    "allow_headers": ["Content-Type", "Authorization", "Accept"]
}})

# --- BASE DE DATOS VOLÁTIL (EN MEMORIA) ---
users_db = []
posts_db = [
    {
        "id": "1",
        "userName": "Admin TecniRed",
        "type": "diagrama",
        "content": "Diagrama base: Bloqueo de ignición Toyota Hilux. Cable verde.",
        "brand": "Toyota",
        "model": "Hilux",
        "createdAt": datetime.datetime.utcnow().isoformat(),
        "images": ["https://via.placeholder.com/600x400?text=Diagrama+Base+Hilux"]
    }
]

# --- UTILIDADES ---
def generate_token(user_email):
    payload = {
        'exp': datetime.datetime.utcnow() + datetime.timedelta(days=1),
        'iat': datetime.datetime.utcnow(),
        'sub': user_email
    }
    return jwt.encode(payload, app.config['SECRET_KEY'], algorithm='HS256')

# --- DIAGNÓSTICO DE RED (Para ver en el navegador) ---
@app.route('/')
def health_check():
    return f"🚀 API TecniRed en línea. Usuarios en memoria: {len(users_db)}. Usuario Maestro: admin@tecnired.com activo."

# --- MANEJO DE CORS REFORZADO ---
@app.after_request
def add_cors_headers(response):
    response.headers.add("Access-Control-Allow-Origin", "*")
    response.headers.add("Access-Control-Allow-Headers", "Content-Type,Authorization")
    response.headers.add("Access-Control-Allow-Methods", "GET,PUT,POST,DELETE,OPTIONS")
    return response

# --- RUTAS DE AUTENTICACIÓN ---

@app.route('/api/auth/register', methods=['POST'])
def register():
    try:
        data = request.get_json()
        if not data: return jsonify({"error": "No JSON recibido"}), 400
            
        name = data.get('name', '').strip()
        email = data.get('email', '').strip().lower()
        password = data.get('password', '')

        if not name or not email or not password:
            return jsonify({"error": "Faltan campos"}), 400

        if any(user['email'] == email for user in users_db):
            return jsonify({"error": "Email ya registrado"}), 409

        salt = bcrypt.gensalt()
        hashed_pw = bcrypt.hashpw(password.encode('utf-8'), salt)

        users_db.append({
            "name": name,
            "email": email,
            "password": hashed_pw,
            "created_at": datetime.datetime.utcnow().isoformat()
        })
        
        return jsonify({
            "message": "OK",
            "token": generate_token(email),
            "user": {"name": name, "email": email}
        }), 201
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/api/auth/login', methods=['POST'])
def login():
    try:
        data = request.get_json()
        if not data: return jsonify({"error": "No data"}), 400

        email = data.get('email', '').strip().lower()
        password = data.get('password', '').strip()

        print(f"DEBUG: Intento Login -> Email: {email}")

        # 🛡️ BYPASS MAESTRO: Prioridad absoluta
        if email == "admin@tecnired.com" and password == "admin123":
            print("✅ ACCESO MAESTRO CONCEDIDO")
            return jsonify({
                "token": generate_token(email),
                "user": {"name": "Admin Maestro", "email": email}
            }), 200

        # Búsqueda normal
        user = next((u for u in users_db if u['email'] == email), None)
        if user and bcrypt.checkpw(password.encode('utf-8'), user['password']):
            return jsonify({
                "token": generate_token(email),
                "user": {"name": user['name'], "email": user['email']}
            }), 200
        
        return jsonify({"error": "Credenciales inválidas"}), 401
    except Exception as e:
        print(f"❌ ERROR: {e}")
        return jsonify({"error": "Fallo servidor"}), 500

# --- MANEJO DE POSTS ---

@app.route('/api/posts', methods=['GET', 'POST'])
def handle_posts():
    if request.method == 'GET':
        query = request.args.get('search', '').lower()
        results = [p for p in posts_db if query in p['content'].lower() or query in p['brand'].lower()] if query else posts_db
        return jsonify(sorted(results, key=lambda x: x['createdAt'], reverse=True)), 200

    if request.method == 'POST':
        try:
            data = request.get_json()
            new_post = {
                "id": str(len(posts_db) + 1),
                "userName": data.get('userName', 'Técnico'),
                "type": data.get('type', 'libre'),
                "content": data.get('content', ''),
                "brand": data.get('brand', ''),
                "model": data.get('model', ''),
                "createdAt": datetime.datetime.utcnow().isoformat(),
                "images": ["https://via.placeholder.com/400"]
            }
            posts_db.append(new_post)
            return jsonify(new_post), 201
        except Exception as e:
            return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    port = int(os.environ.get("PORT", 5000))
    app.run(host='0.0.0.0', port=port)