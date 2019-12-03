const express = require ('express');
const mongoose = require('mongoose');
const path = require('path');
const cors = require('cors');
const bodyParser = require ('body-parser');

const app = express();

const server = require('http').Server(app);
const io = require('socket.io')(server);

//FUNÇÃO QUE CONECTA COM O BANCO
mongoose.connect('mongodb+srv://gabriel:102030@cluster0-2yvun.mongodb.net/test?retryWrites=true&w=majority',
{
    useNewUrlParser: true,
    useUnifiedTopology: true,
});

app.use((req, res, next) => {
    req.io = io;
    
    next();
})


app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

require('./controllers/authController')(app);
require('./controllers/projectController')(app);



app.use(cors());

app.use('/files', express.static(path.resolve(__dirname, '..', 'uploads', 'resized')));

app.use(require('./routes'));
server.listen(3333);