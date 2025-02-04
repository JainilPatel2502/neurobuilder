# from flask import Flask, request, jsonify
# import pandas as pd
# from sklearn.preprocessing import StandardScaler, MinMaxScaler

# from flask_cors import CORS
# app = Flask(__name__)
# CORS(app)

# df = pd.DataFrame()

# @app.route('/upload', methods=['POST'])
# def upload_csv():
#     print("RECIVED")
#     global df
#     file = request.files['file']
#     df = pd.read_csv(file)
#     print("SEND")
#     return jsonify(res=df.to_dict(orient="records"))

# @app.route('/transform', methods=['POST'])
# def transform_column():
#     global df
#     data = request.get_json()
#     column = data['column']
#     operation = data['operation']

#     if operation == "normalize":
#         scaler = MinMaxScaler()
#         df[column] = scaler.fit_transform(df[[column]])
#         print("MinMaxScaler")
#     elif operation == "standardize":
#         scaler = StandardScaler()
#         df[column] = scaler.fit_transform(df[[column]])
#         print("StandardScaler")
#     elif operation == "fill_missing":
#         df[column] = df[column].fillna(df[column].mean())
#         print("Fill Missing")
#     elif operation == "categorical_to_numeric":
#         df[column] = pd.factorize(df[column])[0]
#         print("categorical_to_numeric")

#     return jsonify(data=df.to_dict(orient="records"))

# if __name__ == '__main__':
#     app.run(debug=True)




















# from flask import Flask, request, jsonify
# import pandas as pd
# from flask_cors import CORS
# from sklearn.preprocessing import StandardScaler, MinMaxScaler,LabelEncoder

# app = Flask(__name__)
# CORS(app)

# df = pd.DataFrame()  # Store uploaded CSV data

# # Route to Upload CSV
# @app.route('/upload', methods=['POST'])
# def upload_csv():
#     global df
#     file = request.files['file']
    
#     if not file:
#         return jsonify({"error": "No file uploaded"}), 400

#     df = pd.read_csv(file)  # Convert CSV to DataFrame
#     print("File recived")
#     return jsonify({"data": df.to_dict(orient="records"), "columns": list(df.columns)})

# # Route to Transform a Column
# @app.route('/transform', methods=['POST'])
# def transform_column():
#     global df
#     data = request.get_json()
#     column = data.get("column")
#     operation = data.get("operation")

#     if column not in df.columns:
#         return jsonify({"error": "Invalid column"}), 400

#     # Apply transformations
#     if operation == "normalize":
#         scaler = MinMaxScaler()
#         print("MinMax")
#         df[column] = scaler.fit_transform(df[[column]])
#     elif operation == "categorical_transform":
#         label=LabelEncoder()
#         df[column] = label.fit_transform(df[[column]])
#         print("MinMax")
#     elif operation == "fill_missing":
#         df[column] = df[column].fillna(df[column].mean())
#         print("fill")
#     return jsonify({"data": df.to_dict(orient="records")})

# if __name__ == '__main__':
#     app.run(debug=True)


























# from flask import Flask, request, jsonify
# import pandas as pd
# from flask_cors import CORS
# import numpy as np

# app = Flask(__name__)
# CORS(app)

# df = pd.DataFrame()  # Store uploaded CSV data

# # Function to replace NaN with None (valid JSON)
# def clean_dataframe(df):
#     return df.replace({np.nan: None})  # ✅ Replace NaN with None (null in JSON)

# # Route to Upload CSV
# @app.route('/upload', methods=['POST'])
# def upload_csv():
#     global df
#     file = request.files['file']
    
#     if not file:
#         return jsonify({"error": "No file uploaded"}), 400
    
#     df = pd.read_csv(file)  # Read CSV into DataFrame
#     df = clean_dataframe(df)  # Fix NaN issue

#     return jsonify({"data": df.to_dict(orient="records"), "columns": list(df.columns)})

# # Route to Transform a Column
# @app.route('/transform', methods=['POST'])
# def transform_column():
#     global df
#     data = request.get_json()
#     column = data.get("column")
#     operation = data.get("operation")

#     if column not in df.columns:
#         return jsonify({"error": "Invalid column"}), 400

