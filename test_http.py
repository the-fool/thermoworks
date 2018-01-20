from flask import Flask, request, jsonify
from flask_cors import CORS
from server.handler import lambda_handler

app = Flask(__name__)
CORS(app)

@app.route('/', methods=['POST'])
def main():
    res = lambda_handler(request.get_json(), None)
    return jsonify(res)
