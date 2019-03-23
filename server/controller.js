var game = require('./checkers/game'),
    secretKey = 'checkers-checkers-checkers-checkers-secret',
    Meeting = require('./checkers/meeting'),
    jwt = require('jsonwebtoken'),
    sessionTime = '365d'; //60 = 1minute '2h' - 2hours '365d' - год

class Controller {
    constructor(model) {
        this.model = model;
        this.game = game;
    }

    checkTocken(token) {
        return new Promise((res, rej) => {
            try {
                if (token) {
                    const decoded = jwt.verify(token, secretKey);
                    res(decoded);
                } else {
                    res(false); //'not auth'
                }
            } catch (err) {
                res(false); //token invalid
            }
        });
    }

    getUserByToken(token) {
        return new Promise(res => {
            this.checkTocken(token)
            .then(decoded => {
                if (decoded) {
                    this.getUser(decoded.id)
                    .then(user => {
                        if (user) {
                            res(user);
                        } else {
                            res();
                        }
                    });
                } else {
                    res();
                }
            })
        })
    }

    setSocketId(playerId, socketId) {
        return this.model.setSocketId(playerId, socketId);
    }

    getUpdatedUser(socketId, token) {
        return new Promise((res, rej) => {
            this.getUserByToken(token)
            .then(user => {
                if (user) {
                    this.setSocketId(user.id, socketId);
                    res(new User(user.id, user.name, user.category, token, user.currentMeetingId, user.inGame));
                } else {
                    res();
                }
            })
        });
    }

    getUser(id, email = null) {
        return new Promise(res => {
            this.model.getUser(id, email)
            .then((event) => {
                if (event === '0 results') {
                    res(false); //player not finded
                } else {
                    const user = JSON.parse(event)[0];
                    res(user);
                }
            });
        })
    }

    login(player, socketId) {
        return new Promise((res, rej) => {
            this.getUser(null, player.email)
            .then((user) => {
                if (!user) {
                   res(false); //player not finded
                } else {
                    if (player.password === user.password) {
                        const token = jwt.sign({
                            id: user.id,
                            email: user.email
                        }, secretKey, { expiresIn: sessionTime });
                        this.setSocketId(user.id, socketId);
                        res(new User(user.id, user.name, user.category, token, user.currentMeetingId, user.inGame)); //ok
                    } else {
                        res(false); //password invalid
                    }
                }
            })
        })
    }

    logout(id, socketId) {
        this.model.logout(id, socketId);
    }

    checkIn(user) {
        return new Promise((res, rej) => {
            this.model.checkIn(user)
            .then((event) => {
                const data = JSON.parse(event);
                res(data);
            })
        });
    }

    async hello(socketId, token) {
        let data = {mettings: []};
        
        if (token) { data['user'] = await this.getUpdatedUser(socketId, token); }
        
        data.mettings = await this.getMeetings(data['user']);
        
        return data;
    }

    async newMeeting(type, user) {
        let meeting, game;
        const _user = await this.getUserByToken(user.playerId);

        if (_user) { game = await this.createNewGame(_user, type); }

        if (game) { meeting = await this.createNewMeeting(_user, game); }
    
        if (meeting) { this.model.setMeetingToUser(_user.id, meeting.id, game.id); }
       
        return Promise.resolve({meeting, game});
    }

    async selectMeeting(token, meetingId) {
        const user = await this.getUserByToken(token);

        if (user) {
            const data = await this.getMeetingById(meetingId),
                meeting = this.transformMeeting(data[0]);
               
            const currentGame = await this.getGame(meeting.currentGame.id);
            this.model.setMeetingToUser(user.id, meeting.id, currentGame.id);

            if (meeting.isStart !== 1) {
                if (meeting.score.length === 1) { 
                    meeting.score.push({id: user.id, name: user.name, category: user.category}); 
                }
                meeting.secondPlayer = user.id;
                meeting.currentGame = currentGame;
                this.model.startMeeting(meeting);
                
                if (currentGame.players.length === 1) { 
                    currentGame.players.push({ id: user.id, range: 'b' });
                }
                this.model.startGame(currentGame);

                const firstPlayer = await this.getUser(meeting.firstPlayer);
            
                if (firstPlayer) {
                    return Promise.resolve({meeting, socketId: firstPlayer.socketId});
                } else {
                    return Promise.resolve(null);
                }
            } else {
                return Promise.resolve(null);
            }
        } else {
            return Promise.resolve(null);
        }
    }

    getMeetingById(meetingId) {
        return new Promise(res => {
            this.model.getMeetingById(meetingId)
            .then(meeting => {
                if (meeting) {
                    meeting = JSON.parse(meeting);
                }
                res(meeting);
            });
        });
    }

    createNewGame(user, type) {   
        return new Promise(res => {
            const game = this.game.generate(type);
            game.init();
            game.addPlayer(user.id);
        
            this.model.addGame(game).then(gameId => {
                game.id = gameId;
                res(game);
            })
        });
    }

    createNewMeeting(user, game) {
        return new Promise(res => {
            const meeting = new Meeting();
            meeting.addPlayer({id: user.id, name: user.name, category: user.category});
            meeting.setCurrentGame(game.id, game.type);
            meeting.addGame(game);
            meeting.firstPlayer = user.id;

            this.model.addMeeting(meeting, user.id).then(meetingId => {
                meeting.setId(meetingId);
                res(meeting);
            })
        });
    }

    async removeMeeting(token) {
        const user = await this.getUserByToken(token);
        this.model.removeMeeting(user.currentMeetingId);
        this.model.removeGame(user.inGame);
        this.model.leaveMeeting(user.id);

        return Promise.resolve(user.currentMeetingId);
    }

    newGame() {
        const game = this.game.generate('classic');
        game.init();
        game.checkValid({d: 'd'}, {ds: 'ds'});
    }

    getGame(id) {
        return new Promise(res => {
            this.model.getGame(id).then(data => {
                const game = JSON.parse(data)[0];
                game.cells = JSON.parse(game.cells);
                game.hitsChips = JSON.parse(game.hitsChips);
                game.paths = JSON.parse(game.paths);
                game.players = JSON.parse(game.players);

                res(game);
            })
        });
    }

    async getMeetings(user) {
        const data = await this.model.getMeetings();
        let currentGame;
      
        if (!data || (data === '0 results')) { return Promise.resolve([]); }

        if (user && user.inGame) { 
            currentGame = await this.getGame(user.inGame);
        }
        
        const parseData = JSON.parse(data);
        const meetings = parseData.map(m => {
            const meeting = this.transformMeeting(m);
           
            if (currentGame && (m.id === user.currentMeetingId)) {
                meeting.currentGame = currentGame;
            }

            return meeting;
        });
        
        return Promise.resolve(meetings);
    }

    transformMeeting(data) {
        const meeting = {
            id: data.id,
            isStart: data.isStart,
            score: JSON.parse(data.score),
            firstPlayer: data.firstPlayer,
            secondPlayer: data.secondPlayer,
            currentGame: JSON.parse(data.currentGame)
        }

        return meeting;
    }
}

class User {
    constructor(id, name, category, playerId, currentMeetingId, inGame) {
        this.id = id;
        this.name = name;
        this.category = category;
        this.playerId = playerId;
        this.currentMeetingId = currentMeetingId;
        this.inGame = inGame;
    }
}

module.exports = (model) => new Controller(model);