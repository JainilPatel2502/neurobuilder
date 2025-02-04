import flask
import torch
import torch.nn as nn
import torch.optim as optim
from torchvision import datasets, transforms
from torch.utils.data import DataLoader
network = {
    "activationsPerLayer": ['ReLU','TanH','TanH'],
    "initializationPerLayer": ['Normalized','He Normalization','He Normalization'],
    "layers": 3,
    "neuronsPerLayer": [128, 64, 10], 
    "regularizationPerLayer": ['L1 Regularization','L2 Regularization','L1 Regularization']
}
class FeedForwardNN(nn.Module):
    def __init__(self, network_config):
        super(FeedForwardNN, self).__init__()
        self.layers = nn.ModuleList()
        for i in range(network_config["layers"]):
            if i == 0:
                self.layers.append(nn.Linear(28 * 28, network_config["neuronsPerLayer"][i]))
            else:
                self.layers.append(nn.Linear(network_config["neuronsPerLayer"][i-1], network_config["neuronsPerLayer"][i]))
            if network_config["activationsPerLayer"][0] == 'ReLU':
                self.layers.append(nn.ReLU())
            if network_config["activationsPerLayer"][0] == 'TanH':
                self.layers.append(nn.Tanh())
            if network_config["activationsPerLayer"][0] == 'Leaky ReLU':
                self.layers.append(nn.LeakyReLU())
    def forward(self, x):
        x = x.view(-1, 28 * 28) 
        for layer in self.layers:
            x = layer(x)
        return x
app = flask.Flask(__name__)
model = FeedForwardNN(network)
model.eval() 
@app.route('/predict', methods=['POST'])
def predict():
    data = flask.request.json['data']
    input_tensor = torch.tensor(data).float()
    with torch.no_grad():
        output = model(input_tensor)
    return flask.jsonify(output.tolist())

if __name__ == '__main__':
    app.run(debug=True)
