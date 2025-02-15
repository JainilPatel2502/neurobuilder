from flask import Flask, request, jsonify, send_file
import pandas as pd
import numpy as np
import os
import json
import torch.nn.functional as F
import torch.nn as nn
import numpy as n
import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import StandardScaler,MinMaxScaler,LabelEncoder
import torch
import matplotlib.pyplot as plt
import torch.optim as optim

from flask_cors import CORS
import google.generativeai as generative_ai
API_KEY = 'AIzaSyAuiCAcfEyFfR8nPHrVwTVN7nxgS5YfSiU'
generative_ai.configure(api_key=API_KEY)
app = Flask(__name__)
CORS(app)

df = pd.DataFrame()


def clean_dataframe(df):
    return df.replace({np.nan: None,'N/A':None})

@app.route('/upload', methods=['POST'])
def upload_csv():
    global df
    file = request.files['file']

    if not file:
        return jsonify({"error": "No file uploaded"}), 400

    df = pd.read_csv(file) 

    df = clean_dataframe(df)  

    return jsonify({"data": df.to_dict(orient="records"), "columns": list(df.columns)})

@app.route('/transform', methods=['POST'])
def transform_column():

    global df
    data = request.get_json()
    column = data.get("column")
    operation = data.get("operation")

    if column not in df.columns:
        return jsonify({"error": "Invalid column"}), 400

    if operation == "normalize":
        minmax = MinMaxScaler()
        df[column] = minmax.fit_transform(df[column].values.reshape(-1, 1))
    elif operation == "categorical_transform":
        label = LabelEncoder()
        df[column] = label.fit_transform(df[column])
    elif operation == "fill_missing":
        df[column] = df[column].fillna(df[column].mean())

    df = clean_dataframe(df)  

    return jsonify({"data": df.to_dict(orient="records")})

@app.route('/download', methods=['GET'])
def download_csv():
    global df

    if df.empty:
        return jsonify({"error": "No data available for download"}), 400

    file_path = "modified_data.csv"
    df.to_csv(file_path, index=False)

    return send_file(file_path, as_attachment=True)

@app.route('/net', methods=['POST'])
def build_network():
    global df

    if df is None or df.empty:
        return jsonify({"error": "No dataset available. Please upload a CSV first."}), 400

    try:
        data = request.get_json()
        print(data)
        # Hyperparameters
        layersInNetwork = data.get("layers")
        neuronsPerLayer = data.get("neuronsPerLayer")
        actiavtionsPerLayer = data.get("actiavtionsPerLayer")
        learning_rate = data.get("lr")
        # epochs = data.get("epochs")
        epochs = 100
        # batch_size = data.get("batch_size")
        batch_size = 32
        # optimizer_choice = data.get("optimizer")
        optimizer_choice = 'adam'

        # Split dataset
        X = df.iloc[:, :-1].values
        y = df.iloc[:, -1].values

        X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.1, random_state=42)

        # Convert to tensors
        X_train = torch.tensor(X_train, dtype=torch.float32)
        X_test = torch.tensor(X_test, dtype=torch.float32)
        y_train = torch.tensor(y_train, dtype=torch.long)
        y_test = torch.tensor(y_test, dtype=torch.long)

        input_size = X_train.shape[1]
        output_size = len(set(y))

        # Neural Network Definition
        class FeedForwardNN(nn.Module):
            def __init__(self, input_size, neuronsPerLayer, output_size, actiavtionsPerLayer):
                super(FeedForwardNN, self).__init__()
                layers = []
                prev_size = input_size

                for i, hid in enumerate(neuronsPerLayer):
                    layer = nn.Linear(prev_size, hid)
                    nn.init.kaiming_normal_(layer.weight, nonlinearity="relu")  # He Initialization
                    layers.append(layer)
                    if i == layersInNetwork-1:
                        continue
                    if actiavtionsPerLayer[i] == "ReLU":
                        layers.append(torch.nn.ReLU())
                    elif actiavtionsPerLayer[i] == "leaky_relu":
                        layers.append(nn.LeakyReLU(0.01))
                    elif actiavtionsPerLayer[i] == "elu":
                        layers.append(nn.ELU())

                    prev_size = hid

                layers.append(nn.Linear(prev_size, output_size))
                self.network = nn.Sequential(*layers)

            def forward(self, x):
                return self.network(x)

        # Initialize Model, Loss Function, and Optimizer
        model = FeedForwardNN(input_size, neuronsPerLayer, output_size, actiavtionsPerLayer)
        criterion = nn.CrossEntropyLoss()

        optimizer = optim.Adam(model.parameters(), lr=learning_rate) if optimizer_choice == "adam" else optim.SGD(model.parameters(), lr=learning_rate)

        # Training Loop
        train_losses = []
        for epoch in range(epochs):
            permutation = torch.randperm(X_train.shape[0])  # Shuffle dataset
            epoch_loss = 0

            for i in range(0, X_train.shape[0], batch_size):
                indices = permutation[i:i + batch_size]
                batch_x, batch_y = X_train[indices], y_train[indices]

                optimizer.zero_grad()  # Reset gradients
                outputs = model(batch_x)  # Forward pass
                loss = criterion(outputs, batch_y)  # Compute loss
                loss.backward()  # Backpropagation
                optimizer.step()  # Update weights

                epoch_loss += loss.item()

            avg_loss = epoch_loss / (X_train.size(0) // batch_size)
            train_losses.append(avg_loss)
            print(f"Epoch [{epoch+1}/{epochs}], Loss: {avg_loss:.4f}")

        return jsonify({"message": "Training complete", "final_loss": train_losses[-1], "l  oss_history": train_losses})

    except Exception as e:
        print(e)
        return jsonify({"error": str(e)}), 500

def ai(query):
    generative_ai.configure(api_key=API_KEY)
    model = generative_ai.GenerativeModel('gemini-1.5-flash')
    response = model.generate_content(query)
    cleaned_response = response.text.replace('*', '').replace('#', '')
    return cleaned_response

@app.route('/getcode',methods=['POST'])
def getCode():
    data = request.get_json()
    code = ai(f'Give me only the code no extra texts that will give the code to make a pytorch model with the following configration {data}')
    return jsonify({"code":code})

if __name__ == '__main__':
    app.run(debug=True)
