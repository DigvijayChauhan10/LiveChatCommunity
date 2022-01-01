const express = require('express');
const bodyParser = require('body-parser');
const app = express();

const path = require('path');

const server = require('http').createServer(app);

const io = require('socket.io')(server, { cors: { origin: '*' } });
app.set('view engine', 'ejs');
app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.urlencoded({ extended: true }));

app.get('/', (req, res, next) => {
    res.render('form');
});

app.post('/', (req, res, next) => {
    const name = req.body.userName;
    res.render('home', { userName: name });
});

app.get('/MERN', (req, res, next) => {
    const name = req.query.name;
    if (name == null) {
        res.redirect('/');
    } else {
        res.render('index', { imageUrl: "mern.png", iconUrl: "mern.ico", roomId: "MERN", name: name, roomName: "MERN STACK" });
    }
});
app.get('/PHP', (req, res, next) => {
    const name = req.query.name;
    if (name == null) {
        res.redirect('/');
    } else {
        res.render('index', { imageUrl: "php.jpg", iconUrl: "php.ico", roomId: "PHP", name: name, roomName: "PHP" });
    }
});
app.get('/Python', (req, res, next) => {
    const name = req.query.name;
    if (name == null) {
        res.redirect('/');
    } else {
        res.render('index', { imageUrl: "python.png", iconUrl: "python.ico", roomId: "Python", name: name, roomName: "Python" });
    }
});

server.listen(8000, () => {
    console.log('Server running...');
});
var numberOfUser = 0;

io.on('connection', socket => {

    socket.on('new-user-join', (name, roomId) => {
        numberOfUser++;
        io.sockets.emit('all', numberOfUser);
        socket.join(roomId);
        socket.broadcast.to(roomId).emit('user-joined', name);

        socket.on('send', (message, name) => {
            socket.broadcast.to(roomId).emit('receive', { msg: message, name: name });
        });

        socket.on('disconnect', (message) => {
            numberOfUser--;
            io.sockets.emit('all', numberOfUser);
            socket.broadcast.to(roomId).emit('leave', name);
        });
    });


});