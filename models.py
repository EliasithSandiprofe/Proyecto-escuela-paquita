
from datetime import datetime, timezone

from flask_sqlalchemy import SQLAlchemy
from sqlalchemy import CheckConstraint


db = SQLAlchemy()


# ============================================
# 1. SOLICITUD DE MATRÍCULA
# ============================================

class SolicitudMatricula(db.Model):

    __tablename__ = "solicitudes_matricula"

    id = db.Column(db.Integer, primary_key=True)

    nivel_solicitado = db.Column(
        db.String(30),
        nullable=False
    )

    fecha_solicitud = db.Column(
        db.DateTime(timezone=True),
        nullable=False,
        default=lambda: datetime.now(timezone.utc)
    )

    estado = db.Column(
        db.String(20),
        nullable=False,
        default="PENDIENTE"
    )

    __table_args__ = (
        CheckConstraint(
            "nivel_solicitado IN ("
            "'MATERNO', 'TRANSICION', "
            "'PRIMERO', 'SEGUNDO', 'TERCERO', "
            "'CUARTO', 'QUINTO', 'SEXTO')",
            name="ck_nivel_matricula"
        ),
        CheckConstraint(
            "estado IN ("
            "'PENDIENTE', 'EN_REVISION', 'ATENDIDA')",
            name="ck_estado_matricula"
        ),
    )

    estudiante = db.relationship(
        "Estudiante",
        back_populates="solicitud",
        uselist=False,
        cascade="all, delete-orphan"
    )

    salud = db.relationship(
        "SaludEstudiantil",
        back_populates="solicitud",
        uselist=False,
        cascade="all, delete-orphan"
    )

    responsables = db.relationship(
        "Responsable",
        back_populates="solicitud",
        cascade="all, delete-orphan"
    )

    familia = db.relationship(
        "InformacionFamiliar",
        back_populates="solicitud",
        uselist=False,
        cascade="all, delete-orphan"
    )

    hogar = db.relationship(
        "SituacionHogar",
        back_populates="solicitud",
        uselist=False,
        cascade="all, delete-orphan"
    )


# ============================================
# 2. DATOS DEL ESTUDIANTE
# ============================================

class Estudiante(db.Model):

    __tablename__ = "estudiantes"

    id = db.Column(db.Integer, primary_key=True)

    solicitud_id = db.Column(
        db.Integer,
        db.ForeignKey("solicitudes_matricula.id"),
        nullable=False,
        unique=True
    )

    nombre_completo = db.Column(
        db.String(150),
        nullable=False
    )

    sexo = db.Column(db.String(20))

    fecha_nacimiento = db.Column(db.Date)

    numero_identificacion = db.Column(
        db.String(30)
    )

    nacionalidad = db.Column(db.String(80))

    edad_referencia = db.Column(db.Integer)

    vive_con = db.Column(db.String(50))

    direccion_exacta = db.Column(db.Text)

    solicitud = db.relationship(
        "SolicitudMatricula",
        back_populates="estudiante"
    )


# ============================================
# 3. INFORMACIÓN DE SALUD
# ============================================

class SaludEstudiantil(db.Model):

    __tablename__ = "salud_estudiantil"

    id = db.Column(db.Integer, primary_key=True)

    solicitud_id = db.Column(
        db.Integer,
        db.ForeignKey("solicitudes_matricula.id"),
        nullable=False,
        unique=True
    )

    tiene_enfermedad = db.Column(db.Boolean)

    detalle_enfermedad = db.Column(db.Text)

    toma_medicamentos = db.Column(db.Boolean)

    detalle_medicamentos = db.Column(db.Text)

    vacunacion_al_dia = db.Column(db.Boolean)

    peso_kg = db.Column(db.Numeric(5, 2))

    dificultades = db.Column(db.Text)

    recibe_educacion_religiosa = db.Column(
        db.Boolean
    )

    tiene_adecuacion_curricular = db.Column(
        db.Boolean
    )

    detalle_adecuacion = db.Column(db.Text)

    solicitud = db.relationship(
        "SolicitudMatricula",
        back_populates="salud"
    )


# ============================================
# 4. MADRE, PADRE O ENCARGADO
# ============================================

class Responsable(db.Model):

    __tablename__ = "responsables"

    id = db.Column(db.Integer, primary_key=True)

    solicitud_id = db.Column(
        db.Integer,
        db.ForeignKey("solicitudes_matricula.id"),
        nullable=False
    )

    tipo_responsable = db.Column(
        db.String(20),
        nullable=False
    )

    nombre_completo = db.Column(
        db.String(150),
        nullable=False
    )

    numero_identificacion = db.Column(
        db.String(30)
    )

    estado_civil = db.Column(db.String(50))

    nacionalidad = db.Column(db.String(80))

    profesion_oficio = db.Column(db.String(120))

    telefono = db.Column(db.String(25))

    lugar_trabajo = db.Column(db.String(150))

    correo = db.Column(db.String(150))

    nivel_academico = db.Column(db.String(80))

    __table_args__ = (
        CheckConstraint(
            "tipo_responsable IN "
            "('MADRE', 'PADRE', 'ENCARGADO')",
            name="ck_tipo_responsable"
        ),
        db.UniqueConstraint(
            "solicitud_id",
            "tipo_responsable",
            name="uq_responsable_tipo_solicitud"
        ),
    )

    solicitud = db.relationship(
        "SolicitudMatricula",
        back_populates="responsables"
    )


# ============================================
# 5. INFORMACIÓN FAMILIAR
# ============================================

class InformacionFamiliar(db.Model):

    __tablename__ = "informacion_familiar"

    id = db.Column(db.Integer, primary_key=True)

    solicitud_id = db.Column(
        db.Integer,
        db.ForeignKey("solicitudes_matricula.id"),
        nullable=False,
        unique=True
    )

    tiene_hermanos_centro = db.Column(db.Boolean)

    cantidad_hermanos = db.Column(db.Integer)

    detalle_hermanos = db.Column(db.Text)

    tiene_beca = db.Column(db.Boolean)

    detalle_beca = db.Column(db.Text)

    emergencia_nombre = db.Column(db.String(150))

    emergencia_parentesco = db.Column(db.String(60))

    emergencia_telefono = db.Column(db.String(25))

    solicitud = db.relationship(
        "SolicitudMatricula",
        back_populates="familia"
    )


# ============================================
# 6. SITUACIÓN DEL HOGAR
# ============================================

class SituacionHogar(db.Model):

    __tablename__ = "situacion_hogar"

    id = db.Column(db.Integer, primary_key=True)

    solicitud_id = db.Column(
        db.Integer,
        db.ForeignKey("solicitudes_matricula.id"),
        nullable=False,
        unique=True
    )

    tipo_vivienda = db.Column(db.String(30))

    monto_alquiler = db.Column(db.Numeric(12, 2))

    condicion_vivienda = db.Column(db.String(30))

    ingreso_mensual = db.Column(db.Numeric(12, 2))

    tiene_internet = db.Column(db.Boolean)

    solicitud = db.relationship(
        "SolicitudMatricula",
        back_populates="hogar"
    )
