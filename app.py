from flask import Flask, request, jsonify
from flask_cors import CORS
import datetime

app = Flask(__name__)

# 🛡️ BLINDAJE CORS: Permite que tu app de Flutter (Web y Móvil) se conecte sin bloqueos
CORS(app, resources={r"/api/*": {"origins": "*"}})

# Simulación de Base de Datos (Para pruebas rápidas)
users_db = []

@app.route('/')
def home():
    return jsonify({
        "status": "online",
        "message": "Servidor de Tecnired operando correctamente",
        "time": datetime.datetime.now().isoformat()
    })

# 📝 RUTA DE REGISTRO (La que llama tu RegisterScreen)
@app.route('/api/auth/register', methods=['POST'])
def register():
    try:
        data = request.get_json()
        
        # Validación de datos recibidos
        if not data:
            return jsonify({"error": "No se recibieron datos"}), 400
            
        name = data.get('name')
        email = data.get('email')
        password = data.get('password')

        # Verificación de campos obligatorios
        if not all([name, email, password]):
            return jsonify({"error": "Faltan campos obligatorios"}), 400

        # Lógica de registro (Aquí conectarías con tu DB real)
        # Por ahora simulamos que el correo no esté duplicado
        if any(user['email'] == email for user in users_db):
            return jsonify({"error": "El correo ya está registrado"}), 409

        new_user = {
            "name": name,
            "email": email,
            "password": password # En producción, usa siempre hash (ej: bcrypt)
        }
        users_db.append(new_user)

        print(f"✅ Nuevo técnico registrado: {name} ({email})")
        
        return jsonify({
            "message": "¡Registro exitoso!",
            "user": {"name": name, "email": email}
        }), 201

    except Exception as e:
        print(f"❌ Error en el servidor: {str(e)}")
        return jsonify({"error": "Error interno del servidor"}), 500

# 🔑 RUTA DE LOGIN
@app.route('/api/auth/login', methods=['POST'])
def login():
    data = request.get_json()
    email = data.get('email')
    password = data.get('password')

    # Simulación de validación
    if email == "admin@gps.cl" and password == "1234":
        return jsonify({
            "token": "token-falso-de-prueba-jwt",
            "message": "Login correcto"
        }), 200
    
    return jsonify({"error": "Credenciales inválidas"}), 401

if __name__ == '__main__':
    # Render usa la variable de entorno PORT, si no existe usa el 5000
    import os
    port = int(os.environ.get("PORT", 5000))
    app.run(host='0.0.0.0', port=port)