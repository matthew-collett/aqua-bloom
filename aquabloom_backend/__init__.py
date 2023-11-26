# aquabloom-backend/__init__.py

from flask import Flask
from aquabloom_backend.routes.index import index_blueprint
from aquabloom_backend.routes.upload import upload_blueprint
from flask_cors import CORS


def create_app():
    app = Flask(__name__)
    app.config.from_object('aquabloom_backend.config.Config')

    # Register Blueprints
    app.register_blueprint(index_blueprint)
    app.register_blueprint(upload_blueprint, url_prefix='/api')

    # Setup CORS
    CORS(app)

    return app
