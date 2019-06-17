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

    async onNewGame(token) {
        const user = await this.getUserByToken(token);
        let currentGame, opponentId, data = {};

        if (user && (user.inGame !== null)) {
            let currentGame = await this.getGame(user.inGame);
            data['oldGame'] = this.game.generate(currentGame.type);
            data['oldGame'].setData(currentGame);
            data['oldGame'].win(user.id);
            const meeting = await this.finishGame(user.currentMeetingId, data['oldGame']); 
            await this.model.finishGame(meeting);
            await this.model.gameWin(data['oldGame'].whoWin, data['oldGame'].id);
            const _data = await this.newGame(meeting);
            data['user'] = await this.getUserByToken(token); 
            data['currentMeetingId'] = _data['meeting'].id;
            data['currentMeeting'] = _data['meeting'];
            const _currentGame = await this.getGame(_data.game.id);
            data['currentGame'] = this.game.generate(_currentGame.type);
            data['currentGame'].setData(_currentGame);
            data['oldGame'].players.forEach(player => {
                if (player.id !== user.id) {
                    opponentId = player.id;
                } 
            }); 
            const opponent = await this.getUser(opponentId);
            data['opponentSocketId'] = opponent.socketId;
            
            return data;
        }
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

    async getData(token) {
        let data = {mettings: []},
            currentMeetingId;
        
        if (token) { 
            data['user'] = await this.getUserByToken(token); 
        }
    
        if (data['user'] && data['user'].inGame) { 
            currentMeetingId = data['user'].currentMeetingId;
            const currentGame = await this.getGame(data['user'].inGame);
            data['currentMeetingId'] = currentMeetingId;
            data['currentMeeting'] = await this.getMeetingById(currentMeetingId);
            data['currentGame'] = this.game.generate(currentGame.type);
            data['currentGame'].setData(currentGame);
        }

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
           
            if (game) {
                let opponentId;
                game.players.forEach(player => {
                    if (player.id !== user.id) {
                        opponentId = player.id;
                    } 
                }); 
                const opponent = await this.getUser(opponentId);
                await this.model.makeStep(game);
                
                if (game.whoWin) {
                    const meeting = await this.finishGame(user.currentMeetingId, game); 
                    await this.model.finishGame(meeting);
                    await this.newGame(meeting);
                }

                return {game, opponentSocketId: opponent.socketId};
            } 
        }
    }

    async newGame(meeting) {
        const game = await this.createNewGame(meeting.score[0], 'giveaway', meeting.score[1]);
        const _meeting = await this.addGameToMeeting(meeting.id, game.id, game.type);

        meeting.score.forEach(player => {
            this.model.setMeetingToUser(player.id, meeting.id, game.id);
        });

        return {game, meeting: _meeting};
    }

    createNewGame(user, type, secondUser, isBot) {   
        return new Promise(res => {
            const game = this.game.generate(type);
            game.init();
            game.addPlayer(user.id);

            if (secondUser) { game.addPlayer(secondUser.id); }

            if (isBot) {
                game.id = Date.now();
                res(game);
            } else {
                this.model.addGame(game).then(gameId => {
                    game.id = gameId;
                    res(game);
                })
            }
        });
    }

    async addGameToMeeting(meetingId, gameId, gameType) {
        const meeting = await this.getMeetingById(meetingId);
        meeting.games.push({id: gameId, type: gameType});
        await this.model.addGameToMeeting(meeting.id, meeting.games, {id: gameId, type: gameType});
        return meeting;
    }

    async finishGame(meetingId, game) {
        const meeting = await this.getMeetingById(meetingId),
            players = game.players;
        let winId;

        players.forEach(s => {
            if (s.range === game.whoWin) {
                winId = s.id;
            }
        });

        meeting.score.forEach(s => {
            if (s.id === winId) {
                s.score = s.score + 1;
            }
        })
        
        return meeting;
    }

    async newMeeting(type, user) {
        let meeting, game;

        if (user === 'you') {
            const bot = await this.createBot(type);
            meeting = bot.meeting;
            game = bot.game;
        } else {
            const _user = await this.getUserByToken(user.playerId);

            if (_user) { game = await this.createNewGame(_user, type); }
        
            if (game) { meeting = await this.createNewMeeting(_user, game); }
        
            if (meeting) { this.model.setMeetingToUser(_user.id, meeting.id, game.id); }
        }
       
        return {meeting, game};
    }

    async createBot(type) {
        const game = await this.createNewGame({id: 'you'}, type, null, true);
        const meeting = await this.createNewMeeting({id: 'you', name: 'you'}, game, true);
        const readyMeeting = await this.startMeeting({id: 777, name: 'bot'}, meeting, game);
        game.bot = true;
        meeting.bot = true;
        // game.players.push({id: 777, name: 'bot', range: 'b'});

        return {meeting: readyMeeting, game};
    }
    
    async startMeeting(secondPlayer, meeting, isBot) {
        const currentGame = isBot ? isBot : await this.getGame(meeting.currentGame.id);

        if (meeting.isStart !== 1) {
            if (meeting.score.length === 1) { 
                meeting.score.push({id: secondPlayer.id, name: secondPlayer.name, category: secondPlayer.category, score: 0}); 
            }
            meeting.secondPlayer = secondPlayer.id;
            meeting.currentGame = currentGame;
            meeting.isStart = 1;
            
            if (!isBot) { this.model.startMeeting(meeting); }
           
            if (currentGame.players.length === 1) { 
                currentGame.players.push({ id: secondPlayer.id, range: 'b' });
            }
            
            if (!isBot) { this.model.startGame(currentGame); }

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

    createNewMeeting(user, game, isBot) {
        return new Promise(res => {
            const meeting = new Meeting();
            meeting.addPlayer({id: user.id, name: user.name, category: user.category, score: 0});
            meeting.setCurrentGame(game.id, game.type);
            meeting.addGame(game);
            meeting.firstPlayer = user.id;
            
            if (isBot) {
                meeting.setId(Date.now());
                res(meeting);
            } else {
                this.model.addMeeting(meeting, user.id).then(meetingId => {
                    meeting.setId(meetingId);
                    res(meeting);
                })
            }
        });
    }

    async removeMeeting(token) {
        const user = await this.getUserByToken(token);
        const meeting = await this.getMeetingById(user.currentMeetingId), that = this;
        that.model.removeMeeting(user.currentMeetingId);
        that.model.removeGame(user.inGame);
        that.model.leaveMeeting(user.id);

        if (meeting && meeting.score) {
            meeting.score.forEach(player => {
                if (player.id !== user.id) { 
                    that.model.leaveMeeting(player.id); 
                }
            });
        }

        return user.currentMeetingId;
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
            currentGame: JSON.parse(data.currentGame),
            games: JSON.parse(data.games),
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
