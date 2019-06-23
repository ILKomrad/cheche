var express = require('express'),
    app = express(),
    http = require('http').Server(app),
    io = require('socket.io')(http),
    path = require('path'),
    port = process.env.PORT || 3001,
    secretKey = 'checkers-checkers-checkers-checkers-secret',
    bodyParser = require('body-parser'),
    model = require('./model')('http://ilicila19.000webhostapp.com/checkers/checkers.php'),
    controller = require('./controller')(model);

app.use(express.static(__dirname + '/dist/client/'));

app.get('/', function(req, res) {
    res.sendFile(path.join(__dirname + '/dist/client/index.html'));
});

app.get('*', function(req, res) {
    res.sendFile(path.join(__dirname + '/dist/client/index.html'));
})

io.on('connection', (socket) => {
    console.log('connect');
    let playerId;

    socket.on('checkIn', (event) => {
        const data = JSON.parse(event);
        controller.checkIn(data)
        .then(data => {
            socket.emit('checkInResult', JSON.stringify(data));
        })
    });

    socket.on('login', (event) => {
        const data = JSON.parse(event);
        controller.login(data, socket.id)
        .then(data => {
            socket.emit('loginResult', JSON.stringify(data));
           
            if (data && data.playerId) {
                playerId = data.playerId;
            }
        });
    });

    socket.on('logout', (event) => {
        const data = JSON.parse(event);
        controller.logout(data.id);
    });

    socket.on('hello', (event) => {
        const data = JSON.parse(event);
        
        controller.hello(socket.id, data.playerId)
        .then(data => {
            data.socketId = socket.id;
            socket.emit('helloFromServer', JSON.stringify(data));
      
            if (data && data.user) {
                playerId = data.user.id;
            }
        });
    });

    socket.on('createMeeting', (event) => {
        if (event) {
            const data = JSON.parse(event);
           
            if (data && data.user) {
                controller.newMeeting(data.type, data.user)
                .then(_data => {
                    if (_data) { 
                        if (data.user !== 'you') {
                            socket.broadcast.emit('newMeeting', JSON.stringify(_data.meeting)); 
                        }
                        socket.emit('meetingCreated', JSON.stringify(_data));
                    }
                })
            }
        }   
    });

    socket.on('selectMeeting', (event) => {
        if (event) {
            const data = JSON.parse(event);
            controller.selectMeeting(data.playerId, data.meetingId)
            .then((data) => {
                if (data) {
                    io.emit('removeMeeting', JSON.stringify(data.meeting.id));
                    socket.emit('startMeeting', JSON.stringify(data.meeting));
                    io.to(data.socketId + '').emit('startMeeting', JSON.stringify(data.meeting));
                }
            });
        }
    });

    socket.on('removeMeeting', (event) => {
        if (event) {
            const data = JSON.parse(event);
            controller.removeMeeting(data.tokenId)
            .then((data) => {
                io.emit('removeMeeting', JSON.stringify(data));
            });
        }
    });

    socket.on('getData', (event) => {
        if (event) {
            const data = JSON.parse(event);
            controller.getData(data.token)
            .then((event) => {
                socket.emit('currentMeeting', JSON.stringify(event));
            });
        }
    });

    socket.on('finishGame', (event) => {
        if (event) {
            const data = JSON.parse(event);
            controller.onNewGame(data.token)
            .then((event) => {
                socket.emit('currentMeeting', JSON.stringify(event));
                io.to(event.opponentSocketId + '').emit('opponentStep', 
                    JSON.stringify({steps: event.oldGame}
                ));
            });
        }
    });

    socket.on('disconnect', function() {
        console.log('disconnect', socket.id, playerId);

        if (playerId) {
            controller.logout(playerId);
        }
    });

    socket.on('continueGame', function(event) {
        console.log( event )
        if (event) {
            const data = JSON.parse(event);
            controller.continueGame(data.token)
            .then((event) => {
                socket.emit('continueGame', JSON.stringify(event));
            });
        }
    });

    socket.on('makeStep', function(event) {
        if (event) {
            const data = JSON.parse(event);
            controller.makeStep(data)
            .then((event) => {
                if (event) {
                    socket.emit('makeStep', JSON.stringify(event.game));
                    io.to(event.opponentSocketId + '').emit('opponentStep', 
                        JSON.stringify({game: event.game, steps: data.steps}
                    ));
                }
            });
        }
    });

    socket.on('newGame', (e) => {
        if (e) {
            const data = JSON.parse(e);
            controller.newGame(data)
            .then(d => {
                socket.emit('meetingCreated', JSON.stringify(d));
            })
        }
    })
});

http.listen(port, () => {
    console.log( port );
});