from flask import Flask, render_template, request, jsonify
import json, os

app = Flask(__name__)

DB_FILE = "inventario.json"

def load_db():
    if not os.path.exists(DB_FILE):
        return []
    with open(DB_FILE, "r") as f:
        return json.load(f)

def save_db(data):
    with open(DB_FILE, "w") as f:
        json.dump(data, f, indent=4)

@app.route("/")
def index():
    return render_template("index.html")

@app.route("/agregar", methods=["POST"])
def agregar():
    data = load_db()
    producto = request.json
    data.append(producto)
    save_db(data)
    return jsonify({"ok": True})

@app.route("/listar")
def listar():
    return jsonify(load_db())

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000)
