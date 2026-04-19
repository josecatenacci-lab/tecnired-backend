# 🚀 TecniRed Backend

Backend modular escalable para sistema técnico GPS + red social profesional + comunicación en tiempo real.

---

## 📌 Características principales

- 🔐 Autenticación JWT segura
- ⚡ API REST modular (Express)
- 💬 Chat en tiempo real (Socket.IO)
- 🧠 Sistema de reputación (gamificación)
- 📰 Feed tipo red social técnica
- 💬 Comentarios y reacciones
- 🔔 Notificaciones en tiempo real
- 📦 Arquitectura Event-Driven
- 🧩 Separación completa por capas (Controller / Service / Repository)
- 🗄️ Prisma ORM + PostgreSQL
- ⚡ Redis (cache + sockets + futuras colas)
- 📁 Uploads de archivos locales (MVP)

---

## 🏗️ Arquitectura


src/
├── modules/
│ ├── auth/
│ ├── users/
│ ├── posts/
│ ├── chat/
│ ├── comments/
│ ├── reactions/
│ ├── reputation/
│ ├── notifications/
│
├── services/
├── sockets/
├── events/
├── middleware/
├── utils/
├── config/
└── server.js


---

## ⚙️ Instalación

```bash
npm install
🔧 Configuración

Crear archivo .env:

NODE_ENV=development
PORT=3000
DATABASE_URL=postgresql://user:pass@localhost:5432/tecnired
JWT_SECRET=super_secret_key
CLIENT_URL=http://localhost:5173
🚀 Ejecutar en desarrollo
npm run dev
🚀 Ejecutar en producción
npm start
🗄️ Prisma
Generar cliente
npm run prisma:generate
Migraciones
npm run prisma:migrate
Visualizar DB
npm run prisma:studio
🔌 WebSockets

El backend incluye Socket.IO para:

💬 Chat global y privado
🔔 Notificaciones en tiempo real
❤️ Reacciones en posts
🧠 Eventos de reputación
📡 API Base
/api/v1/auth
/api/v1/users
/api/v1/posts
/api/v1/chat
/api/v1/comments
/api/v1/reactions
/api/v1/notifications
🧠 Sistema de Eventos

El backend usa arquitectura event-driven:

Ejemplos:

POST_CREATED
COMMENT_CREATED
REACTION_ADDED
USER_REGISTERED
REPUTATION_UPDATED
NOTIFICATION_CREATED
📊 Reputación

Sistema de gamificación basado en:

Posts creados
Likes recibidos
Comentarios
Actividad general

Incluye:

puntos
niveles
ranking futuro
💬 Chat

Soporta:

Chat global (tipo grupo)
Chat privado
Indicador de escritura
Mensajes en tiempo real
🔔 Notificaciones
Persistentes en base de datos
Enviadas por WebSocket
Tipos: info, chat, post, reaction, system
🛡️ Seguridad
JWT authentication
Helmet middleware
Rate limiting
Input validation (express-validator)
Sanitización de datos
⚡ Tecnologías
Node.js
Express
Prisma ORM
PostgreSQL
Socket.IO
Redis
JWT
bcrypt
Nodemailer
📈 Estado del proyecto

✔ Backend modular completo
✔ Realtime system activo
✔ Event-driven architecture
✔ Escalable a microservicios
✔ Listo para MVP / SaaS

🚀 Próximos pasos (roadmap)
Workers (BullMQ)
Docker + Kubernetes
Logs centralizados (Pino + ELK)
Analytics en tiempo real
Microservicios
CI/CD automático
👨‍💻 Autor

Jose Catenacci

📜 Licencia

MIT