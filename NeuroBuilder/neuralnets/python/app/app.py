from flask import Flask, request, jsonify, send_file
import pandas as pd
import numpy as np
import os
import torch
from flask_cors import CORS
import google.generativeai as generative_ai
from model_builder import build_and_train_network  
from utils import clean_dataframe

app = Flask(__name__)
CORS(app)

API_KEY = 'AIzaSyAuiCAcfEyFfR8nPHrVwTVN7nxgS5YfSiU'
generative_ai.configure(api_key=API_KEY)

df = pd.DataFrame()

@app.route('/upload', methods=['POST'])
def upload_csv():
    global df
    file = request.files['file']

    if not file:
        return jsonify({"error": "No file uploaded"}), 400

    df = pd.read_csv(file)
    df = clean_dataframe(df)

    return jsonify({"data": df.to_dict(orient="records")[:20], "columns": list(df.columns)})

@app.route('/transform', methods=['POST'])
def transform_column():
    global df
    data = request.get_json()
    column = data.get("column")
    operation = data.get("operation")

    if column not in df.columns:
        return jsonify({"error": "Invalid column"}), 400

    if operation == "normalize":
        from sklearn.preprocessing import MinMaxScaler
        scaler = MinMaxScaler()
        df[column] = scaler.fit_transform(df[column].values.reshape(-1, 1))

    elif operation == "categorical_transform":
        from sklearn.preprocessing import LabelEncoder
        encoder = LabelEncoder()
        df[column] = encoder.fit_transform(df[column])

    elif operation == "fill_missing":
        df[column] = df[column].fillna(df[column].mean())

    df = clean_dataframe(df)

    return jsonify({"data": df.to_dict(orient="records")[:20]})

@app.route('/download', methods=['GET'])
def download_csv():
    global df
    if df.empty:
        return jsonify({"error": "No data available for download"}), 400

    file_path = "modified_data.csv"
    df.to_csv(file_path, index=False)
    return send_file(file_path, as_attachment=True)

@app.route('/net', methods=['POST'])
def train_network():
    global df

    if df is None or df.empty:
        return jsonify({"error": "No dataset available. Please upload a CSV first."}), 400

    try:
        data = request.get_json()
        data = build_and_train_network(df, data)
        return jsonify({"data":data})

    except Exception as e:
        print(e)
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True)
