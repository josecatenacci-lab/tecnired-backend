from flask import Flask, request, jsonify
from flask_cors import CORS
from werkzeug.security import generate_password_hash, check_password_hash
import datetime
import os
import jwt
import sys

# DEBUG: Esto ayuda a diagnosticar en el panel de Render
print(f"🚀 Iniciando TecniRed API")
print(f"Python version: {sys.version}")

app = Flask(__name__)

# 🔑 CONFIGURACIÓN DE SEGURIDAD
# Render usará la variable de entorno JWT_SECRET si existe
app.config['SECRET_KEY'] = os.environ.get("JWT_SECRET", "tecnired_ultra_secret_key_2026")

# 🛡️ BLINDAJE CORS TOTAL (Clave para evitar bloqueos en Flutter)
CORS(app, resources={r"/*": {
    "origins": "*",
    "methods": ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    "allow_headers": ["Content-Type", "Authorization", "Accept", "X-Requested-With"],
    "max_age": 3600
}})

# --- BASE DE DATOS VOLÁTIL (EN MEMORIA) ---
users_db = []
posts_db = [
    {
        "id": "1",
        "userName": "Admin TecniRed",
        "type": "diagrama",
        "content": "Diagrama Maestro: Toyota Hilux 2024. Corte de ignición en cable verde ramal B.",
        "brand": "Toyota",
        "model": "Hilux",
        "createdAt": datetime.datetime.utcnow().isoformat(),
        "images": ["https://via.placeholder.com/600x400?text=Diagrama+Hilux+2024"]
    }
]

# --- UTILIDADES DE SEGURIDAD ---
def generate_token(user_email):
    """Genera un JWT válido por 24 horas"""
    payload = {
        'exp': datetime.datetime.utcnow() + datetime.timedelta(days=1),
        'iat': datetime.datetime.utcnow(),
        'sub': user_email
    }
    return jwt.encode(payload, app.config['SECRET_KEY'], algorithm='HS256')

@app.after_request
def add_cors_headers(response):
    response.headers.add("Access-Control-Allow-Origin", "*")
    response.headers.add("Access-Control-Allow-Headers", "Content-Type,Authorization")
    response.headers.add("Access-Control-Allow-Methods", "GET,PUT,POST,DELETE,OPTIONS")
    return response

# --- RUTAS DE SISTEMA ---

@app.route('/')
def health_check():
    return jsonify({
        "status": "online",
        "project": "TECNIRED API",
        "version": "1.0.3",
        "master_user": "admin@tecnired.com (Ready)"
    }), 200

# --- RUTAS DE AUTENTICACIÓN ---

@app.route('/api/auth/register', methods=['POST'])
def register():
    try:
        data = request.get_json()
        if not data: return jsonify({"error": "Payload vacío"}), 400
            
        name = data.get('name', '').strip()
        email = data.get('email', '').strip().lower()
        password = data.get('password', '')

        if not name or not email or not password:
            return jsonify({"error": "Todos los campos son obligatorios"}), 400

        # Evitar duplicados
        if any(user['email'] == email for user in users_db):
            return jsonify({"error": "El correo ya está registrado"}), 409

        # Seguridad Werkzeug (No requiere instalación de binarios complejos)
        hashed_pw = generate_password_hash(password)

        users_db.append({
            "name": name,
            "email": email,
            "password": hashed_pw,
            "created_at": datetime.datetime.utcnow().isoformat()
        })
        
        return jsonify({
            "message": "Usuario creado correctamente",
            "token": generate_token(email),
            "user": {"name": name, "email": email}
        }), 201
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/api/auth/login', methods=['POST'])
def login():
    try:
        data = request.get_json()
        if not data: return jsonify({"error": "No se recibieron datos"}), 400

        email = data.get('email', '').strip().lower()
        password = data.get('password', '').strip()

        # 🚀 BYPASS MAESTRO (Indestructible para pruebas)
        if email == "admin@tecnired.com" and password == "admin123":
            print(">>> ACCESO MAESTRO CONCEDIDO")
            return jsonify({
                "token": generate_token(email),
                "user": {
                    "name": "Admin TecniRed", 
                    "email": email,
                    "role": "Técnico Especialista"
                }
            }), 200

        # Verificación contra usuarios registrados
        user = next((u for u in users_db if u['email'] == email), None)
        if user and check_password_hash(user['password'], password):
            return jsonify({
                "token": generate_token(email),
                "user": {"name": user['name'], "email": user['email']}
            }), 200
        
        return jsonify({"error": "Credenciales inválidas"}), 401
    except Exception as e:
        return jsonify({"error": "Error en autenticación"}), 500

# --- RUTAS DE CONTENIDO (POSTS) ---

@app.route('/api/posts', methods=['GET', 'POST'])
def handle_posts():
    if request.method == 'GET':
        query = request.args.get('search', '').lower()
        if query:
            results = [p for p in posts_db if query in p['content'].lower() or query in p['brand'].lower()]
        else:
            results = posts_db
        return jsonify(sorted(results, key=lambda x: x['createdAt'], reverse=True)), 200

    if request.method == 'POST':
        try:
            data = request.get_json()
            new_post = {
                "id": str(len(posts_db) + 1),
                "userName": data.get('userName', 'Técnico'),
                "type": data.get('type', 'libre'),
                "content": data.get('content', ''),
                "brand": data.get('brand', 'Genérico'),
                "model": data.get('model', 'N/A'),
                "createdAt": datetime.datetime.utcnow().isoformat(),
                "images": ["https://via.placeholder.com/600x400?text=Diagrama+Aportado"]
            }
            posts_db.append(new_post)
            return jsonify(new_post), 201
        except Exception as e:
            return jsonify({"error": "No se pudo crear"}), 500

if __name__ == '__main__':
    # Render asigna el puerto mediante variable de entorno
    port = int(os.environ.get("PORT", 5000))
    app.run(host='0.0.0.0', port=port)