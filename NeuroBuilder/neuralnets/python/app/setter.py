import torch.optim as optim
import torch.nn as nn
import torch
def setOptimizer(optimizer_choice, model, learning_rate):   
    if optimizer_choice == 'Adam':
        print("Adam")
        return optim.Adam(model.parameters(), lr=learning_rate)
    elif optimizer_choice == 'SGD':
        print('SGD')
        return optim.SGD(model.parameters(), lr=learning_rate)
    elif optimizer_choice == 'RMS Prop':
        print('RMS Prop')
        return optim.RMSprop(model.parameters(), lr=learning_rate) 
    elif optimizer_choice == 'AdamW':
        print("AdamW")
        return optim.AdamW(model.parameters(), lr=learning_rate,weight_decay=0.01) 
    elif optimizer_choice=='Adagrad':
        print('Adagrad')
        return optim.Adagrad(model.parameters(), lr=learning_rate)
    elif optimizer_choice =='Adadelta':
        print('Adadelta')
        return optim.Adadelta(model.parameters(), lr=learning_rate)
    elif optimizer_choice=='LBFGS':
        print('LBFGS')
        return optim.LBFGS(model.parameters(), lr=learning_rate)
def setLossFn(lossFn):
    if lossFn=='Huber':
        print('Huber')
        criterion = nn.HuberLoss()
        return criterion
    elif lossFn == 'MSE':
        print('MSE')
        criterion = nn.MSELoss()
        return criterion
    elif lossFn == 'MAE':
        print('MAE')
        criterion = nn.L1Loss()
        return criterion
    elif lossFn == 'Categorical Crossentropy':
        print('Categorical Crossentropy')
        criterion = nn.CrossEntropyLoss()
        return criterion
    elif lossFn=='Binary Cross Entropy':
        print('Binary Cross Entropy')
        criterion = nn.BCELoss()
def setLayer(input_size, output_size, activation, initialization, regularization):
  
    layer = nn.Linear(input_size, output_size)

    if initialization == "he":
        print('he')
        nn.init.kaiming_normal_(layer.weight, nonlinearity="relu")
    elif initialization == "xavier":
        print('xavier')
        nn.init.xavier_normal_(layer.weight)
    elif initialization=='Orthogonal Initialization':
        print('Orthogonal Initialization')
        nn.init.orthogonal_(layer.weight)
    elif initialization =='Dirac Initialization':
        print('Dirac Initialization')
        nn.init.dirac_(layer.weight)


    layers = [layer]
    if activation == "ReLU":
        print('ReLU')
        layers.append(nn.ReLU())
    elif activation == "LeakyReLU":
        print('LeakyReLU')
        layers.append(nn.LeakyReLU(0.01))
    elif activation == "ELU":
        print('elu')
        layers.append(nn.ELU())
    elif activation == "TanH":
        print("TanH")
        layers.append(nn.Tanh())
    elif activation == 'Sigmoid':
        print('Sigmoid')
        layers.append(nn.Sigmoid())
    elif activation == 'PReLU':
        print("PReLU")
        layers.append(nn.PReLU())
    elif activation=='Softmax':
        print("Softmax")
        layers.append(nn.Softmax(dim=1))
    elif activation=='Swish':
        print('Swish')
        layers.append(nn.SiLU())

    return nn.Sequential(*layers)
def apply_regularization(model, regularization):
    reg_loss = torch.tensor(0.0, requires_grad=True)

    for name, param in model.named_parameters():
        if "weight" in name:
            if regularization == "L1 regularization":
                reg_loss += torch.sum(torch.abs(param))
            elif regularization == "L2 regularization":
                reg_loss += torch.sum(param ** 2)

    return reg_loss