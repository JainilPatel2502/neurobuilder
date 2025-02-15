import torch
import torch.nn as nn
import torch.optim as optim
import numpy as np
from sklearn.model_selection import train_test_split
from setter import setOptimizer
from setter import setLossFn
from setter import setLayer
from setter import apply_regularization
class FeedForwardNN(nn.Module):  
    def __init__(self, input_size, neuronsPerLayer, output_size, activationsPerLayer, initializationPerLayer, regularizationPerLayer):
        super(FeedForwardNN, self).__init__()
        self.layers = nn.ModuleList()
        self.activations={}
        prev_size = input_size

        for i, (hid, activation, init, reg) in enumerate(zip(neuronsPerLayer, activationsPerLayer, initializationPerLayer, regularizationPerLayer)):
            self.layers.append(setLayer(prev_size, hid, activation, init, reg))  
            prev_size = hid

        self.layers.append(nn.Linear(prev_size, output_size))

    def forward(self, x):
        for i , layer in enumerate(self.layers):
            x = layer(x)
            self.activations[i+1]=x.detach().cpu().numpy()

        return x

def build_and_train_network(df, data):

    activationsPerLayer = data.get("actiavtionsPerLayer")
    batchSize = data.get("batchSize")
    epochs = data.get("epochs")
    initializationPerLayer = data.get('initializationPerLayer')
    layersInNetwork = data.get("layers")
    lossFn = data.get('lossFn')
    learning_rate = data.get("lr")
    neuronsPerLayer = data.get("neuronsPerLayer")
    optimizer_choice = data.get("optimzer")
    regularizationPerLayer = data.get('regularizationPerLayer')
    X = df.iloc[:, :-1].values
    y = df.iloc[:, -1].values

    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.1, random_state=42)

    X_train = torch.tensor(X_train, dtype=torch.float32)
    X_test = torch.tensor(X_test, dtype=torch.float32)
    y_train = torch.tensor(y_train, dtype=torch.long)  
    y_test = torch.tensor(y_test, dtype=torch.long)

    input_size = X_train.shape[1]
    output_size = len(set(y))

    model = FeedForwardNN(input_size, neuronsPerLayer, output_size, activationsPerLayer,initializationPerLayer,regularizationPerLayer)
    criterion = nn.CrossEntropyLoss()
    lossfn = setLossFn(lossFn)
    optimizer = setOptimizer(optimizer_choice,model,learning_rate)
    
    weights=[]
    biases=[]
    weightGrad=[]
    biasGrad=[]
    activations=[]
    train_losses = []
    for epoch in range(epochs):
        optimizer.zero_grad()  # Reset gradients
        outputs = model(X_train)  # Forward pass on full dataset
        loss = criterion(outputs, y_train)

        loss.backward()  # Backpropagation
        print("\nLayer Details:")
        layerCount=1
        wGrad=[]
        bGrad=[]
        weight=[]
        bias=[]
        active=[]
        for name, param in model.named_parameters():
            layerGrad={}
            if "weight" in name:
                # print(f"{name} Weights:\n{param.data.shape}")  # Corrected weights extraction
                # print(f"{name} Weights:\n{param.grad.shape}")  # Corrected weights extraction
                wGrad.append(param.grad.tolist())
                weight.append(param.data.tolist())
                

            elif "bias" in name:
                # print(f"{name} Biases:\n{param.data.shape}")   # Corrected bias extraction
                # print(f"{name} Biases:\n{param.grad.shape}")   # Corrected bias extraction
                bGrad.append(param.grad.tolist())
                bias.append(param.data.tolist())
                layerCount+=1
        print("\nActivations:")
        for layer_name, activation in model.activations.items():
            # print(f"{layer_name} Activations:\n{activation.shape}")
            active.append(activation.tolist())




        weightGrad.append(wGrad)
        biasGrad.append(bGrad)
        weights.append(weight)
        biases.append(bias)
        activations.append(active)
        train_losses.append(loss.item())  # Track loss
        optimizer.step()  # Update weights
        print(f"Epoch [{epoch+1}/{epochs}], Loss: {loss.item():.4f}")
    data={"weights":weights,"biases":biases,"weightGrad":weightGrad,"biasGrad":biasGrad,"activations":activations,"train_losses":train_losses}
    return data
