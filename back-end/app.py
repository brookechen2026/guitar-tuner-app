from flask import Flask, request, jsonify, send_from_directory
import os

app = Flask(__name__)

app.config['UPLOAD_FOLDER'] = 'static'

@app.route('/')
def hello():
    return "Hello, World!"

@app.route('/upload', methods=['POST'])
def upload_file():
    if 'file' not in request.files:
        return jsonify({"error": "No file part"}), 400
    file = request.files['file']
    
    if file.filename == '':
        return jsonify({"error": "No selected file"}), 400

    if file:
        file_path = os.path.join("uploads", file.filename)
        file.save(file_path)
        
        return jsonify({"message": f"File {file.filename} uploaded successfully!", 
                        "url": f"/static/{file.filename}"}), 200


@app.route('/get_image', methods=['GET'])
def get_image():
    image_name = 'chord_image.png'  
    image_path = os.path.join(app.config['STATIC_FOLDER'], image_name)

    if not os.path.exists(image_path):
        return jsonify({"error": "Image not found"}), 404
    
    image_data = {
        "filename": image_name,
        "url": f"/{app.config['STATIC_FOLDER']}/{image_name}",
        "format": "png"
    }
    return jsonify(image_data)

@app.route('/static/<path:filename>')
def serve_static(filename):
    return send_from_directory(app.config['STATIC_FOLDER'], filename)

ALLOWED_EXTENSIONS = {'mp3', 'wav', 'm4a'}

def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

@app.route('/adjust_pitch', methods=['POST'])
def adjust_pitch():
    if 'file' not in request.files or 'pitch' not in request.form:
        return jsonify({"error": "File and pitch adjustment required"}), 400

    file = request.files['file']
    pitch_adjustment = int(request.form['pitch'])  
    
    # 保存并处理音频文件
    if file and allowed_file(file.filename):
        file_path = os.path.join(app.config['UPLOAD_FOLDER'], file.filename)
        file.save(file_path)
        
        # 在这里插入音调处理代码
        # processed_file_path = apply_pitch_adjustment(file_path, pitch_adjustment)
        
        return jsonify({"message": "Pitch adjusted successfully", 
                        "url": f"/static/{file.filename}"}), 200

@app.route('/apply_effects', methods=['POST'])
def apply_effects():
    if 'file' not in request.files or 'effect' not in request.form:
        return jsonify({"error": "File and effect required"}), 400

    file = request.files['file']
    effect = request.form['effect']
    
    if file and allowed_file(file.filename):
        file_path = os.path.join(app.config['UPLOAD_FOLDER'], file.filename)
        file.save(file_path)
        
        # 在这里插入效果处理代码
        # processed_file_path = apply_audio_effect(file_path, effect)
        
        return jsonify({"message": f"Effect {effect} applied successfully", 
                        "url": f"/static/{file.filename}"}), 200


if __name__ == '__main__':
    app.run(debug=True)
