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

    async continueGame(token) {
        let data = {};
        let user = await this.getUserByToken(token);
        data['currentMeeting'] = await this.getMeetingById(user.currentMeetingId);
        data['currentGame'] = await this.getGame(user.inGame);
        
        return data;
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
        let data = {mettings: []},
            currentMeetingId;
        
        if (token) { 
            data['user'] = await this.getUpdatedUser(socketId, token); 
        }
        
        if (data['user'] && data['user'].inGame) { 
            currentMeetingId = data['user'].currentMeetingId;
            const currentGame = await this.getGame(data['user'].inGame);
            data['currentMeetingId'] = currentMeetingId;
            data['currentMeeting'] = await this.getMeetingById(currentMeetingId);
            data['currentGame'] = this.game.generate(currentGame.type);
            data['currentGame'].setData(currentGame);
        }

        data.mettings = await this.getMeetings(currentMeetingId);
        
        return data;
    }

    async makeStepInGame(gameId, steps, userId) {
        let currentGame = await this.getGame(gameId);
        const game = this.game.generate(currentGame.type);
        game.setData(currentGame);
        let valid;

        steps.forEach(s => {
            let step = s.step;

            if (game.checkRange(step.from, userId)) {
                valid = game.makeStep(step, (steps.length > 1));
            }
            console.log('valid', valid);
        })
      
        if (valid) { 
            return game;
        } 
    }

    async makeStep(data) {
        const user = await this.getUserByToken(data.token);
        let currentGame;
       
        if (user && (user.inGame !== null)) {
            const game = await this.makeStepInGame(user.inGame, data.steps, user.id);
            // console.log('game', game);
            if (game) {
                let opponentId;
                game.players.forEach(player => {
                    if (player.id !== user.id) {
                        opponentId = player.id;
                    } 
                }); 
                const opponent = await this.getUser(opponentId);
        
                // let result = await this.model.makeStep(game);

                return {game, opponentSocketId: opponent.socketId};
            } 
        }
    }

    async newMeeting(type, user) {
        let meeting, game;
        const _user = await this.getUserByToken(user.playerId);

        if (_user) { game = await this.createNewGame(_user, type); }
       
        if (game) { meeting = await this.createNewMeeting(_user, game); }
       
        if (meeting) { this.model.setMeetingToUser(_user.id, meeting.id, game.id); }
       
        return {meeting, game};
    }
    
    async startMeeting(secondPlayer, meeting) {
        const currentGame = await this.getGame(meeting.currentGame.id);

        if (meeting.isStart !== 1) {
            if (meeting.score.length === 1) { 
                meeting.score.push({id: secondPlayer.id, name: secondPlayer.name, category: secondPlayer.category, score: 0}); 
            }
            meeting.secondPlayer = secondPlayer.id;
            meeting.currentGame = currentGame;
            meeting.isStart = 1;
            this.model.startMeeting(meeting);
            
            if (currentGame.players.length === 1) { 
                currentGame.players.push({ id: secondPlayer.id, range: 'b' });
            }
            this.model.startGame(currentGame);

            return meeting;
        } else {
            return null;
        }
    }

    async selectMeeting(token, meetingId) {
        const user = await this.getUserByToken(token);

        if (user) {
            let meeting = await this.getMeetingById(meetingId);
            const firstPlayer = await this.getUser(meeting.firstPlayer);
            meeting = await this.startMeeting(user, meeting); 
            this.model.setMeetingToUser(user.id, meeting.id, meeting.currentGame.id);
        
            if (firstPlayer) {
                return {meeting, socketId: firstPlayer.socketId};
            } else {
                return null;
            }
        } else {
            return null;
        }
    }

    getMeetingById(meetingId) {
        return new Promise(res => {
            this.model.getMeetingById(meetingId)
            .then(meeting => {
                if (meeting && (meeting !== '0 results')) {
                    meeting = JSON.parse(meeting)[0];
                    meeting = this.transformMeeting(meeting);
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
            meeting.addPlayer({id: user.id, name: user.name, category: user.category, score: 0});
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
        const meeting = await this.getMeetingById(user.currentMeetingId);
        this.model.removeMeeting(user.currentMeetingId);
        this.model.removeGame(user.inGame);
        this.model.leaveMeeting(user.id);

        if (meeting && meeting.score) {
            meeting.score.forEach(player => {
                if (player.id !== user.id) { this.model.leaveMeeting(player.id); }
            });
        }

        return user.currentMeetingId;
    }

    newGame() {
        const game = this.game.generate('classic');
        game.init();
        game.checkValid({d: 'd'}, {ds: 'ds'});
    }

    getGame(id) {
        return new Promise(res => {
            this.model.getGame(id).then(data => {
                let game;
                
                if (data && (data !== '0 results')) {
                    game = JSON.parse(data)[0];
                    game.cells = JSON.parse(game.cells);
                    game.hitsChips = JSON.parse(game.hitsChips);
                    game.paths = JSON.parse(game.paths);
                    game.players = JSON.parse(game.players);
                }
               
                res(game);
            })
        });
    }

    async getMeetings(currentMeetingId) {
        const data = await this.model.getMeetings(currentMeetingId);
        
        if (!data || (data === '0 results')) { return Promise.resolve([]); }
        
        const parseData = JSON.parse(data);
        const meetings = parseData.map(m => {
            const meeting = this.transformMeeting(m);
        
            return meeting;
        });
        
        return meetings;
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