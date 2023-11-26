# aquabloom-backend/routes/__init__.py

from .index import index_blueprint
from .upload import upload_blueprint

__all__ = ["index_blueprint", "upload_blueprint"]
