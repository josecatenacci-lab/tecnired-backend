import os

class Config:
    SECRET_KEY = os.environ.get("JWT_SECRET", "dev_secret_change_this")

    SQLALCHEMY_DATABASE_URI = os.environ.get(
        "DATABASE_URL",
        "sqlite:///local.db"  # fallback local
    )

    # 🔥 FIX Render (muy importante)
    if SQLALCHEMY_DATABASE_URI.startswith("postgres://"):
        SQLALCHEMY_DATABASE_URI = SQLALCHEMY_DATABASE_URI.replace(
            "postgres://", "postgresql://", 1
        )

    SQLALCHEMY_TRACK_MODIFICATIONS = False
    TOKEN_EXP_HOURS = 24