const express = require('express');
const app = express();
const http = require('http').Server(app);
const io = require('socket.io')(http);
const port = process.env.POKER_PORT || 37011;



const INDEX_PATH = 'poker';


/*
const sqlite3 = require('sqlite3');

const db = new sqlite3.Database('./db.db', (err) => {
    if (err) {
        console.error(err.message);
    }
    console.log('Connected to the database.');
});
*/


app.use(express.static(__dirname + '/public'));
app.use('/' + INDEX_PATH + '/components/css/bootstrap.min.css', express.static(__dirname + '/node_modules/bootstrap/dist/css/bootstrap.min.css'));
app.use('/' + INDEX_PATH + '/components/js/bootstrap.min.js', express.static(__dirname + '/node_modules/bootstrap/dist/js/bootstrap.min.js'));





app.get('/' + INDEX_PATH, (req, res) => {
  // res.sendFile(__dirname + '/' + INDEX_PATH + '/index.html');
  res.render(INDEX_PATH + '.html');
});

var answers = {};

io.on('connection', (socket) => {
  socket.on('setsp', data => {
    answers[data.name] = data.sp;
    io.emit('addusertotable', Object.keys(answers));
  });

  socket.on('getresults', () => {
    io.emit('showresultsintable', answers);
  });

  socket.on('reset', () => {
    answers = {};
    io.emit('reset');
  });
});

http.listen(port, () => {
  console.log(`Socket.IO server running at http://localhost:${port}/`);
});