#     # Apply transformations
#     if operation == "normalize":
#         df[column] = (df[column] - df[column].min()) / (df[column].max() - df[column].min())
#     elif operation == "categorical_transform":
#         df[column] = pd.factorize(df[column])[0]
#     elif operation == "fill_missing":
#         df[column] = df[column].fillna(df[column].mean())

#     df = clean_dataframe(df)  # Fix NaN issue again

#     return jsonify({"data": df.to_dict(orient="records")})

# if __name__ == '__main__':
#     app.run(debug=True)



































# download
from flask import Flask, request, jsonify, send_file
import pandas as pd
import numpy as np
import os
import json
import torch.nn.functional as F
import numpy as n
import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import StandardScaler,MinMaxScaler,LabelEncoder
import torch
import matplotlib.pyplot as plt
from flask_cors import CORS
import google.generativeai as generative_ai
API_KEY = 'AIzaSyAuiCAcfEyFfR8nPHrVwTVN7nxgS5YfSiU'
generative_ai.configure(api_key=API_KEY)
app = Flask(__name__)
CORS(app)

df = pd.DataFrame()


def clean_dataframe(df):
    return df.replace({np.nan: None,'N/A':None})

# Upload CSV Route
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

    
    if df.empty:
        return jsonify({"error": "No dataset available. Please upload a CSV first."}), 400

    try:
        
        data = request.get_json()
        layers = data.get('layers')
        neurons_per_layer = data.get('neuronsPerLayer')
        activations_per_layer = data.get('actiavtionsPerLayer')  
        initialization_per_layer = data.get('initializationPerLayer')
        regularization_per_layer = data.get('regularizationPerLayer')
        lr = data.get('lr')
        lossFn = data.get('lossFn')

        
        if not all([layers, neurons_per_layer, activations_per_layer]):
            return jsonify({"error": "Missing required parameters"}), 400
        
        print(f"Layers: {layers}")

        # df = df.apply(pd.to_numeric, errors='coerce') 
        
        
        # df = df.fillna(df.mean()) 

        X = df.iloc[:, :-1].values 
        y = df.iloc[:, -1].values  

        # Split data
        X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.1, random_state=42)

        
        X_train = torch.tensor(X_train, dtype=torch.float32)
        X_test = torch.tensor(X_test, dtype=torch.float32)
        y_train = torch.tensor(y_train, dtype=torch.long)  
        y_test = torch.tensor(y_test, dtype=torch.long)

        input_size = X_train.shape[1]
        num_classes = len(set(y))

        
        g = torch.Generator().manual_seed(2147483647)
        W, B = [], []

        
        W.append(torch.randn((input_size, neurons_per_layer[0]), generator=g, requires_grad=True))
        B.append(torch.randn(neurons_per_layer[0], generator=g, requires_grad=True))

        
        for i in range(layers - 1):
            W.append(torch.randn((neurons_per_layer[i], neurons_per_layer[i + 1]), generator=g, requires_grad=True))
            B.append(torch.randn(neurons_per_layer[i + 1], generator=g, requires_grad=True))

        
        activation_functions = {
            "relu": torch.nn.functional.relu,
            "tanh": torch.tanh,
            "sigmoid": torch.sigmoid,
            "softmax": torch.nn.functional.softmax
        }

        def apply_activation(layer_idx, tensor):
            act_func = activations_per_layer[layer_idx] if layer_idx < len(activations_per_layer) else "relu"
            return activation_functions.get(act_func, torch.nn.functional.relu)(tensor)

        
        losses = []
        optimizer = torch.optim.Adam(W + B, lr=lr)
        loss_fn = torch.nn.CrossEntropyLoss()

        for epoch in range(100):
            # forward 
            out = X_train @ W[0] + B[0]
            for i in range(1, len(W)):
                out = apply_activation(i - 1, out @ W[i] + B[i])

            # loss
            loss = loss_fn(out, y_train)
            losses.append(loss.item())

            print(f"Epoch {epoch + 1}: Loss = {loss.item()}")

            # backword
            optimizer.zero_grad()
            loss.backward()
            optimizer.step()

        return jsonify({"message": "Training complete", "final_loss": losses[-1], "loss_history": losses})

    except Exception as e:
        return jsonify({"error": str(e)}), 500



# Function to call Google Generative AI
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
