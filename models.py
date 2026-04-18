from flask_sqlalchemy import SQLAlchemy
from datetime import datetime

db = SQLAlchemy()


class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(120), nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False)
    password = db.Column(db.String(255), nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)


class Post(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    user_name = db.Column(db.String(120), nullable=False)
    type = db.Column(db.String(50), default='libre')
    content = db.Column(db.Text, nullable=False)
    brand = db.Column(db.String(100))
    model = db.Column(db.String(100))
    images = db.Column(db.JSON, default=[])
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    def to_dict(self):
        return {
            "id": str(self.id),
            "userName": self.user_name,
            "type": self.type,
            "content": self.content,
            "brand": self.brand,
            "model": self.model,
            "images": self.images,
            "createdAt": self.created_at.isoformat()
        }