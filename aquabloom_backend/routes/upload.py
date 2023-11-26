# aquabloom-backend/routes/upload.py
from flask import Blueprint, request, jsonify, current_app
from werkzeug.utils import secure_filename
from aquabloom_backend.utils.helpers import allowed_file
from aquabloom_backend.scripts.uploadFile import calculateProbability
import os
import pandas as pd

upload_blueprint = Blueprint('upload_blueprint', __name__)


@upload_blueprint.route('/upload', methods=['POST'])
def upload():
    if 'file' not in request.files:
        return jsonify(message="No file part"), 400
    file = request.files['file']
    if file.filename == '':
        return jsonify(message="No selected file"), 400
    if file and allowed_file(file.filename, current_app.config['ALLOWED_EXTENSIONS']):
        filename = secure_filename(file.filename)
        filepath = os.path.join(current_app.config['UPLOAD_FOLDER'], filename)
        file.save(filepath)
        try:
            calculateProbability(filepath)
            return jsonify(message="File uploaded and processed"), 200
        except Exception as e:
            return jsonify(message="Error processing file", error=str(e)), 500
        finally:
            os.remove(filepath)
    else:
        return jsonify(message="File type not allowed"), 400
