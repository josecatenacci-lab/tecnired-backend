backend/README.md
# 🚀 TecniRed Backend V1

Backend oficial de **TecniRed**, plataforma profesional para técnicos GPS, telemetría vehicular y comunidad técnica colaborativa.

Diseñado para escalar desde MVP a producto enterprise.

---

# 📌 Stack Principal

- Node.js
- Express.js
- PostgreSQL
- Prisma ORM
- Redis
- Socket.IO
- JWT Auth
- Nodemailer
- BullMQ (colas / jobs)
- Firebase (push / servicios externos futuros)

---

# 🧠 Objetivo del Backend

Centralizar y exponer servicios para:

- Usuarios y perfiles técnicos
- Sistema de reputación profesional
- Feed técnico / publicaciones
- Comentarios y reacciones
- Notificaciones en tiempo real
- Herramientas GPS
- Búsqueda inteligente
- Caché distribuido
- Jobs automáticos

---

# 🏗️ Arquitectura Oficial

```text
backend/
├── prisma/
├── src/
│   ├── config/
│   ├── constants/
│   ├── dto/
│   ├── middleware/
│   ├── security/
│   ├── modules/
│   │   ├── health/
│   │   ├── users/
│   │   ├── reputation/
│   │   ├── notifications/
│   │   ├── search/
│   │   └── tools/
│   ├── services/shared/
│   ├── jobs/
│   ├── routes/
│   └── utils/
└── package.json
⚙️ Instalación
npm install
🔐 Variables de Entorno

Crear archivo:

backend/.env

Ejemplo mínimo:

NODE_ENV=development
PORT=3000
DATABASE_URL=postgresql://USER:PASSWORD@localhost:5432/tecnired
JWT_SECRET=CHANGE_ME
REDIS_HOST=127.0.0.1
REDIS_PORT=6379
API_PREFIX=/api/v1
🗄️ Base de Datos Prisma

Generar cliente:

npm run prisma:generate

Migraciones desarrollo:

npm run prisma:migrate

Deploy producción:

npm run prisma:deploy

Abrir studio:

npm run prisma:studio
🚀 Ejecutar Proyecto

Desarrollo:

npm run dev

Producción:

npm run start:prod
📡 Endpoints Base
/health
/api/v1/users
/api/v1/reputation
/api/v1/notifications
/api/v1/search
/api/v1/tools
⚡ Funcionalidades Core
Usuarios
Perfil técnico
Roles
Estado cuenta
Ranking futuro
Reputación
Karma
Méritos
Historial de puntos
Escalamiento profesional
Notificaciones
Sistema persistente
Tiempo real
Push futuro
Search
Usuarios
Posts técnicos
Fichas
Herramientas
Tools
Calculadoras técnicas
Utilidades GPS
Exportaciones
🔒 Seguridad
Helmet
CORS controlado
JWT
Rate Limit
Sanitización inputs
Validación DTO
Hash bcrypt
📈 Escalabilidad

Preparado para:

Horizontal scaling
Workers separados
Redis distribuido
CDN futura
Microservicios progresivos
CI/CD
🧪 Calidad
npm run lint
npm run test
npm run check
🛠️ Roadmap V2
Chat tiempo real
Feed social completo
App móvil integrada
Métricas avanzadas
IA técnica
Moderación automática
👨‍💻 Autor

Jose Catenacci

📜 Licencia

MIT