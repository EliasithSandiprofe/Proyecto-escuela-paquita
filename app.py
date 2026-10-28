
import os

from flask import Flask, render_template
from dotenv import load_dotenv
from sqlalchemy.engine import URL

# Importar la instancia compartida y el modelo
from models import db, SolicitudMatricula


# ========================================
# CONFIGURACIÓN DE VARIABLES DE ENTORNO
# ========================================

load_dotenv()


# ========================================
# CREACIÓN DE LA APLICACIÓN FLASK
# ========================================

app = Flask(__name__)


# ========================================
# CONFIGURACIÓN DE POSTGRESQL
# ========================================

database_url = URL.create(
    drivername="postgresql+psycopg",
    username=os.getenv("DB_USER"),
    password=os.getenv("DB_PASSWORD"),
    host=os.getenv("DB_HOST", "localhost"),
    port=int(os.getenv("DB_PORT", "5432")),
    database=os.getenv("DB_NAME")
)

app.config["SQLALCHEMY_DATABASE_URI"] = database_url

app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False


# ========================================
# INICIALIZACIÓN DE SQLALCHEMY
# ========================================

db.init_app(app)


# ========================================
# RUTAS DEL SITIO WEB
# ========================================

@app.route("/")
def inicio():
    return render_template("index.html")


@app.route("/historia")
def historia():
    return render_template("historia.html")


@app.route("/galeria")
def galeria():
    return render_template("galeria.html")


@app.route("/inscripcion")
def inscripcion():
    return render_template("inscripcion.html")


# ========================================
# EJECUCIÓN LOCAL
# ========================================

if __name__ == "__main__":
    app.run(debug=True)
